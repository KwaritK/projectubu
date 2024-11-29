const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./models/room');
const User = require('./models/user');
const cron = require('node-cron');

// เก็บข้อมูลห้องและตัวจับเวลา
const roomTimers = {};
const rooms = new Map();

// ตั้งค่า Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// ฟังก์ชันสำหรับบันทึก log
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}:`, error);
  }
};

// ฟังก์ชันสำหรับอัพเดทข้อมูลห้อง
async function updateRoomInDB(roomID, userCount) {
  try {
    await Room.findOneAndUpdate(
      { roomID },
      { userCount },
      { new: true, upsert: true }
    );
    logger.info(`Updated room ${roomID} with user count: ${userCount}`);
  } catch (error) {
    logger.error('Failed to update room in database', error);
  }
}

// ฟังก์ชันสำหรับลบห้องที่ไม่มีการใช้งาน
async function cleanupInactiveRoom(roomID) {
  try {
    const currentRoomUsers = rooms.get(roomID);
    if (!currentRoomUsers || currentRoomUsers.size === 0) {
      await Room.deleteOne({ roomID });
      rooms.delete(roomID);
      delete roomTimers[roomID];
      logger.info(`Room ${roomID} deleted due to inactivity`);
    }
  } catch (error) {
    logger.error(`Failed to cleanup room ${roomID}`, error);
  }
}

// ฟังก์ชันสำหรับปลดแบนผู้ใช้ที่ครบกำหนด
async function unbanExpiredUsers() {
  try {
    const now = new Date();
    const result = await User.updateMany(
      { isBanned: true, banEnd: { $lte: now } },
      { 
        $set: { isBanned: false },
        $unset: { banEnd: "" }
      }
    );
    logger.info(`Unbanned ${result.modifiedCount} users`);
  } catch (error) {
    logger.error('Failed to unban users', error);
  }
}

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000, // เพิ่มเวลา timeout
    maxHttpBufferSize: 1e6 // 1 MB
  });

  // ทำให้เข้าถึงได้แบบ global
  global.server = httpServer;
  global.io = io;

  io.on('connection', (socket) => {
    logger.info('New connection established', { socketId: socket.id });
    let currentUser = null;
    let currentRoom = null;

    // จัดการการเข้าร่วมห้องแชท
    socket.on('joinRoom', async ({ username, email, roomID }, ) => {
      try {
        // ตรวจสอบข้อมูลที่จำเป็น
        if (!username || !email || !roomID) {
          throw new Error('Missing required data');
        }

        // ตรวจสอบการแบน
        const user = await User.findOne({ email });
        if (user?.isBanned) {
          const banTimeLeft = user.banEnd ? new Date(user.banEnd) - new Date() : 0;
          throw new Error(`User is banned. ${banTimeLeft > 0 ? `Time left: ${Math.ceil(banTimeLeft / 1000 / 60)} minutes` : ''}`);
        }

        // สร้างห้องใหม่ถ้ายังไม่มี
        if (!rooms.has(roomID)) {
          rooms.set(roomID, new Map());
        }

        const roomUsers = rooms.get(roomID);

        // ตรวจสอบชื่อซ้ำ
        if (roomUsers.has(username)) {
          throw new Error('Username already taken');
        }

        // บันทึกข้อมูลผู้ใช้
        currentUser = { username, email };
        currentRoom = roomID;
        socket.username = username;
        socket.email = email;
        socket.roomID = roomID;
        
        // เข้าร่วมห้อง
        await socket.join(roomID);
        roomUsers.set(username, { email, socketId: socket.id });

        // อัพเดทและแจ้งเตือนผู้ใช้อื่น
        const userList = Array.from(roomUsers, ([name, data]) => ({ 
          username: name, 
          email: data.email 
        }));

        io.to(roomID).emit('userJoined', { username });
        io.to(roomID).emit('updateUserList', userList);
        
        // ยกเลิกตัวจับเวลาลบห้อง
        if (roomTimers[roomID]) {
          clearTimeout(roomTimers[roomID]);
          delete roomTimers[roomID];
        }

        // อัพเดทฐานข้อมูล
        await updateRoomInDB(roomID, roomUsers.size);
        
        callback({ success: true });
        logger.info(`User joined room`, { username, roomID, userCount: roomUsers.size });

      } catch (error) {
        logger.error('Join room failed', error);
        callback({ success: false, message: error.message });
      }
    });

    // จัดการข้อความ
    socket.on('message', (msg) => {
      if (!socket.roomID) return;
      
      const messageData = {
        ...msg,
        timestamp: new Date().toISOString()
      };
      
      io.to(socket.roomID).emit('message', messageData);
      logger.info('Message sent', { roomID: socket.roomID, sender: socket.username });
    });

    // จัดการการตัดการเชื่อมต่อ
    socket.on('disconnect', async () => {
      try {
        if (!socket.roomID) return;

        const roomUsers = rooms.get(socket.roomID);
        if (!roomUsers) return;

        // หาและลบผู้ใช้ที่ตัดการเชื่อมต่อ
        const disconnectedUser = Array.from(roomUsers.entries())
          .find(([_, data]) => data.socketId === socket.id);

        if (disconnectedUser) {
          const [username, _] = disconnectedUser;
          roomUsers.delete(username);

          // แจ้งเตือนผู้ใช้อื่น
          io.to(socket.roomID).emit('userLeft', { username });
          io.to(socket.roomID).emit('updateUserList', 
            Array.from(roomUsers, ([name, data]) => ({ 
              username: name, 
              email: data.email 
            }))
          );

          // อัพเดทฐานข้อมูล
          await updateRoomInDB(socket.roomID, roomUsers.size);

          // ตั้งเวลาลบห้องถ้าไม่มีผู้ใช้
          if (roomUsers.size === 0) {
            roomTimers[socket.roomID] = setTimeout(
              () => cleanupInactiveRoom(socket.roomID),
              300000 // 5 นาที
            );
          }

          logger.info('User disconnected', { 
            username,
            roomID: socket.roomID,
            remainingUsers: roomUsers.size
          });
        }
      } catch (error) {
        logger.error('Disconnect handling failed', error);
      }
    });
  });

  // ตั้งเวลาปลดแบนอัตโนมัติ
  cron.schedule('*/5 * * * *', unbanExpiredUsers);

  // จัดการ routes ที่เหลือด้วย Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // เริ่มการทำงานของ server
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) {
      logger.error('Server startup failed', err);
      throw err;
    }
    logger.info(`Server running on http://localhost:${PORT}`);
  });
});