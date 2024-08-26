"use client"


import React from 'react'
import Navbar from '../components/Navbar'
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import Link from 'next/link';

function WelcomePage() {
  const { data: session } = useSession();
  console.log(session)
  
  if (!session) redirect('/login');
  

  return (
    <div>
      <Navbar session={session} />
      <div className='container mx-auto py-5 '>
      
        <h3 className='text-3xl my-3'>Welcome </h3>
        <p>Email: {session?.user?.email}</p>
        <hr className='my-3'></hr>
        <p> สวัสดีคร้าบชมรมคนชอบหมี</p>
      </div>
      <Link href="/createroom">
          <button className="custom-button">
            Create a Chat Room
          </button>
        </Link>
        <h1></h1>
        <div>
        <Link href="/gameroom">
          <button className="custom-button">
            Game
          </button>
        </Link>
        </div>
      
    </div>
    
      
  )
}

export default WelcomePage
