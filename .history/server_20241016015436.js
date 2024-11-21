const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./models/room');
const cron = require('node-cron');
const User = require('./models/user');

const roomTimers = {};
const users = new Map();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('joinRoom', async ({ username, email, roomID }) => {
      console.log('Received:', 'Username:', username, 'Email:', email, 'RoomID:', roomID);
      
      if (!username || !email || !roomID) {
        console.log('Invalid data received:', { username, email, roomID });
        socket.emit('joinRoomResponse', { success: false, message: 'Invalid data' });
        return;
      }

      if (!users.has(roomID)) {
        users.set(roomID, new Map());
      }

      const roomUsers = users.get(roomID);
      if (roomUsers.has(username)) {
        socket.emit('joinRoomResponse', { success: false, message: 'Username already taken' });
      } else {
        socket.username = username;
        socket.email = email;
        socket.roomID = roomID;
        socket.join(roomID);

        roomUsers.set(username, { email });

        const userCount = io.sockets.adapter.rooms.get(roomID)?.size || 0;

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
      }
    });

    socket.on('message', (msg) => {
      if (socket.roomID) {
        io.to(socket.roomID).emit('message', msg);
      }
    });

    socket.on('disconnect', async () => {
      if (socket.username && socket.roomID) {
        console.log(`User ${socket.username} disconnected from room ${socket.roomID}`);
        
        const roomUsers = users.get(socket.roomID);
        if (roomUsers) {
          roomUsers.delete(socket.username);
          
          if (roomUsers.size === 0) {
            users.delete(socket.roomID);
          }
        }
    
        io.to(socket.roomID).emit('userLeft', { username: socket.username });
        io.to(socket.roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({ username: name, email: data.email })));
    
        const userCount = io.sockets.adapter.rooms.get(socket.roomID)?.size || 0;
        console.log(`User count in room ${socket.roomID}: ${userCount}`);
    
        await Room.findOneAndUpdate(
          { roomID: socket.roomID },
          { userCount },
          { new: true }
        );

        if (userCount === 0 && !roomTimers[socket.roomID]) {
          roomTimers[socket.roomID] = setTimeout(async () => {
            try {
              const currentUserCount = io.sockets.adapter.rooms.get(socket.roomID)?.size || 0;
              if (currentUserCount === 0) {
                await Room.deleteOne({ roomID: socket.roomID });
                delete roomTimers[socket.roomID];
                console.log(`Room ${socket.roomID} deleted after 5 minutes of inactivity.`);
              } else {
                console.log(`Room ${socket.roomID} not deleted. Current user count: ${currentUserCount}`);
              }
            } catch (err) {
              console.error(`Failed to remove room ${socket.roomID}:`, err);
            }
          }, 5000); // 5 minutes 300000
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