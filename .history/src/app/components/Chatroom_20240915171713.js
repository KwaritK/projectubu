import { useEffect, useState } from 'react';

import io from 'socket.io-client';

let socket;

const ChatRoom = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('updateActiveUsers', (users) => {
      setActiveUsers(Object.values(users));
    });

    // แจ้งเตือนเมื่อมีผู้ใช้ใหม่เข้ามาในห้อง
    socket.on('userJoined', (username) => {
      setActiveUsers((prevUsers) => [...prevUsers, username]);
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('setUsername', username);
      setIsLoggedIn(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', { text: message, sender: username });
      setMessage('');
    }
  };

  if (!isLoggedIn) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <button type="submit">Join Chat</button>
      </form>
    );
  }

  return (
    <div>
      <h2>Active Users:</h2>
      <ul>
        {activeUsers.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.sender}: {msg.text}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
    <Link href="/">
    <button c>
      Game2
    </button>
  </Link>
    
  );
};

export default ChatRoom;
