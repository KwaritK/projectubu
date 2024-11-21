const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./models/room');

// เก็บตัวจับเวลาของห้อง
const roomTimers = {};
const users = new Map(); // ควรมีตัวเก็บชื่อผู้ใช้ทั้งหมด เปลี่ยนจาก Set เป็น Map เพื่อเก็บข้อมูลผู้ใช้แยกตามห้อง

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {  // เพิ่มการประกาศ socket
    console.log('New connection');

    socket.on('setUsername', ({ username, roomID }, callback) => {
      console.log('Username:', username, 'RoomID:', roomID);  // เพิ่มเพื่อ debug
      if (users.has(username)) {
        callback({ success: false, message: 'Username already taken' });
      } else {
        socket.username = username;
        socket.join(roomID);  // เข้าร่วมห้อง
        users.add(username);

        // อัปเดตจำนวนผู้ใช้แบบเรียลไทม์
        const userCount = io.sockets.adapter.rooms.get(roomID)?.size || 0;
        io.to(roomID).emit('userJoined', { username });
        io.to(roomID).emit('updateUserList', Array.from(users));
        callback({ success: true });

        // ยกเลิกตัวจับเวลาหากมีผู้ใช้เข้าร่วมห้อง
        if (roomTimers[roomID]) {
          clearTimeout(roomTimers[roomID]);
          delete roomTimers[roomID];
        }
      }
    });

    socket.on('message', (msg) => {
      const roomID = [...socket.rooms][1];  // ดึง roomID ของผู้ใช้
      io.to(roomID).emit('message', msg);  // ส่งข้อความไปยังผู้ใช้ในห้องนั้นๆ
    });

    socket.on('disconnect', async () => {
      const roomID = [...socket.rooms][1];  // ดึง roomID ของผู้ใช้ที่ออก
      console.log(`User ${socket.username} disconnected`);
      if (socket.username) {
        users.delete(socket.username);
        io.emit('userLeft', { username: socket.username });
        io.emit('updateUserList', Array.from(users));

        // อัปเดตจำนวนผู้ใช้ในห้องหลังจากออก
        const userCount = io.sockets.adapter.rooms.get(roomID)?.size || 0;
        console.log(`User ${socket.username} disconnected from room ${roomID}`);
        console.log(`User count in room ${roomID}: ${userCount}`);

        if (userCount === 0) {
          // ตั้งค่าตัวจับเวลา 50 วินาที หากไม่มีผู้ใช้อยู่ในห้อง
          roomTimers[roomID] = setTimeout(async () => {
            try {
              await Room.deleteOne({ roomID });  // ลบห้องออกจากฐานข้อมูล
              delete roomTimers[roomID];  // ลบตัวจับเวลาออกเมื่อห้องถูกลบ
              console.log(`Room ${roomID} deleted after 5 minutes of inactivity.`);
            } catch (err) {
              console.error(`Failed to remove room ${roomID}:`, err);
            }
          }, 50000); // ตั้งเวลาลบห้องเมื่อไม่มีผู้ใช้ใน 50 วินาที
        }
      }
    });
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
