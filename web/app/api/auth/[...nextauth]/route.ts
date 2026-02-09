import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL } from "@/app/lib/api";

const handler = NextAuth({
  providers: [],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "foodcourt-secret-key-12345",
});

export { handler as GET, handler as POST };


CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;
    return null;
  },
}),
