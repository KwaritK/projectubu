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

    socket.on('setUsername', async ({ username, roomID }, callback) => {
      console.log('Username:', username, 'RoomID:', roomID);  // เพิ่มเพื่อ debug
      try {
        const room = await Room.findOne({ roomID: roomID });
        if (!room) {
          return callback({ success: false, message: 'Room not found' });
        }
        if (room.userCount >= room.maxUsers) {
          return callback({ success: false, message: 'Room is full' });
        }

        if (users.has(username)) {
          return callback({ success: false, message: 'Username already taken' });
        }

        socket.username = username;
        socket.roomID = roomID;
        socket.join(roomID); //เข้าร่วมห้อง

        if (!users.has(roomID)) {
          users.set(roomID, new Set());
        }
        users.get(roomID).add(username);

        const updatedRoom = await Room.findOneAndUpdate(
          { roomID: roomID },
          { $inc: { userCount: 1 } },
          { new: true }
        );

        // อัปเดตจำนวนผู้ใช้แบบเรียลไทม์
        io.to(roomID).emit('userJoined', { username });
        io.to(roomID).emit('updateUserList', Array.from(users.get(roomID)));
        io.to(roomID).emit('updateUserCount', updatedRoom.userCount);
        callback({ success: true });

        // ยกเลิกตัวจับเวลาหากมีผู้ใช้เข้าร่วมห้อง
        if (roomTimers[roomID]) {
          clearTimeout(roomTimers[roomID]);
          delete roomTimers[roomID];
        }
      } catch (error) {
        console.error('Error in setUsername:', error);
        callback({ success: false, message: 'An error occurred' });
      }
    });

    socket.on('message', (msg) => {
      if (socket.roomID) {
        io.to(socket.roomID).emit('message', msg);  // ส่งข้อความไปยังผู้ใช้ในห้องนั้นๆ
      }
    });

    socket.on('disconnect', async () => {
      if (socket.username && socket.roomID) {
        console.log(`User ${socket.username} disconnected from room ${socket.roomID}`);
        
        try {
          const roomUsers = users.get(socket.roomID);
          if (roomUsers) {
            roomUsers.delete(socket.username);
            if (roomUsers.size === 0) {
              users.delete(socket.roomID);
            }
          }

          const updatedRoom = await Room.findOneAndUpdate(
            { roomID: socket.roomID },
            { $inc: { userCount: -1 } },
            { new: true }
          );

          io.to(socket.roomID).emit('userLeft', { username: socket.username });
          io.to(socket.roomID).emit('updateUserList', Array.from(users.get(socket.roomID) || []));
          io.to(socket.roomID).emit('updateUserCount', updatedRoom.userCount);

          if (updatedRoom.userCount === 0) {
            // ตั้งค่าตัวจับเวลา 50 วินาที หากไม่มีผู้ใช้อยู่ในห้อง
            roomTimers[socket.roomID] = setTimeout(async () => {
              try {
                await Room.deleteOne({ roomID: socket.roomID });  // ลบห้องออกจากฐานข้อมูล
                delete roomTimers[socket.roomID];  // ลบตัวจับเวลาออกเมื่อห้องถูกลบ
                console.log(`Room ${socket.roomID} deleted after 50 seconds of inactivity.`);
              } catch (err) {
                console.error(`Failed to remove room ${socket.roomID}:`, err);
              }
            }, 50000); // ตั้งเวลาลบห้องเมื่อไม่มีผู้ใช้ใน 50 วินาที
          }
        } catch (error) {
          console.error('Error in disconnect:', error);
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