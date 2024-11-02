import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import Us
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
        async session({ session, token }) {
          session.user.email = token.email;
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.email = user.email;
          }
          return token;
        }
      },
      
}

const handler = NextAuth(authOptions);
export { handler as GET , handler as POST }