// Topic: MCP Fundamentals — Day 2 Morning (10:00 AM)
const slides_mcp_fundamentals = [

    // ─── DAY 2 RECAP ────────────────────────────────────────────────────────
    {
        id: "recap-day2",
        title: "Day 1 Recap",
        content: `
            <h2>Day 1 Recap — Where We Left Off</h2>
            <p class="lead">Here is the thread we built yesterday. Today we wire it into an AI agent.</p>
            ${C.flow([
                { title: 'Vector Engine', desc: 'Ingested FDA guidance documents — chunked, embedded, indexed', accent: true, arrow: '↓' },
                { title: 'Notebook RAG', desc: 'Pixel + Python queries: search the vector engine, pass results to a model', arrow: '↓' },
                { title: 'Published App', desc: 'Claude Code generated the UI template; you published a live URL', accent: true },
            ])}
            ${C.callout('Open your app now and confirm it\'s still working before we move on. Your vector engine and published URL should be exactly where you left them.', 'tip')}
            <p class="muted">Open Q&amp;A — 10 minutes. Ask anything that didn\'t click yesterday.</p>
        `
    },

    // ─── SECTION 1: MCP FUNDAMENTALS ────────────────────────────────────────
    {
        id: "mcp-title",
        title: "MCP Fundamentals",
        content: C.titleSlide(
            "MCP Fundamentals",
            `Making your app discoverable and callable by AI agents`,
            "45 minutes"
        )
    },

    {
        id: "mcp-what-is",
        title: "What is MCP?",
        content: `
            <h2>Model Context Protocol</h2>
            ${C.split(
                {
                    title: 'The Problem',
                    content: `
                        <p>Your Day 1 app is great — but an AI agent can't discover or call it on its own.</p>
                        <ul>
                            <li>The agent doesn't know the app exists</li>
                            <li>It doesn't know what inputs it needs</li>
                            <li>It can't interpret the results without structure</li>
                        </ul>
                    `
                },
                {
                    title: 'The Solution',
                    content: `
                        <p>MCP is the standard that lets agents <strong>discover tools</strong>, call them with <strong>structured inputs</strong>, and get <strong>structured results</strong> back.</p>
                        <ul>
                            <li>One JSON schema describes what your tool does</li>
                            <li>Any MCP-compatible agent can call it</li>
                            <li>No custom wiring per agent</li>
                        </ul>
                    `
                }
            )}
            ${C.callout('Think of MCP like a job listing for AI agents. It describes what a tool does, what inputs it needs, and what it returns — so any agent can use it without custom wiring.', 'info')}
        `
    },

    {
        id: "mcp-why-matters",
        title: `Why MCP Matters in ${CONFIG.productName}`,
        content: `
            <h2>Why It Matters in ${CONFIG.productName}</h2>
            <p class="lead">Without MCP, an agent has no idea your app exists. With MCP, it becomes a tool the agent can reach for automatically.</p>
            ${C.sequence(
                ["User in Playground", "AI Agent", "MCP Layer", "Your App Backend"],
                [
                    { from: 0, to: 1, label: "Asks a question about FDA regulations" },
                    { from: 1, to: 2, label: "Discovers available MCP tools" },
                    { from: 2, to: 1, label: "Returns tool list with schemas", type: "response" },
                    { from: 1, to: 2, label: "Calls search_documents(question=...)" },
                    { from: 2, to: 3, label: "Routes call to your app" },
                    { from: 3, to: 2, label: "Returns matching document passages", type: "response" },
                    { from: 2, to: 1, label: "Structured result", type: "response" },
                    { from: 1, to: 0, label: "Incorporates result into final answer", type: "response" },
                ]
            )}
            ${C.callout('Without MCP, the agent has no idea your app exists. With MCP, it becomes a tool the agent can reach for automatically.', 'info')}
        `
    },

    {
        id: "mcp-architecture",
        title: "MCP Architecture",
        content: `
            <h2>How the Layers Connect</h2>
            <p>You own the bottom two layers. The MCP JSON schema is the contract between them and the agent.</p>
            ${C.layers([
                { label: "Playground / Room", items: [
                    { title: "AI Agent Chat", desc: "Conversation thread, model responses" },
                    { title: "Tool Discovery", desc: "Agent sees available MCP tools automatically" },
                ]},
                { label: "MCP Layer", accent: true, items: [
                    { title: "JSON Schemas", desc: "Tool definitions (what the agent reads)", accent: true },
                    { title: "Python / Java Handlers", desc: "Execution (what actually runs)", accent: true },
                ]},
                { label: "Your App Backend", items: [
                    { title: "Vector Engine", desc: "FDA document search" },
                    { title: "Model Calls", desc: `LLM inference via ${CONFIG.productName}` },
                    { title: "Pixel Logic", desc: "Reactors and data transforms" },
                ]},
            ])}
            ${C.callout('You own the bottom two layers. The MCP JSON schema is the contract between them and the agent.', 'info')}
        `
    },

    {
        id: "mcp-three-patterns",
        title: "Three MCP Patterns",
        content: `
            <h2>Three Ways to Build MCP Tools — Which to Use?</h2>
            ${C.table(
                ["Pattern", "Backend", "Best For"],
                [
                    [
                        "Python MCP",
                        "<code>py/mcp_driver.py</code>",
                        "Data processing, API calls, most use cases"
                    ],
                    [
                        "Pixel + Java MCP",
                        "Custom Java reactors in <code>java/src/reactors/</code>",
                        `${CONFIG.productName}-native operations, complex business logic`
                    ],
                    [
                        "Engine MCP",
                        "Existing engine (Vector, Storage, Function)",
                        "Expose vector search or storage operations directly"
                    ]
                ]
            )}
            ${C.callout('For this training, we use <strong>Python MCP</strong>. It\'s the fastest to iterate on and handles 90% of use cases.', 'tip')}
        `
    },

    {
        id: "mcp-json-schema",
        title: "The MCP Contract",
        content: `
            <h2>The MCP Contract — What the JSON Looks Like</h2>
            <p>This is what the agent reads when it discovers your tool. Every field matters.</p>
            ${C.code(`{
  "tools": [
    {
      "name": "search_documents",
      "description": "Search FDA guidance documents and return relevant passages for a given question.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string",
            "description": "The question to search for"
          }
        },
        "required": ["question"]
      }
    }
  ]
}`, 'json', 'assets/mcp/py_mcp.json')}
            ${C.callout('The <code>description</code> field is critical — it\'s how the agent decides <em>when</em> to call this tool. Write it as if you\'re instructing a person.', 'info')}
        `
    },

    {
        id: "mcp-make-python",
        title: "MakePythonMCP",
        content: `
            <h2>From Python Function to Callable Tool</h2>
            <p>You write a function with a docstring. ${CONFIG.productName} does the rest.</p>
            ${C.flow([
                { title: 'Write Python function', desc: 'Include a clear docstring — the agent reads it', accent: true, arrow: '↓' },
                { title: 'Run MakePythonMCP(project=["..."])', desc: 'One Pixel command in the Notebook or console', arrow: '↓' },
                { title: '${CONFIG.productName} reads function signatures and docstrings', desc: 'Introspects your mcp_driver.py automatically', arrow: '↓' },
                { title: 'Generates mcp/py_mcp.json automatically', desc: 'Produces the JSON schema the agent will see', accent: true, arrow: '↓' },
                { title: 'Agent can discover and call it', desc: 'Tool is live in Playground immediately', accent: true },
            ])}
            ${C.code(`def search_documents(question: str) -> str:
    """
    Search FDA guidance documents and return relevant passages.
    Use this when the user asks a question about FDA regulations or guidance.
    """
    # Implementation in next section
    pass`, 'python', 'assets/py/mcp_driver.py')}
            ${C.callout('The docstring becomes the tool description. Write it for the agent, not for a human developer.', 'tip')}
        `
    },

    {
        id: "mcp-meta-variables",
        title: "Meta Variables",
        content: `
            <h2>Controlling Agent Behavior — Meta Variables</h2>
            <p>Two meta variables control how the agent and Playground UI interact with your tool.</p>
            ${C.table(
                ["Variable", "What it controls"],
                [
                    [
                        "<code>SMSS_MCP_EXECUTION</code>",
                        "<code>auto</code> — agent calls silently &nbsp;|&nbsp; <code>ask</code> — agent confirms with user first &nbsp;|&nbsp; <code>disabled</code> — hidden from agent"
                    ],
                    [
                        "<code>SMSS_MCP_UI</code>",
                        "Where the tool's portal UI appears in Playground — <code>sidebar</code>, <code>inline</code>, or <code>hidden</code>"
                    ]
                ]
            )}
            ${C.callout('Start with <code>execution: "auto"</code> for search tools, <code>execution: "ask"</code> for anything that writes or sends data.', 'info')}
        `
    },

    {
        id: "mcp-file-persistence",
        title: "File Persistence — What You Edit vs. What Gets Generated",
        content: `
            <h2>File Persistence — What You Edit vs. What Gets Generated</h2>
            ${C.tree([
                {
                    name: 'assets/',
                    type: 'dir',
                    desc: 'This is what you edit',
                    children: [
                        {
                            name: 'py/',
                            type: 'dir',
                            children: [
                                { name: 'mcp_driver.py', type: 'file', desc: 'YOU EDIT THIS — your Python tool functions' }
                            ]
                        },
                        {
                            name: 'mcp/',
                            type: 'dir',
                            desc: 'GENERATED — do not hand-edit',
                            children: [
                                { name: 'py_mcp.json', type: 'file', desc: 'GENERATED by MakePythonMCP()' },
                                { name: 'pixel_mcp.json', type: 'file', desc: 'GENERATED by MakePixelMCP()' },
                            ]
                        },
                    ]
                }
            ])}
            ${C.callout('<strong>Never hand-edit the <code>mcp/</code> folder.</strong> Always edit <code>py/</code> or <code>java/</code> and regenerate. Hand-edits will be overwritten the next time you run MakePythonMCP.', 'warning')}
        `
    },

];
