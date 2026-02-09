import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL } from "@/app/lib/api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          let res = await fetch(`${API_URL}/auth/customer/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            credentials: "include", // <- cookie-based login
          });

          if (!res.ok) {

            res = await fetch(`${API_URL}/auth/outlet/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              credentials: "include",
            });
          }

          if (!res.ok) return null; // login failed

          // --- Fetch /me using cookie ---
          const meRes = await fetch(`${API_URL}/auth/me`, {
            credentials: "include", // <- send cookies automatically
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
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.name = user.name;
        token.outlet_name = (user as any).outlet_name;
        token.owner_name = (user as any).owner_name;
        token.first_name = (user as any).first_name;
        token.last_name = (user as any).last_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).name = token.name;
        (session.user as any).outlet_name = token.outlet_name;
        (session.user as any).owner_name = token.owner_name;
        (session.user as any).first_name = token.first_name;
        (session.user as any).last_name = token.last_name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt", 
  },
  secret: process.env.NEXTAUTH_SECRET || "foodcourt-secret-key-12345",
});

export { handler as GET, handler as POST };

    