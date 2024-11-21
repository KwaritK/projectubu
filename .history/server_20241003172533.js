const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  // จัดการผู้ใช้และห้อง
  const rooms = {}; // { roomID: { users: Set(), maxCapacity: number } }

  io.on('connection', (socket) => {
    console.log('New user connected');

    // สร้าง/เข้าร่วมห้อง
    socket.on('joinRoom', ({ roomID, username, roomType }, callback) => {
      if (!roomID || !username || !roomType) {
        callback({ success: false, message: 'Invalid roomID, username or roomType' });
        return;
      }

      if (!rooms[roomID]) {
        const maxCapacity = roomType === 'one-on-one' ? 2 : 5;
        rooms[roomID] = { users: new Set(), maxCapacity };
      }

      const room = rooms[roomID];

      if (room.users.size >= room.maxCapacity) {
        callback({ success: false, message: 'Room is full' });
        return;
      }

      if (room.users.has(username)) {
        callback({ success: false, message: 'Username already taken in this room' });
        return;
      }

      socket.username = username;
      socket.roomID = roomID;
      room.users.add(username);

      socket.join(roomID);
      io.to(roomID).emit('userJoined', { username });
      io.to(roomID).emit('updateUserList', Array.from(room.users));

      callback({ success: true, roomID });
    });

    // ส่งข้อความ
    socket.on('message', (msg) => {
      const roomID = socket.roomID;
      if (roomID) {
        console.log(`Message from ${socket.username} in room ${roomID}:`, msg); // Logging ช่วยในการ debug
        io.to(roomID).emit('message', { sender: socket.username, text: msg });
      }
    });

    // เมื่อผู้ใช้ disconnect
    socket.on('disconnect', () => {
      const { username, roomID } = socket;

      if (roomID && rooms[roomID] && rooms[roomID].users.has(username)) {
        rooms[roomID].users.delete(username);
        
        if (rooms[roomID].users.size === 0) {
          delete rooms[roomID]; // ลบห้องที่ไม่มีผู้ใช้เหลืออยู่
        } else {
          io.to(roomID).emit('userLeft', { username });
          io.to(roomID).emit('updateUserList', Array.from(rooms[roomID].users));
        }
      }

      console.log('Client disconnected');
    });
  });

  server.all('*', (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
