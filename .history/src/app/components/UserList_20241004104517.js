"use client";

import React from 'react';
import Image from 'next/image';
import char from '/public/asset/char.png';


const UserList = ({ users }) => {
  return (
    <div className="user-list mt-4">
      <h3 className="text-lg font-semibold mb-2">ผู้ใช้ ({users.length}):</h3>
      
      <div className="flex justify-start items-end space-x-2">
        {users.map((user, index) => (
          <div key={index} className="user-character flex flex-col items-center">
            <Image 
              src={char} 
              alt={`${user} icon`} 
              width={40}
              height={40}
              className="mb-1"
            />
 
            <p className="text-xs text-center">{user}</p>
          </div>
        ))}
      </div>
      </button>
    </div>
  );
};

export default UserList;