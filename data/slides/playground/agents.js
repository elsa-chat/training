// Topic: Agents in Playground  —  Day 2 Section 5
const slides_agents = [

    // ─── SECTION 5: AGENTS IN PLAYGROUND ─────────────────────────────────────

    {
        id: "agents-title",
        title: "Agents in Playground",
        content: C.titleSlide(
            "Agents in Playground",
            "Composing tools into a working AI agent",
            "30 minutes"
        )
    },

    {
        id: "agents-what-is",
        title: "What is an Agent?",
        content: `
            <h2>What is an Agent?</h2>
            <p class="lead">An agent is a model with tools. The model decides which tool to call, when to call it, and how to use the result  —  you just set up the workspace.</p>
            ${C.split(
                {
                    title: 'A chatbot',
                    content: `
                        <ul>
                            <li>A model + a system prompt</li>
                            <li>Answers based on training data and what you tell it</li>
                            <li>Has no way to reach outside the conversation</li>
                        </ul>
                        <p class="muted">Good for Q&amp;A, summarization, drafting.</p>
                    `
                },
                {
                    title: 'An agent',
                    content: `
                        <ul>
                            <li>A model + a system prompt + <strong>MCP tools</strong></li>
                            <li>Can search your documents, query databases, call APIs</li>
                            <li>Decides autonomously which tool to use for each step</li>
                        </ul>
                        <p class="muted">Good for anything that needs real data or real actions.</p>
                    `
                }
            )}
            ${C.cards([
                {
                    badge: 'Model',
                    title: 'The Brain',
                    desc: 'Reads the conversation and decides what to do next  —  answer directly or call a tool.'
                },
                {
                    badge: 'System Prompt',
                    title: 'The Instructions',
                    desc: 'Tells the model who it is, what it\'s allowed to do, and when to use each tool.'
                },
                {
                    badge: 'MCP Tools',
                    title: 'The Hands',
                    desc: 'The callable actions the model can reach for: search, query, fetch, write.'
                },
                {
                    badge: 'Room Folder',
                    title: 'The Workspace',
                    desc: 'Holds all of the above. Every Room (conversation) inside it inherits the same setup.'
                },
            ])}
        `
    },

    {
        id: "agents-compose",
        title: "Composing Your Agent",
        content: `
            <h2>Composing Your Agent  —  Putting the Pieces Together</h2>
            <p>You've already built an MCP tool. Now you connect it to a model and a system prompt to make an agent.</p>
            ${C.flow([
                { title: 'Create or open a Room Folder', desc: 'This is the agent\'s persistent workspace', arrow: '↓' },
                { title: 'Pick a model', desc: 'The LLM that will reason over your tools', arrow: '↓' },
                { title: 'Write a system prompt', desc: 'Tell the agent who it is and when to use each tool', arrow: '↓' },
                { title: 'Add MCP tools (Toolbox tab)', desc: 'Your project from Section 4  —  and anyone else\'s', arrow: '↓' },
                { title: 'Open a Room and start chatting', desc: 'The agent will call tools automatically as needed' },
            ])}
            ${C.callout('The more specific your system prompt, the more reliably the agent uses tools. Vague prompts produce vague agents.', 'tip')}
        `
    },

    {
        id: "agents-handson",
        title: "Hands-on: Build Your Agent",
        content: `
            <h2>Hands-on  —  Wire Your MCP into an Agent</h2>
            ${C.handson("Build Your Agent", `
                <h4>Step 1  —  Set up the Room Folder</h4>
                <ol>
                    <li>Open Playground → <strong>New Room Folder</strong> (or reuse the one from Section 4)</li>
                    <li>In the <strong>Instructions</strong> tab, set a system prompt:
                        ${C.code(`You are an FDA regulatory assistant.
You have access to a search tool that queries official FDA guidance documents.
Always use the search_documents tool before answering any question about FDA regulations, guidance, or policy.
Cite the source document and page range in every answer.`, 'properties', 'System Prompt')}
                    </li>
                    <li>Pick your model engine</li>
                </ol>

                <h4>Step 2  —  Add your MCP tool</h4>
                <ol>
                    <li>Go to the <strong>Toolbox</strong> tab → <strong>Add MCP Server</strong></li>
                    <li>Select your project from Section 4</li>
                    <li>Confirm <code>search_documents</code> appears in the tool list</li>
                </ol>

                <h4>Step 3  —  Add a neighbor's MCP tool</h4>
                <ol>
                    <li>Get a project ID from someone next to you</li>
                    <li>Add their project as a second MCP server</li>
                    <li>You now have an agent with two search tools  —  over two different document sets</li>
                </ol>

                <h4>Step 4  —  Test it</h4>
                <p>Open a new Room and ask a question that requires searching. Confirm the agent calls the right tool.</p>
                ${C.callout('Try asking a question that spans both document sets  —  watch the agent decide which tool (or both) to call.', 'tip')}
            `)}
        `
    },

    {
        id: "agents-share",
        title: "Sharing Agents",
        content: `
            <h2>Sharing Agents</h2>
            <p class="lead">There are two things you can share: your <strong>MCP tools</strong> (the actions) and your <strong>Room Folder config</strong> (the agent setup).</p>
            ${C.table(
                ['What', 'How', 'What the other person gets'],
                [
                    [
                        'Your MCP tool',
                        'Share your project ID  —  they add it in their Toolbox tab',
                        'Access to your <code>search_documents</code> function in their own agent'
                    ],
                    [
                        'Your Room Folder',
                        'Export the config or share the folder directly (if permissions allow)',
                        'A copy of your system prompt + model + tool list  —  ready to use'
                    ],
                    [
                        'Your full agent (public)',
                        'Publish the app → anyone with access can use the live URL',
                        'A deployed agent they can chat with  —  no Playground setup needed'
                    ],
                ]
            )}
            ${C.callout('The most common pattern right now: share your project ID so teammates can add your MCP tools to their own agents without duplicating the backend.', 'info')}
        `
    },

];
