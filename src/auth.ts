import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL || "director@industrial-twin.dev";
        let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

        // Fallback default hash for 'AdminIndustrial2025!' (in case env var is missing or unescaped in dotenv-expand)
        const DEFAULT_ADMIN_HASH = "$2a$10$9H7b/JxYumQVDtD8aT/SweuG0XveUlnGAPewaF68WpuLRFwv1f5y.";

        if (adminPasswordHash) {
          // Strip quotes if present
          adminPasswordHash = adminPasswordHash.replace(/^["']|["']$/g, "").trim();
          // Unescape backslash-escaped dollar signs if pasted literally in Vercel UI
          adminPasswordHash = adminPasswordHash.replace(/\\(\$)/g, "$1");
        }

        if (!adminPasswordHash || !adminPasswordHash.startsWith("$2")) {
          adminPasswordHash = DEFAULT_ADMIN_HASH;
        }

        const emailMatch =
          String(credentials.email).toLowerCase().trim() === adminEmail.toLowerCase().trim();

        if (!emailMatch) {
          return null;
        }

        const cleanHash = adminPasswordHash;
        const inputPassword = String(credentials.password);

        let passwordMatch = await bcrypt.compare(inputPassword, cleanHash);
        if (!passwordMatch && inputPassword.trim() !== inputPassword) {
          passwordMatch = await bcrypt.compare(inputPassword.trim(), cleanHash);
        }

        if (!passwordMatch) {
          console.warn("[Auth] Password comparison failed for email:", credentials.email);
          return null;
        }

        return {
          id: "admin-user",
          name: "Director of Engineering",
          email: adminEmail,
          role: "ADMIN",
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || "industrial-twin-dev-super-secret-key-32chars",
});
