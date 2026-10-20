# Application blueprint

This plan is based on the current repository. It describes the remaining work; it does not implement it. The first milestone is a single chat conversation that sends a prompt through the backend and MCP server, then displays Claude's reply.

## Current wiring

```text
bun dev
  frontend/src/index.ts          Bun HTTP server, despite its folder name
    GET /* -> index.html -> frontend.tsx -> App.tsx
    POST /api/chat/send -> backend/routes/chat.ts

App.tsx
  useChat()
  Window                        Currently renders Header itself
    ChatInterface
      MessageList
      loading/error messages
    UserPrompt

UserPrompt.onSubmit
  -> useChat.handleSendMessage
  -> chat-api.sendMessage
  -> POST /api/chat/send
  -> backend/routes/chat.handleChatSend
  -> backend/services/chat.sendMessage
  -> throws "MCP chat integration is not implemented."
```

## File responsibilities and connections

| File | Responsibility | Connections / remaining work |
| --- | --- | --- |
| `frontend/src/frontend.tsx` | Mount React into the HTML root | Already renders `App`. |
| `frontend/src/App.tsx` | Compose the chat screen | Call `useChat`, render `AppShell`, pass messages and submission callback to children. |
| `frontend/src/components/layout/app-shell.tsx` | Own application layout | Export `AppShell({ children })`; compose `Window`, `Header`, and children. No HTTP or chat state here. |
| `frontend/src/components/ui/window.tsx` | Reusable outer container | Keep styling and children; move feature-specific `Header` into `AppShell`. |
| `frontend/src/features/chat/components/chat-header.tsx` | Render chat header | Already implemented; render from the shell. Add controls only when their behavior exists. |
| `frontend/src/features/chat/components/chat-window.tsx` | Scrollable chat content container | Already implemented as `ChatInterface`; keep network logic out of it. |
| `frontend/src/features/chat/components/message-list.tsx` | Render conversation messages | Make the component synchronous. Accept `ChatMessage[]` and use each message's `id`, `role`, and `content`. |
| `frontend/src/features/chat/components/message-input.tsx` | Submit a user's text | Keep validation/disabled state and the `onSubmit` callback. Preserve or restore the draft after a failed send. |
| `frontend/src/features/chat/use-chat.ts` | Own conversation state | Track messages, loading, errors, and pending submission; call `chat-api`. Append the user message immediately, then append the assistant reply on success. Define retry behavior so a failed message is not duplicated. |
| `frontend/src/features/chat/chat-api.ts` | Browser HTTP adapter | Send the shared request shape, validate response data, and throw readable errors. Never import backend/MCP code. |
| `shared/types.ts` | Define the frontend/backend contract | Export message, request, success-response, and error-response types. Use `import type` from both sides. Runtime validation is still required at HTTP boundaries. |
| `backend/index.ts` | Start and stop the application server | Recommended canonical server entry point: serve the frontend HTML and register the chat route. Handle MCP cleanup during shutdown. |
| `frontend/src/index.ts` | Existing server entry point | Move its server setup into `backend/index.ts`, then retire this entry point and update scripts. Run one HTTP server. |
| `backend/routes/chat.ts` | HTTP request/response handling | Parse and validate messages, call the service, map failures to HTTP responses. Keep provider and MCP details out of this file. |
| `backend/services/chat.ts` | Chat orchestration | Convert the conversation into the MCP tool's input, invoke the MCP adapter, and return assistant text. Replace the unconditional error. |
| `backend/mcp/client.ts` | MCP transport adapter | Replace the Express route draft with an MCP client that connects over stdio, calls `ask-claude`, extracts text, handles tool errors/timeouts, and closes cleanly. |
| `mcp_server/src/index.ts` | Implement the MCP tool | Keep provider credentials and the Claude call here. Currently accepts one prompt; extend its input for structured history when adding proper multi-turn support. |

```

Today both sides use `string[]` and a string reply. Update the hook, API adapter, route, service, and renderer together when adopting this contract. The current array loses the distinction between user and assistant turns, and `App` labels every message as a user message.

Use stable message IDs as React keys. Validate allowed roles, nonempty content, request size, and conversation length on the backend. Shared TypeScript types do not validate untrusted JSON.

## Complete request and response flow

```mermaid
sequenceDiagram
    participant Input as UserPrompt
    participant Hook as useChat
    participant API as chat-api.ts
    participant Route as backend/routes/chat.ts
    participant Service as backend/services/chat.ts
    participant Client as backend/mcp/client.ts
    participant MCP as mcp_server/src/index.ts
    participant Claude
    Input->>Hook: onSubmit(text)
    Hook->>Hook: Append user turn; mark loading
    Hook->>API: sendMessage(conversation)
    API->>Route: POST /api/chat/send
    Route->>Route: Validate JSON and message shape
    Route->>Service: sendMessage(messages)
    Service->>Client: askClaude(prompt)
    Client->>MCP: MCP callTool: ask-claude (stdio)
    MCP->>Claude: Provider messages request
    Claude-->>MCP: Content blocks
    MCP-->>Client: MCP text result or tool error
    Client-->>Service: Assistant text
    Service-->>Route: Assistant message
    Route-->>API: JSON reply
    API-->>Hook: Assistant message
    Hook->>Hook: Append reply; clear loading
```

`MessageList` renders again when the hook updates React state. The backend does not call the renderer directly.

For the existing single-prompt tool, the service can format role-labeled history into a prompt as an initial bridge. For proper multi-turn chat, extend the MCP tool to accept structured conversation turns and pass those turns to the provider. Choose one contract explicitly; do not silently drop history or infer roles from array positions.

## MCP process ownership

The existing MCP server uses `StdioServerTransport`. It does not listen on `http://localhost:3000` and does not implement `/recieve`. Changing that URL's spelling will not connect the current programs.

For the first version, the backend should launch and own the MCP subprocess, using the MCP client SDK's stdio transport. Configure the child command, script path, working directory, and environment explicitly. Keep one connection per backend process, reuse it across chat requests, and close it on shutdown. If initialization is lazy, share the initialization promise so simultaneous requests do not launch multiple children. Surface startup failures and define reconnect behavior.

The root package needs a direct MCP SDK dependency because backend code will import it; the nested package's dependency declaration does not declare it for the root application. Express is unnecessary for the proposed Bun server architecture.

The API key must be available to the MCP subprocess only on the server side. Use stderr for MCP server diagnostics; stdout carries protocol messages. A separate manually launched stdio server cannot be reached by fetching a URL.

## Implementation order

1. **Set the contracts.** Implement `shared/types.ts`, then update the HTTP request/response shapes and runtime validation together.
2. **Finish UI ownership.** Implement `AppShell`, move the header out of `Window`, fix the async `MessageList`, render per-message roles, and define failed-send behavior in `useChat`.
3. **Choose the server entry point.** Move Bun server startup to `backend/index.ts`. Point `dev` and `start` at it. The current `start` script points to missing `src/index.ts`.
4. **Connect MCP.** Implement the stdio client, subprocess lifecycle, tool-result parsing, timeout handling, and cleanup. Replace the chat service stub with a call to this adapter.
5. **Finish conversation support.** Begin with the explicit history-to-prompt bridge or extend the tool schema for structured history. Verify that a follow-up question receives earlier turns.
6. **Handle failures deliberately.** Keep invalid requests at 400. Replace the route's blanket 501 with appropriate server/upstream statuses, such as 502 for an upstream failure and 504 for an upstream timeout. Return safe messages and log diagnostic details server-side.
7. **Verify the full path.** Check successful chat, follow-up context, invalid JSON, invalid messages, missing credentials, subprocess failure, tool errors, duplicate submission prevention, and UI recovery after failure.

## Configuration and packaging work

- `tsconfig.json` maps `@/*` to missing `./src/*`; align it with `./frontend/src/*` if keeping the frontend aliases used by the UI components.
- `components.json` references `styles/globals.css`; align generator configuration with the actual frontend stylesheet so future generated components land correctly.
- `build.ts` currently builds browser assets only. Decide how production serves those assets alongside the API. Correcting `start` alone does not create a production server artifact; verify the selected production path explicitly.
- Document installation for both the root package and `mcp_server`, the subprocess configuration, and required server-side environment variables.
- Verify the configured provider model against the account's available models during implementation. Do not assume the hardcoded model identifier is usable.

## First-release completion criteria

A user can send a message, see it immediately, receive a correctly labeled assistant reply through MCP, and ask a follow-up with context. Invalid input and upstream failures produce readable errors, loading always clears, and the backend cleans up its MCP child on shutdown. Development and production startup commands both target real files and have been exercised.

Persistence, conversation lists, streaming, authentication, model selection, and additional MCP tools can follow after this path works. They do not need placeholder behavior in the first release.
