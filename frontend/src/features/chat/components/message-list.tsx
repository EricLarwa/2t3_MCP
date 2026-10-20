import { Card } from "../../../components/ui/card";
import type { ChatMessage } from "../../../../../shared/types";

type MessageListProps = {
    messages: ChatMessage[];
};

function messageClassName(role: "user" | "assistant") {
    return role === "user"
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground";
}

function MessageList({ messages }: MessageListProps) {

    const messageList = messages.map((message, index) => (
        <Card
            key={index}
            className={`w-fit max-w-full whitespace-pre-wrap rounded-md border px-4 py-3 text-sm ${messageClassName(message.role)}`}
        >
            {message.content}
        </Card>
    ));
    return <div className="space-y-2">{messageList}</div>;
}

export { MessageList };
