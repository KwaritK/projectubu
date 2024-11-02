"use client";
import React, { useState } from 'react';
import SetUsername from '../components/SetUser'

function firstpage() {
const ChatRoom = () => {
  const [username, setUsername] = useState('');


  return (
    <div>
      <SetUsername onSetUsername={setUsername} />
    </div>
  )
}
}
export default firstpage