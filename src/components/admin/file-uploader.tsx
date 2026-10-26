"use client";

import * as React from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  description?: string;
  isPdf?: boolean;
}

export function FileUploader({
  value,
  onChange,
  accept = "image/*",
  label = "Upload File",
  description,
  isPdf = false,
}: FileUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          {label}
        </label>
      )}

      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/60">
          {!isPdf && value.startsWith("/") ? (
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border border-border flex-shrink-0">
              <Image src={value} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-foreground truncate">{value}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Attached
            </span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-primary/50 bg-card/30 hover:bg-muted/30 rounded-lg p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="p-2 rounded-full bg-muted text-muted-foreground">
            <Upload className="w-4 h-4" />
          </div>
          <div className="text-xs font-medium text-foreground">
            {uploading ? "Uploading..." : `Click to upload ${isPdf ? "PDF document" : "image"}`}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isPdf ? "PDF up to 10MB" : "PNG, JPG, WEBP, SVG up to 5MB"}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
      {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
    </div>
  );
}
