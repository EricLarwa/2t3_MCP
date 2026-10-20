
import { useChat } from "./features/chat/use-chat";
import { ChatInterface } from "./features/chat/components/chat-window";
import { UserPrompt } from "./features/chat/components/message-input";
import { Window } from "./components/ui/window";
import "./index.css";
import { MessageList } from "./features/chat/components/message-list";

export function App() {
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
  );
}

export default App;
