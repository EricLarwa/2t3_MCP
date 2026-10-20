import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport, getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolResultSchema } from "@modelcontextprotocol/sdk/types.js";

let connection: Promise<Client> | undefined;

export function connectMcp(): Promise<Client> {
    if (connection) return connection;

    const client = new Client({ name: "chat-backend", version: "0.1.0" });
    const env = getDefaultEnvironment();
    for (const name of ["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL"]) {
        if (process.env[name]) env[name] = process.env[name]!;
    }
    const transport = new StdioClientTransport({
        command: process.execPath,
        args: [fileURLToPath(new URL("../../mcp_server/src/index.ts", import.meta.url))],
        cwd: fileURLToPath(new URL("../../mcp_server/", import.meta.url)),
        env,
        stderr: "inherit",
    });

    const pending = client.connect(transport, { timeout: 15_000 })
        .then(() => client)
        .catch(async (error) => {
            await client.close().catch(() => {});
            if (connection === pending) connection = undefined;
            throw error;
        });
    connection = pending;
    client.onclose = () => {
        if (connection === pending) connection = undefined;
    };
    return pending;
}

export async function askClaude(prompt: string): Promise<string> {
    const client = await connectMcp();
    const result = CallToolResultSchema.parse(await client.callTool(
        { name: "ask-claude", arguments: { prompt } },
        CallToolResultSchema,
        { timeout: 120_000 },
    ));
    const text = result.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n");
    if (result.isError) throw new Error(text || "MCP tool failed.");
    if (!text.trim()) throw new Error("MCP returned an empty reply.");
    return text;
}

export async function closeMcp(): Promise<void> {
    const pending = connection;
    connection = undefined;
    if (pending) await (await pending).close();
}
