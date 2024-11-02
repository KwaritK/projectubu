// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  socket.on('setUsername', (username, callback) => {
    console.log('ชื่อผู้ใช้ที่ตั้งค่า:', username);
    if (username) {
      callback({ success: true });
    } else {
      callback({ success: false, message: 'ชื่อผู้ใช้ไม่ถูกต้อง' });
    }
  });

  socket.on('message', (msg) => {
    console.log('ข้อความใหม่จาก:', msg.sender, msg.text);
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
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
