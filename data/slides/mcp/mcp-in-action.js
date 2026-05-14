// Topic: MCP in Action  —  Day 2 Section 4
const slides_mcp_in_action = [

    {
        id: "mcp-in-action-title",
        title: "MCP in Action",
        content: C.titleSlide(
            "MCP in Action",
            "Convert an app into a callable agent tool",
            "45 minutes"
        )
    },

    {
        id: "mcp-in-action-overview",
        title: "What We're Going to Do",
        content: `
            <h2>What We're Going to Do</h2>
            <p class="lead">We have a sample app already built. We're going to convert it into an MCP tool so an agent can call it directly.</p>
            ${C.flow([
                { title: 'Look at the Sample App', desc: 'Understand what we\'re converting and what it does', arrow: '↓' },
                { title: 'Ask the Agent to Convert It', desc: 'We\'ll ask the agent to generate the MCP JSON for us', arrow: '↓' },
                { title: 'Review the Generated JSON', desc: 'See the <code>mcp</code> folder and what was created', arrow: '↓' },
                { title: `Add to ${CONFIG.aiName}`, desc: 'Wire the toolbox into a room via the + button', arrow: '↓' },
                { title: 'Test It Live', desc: 'Ask the agent a question — watch it call your tool' },
            ])}
        `
    },

    {
        id: "mcp-sample-app",
        title: "The Sample App",
        content: `
            <h2>The Sample App</h2>
            <p class="lead">This is a simple app you have access to in ${CONFIG.productName}. Take a minute to open it and see what it does.</p>
            ${C.split(
                {
                    title: 'What it does',
                    content: `
                        <ul>
                            <li>Takes a user input</li>
                            <li>Runs a Pixel query against a data source</li>
                            <li>Returns and displays results</li>
                        </ul>
                        <p class="muted">Simple by design — the point is the conversion, not the app.</p>
                    `
                },
                {
                    title: 'What we want',
                    content: `
                        <ul>
                            <li>An agent that can call this app's logic as a tool</li>
                            <li>No manual JSON writing</li>
                            <li>We're going to ask the agent to do the conversion for us</li>
                        </ul>
                    `
                }
            )}
            ${C.callout('Open the sample app in your catalog now and run it once so you understand what it does before we convert it.', 'tip')}
        `
    },

    {
        id: "mcp-convert-agent",
        title: "Converting to MCP",
        content: `
            <h2>Converting the App to MCP</h2>
            <p class="lead">We're going to ask the agent to convert our app into an MCP — it will generate the JSON schema for us.</p>
            ${C.handson("Ask the Agent to Convert", `
                <ol>
                    <li>Open ${CONFIG.aiName} and start a new conversation</li>
                    <li>Ask the agent to convert your app into an MCP tool — describe what the app does and what input it takes</li>
                    <li>The agent will generate the MCP JSON and place it in the <code>assets/mcp/</code> folder of your project</li>
                    <li>Open the generated file and review it</li>
                </ol>
            `)}
            ${C.split(
                {
                    title: 'Manual alternative',
                    content: `
                        <p>If you prefer to generate the JSON yourself, run one of these Pixel reactors:</p>
                        <ul>
                            <li><code>MakePythonMCP(project=["&lt;id&gt;"])</code> — for Python-based tools</li>
                            <li><code>MakePixelMCP(project=["&lt;id&gt;"])</code> — for Pixel-based tools</li>
                        </ul>
                    `
                },
                {
                    title: 'If your tools are in Python',
                    content: `
                        <p>Python tools should live in <code>assets/py/mcp_driver.py</code>. Use the <code>@smssutil.mcp_metadata</code> decorator on each function to control execution mode and UI behavior.</p>
                        <p class="muted">The agent-generated JSON will reference these functions automatically.</p>
                    `
                }
            )}
        `
    },

    {
        id: "mcp-generated-json",
        title: "The Generated JSON",
        content: `
            <h2>What Gets Generated</h2>
            <p>After conversion, open <code>assets/mcp/py_mcp.json</code>. This is the contract the agent reads to know your tool exists and how to call it.</p>
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
      },
      "_meta": {
        "SMSS_MCP_EXECUTION": "auto",
        "SMSS_MCP_UI": {
          "loadingMessage": "Searching FDA documents...",
          "displayLocation": "hidden"
        }
      }
    }
  ]
}`, 'json', 'assets/mcp/py_mcp.json')}
            ${C.callout('The <code>description</code> field is how the agent decides <em>when</em> to call this tool. If the agent isn\'t using your tool, this is the first thing to improve.', 'info')}
        `
    },

    {
        id: "mcp-playground-wire",
        title: `Add Your Tool to ${CONFIG.aiName}`,
        content: `
            <h2>Add Your Tool to ${CONFIG.aiName} and Test It</h2>
            ${C.handson(`Wire into ${CONFIG.aiName}`, `
                <h4>Add the toolbox:</h4>
                <ol>
                    <li>Open <strong>${CONFIG.aiName}</strong> and start or open a room</li>
                    <li>Click the <strong>+</strong> button in the room</li>
                    <li>Click <strong>Add Toolbox</strong></li>
                    <li>Search for your toolbox — this is the set of tools generated when you converted the app</li>
                    <li>Select it — your tools are now available to the agent in this room</li>
                </ol>

                <h4>Test it:</h4>
                <ol>
                    <li>Ask the agent a question that should trigger your tool</li>
                    <li>Watch it call the tool, receive the result, and incorporate it into its answer</li>
                </ol>
                ${C.callout('If the agent isn\'t calling the tool, check the <code>description</code> field in your JSON — make it explicit about when the tool should be used.', 'tip')}
            `)}
        `
    },

];
