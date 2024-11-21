const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const mongoose = require('mongoose');
const Room = require('./models/room'); // นำเข้า Schema ของห้องจาก MongoDB

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  const users = new Set();

  // เชื่อมต่อกับ MongoDB
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // เมื่อผู้ใช้ตั้ง username
    socket.on('setUsername', async (username, roomID, callback) => {
      if (users.has(username)) {
        callback({ success: false, message: 'Username already taken' });
      } else {
        socket.username = username;
        users.add(username);
    
        // ตรวจสอบห้องใน MongoDB
        let room = await Room.findOne({ roomID });
    
        if (room) {
          // ตรวจสอบว่าห้องเต็มหรือยัง
          if (room.usersCount < room.maxUsers) {
            socket.join(room.roomID);
            room.usersCount += 1;
            await room.save();
          } else {
            // ห้องเต็ม ให้สร้างห้องใหม่
            const newRoomID = roomID + '-' + generateRoomID(5); // สร้าง Room ID ใหม่
            const newRoom = new Room({
              roomType: room.roomType,
              roomID: newRoomID,
              usersCount: 1,
              maxUsers: room.maxUsers,
            });
            await newRoom.save();
            socket.join(newRoom.roomID);
            io.emit('newRoomCreated', { roomID: newRoom.roomID });
          }
        } else {
          // สร้างห้องใหม่ถ้าไม่มีห้องที่ต้องการ
          const maxUsers = roomID === 'one-on-one' ? 2 : 5;
          const newRoom = new Room({
            roomType: roomID === 'one-on-one' ? 'one-on-one' : 'multi',
            roomID,
            usersCount: 1,
            maxUsers,
          });
          await newRoom.save();
          socket.join(newRoom.roomID);
        }
    
        callback({ success: true });
        io.emit('userJoined', { username, roomID });
        io.emit('updateUserList', Array.from(users));
      }
    });

    // รับข้อความจากผู้ใช้และส่งให้ทุกคนในห้อง
    socket.on('message', (msg) => {
      io.emit('message', msg);
    });

    // เมื่อผู้ใช้ disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected');
      if (socket.username) {
        users.delete(socket.username);
        io.emit('userLeft', { username: socket.username });
        io.emit('updateUserList', Array.from(users));

        // ตรวจสอบห้องที่ผู้ใช้เคยเข้าร่วม
        const rooms = Array.from(socket.rooms);
        const roomID = rooms[1]; // ห้องที่ผู้ใช้เข้าร่วม

        if (roomID) {
          let room = await Room.findOne({ roomID });

          if (room) {
            room.usersCount -= 1;
            if (room.usersCount <= 0) {
              await Room.deleteOne({ roomID }); // ลบห้องเมื่อไม่มีผู้ใช้อยู่
            } else {
              await room.save();
            }
          }
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
