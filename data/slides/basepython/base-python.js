// Topic: Python Foundation in ${CONFIG.productName}
const slides_base_python = [
        {
            id: "python-title",
            title: `Python Foundation in ${CONFIG.productName}`,
            content: C.titleSlide(
                `Python Foundation in ${CONFIG.productName}`,
                "Package management, virtual environments, and local development setup",
                "60 minutes"
            )
        },
        {
            id: "python-package-management",
            title: "Managing Python Packages",
            content: `
                <h2>Managing Python Packages</h2>
                <p class="lead">All Python dependencies for ${CONFIG.productName} are declared in <code>py/install_config/pyproject.toml</code>. This is the single source of truth for what gets installed in your environment.</p>
                <h3>pyproject.toml Structure</h3>
                <p>The <code>pyproject.toml</code> file defines base dependencies shared by all environments, plus optional dependency groups for hardware-specific packages.</p>
                ${C.code(`[project]
name = "semoss"
# ...

[project.optional-dependencies]
gpu = [
    "torch>=2.0",
    "accelerate",
    # ... GPU-specific packages
]
cpu = [
    "torch>=2.0+cpu",
    # ... CPU-only packages
]`, 'toml', 'Simplified pyproject.toml showing optional dependency groups')}
                ${C.callout('<strong>Why pyproject.toml?</strong> It is the modern Python packaging standard (PEP 621). All dependencies, metadata, and optional extras live in one declarative file  -  no more juggling multiple requirements.txt files.', 'info')}

                <h3>Local Development Setup with UV</h3>
                <p>For local development, it is recommended to use <span class="highlight">uv</span> to create and manage your virtual environment. UV is an extremely fast Python package manager written in Rust.</p>
                ${C.flow([
                    { title: '1. Navigate', desc: 'cd into the py/install_config/ directory' },
                    { title: '2. Create venv', desc: 'Run uv venv to create a virtual environment', arrow: '→' },
                    { title: '3. Install deps', desc: 'Run uv pip install with your target extra', arrow: '→' },
                    { title: '4. Develop', desc: 'Activate the venv and start building' },
                ])}
                ${C.code(`# Navigate to the install_config directory
cd py/install_config/

# Create a virtual environment
uv venv

# Install with GPU support
uv pip install .[gpu]

#  -  OR  -  Install with CPU-only support
uv pip install .[cpu]`, 'bash', 'Setting up your local Python environment')}
                ${C.split(
                    {
                        title: 'GPU Install (.[gpu])',
                        content: `
                            <p>Use this when your machine has a compatible NVIDIA GPU and CUDA drivers installed.</p>
                            <ul>
                                <li>Includes CUDA-enabled PyTorch</li>
                                <li>Enables local model inference on GPU</li>
                                <li>Required for training workloads</li>
                            </ul>
                        `
                    },
                    {
                        title: 'CPU Install (.[cpu])',
                        content: `
                            <p>Use this for development machines without a GPU or for lightweight tasks.</p>
                            <ul>
                                <li>Installs CPU-only PyTorch builds</li>
                                <li>Smaller download and disk footprint</li>
                                <li>Sufficient for most development and testing</li>
                            </ul>
                        `
                    }
                )}
                ${C.callout('<strong>Why UV?</strong> UV resolves and installs packages significantly faster than pip. It also handles virtual environment creation natively  -  no need for a separate <code>python -m venv</code> step.', 'tip')}
            `
        },
        {
            id: "python-gaas-tools",
            title: "GAAS Python Tools",
            content: `
                <h2>GAAS Python Tools</h2>
                <p class="lead"><strong>Generative AI Agent Services (GAAS)</strong> is a collection of modular Python tools that enable AI agents to interact with data, execute code, and access knowledge within ${CONFIG.productName}.</p>
                <p>These tools are designed as building blocks that can be invoked by an AI agent or orchestration layer to perform specific tasks. They leverage the <code>genai_client</code> package for interactions with large language models and other AI services.</p>
                <h3>Core Engine Proxies</h3>
                <p>Each proxy class gives Python-based agents direct access to a corresponding ${CONFIG.productName} engine type.</p>
                ${C.table(
                    ['Tool', 'Module', 'Purpose'],
                    [
                        ['<strong>Database Engine</strong>', '<code>gaas_gpt_database.py</code>', `Execute queries and data operations against ${CONFIG.productName} database engines`],
                        ['<strong>Model Engine</strong>', '<code>gaas_gpt_model.py</code>', 'Interact with generative models for inference, chat, and completion tasks'],
                        ['<strong>Function Engine</strong>', '<code>gaas_gpt_function.py</code>', `Execute pre-defined ${CONFIG.productName} <code>FUNCTION</code> engines`],
                        ['<strong>Storage Engine</strong>', '<code>gaas_gpt_storage.py</code>', `Perform file and object operations on ${CONFIG.productName} <code>STORAGE</code> engines`],
                        ['<strong>Vector Engine</strong>', '<code>gaas_gpt_vector.py</code>', `Add documents to and perform similarity searches on ${CONFIG.productName} <code>VECTOR</code> engines`],
                    ]
                )}
                <h3>Infrastructure & Support Components</h3>
                ${C.cards([
                    { badge: 'Security', title: 'Prompt Guard', desc: '<code>gaas_prompt_guard.py</code>  -  Input/output validation and security filtering to enforce guardrails on agent interactions.' },
                    { badge: 'API', title: 'REST Client', desc: `<code>gaas_rest_server.py</code>  -  A Python client for interacting with the ${CONFIG.productName} backend REST API directly.` },
                    { badge: 'Bridge', title: 'Server Proxy', desc: `<code>gaas_server_proxy.py</code>  -  Enables Python GAAS components to call back to the ${CONFIG.productName} Java backend for cross-layer operations.` },
                    { badge: 'Transport', title: 'TCP Servers', desc: '<code>gaas_tcp_server_handler.py</code> / <code>gaas_tcp_socket_server.py</code>  -  TCP-based communication layer between the Java server and Python processes.' },
                ])}
                <h3>How It All Fits Together</h3>
                ${C.flow([
                    { title: 'User / Agent Request', desc: 'A request arrives via the UI or an API call' },
                    { title: 'Orchestration Layer', desc: 'The agent determines which GAAS tool(s) to invoke', arrow: '→' },
                    { title: 'GAAS Tool', desc: 'The appropriate proxy (DB, Model, Vector, etc.) executes the operation', arrow: '→' },
                    { title: `${CONFIG.productName} Backend`, desc: 'Results flow back through the Server Proxy / TCP layer' },
                ])}
                ${C.callout(`<strong>Key takeaway:</strong> GAAS tools are the bridge between Python-based AI agents and the ${CONFIG.productName} Java backend. Understanding these tools is essential for extending agent capabilities or building custom agent workflows.`, 'info')}
            `
        },
        {
            id: "python-genai-client-architecture",
            title: "genai_client  -  Architecture Overview",
            content: `
                <h2>genai_client  -  Architecture Overview</h2>
                <p class="lead">The <code>genai_client</code> package is ${CONFIG.productName}'s provider-agnostic Python layer for interacting with large language models. It abstracts away the differences between AI providers behind a unified interface.</p>
                <h3>Supported Provider Clients</h3>
                ${C.cards([
                    { badge: 'OpenAI', title: 'OpenAiClient', desc: 'Supports <strong>three chat types</strong>: <code>chat-completion</code>, <code>responses</code>, and <code>completions</code>. Also handles Azure OpenAI via <code>AzureOpenAI</code>. Includes sub-clients for image and audio generation.' },
                    { badge: 'Anthropic', title: 'AnthropicClient', desc: 'Full support for Claude models including extended thinking, tool calling, document/image input, and streaming. Handles beta headers and thinking signatures.' },
                    { badge: 'Google', title: 'GoogleGenAiTextClient', desc: 'Connects via Google\'s GenAI SDK with support for Vertex AI service accounts or API keys. Includes grounding with web search citations and inline image generation.' },
                    { badge: 'Bedrock', title: 'BedrockClient', desc: 'AWS Bedrock integration supporting cross-region inference. Routes to Anthropic, Meta, and other models hosted on AWS infrastructure.' },
                ])}
                <h3>Shared Abstraction Layer</h3>
                <p>All four clients extend <code>AbstractTextGenerationClient</code>, which provides a common contract and shared utilities.</p>
                ${C.table(
                    ['Component', 'Location', 'Responsibility'],
                    [
                        ['<code>AbstractTextGenerationClient</code>', 'Base class', 'Defines the <code>ask_call()</code> interface, holds <code>ModelSettings</code> and <code>ModelLimits</code>, and provides the shared <code>build_semoss_messages()</code> method'],
                        ['<code>ModelSettings</code>', '<code>semoss_models.py</code>', 'Carries model configuration: name, type, chat_type, context window, token limits, thinking settings, role overrides'],
                        ['<code>ModelLimits</code>', 'Base class', 'Tracks <code>max_completion_tokens</code>, <code>max_input_tokens</code>, and <code>context_window</code> for the active model'],
                        ['<code>SEMOSSMessageBuilder</code>', '<code>semoss_base/</code>', 'Converts raw Java-sent message dicts into normalized <code>SEMOSSMessage</code> objects (the universal intermediate format)'],
                        ['<code>StreamUtil</code>', '<code>semoss_streaming_util.py</code>', 'Shared helpers for creating consistent streaming chunks across all providers (content, tool calls, finish reasons)'],
                    ]
                )}
                ${C.callout('<strong>Key design principle:</strong> The Java backend sends a provider-agnostic message format. The <code>SEMOSSMessageBuilder</code> normalizes it, and each provider\'s <code>MessageBuilder</code> converts it to the provider-specific API format. This means adding a new provider only requires a new client + message builder  -  no Java changes.', 'tip')}
            `
        },
        {
            id: "python-genai-message-builder",
            title: "genai_client  -  Message Builder Pipeline",
            content: `
                <h2>genai_client  -  Message Builder Pipeline</h2>
                <p class="lead">Every request flows through a two-stage message building pipeline that normalizes inputs and then transforms them to provider-specific formats.</p>
                <h3>The Two-Stage Pipeline</h3>
                ${C.flow([
                    { title: '1. Java Backend', desc: 'Sends raw message dicts with type, content, mediaInputs, tool_responses, paramMap' },
                    { title: '2. SEMOSSMessageBuilder', desc: 'Normalizes into SEMOSSMessage objects with typed fields (parts, media_content, tool_calls)', arrow: '→' },
                    { title: '3. Provider MessageBuilder', desc: 'Transforms SEMOSSMessages into provider-specific format (e.g., AnthropicMessage, OpenAIMessage)', arrow: '→' },
                    { title: '4. API Call', desc: 'Provider client sends the formatted request and handles streaming/non-streaming responses' },
                ])}
                <h3>SEMOSSMessage  -  The Universal Format</h3>
                <p>The <code>SEMOSSMessage</code> is the intermediate representation that all providers consume. It supports two schema versions.</p>
                ${C.split(
                    {
                        title: 'Schema Version 1 (Legacy)',
                        content: `
                            <p>Flat message structure with top-level fields:</p>
                            <ul>
                                <li><code>type</code>  -  INPUT_TEXT, RESPONSE_TEXT, RESPONSE_TOOL, INPUT_TOOL_EXEC, etc.</li>
                                <li><code>content</code>  -  Text string</li>
                                <li><code>media_content</code>  -  List of media attachments</li>
                                <li><code>tool_calls</code>  -  List of tool call dicts</li>
                                <li><code>tool_call_id</code>  -  ID for tool results</li>
                                <li><code>param_map</code>  -  Request parameters</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Schema Version 2 (Parts-Based)',
                        content: `
                            <p>Structured parts array for multi-modal messages:</p>
                            <ul>
                                <li><code>TEXT</code>  -  Text content part</li>
                                <li><code>MEDIA</code>  -  Image/document with mediaInfo</li>
                                <li><code>TOOL_CALL</code>  -  Function invocation</li>
                                <li><code>TOOL_RESULT</code>  -  Tool execution output</li>
                                <li><code>THINKING</code>  -  Reasoning/thinking block</li>
                                <li><code>SYSTEM</code>  -  System prompt part</li>
                            </ul>
                        `
                    }
                )}
                <h3>What Each Provider MessageBuilder Handles</h3>
                ${C.table(
                    ['Concern', 'Anthropic', 'OpenAI', 'Google GenAI'],
                    [
                        ['<strong>Message roles</strong>', 'user / assistant (tool results sent as user role)', 'user / assistant / system / tool', 'user / model (via Content objects)'],
                        ['<strong>Media format</strong>', 'Base64 source blocks (image or document content parts)', 'Data URI strings or URL references', 'google.genai.types.Part with inline_data'],
                        ['<strong>Tool calls</strong>', '<code>tool_use</code> content blocks', 'Chat: <code>tool_calls</code> array; Responses: <code>function_call</code> items', '<code>function_call</code> Part objects'],
                        ['<strong>Tool results</strong>', '<code>tool_result</code> content block (user role)', 'Chat: <code>tool</code> role message; Responses: <code>function_call_output</code>', '<code>function_response</code> Part objects'],
                        ['<strong>Thinking / Reasoning</strong>', 'Extended thinking with budget_tokens + signature', 'Reasoning effort (low/medium/high) + summary', 'Thought parts on candidates'],
                        ['<strong>Consecutive messages</strong>', 'Auto-merges same-role messages', 'No merging needed (roles alternate naturally)', 'Handled by SDK'],
                    ]
                )}
                ${C.callout('<strong>The param_map is key:</strong> The last message\'s <code>param_map</code> carries request-level settings like <code>tools</code>, <code>system_prompt</code>, <code>max_tokens</code>, <code>temperature</code>, <code>thinking</code>, and <code>schema</code>. Each provider\'s builder extracts and converts these into provider-specific config (e.g., <code>AnthropicRequestConfig</code>, OpenAI request dicts).', 'warning')}
            `
        },
        {
            id: "python-debugging",
            title: "Debugging Python",
            content: `
                <h2>Debugging Python</h2>
                <p class="lead">You can attach a VS Code debugger to ${CONFIG.productName}'s Python TCP server, allowing you to set breakpoints anywhere in the <code>genai_client</code> pipeline  -  message builders, provider clients, streaming handlers, and more.</p>
                <h3>Setup Steps</h3>
                ${C.flow([
                    { title: '1. Set FORCE_PORT', desc: 'Add FORCE_PORT=9999 to the model\'s SMSS file so the TCP server starts on a predictable port' },
                    { title: '2. Create launch.json', desc: 'Add a VS Code debug configuration in py/.vscode/launch.json', arrow: '→' },
                    { title: '3. Launch in VS Code', desc: 'Start the socket server from the VS Code debug panel', arrow: '→' },
                    { title: '4. Set Breakpoints', desc: 'Place breakpoints anywhere in the Python codebase and trigger a model call' },
                ])}
                <h3>Step 1  -  Configure FORCE_PORT in the SMSS</h3>
                <p>In the model's <code>.smss</code> configuration file, set <code>FORCE_PORT</code> to a fixed port number. This tells ${CONFIG.productName} to start the Python TCP server on that specific port instead of a random one, so your debugger can connect reliably.</p>
                ${C.code(`# In your model's .smss file
FORCE_PORT\t9999`, 'properties', 'Setting a fixed TCP port for the model')}
                ${C.callout(`<strong>Why FORCE_PORT?</strong> By default, ${CONFIG.productName} assigns a random available port to each Python TCP server. Setting a fixed port ensures the VS Code debugger launches the server on the same port that the Java backend expects to connect to.`, 'info')}
                <h3>Step 2  -  Create the VS Code Launch Configuration</h3>
                <p>Create a <code>launch.json</code> file in the <code>py/.vscode/</code> directory with the following configuration:</p>
                ${C.code(`{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Socket Server",
      "type": "debugpy",
      "request": "launch",
      "program": "\${workspaceFolder}/gaas_tcp_socket_server.py",
      "args": [
        "--logger_level", "DEBUG"
      ],
      "console": "integratedTerminal"
    }
  ]
}`, 'json', 'py/.vscode/launch.json')}
                <h3>Step 3  -  Debug</h3>
                <p>With the debugger running, you can set breakpoints anywhere in the Python codebase that the model's request will touch.</p>
                ${C.split(
                    {
                        title: 'Where to Set Breakpoints',
                        content: `
                            <ul>
                                <li><strong>Message Builders</strong>  -  <code>AnthropicMessageBuilder</code>, <code>OpenAIMessageBuilder</code>, <code>GoogleGenAIMessageBuilder</code></li>
                                <li><strong>Provider Clients</strong>  -  <code>ask_call()</code>, streaming handlers, tool call parsing</li>
                                <li><strong>${CONFIG.productName} Message Builder</strong>  -  Input normalization and param_map processing</li>
                                <li><strong>GAAS Tools</strong>  -  Database, Vector, Storage, Function engine proxies</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Debugging Tips',
                        content: `
                            <ul>
                                <li>Inspect <code>semoss_messages</code> after <code>build_semoss_messages()</code> to verify input normalization</li>
                                <li>Check the provider-specific request dict right before the API call to catch formatting issues</li>
                                <li>For streaming, breakpoint inside the <code>for chunk in response</code> loop to inspect individual chunks</li>
                            </ul>
                        `
                    }
                )}
                ${C.callout(`<strong>Remember:</strong> The Python TCP server must be running via VS Code <em>before</em> you trigger a model call from the ${CONFIG.productName} UI or API. The Java backend will connect to FORCE_PORT 9999 and route the request to your debugger-attached process.`, 'warning')}
            `
        },
    ];
