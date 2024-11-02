"use client";
import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import one from '/public/asset/oneone.png';
import multi from '/public/asset/multi.png';
import exit from '/public/asset/exit.png'; 
import lightt from '/public/asset/light.png'; 

const CreateRoomModal = ({ isOpen, closeModal }) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleCreateRoom = async (type) => {
    if (!ageGroup || !roomType) {
      setError('กรุณาเลือกกลุ่มอายุและประเภทกลุ่ม');
      return;
    }

    try {
      const res = await fetch('/api/createroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomType: type, ageGroup }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(/roomtag/${data.room.roomID});
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการสร้างห้อง');
      }
    } catch (error) {
      setError('ไม่สามารถสร้างห้องได้');
    }
  };