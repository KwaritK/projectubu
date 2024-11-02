import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import one from '/public/asset/oneone.png'; 
import many from '/public/asset/multi.png'; 

const CreateRoomModal = ({ isOpen, closeModal }) => {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleCreateRoom = async (type) => {
    try {
      const res = await fetch('/api/createroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomType: type }),
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  อยากนั่งโต๊ะแบบไหนดี
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <button
                    onClick={() => handleCreateRoom('one-on-one')}
                    className="w-full px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center justify-center"
                  >
                    <img src="/oneone-icon.png" alt="คุยแบบตัวต่อตัว" className="w-8 h-8 mr-2" />
                    <span>One on One</span>
                  </button>
                  <button
                    onClick={() => handleCreateRoom('multi')}
                    className="w-full px-4 py-2 border rounded-md hover:bg-gray-100 flex items-center justify-center"
                  >
                    <img src="/group-icon.png" alt="คุยแบบกลุ่ม" className="w-8 h-8 mr-2" />
                    <span>Up to 5 people</span>
                  </button>
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