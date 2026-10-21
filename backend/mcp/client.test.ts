import { expect, test } from "bun:test";
import { closeMcp, connectMcp } from "./client";

test("connects over stdio, shares the connection, and discovers ask-claude", async () => {
    const previousKey = process.env.ANTHROPIC_API_KEY;
    process.env.ANTHROPIC_API_KEY = "connection-test-only";
    try {
        const [first, second] = await Promise.all([connectMcp(), connectMcp()]);
        expect(first).toBe(second);
        const { tools } = await first.listTools();
        expect(tools.some((tool) => tool.name === "ask-claude")).toBe(true);
        const result = await first.callTool({ name: "ask-claude", arguments: { prompt: "" } });
        expect(result.isError).toBe(true);
    } finally {
        await closeMcp();
        if (previousKey === undefined) delete process.env.ANTHROPIC_API_KEY;
        else process.env.ANTHROPIC_API_KEY = previousKey;
    }
}, 20_000);
