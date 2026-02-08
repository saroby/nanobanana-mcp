import fs from "node:fs";
import path from "node:path";

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function generateFileName(prefix?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix ? prefix + "-" : ""}${timestamp}-${rand}.png`;
}

export function saveBase64Image(
  base64Data: string,
  outputDir: string,
  fileName?: string
): string {
  ensureDir(outputDir);
  const name = fileName || generateFileName("nanobanana");
  const filePath = path.join(outputDir, name);
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export interface ImageFileInfo {
  name: string;
  path: string;
  size: number;
  createdAt: string;
}

export function listImageFiles(dirPath: string): ImageFileInfo[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        imageExtensions.has(path.extname(entry.name).toLowerCase())
    )
    .map((entry) => {
      const fullPath = path.join(dirPath, entry.name);
      const stat = fs.statSync(fullPath);
      return {
        name: entry.name,
        path: fullPath,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
