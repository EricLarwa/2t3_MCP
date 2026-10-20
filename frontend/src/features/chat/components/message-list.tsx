import { Card } from "../../../components/ui/card";

type MessageListProps = {
    messages: string[];
    author: "user" | "assistant";
};

function messageClassName(author: "user" | "assistant") {
    return author === "user"
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground";
}

async function MessageList({ messages, author }: MessageListProps) {

    const messageList = messages.map((message, index) => (
        <Card
            key={index}
            className={`w-fit max-w-full whitespace-pre-wrap rounded-md border px-4 py-3 text-sm ${messageClassName(author)}`}
        >
            {message}
        </Card>
    ));
    return <div className="space-y-2">{messageList}</div>;
}

export { MessageList };