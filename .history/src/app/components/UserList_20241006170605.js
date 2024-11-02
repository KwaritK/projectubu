"use client";

import React from 'react';
import Image from 'next/image';
import char from '/public/asset/char.png';
import ReportModal from './ReportModal';

const UserList = ({ users }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="user-list mt-4">
      <h3 className="text-lg font-semibold mb-2">ผู้ใช้ ({users.length}):</h3>
      
      <div className="flex justify-start items-end space-x-2">
      
        {users.map((user, index) => (
          
          <div key={index} className="user-character flex flex-col items-center">
            <button onClick={openModal}>
            <Image 
              src={char} 
              alt={`${user} icon`} 
              width={40}
              height={40}
              className="mb-1"
            />
            <p className="text-xs text-center">{user}</p>
            </button>
            <ReportModal isOpen={isModalOpen} closeModal={closeModal} />
          </div>
        
        ))}
      </div>
      
    </div>
  );
};

export default UserList;