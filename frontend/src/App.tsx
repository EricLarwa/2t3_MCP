
import { useChat } from "./features/chat/use-chat";
import { ChatInterface } from "./features/chat/components/chat-window";
import { UserPrompt } from "./features/chat/components/message-input";
import { Window } from "./components/ui/window";
import "./index.css";

export function App() {
  const { messages, isLoading, error, handleSendMessage } = useChat();
  return (
    <Window>
      <ChatInterface>
        {messages.map((message, index) => (
          <div key={index} className="w-fit max-w-full whitespace-pre-wrap rounded-md border px-4 py-3 text-sm text-foreground">
            {message}
          </div>
        ))}
        {isLoading ? <p role="status">Sending…</p> : null}
        {error ? <p role="alert">{error}</p> : null}
      </ChatInterface>
      <UserPrompt onSubmit={handleSendMessage} disabled={isLoading} />
    </Window>
  );
}

export default App;
