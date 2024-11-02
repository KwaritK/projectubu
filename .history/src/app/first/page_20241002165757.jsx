"use client";
import React, { useState } from 'react';
import SetUsername from '../components/SetUser'
const ChatRoom = () => {
  const [username, setUsername] = useState('');


  return (
    <div>
      <SetUsername onSetUsername={setUsername} />
    </div>
  )
}
}
export default function paage() {