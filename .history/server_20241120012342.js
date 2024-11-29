const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./models/room');
const cron = require('node-cron');
const User = require('./models/user');

const roomTimers = {};
const rooms = new Map();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // ปรับตามความเหมาะสม
      methods: ["GET", "POST"]
    }
  });

  global.server = httpServer;
  global.io = io;
  
  io.use((socket, next) => {
    // Middleware สำหรับตรวจสอบข้อมูล
    const username = socket.handshake.auth.username;
    const email = socket.handshake.auth.email;
    const roomID = socket.handshake.auth.roomID;

    if (!username || !email || !roomID) {
      return next(new Error('ข้อมูลไม่ครบถ้วน'));
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('joinRoom', async ({ username, email, roomID }) => {
      try {
        if (!rooms.has(roomID)) {
          rooms.set(roomID, new Map());
        }

        const roomUsers = rooms.get(roomID);
        
        // เช็คชื่อผู้ใช้ซ้ำ
        for (let [existingUsername, userData] of roomUsers) {
          if (existingUsername === username) {
            socket.emit('joinRoomResponse', { 
              success: false, 
              message: 'มีชื่อผู้ใช้นี้ในห้องแล้ว' 
            });
            return;
          }
        }

        // จัดการการเข้าห้อง
        socket.username = username;
        socket.email = email;
        socket.roomID = roomID;
        socket.join(roomID);

        roomUsers.set(username, { email, socketId: socket.id });
        const userCount = roomUsers.size;

        // Broadcast events
        io.to(roomID).emit('userJoined', { username });
        io.to(roomID).emit('updateUserList', 
          Array.from(roomUsers, ([name, data]) => ({ 
            username: name, 
            email: data.email 
          }))
        );

        socket.emit('joinRoomResponse', { success: true });

        // จัดการ room timer
        if (roomTimers[roomID]) {
          clearTimeout(roomTimers[roomID]);
        }
        
        // อัปเดตข้อมูล Room ใน Database
        await Room.findOneAndUpdate(
          { roomID },
          { userCount },
          { new: true, upsert: true }
        );

        console.log(`User ${username} joined room ${roomID}. Users: ${userCount}`);
      } catch (error) {
        console.error('Error in joinRoom:', error);
        socket.emit('joinRoomResponse', { 
          success: false, 
          message: 'เกิดข้อผิดพลาดในการเข้าห้อง' 
        });
      }
    });

    socket.on('disconnect', async () => {
      const roomID = socket.roomID;
      if (!roomID) return;

      const roomUsers = rooms.get(roomID);
      if (!roomUsers) return;

      const disconnectedUser = Array.from(roomUsers.entries())
        .find(([_, data]) => data.socketId === socket.id);

      if (disconnectedUser) {
        const [username] = disconnectedUser;
        roomUsers.delete(username);
        
        const userCount = roomUsers.size;

        // Broadcast events
        io.to(roomID).emit('userLeft', { username });
        io.to(roomID).emit('updateUserList', 
          Array.from(roomUsers, ([name, data]) => ({ 
            username: name, 
            email: data.email 
          }))
        );

        // อัปเดต Room
        await Room.findOneAndUpdate(
          { roomID },
          { userCount },
          { new: true }
        );

        // จัดการ Room Timer
        if (userCount === 0) {
          if (roomTimers[roomID]) {
            clearTimeout(roomTimers[roomID]);
          }
          roomTimers[roomID] = setTimeout(async () => {
            try {
              const currentRoomUsers = rooms.get(roomID);
              if (!currentRoomUsers || currentRoomUsers.size === 0) {
                await Room.deleteOne({ roomID });
                rooms.delete(roomID);
                delete roomTimers[roomID];
                console.log(`Room ${roomID} deleted after inactivity`);
              }
            } catch (err) {
              console.error(`Failed to remove room ${roomID}:`, err);
            }
          }, 300000); // 5 นาที
        }

        console.log(`User ${username} disconnected from room ${roomID}`);
      }
    });
  });
  const unbanExpiredUsers = async () => {
    try {
      const now = new Date();
      const result = await User.updateMany(
        { isBanned: true, banEnd: { $lte: now } },
        { 
          $set: { isBanned: false },
          $unset: { banEnd: "" }
        }
      );
      console.log(`Unbanned ${result.modifiedCount} users with expired bans.`);
    } catch (error) {
      console.error("Error unbanning expired users:", error);
    }
  };

  // Run the unban job every miniute
  cron.schedule('* * * * *', async () => {
    console.log('Running unbanExpiredUsers job...');
    await unbanExpiredUsers();
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
});