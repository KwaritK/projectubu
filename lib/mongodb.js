import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 30000,  // เพิ่ม timeout เป็น 30 วินาที
            connectTimeoutMS: 30000,  // เพิ่ม timeout เป็น 30 วินาที
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
};
