import { useState } from 'react';

const Createroom = () => {
  const [roomName, setRoomName] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [roomType, setRoomType] = useState('');

  const createRoom = async () => {
    const response = await fetch('/api/createroom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, ageRestriction, roomType }),
    });

    const result = await response.json();
    if (result.success) {
      alert(`Room created with ID: ${result.roomID}`);
    }
  };

  return (
    <div>
      <h2>Create a New Room</h2>
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Age Restriction"
        value={ageRestriction}
        onChange={(e) => setAgeRestriction(e.target.value)}
      />
      <input
        type="text"
        placeholder="Room Type"
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default Createroom;
