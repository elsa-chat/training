// Topic: Playground
const slides_playground = [
        {
            id: "playground-title",
            title: "Playground",
            content: C.titleSlide(
                "Playground",
                `The conversational AI interface in ${CONFIG.productName} — Rooms, Workspaces, and Enterprise Customization`,
                "90 minutes"
            )
        },
        {
            id: "playground-overview",
            title: "What is Playground?",
            content: `
                <h2>What is Playground?</h2>
                <p class="lead"><span class="highlight">Playground</span> is where ${CONFIG.productName} is putting its largest effort — not “just ChatGPT,” but a harmonization layer between business apps and LLMs.</p>
                <p>It brings together models, apps, vectors, and functions so user-driven computation can happen while you move between tools to complete real work.</p>
                ${C.cards([
                    { badge: 'Feature', title: 'Rooms', desc: 'Persistent conversation threads with message history and tool execution' },
                    { badge: 'Feature', title: 'Workspaces', desc: 'Reusable configurations for system prompts, tools, and resources' },
                    { badge: 'Feature', title: 'Room Folders', desc: 'File storage scoped to each Room for document uploads and outputs' },
                    { badge: 'Feature', title: 'MCP Integration', desc: 'Connect Apps and Engines as tools accessible to the LLM' },
                    { badge: 'Feature', title: 'Business Context', desc: 'Capture domain-specific inputs alongside AI automation' },
                    { badge: 'Feature', title: 'Enterprise Themes', desc: 'Customize system prompts globally with Pixel-backed variables' },
                ])}
                ${C.callout('Playground is built on top of the <strong>Room</strong> architecture we studied in Day 3, adding a user-friendly interface and enterprise governance features.', 'info')}
            `
        },
        {
            id: "playground-why-use",
            title: "Why Use Playground?",
            content: `
                <h2>Why Use Playground?</h2>
                <p class="lead">Playground is the operating layer where business context meets models, apps, vectors, and functions — so real work can happen end‑to‑end.</p>
                ${C.split(
                    {
                        title: 'What It Replaces',
                        content: `
                            <ul>
                                <li>Fragmented tools (chat, CRM, docs, search) with no shared context</li>
                                <li>Manual handoffs between steps (research → draft → review)</li>
                                <li>Copy/paste workflows that break governance and audit trails</li>
                            </ul>
                        `
                    },
                    {
                        title: 'What It Enables',
                        content: `
                            <ul>
                                <li>One workspace that holds <strong>business inputs</strong> + <strong>LLM outputs</strong></li>
                                <li>Tool orchestration across Apps, Engines, Vectors, Functions</li>
                                <li>Human-in-the-loop review with traceable outputs</li>
                            </ul>
                        `
                    }
                )}
                <h3>Value Stack (Why It Matters)</h3>
                ${C.cards([
                    { badge: 'Context', title: 'Business-Grade Inputs', desc: 'Users add domain signals, scores, and constraints instead of raw prompts.' },
                    { badge: 'Orchestration', title: 'Tools + Data in One Flow', desc: 'LLMs call engines, apps, vectors, and functions inside one insight.' },
                    { badge: 'Governance', title: 'Audit + Control', desc: 'Traceable steps, reusable workspaces, and standardized prompts.' },
                    { badge: 'Velocity', title: 'Faster End-to-End', desc: 'From intake to approved response without app switching.' },
                ])}
                ${C.callout('Playground is not just chat — it is a <strong>workflow layer</strong> that binds business context, tools, and approvals into one governed experience.', 'info')}
            `
        },
        {
            id: "playground-why-use-demo",
            title: "Why Use Playground? (CRM Demo Flow)",
            content: `
                <h2>Example: CRM Request → Approved Response</h2>
                <p class="lead">A real workflow that combines user input, historical knowledge, and automated actions.</p>
                ${C.cards([
                    { badge: '1', title: 'Request Intake', desc: 'Customer email or CRM entry arrives.' },
                    { badge: '2', title: 'Context + Scoring', desc: 'Compare to past requests, evaluate value/fit, capture scores in CRM.' },
                    { badge: '3', title: 'Research & Examples', desc: 'Pull prior responses, qualifications, and similar cases.' },
                    { badge: '4', title: 'Draft Response', desc: 'Generate a tailored reply based on priorities and constraints.' },
                    { badge: '5', title: 'Human Review', desc: 'Send draft for approval before sending.' },
                    { badge: '6', title: 'Auto-Send', desc: 'Approved response is sent automatically.' },
                ])}
                <h3>What the User Sees</h3>
                ${C.table(
                    ['UI Surface', 'Purpose'],
                    [
                        ['CRM Panel', 'Enter scores, priorities, and context'],
                        ['Playground Chat', 'Draft and iterate with the LLM'],
                        ['Tools Panel', 'Search prior cases, pull docs, query engines (tools exposed to the LLM)'],
                        ['Approval Queue', 'Review + approve outbound response']
                    ]
                )}
                ${C.callout('All steps occur in one Room with shared context — no switching tabs or losing state.', 'tip')}
                ${C.callout('Every action is exposed as a tool you can invoke, and it all runs under the same RBAC + permissions model used across the platform.', 'info')}
            `
        },
        {
            id: "playground-architecture",
            title: "Playground Architecture",
            content: `
                <h2>Playground Architecture</h2>
                <p>Playground combines several ${CONFIG.productName} components to deliver a cohesive conversational AI experience.</p>
                ${C.layers([
                    { label: "Frontend", items: [
                        { title: "React UI", desc: "SemossWeb Playground interface" },
                        { title: "@semoss/sdk", desc: "JavaScript SDK for API calls" },
                    ]},
                    { label: "Application Layer", accent: true, items: [
                        { title: "Room", desc: "Message history + LLM context", accent: true },
                        { title: "Workspace", desc: "Shared config (system prompt, tools)", accent: true },
                        { title: "Insight", desc: "Execution context for tool calls" },
                    ]},
                    { label: "Storage", items: [
                        { title: "MODEL_INFERENCE_LOGS_DB", desc: "Room messages + workspace config" },
                        { title: "Room Folder", desc: "File storage per Room" },
                        { title: "Cloud Sync", desc: "Optional sync to central storage" },
                    ]},
                    { label: "Tools & Resources", items: [
                        { title: "MCP Apps", desc: "Apps with MCP tools exposed" },
                        { title: "MCP Engines", desc: "Engines (databases, models) with tools" },
                        { title: "Built-in Tools", desc: "Shell, file search, web search" },
                    ]},
                ])}
                ${C.callout('Each Room is backed by an <strong>Insight</strong> for tool execution, and optionally associated with a <strong>Workspace</strong> for reusable configuration.', 'tip')}
            `
        },
        {
            id: "playground-room-folder",
            title: "Room Folders",
            content: `
                <h2>Room Folders — Scoped File Storage</h2>
                <p>Each Room has its own <strong>Room Folder</strong> where uploaded documents and tool outputs are stored.</p>
                <p>The <strong>Insight context</strong> for a Room is mapped directly to this folder — the same storage used by apps/MCP tools.</p>
                <p>So writing to the Room is just like writing to the Insight when using the app normally — no bifurcation between a user using the app and an LLM using it via MCP.</p>
                ${C.tree([
                    { name: "BASE_FOLDER/", type: "dir", children: [
                        { name: "room/", type: "dir", desc: "← Room folders root", children: [
                            { name: "abc-123-room-id/", type: "dir", desc: "← One room", children: [
                                { name: "uploaded/", type: "dir", desc: "← User-uploaded files" },
                                { name: "extracted/", type: "dir", desc: "← Text extracted for search" },
                                { name: "outputs/", type: "dir", desc: "← Tool-generated files" },
                                { name: "metadata.json", type: "file", desc: "← Room folder metadata" },
                            ]},
                            { name: "def-456-room-id/", type: "dir", desc: "← Another room" },
                        ]},
                    ]}
                ])}
                ${C.code(`// Room Folder MCP Tools (available in Playground)
// Execute shell commands within the room folder
ExecuteRoomShellCommand(command="ls -la");

// Extract text from uploaded documents
ExtractRoomFiles(filePaths=["uploaded/document.pdf"]);

// Search extracted text with context
SearchRoomFilesWithContext(
  searchTerm="SEMOSS",
  contextWords=50,
  maxMatches=10
);

// Get token counts for uploaded files
GetRoomFileTokenStats();`, 'pixel', 'Room Folder MCP Tools')}
                ${C.callout('Room folders use <strong>chroot isolation</strong> when enabled — shell commands cannot access files outside the room folder.', 'warning')}
                ${C.callout(`The 4 Room Folder MCP tools shown above are project-specific implementations, not built-in ${CONFIG.productName} core features. They may need to be registered separately for your deployment.`, 'info')}
            `
        },
        {
            id: "playground-workspace",
            title: "Workspaces",
            content: `
                <h2>Workspaces — Reusable Configuration</h2>
                <p class="lead">A <span class="highlight">Workspace</span> is a named configuration defining system prompts, MCP tools, and resources that can be shared across multiple Rooms.</p>
                <p>Workspaces enable teams to standardize LLM behavior and tool access without reconfiguring each Room.</p>
                ${C.flow([
                    { title: 'Create Workspace', desc: 'Define system prompt + tools + resources', accent: true, arrow: '↓' },
                    { title: 'Share Workspace', desc: 'Grant access to users or teams', arrow: '↓' },
                    { title: 'Attach to Room', desc: 'Room inherits workspace config', arrow: '↓' },
                    { title: 'LLM Uses Config', desc: 'System prompt + tools applied automatically', accent: true },
                ])}
                ${C.split(
                    {
                        title: 'Workspace Structure',
                        content: C.code(`{
  "workspace_id": "ws-123",
  "name": "Sales Assistant",
  "system_prompt": "You are a helpful sales assistant...",
  "resources": [
    { "type": "PROJECT", "id": "crm-app" },
    { "type": "DATABASE", "id": "sales-db" }
  ],
  "is_active": true,
  "owner": "user@example.com"
}`, 'json', 'Workspace in MODEL_INFERENCE_LOGS_DB')
                    },
                    {
                        title: 'Room References Workspace',
                        content: C.code(`{
  "room_id": "room-456",
  "options": {
    "workspace": {
      "workspace_id": "ws-123"
    }
  }
}

// Room inherits:
// - system_prompt from workspace
// - MCP tools from resources
// - Can override with options.instructions`, 'json', 'Room with workspace')
                    }
                )}
            `
        },
        {
            id: "playground-mcp-integration",
            title: "MCP Apps & Engines",
            content: `
                <h2>MCP Apps & Engines Integration</h2>
                <p>Playground integrates with <strong>MCP (Model Context Protocol)</strong> to expose tools from Apps and Engines to the LLM.</p>
                <p>When a Workspace or Room references an MCP-enabled App or Engine, its tools become available for the LLM to call.</p>
                ${C.sequence(
                    ["User Message", "Room.ask()", "LLM API", "Tool Execution", "Insight"],
                    [
                        { from: 0, to: 1, label: "\"Query the sales database\"" },
                        { from: 1, to: 2, label: "message + tools list" },
                        { from: 2, to: 1, label: "tool_calls: [RunPixel]", type: "response" },
                        { from: 1, to: 3, label: "execute tool via MCP" },
                        { from: 3, to: 4, label: "insight.runPixel(toolPixel)" },
                        { from: 4, to: 3, label: "result", type: "response" },
                        { from: 3, to: 1, label: "tool result", type: "response" },
                        { from: 1, to: 2, label: "message + tool result" },
                        { from: 2, to: 1, label: "final LLM response", type: "response" },
                        { from: 1, to: 0, label: "display to user", type: "response" },
                    ]
                )}
                ${C.code(`// Room.getAllToolsJsonForRoom() aggregates tools from:
// 1. Workspace resources (apps/engines)
// 2. Room options.mcp (additional apps/engines)

public List<Map<String, Object>> getAllToolsJsonForRoom() {
    List<Map<String, Object>> aggregated = new ArrayList<>();
    Map<String, Object> options = getOptionsMap();

        // From options.mcp
        if (options.containsKey("mcp")) {
            List<Map<String, Object>> mcpList = (List) options.get("mcp");
            for (Map<String, Object> mcpMap : mcpList) {
                String type = (String) mcpMap.get("type");  // CATALOG_TYPE (PROJECT, DATABASE, VECTOR, ...)
                String id = (String) mcpMap.get("id");
                aggregated.addAll(getToolJson(id)); // getToolJson filters out tools with SMSS_MCP_EXECUTION=disabled
            }
        }

    // From workspace resources
    if (options.containsKey("workspace")) {
        Map<String, Object> workspace = (Map) options.get("workspace");
        String workspaceId = (String) workspace.get("workspace_id");
        List<Map<String, Object>> resources = ModelInferenceLogsUtils
            .getWorkspaceResourcesByType(workspaceId, null);
        for (Map<String, Object> resource : resources) {
            String resourceId = (String) resource.get("resource_id");
            aggregated.addAll(getToolJson(resourceId));
        }
    }

    return aggregated;
}`, 'java', 'prerna/engine/impl/model/Room.java')}
            `
        },
        {
            id: "playground-reactors",
            title: "Playground Reactors",
            content: `
                <h2>Playground Reactors</h2>
                <p>Playground provides several specialized reactors for programmatic interaction with rooms and conversations.</p>
                <p>These reactors enable custom integrations and automation beyond the standard UI.</p>
                ${C.table(
                    ["Reactor", "Purpose", "Key Inputs", "Key Outputs"],
                    [
                        [
                            "AskPlaygroundReactor",
                            "Run an LLM text-generation call with full message context",
                            "engine, roomId, command (prompt), image, paramValuesMap",
                            "{ inputMessage, responseMessage }"
                        ],
                        [
                            "CreatePlaygroundRoomReactor",
                            "Create a new playground room with automatic playground project association",
                            "roomId (optional), model, systemPrompt",
                            "Room object with PLAYGROUND_PROJECT_ID set"
                        ],
                        [
                            "GetPlaygroundMessagesReactor",
                            "Retrieve message history from a room with pagination and sorting",
                            "roomId, limit, offset, sort (ASC/DESC)",
                            "Array of message objects (InputMessage + ResponseMessage)"
                        ],
                        [
                            "GetPlaygroundRoomsReactor",
                            "Get all playground rooms for the current user",
                            "projectId (auto-set to PLAYGROUND_PROJECT_ID)",
                            "Array of room objects with metadata"
                        ],
                        [
                            "AddPlaygroundToolExecutionReactor",
                            "Add tool execution results to message history and continue LLM conversation",
                            "engine, roomId, toolId, toolName, toolExecutionResponse, toolParameterValues",
                            "{ responseMessage } OR confirmation string if more tools needed"
                        ]
                    ]
                )}
                ${C.callout('All playground reactors enforce RBAC — users can only access rooms they own or have been granted access to.', 'warning')}
                <h3>Example: Programmatic Playground Interaction</h3>
                ${C.code(`// 1. Create a playground room
CreatePlaygroundRoom(
    roomId="my-custom-room",
    model=["GPT4_MODEL"]
);

// 2. Ask the LLM a question
AskPlayground(
    engine=["GPT4_MODEL"],
    roomId=["my-custom-room"],
    command=["What is the weather in New York?"]
);

// 3. Get message history
GetPlaygroundMessages(
    roomId=["my-custom-room"],
    limit=["10"],
    offset=["0"],
    sort=["ASC"]
);

// 4. List all playground rooms
GetPlaygroundRooms();`, 'pixel', 'Using Playground Reactors')}
                ${C.callout('The <strong>AskPlaygroundReactor</strong> automatically processes markdown code blocks in LLM responses, extracting executable code for the Pixel console.', 'tip')}
            `
        },
        {
            id: "playground-enterprise-prompt",
            title: "Enterprise System Prompt",
            content: `
                <h2>Enterprise System Prompt Customization</h2>
                <p>Playground supports <strong>enterprise-wide system prompt templates</strong> with Pixel-backed variables via the active theme configuration.</p>
                <p>This enables global policies, dynamic context injection, and centralized governance.</p>
                ${C.flow([
                    { title: 'Base System Prompt', desc: 'options.instructions OR workspace.system_prompt', arrow: '↓' },
                    { title: 'Apply Enterprise Template', desc: 'playground.globalSystemPrompt from theme', arrow: '↓ wraps base prompt' },
                    { title: 'Expand {{VARS}}', desc: 'playground.systemPromptVars → run Pixel expressions', arrow: '↓ injects dynamic data' },
                    { title: 'Final Effective Prompt', desc: 'Sent to LLM with every message', accent: true },
                ])}
                ${C.split(
                    {
                        title: 'Theme Configuration',
                        content: C.code(`{
  "playground": {
    "globalSystemPrompt": "You are Acme Corp assistant.\\n\\nBase prompt:\\n{{SYSTEM_PROMPT}}\\n\\nToday: {{DATE}}\\nUser: {{USERINFO.MICROSOFT.email}}",
    "systemPromptVars": {
      "DATE": "Date();",
      "USERINFO": "GetUserInfo();"
    }
  }
}`, 'json', 'Theme THEME_MAP')
                    },
                    {
                        title: 'Variable Syntax',
                        content: `
                            <ul>
                                <li><code>{{VAR_NAME}}</code> — Basic substitution</li>
                                <li><code>{{VAR.key}}</code> — Object property access</li>
                                <li><code>{{VAR[0]}}</code> — Array indexing</li>
                                <li><code>{{VAR.items[0].name}}</code> — Nested access</li>
                            </ul>
                            <p>Pixel expressions must be <strong>single statements</strong> ending with <code>;</code></p>
                            ${C.callout('Variable expansion runs as <code>META|Pixel</code> so it doesn\'t pollute the user\'s Pixel history.', 'tip')}
                        `
                    }
                )}
            `
        },
        {
            id: "playground-handson",
            title: "Hands-on: Create a Workspace",
            content: `
                <h2>Hands-on: Explore Playground via UI</h2>
                ${C.handson('Create and test a custom Workspace', `
                    <h4>Part 1: Create a Workspace in the UI</h4>
                    <ol>
                        <li>Open the ${CONFIG.productName} Playground interface</li>
                        <li>Navigate to <strong>Workspaces</strong> → <strong>New Workspace</strong></li>
                        <li>Configure the workspace:
                            <ul>
                                <li><strong>Name:</strong> "Data Analyst Assistant"</li>
                                <li><strong>System Prompt:</strong> "You are a data analyst specializing in SQL and visualization."</li>
                                <li><strong>Resources:</strong> Add a database (e.g., "sales-db") and an app (e.g., "analytics-app")</li>
                            </ul>
                        </li>
                        <li>Save the workspace — note the generated <code>workspace_id</code></li>
                    </ol>

                    <h4>Part 2: Create a Room using the Workspace</h4>
                    <ol>
                        <li>Navigate to <strong>Rooms</strong> → <strong>New Room</strong></li>
                        <li>Configure the room:
                            <ul>
                                <li><strong>Room Name:</strong> "Sales Analysis"</li>
                                <li><strong>Model:</strong> Select your GPT-4 or Claude model engine</li>
                                <li><strong>Workspace:</strong> Select "Data Analyst Assistant" from the dropdown</li>
                            </ul>
                        </li>
                        <li>The room will inherit the workspace's system prompt and have access to its resources</li>
                    </ol>

                    <h4>Part 3: Test Tool Calling</h4>
                    <ol>
                        <li>Send a message: <strong>"Query the sales database for total revenue"</strong></li>
                        <li>Observe the LLM's response — it should recognize the database tool from the workspace</li>
                        <li>Check the tool execution panel to see which tools were called</li>
                        <li>Try additional queries that require database or app access</li>
                    </ol>

                    <h4>Part 4: Upload and Analyze a File</h4>
                    <ol>
                        <li>In the room interface, click <strong>Upload File</strong></li>
                        <li>Upload a CSV file (e.g., <code>data.csv</code>)</li>
                        <li>Send a message: <strong>"Analyze the data.csv file I just uploaded"</strong></li>
                        <li>The LLM should use Room Folder MCP tools (ExtractRoomFiles, SearchRoomFilesWithContext) to access the file</li>
                        <li>Check the Room Folder directory to see the uploaded file: <code>BASE_FOLDER/room/&lt;room_id&gt;/data.csv</code></li>
                    </ol>

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Part 1: Workspace created with custom system prompt and resources</li>
                        <li>Part 2: Room inherits workspace configuration and shows available tools</li>
                        <li>Part 3: LLM successfully calls workspace resources (database, app) as tools</li>
                        <li>Part 4: File uploaded to room folder, LLM reads and analyzes it using MCP tools</li>
                    </ul>
                    ${C.callout('This hands-on demonstrates the full Playground workflow: Workspace → Room → Tools → Files. For programmatic access, use the Playground room reactors (e.g., <code>AskPlayground</code>) rather than a non-existent <code>RunRoomPixel</code> call.', 'tip')}
                `)}
            `
        },
        {
            id: "playground-summary",
            title: "Summary",
            content: `
                <h2>Summary: Playground Architecture</h2>
                ${C.table(
                    ["Component", "Purpose", "Storage", "Key Features"],
                    [
                        [
                            "Room",
                            "Conversation thread",
                            "MODEL_INFERENCE_LOGS_DB",
                            "Message history, tool execution context"
                        ],
                        [
                            "Room Folder",
                            "File storage per Room",
                            "BASE_FOLDER/room/<room_id>/",
                            "Uploads, extracted text, outputs"
                        ],
                        [
                            "Workspace",
                            "Reusable config",
                            "MODEL_INFERENCE_LOGS_DB",
                            "System prompt, tools, resources"
                        ],
                        [
                            "MCP Integration",
                            "Tool provisioning",
                            "App/Engine mcp.json",
                            "Exposes tools to LLM via workspace"
                        ],
                        [
                            "Enterprise Theme",
                            "Global prompt template",
                            "Theme THEME_MAP",
                            "{{VARS}} with Pixel-backed expansion"
                        ],
                        [
                            "Cloud Sync",
                            "Cross-device + sharing",
                            "Central cluster storage",
                            "Automatic push/pull of rooms + files"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Playground</strong> is built on the Room architecture with added UI and governance</li>
                    <li><strong>Room Folders</strong> provide isolated file storage per conversation</li>
                    <li><strong>Workspaces</strong> enable reusable configuration and team standardization</li>
                    <li><strong>MCP integration</strong> exposes tools from Apps and Engines to the LLM</li>
                    <li><strong>Enterprise themes</strong> allow global system prompt customization with Pixel-backed variables</li>
                    <li><strong>Cloud sync</strong> enables cross-device access and real-time collaboration</li>
                    <li>All Room messages are logged in <code>MODEL_INFERENCE_LOGS_DB</code> for compliance and analytics</li>
                </ul>
                ${C.callout(`Playground combines conversational AI, enterprise governance, and tool integration into a cohesive user experience — all built on ${CONFIG.productName}'s core Room and MCP architecture.`, 'tip')}
            `
        }
    ];
