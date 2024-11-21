const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./models/room');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  const roomUsers = {};

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', async ({ username, roomID }, callback) => {
      try {
        const room = await Room.findOne({ roomID });
        if (!room) {
          return callback({ success: false, message: 'Room not found' });
        }

        if (room.userCount >= room.maxUsers) {
          return callback({ success: false, message: 'Room is full' });
        }

        socket.join(roomID);
        socket.username = username;
        socket.roomID = roomID;

        if (!roomUsers[roomID]) {
          roomUsers[roomID] = new Set();
        }
        roomUsers[roomID].add(username);

        room.userCount += 1;
        await room.save();

        io.to(roomID).emit('userJoined', { username });
        io.to(roomID).emit('updateUserList', Array.from(roomUsers[roomID])); 

        callback({ success: true });
        console.log()
      } catch (error) {
        console.error('Error joining room:', error);
        callback({ success: false, message: 'Failed to join room' });
      }
    });

    socket.on('message', (msg) => { //ส่งข้อความในห้องแชท
      io.to(socket.roomID).emit('message', msg);
    });

    socket.on('disconnect', async () => {
      if (socket.roomID && socket.username) {
        try {
          const room = await Room.findOne({ roomID: socket.roomID });
          if (room) {
            room.userCount = Math.max(0, room.userCount - 1);
            await room.save();

            if (roomUsers[socket.roomID]) {
              roomUsers[socket.roomID].delete(socket.username);
              io.to(socket.roomID).emit('userLeft', { username: socket.username });
              io.to(socket.roomID).emit('updateUserList', Array.from(roomUsers[socket.roomID]));
            }
          }
        } catch (error) {
          console.error('Error updating room on disconnect:', error);
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