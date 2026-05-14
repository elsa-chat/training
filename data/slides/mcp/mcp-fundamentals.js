// Topic: MCP Fundamentals  —  Day 2 Section 3
const slides_mcp_fundamentals = [

    // ─── SECTION 3: MCP FUNDAMENTALS (CONCEPTUAL) ────────────────────────────

    {
        id: "mcp-title",
        title: "MCP Fundamentals",
        content: C.titleSlide(
            "MCP  —  Model Context Protocol",
            "How AI agents discover and call your tools",
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
                        <p>Your Day 1 app works great  —  but an AI agent can't discover or call it on its own.</p>
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
                        <p>MCP is the open standard that lets agents <strong>discover tools</strong>, call them with <strong>structured inputs</strong>, and get <strong>structured results</strong> back.</p>
                        <ul>
                            <li>One JSON schema describes what your tool does</li>
                            <li>Any MCP-compatible agent can call it</li>
                            <li>No custom wiring per agent</li>
                        </ul>
                    `
                }
            )}
            ${C.callout('Think of MCP like a job listing for AI agents. It describes what a tool does, what inputs it needs, and what it returns  —  so any agent can use it without custom wiring.', 'info')}
        `
    },

    {
        id: "mcp-why-matters",
        title: `Why MCP Matters`,
        content: `
            <h2>Apps Are for Humans. MCP Is for Agents.</h2>
            <p class="lead">Until now, every app you built lived behind a UI. A human had to open it, click buttons, and copy results into the next system.</p>
            <p>MCP changes the audience. The <em>same</em> app  —  same logic, same data, same Pixel calls  —  exposes itself as a tool the agent can reach for automatically. The UI stays for humans. The MCP contract opens it to every agent in ${CONFIG.productName}.</p>
            <p><strong>This is how we build going forward.</strong> Every meaningful app should ship both surfaces: a UI for the people who use it, and an MCP contract for the agents that act on their behalf.</p>
            <div style="margin-top:1.25rem;text-align:center;background:#fff;border:1px solid var(--border);border-radius:8px;padding:1rem;">
                <img
                    src="https://mintcdn.com/mcp/bEUxYpZqie0DsluH/images/mcp-simple-diagram.png"
                    alt="MCP simple diagram — Host with MCP client connecting to MCP servers and their resources"
                    style="max-width:100%;height:auto;display:block;margin:0 auto;"
                >
                <p class="muted" style="margin:.5rem 0 0;font-size:.8rem;">Source: modelcontextprotocol.io  —  MCP server speaks one contract; any compatible host can consume it.</p>
            </div>
        `
    },

    {
        id: "mcp-architecture",
        title: "How the Layers Connect",
        content: `
            <h2>How the Layers Connect</h2>
            <p>You own the bottom two layers. The MCP JSON schema is the contract between them and the agent.</p>
            ${C.layers([
                { label: `${CONFIG.aiName} / Room`, items: [
                    { title: "AI Agent Chat", desc: "Conversation thread, model responses" },
                    { title: "Tool Discovery", desc: "Agent sees available MCP tools automatically" },
                ]},
                { label: "MCP Layer", items: [
                    { title: "JSON Schemas", desc: "Tool definitions (what the agent reads)" },
                    { title: "Python / Java Handlers", desc: "Execution (what actually runs)" },
                ]},
                { label: "Your App", items: [
                    { title: "Vector Engine", desc: "Document search from Day 1" },
                    { title: "Model Calls", desc: `LLM inference via ${CONFIG.productName}` },
                    { title: "Pixel Logic", desc: "Reactors and data transforms" },
                ]},
            ])}
        `
    },

    {
        id: "mcp-contract",
        title: "The MCP Contract",
        content: `
            <h2>The MCP Contract  —  What the JSON Looks Like</h2>
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
            ${C.callout('The <code>description</code> field is critical  —  it\'s how the agent decides <em>when</em> to call this tool. Write it as if you\'re instructing a person, not documenting an API.', 'info')}
        `
    },

    {
        id: "mcp-human-in-the-loop",
        title: "Auto vs Ask  —  Human in the Loop",
        content: `
            <h2>Auto vs Ask  —  Human in the Loop</h2>
            <p class="lead">Agents act fast and don't second-guess themselves. For tools that <em>read</em> data that's usually fine. For tools that <em>write, send, or delete</em>  —  you want a human checkpoint first.</p>
            ${C.split(
                {
                    title: '<span style="color:var(--accent)">auto</span>  —  Agent Runs Silently',
                    content: `
                        <p>The agent calls the tool and incorporates the result without interrupting you.</p>
                        <p><strong>Use for:</strong></p>
                        <ul>
                            <li>Read-only operations (search, query, fetch)</li>
                            <li>Low-risk, reversible actions</li>
                            <li>Operations you'd be happy running 100 times without checking</li>
                        </ul>
                        <p class="muted">Example: <code>search_documents</code>  —  searching never harms anything.</p>
                    `
                },
                {
                    title: '<span style="color:#e07b39">ask</span>  —  Agent Asks Permission First',
                    content: `
                        <p>The agent shows you what it wants to do and waits for your approval before running.</p>
                        <p><strong>Use for:</strong></p>
                        <ul>
                            <li>Write operations (upload, create, update, delete)</li>
                            <li>Anything that sends data externally (email, API POST)</li>
                            <li>Anything expensive or hard to reverse</li>
                        </ul>
                        <p class="muted">Example: <code>upload_document</code>  —  you want to confirm before it writes.</p>
                    `
                }
            )}
            <p style="margin-top:1rem;">These modes are set in your Python <code>@mcp_metadata</code> decorator <em>or</em> directly in the MCP JSON via <code>SMSS_MCP_EXECUTION</code> (values: <code>auto</code> / <code>ask</code>). The JSON is the source of truth the agent reads  —  the decorator just generates it.</p>
        `
    },

    // ─── Implementation slides  —  referenced in Section 4 (MCP in Action) ───

    {
        id: "mcp-three-patterns",
        title: "Three MCP Patterns",
        content: `
            <h2>Three Ways to Build MCP Tools</h2>
            ${C.table(
                ["Pattern", "Backend", "Best For"],
                [
                    [
                        "Python MCP",
                        "<code>py/mcp_driver.py</code>",
                        "Data processing, API calls, most use cases"
                    ],
                    [
                        "Pixel / Java MCP",
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
            ${C.callout('Start with Python MCP. It covers 90% of use cases and requires no Java knowledge.', 'tip')}
        `
    },

    {
        id: "mcp-make-python",
        title: "MakePythonMCP",
        content: `
            <h2>From Python Function to Callable Tool</h2>
            <p>You write a function with a docstring. ${CONFIG.productName} does the rest.</p>
            ${C.flow([
                { title: 'Write Python function', desc: 'Include a clear docstring  —  the agent reads it', arrow: '↓' },
                { title: 'Run MakePythonMCP(project=["..."])', desc: 'One Pixel command in the Notebook or console', arrow: '↓' },
                { title: `${CONFIG.productName} introspects your mcp_driver.py`, desc: 'Reads function signatures and docstrings automatically', arrow: '↓' },
                { title: 'Generates assets/mcp/py_mcp.json', desc: 'Produces the JSON schema the agent will read', arrow: '↓' },
                { title: 'Agent can discover and call it', desc: `Tool is live in ${CONFIG.aiName} immediately` },
            ])}
            ${C.code(`def search_documents(question: str) -> str:
    """
    Search FDA guidance documents and return relevant passages.
    Use this when the user asks a question about FDA regulations or guidance.
    """
    pass  # implementation covered in the demo`, 'python', 'py/mcp_driver.py')}
            ${C.callout('The docstring becomes the tool description. Write it for the agent, not for a human developer.', 'tip')}
        `
    },

    {
        id: "mcp-file-persistence",
        title: "File Structure  —  What You Edit vs. What Gets Generated",
        content: `
            <h2>File Structure  —  What You Edit vs. What Gets Generated</h2>
            ${C.tree([
                {
                    name: 'assets/',
                    type: 'dir',
                    children: [
                        {
                            name: 'py/',
                            type: 'dir',
                            children: [
                                { name: 'mcp_driver.py', type: 'file', desc: 'YOU EDIT THIS  —  your Python tool functions' }
                            ]
                        },
                        {
                            name: 'mcp/',
                            type: 'dir',
                            desc: 'GENERATED  —  do not hand-edit',
                            children: [
                                { name: 'py_mcp.json', type: 'file', desc: 'Generated by MakePythonMCP()' },
                                { name: 'pixel_mcp.json', type: 'file', desc: 'Generated by MakePixelMCP()' },
                            ]
                        },
                    ]
                }
            ])}
            ${C.callout('<strong>Never hand-edit the <code>mcp/</code> folder.</strong> Always edit <code>py/mcp_driver.py</code> and re-run MakePythonMCP. Hand-edits will be overwritten.', 'warning')}
        `
    },

];
