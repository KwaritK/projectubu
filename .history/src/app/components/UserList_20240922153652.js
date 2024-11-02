"use client";

import React from 'react';
import Image from 'next/image';
import char from '/public/asset/char.png';

const UserList = ({ users }) => {
  return (
    <div className="user-list mt-4">
      <h3 className="text-sm font-semibold mb-2">ผู้ใช้ ({users.length}):</h3>
      <div className="relative">
        {/* ฉากหลัง */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg" />
        
        {/* ตัวละครผู้ใช้ */}
        <div className="flex justify-start items-end space-x-2 p-4 relative">
          {users.map((user, index) => (
            <div key={index} className="user-character flex flex-col items-center">
              <Image 
                src={char} 
                alt={`${user} icon`} 
                width={40}
                height={40}
                className="mb-1"
              />
              <div className="bg-white border border-gray-300 rounded-full p-1 w-8 h-8 flex items-center justify-center mb-1">
                {index === users.length - 1 ? '🎉' : '🍷'}
              </div>
              <p className="text-xs text-center">{user}</p>
            </div>
          ))}
        </div>
        
        {/* เส้นด้านล่าง */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b-lg" />
      </div>
    </div>
  );
};

export default UserList;