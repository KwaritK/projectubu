"use client";

import React, { useState } from 'react';
import CreateRoomModal from './CreateRoomModal';   //เรียกฟอร์มการสร้างห้อง
import SetUser from './SetUser';

const CreateRoomButton = (setUsername) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

 
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button 
        onClick={openModal}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        สร้างห้อง
      </button>
      <SetUser onSetUsername={setUsername} />
      <CreateRoomModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

export default CreateRoomButton;