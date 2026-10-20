import { askClaude } from "../mcp/client";

export async function sendMessage(messages: string[]): Promise<string> {
    const prompt = messages.length === 1
        ? messages[0]!
        : `Continue this conversation by responding to the final entry. Entries are in chronological order:\n${JSON.stringify(messages)}`;
    return askClaude(prompt);
}
