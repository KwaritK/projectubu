/* eslint-disable jsx-a11y/alt-text */
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

import { connectMongoDB } from '../../../../lib/mongodb';
import Room from '../../../../models/room'; // นำเข้า Schema ห้องที่คุณสร้างไว้


function generateRoomID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function POST(req) {
  try {
    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();
    // ดึงข้อมูลจาก request body
    const { roomType, ageGroup } = await req.json();

    // ตรวจสอบว่าข้อมูลถูกต้อง
    if (!roomType || !ageGroup) {
      return new Response(JSON.stringify({ error: "Room type and age group are required." }), { status: 400 });
    }
    // กำหนดจำนวนผู้ใช้สูงสุดตามประเภทห้อง
    const maxUsers = roomType === 'one-on-one' ? 2 : 5;

    // ค้นหาห้องที่มีประเภทเดียวกันและช่วงอายุเดียวกันที่ยังไม่เต็ม
    let room = await Room.findOne({ roomType, ageGroup });

    if (room) {
      // ตรวจสอบจำนวนผู้ใช้ปัจจุบันในห้อง
      const currentUserCount = room.userCount;

      // ตรวจสอบว่าห้องเต็มหรือไม่
      if (currentUserCount < room.maxUsers) {
        // อัปเดตจำนวนผู้ใช้ในห้อง
        room.userCount += 1;
        await room.save();

        // ส่งข้อมูลห้องกลับไปเมื่อเข้าร่วมห้องสำเร็จ
        return new Response(JSON.stringify({ room }), { status: 200 });
      } 
      
    }
    // สร้างห้องใหม่หากไม่มีห้องที่ตรงตามเงื่อนไขหรือห้องเต็ม
    const newRoom = new Room({
      roomType,
      ageGroup,
      roomID: generateRoomID(5),// สร้าง roomID แบบสุ่มไม่เกิน 5 อักขระ
      maxUsers,
      userCount: 0 //แก้ตรงนี้ ควรปรับเป็นแบบยืดยุ่นหากผู้ใช้สร้างแล้วไม่ได้ทำการเข้าร่วมควรเป็น 0 !!
    });

    // บันทึก Room ลง MongoDB
    await newRoom.save();

    // ส่งค่ากลับเมื่อสร้างห้องสำเร็จ
    return new Response(JSON.stringify({ room: newRoom }), { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

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
  <div className="flex justify-between ">
  <button
    onClick={() => setRoomType('one-on-one')}
    className={`relative w-[48%] px-4 py-2 rounded-md flex flex-col items-center justify-center transition-all duration-300 ease-in-out'
       ${roomType === 'one-on-one' ? 'brightness-100' : 'brightness-50'
       }`}
        
       
       style={{ height: roomType === 'one-on-one' ? '300px' : '250px '}}
  >
  
    <Image
      src={one}
      alt="คุยแบบตัวต่อตัว"
      className="object-cover w-full h-full mb-2"
      
      
      
    />
    <span className={roomType === 'one-on-one' ? 'font-bold' : ''}>One-on-One</span>
  </button>
 
  <button
    onClick={() => setRoomType('multi')}
    className={`relative w-[48%] px-4 py-2 rounded-md flex flex-col items-center justify-center transition-all duration-300 ease-in-out' 
      ${
      roomType === 'multi' ? 'brightness-100' : 'brightness-50'
    }`}
    style={{ height: roomType === 'multi' ? '300px' : '250px' }}
  >
    <Image
      src={multi}
      alt="คุยแบบกลุ่ม"
      className="object-cover w-full h-full mb-2"
    />
    <span className={roomType === 'multi' ? 'font-bold' : ''}>Multi</span>
  </button>
</div>

                <div className="mb-4">
                  <Image src={lightt}/>
                  <h4 className="text-md font-medium mb-2">อยากพบเจอคนวัยใกล้เคียงกัน? ระบุวัยมาเลยย</h4>
                  <div className="flex justify-between">
                    <button
                      onClick={() => setAgeGroup('any')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'any' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'} mx-2 my-1`}
                    >
                      ทุกช่วงวัย
                    </button>
                    <button
                      onClick={() => setAgeGroup('high-school')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'high-school' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'} mx-2 my-1`}
                    >
                      มัธยม
                    </button>
                    <button
                      onClick={() => setAgeGroup('university')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'university' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'} mx-2 my-1`}
                    >
                      มหาลัย
                    </button>
                    <button
                      onClick={() => setAgeGroup('working')}
                      className={`w-[30%] px-2 py-1 border rounded-md ${ageGroup === 'working' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'} mx-2 my-1`}
                    >
                      วัยทำงาน
                    </button>
                  </div>
                </div>

                {/* ปุ่มสำหรับสร้างห้อง */}
                <button
                  onClick={() => handleCreateRoom(roomType)} // เรียกใช้ฟังก์ชันนี้เมื่อคลิก
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
