"use client";
import React, { useState } from 'react';
import SetUsername from '../components/SetUser'
const ChatRoom = () => {
  const [username, setUsername] = useState('');

export default function paage() {
  return (
    <div>
      <SetUsername onSetUsername={setUsername} />
    </div>
  )
}
}