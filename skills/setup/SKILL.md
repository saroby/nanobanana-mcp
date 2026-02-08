---
description: Set up GEMINI_API_KEY for Nanobanana MCP server
allowed-tools: [Read, Write, Edit, AskUserQuestion]
---

# Nanobanana Setup

Configure your GEMINI_API_KEY so the Nanobanana MCP server can generate images using Google Gemini.

## Instructions

1. Ask the user for their Gemini API key using `AskUserQuestion`:
   - Header: "API Key"
   - Question: "Enter your Gemini API key (paste it in 'Other'). You can get one at https://aistudio.google.com/apikey"
   - Options:
     - "I need to get a key first" (description: "Open Google AI Studio to create one")
     - "I already have the MCP server configured" (description: "Skip setup")

2. If the user selects "I need to get a key first", tell them to visit https://aistudio.google.com/apikey and come back when they have a key. Then ask again.

3. If the user selects "I already have the MCP server configured", end the setup.

4. If the user provides a key via "Other", proceed to save it.

5. Read `~/.claude/settings.json` to get the current settings.

6. Update the file to add or merge the `mcpServers` section with the nanobanana config:

```json
{
  "mcpServers": {
    "nanobanana": {
      "command": "npx",
      "args": ["-y", "@saroby/nanobanana-mcp"],
      "env": {
        "GEMINI_API_KEY": "<user's key here>"
      }
    }
  }
}
```

IMPORTANT: Preserve all existing settings in the file. Only add/update the `mcpServers.nanobanana` entry.

7. After saving, tell the user:
   - "GEMINI_API_KEY has been saved successfully."
   - "Please restart Claude Code (`/exit` then reopen) for the MCP server to connect."
