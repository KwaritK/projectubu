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
            <div className="bg-gray-200 rounded-full p-1 w-8 h-8 flex items-center justify-center mb-1">
              {index === users.length - 1 ? '🎉' : '🍷'}
            </div>
            <p className="text-xs text-center">{user}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;