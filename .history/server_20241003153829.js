const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./models/room'); // Import Room model

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