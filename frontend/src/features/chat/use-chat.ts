
import { useRef, useState } from "react";
import { sendMessage } from "./chat-api";
import type { ChatMessage } from "../../../../shared/types";

interface ChatProps {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    handleSendMessage: (newMessage: string) => void;
}

export function useChat(): ChatProps {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const sending = useRef(false);

    const handleSendMessage = async (newMessage: string) => {
        const message = newMessage.trim();
        if (!message || sending.current) return;

        const conversation: ChatMessage[] = [...messages, { id: crypto.randomUUID(), content: message, role: "user" }];
        sending.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const reply = await sendMessage(conversation.map(({ content }) => content));
            setMessages([...conversation, { id: crypto.randomUUID(), content: reply, role: "assistant" }]);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to send message.");
        } finally {
            sending.current = false;
            setIsLoading(false);
        }
    }

    return { messages, isLoading, error, handleSendMessage };
}

export default useChat;
