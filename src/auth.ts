import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Fixed named import

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. Try to find an Admin
        const admin = await prisma.admin.findUnique({
          where: { email },
        });

        if (admin) {
          const isValid = await bcrypt.compare(password, admin.password);
          if (!isValid) throw new Error("Invalid password");
          if (!admin.isActive) throw new Error("Account disabled");
          
          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role, // SUPER_ADMIN or ADMIN
          };
        }

        // 2. Try to find a User
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          if (!user.password) throw new Error("Please log in with your social account");
          
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) throw new Error("Invalid password");

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: "USER",
            image: user.image,
          };
        }

        throw new Error("No user found with this email");
      },
    }),
  ],
});
