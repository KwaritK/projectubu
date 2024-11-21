import { NextResponse} from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from 'bcryptjs'
imp



export async function POST(req) {
    try {
        const{ email,password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await User.create({email,password: hashedPassword})

         

         return NextResponse.json({ message: "User registered."},{status: 201})


    } catch(error){
        return NextResponse.json({ message:"An error occured while registertrating the user." },{ status : 500});
    }
}