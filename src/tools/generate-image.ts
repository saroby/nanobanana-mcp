import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generateImages } from "../gemini.js";
import { resolveOutputDir, ASPECT_RATIOS } from "../utils/config.js";
import { saveBase64Image } from "../utils/file.js";

const GenerateImageSchema = {
  prompt: z
    .string()
    .min(1)
    .max(8192)
    .describe("Image description prompt (1-8192 characters)"),
  model: z
    .enum(["flash", "pro"])
    .optional()
    .default("flash")
    .describe("Model to use: 'flash' (fast, gemini-2.0-flash-exp) or 'pro' (high quality, imagen-3.0)"),
  aspect_ratio: z
    .enum(ASPECT_RATIOS)
    .optional()
    .default("1:1")
    .describe("Image aspect ratio"),
  negative_prompt: z
    .string()
    .optional()
    .describe("Elements to exclude from the image"),
  output_dir: z
    .string()
    .optional()
    .describe("Output directory path (default: ./nanobanana-images)"),
  count: z
    .number()
    .int()
    .min(1)
    .max(4)
    .optional()
    .default(1)
    .describe("Number of images to generate (1-4)"),
};

export function registerGenerateImageTool(server: McpServer): void {
  server.tool(
    "generate_image",
    "Generate images using Google Gemini models. Supports 'flash' (fast, gemini-2.0-flash-exp) and 'pro' (high quality, imagen-3.0) models.",
    GenerateImageSchema,
    async (params) => {
      try {
        const outputDir = resolveOutputDir(params.output_dir);

        const images = await generateImages({
          prompt: params.prompt,
          model: params.model,
          aspectRatio: params.aspect_ratio,
          negativePrompt: params.negative_prompt,
          count: params.count,
        });

        if (images.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "No images were generated. Try a different prompt or model.",
              },
            ],
          };
        }

        const savedPaths: string[] = [];
        const contentItems: Array<
          | { type: "text"; text: string }
          | { type: "image"; data: string; mimeType: string }
        > = [];

        for (const image of images) {
          const filePath = saveBase64Image(image.base64Data, outputDir);
          savedPaths.push(filePath);

          contentItems.push({
            type: "image",
            data: image.base64Data,
            mimeType: image.mimeType,
          });
        }

        contentItems.unshift({
          type: "text",
          text: `Generated ${images.length} image(s):\n${savedPaths.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\nModel: ${params.model || "flash"}\nPrompt: ${params.prompt}${params.negative_prompt ? `\nNegative: ${params.negative_prompt}` : ""}`,
        });

        return { content: contentItems };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error generating image: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
