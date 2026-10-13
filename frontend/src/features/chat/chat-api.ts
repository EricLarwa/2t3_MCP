/** 
 * A module for handling API calls related to the chat feature.
 * 
 * Purpose: This module provides functions for making API requests to the chat service, including sending messages, retrieving conversation history, and managing user sessions.
*/


export async function sendMessage(messages: string[]): Promise<string> {
    const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
    });
    const data: unknown = await response.json();
    if (!response.ok) {
        const error = data && typeof data === "object" && "error" in data &&
            typeof data.error === "string" ? data.error : "Failed to send message.";
        throw new Error(error);
    }
    if (!data || typeof data !== "object" || !("reply" in data) || typeof data.reply !== "string") {
        throw new Error("Invalid chat response.");
    }
    return data.reply;
}
