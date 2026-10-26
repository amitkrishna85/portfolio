import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { storage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = file.type;
    const isImage = mimeType.startsWith("image/");
    const isPdf = mimeType === "application/pdf";

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Invalid file type. Only images (PNG, JPG, WEBP, SVG) and PDFs are allowed." },
        { status: 400 }
      );
    }

    // Size limits: 5MB for images, 10MB for PDFs
    const maxSizeBytes = isImage ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `File exceeds maximum limit of ${isImage ? "5MB" : "10MB"}` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await storage.upload(buffer, file.name, mimeType);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
