const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const mongoose = require('mongoose'); // ใช้สำหรับเชื่อมต่อ MongoDB
const Room = require('./models/room'); // นำเข้า Schema ห้องของคุณ

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// เชื่อมต่อ MongoDB
const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('New user connected');

    // ฟัง event เมื่อผู้ใช้พยายามเข้าร่วมห้อง
    socket.on('joinRoom', async ({ roomID, username }, callback) => {
      try {
        // เชื่อมต่อ MongoDB
        await connectMongoDB();

        // ดึงข้อมูลห้องจาก MongoDB
        const room = await Room.findOne({ roomID });

        if (!room) {
          callback({ success: false, message: 'Room does not exist' });
          return;
        }

        // เช็คจำนวนผู้ใช้ในห้องปัจจุบัน
        const userCount = io.sockets.adapter.rooms.get(roomID)?.size || 0;

        // ถ้าห้องเต็มไม่ให้เข้าร่วม
        if (userCount >= room.maxUsers) {
          callback({ success: false, message: 'Room is full' });
          return;
        }

        // ถ้าผู้ใช้ชื่อเดียวกันอยู่ในห้องแล้ว
        const usersInRoom = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        const isUsernameTaken = usersInRoom.some((id) => io.sockets.sockets.get(id).username === username);

        if (isUsernameTaken) {
          callback({ success: false, message: 'Username already taken in this room' });
          return;
        }

        // ให้ผู้ใช้เข้าร่วมห้อง
        socket.username = username;
        socket.join(roomID);

        io.to(roomID).emit('userJoined', { username });
        io.to(roomID).emit('updateUserList', Array.from(io.sockets.adapter.rooms.get(roomID)));

        callback({ success: true, roomID });
      } catch (error) {
        console.error('Error joining room:', error);
        callback({ success: false, message: 'Internal server error' });
      }
    });

    // ฟัง event เมื่อผู้ใช้ส่งข้อความ
    socket.on('message', (msg) => {
      const roomID = socket.rooms; // ดึงห้องปัจจุบันของผู้ใช้
      io.to(roomID).emit('message', msg);
    });

    // ฟัง event เมื่อผู้ใช้ disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected');
      const roomID = socket.rooms;
      if (roomID) {
        io.to(roomID).emit('userLeft', { username: socket.username });
        io.to(roomID).emit('updateUserList', Array.from(io.sockets.adapter.rooms.get(roomID) || []));
      }
    });
  });

  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
