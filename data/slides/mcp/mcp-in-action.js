// Topic: MCP in Action  —  Day 2 Section 4
const slides_mcp_in_action = [

    {
        id: "mcp-in-action-title",
        title: "MCP in Action",
        content: C.titleSlide(
            "MCP in Action",
            "SDK deep-dive, live demo, then your turn",
            "45 minutes"
        )
    },

    {
        id: "mcp-in-action-overview",
        title: "What We're Doing",
        content: `
            <h2>What We're Doing</h2>
            <p class="lead">This section gets into the code. We're going to look at the ${CONFIG.productName} SDK and how your React app wires into ${CONFIG.aiName} — what the model passes in, how you return results, and how to handle the different contexts your UI runs in.</p>
            ${C.flow([
                { title: 'SDK deep-dive', desc: 'Open real code and walk through useInsight(), tool.parameters, and sendMCPResponseToPlayground', arrow: '↓' },
                { title: 'Demo: convert an app', desc: 'See the full conversion — tag, manifest, deploy — live', arrow: '↓' },
                { title: 'Your turn', desc: 'One prompt to your agent — it handles the rest' },
            ])}
            ${C.callout('You don\'t need to memorize the SDK. The pattern is always the same — read in from <code>tool.parameters</code>, do work, send back via <code>sendMCPResponseToPlayground</code>.', 'info')}
        `
    },

    {
        id: "mcp-demo-useinsight",
        title: "Setting Up Your UI to Handle Elsa Calls",
        content: `
            <h2>Setting Up Your UI to Handle Elsa Calls</h2>
            <p class="lead">We're opening <code>client/src/components/ExampleComponent.tsx</code>. This is the reference pattern — every tool UI is a variation of this.</p>
            ${C.code(`import { useInsight } from '@semoss/sdk/react';
import { useState, useEffect } from 'react';

export const WeatherPortal = () => {
  // actions = run Pixel, send results back; tool = what Elsa passed in
  const { actions, tool } = useInsight();
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState('');

  useEffect(() => {
    if (!tool) return; // opened standalone, not from Elsa

    if (tool.tool_response) {
      // viewing a past execution — restore what actually ran
      setForecast(String(tool.tool_response));
      setCity((tool.executedParameters?.city as string) || '');
      return;
    }

    // fresh call from Elsa — prefill with the model's proposed city
    setCity((tool.parameters?.city as string) || '');
  }, [tool]);

  const run = async () => {
    const { pixelReturn } = await actions.run(
      \`GetWeather(city=[\${JSON.stringify(city)}]);\`
    );
    const result = String(pixelReturn[0].output);
    setForecast(result);
    // send result back to Elsa Chat
    actions.sendMCPResponseToPlayground(result, 'success', { city });
  };

  return <div>...</div>;
};`, 'typescript', 'ExampleComponent.tsx (placeholder)')}
            ${C.table(
                ['', 'What it does'],
                [
                    ['<code>const { actions, tool } = useInsight()</code>', 'The primary SDK hook — run API and tool invocation context'],
                    ['<code>tool.parameters</code>', 'Inputs the model proposed when it called the tool'],
                    ['<code>actions.run(pixel)</code>', 'Execute any Pixel expression and get the result back'],
                    ['<code>actions.sendMCPResponseToPlayground(result, status, params)</code>', 'Return the final value to Elsa Chat — <code>result</code> must be a string'],
                ]
            )}
        `
    },

    {
        id: "mcp-demo-states",
        title: "The Three Contexts Your UI Runs In",
        content: `
            <h2>The Three Contexts Your UI Runs In</h2>
            <p>Your UI can be opened three ways. Getting the <code>useEffect</code> branching right is what makes it feel correct in all three.</p>
            ${C.table(
                ['Context', 'How to detect', 'What to do'],
                [
                    ['Opened standalone', '<code>tool</code> is falsy', 'Render empty form — don\'t read <code>tool.parameters</code>'],
                    ['Fresh call from Elsa', '<code>tool</code> truthy, <code>tool.tool_response</code> falsy', 'Prefill from <code>tool.parameters</code>, optionally auto-run'],
                    ['Viewing a past execution', '<code>tool.tool_response</code> truthy', 'Restore result; prefill inputs from <code>tool.executedParameters</code>'],
                ]
            )}
            ${C.code(`useEffect(() => {
  if (!tool) return;                      // standalone — nothing to prefill

  if (tool.tool_response) {              // past execution — restore previous result
    setResult(String(tool.tool_response));
    setCity((tool.executedParameters?.city as string) || '');
    return;
  }

  // fresh call — prefill with the model's proposed city
  setCity((tool.parameters?.city as string) || '');
}, [tool]);`, 'typescript', 'The canonical useEffect pattern')}
            ${C.callout('<code>tool.parameters</code> is what the model proposed. <code>tool.executedParameters</code> is what the user actually submitted (the third argument you pass to <code>sendMCPResponseToPlayground</code>). Always restore past executions from <code>executedParameters</code> — not <code>parameters</code>.', 'tip')}
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
                        `Add as toolbox in ${CONFIG.aiName}`,
                        'Any ' + CONFIG.productName + ' user with access to your project',
                        'Access to the project where the tools are defined in the MCP JSON'
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
                        </ol>
                    `
                },
                {
                    title: 'Use from Claude Code (external)',
                    content: C.code(`{
  "mcpServers": {
    "your-app": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${CONFIG.elsaUrl}/api/ext/mcp/<projectId>/comms",
        "--header",
        "Authorization:Bearer <ACCESS_KEY>:<SECRET_KEY>"
      ]
    }
  }
}`, 'json', '.mcp.json')
                }
            )}
        `
    },

    {
        id: "mcp-handson-intro",
        title: "Your Turn — The Agent Does the Wiring",
        content: `
            <h2>Your Turn  —  The Agent Does the Wiring</h2>
            <p class="lead">Your <code>${CONFIG.templateFolderName}</code> project's CLAUDE.md already knows the full MCP conversion pattern. You don't need to remember the steps — you just need to describe what you want.</p>
            ${C.flow([
                { title: 'Open Claude Code', desc: 'In your ' + CONFIG.templateFolderName + ' project', arrow: '↓' },
                { title: 'Tell the agent what you want', desc: '"Make my app an MCP tool in Elsa Chat" — one sentence is enough', arrow: '↓' },
                { title: 'Agent handles the mechanics', desc: 'Tags the project MCP, updates the manifest, redeploys', arrow: '↓' },
                { title: 'Test in Elsa Chat', desc: 'Add the toolbox, ask a question, watch the tool run' },
            ])}
            ${C.callout('The CLAUDE.md in <code>' + CONFIG.templateFolderName + '</code> has complete instructions for tagging, manifest editing, and deploy. The agent reads it automatically — you don\'t need to reference it yourself.', 'info')}
        `
    },

    {
        id: "mcp-handson-convert",
        title: "Hands-on: Convert Your App to MCP",
        content: `
            <h2>Hands-on  —  Convert Your App to MCP</h2>
            ${C.handson('Convert Your App', `
                <h4>Step 1  —  Open Claude Code in your project</h4>
                <p>Open a terminal in your <code>${CONFIG.templateFolderName}</code> folder and launch Claude Code:</p>
                ${C.code('claude', 'bash')}

                <h4>Step 2  —  Give the agent one instruction</h4>
                <p>Describe your app and ask for MCP exposure:</p>
                ${C.code('Make my app an MCP tool in Elsa Chat. [One sentence describing what your app does.]', 'text', 'Example prompt')}
                <p class="muted">Watch what the agent does — it maps directly to what we covered in the demo: tags the project, updates the manifest, redeploys.</p>

                <h4>Step 3  —  Test it in ${CONFIG.aiName}</h4>
                <ol>
                    <li>Open ${CONFIG.aiName} and start or open a room</li>
                    <li>Click <strong>+</strong> → <strong>Add Toolbox</strong> → search for your project</li>
                    <li>Ask a question that should trigger your tool</li>
                    <li>Share your project ID with a neighbor — add each other's tools and try calling them</li>
                </ol>
                ${C.callout('If the agent isn\'t calling the tool, the description field in your manifest is the first thing to tighten up — make it explicit about when the tool should be used.', 'tip')}
            `)}
        `
    },

];
