// Topic: MCP Fundamentals
const slides_mcp_fundamentals = [
        {
            id: "mcp-title",
            title: "MCP Fundamentals",
            content: C.titleSlide(
                "Model Context Protocol (MCP)",
                `Extending ${CONFIG.productName} with Tools, Resources, and Prompts`,
                "90 minutes"
            )
        },
        {
            id: "mcp-what-is",
            title: `What is MCP in ${CONFIG.productName}?`,
            content: `
                <h2>What is Model Context Protocol (MCP)?</h2>
                <p class="lead">MCP is an open standard that allows <span class="highlight">AI models to securely connect to external tools and data sources</span>.</p>
                <p>In ${CONFIG.productName}, MCP enables you to extend Playground and Rooms with custom capabilities by exposing app-specific functionality as <strong>tools</strong>, <strong>resources</strong>, and <strong>prompts</strong> that LLMs can discover and use.</p>
                ${C.cards([
                    { badge: 'MCP Primitive', title: 'Tools', desc: 'Executable functions the model can call (e.g., search_database, execute_code, send_email)' },
                    { badge: 'MCP Primitive', title: 'Resources', desc: 'Read-only data sources (e.g., documents, APIs, file trees) the model can access' },
                    { badge: 'MCP Primitive', title: 'Prompts', desc: 'Reusable prompt templates with variables that guide model behavior' },
                ])}
                ${C.callout(`${CONFIG.productName} implements MCP as a <strong>micro-app pattern</strong>: each MCP is a lightweight app (Project) with Python/Java/Pixel backends exposed via JSON schemas, plus optional React portal UIs.`, 'info')}
            `
        },
        {
            id: "mcp-architecture",
            title: `MCP Architecture in ${CONFIG.productName}`,
            content: `
                <h2>MCP Architecture</h2>
                <p>${CONFIG.productName} MCP integrates into the Playground and Room system, allowing models to call app-specific tools without leaving the chat interface.</p>
                ${C.layers([
                    { label: "Playground / Room", items: [
                        { title: "LLM Chat", desc: "User conversation" },
                        { title: "Tool Discovery", desc: "Models see available MCP tools" },
                    ]},
                    { label: "MCP Layer", accent: true, items: [
                        { title: "Tool Schemas (mcp/*.json)", desc: "JSON definitions", accent: true },
                        { title: "Execution Handlers", desc: "Python/Java/Pixel", accent: true },
                        { title: "Portal UI (optional)", desc: "React interface", accent: true },
                    ]},
                    { label: "App Backend", items: [
                        { title: "Python (py/mcp_driver.py)", desc: "GAAS functions" },
                        { title: "Java (java/src/reactors/)", desc: "Custom reactors" },
                        { title: "Pixel", desc: "Wrapped Pixel scripts" },
                    ]},
                ])}
                ${C.code(`// Example flow: Model calls MCP tool
1. User asks: "Execute this Python code: print('Hello')"
2. Model sees execute_python_code tool in MCP
3. Model calls: execute_python_code(code_b64="cHJpbnQoJ0hlbGxvJyk=")
4. ${CONFIG.productName} routes to py/mcp_driver.py execute_python_code() function
5. Function executes code via Py() reactor
6. Result returned to model: "Hello"
7. Model incorporates result into response`, 'pixel', 'MCP tool execution flow')}
            `
        },
        {
            id: "mcp-filesystem",
            title: "App Filesystem Structure",
            content: `
                <h2>MCP App Filesystem Structure</h2>
                <p>${CONFIG.productName} apps follow a canonical directory structure. MCP-related files live in specific folders:</p>
                ${C.tree([
                    {
                        name: 'project/',
                        type: 'dir',
                        children: [
                            {
                                name: '&lt;ProjectName&gt;__&lt;ProjectId&gt;/',
                                type: 'dir',
                                children: [
                                    {
                                        name: 'app_root/',
                                        type: 'dir',
                                        children: [
                                            {
                                                name: 'version/',
                                                type: 'dir',
                                                children: [
                                                    {
                                                        name: 'assets/',
                                                        type: 'dir',
                                                        desc: 'This is what you edit',
                                                        children: [
                                                            {
                                                                name: 'py/',
                                                                type: 'dir',
                                                                desc: 'Python source code',
                                                                children: [
                                                                    { name: 'mcp_driver.py', type: 'file', desc: 'Python MCP tool entrypoint' },
                                                                ]
                                                            },
                                                            {
                                                                name: 'java/',
                                                                type: 'dir',
                                                                desc: 'Java source code',
                                                                children: [
                                                                    { name: 'src/reactors/', type: 'dir', desc: 'Custom reactors for MCP' },
                                                                ]
                                                            },
                                                            {
                                                                name: 'mcp/',
                                                                type: 'dir',
                                                                desc: '⚠️ GENERATED - do not edit manually',
                                                                children: [
                                                                    { name: 'py_mcp.json', type: 'file', desc: 'Python tool schemas (generated)' },
                                                                    { name: 'pixel_mcp.json', type: 'file', desc: 'Java/Pixel tool schemas (generated)' },
                                                                ]
                                                            },
                                                            { name: 'classes/', type: 'dir', desc: '⚠️ GENERATED - compiled Java output' },
                                                            { name: 'portals/', type: 'dir', desc: 'Published web UI (built from client/)' },
                                                            { name: 'client/', type: 'dir', desc: 'React source (Vite + Tailwind)' },
                                                        ]
                                                    },
                                                ]
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
                    },
                ])}
                ${C.callout('<strong>⚠️ Key Rule:</strong> Never hand-edit <code>classes/</code> or <code>mcp/</code> — they are generated. Edit <code>java/</code> and <code>py/</code> instead. Platform auto-compiles Java. MCP JSONs can be edited manually but may be overwritten if regenerated via UI.', 'danger')}
            `
        },
        {
            id: "mcp-patterns",
            title: "Three MCP Patterns",
            content: `
                <h2>Three Ways to Create MCP Tools</h2>
                <p>${CONFIG.productName} supports three backend patterns for MCP tools, each with different use cases:</p>
                ${C.table(
                    ["Pattern", "Backend", "Best For", "Generated By"],
                    [
                        [
                            "Python MCP",
                            "Python functions in <code>py/mcp_driver.py</code>",
                            "Data processing, API calls, async tasks, ML inference",
                            "<code>MakePythonMCP(projectId)</code>"
                        ],
                        [
                            "Java/Pixel MCP",
                            "Custom Java reactors in <code>java/src/reactors/</code>",
                            "SEMOSS-native operations, engine access, complex business logic",
                            "<code>MakePixelMCP(projectId, reactor)</code>"
                        ],
                        [
                            "Engine MCP",
                            "Existing engine (Vector, Storage, Function)",
                            "Exposing vector search, storage ops, or function execution as MCP tools",
                            "<code>MakeEngineMCP(engineId)</code>"
                        ]
                    ]
                )}
                ${C.callout('Most modern MCPs use <strong>Python</strong> because it allows rapid iteration without Java recompilation, supports async execution, and integrates easily with ML libraries.', 'tip')}
            `
        },
        {
            id: "mcp-json-structure",
            title: "MCP JSON Schema Structure",
            content: `
                <h2>MCP JSON Schema Structure</h2>
                <p>MCP tools are described using a JSON schema that follows the Model Context Protocol standard:</p>
                ${C.split(
                    {
                        title: 'Python MCP JSON (py_mcp.json)',
                        content: C.code(`{
  "tools": [
    {
      "name": "execute_python_code",
      "title": "Execute Python Code",
      "description": "Executes any given Python code. When calling execute_python_code, pass the script bytes as UTF-8 Base64 in code_b64.",
      "inputSchema": {
        "type": "object",
        "title": "execute_python_code_Arguments",
        "properties": {
          "code_b64": {
            "title": "Code B64",
            "type": "string"
          }
        },
        "required": ["code_b64"]
      }
    }
  ],
  "_meta": {
    "last_modified_date": "2025-01-15",
    "file_last_modified_date": "2025-01-15",
    "source_file": "/path/to/py/mcp_driver.py"
  }
}`, 'json')
                    },
                    {
                        title: 'Pixel MCP JSON (pixel_mcp.json)',
                        content: C.code(`{
  "_meta": { "last_modified_date": "2025-11-24" },
  "tools": [
    {
      "name": "OpenMCPApp",
      "title": "Open MCP App",
      "description": "This tool allows the user to interact with the SEMOSS Template application.",
      "inputSchema": {
        "type": "object",
        "title": "OpenMCPApp_Arguments",
        "properties": {},
        "required": []
      },
      "_meta": {
        "SMSS_MCP_EXECUTION": "ask",
        "SMSS_MCP_UI": {
          "resourceURI": "/",
          "displayLocation": "sidebar"
        }
      }
    }
  ]
}`, 'json')
                    }
                )}
                ${C.callout('The <code>inputSchema</code> follows JSON Schema format and describes tool parameters. SEMOSS extensions like <code>SMSS_MCP_EXECUTION</code> and <code>SMSS_MCP_UI</code> control execution behavior and UI layout.', 'info')}
            `
        },
        {
            id: "mcp-python-decorators",
            title: "Python MCP Decorators",
            content: `
                <h2>Python MCP Metadata Decorators</h2>
                <p>SEMOSS provides Python decorators to control MCP tool behavior <strong>without editing JSON manually</strong>.</p>
                ${C.code(`from semoss import Insight
import smssutil

@smssutil.mcp_metadata({
    'execution': 'auto',          # 'auto' | 'ask' | 'disabled'
    'displayLocation': 'inline',  # 'inline' | 'sidebar' | 'hidden'
    'loadingMessage': 'Executing code...',
    'resourceURI': None           # Portal path (e.g., '/' for custom UI)
})
def execute_python_code(code_b64: str = None):
    """
    Executes any given Python code. When calling execute_python_code,
    pass the script bytes as UTF-8 Base64 in code_b64.
    """
    if not code_b64:
        return "Error: no code_b64 provided."

    import base64
    raw = base64.b64decode(code_b64)
    source = raw.decode("utf-8", errors="replace")

    pixel = f"Py('<encode>{source}</encode>')"
    insight = Insight()
    result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
    return result[0].get("output")`, 'python', 'py/mcp_driver.py')}
                ${C.table(
                    ["Decorator Key", "Values", "Description"],
                    [
                        ["execution", "<code>'auto'</code> <code>'ask'</code> <code>'disabled'</code>", "Auto-execute tool, ask user first, or hide from model"],
                        ["displayLocation", "<code>'inline'</code> <code>'sidebar'</code> <code>'hidden'</code>", "Where to show portal UI in Playground"],
                        ["loadingMessage", "string", "Message shown while tool executes"],
                        ["resourceURI", "string or null", "Path to portal UI (e.g., <code>'/'</code> for root)"]
                    ]
                )}
            `
        },
        {
            id: "mcp-make-reactors",
            title: "Make MCP Reactors",
            content: `
                <h2>Generating MCP JSON Schemas</h2>
                <p>SEMOSS provides reactors to auto-generate MCP JSON files from your Python/Java code:</p>
                ${C.flow([
                    { title: 'Write Code', desc: 'Create Python functions or Java reactors', accent: true, arrow: '↓' },
                    { title: 'Run Make MCP Reactor', desc: 'MakePythonMCP, MakePixelMCP, or MakeEngineMCP', arrow: '↓' },
                    { title: 'JSON Generated', desc: 'mcp/py_mcp.json or mcp/pixel_mcp.json created', accent: true, arrow: '↓' },
                    { title: 'Refresh MCP', desc: 'Playground auto-discovers new tools', arrow: '↓' },
                    { title: 'Model Uses Tools', desc: 'LLM calls tools during conversation', accent: true },
                ])}
                ${C.split(
                    {
                        title: 'MakePythonMCP',
                        content: C.code(`// Generate py_mcp.json from py/mcp_driver.py
MakePythonMCP(
  project="a1b2c3d4-5e6f-7890-abcd-ef1234567890"
);

// Reads py/mcp_driver.py (or legacy py/smss_driver.py)
// Extracts function signatures and docstrings
// Generates mcp/py_mcp.json with inputSchema
// Includes @mcp_metadata decorator settings`, 'pixel')
                    },
                    {
                        title: 'MakePixelMCP',
                        content: C.code(`// Generate pixel_mcp.json from Java reactors
MakePixelMCP(
  project="a1b2c3d4-5e6f-7890-abcd-ef1234567890",
  reactor=["OpenMCPAppReactor", "DownloadDocumentReactor"]
);

// Reads reactor metadata (inputs, descriptions)
// Generates mcp/pixel_mcp.json with inputSchema
// Uses reactor ReactorKeysEnum for parameters`, 'pixel')
                    }
                )}
                ${C.code(`// MakeEngineMCP - Expose engine as MCP tool
MakeEngineMCP(
  engine="bd1dea64-ec6b-49af-9308-94b05551c83d"  // Vector DB, Database, etc.
);

// Generates MCP tools for engine operations:
// - ListDocumentsInVectorDatabase
// - CreateEmbeddingsFromDocuments
// - VectorDatabaseQuery
// - RemoveDocumentFromVectorDatabase
// - VectorFileDownload
// - ListStoragePath / ListStoragePathDetails
// - PullFromStorage / PushToStorage / DeleteFromStorage
// - ExecuteFunctionEngine`, 'pixel', 'Exposing engines as MCP')}
            `
        },
        {
            id: "mcp-handson",
            title: "Hands-on: Create Your First MCP",
            content: `
                <h2>Hands-on: Build a Simple Python MCP Tool</h2>
                ${C.handson('Create a "Hello World" MCP tool', `
                    <h4>Part 1: Create an MCP App</h4>
                    <p>In SEMOSS UI:</p>
                    <ol>
                        <li>Click <strong>Create App</strong> (or use existing app)</li>
                        <li>Navigate to app folder: <code>project/&lt;YourApp&gt;__&lt;uuid&gt;/app_root/version/assets/</code></li>
                        <li>Create <code>py/</code> folder if it doesn't exist</li>
                    </ol>

                    <h4>Part 2: Write Python MCP Driver</h4>
                    <p>Create <code>py/mcp_driver.py</code>:</p>
                    ${C.code(`from semoss import Insight
import smssutil

@smssutil.mcp_metadata({
    'execution': 'auto',
    'displayLocation': 'inline'
})
def say_hello(name: str = "World"):
    """
    Returns a friendly greeting to the specified name.
    """
    return f"Hello, {name}! Welcome to SEMOSS MCP."

@smssutil.mcp_metadata({
    'execution': 'ask',
    'loadingMessage': 'Counting...'
})
def count_to_n(n: int = 10):
    """
    Counts from 1 to n and returns the result.
    """
    if n > 100:
        return "Error: n must be <= 100"

    return "\\n".join(str(i) for i in range(1, n + 1))`, 'python')}

                    <h4>Part 3: Generate MCP JSON</h4>
                    <p>In Pixel console:</p>
                    ${C.code(`// Replace with your project ID
MakePythonMCP(project="your-project-id-here");`, 'pixel')}
                    <p>This creates <code>mcp/py_mcp.json</code> with your two tools.</p>

                    <h4>Part 4: Test in Playground</h4>
                    <ol>
                        <li>Open Playground in SEMOSS</li>
                        <li>Configure your app as an MCP server in Playground settings</li>
                        <li>Ask the model: <em>"Say hello to Alice"</em></li>
                        <li>Model should call <code>say_hello(name="Alice")</code> automatically</li>
                        <li>Ask: <em>"Count to 5"</em></li>
                        <li>Model should call <code>count_to_n(n=5)</code> and show numbers 1-5</li>
                    </ol>

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Part 2: <code>py/mcp_driver.py</code> exists with two functions</li>
                        <li>Part 3: <code>mcp/py_mcp.json</code> generated with 2 tools</li>
                        <li>Part 4: Model successfully calls both tools</li>
                    </ul>
                `)}
            `
        },
        {
            id: "mcp-summary",
            title: "Summary",
            content: `
                <h2>Summary: MCP Fundamentals</h2>
                <h3>Key Concepts</h3>
                <ul>
                    <li><strong>MCP = Model Context Protocol</strong>: Standard for connecting AI models to tools, resources, and prompts</li>
                    <li><strong>SEMOSS MCP Pattern</strong>: Micro-apps with Python/Java/Pixel backends + optional React portals</li>
                    <li><strong>Three MCP Types</strong>: Python MCP (data/ML), Java/Pixel MCP (SEMOSS-native), Engine MCP (expose engines)</li>
                    <li><strong>Filesystem Rules</strong>:
                        <ul>
                            <li>Edit: <code>py/</code>, <code>java/</code>, <code>client/</code></li>
                            <li>Never edit: <code>classes/</code>, <code>mcp/</code> (generated)</li>
                        </ul>
                    </li>
                    <li><strong>Python Decorators</strong>: <code>@mcp_metadata({'execution', 'displayLocation', 'loadingMessage', 'resourceURI'})</code></li>
                    <li><strong>Make MCP Reactors</strong>:
                        <ul>
                            <li><code>MakePythonMCP(project)</code> → py_mcp.json</li>
                            <li><code>MakePixelMCP(project, reactor)</code> → pixel_mcp.json</li>
                            <li><code>MakeEngineMCP(engine)</code> → engine tools</li>
                        </ul>
                    </li>
                </ul>
                ${C.callout('Next chapter: Building complete MCP tools with custom UIs, consuming MCP from external apps, and advanced patterns.', 'tip')}
            `
        }
    ];
