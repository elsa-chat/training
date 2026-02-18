// Day 3, Chapter 4: API Endpoints (105 min)
const day3_ch04 = {
    title: "API Endpoints",
    slides: [
        {
            id: "d3-api-title",
            title: "API Endpoints",
            content: C.titleSlide(
                "API Endpoints",
                "Integrating OpenAI, Anthropic, and other LLM APIs in SEMOSS",
                "105 minutes"
            )
        },
        {
            id: "d3-api-overview",
            title: "API Integration Overview",
            content: `
                <h2>API Integration Overview</h2>
                <p class="lead">SEMOSS supports multiple LLM APIs through a flexible <span class="highlight">Model Engine</span> architecture that abstracts provider-specific implementations.</p>
                <p>Whether you're using OpenAI, Anthropic Claude, Google Gemini, or open-source models, SEMOSS provides a unified interface for configuration and execution.</p>
                ${C.cards([
                    { badge: 'Provider', title: 'OpenAI', desc: 'Direct API, Azure OpenAI, and OpenAI-compatible servers (vLLM, Ollama, TGI)' },
                    { badge: 'Provider', title: 'Anthropic', desc: 'Direct API, Anthropic on Vertex AI, Anthropic on Amazon Bedrock' },
                    { badge: 'Provider', title: 'Google', desc: 'Gemini API, Vertex AI models' },
                    { badge: 'Provider', title: 'Custom', desc: 'Any OpenAI-compatible REST endpoint' },
                ])}
                ${C.callout('SEMOSS primarily uses <strong>Python-based</strong> engines via GAAS for LLM API integration, enabling rapid adoption of new providers and models without recompiling Java code.', 'info')}
            `
        },
        {
            id: "d3-api-architecture",
            title: "Model Engine Architecture",
            content: `
                <h2>Model Engine Architecture</h2>
                <p>SEMOSS uses an extensible engine architecture where each LLM provider is implemented as a <code>IModelEngine</code>.</p>
                ${C.layers([
                    { label: "Application Layer", items: [
                        { title: "Room / Chat", desc: "User conversations" },
                        { title: "Pixel Reactors", desc: "LLM() commands" },
                    ]},
                    { label: "Engine Layer", accent: true, items: [
                        { title: "AbstractModelEngine", desc: "Base interface", accent: true },
                        { title: "OpenAiEngine", desc: "Direct OpenAI API", accent: true },
                        { title: "VertexEngine", desc: "Google Vertex AI + Anthropic", accent: true },
                    ]},
                    { label: "Provider APIs", items: [
                        { title: "OpenAI API", desc: "api.openai.com" },
                        { title: "Anthropic API", desc: "api.anthropic.com" },
                        { title: "Custom Endpoints", desc: "vLLM, Ollama, etc." },
                    ]},
                ])}
                ${C.code(`public abstract class AbstractModelEngine extends AbstractEngine implements IModelEngine {
    // Key constants for API keys
    public static final String OPEN_AI_KEY = "OPEN_AI_KEY";
    public static final String AWS_SECRET_KEY = "AWS_SECRET_KEY";
    public static final String AWS_ACCESS_KEY = "AWS_ACCESS_KEY";
    public static final String GCP_SERVICE_ACCOUNT_KEY = "GCP_SERVICE_ACCOUNT_KEY";

    // Core method for LLM calls
    protected abstract AskModelEngineResponse askCall(
        String question,
        Object fullPrompt,
        String context,
        Insight insight,
        String roomId,
        Map<String, Object> hyperParameters
    );

    @Override
    public AskModelEngineResponse askRoom(String question, Room room,
            AbstractMessage inputMessage, Map<String, Object> parameters) {
        // Handle usage restrictions
        // Process message history
        // Call provider-specific askCall()
        // Track inference logs
        return askModelResponse;
    }
}`, 'java', 'prerna/engine/impl/model/AbstractModelEngine.java')}
            `
        },
        {
            id: "d3-api-config-smss",
            title: "Engine Configuration (.smss)",
            content: `
                <h2>Engine Configuration (.smss)</h2>
                <p>Model engines are configured via <code>.smss</code> property files stored in the <code>model/</code> directory.</p>
                <p>The <strong>.smss file</strong> defines the engine type, API keys, endpoints, and model-specific parameters.</p>
                ${C.split(
                    {
                        title: 'OpenAI Configuration',
                        content: C.code(`ENGINE	abc-123-uuid
ENGINE_ALIAS	my-gpt4-engine
ENGINE_TYPE	prerna.engine.impl.model.OpenAiEngine

MODEL_TYPE	OPEN_AI
NAME	my-gpt4-engine
MODEL	gpt-4o
MAX_TOKENS	16384

# API key (required)
OPEN_AI_KEY	sk-proj-...

# Optional: override base URL for proxies
# BASE_URL	https://api.openai.com/v1

# Optional: Azure OpenAI
# PROVIDER	azure
# ENDPOINT	https://myresource.openai.azure.com/`, 'properties', 'model/my-gpt4-engine.smss')
                    },
                    {
                        title: 'Anthropic Configuration',
                        content: C.code(`ENGINE	def-456-uuid
ENGINE_ALIAS	Claude-Sonnet-4-5-Vertex
ENGINE_TYPE	prerna.engine.impl.model.VertexEngine

MODEL_TYPE	VERTEX
NAME	Claude-Sonnet-4-5-Vertex
MODEL	claude-sonnet-4-5@20250929
MAX_TOKENS	8192
CONTEXT_WINDOW	200000

# Python GAAS initialization
INIT_MODEL_ENGINE import genai_client;claude45 = genai_client.AnthropicClient(model_name = '\${MODEL}', max_tokens=\${MAX_TOKENS}, context_window=\${CONTEXT_WINDOW}, project='\${PROJECT}', region='\${REGION}', service_account_credentials = \${SERVICE_ACCOUNT_CREDENTIALS}, provider = '\${PROVIDER}')

PROVIDER	google
PROJECT	my-gcp-project-id
REGION	us-east5
SERVICE_ACCOUNT_CREDENTIALS	{...service account json...}`, 'properties', 'model/my-claude-engine.smss')
                    }
                )}
                ${C.callout('Anthropic models use <strong>Python-based GAAS engines</strong> via <code>VertexEngine</code> and <code>genai_client.AnthropicClient</code>. The <code>INIT_MODEL_ENGINE</code> property initializes the Python client with auth credentials.', 'tip')}
            `
        },
        {
            id: "d3-api-openai-patterns",
            title: "OpenAI Integration Patterns",
            content: `
                <h2>OpenAI Integration Patterns</h2>
                <p>SEMOSS supports three OpenAI integration patterns: <strong>Direct API</strong>, <strong>Azure OpenAI</strong>, and <strong>OpenAI-compatible servers</strong>.</p>
                ${C.table(
                    ["Pattern", "Use Case", "Key Properties", "Authentication"],
                    [
                        [
                            "Direct OpenAI",
                            "OpenAI's hosted API",
                            "<code>MODEL</code>, <code>OPEN_AI_KEY</code>",
                            "API key from platform.openai.com"
                        ],
                        [
                            "Azure OpenAI",
                            "Microsoft Azure deployments",
                            "<code>PROVIDER=azure</code>, <code>ENDPOINT</code>, <code>OPEN_AI_KEY</code>",
                            "Azure API key + resource endpoint"
                        ],
                        [
                            "OpenAI-compatible",
                            "vLLM, Ollama, TGI, local models",
                            "<code>BASE_URL</code>, <code>MODEL</code>",
                            "Optional API key or none"
                        ]
                    ]
                )}
                ${C.code(`# Example: OpenAI-compatible endpoint (Ollama local)
ENGINE	ollama-123
ENGINE_ALIAS	ollama-llama3
ENGINE_TYPE	prerna.engine.impl.model.OpenAiEngine

MODEL_TYPE	OPEN_AI
NAME	ollama-llama3
MODEL	llama3:latest
MAX_TOKENS	4096

# Point to Ollama's OpenAI-compatible endpoint
BASE_URL	http://localhost:11434/v1

# Ollama doesn't require a key, but some do
# OPEN_AI_KEY	sk-anything`, 'properties', 'model/ollama-llama3.smss')}
                ${C.callout('OpenAI-compatible servers like <strong>vLLM</strong> and <strong>Ollama</strong> expose an OpenAI-like REST API, making them drop-in replacements for local/private model hosting.', 'info')}
            `
        },
        {
            id: "d3-api-anthropic-patterns",
            title: "Anthropic Integration Patterns",
            content: `
                <h2>Anthropic (Claude) Integration Patterns</h2>
                <p>Anthropic Claude can be accessed through three providers: <strong>Direct API</strong>, <strong>Vertex AI</strong>, and <strong>Amazon Bedrock</strong>.</p>
                ${C.flow([
                    { title: 'Choose Provider', desc: 'PROVIDER = anthropic | google | bedrock', accent: true, arrow: '↓' },
                    { title: 'Direct API', desc: 'API_KEY from console.anthropic.com', arrow: '↓ OR' },
                    { title: 'Vertex AI', desc: 'PROJECT + REGION + SERVICE_ACCOUNT_CREDENTIALS', arrow: '↓ OR' },
                    { title: 'Amazon Bedrock', desc: 'AWS_REGION + AWS_ACCESS_KEY + AWS_SECRET_KEY', arrow: '↓' },
                    { title: 'Engine Ready', desc: 'Call via LLM() or Room', accent: true },
                ])}
                ${C.split(
                    {
                        title: 'Anthropic on Vertex AI',
                        content: C.code(`ENGINE	vertex-claude-123
ENGINE_ALIAS	claude-vertex
ENGINE_TYPE	prerna.engine.impl.model.VertexEngine

MODEL_TYPE	VERTEX
NAME	claude-vertex
MODEL	claude-sonnet-4-5@20250929
MAX_TOKENS	8192
CONTEXT_WINDOW	200000

# Python GAAS client initialization
INIT_MODEL_ENGINE import genai_client;claude = genai_client.AnthropicClient(model_name = '\${MODEL}', max_tokens=\${MAX_TOKENS}, context_window=\${CONTEXT_WINDOW}, project='\${PROJECT}', region='\${REGION}', service_account_credentials = \${SERVICE_ACCOUNT_CREDENTIALS}, provider = '\${PROVIDER}')

PROVIDER	google
PROJECT	my-gcp-project-id
REGION	us-east5

# Service account JSON (inline)
SERVICE_ACCOUNT_CREDENTIALS	{
  "type": "service_account",
  "project_id": "my-project",
  "private_key": "-----BEGIN...",
  ...
}`, 'properties')
                    },
                    {
                        title: 'Anthropic on Bedrock',
                        content: C.code(`ENGINE	bedrock-claude-456
ENGINE_ALIAS	claude-bedrock
ENGINE_TYPE	prerna.engine.impl.model.VertexEngine

MODEL_TYPE	BEDROCK
NAME	claude-bedrock
MODEL	anthropic.claude-3-5-sonnet-20240620-v1:0
MAX_TOKENS	8192
CONTEXT_WINDOW	200000

# Python GAAS client initialization
INIT_MODEL_ENGINE import genai_client;claude = genai_client.AnthropicClient(model_name = '\${MODEL}', max_tokens=\${MAX_TOKENS}, context_window=\${CONTEXT_WINDOW}, provider = '\${PROVIDER}')

PROVIDER	bedrock
AWS_REGION	us-east-1
AWS_ACCESS_KEY	AKIA...
AWS_SECRET_KEY	...`, 'properties')
                    }
                )}
                ${C.callout('Anthropic models use <strong>Python-based engines</strong> via <code>VertexEngine</code> and <code>genai_client.AnthropicClient</code>. The <code>INIT_MODEL_ENGINE</code> property initializes the Python client, which then handles API calls via GAAS.', 'info')}
            `
        },
        {
            id: "d3-api-request-flow",
            title: "API Request Flow",
            content: `
                <h2>API Request Flow</h2>
                <p>When a user sends a message to an LLM (via Room or Pixel), SEMOSS orchestrates the API call through the Model Engine.</p>
                ${C.sequence(
                    ["Room.ask()", "AbstractModelEngine", "Provider API", "Python GAAS (if needed)"],
                    [
                        { from: 0, to: 1, label: "askRoom(message, params)" },
                        { from: 1, to: 1, label: "Check usage limits" },
                        { from: 1, to: 1, label: "Build message_json history" },
                        { from: 1, to: 2, label: "HTTP POST /v1/chat/completions", arrow: "↓ if Java engine" },
                        { from: 1, to: 3, label: "PayloadStruct → TCP", arrow: "↓ if Python engine" },
                        { from: 3, to: 2, label: "HTTP request via Python SDK" },
                        { from: 2, to: 3, label: "JSON response", type: "response" },
                        { from: 3, to: 1, label: "PayloadStruct response", type: "response" },
                        { from: 2, to: 1, label: "JSON response (direct)", type: "response" },
                        { from: 1, to: 0, label: "AskModelEngineResponse", type: "response" },
                    ]
                )}
                ${C.code(`// AbstractModelEngine.askRoom() flow
@Override
public AskModelEngineResponse askRoom(String question, Room room,
        AbstractMessage inputMessage, Map<String, Object> parameters) {
    // 1. Check user usage restrictions
    Map<String, Object> userRestrictionMap = ModelUsageRestrictionUtility
        .getModelUsageRestriction(room.getInsight().getUser(), this.engineId);

    // 2. Extract system prompt from input message
    String context = null;
    if (inputMessage instanceof InputMessage) {
        context = ((InputMessage) inputMessage).getSystemPrompt();
    }

    // 3. Handle full_prompt or message_json
    Object fullPrompt = parameters.remove(FULL_PROMPT);
    if (fullPrompt != null) {
        List<AbstractMessage> messageList = MessageUtils.convertFullPrompt(fullPrompt, room, this);
        String messageJson = MessageUtils.toJsonArrayWithImageData(messageList);
        parameters.put("message_json", messageJson);
    }

    // 4. Call provider-specific implementation
    ZonedDateTime inputTime = ZonedDateTime.now();
    AskModelEngineResponse askModelResponse = askCall(
        question, null, context, room.getInsight(), room.getId(), parameters
    );
    ZonedDateTime outputTime = ZonedDateTime.now();

    // 5. Log inference for tracking
    if (inferenceLogsEnabled) {
        ModelEngineInferenceLogsWorker.logInference(
            askModelResponse, room, inputTime, outputTime
        );
    }

    return askModelResponse;
}`, 'java', 'prerna/engine/impl/model/AbstractModelEngine.java')}
            `
        },
        {
            id: "d3-api-security",
            title: "Authentication & Security",
            content: `
                <h2>Authentication & Security Best Practices</h2>
                <p>API keys are sensitive credentials that must be protected. SEMOSS provides several mechanisms for secure key management.</p>
                ${C.cards([
                    { badge: 'Security', title: 'SMSS Encryption', desc: 'SEMOSS encrypts .smss files at rest using AES-256. Keys are decrypted only in memory at runtime.' },
                    { badge: 'Security', title: 'Environment Variables', desc: 'Reference env vars in .smss: <code>OPEN_AI_KEY=${OPENAI_API_KEY}</code>' },
                    { badge: 'Security', title: 'Access Control', desc: 'Engine permissions control which users can access specific model engines.' },
                    { badge: 'Security', title: 'Usage Limits', desc: 'Set token quotas per user or per engine to prevent abuse and control costs.' },
                ])}
                ${C.callout('<strong>Never commit API keys to git!</strong> Use environment variables or encrypted .smss files. Rotate keys regularly and monitor usage logs.', 'danger')}
                ${C.code(`# Secure .smss configuration using environment variables
ENGINE	secure-gpt4-123
ENGINE_ALIAS	secure-gpt4
ENGINE_TYPE	prerna.engine.impl.model.OpenAiEngine

MODEL_TYPE	OPEN_AI
NAME	secure-gpt4
MODEL	gpt-4o
MAX_TOKENS	8192

# Reference environment variable instead of hardcoding
OPEN_AI_KEY=\${OPENAI_API_KEY}

# Set the env var on your server:
# export OPENAI_API_KEY="sk-proj-..."
`, 'properties', 'model/secure-gpt4.smss')}
            `
        },
        {
            id: "d3-api-error-handling",
            title: "Error Handling & Retries",
            content: `
                <h2>Error Handling & Rate Limiting</h2>
                <p>API calls can fail due to rate limits, timeouts, authentication errors, or provider outages. SEMOSS handles these gracefully.</p>
                ${C.table(
                    ["Error Type", "HTTP Code", "Handling Strategy", "User Experience"],
                    [
                        [
                            "Rate Limit",
                            "429",
                            "Exponential backoff retry (3 attempts)",
                            "\"Model is busy, retrying...\""
                        ],
                        [
                            "Auth Error",
                            "401/403",
                            "Fail immediately, log error",
                            "\"Invalid API key. Contact admin.\""
                        ],
                        [
                            "Timeout",
                            "504",
                            "Retry once, then fail",
                            "\"Request timed out. Try again.\""
                        ],
                        [
                            "Server Error",
                            "500/502/503",
                            "Retry with backoff",
                            "\"Provider error. Retrying...\""
                        ],
                        [
                            "Invalid Request",
                            "400",
                            "Fail immediately with details",
                            "\"Invalid request: [error message]\""
                        ]
                    ]
                )}
                ${C.code(`// Error response structure in AbstractModelEngine
if (AskModelEngineResponse.ERROR.equals(askModelResponse.getMessageType())) {
    AskErrorModelEngineResponse errorDetails = (AskErrorModelEngineResponse) askModelResponse;
    classLogger.error(
        "An error occurred in the {} client with status code {} for model {}. ERROR: {} TRACEBACK: {}",
        errorDetails.getClient(),
        errorDetails.getCode(),
        errorDetails.getModel(),
        errorDetails.getStringResponse(),
        errorDetails.getTraceback()
    );

    askModelResponse.setMessageId(GUID.v7().toUUID().toString());
    askModelResponse.setRoomId(room.getId());
    // Return error to user with context
}`, 'java', 'prerna/engine/impl/model/AbstractModelEngine.java')}
                ${C.callout('Rate limits vary by provider and tier. OpenAI: 3,500 RPM (tier 1), Anthropic: 50 RPM (free tier). Configure retries and backoff accordingly.', 'warning')}
            `
        },
        {
            id: "d3-api-handson",
            title: "Hands-on: Configure API Endpoints",
            content: `
                <h2>Hands-on: Configure and Test API Endpoints</h2>
                ${C.handson('Set up OpenAI and Anthropic engines', `
                    <h4>Part 1: Create an OpenAI Engine</h4>
                    <p>Create a new file: <code>model/my-openai-test.smss</code></p>
                    ${C.code(`ENGINE	$(UUID)
ENGINE_ALIAS	my-openai-test
ENGINE_TYPE	prerna.engine.impl.model.OpenAiEngine

MODEL_TYPE	OPEN_AI
NAME	my-openai-test
MODEL	gpt-4o-mini
MAX_TOKENS	4096

OPEN_AI_KEY	your-api-key-here

# Optional: test with Ollama instead
# BASE_URL	http://localhost:11434/v1
# MODEL	llama3:latest`, 'properties')}
                    <p>Restart SEMOSS to load the engine.</p>

                    <h4>Part 2: Test via Pixel</h4>
                    ${C.code(`// Test the engine with a simple prompt
LLM(
  engine="my-openai-test",
  command="What is 2+2? Respond in one word."
);

// Result should be "Four" or similar`, 'pixel')}

                    <h4>Part 3: Test via Room (UI or Pixel)</h4>
                    <p><strong>Option A:</strong> Use the SEMOSS Playground UI to create a Room with the <code>my-openai-test</code> engine.</p>
                    <p><strong>Option B:</strong> Use Pixel to call the engine directly:</p>
                    ${C.code(`// Via runPixel API endpoint
const response = await fetch('http://localhost:8080/api/engine/runPixel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        insightId: 'new',
        expression: 'LLM(engine="my-openai-test", command="Explain the Pythagorean theorem");'
    })
});

const data = await response.json();
console.log("LLM Response:", data.pixelReturn[0].output);`, 'javascript')}
                    ${C.callout('Room creation and management is typically done through the UI or via Pixel commands. Direct REST endpoints for Room creation are not exposed in the public API.', 'info')}

                    <h4>Part 4: (Optional) Configure Anthropic</h4>
                    <p>Create <code>model/my-claude-test.smss</code>:</p>
                    ${C.code(`ENGINE	$(UUID)
ENGINE_ALIAS	my-claude-test
ENGINE_TYPE	prerna.engine.impl.model.VertexEngine

MODEL_TYPE	VERTEX
NAME	my-claude-test
MODEL	claude-sonnet-4-5@20250929
MAX_TOKENS	8192
CONTEXT_WINDOW	200000

# Python GAAS client (Anthropic on Vertex AI)
INIT_MODEL_ENGINE import genai_client;claude = genai_client.AnthropicClient(model_name = '\${MODEL}', max_tokens=\${MAX_TOKENS}, context_window=\${CONTEXT_WINDOW}, project='\${PROJECT}', region='\${REGION}', service_account_credentials = \${SERVICE_ACCOUNT_CREDENTIALS}, provider = 'google')

PROVIDER	google
PROJECT	your-gcp-project-id
REGION	us-east5
SERVICE_ACCOUNT_CREDENTIALS	{...service account json...}`, 'properties')}
                    <p>Test the same way as OpenAI using <code>engine="my-claude-test"</code>.</p>
                    ${C.callout('Anthropic requires <strong>Python GAAS</strong> via <code>INIT_MODEL_ENGINE</code>. For direct Anthropic API (non-Vertex), use <code>provider=\'anthropic\'</code> with <code>API_KEY</code> instead of GCP credentials.', 'tip')}

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Part 1: Engine loads successfully in SEMOSS logs</li>
                        <li>Part 2: Pixel returns correct answer from LLM</li>
                        <li>Part 3: Room created, message sent, response received</li>
                        <li>Part 4: Claude responds (if configured)</li>
                    </ul>
                `)}
            `
        },
        {
            id: "d3-api-summary",
            title: "Summary",
            content: `
                <h2>Summary: API Endpoint Integration</h2>
                ${C.table(
                    ["Provider", "Engine Type", "Key Properties", "Use Cases"],
                    [
                        [
                            "OpenAI",
                            "<code>OpenAiEngine</code>",
                            "<code>OPEN_AI_KEY</code>, <code>MODEL</code>",
                            "GPT-4, GPT-4o, GPT-3.5"
                        ],
                        [
                            "Azure OpenAI",
                            "<code>OpenAiEngine</code>",
                            "<code>PROVIDER=azure</code>, <code>ENDPOINT</code>",
                            "Enterprise Azure deployments"
                        ],
                        [
                            "Anthropic",
                            "<code>VertexEngine</code>",
                            "<code>PROVIDER=google/bedrock/azure</code>, provider-specific auth",
                            "Claude Sonnet, Opus models"
                        ],
                        [
                            "OpenAI-compatible",
                            "<code>OpenAiEngine</code>",
                            "<code>BASE_URL</code>, <code>MODEL</code>",
                            "vLLM, Ollama, local models"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>.smss files</strong> define engine configuration: type, model, API keys, endpoints</li>
                    <li><strong>AbstractModelEngine</strong> provides unified interface across all providers</li>
                    <li>Most engines are <strong>Python-based</strong> via GAAS using <code>INIT_MODEL_ENGINE</code> to initialize Python clients</li>
                    <li><strong>Environment variables</strong> enable secure key management without hardcoding</li>
                    <li><strong>Error handling</strong> includes retry logic for rate limits and transient failures</li>
                    <li><strong>Usage restrictions</strong> control per-user token quotas and access permissions</li>
                    <li>SEMOSS tracks all API calls in <code>MODEL_INFERENCE_LOGS_DB</code> for analytics and billing</li>
                    <li>OpenAI-compatible endpoints enable <strong>local model hosting</strong> with the same API interface</li>
                </ul>
                ${C.callout('API endpoint configuration is powerful but requires careful security practices. Always use environment variables for keys, monitor usage logs, and set appropriate access controls.', 'tip')}
            `
        }
    ]
};
