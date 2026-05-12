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
                    title: "Old Way  -  Code Everything",
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
                    title: "Vibe Coding  -  Describe and Build",
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
            ${C.callout(`Claude Code is connected to your ${CONFIG.productName} instance  -  so the AI assistant generating your app is running on ${CONFIG.productName}'s models, not an external service.`, 'tip')}
        `
    },
    {
        id: "vibe-setup-clone",
        title: "Setup Step 1: Clone the Template",
        content: `
            <h2>Setup Step 1: Clone the Template App</h2>
            ${C.handson("Setup Step 1: Clone the Template App", `
                <h4>Run these commands in your terminal:</h4>
                ${C.code(`git clone ${CONFIG.templateRepoUrl}`, 'bash', 'Clone the template')}
                ${C.code(`cd <project-folder>`, 'bash', 'Enter the project')}
                ${C.code(`ls`, 'bash', 'Confirm the structure')}

                <h4>You should see:</h4>
                ${C.tree([
                    { name: "src/", type: "dir", desc: "app source files" },
                    { name: "package.json", type: "file", desc: "Node dependencies" },
                    { name: ".claude/", type: "dir", desc: "Claude Code configuration" },
                    { name: "README.md", type: "file", desc: "setup instructions" },
                ])}

                ${C.callout('Raise your hand if you hit an error  -  helpers are circulating.', 'warning')}
            `)}
        `
    },
    {
        id: "vibe-setup-apikey",
        title: "Setup Step 2: Create Your Access Key",
        content: `
            <h2>Setup Step 2: Create Your ${CONFIG.productName} Access Key</h2>
            ${C.handson("Setup Step 2: Create Your ELSA Access Key", `
                <ol>
                    <li>Open ${CONFIG.productName} in your browser</li>
                    <li>Click your profile icon (top-right) &rarr; <strong>Settings</strong> &rarr; <strong>API Keys</strong></li>
                    <li>Click <strong>Generate New Key</strong></li>
                    <li>Copy both the <strong>Access Key</strong> and <strong>Secret Key</strong> and save them somewhere safe  -  the Secret is shown only once</li>
                </ol>

                ${C.callout('Keep these private  -  treat them like a password. Do not paste them into chat or share your screen while they are visible.', 'warning')}
            `)}
        `
    },
    {
        id: "vibe-setup-settings",
        title: "Setup Step 3: Configure Claude Code",
        content: `
            <h2>Setup Step 3: Configure Claude Code for ${CONFIG.productName}</h2>
            ${C.handson("Setup Step 3: Configure Claude Code for ELSA", `
                <p>Open <code>.claude/settings.json</code> in the template project (create it if it does not exist) and add:</p>

                ${C.code(`{
  "env": {
    "ANTHROPIC_BASE_URL": "${CONFIG.anthropicEndpoint}",
    "ANTHROPIC_API_KEY": "<your-access-key>:<your-secret-key>"
  }
}`, 'json', '.claude/settings.json')}

                ${C.callout(`This tells Claude Code to send all AI requests to your ${CONFIG.productName} instance instead of Anthropic directly. The models you're using are hosted inside your FDA environment.`, 'info')}
            `)}
        `
    },
    {
        id: "vibe-smoke-test",
        title: "Smoke Test: Confirm Claude Code is Hitting ELSA",
        content: `
            <h2>Smoke Test: Confirm Claude Code is Hitting ${CONFIG.productName}</h2>
            ${C.handson("Smoke Test: Confirm Claude Code is Hitting ELSA", `
                <ol>
                    <li>From the project folder in your terminal, run:
                        ${C.code(`claude`, 'bash')}
                    </li>
                    <li>Type this message and press Enter:
                        ${C.code(`Say hello and tell me what model you are`, 'text')}
                    </li>
                    <li><strong>Expected:</strong> a response (the model name may vary)</li>
                    <li><strong>If no response or an error:</strong>
                        <ul>
                            <li>Check that <code>ANTHROPIC_BASE_URL</code> is exactly the URL the presenter shared</li>
                            <li>Check that <code>ANTHROPIC_API_KEY</code> is in the format <code>access-key:secret-key</code></li>
                        </ul>
                    </li>
                </ol>

                ${C.callout(`If it works, you're ready. If not, raise your hand now  -  don't wait until the build exercise to discover an issue.`, 'tip')}
            `)}
        `
    },
    {
        id: "vibe-presenter-demo",
        title: "Watch: Build a Q&A App in 10 Minutes",
        content: `
            <h2>Watch: Build a Q&A App in 10 Minutes</h2>
            <p>The presenter will build a working app live. Watch how it comes together.</p>
            <ul>
                <li>Open Claude Code in the template project</li>
                <li>Give it a prompt describing the Q&A app (using the vector engine from the Engines section)</li>
                <li>Watch it generate the app structure  -  files, UI, Pixel logic</li>
                <li>Run it, ask it a question, see the answer with source documents</li>
                <li>Send one follow-up prompt to refine the UI or behavior</li>
                <li>Publish and open the live URL</li>
            </ul>
            ${C.callout('Watch how the presenter phrases the prompt  -  specificity matters. A clear description of the data source, the question input, and the output format gets you much further than a vague request.', 'tip')}
        `
    },
    {
        id: "vibe-handson-build",
        title: "Hands-on: Build Your App",
        content: `
            <h2>Hands-on: Build Your App</h2>
            ${C.handson("Build Your App", `
                <h4>Everyone (start here)</h4>
                <ol>
                    <li>Open Claude Code in the project folder you cloned</li>
                    <li>Describe an app that uses your vector engine  -  include what question users should ask, and what the output should look like</li>
                    <li>Run the app and confirm it works</li>
                    <li>Publish it  -  copy the live URL and share it in the chat</li>
                </ol>

                <h4>Tier 2  -  go further</h4>
                <ol>
                    <li>Send at least one follow-up prompt to change something about the UI or behavior (layout, labels, filters, styling)</li>
                    <li>Re-publish and verify the change is live</li>
                </ol>

                <h4>Tier 3  -  go deeper</h4>
                <ol>
                    <li>Open a generated file and find the Pixel command that runs on submit</li>
                    <li>Edit it directly  -  add a filter, change a parameter, or add a second query</li>
                    <li>Publish and confirm the manual edit took effect</li>
                </ol>

                ${C.callout(`Stuck on the prompt? Start with: "Build a Q&A app that searches my vector engine and displays the answer with source document names."`, 'tip')}
            `)}
        `
    },
    {
        id: "vibe-day2-bridge",
        title: "Day 1 Complete  -  What's Next",
        content: `
            <h2>Day 1 Complete  -  What's Next</h2>
            ${C.cards([
                {
                    badge: "Tomorrow",
                    title: "MCP",
                    desc: "Turn your app into a tool that an AI agent can call  -  expose it as an MCP endpoint"
                },
                {
                    badge: "Tomorrow",
                    title: "Playground",
                    desc: `Wire your MCP tool into an AI agent in the ${CONFIG.productName} Playground and watch it reason`
                },
                {
                    badge: "Tomorrow",
                    title: "Capstone",
                    desc: "Build something real for your team  -  combine engines, tools, and agents into a complete workflow"
                },
            ])}
            ${C.callout(`Keep your ${CONFIG.productName} session active overnight  -  your vector engine, access keys, and published app will all be there tomorrow.`, 'info')}
        `
    }
];
