"use client"


import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

function Navbar( { session } ) {
  return (
    <nav className='bg-[#333] text-white p-4'>
        <div className="container mx-auto">  
            <div className='flex justify-between item-center'>
                <div>
                    <Link href="/">งานวัด Online</Link>
                </div>
                <ul className='flex'>
                    {!session ?(
                        <>
                        <li className=' mx-3'><Link href="/login">เข้างานวัด</Link></li>
                        <li className=' mx-3 '><Link href="/register">ลงทะเบียนเข้างาน</Link></li>
                        </>

                    ):(
                        
                        <li><a onClick={() => signOut()} className='bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2' style={{ cursor: 'pointer' }}>ออกจากงาน</a></li>
                    )}
                    
                </ul>
            </div>
        </div>



    </nav>

  )
}

export default Navbar