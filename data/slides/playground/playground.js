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
                <p class="lead"><span class="highlight">Playground</span> is ${CONFIG.productName}'s conversational AI interface — a ChatGPT-like experience powered by Rooms, Workspaces, and MCP tools.</p>
                <p>Think of Playground as the enterprise chat interface where users interact with LLMs, connect to data sources, and execute tools — all within a governed, shareable environment.</p>
                ${C.cards([
                    { badge: 'Feature', title: 'Rooms', desc: 'Persistent conversation threads with message history and tool execution' },
                    { badge: 'Feature', title: 'Workspaces', desc: 'Reusable configurations for system prompts, tools, and resources' },
                    { badge: 'Feature', title: 'Room Folders', desc: 'File storage scoped to each Room for document uploads and outputs' },
                    { badge: 'Feature', title: 'MCP Integration', desc: 'Connect Apps and Engines as tools accessible to the LLM' },
                    { badge: 'Feature', title: 'Cloud Sync', desc: 'Sync Rooms across devices and share with teams' },
                    { badge: 'Feature', title: 'Enterprise Themes', desc: 'Customize system prompts globally with Pixel-backed variables' },
                ])}
                ${C.callout('Playground is built on top of the <strong>Room</strong> architecture we studied in Day 3, adding a user-friendly interface and enterprise governance features.', 'info')}
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
                <p>This provides file isolation between conversations and enables document-based workflows like RAG and file analysis.</p>
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
            id: "playground-cloud-sync",
            title: "Cloud Sync & Sharing",
            content: `
                <h2>Cloud Sync & Sharing</h2>
                <p>Playground Rooms can be synced to a <strong>central cloud storage</strong> for cross-device access and team collaboration.</p>
                ${C.table(
                    ["Feature", "Local-Only Mode", "Cloud Sync Enabled"],
                    [
                        ["Room Storage", "Local MODEL_INFERENCE_LOGS_DB", "Synced to central cluster"],
                        ["File Storage", "Local room folder", "Synced to cloud (S3/GCS/Azure)"],
                        ["Cross-Device", "❌ Not available", "✅ Access from any device"],
                        ["Sharing", "Manual export/import", "✅ Real-time collaboration"],
                        ["Backup", "Manual DB backup", "✅ Automatic cloud backup"]
                    ]
                )}
                ${C.callout('Cloud sync is configured via <code>CentralCloudStorage</code> and <code>ClusterUtil</code>. When enabled, Room messages and files are automatically pushed/pulled on access.', 'info')}
                ${C.code(`// Cloud sync utilities (from ClusterUtil)
// Pull room from cloud storage
ClusterUtil.pullRoom(roomId);

// Push room to cloud storage
ClusterUtil.pushRoom(roomId);

// Pull workspace configuration from cloud
ClusterUtil.pullUserWorkspace(projectId, isAsset);`, 'java', 'prerna/cluster/util/ClusterUtil.java')}
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
