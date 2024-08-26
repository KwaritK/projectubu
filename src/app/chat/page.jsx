"use client";

import Navbar from "../components/Navbar"; // Adjust the path
import ChatRoom from "../components/Chatroom"; // Ensure the file name matches exactly

const ChatPage = () => {
  return (
    <main>
      <Navbar />
      <div>
        <h1>Real-Time Chat Room</h1>
        <ChatRoom />
      </div>
    </main>
  );
};

export default ChatPage;
