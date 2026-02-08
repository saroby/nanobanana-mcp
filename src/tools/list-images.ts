import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { resolveOutputDir } from "../utils/config.js";
import { listImageFiles } from "../utils/file.js";

const ListImagesSchema = {
  directory: z
    .string()
    .optional()
    .describe("Directory to search for images (default: ./nanobanana-images)"),
};

export function registerListImagesTool(server: McpServer): void {
  server.tool(
    "list_images",
    "List generated images in the specified directory.",
    ListImagesSchema,
    async (params) => {
      try {
        const dir = resolveOutputDir(params.directory);
        const files = listImageFiles(dir);

        if (files.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No images found in: ${dir}`,
              },
            ],
          };
        }

        const fileList = files
          .map((f) => {
            const sizeKB = (f.size / 1024).toFixed(1);
            return `- ${f.name} (${sizeKB} KB, ${f.createdAt})`;
          })
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text: `Found ${files.length} image(s) in ${dir}:\n\n${fileList}`,
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: "text", text: `Error listing images: ${message}` }],
          isError: true,
        };
      }
    }
  );
}
