// Topic: MCP in Action  —  Day 2 Section 4
const slides_mcp_in_action = [

    // ─── SECTION 4: MCP IN ACTION ─────────────────────────────────────────────

    {
        id: "mcp-in-action-title",
        title: "MCP in Action",
        content: C.titleSlide(
            "MCP in Action",
            "Convert your app into a callable agent tool",
            "60 minutes"
        )
    },

    {
        id: "mcp-in-action-overview",
        title: "What We're Going to Do",
        content: `
            <h2>What We're Going to Do</h2>
            <p class="lead">Your Day 1 app has a vector engine and a working Pixel query. We're going to wrap that logic so an agent can call it as a tool.</p>
            ${C.flow([
                { title: 'Your Day 1 App', desc: 'Vector engine + Pixel query already working', arrow: '↓' },
                { title: 'Write mcp_driver.py', desc: 'One Python function  —  same logic, just wrapped', arrow: '↓' },
                { title: 'Add @mcp_metadata', desc: 'Tell the platform: execution mode, loading message, display', arrow: '↓' },
                { title: 'Run MakePythonMCP()', desc: 'Platform reads your function and generates the JSON schema', arrow: '↓' },
                { title: `Add to ${CONFIG.aiName}`, desc: 'Agent can now discover and call your tool', arrow: '↓' },
                { title: 'Test it live', desc: 'Ask the agent a question  —  watch it call your tool' },
            ])}
        `
    },

    {
        id: "mcp-demo-driver",
        title: "Writing mcp_driver.py",
        content: `
            <h2>Step 1  —  Write mcp_driver.py</h2>
            <p>Take your Pixel query from Day 1 and wrap it in a Python function. The function signature and docstring become the tool's contract.</p>
            ${C.code(`from semoss import Insight
import smssutil

VECTOR_ENGINE_ID = "<your-vector-engine-id>"

@smssutil.mcp_metadata({
    "execution": "auto",
    "loadingMessage": "Searching FDA documents...",
    "displayLocation": "hidden"
})
def search_documents(question: str) -> str:
    """
    Search FDA guidance documents and return relevant passages for a given question.
    Use this when the user asks anything about FDA regulations, guidance, or policy.
    """
    insight = Insight()
    pixel = f"""
        VectorDatabaseQuery(
            engine=["{VECTOR_ENGINE_ID}"],
            command=["<encode>{question}</encode>"],
            limit=[5]
        );
    """
    result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
    rows = result[0].get("output", [])
    if not rows:
        return "No relevant passages found."
    return "\\n\\n".join(
        f"[{r.get('Source','')} p.{r.get('Divider','')}] {r.get('Content','')}"
        for r in rows
    )`, 'python', 'assets/py/mcp_driver.py')}
            ${C.callout('The docstring is what the agent reads to decide when to call this tool. Be specific: <em>"Use this when the user asks anything about FDA regulations…"</em>', 'tip')}
        `
    },

    {
        id: "mcp-metadata-deep-dive",
        title: "The @mcp_metadata Decorator",
        content: `
            <h2>The @mcp_metadata Decorator  —  What Each Field Does</h2>
            ${C.code(`@smssutil.mcp_metadata({
    "execution":       "auto",      # "auto" | "ask" | "disabled"
    "loadingMessage":  "Searching FDA documents...",
    "displayLocation": "hidden"     # "hidden" | "inline" | "sidebar"
})`, 'python')}
            ${C.table(
                ['Field', 'Values', 'Effect'],
                [
                    ['<code>execution</code>', '<code>"auto"</code>', 'Agent calls silently  —  no user confirmation needed'],
                    ['<code>execution</code>', '<code>"ask"</code>', 'Agent shows what it wants to do and waits for approval  —  <strong>default if omitted</strong>'],
                    ['<code>execution</code>', '<code>"disabled"</code>', 'Tool is hidden from the agent entirely'],
                    ['<code>loadingMessage</code>', 'Any string', `Text shown in ${CONFIG.aiName} while the tool runs`],
                    ['<code>displayLocation</code>', '<code>"hidden"</code>', 'No UI panel  —  tool runs silently and returns data to the model'],
                    ['<code>displayLocation</code>', '<code>"inline"</code>', 'UI panel renders inside the chat thread'],
                    ['<code>displayLocation</code>', '<code>"sidebar"</code>', 'UI panel opens in the right sidebar (persistent)'],
                ]
            )}
            ${C.callout('<strong>Default execution is <code>"ask"</code></strong>  —  if you omit the decorator, the agent will always ask for permission first. Explicitly set <code>"auto"</code> only for read-only operations.', 'warning')}
        `
    },

    {
        id: "mcp-generated-json",
        title: "The Generated py_mcp.json",
        content: `
            <h2>What MakePythonMCP() Generates</h2>
            <p>After running <code>MakePythonMCP()</code>, open <code>assets/mcp/py_mcp.json</code>. Here's what you'll see  —  and what each field means.</p>
            ${C.code(`{
  "tools": [
    {
      "name": "search_documents",
      "description": "Search FDA guidance documents and return relevant passages...",
      "inputSchema": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string",
            "description": "The question to search for"
          }
        },
        "required": ["question"],
        "title": "Search Documents Arguments"
      },
      "_meta": {
        "SMSS_MCP_EXECUTION": "auto",
        "SMSS_MCP_UI": {
          "loadingMessage": "Searching FDA documents...",
          "displayLocation": "hidden"
        },
        "SMSS_FUNCTION_NAME": "search_documents",
        "generated_on": "2025-05-14"
      },
      "_type": "python"
    }
  ]
}`, 'json', 'assets/mcp/py_mcp.json  —  generated output')}
            ${C.split(
                {
                    title: 'What the Agent Reads',
                    content: `
                        <ul>
                            <li><code>name</code>, <code>description</code>, <code>inputSchema</code>  —  the tool's public contract</li>
                            <li>The agent uses <code>description</code> to decide <em>when</em> to call it</li>
                            <li>The agent uses <code>inputSchema</code> to know <em>what to pass</em></li>
                        </ul>
                    `
                },
                {
                    title: 'What the Platform Reads',
                    content: `
                        <ul>
                            <li><code>_meta.SMSS_MCP_EXECUTION</code>  —  auto / ask / disabled</li>
                            <li><code>_meta.SMSS_MCP_UI</code>  —  display behavior</li>
                            <li><code>_meta.SMSS_FUNCTION_NAME</code>  —  maps back to your Python function</li>
                        </ul>
                    `
                }
            )}
            ${C.callout('Never hand-edit this file  —  re-run <code>MakePythonMCP()</code> and it regenerates cleanly.', 'warning')}
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
        title: `Wire Your MCP into ${CONFIG.aiName}`,
        content: `
            <h2>Step 5  —  Add Your Tool to ${CONFIG.aiName} and Test It</h2>
            ${C.handson(`Wire Your MCP into ${CONFIG.aiName}`, `
                <h4>Add the MCP server:</h4>
                <ol>
                    <li>Open <strong>${CONFIG.aiName}</strong> → open or create a Room Folder</li>
                    <li>Go to the <strong>Toolbox</strong> tab → <strong>Add MCP Server</strong></li>
                    <li>Select your project  —  ${CONFIG.productName} auto-loads <code>assets/mcp/py_mcp.json</code></li>
                    <li>Your <code>search_documents</code> tool should appear in the tool list</li>
                </ol>

                <h4>Set a system prompt:</h4>
                ${C.code(`You are an FDA regulatory assistant.
Use the search_documents tool to answer questions based only on official FDA guidance.
Always cite the source document and page range before giving your answer.`, 'properties', 'System Prompt')}

                <h4>Test it:</h4>
                <ol>
                    <li>Open a new Room inside the folder</li>
                    <li>Ask: <em>"What does the guidance say about [a topic in your documents]?"</em></li>
                    <li>Watch the agent call <code>search_documents</code>, receive passages, then answer</li>
                </ol>
                ${C.callout('If the agent answers without calling the tool, tighten the system prompt: <em>"Always use search_documents before answering any question about FDA regulations."</em>', 'tip')}
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
                        'Any ${CONFIG.productName} user with access to your project',
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
                    title: 'Make it discoverable inside ${CONFIG.productName}',
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
                    <li>${CONFIG.aiName} → Room Folder → Toolbox → Add MCP Server → your project</li>
                    <li>Set a system prompt instructing the agent to use your tool</li>
                    <li>Ask a question  —  confirm the agent calls <code>search_documents</code></li>
                    <li>Share your project ID with a neighbor and add theirs to your ${CONFIG.aiName}</li>
                </ol>
                ${C.callout('Stuck? The most common issue is a vague docstring. Make it say exactly when to call the tool.', 'tip')}
            `)}
        `
    },

];
