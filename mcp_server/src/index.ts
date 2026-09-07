import { config } from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

config();

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
    throw new Error("Missing api key"); 
}

const anthropic = new Anthropic ({ apiKey });

const server = new McpServer({
    name: "claude mcp-server",
    version: "0.0.1"
})

server.registerTool(
    "ask-claude",
    {
        description: "Send a question to Claude and get a response",
        inputSchema: {
            prompt: z.string().min(1)
        }
    },
    async ({ prompt }) => {
        const response = await anthropic.messages.create({
            model: "claude-3.5-sonnet-latest",
            max_tokens: 512,
            messages: [{ role: "user", content: prompt }]
        });

        const text = response.content
            .filter((item) => item.type === "text")
            .map((item) => item.text)
            .join("");

        return {
            content: [{ type: "text", text }]
        };
    }
)
const transport = new StdioServerTransport();
await server.connect(transport);