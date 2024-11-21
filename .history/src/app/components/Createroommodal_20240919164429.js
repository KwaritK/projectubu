"use client";

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import one from '/public/asset/oneone.png';
import multi from '/public/asset/multi.png';
import exit from '/public/asset/exit.png'; 

const CreateRoomModal = ({ isOpen, closeModal }) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleCreateRoom = async (type) => {
    if (!ageGroup) {
      setError('กรุณาเลือกกลุ่มอายุ');
    
    if (!roomType) {
        setError('กรุณาประเภทกลุ่ม');
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
        router.push(`/roomtag/${data.room.roomID}`);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
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
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => setRoomType('one-on-one')}
                    className="w-[48%] px-2 py-2 border rounded-md hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Image src={one} alt="คุยแบบตัวต่อตัว" width={150} height={50} />
                  </button>
                  <button
                    onClick={() => setRoomType('multi')}
                    className="w-[48%] px-2 py-2 border rounded-md hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Image src={multi} alt="คุยแบบกลุ่ม" width={150} height={50} />
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">อยากพบเจอคนวัยใกล้เคียงกัน? ระบุวัยมาเลยย</h4>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setAgeGroup('any')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'any' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    >
                      ทุกช่วงวัย
                    </button>
                    <button
                      onClick={() => setAgeGroup('high-school')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'high-school' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    >
                      มัธยม
                    </button>
                    <button
                      onClick={() => setAgeGroup('university')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'university' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    >
                      มหาลัย
                    </button>
                    <button
                      onClick={() => setAgeGroup('working')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'working' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    >
                      วัยทำงาน
                    </button>
                  </div>
                </div>
                {error && <p className="mt-2 text-red-600 text-center">{error}</p>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateRoomModal;