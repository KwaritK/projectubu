// route.js หรือไฟล์ที่เกี่ยวข้องสำหรับ API
const express = require('express');
const router = express.Router();
import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../lib/mongodb";
import User from '../../../models/user';

// ฟังก์ชันแบนผู้ใช้
export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { userId, duration } = req.body; // รับ duration มาจาก request body
      await connectMongoDB();
  
      // คำนวณเวลาแบนสิ้นสุดจาก duration ที่ส่งมา
      const banEndDate = new Date();
      banEndDate.setHours(banEndDate.getHours() + duration); // เพิ่มชั่วโมงตาม duration
  
      try {
        // ค้นหาผู้ใช้และอัปเดตสถานะการแบน
        const user = await User.findByIdAndUpdate(userId, {
          isBanned: true,
          banEnd: banEndDate,
        });
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json({ message: 'User banned successfully', banEnd: banEndDate });
      } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({ error: 'Failed to ban user' });
      }
    } else {
      // อนุญาตเฉพาะการเรียก POST
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
};


// ฟังก์ชันยกเลิกแบนผู้ใช้
router.post('/unbanUser', async (req, res) => {
    const { userId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, {
            isBanned: false,
            banEnd: null,
            
        });
        res.status(200).send({ message: 'ผู้ใช้ถูกยกเลิกแบนสำเร็จ' });
    } catch (error) {
        res.status(500).send({ error: 'เกิดข้อผิดพลาดในการยกเลิกแบนผู้ใช้' });
    }
});

module.exports = router;
