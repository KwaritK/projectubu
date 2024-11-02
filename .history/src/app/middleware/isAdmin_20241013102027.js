// isAdmin.js
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') { // ตรวจสอบว่ามี user และ role เป็น admin
        next(); // ถ้าใช่ ส่งต่อไปยัง handler หรือ middleware ถัดไป
    } else {
        res.status(403).json({ message: 'Unauthorized access' }); // แจ้งเตือนหากไม่ใช่ admin
    }
}

module.exports = isAdmin; // ส่งออกไปใช้งานในไฟล์อื่น
