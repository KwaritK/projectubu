// report.js

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


// กำหนด Schema ของข้อมูลการรีพอร์ต
const reportSchema = new mongoose.Schema({
  User: String,
  user: { type: String, required: true }, // ใช้ email แทน username
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
  const { User, user, reason, additionalInfo } = req.body;
  
  try {
    const newReport = new Report({
      User,
      user,
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
