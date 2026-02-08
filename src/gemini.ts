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

  if (model === "flash") {
    for (let i = 0; i < count; i++) {
      const image = await generateWithFlash(genai, modelId, options);
      if (image) {
        images.push(image);
      }
    }
  } else {
    const result = await generateWithImagen(genai, modelId, options, count);
    images.push(...result);
  }

  return images;
}

async function generateWithFlash(
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

async function generateWithImagen(
  genai: GoogleGenAI,
  modelId: string,
  options: GenerateImageOptions,
  count: number
): Promise<GeneratedImage[]> {
  const config: Record<string, unknown> = {
    numberOfImages: count,
  };
  if (options.aspectRatio) {
    config.aspectRatio = options.aspectRatio;
  }
  if (options.negativePrompt) {
    config.negativePrompt = options.negativePrompt;
  }

  const response = await genai.models.generateImages({
    model: modelId,
    prompt: options.prompt,
    config,
  });

  const images: GeneratedImage[] = [];
  if (response.generatedImages) {
    for (const img of response.generatedImages) {
      if (img.image?.imageBytes) {
        images.push({
          base64Data: img.image.imageBytes,
          mimeType: "image/png",
        });
      }
    }
  }

  return images;
}
