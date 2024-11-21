"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

function Navbar({ session }) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true) // ตั้งค่า isMounted เป็น true เมื่อ component ถูก mount
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: false }) // ป้องกันการเปลี่ยนเส้นทางอัตโนมัติ
    router.push('/') // เปลี่ยนเส้นทางไปที่หน้าแรก
  }

  // เช็คว่า component ถูก mount แล้วหรือยัง
  if (!isMounted) return null

  return (
    <nav className='bg-[#333] text-white p-4 w-full'>
      <div className="w-full max-w-screen-xl mx-auto px-4">  
        <div className='flex justify-between items-center'>
          <div>
            <Link href="/">งานวัด Online</Link>
          </div>
          <ul className='flex'>
            {!session ? (
              <>
                <li className='mx-3'><Link href="/login">เข้างานวัด</Link></li>
                <li className='mx-3'><Link href="/register">ลงทะเบียนเข้างาน</Link></li>
              </>
            ) : (
              <li><button onClick={handleSignOut} className='bg-red-500 text-white border py-2 px-3 rounded-md text-lg'>ออกจากงาน</button></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
