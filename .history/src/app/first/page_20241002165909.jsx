"use client";
import React, { useState } from 'react';
import SetUsername from '../components/SetUser'

function firstpage() {

  const [username, setUsername] = useState('');



    <div>
      <SetUsername onSetUsername={setUsername} />
    </div>
  )
}

export default firstpage