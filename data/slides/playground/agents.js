// Topic: Agents in ${CONFIG.aiName}  —  Day 2 Section 5
const slides_agents = [

    {
        id: "agents-title",
        title: `Agents in ${CONFIG.aiName}`,
        content: C.titleSlide(
            `Agents in ${CONFIG.aiName}`,
            "Configure once. Chat with everything.",
            "30 minutes"
        )
    },

    {
        id: "agents-what-is",
        title: "What is an Agent?",
        content: `
            <h2>What is an Agent?</h2>
            <p class="lead">An agent is a reusable configuration: a set of <strong>instructions</strong> that tell the model how to behave, and a set of <strong>MCPs</strong> that give it access to the tools and data it needs to act.</p>
            <div style="margin: 1.5rem 0; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 1.5rem;">
                <div style="display: flex; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">

                    <!-- Agent box -->
                    <div style="flex: 0 0 auto; background: var(--accent); color: #fff; border-radius: 8px; padding: .6rem 1.2rem; font-weight: 700; font-size: .95rem; align-self: center;">
                        Agent
                    </div>

                    <div style="font-size: 1.4rem; color: var(--accent); align-self: center;">→</div>

                    <!-- MCPs -->
                    <div style="flex: 1; display: flex; flex-direction: column; gap: .75rem;">
                        ${[
                            { mcp: 'MCP Server A', tools: ['search_documents', 'get_metadata'] },
                            { mcp: 'MCP Server B', tools: ['summarize_report'] },
                            { mcp: 'MCP Server C', tools: ['query_database', 'export_csv', 'get_schema'] },
                        ].map(({ mcp, tools }) => `
                            <div style="display: flex; align-items: center; gap: .75rem;">
                                <div style="background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: .4rem .85rem; font-size: .82rem; font-weight: 600; white-space: nowrap;">
                                    ${mcp}
                                </div>
                                <div style="font-size: 1rem; color: #aaa;">→</div>
                                <div style="display: flex; gap: .4rem; flex-wrap: wrap;">
                                    ${tools.map(t => `<code style="background: #f0f0f0; border-radius: 4px; padding: .2rem .45rem; font-size: .76rem;">${t}</code>`).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                </div>
            </div>
            ${C.callout('The agent does not run on its own. It is a configuration. When someone opens a New Chat inside the agent, that chat inherits every MCP and every tool automatically.', 'info')}
        `
    },

    {
        id: "agents-configure",
        title: "Configuring an Agent",
        content: `
            <h2>Configuring an Agent</h2>
            <p>Once you create an agent you configure it through four tabs.</p>
            ${C.table(
                ['Tab', 'What you do here'],
                [
                    ['<strong>My Chats</strong>', 'See all conversations started inside this agent. Each chat is a room pre-loaded with the agent\'s full setup.'],
                    ['<strong>Knowledge</strong>', 'Attach vector engines and documents. The model can search these in every chat in this agent.'],
                    ['<strong>Toolbox</strong>', 'Add MCP servers. Each server you add exposes its tools to the model in every chat.'],
                    ['<strong>Members</strong>', 'Control who can open this agent and start chats. Add teammates to share the whole setup with them.'],
                ]
            )}
            ${C.callout('Configure the agent once  —  every New Chat inside it starts with the same model, tools, and knowledge already wired up.', 'tip')}
        `
    },

    {
        id: "agents-handson",
        title: "Hands-on: Build Your Agent",
        content: `
            <h2>Hands-on  —  Build an Agent Around Your MCP</h2>
            ${C.handson("Create and Configure Your Agent", `
                <h4>Step 1  —  Create the agent</h4>
                <ol>
                    <li>Open ${CONFIG.aiName} and click <strong>New Agent</strong></li>
                    <li>Give it a name and short description</li>
                </ol>

                <h4>Step 2  —  Add your MCP to the Toolbox</h4>
                <ol>
                    <li>Go to the <strong>Toolbox</strong> tab</li>
                    <li>Find your project from the MCP section and add it</li>
                    <li>Confirm your tool(s) appear in the list</li>
                </ol>

                <h4>Step 3  —  Add your vector engine to Knowledge</h4>
                <ol>
                    <li>Go to the <strong>Knowledge</strong> tab</li>
                    <li>Add the vector engine you built on Day 1</li>
                </ol>

                <h4>Step 4  —  Start a chat and test it</h4>
                <ol>
                    <li>Click <strong>+ New Chat</strong></li>
                    <li>Ask a question that should trigger your tool</li>
                    <li>Confirm the agent calls it and uses the result</li>
                </ol>
                ${C.callout('Share your agent with a neighbor using the Members tab  —  they can open a New Chat and immediately use everything you configured after you\'ve shared the resources.', 'tip')}
            `)}
        `
    },

];
