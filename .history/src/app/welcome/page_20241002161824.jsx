"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../../../public/asset/Navbar";
import CreateRoomButton from '../components/CreateRoomButton'; //ปุ่มกดเพื่อเข้าสู่ฟอร์มการสร้างห้อง
import SetUser from "../components/SetUser";

const isValidRoomCode = (code) => {
  const roomCodeRegex = /^[A-Za-z0-9]{5}$/;
  return roomCodeRegex.test(code);
};

const WelcomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [roomCode, setRoomCode] = useState("");


  // Redirect to login if session does not exist
  if (!session) {
    router.push("/login");
    return null;
  }




  const handleJoinRoom = async (e) => { //ฟังชั่นของปุ่มในการกรอกโค้ดเพื่อเข้าร่วมห้อง
    e.preventDefault();
    
    // ตรวจสอบความถูกต้องของรหัสห้อง
    if (!isValidRoomCode(roomCode)) {
      setErrorMessage("รหัสห้องไม่ถูกต้อง กรุณากรอกรหัส 5 ตัวอักษรที่เป็นตัวอักษรหรือตัวเลข");
      return;
    }
  
    try {
      const response = await fetch(`/api/checkroom?roomCode=${roomCode}`);
      
      console.log('API Response:', response); // Log the entire response
  
      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage("Room does not exist. Please check the room code and try again.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }
  
      const result = await response.json();
      console.log('API Result:', result); // Log the parsed result
  
      if (result.exists) {
        // Room exists, redirect to the room page
        router.push(`/roomtag/${roomCode}`);
      } else {
        // Room does not exist
        setErrorMessage("ไม่พบห้องนี้ กรุณาตรวจสอบรหัสห้องและลองอีกครั้ง");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบห้อง:", error);
      setErrorMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง");
    }
  };

  return (
    
    <div className="bg-gray-100 min-h-screen">
      <Navbar session={session} />
      <div className="container mx-auto py-5 px-4">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl text-center font-bold mb-6">งานวัด Online</h1>
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-2/3 px-3 mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                Welcome: {session?.user?.email}
              </h2>

              
              
                <div className="w-full sm:w-1/2 px-2 mb-4">
                  <CreateRoomButton username={username} />
                </div>

              <form onSubmit={handleJoinRoom} className="mb-4">
                <input
                  type="text"
                  placeholder="กรอกรหัสห้อง 5 ตัว"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  maxLength={5}
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  เข้าร่วมห้อง
                </button>
              </form>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
          </div>
           )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;