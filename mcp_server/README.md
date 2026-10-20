# mcp_server

The chat app launches this stdio server automatically. From the repository root,
run `bun install`, install this folder's dependencies with `bun install --cwd mcp_server`,
then run `bun dev` (or `bun run backend`). Open `http://localhost:3000`.

Set `ANTHROPIC_API_KEY` in a root `.env` file or `mcp_server/.env`.
Optionally set `ANTHROPIC_MODEL` to override the default `claude-sonnet-4-6`.
The backend reuses one MCP connection and closes it on shutdown.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

To open MCPJam Inspector:

```bash
bun run inspect
```

This uses MCPJam's documented npm launcher. In the inspector, add a STDIO server with command `bun`, arguments
`src/index.ts`, and the working directory set to this `mcp_server` folder.

This project was created using `bun init` in bun v1.4.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
