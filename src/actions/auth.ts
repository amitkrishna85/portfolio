"use server";

import { signIn, signOut } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { AuthError } from "next-auth";

export async function loginAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for") || "unknown-ip";
  const rateLimitKey = `login:${forwardedFor}:${email.toLowerCase().trim()}`;

  const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
  if (!rateCheck.success) {
    return {
      error: `Too many login attempts. Please wait ${rateCheck.resetInSec} seconds before trying again.`,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Authentication failed. Please check your credentials." };
      }
    }
    // Important: Next.js redirect throws NEXT_REDIRECT which must be rethrown
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
