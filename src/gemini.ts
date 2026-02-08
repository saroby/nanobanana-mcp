import { GoogleGenAI } from "@google/genai";
import { getApiKey, MODELS, type ModelType, type AspectRatio } from "./utils/config.js";

export interface GenerateImageOptions {
  prompt: string;
  model?: ModelType;
  aspectRatio?: AspectRatio;
  negativePrompt?: string;
  count?: number;
}

export interface GeneratedImage {
  base64Data: string;
  mimeType: string;
}

export async function generateImages(
  options: GenerateImageOptions
): Promise<GeneratedImage[]> {
  const apiKey = getApiKey();
  const genai = new GoogleGenAI({ apiKey });

  const model = options.model || "flash";
  const modelId = MODELS[model];
  const count = options.count || 1;

  const images: GeneratedImage[] = [];

  for (let i = 0; i < count; i++) {
    const image = await generateWithGemini(genai, modelId, options);
    if (image) {
      images.push(image);
    }
  }

  return images;
}

async function generateWithGemini(
  genai: GoogleGenAI,
  modelId: string,
  options: GenerateImageOptions
): Promise<GeneratedImage | null> {
  let promptText = options.prompt;
  if (options.negativePrompt) {
    promptText += `\n\nAvoid: ${options.negativePrompt}`;
  }
  if (options.aspectRatio && options.aspectRatio !== "1:1") {
    promptText += `\n\nAspect ratio: ${options.aspectRatio}`;
  }

  const response = await genai.models.generateContent({
    model: modelId,
    contents: [{ role: "user", parts: [{ text: promptText }] }],
    config: {
      responseModalities: ["image", "text"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) return null;

  for (const part of parts) {
    if (part.inlineData?.data && part.inlineData.mimeType?.startsWith("image/")) {
      return {
        base64Data: part.inlineData.data,
        mimeType: part.inlineData.mimeType,
      };
    }
  }

  return null;
}
