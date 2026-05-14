// Topic: ${CONFIG.aiName}  -  Day 2 Morning (11:00 AM)
const slides_playground = [

    // ─── SECTION 2: PLAYGROUND DEEP DIVE ────────────────────────────────────
    {
        id: "playground-title",
        title: `${CONFIG.aiName}`,
        content: C.titleSlide(
            `${CONFIG.aiName}  -  Wiring Your App into an AI Agent`,
            "Where MCP tools become agent capabilities",
            "45 minutes"
        )
    },

    {
        id: "playground-architecture",
        title: `${CONFIG.aiName} Architecture`,
        content: `
            <h2>${CONFIG.aiName} Architecture  -  Three Layers</h2>
            <p>Understanding what a Room is versus a Room Folder saves you debugging time later.</p>
            ${C.layers([
                { label: "Room", items: [
                    { title: "Conversation Thread", desc: "Message history, tool call history" },
                    { title: "Model Responses", desc: "What the agent says and does" },
                ]},
                { label: "Room Folder / Workspace", items: [
                    { title: "System Prompt", desc: "Agent persona and constraints" },
                    { title: "Model Selection", desc: "Which LLM powers this room" },
                    { title: "MCP Tools Available", desc: "Which of your apps the agent can call" },
                ]},
                { label: "MCP Apps + Engines", items: [
                    { title: "Your App's Tools", desc: "search_documents and anything else in mcp_driver.py" },
                    { title: "Shared Vector Engines", desc: "FDA document vector engine from Day 1" },
                    { title: "Function Engines", desc: "Other callable backends" },
                ]},
            ])}
            ${C.callout('A <strong>Room</strong> is a conversation. A <strong>Room Folder</strong> is the configuration that controls how that conversation behaves. You set up the folder once; every Room inside it inherits the settings.', 'info')}
        `
    },

    {
        id: "playground-agent-config",
        title: "Agent Configuration",
        content: `
            <h2>What You Configure in a Room Folder</h2>
            ${C.table(
                ["Setting", "What It Does"],
                [
                    ["System Prompt", "Gives the agent its persona, constraints, and instructions for using tools"],
                    ["Model", "Which LLM processes the conversation (Claude, GPT-4, etc.)"],
                    ["MCP Tools", "Which apps are exposed as callable tools  -  your project goes here"],
                    ["Engine Access", "Which vector engines, databases, and functions the agent can reach"],
                ]
            )}
            ${C.callout(`The system prompt is where you give the agent its persona and constraints. <em>"You are an FDA regulatory assistant. Use the search_documents tool to answer questions based only on official FDA guidance."</em>`, 'tip')}
            <div id="pg-agent-carousel" data-idx="0" style="margin-top:16px; border:1px solid var(--border); border-radius:8px; overflow:hidden; background:var(--surface);">
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-bottom:1px solid var(--border); background:var(--surface-2);">
                    <span class="pg-car-label" style="font-weight:600; font-size:0.95rem;">1  -  Agent Instructions</span>
                    <span class="pg-car-counter" style="font-size:0.85rem; color:var(--muted);">1 / 3</span>
                </div>
                <img data-slide="0" src="images/playground/agent/Agent Instruction Page.png" alt="Agent Instructions" style="display:block; width:100%; height:auto;">
                <img data-slide="1" src="images/playground/agent/Agent Knowledge Page.png"   alt="Agent Knowledge"     style="display:none;  width:100%; height:auto;">
                <img data-slide="2" src="images/playground/agent/Agent Toolbox Page.png"     alt="Agent Toolbox"       style="display:none;  width:100%; height:auto;">
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-top:1px solid var(--border); background:var(--surface-2);">
                    <button onclick="var c=document.getElementById('pg-agent-carousel'),imgs=c.querySelectorAll('img[data-slide]'),labels=['1  -  Agent Instructions','2  -  Knowledge','3  -  Toolbox'],idx=+c.dataset.idx;imgs[idx].style.display='none';idx=(idx-1+imgs.length)%imgs.length;imgs[idx].style.display='block';c.dataset.idx=idx;c.querySelector('.pg-car-label').textContent=labels[idx];c.querySelector('.pg-car-counter').textContent=(idx+1)+' / '+imgs.length;" style="padding:6px 18px; border-radius:5px; border:1px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; font-size:0.9rem;">← Prev</button>
                    <button onclick="var c=document.getElementById('pg-agent-carousel'),imgs=c.querySelectorAll('img[data-slide]'),labels=['1  -  Agent Instructions','2  -  Knowledge','3  -  Toolbox'],idx=+c.dataset.idx;imgs[idx].style.display='none';idx=(idx+1)%imgs.length;imgs[idx].style.display='block';c.dataset.idx=idx;c.querySelector('.pg-car-label').textContent=labels[idx];c.querySelector('.pg-car-counter').textContent=(idx+1)+' / '+imgs.length;" style="padding:6px 18px; border-radius:5px; border:1px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; font-size:0.9rem;">Next →</button>
                </div>
            </div>
        `
    },

    {
        id: "playground-handson-1",
        title: "Hands-on: Generate MCP JSON",
        content: `
            <h2>Hands-on: Step 1  -  Generate Your MCP Tool Definition</h2>
            ${C.handson("Step 1: Generate Your MCP Tool Definition", `
                <ol>
                    <li>Open the Pixel console or Notebook in ${CONFIG.productName}</li>
                    <li>Run the following, replacing the ID with your project ID:
                        ${C.code(`MakePythonMCP(project=["<your-project-id>"]);`, 'pixel')}
                    </li>
                    <li>Navigate to your project's <code>assets/mcp/</code> folder and open <code>py_mcp.json</code></li>
                    <li>Verify your function appears as a tool with <code>name</code>, <code>description</code>, and <code>inputSchema</code></li>
                </ol>
                <h4>Expected Result</h4>
                ${C.code(`{
  "tools": [
    {
      "name": "search_documents",
      "description": "Search FDA guidance documents and return relevant passages...",
      "inputSchema": {
        "type": "object",
        "properties": {
          "question": { "type": "string", "description": "The question to search for" }
        },
        "required": ["question"]
      }
    }
  ]
}`, 'json', 'assets/mcp/py_mcp.json  -  what you should see')}
                ${C.callout('If the file is empty or missing, check that <code>mcp_driver.py</code> has at least one function with a docstring.', 'tip')}
            `)}
        `
    },

    {
        id: "playground-handson-2",
        title: `Hands-on: Wire into ${CONFIG.aiName}`,
        content: `
            <h2>Hands-on: Step 2  -  Add Your Tool to a ${CONFIG.aiName} Room</h2>
            ${C.handson(`Step 2: Add Your Tool to a ${CONFIG.aiName} Room`, `
                <ol>
                    <li>Open <strong>${CONFIG.aiName}</strong> in ${CONFIG.productName}</li>
                    <li>Create a new Room Folder (or open an existing one)</li>
                    <li>In <strong>Settings</strong>: add your project as an MCP server
                        <ul>
                            <li>Type: <code>PROJECT</code></li>
                            <li>ID: your project ID from Step 1</li>
                        </ul>
                    </li>
                    <li>Set a system prompt:
                        ${C.code(`You are an FDA regulatory assistant.
Use the search_documents tool to answer questions based only on official FDA guidance.
Always cite the document passage you found before giving your answer.`, 'properties', 'System Prompt')}
                    </li>
                    <li>Save the Room Folder</li>
                </ol>
            `)}
        `
    },

    {
        id: "playground-handson-3",
        title: "Hands-on: The Payoff",
        content: `
            <h2>Hands-on: Step 3  -  Ask the Agent a Question</h2>
            ${C.handson("Step 3: Ask the Agent a Question", `
                <ol>
                    <li>Open a <strong>new Room</strong> inside your Room Folder</li>
                    <li>Ask: <em>"What does the guidance say about [topic from your documents]?"</em></li>
                    <li>Watch the agent:
                        <ul>
                            <li>Call your <code>search_documents</code> tool with a structured input</li>
                            <li>Receive the passages your vector engine returns</li>
                            <li>Incorporate them into a coherent answer</li>
                        </ul>
                    </li>
                    <li>Ask a follow-up question to see multi-turn behavior</li>
                </ol>
                ${C.callout('If the agent answers without calling the tool, refine your system prompt to be more directive: <em>"Always use the search_documents tool before answering any question about FDA regulations."</em>', 'tip')}
                <h4>What Success Looks Like</h4>
                ${C.flow([
                    { title: 'You ask a question', desc: 'In plain English  -  no Pixel, no code', arrow: '↓' },
                    { title: 'Agent calls search_documents', desc: 'You see the tool call in the conversation log', arrow: '↓' },
                    { title: 'Vector engine returns passages', desc: 'Your Day 1 work doing its job', arrow: '↓' },
                    { title: 'Agent synthesizes an answer', desc: 'Grounded in real FDA documents' },
                ])}
            `)}
        `
    },

    {
        id: "playground-summary",
        title: "Section Summary",
        content: `
            <h2>Morning Summary  -  What You Built</h2>
            ${C.cards([
                { badge: 'Day 1', title: 'The App', desc: 'Vector engine ingesting FDA docs + published app with RAG notebook' },
                { badge: 'Step 1', title: 'MCP Exposed', desc: 'Python function + MakePythonMCP() = discoverable tool with a JSON schema' },
                { badge: 'Step 2', title: `${CONFIG.aiName} Wired`, desc: 'Room Folder connects your tool to an AI agent with a targeted system prompt' },
                { badge: 'Step 3', title: 'Agent Works', desc: 'Ask a question in plain English  -  agent calls your tool, gets results, answers correctly' },
            ])}
            ${C.callout('After lunch: <strong>Security</strong> (who can use this), <strong>API Endpoints</strong> (how to call it from outside ${CONFIG.productName}), then open build time.', 'info')}
        `
    }

];
