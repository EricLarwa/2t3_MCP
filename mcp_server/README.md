# mcp_server

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
