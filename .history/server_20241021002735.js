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
  const io = new Server(httpServer);

  global.server = httpServer; // ทำให้ server ใช้งานได้แบบ global
  global.io = io;  // ทำให้ io สามารถเรียกใช้ได้จากที่อื่น

  io.on('connection', (socket) => {
    console.log('New connection');
  
    // ในส่วนของ socket.on('joinRoom', ...)
socket.on('joinRoom', async ({ username, email, roomID }) => {
  console.log('Received join request:', { username, email, roomID });

  try {
    // ตรวจสอบข้อมูลที่ได้รับ
    if (!username || !email || !roomID) {
      console.log('Invalid data received:', { username, email, roomID });
      socket.emit('joinRoomResponse', { success: false, message: 'Invalid data' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found in database:', email);
      socket.emit('joinRoomResponse', { success: false, message: 'User not found in database' });
      return;
    }

    console.log('User found:', user.isBanned ? 'Banned' : 'Not banned');

    if (user.isBanned) {
      const now = new Date();
      
      if (user.banEnd && user.banEnd > now) {
        // ผู้ใช้ยังถูกแบน
        console.log('User is banned until:', user.banEnd);
        socket.emit('userBanned', { 
          reason: user.banReason,
          banEndDate: user.banEnd
        });
        socket.emit('joinRoomResponse', { 
          success: false, 
          message: 'You are banned from joining rooms',
          banEnd: user.banEnd,
          reason: user.banReason
        });
        return;
      } else {
        // ปลดแบนหากเวลาหมดอายุ
        console.log('Ban period ended, user unbanned');
        user.isBanned = false;
        user.banEnd = null;
        user.banReason = null;
        await user.save();
      }
    }

    // ดำเนินการเข้าร่วมห้องถ้าไม่มีการแบน
    console.log('User can join room');
socket.emit('joinRoomResponse', { success: true });
  
        //จัดการการเข้าร่วมห้อง
        if (!rooms.has(roomID)) {
          rooms.set(roomID, new Map());
        }

        const roomUsers = rooms.get(roomID);
        if (roomUsers.has(username)) {
          console.log('Username already taken:', username);
          socket.emit('joinRoomResponse', { success: false, message: 'Username already taken' });
        } else {
          socket.username = username;
          socket.email = email;
          socket.roomID = roomID;
          socket.join(roomID);
  
          roomUsers.set(username, { email, socketId: socket.id });
          const userCount = roomUsers.size;
  
          console.log(`User ${username} joined room ${roomID}. Current user count: ${userCount}`);
  
          io.to(roomID).emit('userJoined', { username });
          io.to(roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({ username: name, email: data.email })));
          socket.emit('joinRoomResponse', { success: true });
  
          // Clear room timer if it exists
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
        }
      } catch (error) {
        console.error('Error in joinRoom:', error);
        socket.emit('joinRoomResponse', { success: false, message: 'Internal server error' });
      }
    });

    // ฟังก์ชันจัดการเมื่อมีการส่งข้อความในห้องสนทนา
    socket.on('message', (msg) => {
      if (socket.roomID) {
        io.to(socket.roomID).emit('message', msg);
      }
    });

    // ฟังก์ชันเมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('disconnect', async () => {
      if (socket.roomID) {
        const roomUsers = rooms.get(socket.roomID);
        if (roomUsers) {
          const disconnectedUser = Array.from(roomUsers.entries()).find(([_, data]) => data.socketId === socket.id);
          if (disconnectedUser) {
            const [username, _] = disconnectedUser;
            roomUsers.delete(username);

            const userCount = roomUsers.size;
            console.log(`User ${username} disconnected from room ${socket.roomID}. Current user count: ${userCount}`);

            io.to(socket.roomID).emit('userLeft', { username });
            io.to(socket.roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({ username: name, email: data.email })));

            // อัพเดทจำนวนผู้ใช้ในห้องในฐานข้อมูล
            try {
              await Room.findOneAndUpdate(
                { roomID: socket.roomID },
                { userCount },
                { new: true }
              );
            } catch (error) {
              console.error('Error updating room:', error);
            }

            // ตั้งเวลาลบห้องเมื่อไม่มีผู้ใช้
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
                    console.log(`Room ${socket.roomID} deleted after 1 minute of inactivity.`);
                  } else {
                    console.log(`Room ${socket.roomID} not deleted. Current user count: ${currentRoomUsers.size}`);
                  }
                } catch (err) {
                  console.error(`Failed to remove room ${socket.roomID}:`, err);
                }
              }, 60000); // 1 minutes 
            }
          }
        }
      }
    });
  });

  // Job to unban users whose ban period has expired
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

  // Run the unban job every minute
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
