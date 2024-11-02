"use client"
import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'


function Navbar({ session }) {
  return (
    <nav className='!bg-#808B96] text-white p-3 w-full '>
    <div className="w-full max-w-screen-xl mx-auto px-4">  
      <div className='flex justify-between items-center'>
          <div>
            <Link href="/welcome">งานวัด Online</Link>
          </div>
          <ul className='flex'>
            {!session ? (
              <>
                <li className='mx-2 '><Link href="/login">เข้างานวัด</Link></li>
                <h4>      </h4>
                <li className='mx-3'><Link href="/register"> ลงทะเบียนเข้างาน</Link></li>
              </>
            ) : (
              <><li><button onClick={() => signOut({ callbackUrl: '/' })} className='bg-red-500 text-white border py-2 px-3 rounded-md text-lg'>ออกจากงาน</button></li></>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar