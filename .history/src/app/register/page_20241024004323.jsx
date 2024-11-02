"use client"

import React, { useState } from 'react'
import Navbar from '../../../public/asset/Navbar'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from "react";
import Image from 'next/image'
import titleImage from '/public/asset/MAIN.png'



function RegisterPage() {

    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [confirmPassword,setConfirmPassword]= useState("");
    const [error,setError]= useState("");
    const [success, setSuccess] = useState("");

    const { data: session, status } = useSession();
    
    // ตรวจสอบการล็อกอิน
  useEffect(() => {
    if (status === 'loading') return; // ยังโหลด session อยู่
    
    

    // ถ้าผู้ใช้ถูกแบน ให้ redirect ไปหน้า banned
    if (session?.user?.isBanned) {
      redirect('/banned');
    }
  }, [session, status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
    if (session) redirect ('/welcome') ;
    
    console.log(email,password,confirmPassword)

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (password != confirmPassword) {
          setError("ระบุรหัสผ่านไม่ตรงกัน !!!");
          return;
      }

      if ( !email || !password || !confirmPassword) {
          setError("Please complete all inputs.");
          return;
      }

      try {

        const resCheck = await fetch("http://localhost:3000/api/check",{
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })

        })

        const { user } = await resCheck.json();

        if ( user ) {
          setError(" มีการลงทะเบียนผู้ใช้นี้ในงานของเราแล้ว !! ");
          return;
        }
        

        const res = await fetch("http://localhost:3000/api/register",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body: JSON.stringify({
              email,password
            })

            
        })

        if (res.ok) {
          const form = e.target;
          setError("");
          setSuccess(" ลงทะเบียนเข้างานสำเร็จ !!! ");
          form.reset();
      } else {
          console.log(" ลงทะเบีนเข้างานไม่สำเร็จ !!! ")
      }

  } catch(error) {
      console.log(" ลงทะเบีนเข้างานไม่สำเร็จ !!! ", error)
  }
    } 
  return (
    
    <div>
      <Navbar/>
      <div className="container mx-auto py-5">
        <Image src={titleImage} alt="title" className="mx-auto w-full max-w-md "/>
        <h3 className="text-center p-3  text-xl md:text-2xl ">ลงทะเบียนเข้างานวัด</h3>
        <hr className="my-5" />
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-lg" >

            {error && (
              <div className="bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
                {success}
              </div>
            )}
            
            <div className="mb-4 flex flex-col md:flex-row justify-center">
              <label className="md:w-32 w-full text-left md:text-right mr-2">อีเมลล์</label>
              <input onChange={(e) => setEmail(e.target.value)} className="bg-gray-300 p-2 rounded-md w-64" type="email" placeholder="ระบุอีเมลล์ของคุณ" />
            </div>

            <div className="mb-4 flex flex-col md:flex-row justify-center">
              <label className="w-32 text-right mr-2">รหัสผ่าน</label>
              <input onChange={(e) => setPassword(e.target.value)} className="bg-gray-300 p-2 rounded-md w-64" type="password" placeholder="ระบุรหัสผ่าน" />
            </div>

            <div className="mb-4 flex justify-center">
              <label className="w-32 text-right mr-2">ยืนยันรหัสผ่าน</label>
              <input onChange={(e) => setConfirmPassword(e.target.value)} className="bg-gray-300 p-2 rounded-md w-64" type="password" placeholder="ยืนยันรหัสผ่านอีกครั้ง" />
            </div>

            <button type="submit" className="bg-green-500 p-2 rounded-md text-white">ลงทะเบียน</button>
          </form>
        </div>
        <hr className="my-5" />
        <p>หากคุณมีชื่อในงานของเราแล้ว ไปที่ <Link className="text-red-500 hover:underline" href="/login">ลงชื่อเข้างาน</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage