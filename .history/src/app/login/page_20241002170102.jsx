"use client"


import React, { useState } from 'react'
import Navbar from '../../../public/asset/Navbar'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image'
import titleImage from '/public/asset/MAIN.png'


function Loginpage() {

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [error , setError] = useState("");

    const router = useRouter();
    


    const { data: session } = useSession();
    if (session) router.replace('w');

    

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {

          const res = await signIn("credentials",{
            email,password,redirect: false
          })

          if (res.error){
            setError("Invalid credentials");
            return;
          }

          router.replace("map");

      } catch(error){
        console.log(error)
      }
    }


  return (
    
    <div>
      <Navbar/>
      
      <div className='container mx-auto py-5 '>
      <Image src={titleImage} alt="title" className="mx-auto"/>
        <h3 className="text-center  p-3 ">ลงชื่อเข้างานวัด</h3>
        <hr className='my-5' />
        <div className='text-center'>
          <form onSubmit={handleSubmit}>


            {error && (
              <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {error}
              </div>
            )}
            
            <div className=' mb-4'>
              <h4 className="inline-block">อีเมลล์</h4>
              <input type="text" onChange={(e) => setEmail(e.target.value)}  className='block bg-gray-300 p-2 ml-2 rounded-md inline-block'  placeholder='กรอกอีเมลล์ของคุณ' />
            </div>
            <div className=' mb-4'>
              <h4 className="inline-block">รหัสผ่าน</h4>
              <input  type="password"onChange={(e) => setPassword(e.target.value)}  className='block bg-gray-300 p-2 ml-2 rounded-md inline-block'  placeholder='กรอกรหัสผ่าน' />
            </div>
            
            <button type='submit' className='bg-green-500 p-2 rounded-md text-white'>เข้างาน</button>
          </form>
        </div>

        <hr className='my-5' />
          <p>หากคุณยังไม่มีชื่อในงานของเรา ไปที่  <Link className='text-red-500 hover:underline' href="/register">ลงทะเบียนเข้างาน</Link></p>
      </div>
    </div>
  );
}

export default Loginpage
