"use client";
import React, { useState } from 'react';
import SetUsername from '../components/SetUser'

export default function paage() {
  return (
    <div>
      <SetUsername onSetUsername={setUsername} />
    </div>
  )
}
