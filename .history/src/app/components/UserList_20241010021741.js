"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import char from '/public/asset/char.png';
import ReportModal from './ReportModal';


const UserList = ({ users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="user-list mt-4">
      <h3 className="text-lg font-semibold mb-2">ผู้ใช้ ({users.length}):</h3>
      
      <div className="flex justify-start items-end space-x-2">
        {users.map((user, index) => (
          <div key={index} className="user-character flex flex-col items-center">
            <button onClick={() => openModal(user)}>
              <Image 
                src={char} 
                alt={`${user.username} icon`} 
                width={40}
                height={40}
                className="mb-1"
              />
              <p className="text-xs text-center">{user.username}</p>
            </button>
          </div>
        ))}
      </div>
      
      {isModalOpen && selectedUser && (
        <ReportModal 
          isOpen={isModalOpen} 
          closeModal={closeModal} 
          user={selectedUser.username}
          userEmail={selectedUser.email}
        />
      )}
    </div>
  );
};

export default UserList;