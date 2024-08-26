"use client"

import React, { useState } from 'react'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

function RegisterPage() {

    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [confirmPassword,setConfirmPassword]= useState("");
    const [error,setError]= useState("");
    const [success, setSuccess] = useState("");

    const { data: session } = useSession();
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
      <div className='container mx-auto py-5 '>
        <h3 className="text-center  p-3 ">ลงทะเบียนเข้างานวัด</h3>
        <hr className='my-5' />
        <div className='text-center'>
        <form onSubmit={handleSubmit}>

            {error && (
              <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {error}
              </div>
            )}

            {success && (
              <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {success}
              </div>
            )}
            
            <div className=' mb-4'>
              <h4 className="inline-block">อีเมลล์</h4>
              <input onChange={(e) => setEmail(e.target.value)}  className='block bg-gray-300 p-2 ml-2 rounded-md inline-block' type="email" placeholder='ระบุอีเมลล์ของคุณ' />
            </div>
             <div className=' mb-4'>
              <h4 className="inline-block">รหัสผ่าน</h4>
              <input onChange={(e) => setPassword(e.target.value)} className='block bg-gray-300 p-2 ml-2 rounded-md inline-block' type="password" placeholder='ระบุรหัสผ่าน' />
            </div>
            <div className=' mb-4'>
              <h4 className='inline-block'>ยืนยันรหัสผ่าน</h4>
              <input onChange={(e) => setConfirmPassword(e.target.value)} className='block bg-gray-300 p-2 ml-2 rounded-md inline-block' type="password" placeholder='ยืนยันรหัสผ่านอีกครั้ง' />
            </div>
            <button type='submit' className='bg-green-500 p-2 rounded-md text-white'>ลงทะเบียน</button>
          </form>
        </div>
        <hr className='my-5' />
          <p>หากคุณมีชื่อในงานของเราแล้ว ไปที่  <Link className='text-red-500 hover:underline' href="/login">ลงชื่อเข้างาน</Link> </p>
      </div>
    </div>
  );
}

export default RegisterPage
