import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/user";
import Report from "../../../../../models/report";
import bcrypt from 'bcryptjs'
import { connectMongoDB } from "../../../../../lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          console.log("Connecting to MongoDB...");
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) {
            console.log("User not found");
            throw new Error("ไม่พบบัญชีผู้ใช้");
          }
          console.log("User found, verifying password...");
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            console.log("Password mismatch");
            throw new Error("รหัสผ่านไม่ถูกต้อง");
          }
          // เช็คสถานะการแบน
          if (user.isBanned && user.banEnd > new Date()) {
            console.log(`User is banned until ${user.banEnd}`);
            
            const report = await Report.findOne({ reportedUser: user._id }).sort({ timestamp: -1 });
            const reason = report ? report.reason : "ไม่มีเหตุผลการแบน";
            
            throw new Error(`บัญชีของคุณถูกระงับจนถึง ${user.banEnd.toLocaleString()} | เหตุผล: ${reason}`);
          }
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isBanned: user.isBanned,
            banEnd: user.banEnd,
            reason: Report ? Report.reason : null,  // เพิ่มเหตุผล
           
          };
        } catch(error) {
          console.log("Error in authorize:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isBanned = user.isBanned;
        token.banEnd = user.banEnd;
        token.reason = user.reason;  // เก็บ reason ใน token
        
      } else {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.isBanned = dbUser.isBanned;
          token.banEnd = dbUser.banEnd;
          // ค้นหาเหตุผลการแบนจากรายงาน
          const report = await Report.findOne({ reportedUser: dbUser._id }).sort({ timestamp: -1 });
          token.reason = report ? report.reason : null;
          
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isBanned = token.isBanned;
        session.user.banEnd = token.banEnd;
        session.user.reason = token.reason;  // เพิ่มข้อมูล reason
        
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }