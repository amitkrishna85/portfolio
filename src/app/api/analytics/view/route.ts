import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = typeof body.path === "string" ? body.path : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 200) : null;
    const userAgent = req.headers.get("user-agent")?.slice(0, 200) || null;

    // Cookie-less, no IP storage
    await prisma.pageView.create({
      data: {
        path,
        referrer,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
