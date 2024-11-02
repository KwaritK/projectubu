
/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import exit from '/public/asset/exit.png'; 

const handleCreateRoom = async () => {
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
        body: JSON.stringify({ roomType, ageGroup }), // ส่ง roomType และ ageGroup
      });
  
      const data = await res.json();
  
      if (res.ok) {
        router.push(`/roomtag/${data.room.roomID}`);  // ส่งผู้ใช้ไปยังหน้าห้องแชทใหม่พร้อมกับ roomID
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการสร้างห้อง');
      }
    } catch (error) {
      setError('ไม่สามารถสร้างห้องได้');
    }
  };

return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl h-[650px]  transform overflow-hidden rounded-2x2 bg-white p-8 text-left align-middle shadow-xl transition-all relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 p-1"
                >
                  <Image src={exit} alt="ปิด" width={20} height={20} />
                </button>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center mb-4"
                >
                  อยากนั่งโต๊ะแบบไหนดี
                </Dialog.Title>
  
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReportModal;
