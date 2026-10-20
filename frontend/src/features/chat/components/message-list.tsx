import { Card } from "../../../components/ui/card";
import type { ChatMessage } from "../use-chat";

type MessageListProps = {
    messages: ChatMessage[];
};

function messageClassName(author: "user" | "assistant") {
    return author === "user"
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground";
}

function MessageList({ messages }: MessageListProps) {

    const messageList = messages.map((message, index) => (
        <Card
            key={index}
            className={`w-fit max-w-full whitespace-pre-wrap rounded-md border px-4 py-3 text-sm ${messageClassName(message.author)}`}
        >
            {message.content}
        </Card>
    ));
    return <div className="space-y-2">{messageList}</div>;
}

export { MessageList };
