import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password!
            );
            if (isPasswordCorrect) {
              return {
                id: user.id,
                email: user.email,
                role: user.role,
              } as any;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      },
    }),
    // Uncomment and configure these providers as needed
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "credentials") {
        return true;
      }

      // Handle OAuth providers
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findFirst({
            where: {
              email: (user as any).email!,
            },
          });

          if (!existingUser) {
            // Create new user for OAuth providers
            await prisma.user.create({
              data: {
                id: nanoid(),
                email: (user as any).email!,
                role: "user",
                // OAuth users don't have passwords
                password: null,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user }: any) {
      // When user signs in (credentials or OAuth), enrich token with our DB user id/role
      if (user) {
        try {
          if ((user as any).email) {
            const dbUser = await prisma.user.findFirst({
              where: { email: (user as any).email },
            });
            if (dbUser) {
              token.id = dbUser.id;
              token.role = dbUser.role;
            } else {
              // Fallbacks to avoid undefined values
              token.id = (user as any).id ?? token.id;
              token.role = (user as any).role ?? token.role ?? "user";
            }
          }
        } catch (e) {
          console.error("JWT callback DB lookup failed:", e);
          token.id = (user as any).id ?? token.id;
          token.role = (user as any).role ?? token.role ?? "user";
        }
        token.iat = Math.floor(Date.now() / 1000); // Issued at time
      }

      // Check if token is expired (15 minutes)
      const now = Math.floor(Date.now() / 1000);
      const tokenAge = now - (token.iat as number);
      const maxAge = 15 * 60; // 15 minutes

      if (tokenAge > maxAge) {
        // Token expired, return empty object to force re-authentication
        return {} as any;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on auth errors
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes in seconds
    updateAge: 5 * 60, // Update session every 5 minutes
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
