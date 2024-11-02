// models/user.js
import mongoose from 'mongoose';

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
        required: false,
        default: "user"
    },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;