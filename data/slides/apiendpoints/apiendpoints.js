// Topic: OpenAI & Anthropic API Endpoints
const slides_api_endpoints = [
        {
            id: "api-endpoints-title",
            title: "OpenAI & Anthropic API Endpoints",
            content: C.titleSlide(
                "OpenAI & Anthropic API Endpoints",
                "REST architecture, provider-compatible endpoints, and connecting external tools",
                "90 minutes"
            )
        },
        {
            id: "api-endpoints-overview",
            title: "API Endpoints — Architecture Overview",
            content: `
                <h2>API Endpoints — Architecture Overview</h2>
                <p class="lead">SEMOSS exposes provider-compatible REST endpoints that allow any OpenAI or Anthropic SDK client to connect directly — including tools like Claude Code, OpenAI Codex, and custom applications.</p>
                <h3>How It Works</h3>
                <p>The Java Tomcat server hosts JAX-RS endpoint classes that accept requests in native provider formats, normalize them internally, route to any registered model engine, and return responses in the expected provider format.</p>
                ${C.flow([
                    { title: 'External Client', desc: 'OpenAI SDK, Anthropic SDK, Claude Code, Codex, curl, etc.' },
                    { title: 'SEMOSS REST Endpoint', desc: 'OpenAIEndpoints.java or AnthropicEndpoints.java receives the request', arrow: '→' },
                    { title: 'Room & Message Pipeline', desc: 'Request is normalized, routed through Room/Insight architecture to the model engine', arrow: '→' },
                    { title: 'Provider Response', desc: 'Response formatted back into OpenAI or Anthropic spec (streaming SSE or JSON)', accent: true },
                ])}
                ${C.callout('<strong>Provider agnostic routing:</strong> The endpoint format determines how the request is <em>received</em> and <em>returned</em> — but the backend model can be any registered engine (OpenAI, Anthropic, Google, local vLLM, etc.). You can hit the OpenAI endpoint and have it route to a Claude model, or vice versa.', 'tip')}
                <h3>Endpoint Classes</h3>
                ${C.table(
                    ['Class', 'Base Path', 'Purpose'],
                    [
                        ['<code>OpenAIEndpoints.java</code>', '<code>/model/openai</code>', 'OpenAI-compatible endpoints for chat completions, responses, completions, embeddings, and model listing'],
                        ['<code>AnthropicEndpoints.java</code>', '<code>/model/anthropic</code>', 'Anthropic Messages API-compatible endpoint for Claude Code and Anthropic SDK clients'],
                        ['<code>OpenAIChatCompletionsHelper.java</code>', '—', 'Formats responses and streaming SSE chunks in OpenAI chat completion format'],
                        ['<code>OpenAIResponsesHelper.java</code>', '—', 'Formats responses and streaming SSE events in OpenAI Responses API format'],
                        ['<code>AnthropicMessagesHelper.java</code>', '—', 'Normalizes Anthropic messages to internal format, formats responses and SSE events in Anthropic spec'],
                    ]
                )}
            `
        },
        {
            id: "api-endpoints-openai",
            title: "OpenAI Endpoints",
            content: `
                <h2>OpenAI Endpoints</h2>
                <p class="lead">The <code>OpenAIEndpoints</code> class at <code>/model/openai</code> implements the full set of OpenAI-compatible API endpoints.</p>
                <h3>Available Endpoints</h3>
                ${C.table(
                    ['Method', 'Path', 'Description'],
                    [
                        ['<code>POST</code>', '<code>/model/openai/chat/completions</code>', 'Chat Completions API — the most commonly used endpoint. Supports streaming and non-streaming.'],
                        ['<code>POST</code>', '<code>/model/openai/v1/chat/completions</code>', 'Alias for the above (includes <code>/v1</code> prefix for SDK compatibility)'],
                        ['<code>POST</code>', '<code>/model/openai/responses</code>', 'OpenAI Responses API — newer format used by Codex and agents. Supports function calls and streaming.'],
                        ['<code>POST</code>', '<code>/model/openai/v1/responses</code>', 'Alias with <code>/v1</code> prefix'],
                        ['<code>POST</code>', '<code>/model/openai/completions</code>', 'Legacy Completions API — accepts a <code>prompt</code> string instead of messages array'],
                        ['<code>POST</code>', '<code>/model/openai/embeddings</code>', 'Generate embeddings for a list of input strings'],
                        ['<code>GET</code>', '<code>/model/openai/models</code>', 'List all model engines the user has access to (OpenAI models/list spec)'],
                        ['<code>GET</code>', '<code>/model/openai/models/{modelId}</code>', 'Retrieve details for a specific model engine'],
                    ]
                )}
                <h3>Request Body</h3>
                <p>The request body follows the standard OpenAI spec. The <code>model</code> field takes a SEMOSS engine ID instead of an OpenAI model name.</p>
                ${C.code(`{
  "model": "<semoss-engine-id>",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"}
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 1024,
  "insight_id": "<optional-insight-id>",
  "room_id": "<optional-room-id>",
  "tools": [...]
}`, 'json', 'Chat completions request body')}
                ${C.callout('<strong>Key fields:</strong> <code>model</code> is the SEMOSS engine ID (UUID). <code>insight_id</code> and <code>room_id</code> are optional — if omitted, SEMOSS creates or reuses one from the session. <code>tools</code>, <code>stream</code>, and all standard OpenAI parameters are supported.', 'info')}
            `
        },
        {
            id: "api-endpoints-anthropic",
            title: "Anthropic Endpoint",
            content: `
                <h2>Anthropic Endpoint</h2>
                <p class="lead">The <code>AnthropicEndpoints</code> class at <code>/model/anthropic</code> implements the Anthropic Messages API, enabling direct connections from Claude Code and the Anthropic Python/TypeScript SDKs.</p>
                <h3>Available Endpoint</h3>
                ${C.table(
                    ['Method', 'Path', 'Description'],
                    [
                        ['<code>POST</code>', '<code>/model/anthropic/v1/messages</code>', 'Anthropic Messages API — supports streaming (SSE), tool use, extended thinking, images, and documents'],
                    ]
                )}
                <h3>Request Body</h3>
                ${C.code(`{
  "model": "<semoss-engine-id>",
  "max_tokens": 1024,
  "system": "You are a helpful assistant.",
  "messages": [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": "What is in this image?"},
        {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": "..."}}
      ]
    }
  ],
  "stream": true,
  "tools": [...],
  "insight_id": "<optional>",
  "room_id": "<optional>"
}`, 'json', 'Anthropic Messages API request body')}
                <h3>Internal Normalization</h3>
                <p>The <code>AnthropicMessagesHelper</code> handles converting between Anthropic and internal formats on both the request and response sides.</p>
                ${C.split(
                    {
                        title: 'Request Normalization',
                        content: `
                            <ul>
                                <li>Anthropic <code>system</code> blocks → system prompt string</li>
                                <li>Anthropic message content blocks → OpenAI/internal format</li>
                                <li>Anthropic <code>input_schema</code> tools → MCP <code>inputSchema</code> format</li>
                                <li>Base64 images extracted and uploaded to Room folder</li>
                                <li><code>tool_result</code> blocks → <code>tool</code> role messages</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Response Formatting',
                        content: `
                            <ul>
                                <li>Text responses → <code>text</code> content blocks</li>
                                <li>Tool calls → <code>tool_use</code> content blocks</li>
                                <li>Thinking → <code>thinking</code> content blocks</li>
                                <li>Stop reasons mapped: <code>stop</code>→<code>end_turn</code>, <code>tool_calls</code>→<code>tool_use</code></li>
                                <li>SSE events follow Anthropic spec: <code>message_start</code> → deltas → <code>message_stop</code></li>
                            </ul>
                        `
                    }
                )}
                ${C.callout('<strong>Claude Code integration:</strong> Point Claude Code\'s base URL to <code>https://your-semoss-instance/model/anthropic</code> and it connects seamlessly. The endpoint handles all streaming events, tool calling round-trips, and thinking blocks that Claude Code expects.', 'tip')}
            `
        },
        {
            id: "api-endpoints-streaming",
            title: "Streaming Architecture",
            content: `
                <h2>Streaming Architecture</h2>
                <p class="lead">Both endpoints use a shared async job pattern: the Java endpoint starts a Pixel job on a background thread and polls for streaming chunks produced by the Python TCP server.</p>
                <h3>Streaming Flow</h3>
                ${C.flow([
                    { title: '1. Start Async Job', desc: 'startAsyncModelRequest() creates a PixelJobThread and starts the LLM Pixel command' },
                    { title: '2. Python Generates Chunks', desc: 'The genai_client streams chunks via smss_stream() → TCP → PixelJobManager', arrow: '↓' },
                    { title: '3. Java Polls StreamOut', desc: 'The endpoint loops, calling getStreamOut(jobId) to retrieve new chunks', arrow: '↓' },
                    { title: '4. Format & Flush SSE', desc: 'Each chunk is formatted per the provider spec and flushed to the HTTP response', accent: true },
                ])}
                <h3>Stream Chunk Types</h3>
                <p>The Python <code>StreamUtil</code> class produces chunks with a <code>stream_type</code> and <code>data</code> payload. The Java endpoint interprets these:</p>
                ${C.table(
                    ['stream_type', 'data keys', 'Meaning'],
                    [
                        ['<code>content</code>', '<code>content</code>', 'A text delta — streamed to the client as a text chunk'],
                        ['<code>content</code>', '<code>finish_reason</code>', 'End of stream — triggers final SSE event and breaks the polling loop'],
                        ['<code>thinking</code>', '<code>content</code>', 'A thinking/reasoning delta (Anthropic extended thinking, OpenAI reasoning)'],
                        ['<code>tool</code>', '<code>id</code>, <code>type</code>, <code>function.name</code>, <code>function.arguments</code>', 'Tool call data — accumulated across chunks then sent as complete tool blocks'],
                        ['<code>tool</code>', '<code>finish_reason</code>', 'Tool streaming complete — triggers tool-specific finish events'],
                    ]
                )}
                ${C.callout('<strong>Fallback handling:</strong> If the job completes (<code>PROGRESS_COMPLETE</code>) but no streaming chunks were received (e.g., the model doesn\'t support streaming tools), the endpoint reads the final result from <code>PixelJobManager.getOutput()</code> and writes it as a single response chunk.', 'warning')}
            `
        },
        {
            id: "api-endpoints-connecting",
            title: "Connecting to the Endpoints",
            content: `
                <h2>Connecting to the Endpoints</h2>
                <p class="lead">Any standard SDK or HTTP client can connect to SEMOSS's provider-compatible endpoints.</p>
                <h3>Using the OpenAI Python SDK</h3>
                ${C.code(`from openai import OpenAI

client = OpenAI(
    base_url="https://your-semoss-instance/model/openai",
    api_key="<ACCESS_KEY>:<SECRET_KEY>"
)

response = client.chat.completions.create(
    model="<semoss-engine-id>",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)`, 'python', 'Direct connection with OpenAI SDK (no ai-server-sdk needed)')}
                <h3>Using the Anthropic Python SDK</h3>
                ${C.code(`import anthropic

client = anthropic.Anthropic(
    base_url="https://your-semoss-instance/model/anthropic",
    api_key="<ACCESS_KEY>:<SECRET_KEY>"
)

response = client.messages.create(
    model="<semoss-engine-id>",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.content[0].text)`, 'python', 'Direct connection with Anthropic SDK')}
                <h3>Using the ai-server-sdk</h3>
                ${C.code(`import ai_server, httpx
from openai import OpenAI

server = ai_server.ServerClient(
    base="https://your-semoss-instance",
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY
)

http_client = httpx.Client()
http_client.cookies = server.cookies

client = OpenAI(
    api_key="EMPTY",
    base_url=server.get_openai_endpoint(),
    default_headers=server.get_auth_headers(),
    http_client=http_client
)`, 'python', 'Session-based connection via ai-server-sdk')}
                ${C.split(
                    {
                        title: 'Authentication Methods',
                        content: `
                            <ul>
                                <li><strong>API Key</strong> — Pass <code>ACCESS_KEY:SECRET_KEY</code> as the api_key. The endpoint resolves the user from the key pair.</li>
                                <li><strong>Session Cookie</strong> — Use <code>ai-server-sdk</code> to establish a session, then pass cookies via <code>httpx.Client</code>.</li>
                                <li><strong>x-api-key Header</strong> — Supported for Anthropic SDK clients that send the key as a header.</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Key Parameters',
                        content: `
                            <ul>
                                <li><strong>model</strong> — SEMOSS engine ID (UUID), not a provider model name</li>
                                <li><strong>insight_id</strong> — Optional; ties the request to a specific Insight session</li>
                                <li><strong>room_id</strong> — Optional; maintains conversation history in a specific Room</li>
                                <li><strong>stream</strong> — Boolean; enables SSE streaming responses</li>
                            </ul>
                        `
                    }
                )}
                ${C.callout('<strong>Claude Code setup:</strong> Set your base URL to <code>https://your-instance/model/anthropic</code> and your API key to <code>ACCESS_KEY:SECRET_KEY</code>. Claude Code will connect and use the streaming Messages API endpoint automatically, including tool calling round-trips.', 'tip')}
            `
        },
    ];