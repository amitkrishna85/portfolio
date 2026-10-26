import fs from "fs/promises";
import path from "path";

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  upload(file: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult>;
  delete(filename: string): Promise<void>;
  getUrl(filename: string): string;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;
  private publicPrefix: string;

  constructor(uploadDir = "public/uploads", publicPrefix = "/uploads") {
    this.uploadDir = path.join(process.cwd(), uploadDir);
    this.publicPrefix = publicPrefix;
  }

  private async ensureDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    await this.ensureDir();

    // Sanitize and generate unique safe filename
    const ext = path.extname(originalFilename).toLowerCase();
    const baseName = path
      .basename(originalFilename, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const finalFilename = `${baseName}-${uniqueSuffix}${ext}`;
    const filePath = path.join(this.uploadDir, finalFilename);

    await fs.writeFile(filePath, file);

    return {
      url: `${this.publicPrefix}/${finalFilename}`,
      filename: finalFilename,
      size: file.length,
      mimeType,
    };
  }

  async delete(filename: string): Promise<void> {
    try {
      const sanitized = path.basename(filename);
      const filePath = path.join(this.uploadDir, sanitized);
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore if file doesn't exist
      console.warn("Storage deletion error:", error);
    }
  }

  getUrl(filename: string): string {
    const sanitized = path.basename(filename);
    return `${this.publicPrefix}/${sanitized}`;
  }
}

// Default storage instance. Can easily swap to S3 or Vercel Blob by supplying S3StorageProvider
export const storage: StorageProvider = new LocalStorageProvider();
