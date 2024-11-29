const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const Room = require('./models/room');
const cron = require('node-cron');
const User = require('./models/user');

// เก็บข้อมูลการเชื่อมต่อและห้อง
const connections = new Map(); // เก็บข้อมูล socket connections
const rooms = new Map();      // เก็บข้อมูลห้อง
const roomTimers = {};        // เก็บ timers สำหรับลบห้อง

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    }
  });

  global.server = httpServer;
  global.io = io;

  // ฟังก์ชันสำหรับอัพเดทจำนวนผู้ใช้ในห้อง
  const updateRoomUserCount = async (roomID) => {
    const roomUsers = rooms.get(roomID);
    const userCount = roomUsers ? roomUsers.size : 0;
    
    try {
      await Room.findOneAndUpdate(
        { roomID },
        { 
          userCount,
          lastActivity: new Date()
        },
        { new: true, upsert: true }
      );
      return userCount;
    } catch (error) {
      console.error('Error updating room user count:', error);
      return null;
    }
  };

  // ฟังก์ชันสำหรับเช็คและลบการเชื่อมต่อเก่า
  const cleanupOldConnections = (email, roomID) => {
    for (const [socketId, data] of connections) {
      if (data.email === email && data.roomID === roomID) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          console.log(`Cleaning up old connection for ${email} in room ${roomID}`);
          socket.disconnect(true);
        }
        connections.delete(socketId);
      }
    }
  };

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('joinRoom', async ({ username, email, roomID }) => {
      console.log('Join attempt:', 'Username:', username, 'Email:', email, 'RoomID:', roomID);
      
      if (!username || !email || !roomID) {
        socket.emit('joinRoomResponse', { 
          success: false, 
          message: 'Invalid data provided' 
        });
        return;
      }

      // Cleanup old connections for this user
      cleanupOldConnections(email, roomID);

      // Initialize room if it doesn't exist
      if (!rooms.has(roomID)) {
        rooms.set(roomID, new Map());
      }

      const roomUsers = rooms.get(roomID);

      // Check for existing user
      const existingUser = Array.from(roomUsers.values())
        .find(user => user.email === email);

      if (existingUser) {
        socket.emit('joinRoomResponse', { 
          success: false, 
          message: 'User already exists in this room' 
        });
        return;
      }

      // Remove user from any previous room
      if (socket.roomID) {
        const oldRoom = rooms.get(socket.roomID);
        if (oldRoom) {
          oldRoom.delete(socket.username);
          socket.leave(socket.roomID);
          await updateRoomUserCount(socket.roomID);
        }
      }

      // Join new room
      socket.username = username;
      socket.email = email;
      socket.roomID = roomID;
      socket.join(roomID);

      // Store connection info
      connections.set(socket.id, {
        username,
        email,
        roomID,
        joinedAt: new Date()
      });

      // Add user to room
      roomUsers.set(username, {
        email,
        socketId: socket.id,
        joinedAt: new Date()
      });

      // Update room user count and notify
      const userCount = await updateRoomUserCount(roomID);

      // Cancel room deletion timer if exists
      if (roomTimers[roomID]) {
        clearTimeout(roomTimers[roomID]);
        delete roomTimers[roomID];
      }

      // Notify room members
      io.to(roomID).emit('userJoined', {
        username,
        userCount,
        timestamp: new Date()
      });

      io.to(roomID).emit('updateUserList', 
        Array.from(roomUsers, ([name, data]) => ({
          username: name,
          email: data.email,
          joinedAt: data.joinedAt
        }))
      );

      socket.emit('joinRoomResponse', { success: true });

      console.log(`User ${username} joined room ${roomID}. Current user count: ${userCount}`);
    });

    socket.on('message', (msg) => {
      if (socket.roomID && socket.username && connections.has(socket.id)) {
        io.to(socket.roomID).emit('message', {
          ...msg,
          username: socket.username,
          timestamp: new Date()
        });
      }
    });

    socket.on('disconnect', async () => {
      console.log('Disconnection:', socket.id);
      
      const connectionData = connections.get(socket.id);
      if (!connectionData) return;

      const { username, roomID } = connectionData;
      const roomUsers = rooms.get(roomID);
      
      if (roomUsers) {
        roomUsers.delete(username);
        connections.delete(socket.id);

        const userCount = await updateRoomUserCount(roomID);

        io.to(roomID).emit('userLeft', {
          username,
          userCount,
          timestamp: new Date()
        });

        io.to(roomID).emit('updateUserList',
          Array.from(roomUsers, ([name, data]) => ({
            username: name,
            email: data.email,
            joinedAt: data.joinedAt
          }))
        );

        console.log(`User ${username} disconnected from room ${roomID}. Current user count: ${userCount}`);

        // Set timer to delete empty room
        if (userCount === 0) {
          if (roomTimers[roomID]) {
            clearTimeout(roomTimers[roomID]);
          }
          
          roomTimers[roomID] = setTimeout(async () => {
            const currentRoom = rooms.get(roomID);
            if (!currentRoom || currentRoom.size === 0) {
              try {
                await Room.deleteOne({ roomID });
                rooms.delete(roomID);
                delete roomTimers[roomID];
                console.log(`Room ${roomID} deleted after inactivity timeout`);
              } catch (err) {
                console.error(`Failed to remove room ${roomID}:`, err);
              }
            }
          }, 50000);
        }
      }
    });
  });

  // Unban expired users job
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
      if (result.modifiedCount > 0) {
        console.log(`Unbanned ${result.modifiedCount} users with expired bans.`);
      }
    } catch (error) {
      console.error("Error unbanning expired users:", error);
    }
  };

  cron.schedule('* * * * *', unbanExpiredUsers);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
});