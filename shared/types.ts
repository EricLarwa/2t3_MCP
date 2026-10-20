/** 
 * A type file for shared types used across the project.
 * 
 * Purpose: This file defines TypeScript types that are shared across different parts of the project, ensuring type safety and consistency.
 */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    id: string;
    content: string;
    role: ChatRole;
}

export interface ChatSendRequest {
    messages: ChatMessage[];
}

export interface ChatSendResponse {
    reply: ChatMessage; // Assistant
}

export interface ChatErrorResponse {
    error: string;
}