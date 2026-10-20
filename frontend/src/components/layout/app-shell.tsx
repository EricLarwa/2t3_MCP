/** 
 * A component for the main application shell.
 * 
 * Purpose: This component provides the overall structure and layout for the application, including the header, sidebar, and main content area.
*/
import { Window } from "../ui/window";

import { MessageList } from "../../features/chat/components/message-list";
import { useChat } from "../../features/chat/use-chat";
import { UserPrompt } from "../../features/chat/components/message-input";
import { ChatInterface } from "../../features/chat/components/chat-window";

export function AppShell() {
    const { messages, isLoading, error, handleSendMessage } = useChat();
    return (
        <Window>
            <ChatInterface>
                <MessageList messages={messages} author="user" />
                {isLoading ? <p role="status">Sending…</p> : null}
                {error ? <p role="alert">{error}</p> : null}
            </ChatInterface>
        <UserPrompt onSubmit={handleSendMessage} disabled={isLoading} />
    </Window>
    )
}