import Image from "next/image";
import Navbar from "./components/Navbar";
import back from '@/app/assets/backone.png';
import ChatRoom from "./components/chatroom.js'; // Ensure the file name matches exactly

const HomePage = () => {
  return (
    <main>
      <Navbar />
      <Image src={back} alt="back" className="mx-auto" />
      <div>
        <h1>Real-Time Chat Room</h1>
        <ChatRoom />
      </div>
    </main>
  );
};

export default HomePage;
