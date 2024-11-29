const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
 const next = require('next');
 const Room = require('./models/room');
6 const cron = require('node-cron');
7 const User = require('./models/user');
8
9
10 const roomTimers = {};
11 const rooms = new Map();
12
13 const dev = process.env.NODE_ENV !== 'production';
14 const app = next({ dev });
15 const handle = app.getRequestHandler();
16 
17 app.prepare().then(() => {
18   const server = express();
19   const httpServer = http.createServer(server);
20   const io = new Server(httpServer);
21
22  global.server = httpServer; // ทำให้ server ใช้งานได้แบบ global
23  global.io = io;  // ทำให้ io สามารถเรียกใช้ได้จากที่อื่น
24  
25  io.on('connection', (socket) => {
26   console.log('New connection');
27
28    socket.on('joinRoom', async ({ username, email, roomID }) => {
29     console.log('Received:', 'Username:', username, 'Email:', email, 'RoomID:', roomID);
30     
31      if (!username || !email || !roomID) {
32        console.log('Invalid data received:', { username, email, roomID });
33        socket.emit('joinRoomResponse', { success: false, message: 'Invalid data' });
34        return;
35      }
36
37      if (!rooms.has(roomID)) {
38        rooms.set(roomID, new Map());
39      }
40
41      const roomUsers = rooms.get(roomID);
42      if (roomUsers.has(username)) {
43        socket.emit('joinRoomResponse', { success: false, message: 'Username already taken' });
44      } else {
45        socket.username = username;
46        socket.email = email;
47       socket.roomID = roomID;
48        socket.join(roomID);
49
50        roomUsers.set(username, { email, socketId: socket.id });
51
52        const userCount = roomUsers.size;
53
54        io.to(roomID).emit('userJoined', { username });
55        io.to(roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({ username: name, email: data.email })));
56        socket.emit('joinRoomResponse', { success: true });
57
58        if (roomTimers[roomID]) {
59          clearTimeout(roomTimers[roomID]);
 60         delete roomTimers[roomID];
 61       }
62        
63        try {
64          await Room.findOneAndUpdate(
65            { roomID },
66            { userCount },
67            { new: true, upsert: true }
68          );
69        } catch (error) {
70          console.error('Error updating room:', error);
71        }
72
73        console.log(`User ${username} joined room ${roomID}. Current user count: ${userCount}`);
74      }
75    });
76
77  
78    socket.on('message', (msg) => {
79      if (socket.roomID) {
80        io.to(socket.roomID).emit('message', msg);
81      }
82    });
83
84    socket.on('disconnect', async () => {
85      if (socket.roomID) {
86        const roomUsers = rooms.get(socket.roomID);
87        if (roomUsers) {
88          const disconnectedUser = Array.from(roomUsers.entries()).find(([_, data]) => 
89 data.socketId === socket.id);
90          if (disconnectedUser) {
91            const [username, _] = disconnectedUser;
92            roomUsers.delete(username);
93           
94           const userCount = roomUsers.size;
95            console.log(`User ${username} disconnected from room ${socket.roomID}. Current user count: ${userCount}`);
96
97            io.to(socket.roomID).emit('userLeft', { username });
98            io.to(socket.roomID).emit('updateUserList', Array.from(roomUsers, ([name, data]) => ({ username: name, email: data.email })));
99
100            try {
101              await Room.findOneAndUpdate(
102                { roomID: socket.roomID },
103                { userCount },
104                { new: true }
105              );
106            } catch (error) {
107              console.error('Error updating room:', error);
108            }
109
110            if (userCount === 0) {
111              if (roomTimers[socket.roomID]) {
112                clearTimeout(roomTimers[socket.roomID]);
113              }
114              roomTimers[socket.roomID] = setTimeout(async () => {
115                try {
116                  const currentRoomUsers = rooms.get(socket.roomID);
117                  if (!currentRoomUsers || currentRoomUsers.size === 0) {
118                    await Room.deleteOne({ roomID: socket.roomID });
119                    rooms.delete(socket.roomID);
110                    delete roomTimers[socket.roomID];
111                    console.log(`Room ${socket.roomID} deleted after 5 minutes of inactivity.`);
112                  } else {
113                    console.log(`Room ${socket.roomID} not deleted. Current user count: ${currentRoomUsers.size}`);
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