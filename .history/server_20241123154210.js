const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// เก็บข้อมูลห้องและผู้ใช้
const rooms = {};

// ฟังก์ชันจัดการการเพิ่มผู้ใช้ในห้อง
const addUserToRoom = (roomID, user) => {
  if (!rooms[roomID]) {
    rooms[roomID] = { users: [] };
  }
  rooms[roomID].users.push(user);
  return rooms[roomID].users;
};

// ฟังก์ชันจัดการการลบผู้ใช้ออกจากห้อง
const removeUserFromRoom = (roomID, email) => {
  if (!rooms[roomID]) return [];
  rooms[roomID].users = rooms[roomID].users.filter(user => user.email !== email);
  if (rooms[roomID].users.length === 0) {
    delete rooms[roomID]; // ลบห้องถ้าไม่มีผู้ใช้เหลือ
  }
  return rooms[roomID]?.users || [];
};

// ตั้งค่า Socket.IO
io.on('connection', (socket) => {
  console.log('ผู้ใช้เชื่อมต่อ:', socket.id);

  socket.on('joinRoom', ({ username, email, roomID }, callback) => {
    if (!username || !email || !roomID) {
      return callback({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
    }

    // เพิ่มผู้ใช้ในห้อง
    const users = addUserToRoom(roomID, { username, email });
    socket.join(roomID);

    // อัพเดตผู้ใช้ในห้อง
    io.to(roomID).emit('updateUserList', users);
    socket.to(roomID).emit('userJoined', { username });

    console.log(`${username} เข้าร่วมห้อง ${roomID}`);
    callback({ success: true });
  });

  socket.on('message', ({ text, sender, roomID, time }) => {
    if (text && sender && roomID) {
      io.to(roomID).emit('message', { text, sender, time });
      console.log(`ข้อความจาก ${sender} ในห้อง ${roomID}: ${text}`);
    }
  });

  socket.on('disconnecting', () => {
    const roomIDs = Array.from(socket.rooms).filter(room => room !== socket.id);
    roomIDs.forEach(roomID => {
      const user = rooms[roomID]?.users.find(user => user.email === socket.id);
      if (user) {
        // ลบผู้ใช้จากห้อง
        const updatedUsers = removeUserFromRoom(roomID, user.email);

        // แจ้งผู้ใช้ในห้อง
        io.to(roomID).emit('userLeft', { username: user.username });
        io.to(roomID).emit('updateUserList', updatedUsers);

        console.log(`${user.username} ออกจากห้อง ${roomID}`);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
  });
});

// ตั้งค่าเซิร์ฟเวอร์
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`เซิร์ฟเวอร์กำลังทำงานที่พอร์ต ${PORT}`);
});
