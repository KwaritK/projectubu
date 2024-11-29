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
      if (roomUsers.has(username)) {
        socket.emit('joinRoomResponse', { success: false, message: 'Username already taken' });
      } else {
        socket.username = username;
        socket.email = email;
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

  
    socket.on('message', (msg) => {
      if (socket.roomID) {
        io.to(socket.roomID).emit('message', msg);
      }
    });

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

            try {
              await Room.findOneAndUpdate(
                { roomID: socket.roomID },
                { userCount },
                { new: true }
              );
            } catch (error) {
              console.error('Error updating room:', error);
            }

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
114                  }
115                } catch (err) {
116                  console.error(`Failed to remove room ${socket.roomID}:`, err);
117                }
118              }, 50000); // 5 minutes 300000
119            }
120          }
121        }
122      }
123    });
124  });
125  const unbanExpiredUsers = async () => {
126    try {
127      const now = new Date();
128      const result = await User.updateMany(
129        { isBanned: true, banEnd: { $lte: now } },
130        { 
131          $set: { isBanned: false },
132          $unset: { banEnd: "" }
133        }
134      );
135      console.log(`Unbanned ${result.modifiedCount} users with expired bans.`);
136    } catch (error) {
137      console.error("Error unbanning expired users:", error);
138    }
139  };

140  // Run the unban job every hour
141  cron.schedule('* * * * *', async () => {
142    console.log('Running unbanExpiredUsers job...');
143    await unbanExpiredUsers();
144  });
145
146  server.all('*', (req, res) => {
147    return handle(req, res);
148  });
149
150  const PORT = process.env.PORT || 3000;
151  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
