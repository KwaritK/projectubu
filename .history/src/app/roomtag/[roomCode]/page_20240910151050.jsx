import { useState } from 'react';
import { useRouter } from 'next/router';

const JoinRoom = () => {
  const [roomID, setRoomID] = useState('');
  const router = useRouter();

  const joinRoom = async () => {
    const response = await fetch(`/api/checkroom?roomCode=${roomID}`);

    if (response.status === 200) {
      // Room found, redirect to chat room
      router.push(`/roomtag/${roomID}`);
    } else {
      alert('Room not found!');
    }
  };

  return (
    <div>
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
