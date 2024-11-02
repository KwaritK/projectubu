import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs'
import { connectMongoDB } from "../../../../../lib/mongodb";


  const authOptions = {
    
    providers: [
        CredentialsProvider({
          name: 'credentials',
          credentials: {},
          async authorize(credentials) {
           
            const { email, password } = credentials;

            try {

                await connectMongoDB();
                const user = await User.findOne({ email });

                if (!user) {
                    return null; //ไม่มีผู้ใช้ที่มีอีเมลนี้
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return null; // รหัสผ่านไม่ตรงกัน
                } 

                console.log(user);
                return user; // ส่งข้อมูลผู้ใช้กลับมา หากรหัสผ่านตรงกัน

            } catch(error) {
                console.log("Error: ", error) // เพิ่มคืนค่า null หากเกิดข้อผิดพลาด
                return null;
            }

          }
        })
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.email = user.email;
          token.role = user.role; // เพิ่มบรรทัดนี้เพื่อรวม role ใน token
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          //session.user.email = token.email;
          session.user.role = token.role; // เพิ่มบรรทัดนี้เพื่อรวม role ใน session
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
  }
  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST }