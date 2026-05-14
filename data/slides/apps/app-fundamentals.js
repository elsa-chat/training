// Topic: App Fundamentals
const slides_app_fundamentals = [
    {
        id: "appfund-title",
        title: "App Fundamentals",
        content: C.titleSlide(
            "App Fundamentals",
            `Going from engines and Pixel to a published, shareable app`,
            "30 minutes"
        )
    },
    {
        id: "appfund-what-is-app",
        title: "What is an App?",
        content: `
            <h2>What is an App in ${CONFIG.productName}?</h2>
            <p>A <strong>published experience</strong> — UI and logic packaged together and shared with users as a live URL. Every app lives in a project folder on the ${CONFIG.productName} server.</p>
            ${C.split(
                {
                    title: "What it gives users",
                    content: `
                        <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px;">
                            <span style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;font-size:.9rem;text-align:left;">A live URL — no install required</span>
                            <span style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;font-size:.9rem;text-align:left;">Access to your data and models through a built UI</span>
                            <span style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;font-size:.9rem;text-align:left;">Versioned — you can iterate and roll back safely</span>
                            <span style="padding:8px 16px;border:1px solid var(--border);border-radius:6px;font-size:.9rem;text-align:left;">Shareable with anyone you grant access</span>
                        </div>
                    `
                },
                {
                    title: "Where it lives on disk",
                    content: `<div class="c-code">
                        <div class="c-code-header"><span class="c-code-title">Folder Structure</span></div>
                        <pre><code>assets/
  portals/           ← HTML, CSS, JS served to users
    index.html
  java/              ← custom Java reactors
  py/                ← custom Python functions
  classes/           ← compiled reactor output
  mcp/               ← MCP tool definitions
    pixel_mcp.json
    py_mcp.json</code></pre>
                    </div>`
                }
            )}
            ${C.callout(`The training site you've been using all morning is itself an ${CONFIG.productName} app — built, published, and shared using exactly this structure.`, 'tip')}
        `
    },
    {
        id: "appfund-publishing-workflow",
        title: "Publishing Workflow",
        content: `
            <h2>Publishing Workflow</h2>
            ${C.flow([
                { title: "Build", desc: "Create your app — add blocks, wire Pixel logic, configure settings", accent: true },
                { title: "Save", desc: "Persists your changes to the project folder — only visible to you", arrow: "↓" },
                { title: "Publish", desc: "Deploys the current version and makes the URL live for anyone with access", arrow: "↓" },
                { title: "Share", desc: "Send the live URL — anyone you've granted access can open it immediately", accent: true, arrow: "↓" },
            ])}
            ${C.callout('To control who can access your app, go to App Settings → Access Control and assign Owner, Edit, or Viewer roles.', 'info')}
            ${C.table(
                ['Action', 'Who sees the change', 'When to use it'],
                [
                    ['<strong>Save</strong>', 'Only you (draft)', 'Frequently — save as you work'],
                    ['<strong>Publish</strong>', 'Anyone with app access', 'When a change is ready for others'],
                    ['<strong>Version History</strong>', 'Owner role', 'Review or roll back to any prior publish'],
                ]
            )}
        `
    },
    {
        id: "appfund-app-settings",
        title: "App Settings",
        content: `
            <h2>App Settings</h2>
            <p>From the App Catalog, open any app you own. The tabs give you full control over the app's configuration.</p>
            ${C.table(
                ['Tab', 'What it does'],
                [
                    ['<strong>Overview</strong>', 'App name, ID, description, tags, published by, last updated'],
                    ['<strong>Dependencies</strong>', 'Engines this app depends on — databases, models, vector stores'],
                    ['<strong>MCP Usage</strong>', 'MCP tools exposed by this app + connection snippets for VS Code, Claude Desktop, and API clients'],
                    ['<strong>Commits</strong>', 'Full commit history — every save is a version you can revert to'],
                    ['<strong>Settings</strong>', 'Enable publishing, publish the portal to generate a live URL, compile/deploy custom reactors, upload a project zip'],
                    ['<strong>Access Control</strong>', 'Set Private / Non Discoverable, add members with Owner / Edit / Viewer permissions'],
                    ['<strong>SMSS</strong>', 'Raw config file for the project — UUID, alias, type, database connection. Edit only if you know what you\'re doing'],
                ]
            )}
        `
    }
];

const slides_app_export = [
    {
        id: "app-export",
        title: "Exporting Your App",
        content: `
            <h2>Exporting Your App</h2>
            <p>Export packages your entire app into a zip you can share or import into any other ${CONFIG.productName} instance.</p>
            ${C.flow([
                { title: "Click your app", desc: "Open the app from the App Catalog", accent: true },
                { title: "Click the settings gear", desc: "Top-right corner of the app — opens the app settings panel", arrow: "↓" },
                { title: "Click Export", desc: "Downloads a .zip with all your blocks, Pixel logic, and assets", accent: true, arrow: "↓" },
            ])}
            ${C.callout('The <strong>Export</strong> button only appears if you have Owner-level access on the app.', 'info')}
        `
    }
];
