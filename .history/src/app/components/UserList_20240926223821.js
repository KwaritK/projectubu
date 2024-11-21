"use client";

import React from 'react';
import Image from 'next/image';
import char from '/public/asset/char.png';


const UserList = ({ users }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">ผู้ใช้ ({users.length}):</h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div key={index} className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
              {index === users.length - 1 ? '🎉' : '🍷'}
            </div>
            <p>{user}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;