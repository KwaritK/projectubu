// route.js หรือไฟล์ที่เกี่ยวข้องสำหรับ API
const express = require('express');
const router = express.Router();
import { NextResponse } from 'next/server';
import { connectMongoDB } from "../../../../lib/mongodb";
import User from '../../../models/user';

// ฟังก์ชันแบนผู้ใช้
export default async function handler(req, res) {
    if (req.method === 'POST') {

    const { userId, isBanned, banEnd } = req.body;
    await connectMongoDB();
    

    // คำนวณเวลาแบนสิ้นสุด
    const banEndDate = new Date();
    banEndDate.setHours(banEndDate.getHours() + duration);

    try {
        await User.findByIdAndUpdate(userId, {
            isBanned: true,
            banEnd: banEndDate,
            
        });
        res.status(200).json({ message: 'แบนผู้ใช้สำเร็จ' });
    } catch (error) {
        console.error('Error banning user:', error);
        res.status(500).json({ error: 'ไม่สามารถแบนผู้ใช้ได้' });
    }
} else {
    res.status(405).json({ message: 'Method not allowed' });
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
