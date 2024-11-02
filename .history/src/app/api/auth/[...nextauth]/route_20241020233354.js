import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs'
import { connectMongoDB } from "../../../../../lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        console.log('Authorize function called with email:', email);
        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          console.log('User found:', user ? 'Yes' : 'No');
          if (!user) {
            console.log('User not found');
            throw new Error("ไม่พบบัญชีผู้ใช้");
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          console.log('Password match:', passwordMatch);
          if (!passwordMatch) {
            console.log('Password does not match');
            throw new Error("รหัสผ่านไม่ถูกต้อง");
          }
          if (user.isBanned && user.banEnd > new Date()) {
            console.log('User is banned until:', user.banEnd);
            throw new Error(`บัญชีของคุณถูกระงับจนถึง ${user.banEnd.toLocaleString()}`);
          }
          console.log('Authorization successful');
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
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
      console.log('JWT callback called');
      if (user) {
        console.log('User information added to token');
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback called');
      if (token) {
        console.log('Token information added to session');
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.token;
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
