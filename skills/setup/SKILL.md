---
description: Set up GEMINI_API_KEY for Nanobanana MCP server
allowed-tools: [Read, Edit, Bash, AskUserQuestion]
---

# Nanobanana Setup

Configure your GEMINI_API_KEY so the Nanobanana MCP server can generate images using Google Gemini.

The MCP server is already registered via the plugin's `.mcp.json`. This setup only needs to set the `GEMINI_API_KEY` environment variable.

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

5. Detect the user's shell profile file:
   - Check if `~/.zshrc` exists (macOS default). If yes, use it.
   - Otherwise check `~/.bashrc`, then `~/.bash_profile`.

6. Read the shell profile file and check if `GEMINI_API_KEY` is already exported.

7. If already set, ask the user if they want to update it. If not set, append the export line:

```bash
# Nanobanana MCP - Gemini API Key
export GEMINI_API_KEY="<user's key here>"
```

If already set, replace the existing `export GEMINI_API_KEY=` line with the new value.

IMPORTANT: Do NOT write MCP server config to `~/.claude/settings.json`. The plugin's `.mcp.json` already handles MCP registration. Only the environment variable needs to be set.

8. After saving, tell the user:
   - "GEMINI_API_KEY has been saved to your shell profile."
   - "Please restart your terminal and Claude Code (`/exit` then reopen) for the MCP server to connect."
   - "Or run `source <profile_file>` in your terminal first, then restart Claude Code."
