import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "ADMIN";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || "ADMIN";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isLoginPage = nextUrl.pathname === "/admin/login";

      if (isOnAdmin) {
        if (isLoginPage) {
          if (isLoggedIn) {
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }
        return isLoggedIn;
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [], // Empty for Edge compatibility; populated in auth.ts
} satisfies NextAuthConfig;
