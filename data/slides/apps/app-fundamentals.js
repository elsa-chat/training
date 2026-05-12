// Topic: App Fundamentals
const slides_app_fundamentals = [
    {
        id: "appfund-title",
        title: "App Fundamentals",
        content: C.titleSlide(
            "App Fundamentals",
            `From engines and Pixel to a published, shareable app`,
            "30 minutes"
        )
    },
    {
        id: "appfund-live-demo-setup",
        title: "This Training Site Is an ELSA App",
        content: `
            <h2>This Training Site Is an ${CONFIG.productName} App</h2>
            ${C.callout(`The site you've been using all morning was built and deployed using \${CONFIG.productName}. In the next section you'll build your own.`, 'tip')}
            <p>When the presenter opens this project in ${CONFIG.productName}, notice:</p>
            <ul>
                <li><strong>The project folder</strong> — every app lives in a <code>project/&lt;Name&gt;__&lt;UUID&gt;/</code> directory</li>
                <li><strong>The portal files</strong> — <code>assets/portals/</code> holds the HTML, CSS, and JS served to you right now</li>
                <li><strong>The published URL</strong> — one click made this page live and shareable</li>
                <li><strong>The version history</strong> — every publish is a saved version; you can roll back to any of them</li>
            </ul>
        `
    },
    {
        id: "appfund-what-is-app",
        title: "What Is an App?",
        content: `
            <h2>What Is an App in ${CONFIG.productName}?</h2>
            ${C.split(
                {
                    title: `An App in ${CONFIG.productName} is...`,
                    content: `
                        <p>A <strong>published experience</strong> — engines, logic, and UI packaged together and shared with users as a live URL.</p>
                        <ul>
                            <li>Backed by the data and models you've already built</li>
                            <li>Versioned so you can iterate safely</li>
                            <li>Accessible to anyone you grant access — no install required</li>
                        </ul>
                    `
                },
                {
                    title: "How the pieces connect",
                    content: C.flow([
                        { title: "Engines (data)", desc: "Vector DB, LLM model, relational database", accent: true },
                        { title: "Pixel / Python (logic)", desc: "Commands that query engines, transform data, call models", arrow: "↓" },
                        { title: "Portal / Blocks (UI)", desc: "The web interface users interact with", arrow: "↓" },
                        { title: "Published URL", desc: "Live, shareable link — one click away", accent: true, arrow: "↓" },
                    ])
                }
            )}
            ${C.callout('Apps can be no-code block builders, Vibe-coded, or fully custom React portals. All three produce the same publishable output.', 'info')}
        `
    },
    {
        id: "appfund-three-layers",
        title: "Three Layers of Every App",
        content: `
            <h2>Three Layers of Every App</h2>
            ${C.layers([
                {
                    label: "Frontend",
                    items: [
                        { title: "Portal", desc: "React / blocks UI served to the user" }
                    ]
                },
                {
                    label: "Logic",
                    accent: true,
                    items: [
                        { title: "Pixel commands", desc: "Orchestration and queries", accent: true },
                        { title: "Python GAAS", desc: "Custom functions and ML logic", accent: true }
                    ]
                },
                {
                    label: "Data",
                    items: [
                        { title: "Engines", desc: "Vector DB, LLM model, database" }
                    ]
                }
            ])}
            ${C.callout('Vibe Coding generates all three layers from a plain-English description. You can inspect and edit any layer after generation.', 'tip')}
        `
    },
    {
        id: "appfund-publishing-workflow",
        title: "Publishing Workflow",
        content: `
            <h2>Publishing Workflow</h2>
            ${C.flow([
                { title: "Draft", desc: `Edit your app in the ${CONFIG.productName} editor`, accent: true },
                { title: "Save", desc: "Persists changes to your workspace — only you see them", arrow: "↓" },
                { title: "Publish", desc: "Makes the current version live for anyone with access", arrow: "↓" },
                { title: "Versioned URL", desc: "Every publish creates a version — you can roll back to any of them", accent: true, arrow: "↓" },
            ])}
            ${C.table(
                ['Action', 'Who sees the change', 'When to use it'],
                [
                    ['<strong>Save</strong>', 'Only you', 'Frequently — save as you work'],
                    ['<strong>Publish</strong>', 'Anyone with app access', 'When a change is ready for others'],
                    ['<strong>Version History</strong>', 'Admins / OWNER role', 'To review or roll back to a prior publish'],
                ]
            )}
        `
    }
];
