
import { useRef, useState } from "react";
import { sendMessage } from "./chat-api";

const AUTHOR = "user"; // TODO: Make this dynamic based on the actual author of the message.

interface ChatProps {
    messages: string[];
    isLoading: boolean;
    error: string | null;
    handleSendMessage: (newMessage: string) => void;
}

export function useChat(): ChatProps {
    const [messages, setMessages] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const sending = useRef(false);

    const handleSendMessage = async (newMessage: string) => {
        const message = newMessage.trim();
        const authorr = AUTHOR; 
        if (!message || sending.current) return;

        const conversation = [...messages, message];
        sending.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const reply = await sendMessage(conversation);
            setMessages([...conversation, reply]);
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
