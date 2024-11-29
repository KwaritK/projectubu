const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// เก็บข้อมูลห้องแชทและผู้ใช้ที่กำลังใช้งาน
const rooms = new Map();

// ตั้งค่า CORS
app.use(cors());

// จัดการการเชื่อมต่อ Socket.IO
io.on('connection', (socket) => {
  console.log('ผู้ใช้เชื่อมต่อแล้ว:', socket.id);
  let currentUser = null;
  let currentRoom = null;

  // จัดการการเข้าร่วมห้องแชท
  socket.on('joinRoom', async ({ username, email, roomID }, callback) => {
    try {
      currentUser = { id: socket.id, username, email };
      currentRoom = roomID;

      // สร้างห้องใหม่ถ้ายังไม่มี
      if (!rooms.has(roomID)) {
        rooms.set(roomID, new Map());
      }

      // เพิ่มผู้ใช้เข้าห้อง
      const roomUsers = rooms.get(roomID);
      roomUsers.set(socket.id, currentUser);

      // เข้าร่วมห้อง Socket.IO
      await socket.join(roomID);

      // แจ้งเตือนผู้ใช้อื่นในห้องว่ามีคนเข้ามาใหม่
      socket.to(roomID).emit('userJoined', currentUser);

      // ส่งรายการผู้ใช้ที่อัพเดทแล้วให้ทุกคนในห้อง
      const userList = Array.from(roomUsers.values());
      io.to(roomID).emit('updateUserList', userList);

      callback({ success: true });
      console.log(`${username} เข้าร่วมห้อง ${roomID}`);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเข้าร่วมห้อง:', error);
      callback({ success: false, message: 'ไม่สามารถเข้าร่วมห้องได้' });
    }
  });

  // จัดการข้อความแชท
  socket.on('message', ({ text, sender, roomID, time }) => {
    if (roomID && rooms.has(roomID)) {
      const messageData = {
        text,
        sender,
        time,
        roomID
      };
      io.to(roomID).emit('message', messageData);
    }
  });

  // จัดการการตัดการเชื่อมต่อ
  socket.on('disconnect', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      const roomUsers = rooms.get(currentRoom);
      
      // ลบผู้ใช้ออกจากห้อง
      roomUsers.delete(socket.id);

      // ถ้าห้องว่างให้ลบห้องทิ้ง
      if (roomUsers.size === 0) {
        rooms.delete(currentRoom);
      } else {
        // แจ้งเตือนผู้ใช้อื่นว่ามีคนออกจากห้อง
        if (currentUser) {
          socket.to(currentRoom).emit('userLeft', currentUser);

          // ส่งรายการผู้ใช้ที่อัพเดทแล้ว
          const userList = Array.from(roomUsers.values());
          io.to(currentRoom).emit('updateUserList', userList);
        }
      }
    }
    console.log('ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
  });

  // จัดการข้อผิดพลาด
  socket.on('error', (error) => {
    console.error('เกิดข้อผิดพลาดที่ Socket:', error);
  });
});

// Middleware จัดการข้อผิดพลาด
app.use((err, req, res, next) => {
  console.error('เกิดข้อผิดพลาดที่ Server:', err);
  res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

// เริ่มการทำงานของ Server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
});

module.exports = { app, httpServer, io };