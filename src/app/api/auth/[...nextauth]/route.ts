import NextAuth, { AuthOptions, User as NextUser } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';

const { MONGODB_URI, NEXTAUTH_SECRET } = process.env;

const connectionStr = MONGODB_URI;

if (!connectionStr) {
  throw new Error('MONGODB_URI must be defined');
}

const nextAuthSecret = NEXTAUTH_SECRET;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req: any) {
        try {
          if (!credentials?.email) return null;
          if (!credentials.email) return null;

          // const user = await User.findOne({ email: credentials.email });
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (user && (await compare(credentials.password, user.password))) {
            return user;
          }

          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  secret: nextAuthSecret,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/sign_in',
    newUser: '/auth/sign_up',
  },
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
        };
      }
      return token;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
