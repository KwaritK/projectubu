// route.js หรือไฟล์ที่เกี่ยวข้องสำหรับ API
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // แก้ไขตามโครงสร้างโฟลเดอร์ของคุณ

// ฟังก์ชันแบนผู้ใช้
router.post('/banUser', async (req, res) => {
    const { userId, duration } = req.body;

    // คำนวณเวลาแบนสิ้นสุด
    const banEndDate = new Date();
    banEndDate.setHours(banEndDate.getHours() + duration);

    try {
        await User.findByIdAndUpdate(userId, {
            isBanned: true,
            banEnd: banEndDate,
            
        });
        res.status(200).send({ message: 'ผู้ใช้ถูกแบนสำเร็จ' });
    } catch (error) {
        res.status(500).send({ error: 'เกิดข้อผิดพลาดในการแบนผู้ใช้' });
    }
});

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
