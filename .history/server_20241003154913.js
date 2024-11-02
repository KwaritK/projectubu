const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./src/models/room');


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
    
    socket.on('findOrCreateRoom', async ({ roomType, ageGroup }, callback) => {
      try {
        // ดึงห้องที่ตรงเงื่อนไข
        let room = await Room.findOne({ roomType, ageGroup });
        
        // กำหนดจำนวนสูงสุดสำหรับแต่ละประเภทห้อง
        const maxUsers = roomType === 'one-on-one' ? 2 : 5;
  
        if (room && room.users && room.users.length < maxUsers) {
          // ห้องมีพื้นที่ว่างให้ผู้ใช้เข้าร่วม
          socket.join(room.roomID);
          room.users.push(socket.username);
          await room.save();
          callback({ success: true, roomID: room.roomID });
          io.to(room.roomID).emit('userJoined', { username: socket.username });
        } else {
          // สร้างห้องใหม่เมื่อห้องเต็มหรือไม่มีห้องที่ตรงเงื่อนไข
          const newRoomID = generateUniqueRoomID(); // ฟังก์ชันสร้าง roomID ใหม่
          const newRoom = new Room({
            roomType,
            ageGroup,
            roomID: newRoomID,
            users: [socket.username]
          });
          await newRoom.save();
          socket.join(newRoomID);
          callback({ success: true, roomID: newRoomID });
          io.to(newRoomID).emit('userJoined', { username: socket.username });
        }
  
        // อัพเดทข้อมูลผู้ใช้ในห้องแชท
        io.emit('updateUserList', { roomID: room ? room.roomID : newRoomID, users: room ? room.users : newRoom.users });
  
      } catch (error) {
        callback({ success: false, message: 'เกิดข้อผิดพลาดในการค้นหาหรือสร้างห้อง' });
      }
    });
  
    // ฟังก์ชันช่วยสร้าง roomID แบบสุ่ม
    // สร้าง roomID แบบสุ่ม
      function generateRoomID(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }
      

    socket.on('setUsername', (username, callback) => {
      if (users.has(username)) {
        callback({ success: false, message: 'Username already taken' });
      } else {
        socket.username = username;
        users.add(username);
        callback({ success: true });
        io.emit('userJoined', { username });
        io.emit('updateUserList', Array.from(users));
      }
    });

    socket.on('message', (msg) => {
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      if (socket.username) {
        users.delete(socket.username);
        io.emit('userLeft', { username: socket.username });
        io.emit('updateUserList', Array.from(users));
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