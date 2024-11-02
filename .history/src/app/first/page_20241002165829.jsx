"use client";
import React, { useState } from 'react';
import SetUsername from '../components/SetUser'

function Loginpage() {
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