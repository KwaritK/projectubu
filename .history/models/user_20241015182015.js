const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: "user"
    },
    isBanned: { 
        type: Boolean, 
        default: false 
    },
    banEnd: { 
        type: Date, 
        default: null 
    },
    reportCount: { 
        type: Number, 
        default: 0 
    },
    banCount: { 
        type: Number, 
        default: 0 
    },
    banHistory: [{
        reason: String,
        bannedAt: Date,
        bannedUntil: Date,
        bannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;