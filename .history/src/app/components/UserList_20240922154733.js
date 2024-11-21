"use client";

import React from 'react';
import Image from 'next/image';
import char from '/public/asset/char.png';




const UserList = ({ users }) => {
  return (
    <div className="user-list bg-paper-texture p-4 rounded-lg">
      <h3 className="text-lg font-hand mb-4">ผู้ร่วมดื่ม ({users.length} คน):</h3>
      <div className="flex flex-wrap justify-center">
        {users.map((user, index) => (
          <div key={index} className="user-character relative m-2">
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
              <Image 
                src={`/chaพ/${index % 5 + 1}.png`} 
                alt={user} 
                width={60} 
                height={60}
              />
            </div>
            <div className="speech-bubble absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-md">
              <p className="text-xs font-hand">{user}</p>
            </div>
            <div className="drink-icon absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              🍺
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;