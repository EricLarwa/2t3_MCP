import { sendMessage } from "../services/chat";

export async function handleChatSend(req: Request): Promise<Response> {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const messages = body && typeof body === "object" && "messages" in body
        ? body.messages : undefined;
    if (!Array.isArray(messages) || messages.length === 0 ||
        !messages.every((message): message is string =>
            typeof message === "string" && message.trim().length > 0)) {
        return Response.json({ error: "messages must be a nonempty array of nonempty strings." }, { status: 400 });
    }

    try {
        const reply = await sendMessage(messages);
        return Response.json({ reply });
    } catch (error) {
        console.error("MCP chat request failed:", error);
        return Response.json({
            error: error instanceof Error ? error.message : "Failed to send message.",
        }, { status: 502 });
    }
}
