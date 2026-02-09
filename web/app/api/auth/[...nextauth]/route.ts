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
// --- Try customer login first ---
let res = await fetch(`${API_URL}/auth/customer/login`, { ... });

if (!res.ok) {
  // --- Try outlet login ---
  res = await fetch(`${API_URL}/auth/outlet/login`, { ... });
}

if (!res.ok) return null;
const meRes = await fetch(`${API_URL}/auth/me`, {
  credentials: "include",
});

if (!meRes.ok) return null;

const { user } = await meRes.json();

return {
  id: String(user.id),
  email: user.email,
  name: user.name || user.outlet_name || user.first_name,
  role: user.role,
  outlet_name: user.outlet_name,
  owner_name: user.owner_name,
  first_name: user.first_name,
  last_name: user.last_name,
};

