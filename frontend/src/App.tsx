
import { ChatInterface } from "./components/ui/chat_window/chat_interface";
import { Window } from "./components/ui/window";
import { UserPrompt } from "./components/ui/chat_window/user_prompt";
import "./index.css";

export function App() {
  return (
    <Window>
      <ChatInterface>
        <div className="w-fit max-w-full rounded-md border px-4 py-3 text-sm text-foreground">
          Chat is Rendering
        </div>
      </ChatInterface>
      <UserPrompt onSubmit={(value) => console.log(value)} />
    </Window>
  );
}

export default App;
