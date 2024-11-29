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
  const io = new Server(httpServer ,{
    pingTimeout: 30000, // เพิ่มเวลา timeout
    pingInterval: 10000, // ตรวจสอบการเชื่อมต่อบ่อยขึ้น
  });

  global.server = httpServer; // ทำให้ server ใช้งานได้แบบ global
  global.io = io;  // ทำให้ io สามารถเรียกใช้ได้จากที่อื่น
  
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    

    socket.on('joinRoom', async ({ username, email, roomID }) => {
      console.log('Received:', 'Username:', username, 'Email:', email, 'RoomID:', roomID);
      
      if (!username || !email || !roomID) {
        console.log('Invalid data received:', { username, email, roomID });
        socket.emit('joinRoomResponse', { success: false, message: 'Invalid data' });
        return;
      }

      if (!rooms.has(roomID)) {
        rooms.set(roomID, new Map());
      }

      const roomUsers = rooms.get(roomID);
      
      // ลบ socket เก่าที่ค้างใน Map (ในกรณี reconnect)
      for (const [user, data] of roomUsers.entries()) {
        if (data.socketId === socket.id) {
          roomUsers.delete(user);
        }
      }

      // ตรวจสอบว่า username ซ้ำหรือไม่
      if (roomUsers.has(username)) {
        socket.emit('joinRoomResponse', { success: false, message: 'Username already taken' });
      } else {
        
        socket.roomID = roomID;
        socket.join(roomID);

        roomUsers.set(username, { email, socketId: socket.id });

        const userCount = roomUsers.size;

        io.to(roomID).emit('userJoined', { username });
        io.to(roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({ username: name, email: data.email })));
        socket.emit('joinRoomResponse', { success: true });

        if (roomTimers[roomID]) {
          clearTimeout(roomTimers[roomID]);
          delete roomTimers[roomID];
        }
        
        try {
          await Room.findOneAndUpdate(
            { roomID },
            { userCount },
            { new: true, upsert: true }
          );
        } catch (error) {
          console.error('Error updating room:', error);
        }

        console.log(`User ${username} joined room ${roomID}. Current user count: ${userCount}`);
      }
    });

    
    socket.on('leaveRoom', () => {
      if (socket.roomID) {
        const roomUsers = rooms.get(socket.roomID);
        if (roomUsers) {
          roomUsers.delete(socket.username);
          console.log(`User ${socket.username} manually left room ${socket.roomID}`);
          io.to(socket.roomID).emit('updateUserList', Array.from(roomUsers.keys()));
        }
        socket.leave(socket.roomID);
      }
    });

    socket.on('message', (msg) => {
      if (socket.roomID) {
        io.to(socket.roomID).emit('message', msg);
      }
    });


    socket.on('disconnect', async (reason) => {
      console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);

      if (socket.roomID) {
        const roomUsers = rooms.get(socket.roomID);
        if (roomUsers) {
          const disconnectedUser = Array.from(roomUsers.entries()).find(([_, data]) => data.socketId === socket.id);
          if (disconnectedUser) {
            const [username, _] = disconnectedUser;
            
             // ลบผู้ใช้จาก roomUsers
            roomUsers.delete(username);
            console.log(`User ${username} disconnected from room ${socket.roomID}.`);
            
            // อัปเดตจำนวนผู้ใช้ในฐานข้อมูล
        const userCount = roomUsers.size;
        try {
          await Room.findOneAndUpdate(
            { roomID: socket.roomID },
            { userCount },
            { new: true }
          );
        } catch (error) {
          console.error('Error updating room:', error);
        }
            
             // ส่งข้อมูลที่อัปเดตให้ client
            
            io.to(socket.roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({ username: name, email: data.email })));

           
            // ตรวจสอบห้องว่างและจัดการ timer
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
                    console.log(`Room ${socket.roomID} deleted after 5 minutes of inactivity.`);
                  } else {
                    console.log(`Room ${socket.roomID} not deleted. Current user count: ${currentRoomUsers.size}`);
                  }
                } catch (err) {
                  console.error(`Failed to remove room ${socket.roomID}:`, err);
                }
              }, 50000); // 5 minutes 300000
            }
          }
        }
      }
    });
  });


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

  // Run the unban job every hour
  cron.schedule('* * * * *', async () => {
    console.log('Running unbanExpiredUsers job...');
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