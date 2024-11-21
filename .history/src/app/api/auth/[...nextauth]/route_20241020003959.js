import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs';
import { connectMongoDB } from "../../../../../lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          // เชื่อมต่อกับ MongoDB
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("ไม่พบบัญชีผู้ใช้");
          }

          // ตรวจสอบรหัสผ่าน
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw new Error("รหัสผ่านไม่ถูกต้อง");
          }

          // ตรวจสอบสถานะการแบน
          if (user.isBanned && user.banEnd > new Date()) {
            throw new Error(`บัญชีของคุณถูกระงับจนถึง ${user.banEnd.toLocaleString()}`);
          }

          // คืนค่า user กลับไปเพื่อใช้ใน JWT
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isBanned: user.isBanned,
            banEnd: user.banEnd,
          };
        } catch (error) {
          console.log("Error in authorize:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    // การสร้าง JWT จากข้อมูลผู้ใช้
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isBanned = user.isBanned;
        token.banEnd = user.banEnd;
      }
      return token;
    },
    // การสร้าง session โดยใช้ JWT token
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isBanned = token.isBanned;
        session.user.banEnd = token.banEnd;
      }

      // ตรวจสอบสถานะแบนเมื่อดึง session
      if (session.user.isBanned && new Date(session.user.banEnd) > new Date()) {
        // เปลี่ยนเส้นทางไปยังหน้าบัญชีที่ถูกแบน หรือแสดง error
        throw new Error(`บัญชีของคุณถูกระงับจนถึง ${new Date(session.user.banEnd).toLocaleString()}`);
      }

      return session;
    }
  },
  session: {
    strategy: "jwt", // ใช้ JWT ในการจัดการ session
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // กำหนดหน้า login
  },
};

// ใช้งาน NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
