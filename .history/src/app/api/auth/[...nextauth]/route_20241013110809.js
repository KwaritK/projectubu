import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs';
import { connectMongoDB } from "../../../../../lib/mongodb";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          // เชื่อมต่อฐานข้อมูล MongoDB
          await connectMongoDB();
          
          // ค้นหาผู้ใช้ตามอีเมล
          const user = await User.findOne({ email });

          if (!user) {
            return null; // ไม่มีผู้ใช้ที่มีอีเมลนี้
          }

          // ตรวจสอบรหัสผ่าน
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return null; // รหัสผ่านไม่ตรงกัน
          }
      
          // ส่งข้อมูลผู้ใช้กลับมา รวมถึงบทบาท
          return {
            email: user.email,
            role: user.role, // ต้องแน่ใจว่ามีการเพิ่มบทบาทในแบบนี้
          };
      
        } catch (error) {
          console.log("Error: ", error);
          return null; // คืนค่า null หากเกิดข้อผิดพลาด
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    // เพิ่มข้อมูลบทบาทลงในเซสชัน
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.role = token.role; // เพิ่มบทบาทลงใน session
      return session;
    },
    // เพิ่มบทบาทและอีเมลลงในโทเค็น
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.role = user.role; // เพิ่มบทบาทลงในโทเค็น
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
