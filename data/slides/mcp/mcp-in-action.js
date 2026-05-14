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
                { title: 'Ask the Agent to Convert It', desc: 'We\'ll ask the agent to generate the MCP JSON for our sample app', arrow: '↓' },
                { title: 'Review the Generated JSON', desc: 'See the <code>mcp</code> folder and what was created', arrow: '↓' },
                { title: `Add to ${CONFIG.aiName}`, desc: 'Wire the toolbox into a room via the + button', arrow: '↓' },
                { title: 'Test It Live', desc: 'Ask the agent a question — watch it call your tool' },
            ])}
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
                    <li>Open Claude and start a new conversation</li>
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
                            <li><code>MakePixelMCP(project=["&lt;id&gt;"], reactor = ["SampleReactor"])</code> — for Pixel-based tools</li>
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
        id: "mcp-js-ts-sdk",
        title: "JS/TS SDK  —  Portal UIs",
        content: `
            <h2>JS/TS SDK  —  Building Portal UIs for Your Tools</h2>
            <p>If your MCP tool needs a rich UI, build one in React using <code>@semoss/sdk</code>. The portal renders inside ${CONFIG.aiName} when the tool is called.</p>
            ${C.code(`import { useInsight } from '@semoss/sdk/react';

export function SearchPortal() {
  const { actions, tool } = useInsight();

  const runSearch = async (q) => {
    const { pixelReturn } = await actions.run(
      \`VectorDatabaseQuery(engine=["..."], command=["<encode>\${q}</encode>"], limit=[5]);\`
    );
    return pixelReturn[0].output;
  };

  const done = (result) => {
    actions.sendMCPResponseToPlayground(result);  // returns value to the model
  };

  return <div>...</div>;
}`, 'typescript', 'Key hook: useInsight()')}
            ${C.table(
                ['Method', 'What it does'],
                [
                    ['<code>actions.run(pixel)</code>', 'Execute any Pixel expression and get the result back'],
                    ['<code>actions.runMCPTool(name, params)</code>', 'Call another MCP tool from inside your portal'],
                    ['<code>actions.sendMCPResponseToPlayground(result)</code>', 'Return a value to the model from the portal'],
                    ['<code>tool</code>', "The tool's metadata  —  name, description, inputSchema"],
                ]
            )}
            ${C.callout('You don\'t need a portal for most tools. <code>displayLocation: "hidden"</code> is fine for anything that just returns data to the model.', 'info')}
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

    {
        id: "mcp-sharing",
        title: "Sharing Your MCP",
        content: `
            <h2>Sharing Your MCP  —  Who Can Use It</h2>
            <p class="lead">Once your MCP is published, other users can add it to their own ${CONFIG.aiName} rooms  —  or call it from outside ${CONFIG.productName} entirely.</p>
            ${C.table(
                ['How', 'Who', 'What they need'],
                [
                    [
                        `Add as MCP server in ${CONFIG.aiName}`,
                        'Any ' + CONFIG.productName + ' user with access to your project',
                        'Your project ID  —  they add it in their Toolbox tab'
                    ],
                    [
                        'External MCP client (Claude Code, custom app)',
                        'Anyone with an API key',
                        'Endpoint: <code>/ext/mcp/&lt;projectId&gt;/comms</code> + Authorization header'
                    ],
                ]
            )}
            ${C.split(
                {
                    title: 'Make it discoverable inside ' + CONFIG.productName,
                    content: `
                        <ol>
                            <li>Publish your app in the Catalog</li>
                            <li>Set appropriate permissions (who can see/use it)</li>
                            <li>Share your project ID in your team</li>
                        </ol>
                    `
                },
                {
                    title: 'Use from Claude Code (external)',
                    content: C.code(`// .mcp.json  —  same Monolith base as your OpenAI/Anthropic endpoint
{
  "mcpServers": {
    "fda-search": {
      "type": "sse",
      "url": "https://<your-elsa-host>/Monolith/ext/mcp/<projectId>/comms",
      "headers": {
        "Authorization": "Bearer <access-key>:<secret-key>"
      }
    }
  }
}`, 'json')
                }
            )}
        `
    },

    {
        id: "mcp-handson-convert",
        title: "Hands-on: Convert Your App",
        content: `
            <h2>Hands-on  —  Convert Your Vibe-Coded App into an MCP Tool</h2>
            ${C.handson("Convert Your App to MCP", `
                <h4>Step 1  —  Create mcp_driver.py</h4>
                <p>In your project, create <code>assets/py/mcp_driver.py</code> and write a function that wraps your Pixel search query.</p>
                ${C.code(`from semoss import Insight
import smssutil

@smssutil.mcp_metadata({
    "execution": "auto",
    "loadingMessage": "Searching...",
    "displayLocation": "hidden"
})
def search_documents(question: str) -> str:
    """
    [Describe what your tool does and WHEN the agent should call it.
     Be specific — this is how the agent decides to use your tool.]
    """
    insight = Insight()
    # paste your Pixel query here, replacing the hardcoded search term
    # with the 'question' parameter
    result = insight.run_pixel(pixel=..., insight_id=insight.insight_id)
    return str(result[0].get("output", "No results found"))`, 'python', 'assets/py/mcp_driver.py')}

                <h4>Step 2  —  Generate the MCP JSON</h4>
                ${C.code(`MakePythonMCP(project=["<your-project-id>"]);`, 'pixel', 'Run in ${CONFIG.productName} Notebook or console')}
                <p>Open <code>assets/mcp/py_mcp.json</code> and verify your function appears as a tool.</p>

                <h4>Step 3  —  Add to ${CONFIG.aiName} and test</h4>
                <ol>
                    <li>${CONFIG.aiName} → click + → Add Toolbox → search for your project</li>
                    <li>Set a system prompt instructing the agent to use your tool</li>
                    <li>Ask a question  —  confirm the agent calls <code>search_documents</code></li>
                    <li>Share your project ID with a neighbor and add theirs to your ${CONFIG.aiName}</li>
                </ol>
                ${C.callout('Stuck? The most common issue is a vague docstring. Make it say exactly when to call the tool.', 'tip')}
            `)}
        `
    },

];
