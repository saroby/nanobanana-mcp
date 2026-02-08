# @saroby/nanobanana-mcp

Google Gemini image generation MCP server (Nano Banana).

## Features

- **generate_image** - Generate images using Google Gemini models
  - `flash` mode: gemini-2.0-flash-exp (fast, ~2-3s)
  - `pro` mode: imagen-3.0-generate-002 (high quality, ~5-8s)
- **list_images** - List generated images in a directory

## Setup

### Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create an API key

### Install in Claude Code

```bash
claude mcp add nanobanana -e GEMINI_API_KEY=your-key-here -- npx -y @saroby/nanobanana-mcp
```

### Manual Usage

```bash
GEMINI_API_KEY=your-key-here npx @saroby/nanobanana-mcp
```

## Tools

### generate_image

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Image description (1-8192 chars) |
| `model` | `"flash"` \| `"pro"` | No | Model selection (default: flash) |
| `aspect_ratio` | enum | No | `1:1`, `16:9`, `9:16`, `4:3`, `3:4` |
| `negative_prompt` | string | No | Elements to exclude |
| `output_dir` | string | No | Save directory (default: ./nanobanana-images) |
| `count` | number | No | Number of images 1-4 (default: 1) |

### list_images

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `directory` | string | No | Directory to search (default: ./nanobanana-images) |

## Development

```bash
npm install
npm run build
npm run dev  # watch mode
```

## License

MIT
