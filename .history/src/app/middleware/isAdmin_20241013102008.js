// src/middleware/isAdmin.js
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Unauthorized access' });
    }
}

module.exports = isAdmin;
