// Topic: MCP UI & Pre-made MCPs
const slides_mcp_ui_premade = [
        {
            id: "ui-title",
            title: "MCP UI & Pre-made MCPs",
            content: C.titleSlide(
                "MCP UI & Pre-made MCPs",
                "Custom Portal UIs, Display Locations, and Production MCP Examples",
                "105 minutes"
            )
        },
        {
            id: "ui-display-locations",
            title: "MCP Display Locations",
            content: `
                <h2>MCP Display Locations</h2>
                <p class="lead">The <code class="highlight">displayLocation</code> parameter controls where MCP tool UIs render in Playground.</p>
                ${C.table(
                    ["displayLocation", "Behavior", "Use Case"],
                    [
                        [
                            "<code>'inline'</code>",
                            "Portal renders within the chat thread below the model's response",
                            "Small interactive widgets, forms, quick actions"
                        ],
                        [
                            "<code>'sidebar'</code>",
                            "Portal opens in right-hand sidebar panel (persistent)",
                            "Document viewers, code editors, dashboards, reference materials"
                        ],
                        [
                            "<code>'hidden'</code>",
                            "No UI shown; tool executes silently and returns data to model",
                            "Background data fetching, API calls, database queries"
                        ]
                    ]
                )}
                ${C.split(
                    {
                        title: 'Inline Display',
                        content: C.code(`@smssutil.mcp_metadata({
    'execution': 'auto',
    'displayLocation': 'inline',
    'resourceURI': '/'
})
def show_quick_calculator():
    """
    Shows a simple calculator inline in chat.
    """
    return "Calculator opened"

# Portal renders in chat thread:
# [User message]
# [Model response]
# [Calculator portal - inline]`, 'python')
                    },
                    {
                        title: 'Sidebar Display',
                        content: C.code(`@smssutil.mcp_metadata({
    'execution': 'ask',
    'displayLocation': 'sidebar',
    'resourceURI': '/'
})
def show_pdf_viewer(file_path: str):
    """
    Opens PDF in persistent sidebar viewer.
    """
    return f"Viewing: {file_path}"

# Portal renders in right sidebar:
# [Chat on left] | [PDF viewer on right]
# Sidebar stays open across messages`, 'python')
                    }
                )}
            `
        },
        {
            id: "ui-execution-modes",
            title: "Execution Modes",
            content: `
                <h2>Execution Modes</h2>
                <p>The <code>execution</code> parameter controls whether tools run automatically or require user approval.</p>
                ${C.flow([
                    { title: 'Model calls tool', desc: 'Tool requested by LLM', accent: true, arrow: '↓' },
                    { title: 'Check execution mode', desc: 'auto | ask | disabled', arrow: '↓' },
                    { title: 'auto: Execute immediately', desc: 'No user prompt', arrow: '↓ OR' },
                    { title: 'ask: Show confirmation', desc: 'User approves or rejects', arrow: '↓ OR' },
                    { title: 'disabled: Tool not callable', desc: 'Error returned to model', arrow: '↓' },
                    { title: 'Return result', desc: 'Tool output sent to model', accent: true },
                ])}
                ${C.code(`# Execution mode examples

# 1. Auto-execution (safe, read-only operations)
@smssutil.mcp_metadata({'execution': 'auto'})
def search_database(query: str):
    """Safe read-only search - auto-execute"""
    # ...

# 2. Ask user (destructive or sensitive operations)
@smssutil.mcp_metadata({'execution': 'ask'})
def delete_records(table: str, condition: str):
    """DANGER: Deletes data - requires confirmation"""
    # User sees: "Model wants to delete_records(table='users', condition='age>100'). Allow?"
    # ...

# 3. Disabled (admin-only or deprecated tools)
@smssutil.mcp_metadata({'execution': 'disabled'})
def admin_reset_system():
    """Hidden from model - only callable via direct API"""
    # Model cannot call this tool
    # ...`, 'python', 'Execution mode examples')}
                ${C.callout('Use <code>ask</code> for ANY operation that modifies data, sends messages, or costs money. Auto-execution is only for safe, read-only operations.', 'warning')}
            `
        },
        {
            id: "ui-resource-uri",
            title: "Resource URI & Portal Routing",
            content: `
                <h2>Resource URI & Portal Routing</h2>
                <p>The <code>resourceURI</code> parameter links an MCP tool to a specific React component in your portal UI.</p>
                ${C.layers([
                    { label: "MCP Tool Definition", items: [
                        { title: "@mcp_metadata", desc: "resourceURI: '/code-editor'" },
                    ]},
                    { label: "Portal Routing", accent: true, items: [
                        { title: "routes.constants.tsx", desc: "'/code-editor' → CodeEditorComponent", accent: true },
                    ]},
                    { label: "React Component", items: [
                        { title: "CodeEditor.tsx", desc: "Renders UI, calls runMCPTool()" },
                    ]},
                ])}
                ${C.split(
                    {
                        title: 'Python tool with resourceURI',
                        content: C.code(`@smssutil.mcp_metadata({
    'execution': 'ask',
    'displayLocation': 'sidebar',
    'resourceURI': '/reference-viewer'  # Portal path
})
def show_reference_documents():
    """
    Opens a reference document viewer in sidebar.
    """
    return "Reference viewer opened"`, 'python')
                    },
                    {
                        title: 'Portal route mapping',
                        content: C.code(`// client/src/pages/routes.constants.tsx
export const PAGE_TYPES = {
  '/reference-viewer': ReferenceViewer,
  '/code-editor': CodeEditor,
  '/database-query': DatabaseQueryUI,
};

// When model calls show_reference_documents(),
// Playground loads ReferenceViewer component`, 'typescript')
                    }
                )}
                ${C.callout('If <code>resourceURI</code> is <code>null</code> or omitted, Playground shows a default JSON view of the tool result.', 'info')}
            `
        },
        {
            id: "ui-portal-patterns",
            title: "Portal UI Development Patterns",
            content: `
                <h2>Portal UI Development Patterns</h2>
                <p>Common patterns for building React portal UIs that integrate with MCP tools.</p>
                ${C.code(`// client/src/components/mcp/ReferenceDocumentsViewer.tsx
import { useInsight } from '@semoss/sdk/react';
import { useState, useEffect } from 'react';

export function ReferenceDocumentsViewer() {
    const { actions, tool } = useInsight();
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        // Immediately acknowledge tool call on load
        actions.sendMCPResponseToPlayground('Reference viewer opened');

        // Load document list via Pixel (not MCP tool)
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        const { pixelReturn } = await actions.run(
            'VectorDatabaseQuery(engine="my-vector-db", query="", limit=100);'
        );
        setDocuments(pixelReturn[0].output);
    };

    const handleDocumentClick = async (doc) => {
        setSelectedDoc(doc);

        // Download PDF via Pixel
        const { pixelReturn } = await actions.run(
            \`DownloadReferenceDocument(fileName="\${doc.fileName}");\`
        );

        // Display PDF as base64 data URI
        const pdfBase64 = pixelReturn[0].output;
        // ... render PDF in iframe
    };

    return (
        <div className="reference-viewer">
            <div className="document-list">
                {documents.map(doc => (
                    <div key={doc.id} onClick={() => handleDocumentClick(doc)}>
                        {doc.title}
                    </div>
                ))}
            </div>
            <div className="pdf-preview">
                {selectedDoc && (
                    <iframe src={\`data:application/pdf;base64,\${selectedDoc.base64}\`} />
                )}
            </div>
        </div>
    );
}`, 'typescript', 'Reference document viewer portal pattern')}
                ${C.callout('Portal UIs use <code>actions.run(pixel)</code> for Pixel execution and <code>actions.runMCPTool(name, params)</code> for calling other MCP tools.', 'tip')}
            `
        },
        {
            id: "ui-premade-room-shell",
            title: "Pre-made MCP: Room Shell",
            content: `
                <h2>Pre-made MCP: Room Shell</h2>
                <p class="lead">The <span class="highlight">Room Shell MCP</span> provides secure, room-scoped shell command execution for file operations.</p>
                ${C.cards([
                    { badge: 'Tool', title: 'ExecuteRoomShellCommand', desc: 'Run allowlisted shell commands in room folder' },
                    { badge: 'Tool', title: 'ExtractRoomFiles', desc: 'Extract text from documents in room' },
                    { badge: 'Tool', title: 'SearchRoomFilesWithContext', desc: 'Word-based context search in extracted text' },
                    { badge: 'Tool', title: 'GetRoomFileTokenStats', desc: 'Approximate token counts for files' },
                ])}
                ${C.code(`// Room Shell MCP allowlisted commands:
// ls, dir, pwd, cd, cat, head, tail, grep, rg, wc, find,
// mkdir, rm, cp, mv, git, mvn, pnpm, curl, wget

// Guardrails:
// - No pipes or redirects (|, >, >>)
// - No absolute paths or path traversal (/, ~, ..)
// - & allowed only for curl/wget URLs (must be quoted)

// Example: Model uses room shell
User: "List all Python files in the room"
Model calls: ExecuteRoomShellCommand(command="find . -name '*.py'")
Result: "./mcp_driver.py\\n./utils.py\\n./test.py"

User: "Search for the word 'authentication' in all files"
Model calls: SearchRoomFilesWithContext(
    searchTerm="authentication",
    contextWords=20,
    maxMatches=5
)
Result: [
    {
        "file": "mcp_driver.py",
        "match": "...implements OAuth authentication using...",
        "line": 45
    }
]`, 'pixel', 'Room Shell MCP usage')}
                ${C.callout('Room Shell executes inside the room folder using <code>CmdExecUtil</code> (chroot when enabled) for security isolation.', 'info')}
            `
        },
        {
            id: "ui-premade-vector-pdf",
            title: "Pre-made MCP: Vector PDF Viewer",
            content: `
                <h2>Pre-made MCP: Vector PDF Viewer</h2>
                <p>The Vector PDF Viewer MCP provides document preview with caching and inline viewing.</p>
                ${C.sequence(
                    ["Model", "show_reference_documents", "Portal UI", "DownloadReactor"],
                    [
                        { from: 0, to: 1, label: "Call show_reference_documents()" },
                        { from: 1, to: 2, label: "resourceURI: '/' → Portal opens" },
                        { from: 2, to: 0, label: "mcpToolResult: success", type: "response" },
                        { from: 2, to: 2, label: "Auto-loads first document" },
                        { from: 2, to: 3, label: "DownloadReferenceDocument(fileName)" },
                        { from: 3, to: 2, label: "Base64 PDF data", type: "response" },
                        { from: 2, to: 2, label: "Cache (vectorDbId::fileName)" },
                        { from: 2, to: 2, label: "Render PDF as data URI" },
                    ]
                )}
                ${C.code(`// Vector PDF Viewer key behaviors:
// 1. Tool UI wiring: resourceURI: "/" opens portal instead of default form
// 2. No auto tool execution: Portal immediately sends mcpToolResult to Playground
// 3. Per-document download: Clicking a document calls DownloadReferenceDocument() Pixel
// 4. Caching: Downloads cached by vectorDbId::fileName for repeat views
// 5. Inline viewing: PDF rendered as base64 data URL (no Save dialog)

// Example Pixel MCP JSON:
{
  "name": "ShowReferenceDocuments",
  "description": "Opens a reference document viewer in sidebar",
  "_meta": {
    "SMSS_MCP_EXECUTION": "ask",
    "SMSS_MCP_UI": {
      "resourceURI": "/",
      "displayLocation": "sidebar"
    }
  }
}

// Portal component pattern:
useEffect(() => {
    // Immediately acknowledge
    actions.sendMCPResponseToPlayground('success');

    // Load first document
    loadFirstDocument();
}, []);

const handleDocClick = async (doc) => {
    // Check cache
    const cacheKey = \`\${vectorDbId}::\${doc.fileName}\`;
    if (cache[cacheKey]) {
        displayPDF(cache[cacheKey]);
        return;
    }

    // Download via Pixel (not MCP)
    const result = await actions.run(
        \`DownloadReferenceDocument(fileName="\${doc.fileName}");\`
    );
    cache[cacheKey] = result[0].output;
    displayPDF(cache[cacheKey]);
};`, 'javascript', 'Vector PDF Viewer pattern')}
            `
        },
        {
            id: "ui-loading-messages",
            title: "Loading Messages & UX",
            content: `
                <h2>Loading Messages & User Experience</h2>
                <p>The <code>loadingMessage</code> parameter provides feedback during tool execution.</p>
                ${C.code(`@smssutil.mcp_metadata({
    'execution': 'auto',
    'loadingMessage': 'Searching 1,000,000 documents...',
    'displayLocation': 'inline'
})
def search_large_corpus(query: str):
    """
    Searches a large document corpus (may take 10-30 seconds).
    """
    # Long-running search operation
    # ...

# Playground shows:
# 🔄 Searching 1,000,000 documents...
# [Loading spinner]
# ... (after completion)
# ✅ Found 42 matches for "authentication"`, 'python')}
                ${C.table(
                    ["UX Element", "Configuration", "Purpose"],
                    [
                        [
                            "Loading Message",
                            "<code>loadingMessage: 'Processing...'</code>",
                            "Shows what the tool is doing while it executes"
                        ],
                        [
                            "Execution Confirmation",
                            "<code>execution: 'ask'</code>",
                            "User sees tool call and approves before execution"
                        ],
                        [
                            "Portal Positioning",
                            "<code>displayLocation: 'sidebar'</code>",
                            "Persistent sidebar vs inline in chat thread"
                        ],
                        [
                            "Auto-acknowledge",
                            "<code>sendMCPResponseToPlayground()</code>",
                            "Portal tells Playground tool is ready (no waiting)"
                        ]
                    ]
                )}
                ${C.callout('Good UX: Provide <code>loadingMessage</code> for any tool that takes >2 seconds. Users need to know the tool is working, not frozen.', 'tip')}
            `
        },
        {
            id: "ui-build-deploy",
            title: "Build & Deploy Workflow",
            content: `
                <h2>MCP Build & Deploy Workflow</h2>
                <p>Full workflow for developing, building, and deploying MCP apps with portal UIs.</p>
                ${C.flow([
                    { title: '1. Develop Backend', desc: 'py/mcp_driver.py or java/src/reactors/', accent: true, arrow: '↓' },
                    { title: '2. Develop Portal', desc: 'client/src/ (React components)', arrow: '↓' },
                    { title: '3. Generate MCP JSON', desc: 'MakePythonMCP() or MakePixelMCP()', accent: true, arrow: '↓' },
                    { title: '4. Build Portal', desc: 'cd client/ && pnpm run build', arrow: '↓' },
                    { title: '5. Verify Output', desc: 'Check portals/ folder has index.html', arrow: '↓' },
                    { title: `6. Publish in ${CONFIG.productName}`, desc: 'Publish → Refresh Files', accent: true, arrow: '↓' },
                    { title: '7. Test in Playground', desc: 'Add MCP server, test tools', arrow: '↓' },
                    { title: '8. Deploy', desc: 'Publish to production environment', accent: true },
                ])}
                ${C.code(`# Complete build script (run from assets/)

# 1. Generate MCP JSON from Python
# (Run in SEMOSS Pixel console)
MakePythonMCP(project="your-project-id");

# 2. Build React portal
cd client
pnpm install
pnpm run build

# Output: portals/index.html, portals/assets/*.js

# 3. Verify portals/
ls -la ../portals/
# Should see index.html, assets/, etc.

# 4. In SEMOSS UI:
# - Click "Publish" button
# - Click "Refresh Files"
# - Portal now served from public_home/<projectId>/portals/

# 5. Test
# - Open Playground
# - Settings → MCP Servers → Add your app
# - Tools should appear in sidebar
# - Call tool → Portal should render`, 'bash', 'MCP build workflow')}
                ${C.callout('Portal changes require rebuild (<code>pnpm run build</code>) + Publish + Refresh. Python/Java changes only need MCP regeneration.', 'info')}
            `
        },
        {
            id: "ui-handson",
            title: "Hands-on: Build MCP with Portal UI",
            content: `
                <h2>Hands-on: Build Code Execution MCP with Editor UI</h2>
                ${C.handson('Create an MCP with custom portal UI for code execution', `
                    <h4>Part 1: Create App from Template</h4>
                    <p>Use the MCP template (if available) or create from scratch:</p>
                    ${C.code(`# Copy MCP template (if you have access)
cp -r /Users/kunalppatel9/Documents/app_templates/mcp-template \\
      project/Code_Execution_MCP__<uuid>/app_root/version/assets/

# Or create structure manually:
mkdir -p assets/py assets/client assets/mcp assets/portals`, 'bash')}

                    <h4>Part 2: Create Python MCP Driver</h4>
                    ${C.code(`# assets/py/mcp_driver.py
from semoss import Insight
import smssutil
import base64

@smssutil.mcp_metadata({
    'execution': 'ask',
    'displayLocation': 'sidebar',
    'resourceURI': '/',
    'loadingMessage': 'Executing code...'
})
def execute_python_code(code_b64: str = None):
    """
    Opens a code editor portal. Executes Python code passed as base64.
    """
    if not code_b64:
        return "Code editor opened"

    raw = base64.b64decode(code_b64)
    source = raw.decode("utf-8", errors="replace")

    pixel = f"Py('<encode>{source}</encode>')"
    insight = Insight()
    result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
    return result[0].get("output")`, 'python')}

                    <h4>Part 3: Generate MCP JSON</h4>
                    ${C.code(`MakePythonMCP(project="<your-code-execution-mcp-project-id>");`, 'pixel')}

                    <h4>Part 4: Create Portal UI (Minimal)</h4>
                    ${C.code(`<!-- assets/portals/index.html (minimal version without React build) -->
<!DOCTYPE html>
<html>
<head>
    <title>Code Executor</title>
    <style>
        body { font-family: monospace; padding: 20px; }
        #editor { width: 100%; height: 300px; font-family: monospace; }
        #output { margin-top: 20px; background: #f0f0f0; padding: 10px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h2>Python Code Executor</h2>
    <textarea id="editor" placeholder="Enter Python code...">print('Hello from MCP!')</textarea>
    <br>
    <button onclick="runCode()">Run Code</button>
    <div id="output"></div>

    <script>
        async function runCode() {
            const code = document.getElementById('editor').value;
            const encoded = btoa(code);

            // Minimal portals should use @semoss/sdk in a built client
            // to call actions.runMCPTool(). Raw REST calls are not supported here.
            document.getElementById('output').textContent =
                'Use the built React portal with @semoss/sdk to execute tools.';
        }
    </script>
</body>
</html>`, 'html')}

                    <h4>Part 5: Publish & Test</h4>
                    <ol>
                        <li>In SEMOSS UI: Click "Publish" → "Refresh Files"</li>
                        <li>Open Playground → Settings → MCP Servers → Add "Code Execution MCP"</li>
                        <li>Ask model: <em>"Open the code editor"</em></li>
                        <li>Model calls <code>execute_python_code()</code> → Portal opens in sidebar</li>
                        <li>Type code in editor, click "Run Code"</li>
                        <li>Output appears below editor</li>
                    </ol>

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Part 2: Python function with sidebar portal configuration</li>
                        <li>Part 3: <code>mcp/py_mcp.json</code> with resourceURI: '/'</li>
                        <li>Part 4: <code>portals/index.html</code> with code editor</li>
                        <li>Part 5: Model opens portal in sidebar, code executes successfully</li>
                    </ul>
                `)}
            `
        },
        {
            id: "ui-summary",
            title: "Summary",
            content: `
                <h2>Summary: MCP UI & Pre-made MCPs</h2>
                <h3>UI Configuration</h3>
                <ul>
                    <li><strong>displayLocation</strong>:
                        <ul>
                            <li><code>'inline'</code> - In chat thread (small widgets)</li>
                            <li><code>'sidebar'</code> - Persistent right panel (viewers, editors)</li>
                            <li><code>'hidden'</code> - No UI (background tasks)</li>
                        </ul>
                    </li>
                    <li><strong>execution</strong>:
                        <ul>
                            <li><code>'auto'</code> - Execute immediately (safe operations)</li>
                            <li><code>'ask'</code> - Require confirmation (destructive ops)</li>
                            <li><code>'disabled'</code> - Hidden from model</li>
                        </ul>
                    </li>
                    <li><strong>resourceURI</strong>: Portal path (e.g., <code>'/'</code> for root)</li>
                    <li><strong>loadingMessage</strong>: User feedback during execution</li>
                </ul>
                <h3>Pre-made MCPs</h3>
                <ul>
                    <li><strong>Room Shell MCP</strong>: Secure file operations (ls, grep, find, extract, search)</li>
                    <li><strong>Vector PDF Viewer</strong>: Document preview with caching and inline viewing</li>
                    <li><strong>Reference Pattern</strong>: See AGENTS_MD/REFERENCE_MCP.md and ROOM_SHELL_MCP_TOOLS.md</li>
                </ul>
                <h3>Build Workflow</h3>
                <ol>
                    <li>Write Python/Java backend</li>
                    <li>Generate MCP JSON (MakePythonMCP/MakePixelMCP)</li>
                    <li>Build portal UI (pnpm run build)</li>
                    <li>Publish in SEMOSS</li>
                    <li>Test in Playground</li>
                </ol>
                ${C.callout('MCP enables SEMOSS to become an AI platform with unlimited extensibility through tools, resources, and custom UIs.', 'tip')}
            `
        }
    ];
