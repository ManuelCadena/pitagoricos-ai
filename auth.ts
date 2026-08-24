import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      // Check if user is in allowlist
      const isInAllowlist = allowedEmails.includes(email);

      // Find or create user
      let dbUser = await prisma.user.findUnique({ where: { email } });

      if (!dbUser && isInAllowlist) {
        // Create user if in allowlist and doesn't exist
        dbUser = await prisma.user.create({
          data: {
            email,
            name: user.name ?? email.split('@')[0],
            image: user.image,
            isAllowed: true,
          },
        });
        return true;
      }

      if (dbUser && isInAllowlist && !dbUser.isAllowed) {
        // Update existing user to allowed if in allowlist
        await prisma.user.update({
          where: { email },
          data: { isAllowed: true },
        });
        return true;
      }

      // Allow if already approved
      if (dbUser?.isAllowed) return true;

      // Reject otherwise
      return false;
    },
    async jwt({ token, user, account }) {
      if (user?.email) {
        token.email = user.email;
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        token.isAllowed = dbUser?.isAllowed ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
        (session.user as any).isAllowed = token.isAllowed ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/no-autorizado',
  },
});
