"use client";

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
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
        body: JSON.stringify({ roomType, ageGroup }),
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

  const buttonClass = (type) => `
    relative w-[48%] px-4 py-2 rounded-md flex flex-col items-center justify-center 
    transition-all duration-300 ease-in-out
    ${roomType === type ? 'text-blue-500' : 'text-gray-400'}
  `;

  const imageClass = (type) => `
    object-cover w-full h-full mb-2 transition-all duration-300 ease-in-out
    ${roomType === type ? 'brightness-100' : 'brightness-50'}
  `;

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
              <Dialog.Panel className="w-full max-w-3xl h-[580px] transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all relative">
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
                <div className="flex justify-between">
                  <button
                    onClick={() => setRoomType('one-on-one')}
                    className={buttonClass('one-on-one')}
                    style={{ height: roomType === 'one-on-one' ? '300px' : '250px' }}
                  >
                    <Image
                      src={one}
                      alt="คุยแบบตัวต่อตัว"
                      layout="fill"
                      objectFit="cover"
                      className={imageClass('one-on-one')}
                    />
                    <span className={roomType === 'one-on-one' ? 'font-bold' :"}>One-on-One</span>
                  </button>

                  <button
                    onClick={() => setRoomType('multi')}
                    className={buttonClass('multi')}
                    style={{ height: roomType === 'multi' ? '300px' : '250px' }}
                  >
                    <Image
                      src={multi}
                      alt="คุยแบบกลุ่ม"
                      layout="fill"
                      objectFit="cover"
                      className={imageClass('multi')}
                    />
                    <span className={roomType === 'multi' ? 'font-bold' : "}>Multi</span>
                  </button>
                </div>

                <div className="mb-4 mt-4">
                  <h4 className="text-md font-medium mb-2">อยากพบเจอคนวัยใกล้เคียงกัน? ระบุวัยมาเลยย</h4>
                  <div className="flex justify-between">
                    {['any', 'high-school', 'university', 'working'].map((age) => (
                      <button
                        key={age}
                        onClick={() => setAgeGroup(age)}
                        className={`w-[23%] px-2 py-1 border rounded-md ${
                          ageGroup === age ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        {age === 'any' ? 'ทุกช่วงวัย' :
                         age === 'high-school' ? 'มัธยม' :
                         age === 'university' ? 'มหาลัย' : 'วัยทำงาน'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateRoom}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md mt-4"
                >
                  สร้างห้อง
                </button>

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