// lib/mongodb.js
import mongoose from "mongoose";

let isConnected = false;

export const connectMongoDB = async () => {
    if (isConnected) {
        console.log('ใช้การเชื่อมต่อ MongoDB ที่มีอยู่');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("เชื่อมต่อกับ MongoDB สำเร็จ");
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ MongoDB:", error);
    }
}