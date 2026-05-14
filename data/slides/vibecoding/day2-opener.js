// Topic: Day 2 Opener  —  Finish Up & Deploy
const slides_day2_opener = [

    {
        id: "d2-title",
        title: "Day 2",
        content: C.titleSlide(
            `Day 2  —  Ship It, Then Wire It`,
            `Finish your app · ${CONFIG.aiName} · MCP · Agents · External APIs`,
            "Thursday, May 14"
        )
    },

    {
        id: "d2-cc-setup-check",
        title: "Claude Code: Quick Setup Check",
        content: `
            <h2>Claude Code Quick Setup Check</h2>
            <p class="lead">If you finished setup yesterday, you're good to go. If anything is still broken, fix it now before hands-on time starts.</p>
            ${C.table(
                ["If you see this…", "Fix"],
                [
                    ["<code>401 Unauthorized</code>", "Check <code>ANTHROPIC_AUTH_TOKEN</code> is <code>access-key:secret-key</code> — colon-separated, no spaces"],
                    ["<code>ECONNREFUSED</code> / connection refused", "Check <code>ANTHROPIC_BASE_URL</code> is exactly <code>${CONFIG.anthropicEndpoint}</code> — no trailing slash"],
                    ["Claude replies but uses the wrong model", "Check the <code>model</code> field in <code>settings.json</code> matches your engine ID"],
                    ["TLS / SSL certificate errors", "<code>NODE_TLS_REJECT_UNAUTHORIZED: '0'</code> must be inside the <code>env</code> block in <code>.claude/settings.json</code>"],
                ]
            )}
            ${C.callout('Quit and re-launch <code>claude</code> after any change to <code>.claude/settings.json</code> — settings only load at startup.', 'warning')}
            ${C.callout('Quick smoke test: run <code>claude</code> → type <code>say hello</code> → any reply means the connection works.', 'tip')}
        `
    },

    {
        id: "d2-finish-app",
        title: "Finish & Publish Your App",
        content: `
            <h2>Finish and Publish Your App</h2>
            ${C.handson("Finish Your App (15–20 min)", `
                <p>Open Claude Code in your project folder and pick up where you left off.</p>
                <h4>Resume your session:</h4>
                ${C.code(`/resume`, 'text', 'In Claude Code — reloads your last conversation')}
                <p>This reloads your prior conversation so you don't need to re-explain what you built.</p>

                <h4>Minimum to hit before we move on:</h4>
                <ul>
                    <li>App opens without JS errors</li>
                    <li>Vector search returns results for at least one query</li>
                    <li>Results display in a readable layout</li>
                </ul>

                <h4>Publish to ${CONFIG.productName}:</h4>
                <ol>
                    <li>In ${CONFIG.productName}: open your App in the Catalog</li>
                    <li>Click <strong>Publish</strong> → <strong>Refresh Files</strong></li>
                    <li>Copy the live URL and share it in the group chat</li>
                </ol>
                ${C.callout('Stuck? Ask Claude Code to explain what it built, then describe the problem. Let it iterate.', 'tip')}
            `)}
        `
    },

    {
        id: "d2-deploy-hardcoded",
        title: "Still Building? Use Yesterday's Prompt",
        content: `
            <h2>Still Building? Pick Up With the Same Prompt</h2>
            <p>If your app isn't fully working yet, use the prompt below to get back on track — it's the same one from yesterday's demo. Swap in your own vector engine ID and iterate from there.</p>
            ${C.code(`Build an app to visualize vector database search results from ELSA.

The user enters a search term, hits Run, and sees the results displayed as clean cards.
Each card should show:
- Source document name
- Page range (from the "Divider" field)
- Relevance score
- The full content passage

Make the vector engine ID and result limit configurable at the top of the file so it's easy to swap in a different engine.

The app calls this Pixel to get results:

VectorDatabaseQuery(engine=["<YOUR-VECTOR-ENGINE-ID>"], command="<search term>", limit=5, filters=[], metaFilters=[]);

Here is one example result to build against:

{
  "Score": 1.7820971012115479,
  "idx": 6,
  "Source": "ai_use.pdf",
  "Modality": "text",
  "Divider": "7, 8",
  "Part": "0",
  "Tokens": 512,
  "Content": "Agencies must remove barriers to innovation and provide the best value for the taxpayer."
}

The results come back inside pixelReturn[0].output as an array. Parse that array and render one card per result. Show a loading state while the query runs and an empty state if no results come back.`, 'text', 'Yesterday\'s Prompt — reuse as-is')}
            ${C.callout('Goal for this session: get your app published with a live URL. It doesn\'t have to be perfect — working and deployed beats polished and local.', 'tip')}
        `
    },

];
