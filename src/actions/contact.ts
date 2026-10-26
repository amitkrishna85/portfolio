"use server";

import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { requireAdminSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function submitContactAction(prevState: any, formData: FormData) {
  // 1. Honeypot check (field named 'website_hp' must be empty)
  const honeypot = formData.get("website_hp") as string;
  if (honeypot) {
    // Silently succeed to fool bots
    return { success: true };
  }

  // 2. Rate limiting (max 3 messages per hour per IP)
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for") || "unknown-ip";
  const rateCheck = checkRateLimit(`contact:${forwardedFor}`, 3, 60 * 60 * 1000);
  if (!rateCheck.success) {
    return {
      error: `Too many submissions. Please wait ${Math.ceil(rateCheck.resetInSec / 60)} minutes.`,
    };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const company = (formData.get("company") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  // Email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    // 3. Store in DB
    const saved = await prisma.contactMessage.create({
      data: {
        name,
        email,
        company: company || null,
        subject: subject || "Portfolio Inbound Inquiry",
        message,
      },
    });

    // 4. Optional Resend notification
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "portfolio@resend.dev",
            to: process.env.CONTACT_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "director@industrial-twin.dev",
            subject: `[Portfolio Inquiry] ${subject || name}`,
            text: `From: ${name} (${email})\nCompany: ${company || "N/A"}\n\nMessage:\n${message}`,
          }),
        });
      } catch (emailErr) {
        console.warn("Failed to dispatch Resend email notification:", emailErr);
      }
    }

    return {
      success: true,
      message: "Thank you for reaching out! Your message has been delivered directly to Amit Krishna.",
    };
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return { error: "Failed to submit message. Please try reaching out via LinkedIn." };
  }
}

export async function markMessageReadAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { read: true },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteMessageAction(id: string) {
  await requireAdminSession();
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
