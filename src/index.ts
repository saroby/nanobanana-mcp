#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGenerateImageTool } from "./tools/generate-image.js";
import { registerListImagesTool } from "./tools/list-images.js";

const server = new McpServer({
  name: "nanobanana-mcp",
  version: "1.0.0",
});

registerGenerateImageTool(server);
registerListImagesTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("nanobanana-mcp server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
