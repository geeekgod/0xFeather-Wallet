import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User';

const { MONGODB_URI, NEXTAUTH_SECRET } = process.env;

const connectionStr = MONGODB_URI || 'mongodb://localhost:27017/BhangaarEth';
const nextAuthSecret = NEXTAUTH_SECRET || 'VC+vjUs01kCfBCS+nG7XokbJUo/ftePbqrHDiUVIYuQ=WhoEverCopiesThisKeyIsGay';

interface Credentials {
  email: string;
  password: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        async authorize(credentials: Credentials) {
          try {
            await mongoose.connect(connectionStr);

            const user = await UserModel.findOne({ email: credentials.email });

            if (user && (await bcrypt.compare(credentials.password, user.password))) {
              return user as User;
            }

            return null;
          } catch (error) {
            console.error(error);
            return null;
          }
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/sign_in',
    newUser: '/auth/sign_up'
  },
  secret: nextAuthSecret
})

export { handler as GET, handler as POST }
