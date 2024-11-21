const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

// เก็บตัวจับเวลาของห้อง
const roomTimers = {};

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  const users = new Set();


  io.on('connection', (socket) => {
    console.log('New  connected');


    ssocket.on('setUsername', (username, roomID, callback) => {
  if (users.has(username)) {
    callback({ success: false, message: 'Username already taken' });
  } else {
    socket.username = username;
    socket.join(roomID);  // เข้าร่วมห้อง
    users.add(username);
    
    // อัปเดตจำนวนผู้ใช้แบบเรียลไทม์
    const userCount = io.sockets.adapter.rooms.get(roomID)?.size || 0;
    io.to(roomID).emit('userJoined', { username });
    io.emit('updateUserList', Array.from(users));
    
    callback({ success: true });
    
    // ยกเลิกการจับเวลาลบห้อง
    if (roomTimers[roomID]) {
      clearTimeout(roomTimers[roomID]);
      delete roomTimers[roomID];
    }
  }
});

socket.on('disconnect', async () => {
  console.log(`User ${socket.username} disconnected`);
  const roomID = [...socket.rooms][1];  // ดึง room ID ของผู้ใช้ที่ออก
  if (socket.username) {
    users.delete(socket.username);
    io.emit('userLeft', { username: socket.username });
    io.emit('updateUserList', Array.from(users));

    // อัปเดตจำนวนผู้ใช้ในห้องหลังจากออก
    const userCount = io.sockets.adapter.rooms.get(roomID)?.size || 0;

    if (userCount === 0) {
      // ตั้งตัวจับเวลาเพื่อลบห้องหลังจาก 50 วินาที
      roomTimers[roomID] = setTimeout(async () => {
        try {
          await Room.deleteOne({ roomID });
          console.log(`Room ${roomID} deleted.`);
        } catch (err) {
          console.error(`Failed to delete room ${roomID}:`, err);
        }
      }, 50000);
    }
  },
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