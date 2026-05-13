// Topic: Vibe Coding  -  Build Your First App
const slides_vibe_coding = [
    {
        id: "vibe-title",
        title: "Vibe Coding",
        content: C.titleSlide(
            "Vibe Coding",
            `Build a working app with Claude Code + ${CONFIG.productName}`,
            "45 minutes"
        )
    },
    {
        id: "vibe-what-is",
        title: "What is Vibe Coding?",
        content: `
            <h2>What is Vibe Coding?</h2>
            ${C.split(
                {
                    title: "Old Way — Code Everything",
                    content: `
                        <ol>
                            <li>Define the data model</li>
                            <li>Write backend Pixel / Java logic</li>
                            <li>Build the React UI</li>
                            <li>Wire state, events, API calls</li>
                            <li>Debug and publish</li>
                        </ol>
                        <p class="muted">Hours to days. Requires coding skills.</p>
                    `
                },
                {
                    title: "Vibe Coding — Describe and Build",
                    content: `
                        <ol>
                            <li>Open Claude Code in your project</li>
                            <li>Describe what you want in plain English</li>
                            <li>AI generates the app</li>
                            <li>Run it, iterate with follow-up prompts</li>
                            <li>Publish</li>
                        </ol>
                        <p class="muted">Minutes. No prior coding required.</p>
                    `
                }
            )}
            ${C.callout(`Claude Code is connected to your ${CONFIG.productName} instance — so the AI assistant generating your app is running on ${CONFIG.productName}'s models, not an external service.`, 'tip')}
        `
    },
    {
        id: "vibe-setup-clone",
        title: "Setup Step 1: Clone the Template",
        content: `
            <h2>Setup Step 1: Clone the Template App</h2>
            ${C.handson("Setup Step 1: Clone the Template App", `
                <p><strong>Prerequisite:</strong> you need Git and Node.js installed. If you don't have Git, the presenter will share a zip download instead.</p>

                <h4>Run these commands in your terminal:</h4>
                ${C.code(`git clone ${CONFIG.templateRepoUrl}`, 'bash', 'Clone the template')}
                ${C.code(`cd ${CONFIG.templateFolderName}`, 'bash', 'Enter the project')}

                ${C.callout('Raise your hand if cloning fails — helpers will share the zip.', 'warning')}
            `)}
        `
    },
    {
        id: "vibe-setup-apikey",
        title: "Setup Step 2: Create Your Access Key",
        content: `
            <h2>Setup Step 2: Create Your ${CONFIG.productName} Access Key</h2>
            ${C.handson(`Setup Step 2: Create Your ${CONFIG.productName} Access Key`, `
                <ol>
                    <li>Open ${CONFIG.productName} in your browser</li>
                    <li>Click <strong>Settings</strong> in the left sidebar</li>
                    <li>Click <strong>My Profile</strong></li>
                    <li>Scroll down to the <strong>Personal Access Tokens</strong> section and click <strong>+ New Key</strong></li>
                    <li>Give the key a <strong>name</strong> (e.g. <code>vibe-coding</code>), add an optional description, and click <strong>Generate</strong></li>
                    <li>Copy both the <strong>Access Key</strong> and <strong>Secret Key</strong> immediately — the Secret is shown only once</li>
                </ol>

                ${C.callout('Keep these private — treat them like a password. Do not paste them into chat or share your screen while they are visible.', 'warning')}
            `)}
        `
    },
    {
        id: "vibe-setup-settings",
        title: "Setup Step 3: Configure Claude Code",
        content: `
            <h2>Setup Step 3: Configure Claude Code for ${CONFIG.productName}</h2>
            ${C.handson(`Setup Step 3: Configure Claude Code for ${CONFIG.productName}`, `
                <p>Open <code>.claude/settings.json</code> in the template project (create it if it does not exist) and paste:</p>

                ${C.code(`{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<your-access-key>:<your-secret-key>",
    "ANTHROPIC_BASE_URL": "${CONFIG.anthropicEndpoint}",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "true",
    "NODE_TLS_REJECT_UNAUTHORIZED": "0"
  },
  "model": "${CONFIG.claudeCodeModelId}",
  "effortLevel": "medium"
}`, 'json', '.claude/settings.json')}

                <ul>
                    <li><code>ANTHROPIC_AUTH_TOKEN</code> — your access key + secret, separated by a colon</li>
                    <li><code>ANTHROPIC_BASE_URL</code> — routes all model calls to ${CONFIG.productName}</li>
                    <li><code>CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC</code> — turns off telemetry and other non-essential outbound calls</li>
<li><code>model</code> — the model engine ID from your ${CONFIG.productName} catalog (ask your presenter)</li>
                    <li><code>effortLevel</code> — how hard Claude Code thinks before responding (<code>low</code> / <code>medium</code> / <code>high</code>)</li>
                </ul>

                ${C.callout(`The models you're calling are hosted inside your ${CONFIG.productName} environment — no traffic leaves your infrastructure.`, 'info')}
            `)}
        `
    },
    {
        id: "vibe-smoke-test",
        title: `Smoke Test: Confirm Claude Code is Hitting ${CONFIG.productName}`,
        content: `
            <h2>Smoke Test: Confirm Claude Code is Hitting ${CONFIG.productName}</h2>
            ${C.handson(`Smoke Test: Confirm Claude Code is Hitting ${CONFIG.productName}`, `
                <ol>
                    <li>From the project folder in your terminal, run:
                        ${C.code(`claude`, 'bash')}
                    </li>
                    <li>Type this message and press Enter:
                        ${C.code(`say hello`, 'text')}
                    </li>
                    <li><strong>Expected:</strong> any response back — if you get a reply, the connection is working</li>
                    <li><strong>If you get an auth error or connection refused:</strong>
                        <ul>
                            <li>Check that <code>ANTHROPIC_BASE_URL</code> is <code>${CONFIG.anthropicEndpoint}</code> — no trailing slash</li>
                            <li>Check that <code>ANTHROPIC_AUTH_TOKEN</code> is formatted as <code>access-key:secret-key</code> (the two values joined with a colon)</li>
                            <li>Check that your model engine in ${CONFIG.productName} is enabled and you have access to it</li>
                            <li>Re-run <code>claude</code> after fixing — changes to <code>settings.json</code> take effect on next launch</li>
                        </ul>
                    </li>
                </ol>

                ${C.callout(`If it works, you're ready. If not, raise your hand now — don't wait until the build exercise to discover an issue.`, 'tip')}
            `)}
        `
    },
    {
        id: "vibe-presenter-demo",
        title: "Follow Along: Build a Q&A App",
        content: `
            <h2>Follow Along: Build a Q&A App</h2>
            <p>The presenter will run this prompt live. Watch how the app comes together, then you'll do the same with your own variation.</p>
            ${C.code(`Build a single-page Q&A app on top of my ${CONFIG.productName} vector engine.

Requirements:
- A text input where the user types a question
- A "Search" button that calls VectorDatabaseQuery against the vector engine to get the top 3 chunks
- Pass those chunks as context into an LLM call against my shared model engine
- Display the answer prominently, and list the source document names below it
- Use the @semoss/sdk to run the Pixel commands
- Keep the UI clean and minimal — single column, generous spacing`, 'text', 'Presenter Prompt — copy from chat if you want to follow exactly')}
            ${C.callout('Specificity matters. A clear description of the data source, the inputs, and the expected output gets you a working app on the first try. Vague prompts get vague apps.', 'tip')}
        `
    },
    {
        id: "vibe-handson-build",
        title: "Hands-on: Build Your App",
        content: `
            <h2>Hands-on: Build Your App</h2>
            ${C.handson("Build Your App", `
                <ol>
                    <li>Open Claude Code in the project folder you cloned</li>
                    <li>Write a prompt describing your app — include the vector engine ID, the question users will ask, and what the output should look like</li>
                    <li>Let Claude Code generate the app, then run it locally and confirm it works</li>
                    <li>Publish it from ${CONFIG.productName} and share the live URL in the chat</li>
                </ol>

                ${C.callout(`Stuck on the prompt? Start with the presenter's prompt from the previous slide and tweak the requirements for your own data.`, 'tip')}

                <h4>Troubleshooting</h4>
                <ul>
                    <li><strong>Updated <code>.mcp.json</code> or <code>settings.json</code>?</strong> Quit Claude Code (<code>/exit</code> or Ctrl+C) and re-run <code>claude</code> — config changes only load on launch</li>
                    <li><strong>Auth error after pasting keys?</strong> Make sure your token is formatted <code>access-key:secret-key</code> — single colon, no spaces</li>
                    <li><strong>Tools not appearing?</strong> Use <code>/mcp</code> inside Claude Code to list connected MCP servers and confirm they're loaded</li>
                </ul>
            `)}
        `
    },
    {
        id: "vibe-extensions",
        title: "Extensions — Go Further",
        content: `
            <h2>Extensions — Once Your App Works</h2>
            <p>Done with the base exercise? Pick a tier and keep building.</p>
            ${C.handson("Extensions", `
                <h4>Tier 2 — Refine with follow-up prompts</h4>
                <ol>
                    <li>Send a follow-up prompt to change the UI or behavior (layout, labels, filters, styling)</li>
                    <li>Re-publish and confirm the change is live</li>
                </ol>

                <h4>Tier 3 — Edit the Pixel directly</h4>
                <ol>
                    <li>Open a generated file and find the Pixel command that runs on submit</li>
                    <li>Edit it directly — add a filter, change a parameter, or chain a second query</li>
                    <li>Re-publish and confirm the manual edit took effect</li>
                </ol>
            `)}
        `
    },
    {
        id: "vibe-day2-bridge",
        title: "Day 1 Complete — What's Next",
        content: `
            <h2>Day 1 Complete — What's Next</h2>
            ${C.cards([
                {
                    badge: "Tomorrow",
                    title: "MCP",
                    desc: "Turn your app into a tool that an AI agent can call — expose it as an MCP endpoint"
                },
                {
                    badge: "Tomorrow",
                    title: "Playground",
                    desc: `Wire your MCP tool into an AI agent in the ${CONFIG.productName} Playground and watch it reason`
                },
                {
                    badge: "Tomorrow",
                    title: "Capstone",
                    desc: "Build something real for your team — combine engines, tools, and agents into a complete workflow"
                },
            ])}
            ${C.callout(`Your vector engine, access keys, and published app are all persisted server-side — everything will be exactly where you left it tomorrow.`, 'info')}
            ${C.callout(`When you reopen Claude Code tomorrow, run <code>/resume</code> to pick up your conversation exactly where you left off.`, 'tip')}
        `
    }
];
