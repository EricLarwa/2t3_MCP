import { serve } from "bun";
import index from "../frontend/src/index.html";
import { handleChatSend } from "./routes/chat";
import { closeMcp } from "./mcp/client";

const server = serve({
    port: Number(process.env.PORT || 3000),
    idleTimeout: 180,
    routes: {
        "/*": index,
        "/api/chat/send": { POST: handleChatSend },
    },
    development: process.env.NODE_ENV !== "production" && {
        hmr: true,
        console: true,
    },
});

let stopping = false;
async function shutdown() {
    if (stopping) return;
    stopping = true;
    await server.stop(true);
    await closeMcp().catch((error) => console.error("MCP shutdown failed:", error));
    process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`Server running at ${server.url}`);
