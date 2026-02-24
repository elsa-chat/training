// Topic: MCP UI & Pre-made MCPs
const slides_mcp_ui_premade = [
        {
            id: "ui-title",
            title: "MCP UI Development",
            content: C.titleSlide(
                "MCP UI Development",
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
            id: "ui-portal-sdk",
            title: "Using @semoss/sdk in Portals",
            content: `
                <h2>Frontend SDK: @semoss/sdk</h2>
                <p>The <code>@semoss/sdk</code> package provides React hooks and utilities for portal development.</p>
                ${C.code(`import { useInsight } from '@semoss/sdk/react';
import { useState, useEffect } from 'react';

export function MyToolPortal() {
    const { actions, tool, insight } = useInsight();
    const [result, setResult] = useState(null);


    // 1. Execute Pixel commands
    const handlePixelExecution = async () => {
        const { pixelReturn } = await actions.run(
            'Frame(engine="my-database") | Query("<encode>SELECT * FROM users</encode>")'
        );
        setResult(pixelReturn[0].output);
    };

    // 2. Call other MCP tools
    const handleMCPToolCall = async () => {
        // Perform an action or series of actions and execute e.g. api call
        ...
        // Manually send a response to playground
        actions.sendMCPResponseToPlayground('Successfully executed action');
         
         OR

        await actions.runMCPTool(
            'execute_python_code',
            { code_b64: btoa('print("Hello from portal")') }
        );
      
    };

    // 4. Access tool metadata
    const toolParams = tool?.inputSchema?.properties || {};

    return (
        <div className="p-4">
            <h2>My Custom Tool UI</h2>
            <button onClick={handlePixelExecution}>Run Query</button>
            <button onClick={handleMCPToolCall}>Execute Code</button>
            {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
    );
}`, 'typescript', 'Portal component with SDK')}
                ${C.table(
                    ["SDK Hook/Method", "Purpose", "Example"],
                    [
                        ["<code>useInsight()</code>", "Main hook providing actions, tool metadata, insight context", "<code>const { actions, tool } = useInsight();</code>"],
                        ["<code>actions.run(pixel)</code>", "Execute Pixel commands and get results", "<code>await actions.run('LLM(...)');</code>"],
                        ["<code>actions.runMCPTool(name, params)</code>", "Call other MCP tools from portal", "<code>await actions.runMCPTool('search', {query: 'test'});</code>"],
                        ["<code>actions.sendMCPResponseToPlayground(result)</code>", "Send tool result back to model", "<code>actions.sendMCPResponseToPlayground('success');</code>"],
                        ["<code>tool</code>", "Access tool metadata (name, description, inputSchema)", "<code>tool.inputSchema.properties</code>"]
                    ]
                )}
            `
        },
        {
            id: "ui-portal-routing-consolidated",
            title: "Portal Routing & resourceURI",
            content: `
                <h2>Portal Routing with resourceURI Example</h2>
                <p>The <code>resourceURI</code> parameter maps MCP tools to specific React components in your portal.</p>
                ${C.split(
                    {
                        title: 'Route Configuration',
                        content: C.code(`// client/src/pages/routes.constants.tsx
export const PAGE_TYPES = {
  '/': HomePage,              // resourceURI: '/'
  '/code-editor': CodeEditor, // resourceURI: '/code-editor'
  '/pdf-viewer': PDFViewer,   // resourceURI: '/pdf-viewer'
  '/data-viz': DataViz,       // resourceURI: '/data-viz'
};

// Python MCP tool with resourceURI
@smssutil.mcp_metadata({
    'execution': 'ask',
    'displayLocation': 'sidebar',
    'resourceURI': '/code-editor'  # Maps to CodeEditor component
})
def open_code_editor():
    """Opens code editor portal in sidebar"""
    return "Editor opened"`, 'typescript')
                    },
                    {
                        title: 'displayLocation Options',
                        content: C.code(`// 'inline' - Renders in chat thread
@smssutil.mcp_metadata({
    'displayLocation': 'inline',
    'resourceURI': '/'
})
def quick_calculator():
    """Small widget in chat"""
    return "Calculator ready"

// 'sidebar' - Persistent right panel
@smssutil.mcp_metadata({
    'displayLocation': 'sidebar',
    'resourceURI': '/document-viewer'
})
def view_document():
    """Opens in sidebar (stays visible)"""
    return "Document viewer ready"

// 'hidden' - No UI (background task)
@smssutil.mcp_metadata({
    'displayLocation': 'hidden'
})
def fetch_data():
    """Executes silently"""
    return {"data": [...]}`, 'python')
                    }
                )}
                ${C.callout('Use <code>inline</code> for small, transient UIs. Use <code>sidebar</code> for persistent tools like editors, viewers, or dashboards. Use <code>hidden</code> for data-only operations.', 'tip')}
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
# (Run in ${CONFIG.productName} Pixel console)
MakePythonMCP(project="your-project-id");

# 2. Build React portal
cd client
pnpm install
pnpm run build
# Output: ../portals/index.html + assets/

# 4. In ${CONFIG.productName} UI:
# - Click "Publish" button on app
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
                <h2>Summary: MCP UI Development</h2>
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
