import path from "node:path";

export function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      "API key not found. Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.\n" +
        "Get your key at: https://aistudio.google.com/apikey"
    );
  }
  return key;
}

export const DEFAULT_OUTPUT_DIR = process.env.IMAGE_OUTPUT_DIR || "./nanobanana-images";

export const MODELS = {
  flash: "gemini-2.0-flash-exp",
  pro: "imagen-3.0-generate-002",
} as const;

export type ModelType = keyof typeof MODELS;

export const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;
export type AspectRatio = (typeof ASPECT_RATIOS)[number];

export function resolveOutputDir(outputDir?: string): string {
  const dir = outputDir || DEFAULT_OUTPUT_DIR;
  return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
}
