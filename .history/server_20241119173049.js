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
    // เพิ่ม configuration สำหรับ Socket.IO
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  global.server = httpServer;
  global.io = io;
  
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // เพิ่มการจัดการ disconnect ที่ค้างอยู่
    if (socket.roomID) {
      handleDisconnect(socket);
    }

    socket.on('joinRoom', async ({ username, email, roomID }) => {
      console.log('Join attempt:', 'Username:', username, 'Email:', email, 'RoomID:', roomID);
      
      if (!username || !email || !roomID) {
        console.log('Invalid data received:', { username, email, roomID });
        socket.emit('joinRoomResponse', { success: false, message: 'Invalid data' });
        return;
      }

      // ตรวจสอบว่าผู้ใช้อยู่ในห้องอื่นหรือไม่
      if (socket.roomID) {
        await handleDisconnect(socket);
      }

      if (!rooms.has(roomID)) {
        rooms.set(roomID, new Map());
      }

      const roomUsers = rooms.get(roomID);
      
      // ตรวจสอบว่ามีชื่อซ้ำในห้องหรือไม่
      const existingUser = Array.from(roomUsers.values()).find(user => 
        user.email === email || roomUsers.has(username)
      );

      if (existingUser) {
        socket.emit('joinRoomResponse', { 
          success: false, 
          message: 'Username or email already exists in this room' 
        });
        return;
      }

      // เข้าร่วมห้อง
      socket.username = username;
      socket.email = email;
      socket.roomID = roomID;
      socket.join(roomID);

      roomUsers.set(username, { 
        email, 
        socketId: socket.id,
        joinedAt: new Date()
      });

      const userCount = roomUsers.size;

      // แจ้งเตือนผู้ใช้อื่นในห้อง
      io.to(roomID).emit('userJoined', { 
        username,
        userCount,
        timestamp: new Date()
      });
      
      io.to(roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({
        username: name,
        email: data.email,
        joinedAt: data.joinedAt
      })));
      
      socket.emit('joinRoomResponse', { success: true });

      // ยกเลิก timer ถ้ามีอยู่
      if (roomTimers[roomID]) {
        clearTimeout(roomTimers[roomID]);
        delete roomTimers[roomID];
      }
      
      try {
        await Room.findOneAndUpdate(
          { roomID },
          { 
            userCount,
            lastActivity: new Date()
          },
          { new: true, upsert: true }
        );
      } catch (error) {
        console.error('Error updating room:', error);
      }

      console.log(`User ${username} joined room ${roomID}. Current user count: ${userCount}`);
    });

    socket.on('message', (msg) => {
      if (socket.roomID && socket.username) {
        io.to(socket.roomID).emit('message', {
          ...msg,
          username: socket.username,
          timestamp: new Date()
        });
      }
    });

    socket.on('disconnect', () => handleDisconnect(socket));
  });

  // แยกฟังก์ชัน handleDisconnect ออกมา
  async function handleDisconnect(socket) {
    if (!socket.roomID) return;

    const roomUsers = rooms.get(socket.roomID);
    if (!roomUsers) return;

    const disconnectedUser = Array.from(roomUsers.entries())
      .find(([_, data]) => data.socketId === socket.id);

    if (disconnectedUser) {
      const [username, _] = disconnectedUser;
      roomUsers.delete(username);
      
      const userCount = roomUsers.size;
      console.log(`User ${username} disconnected from room ${socket.roomID}. Current user count: ${userCount}`);

      io.to(socket.roomID).emit('userLeft', { 
        username,
        userCount,
        timestamp: new Date()
      });

      io.to(socket.roomID).emit('updateUserList', 
        Array.from(roomUsers, ([name, data]) => ({
          username: name,
          email: data.email,
          joinedAt: data.joinedAt
        }))
      );

      try {
        await Room.findOneAndUpdate(
          { roomID: socket.roomID },
          { 
            userCount,
            lastActivity: new Date()
          },
          { new: true }
        );

        if (userCount === 0) {
          if (roomTimers[socket.roomID]) {
            clearTimeout(roomTimers[socket.roomID]);
          }
          
          roomTimers[socket.roomID] = setTimeout(async () => {
            try {
              const currentRoomUsers = rooms.get(socket.roomID);
              if (!currentRoomUsers || currentRoomUsers.size === 0) {
                await Room.deleteOne({ roomID: socket.roomID });
                rooms.delete(socket.roomID);
                delete roomTimers[socket.roomID];
                console.log(`Room ${socket.roomID} deleted after inactivity timeout`);
              }
            } catch (err) {
              console.error(`Failed to remove room ${socket.roomID}:`, err);
            }
          }, 50000);
        }
      } catch (error) {
        console.error('Error updating room:', error);
      }
    }

    // Clear socket data
    socket.username = null;
    socket.email = null;
    socket.roomID = null;
  }

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

  cron.schedule('* * * * *', async () => {
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