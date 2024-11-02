const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// กำหนด Schema ของข้อมูลการรีพอร์ต
const reportSchema = new mongoose.Schema({
  User: String, // เก็บข้อมูลอื่นๆ ของผู้ใช้ เช่น ชื่อเล่น
  userEmail: { type: String, required: true }, // ใช้ email แทน username
  reason: String,
  additionalInfo: String,
  date: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);

// GET: ดึงข้อมูลรีพอร์ตทั้งหมดสำหรับแอดมิน
router.get('/all', async (req, res) => {
  try {
    const reports = await Report.find({});
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error retrieving reports:", error);
    res.status(500).json({ message: 'Failed to retrieve reports' });
  }
});

// POST: บันทึกข้อมูลการรีพอร์ต
router.post('/report', async (req, res) => {
  const { User, userEmail, reason, additionalInfo } = req.body;
  
  try {
    const newReport = new Report({
      User,        // ใช้ข้อมูล User เพื่อเก็บ username หรือข้อมูลอื่น ๆ ที่ต้องการ
      userEmail,   // อีเมลของผู้ใช้ที่ถูกรีพอร์ต
      reason,
      additionalInfo,
    });
    await newReport.save();
    
    console.log("Report saved successfully");
    res.status(201).json({ message: 'Report saved successfully' });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: 'Failed to save report' });
  }
});

module.exports = router;