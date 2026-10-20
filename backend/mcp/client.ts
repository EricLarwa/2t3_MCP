import { express, Response, Request } from "express";

const app = express();
app.use(express.json());

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3000";

app.post("/api/chat/send", async (req: Request, res: Response) => {
    const { messages } = req.body;
    // Process the messages
    const reply = await fetch(`${MCP_SERVER_URL}/recieve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
    });
    const data = await reply.json();
    res.json(data);

});