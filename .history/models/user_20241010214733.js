const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    {
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        role: {
            type: String,
            requiired: false,
            default:"user"
        },
        isBanned: 
        { type: Boolean, 
            default: false 
        },
        banEnd: 
        { type: Date, 
            default: null 
        },
    },
    { timestamps: true}
)

const User = mongoose.models.User || mongoose.model("User",userSchema);
