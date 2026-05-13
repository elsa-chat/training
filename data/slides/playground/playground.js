// Topic: Playground  —  Day 2 Section 2
const slides_playground = [

    // ─── SECTION 2: PLAYGROUND OVERVIEW ──────────────────────────────────────

    {
        id: "playground-title",
        title: "Playground",
        content: C.titleSlide(
            "Playground  —  Your AI Workspace",
            "Rooms · Tools · Agents · Files",
            "30 minutes"
        )
    },

    {
        id: "playground-what-is",
        title: "What is Playground?",
        content: `
            <h2>What is Playground?</h2>
            <p class="lead">${CONFIG.productName}'s built-in workspace for talking to AI models, connecting tools, and building agents  —  all in one place.</p>
            ${C.cards([
                {
                    badge: 'Chat',
                    title: 'Talk to Models',
                    desc: 'Send messages to any model engine in your catalog. Multi-turn conversations with full history saved automatically.'
                },
                {
                    badge: 'Tools',
                    title: 'Connect MCP Apps',
                    desc: 'Wire in your apps as callable tools. The model discovers them automatically and uses them to answer questions.'
                },
                {
                    badge: 'Knowledge',
                    title: 'Attach Data',
                    desc: 'Add files, vector engines, and databases to a workspace. The agent can search and reason over your data.'
                },
                {
                    badge: 'Agents',
                    title: 'Build & Test Agents',
                    desc: 'Configure system prompts, pick models, and compose tools into a full agent  —  then test it live in the same view.'
                },
            ])}
            ${C.callout('Everything you built in Day 1  —  your vector engine, your app  —  can be wired into Playground as agent tools. That\'s what the rest of today is about.', 'info')}
        `
    },

    {
        id: "playground-what-is-room",
        title: "What is a Room?",
        content: `
            <h2>Rooms  —  What They Are and How They're Organized</h2>
            ${C.split(
                {
                    title: 'Room',
                    content: `
                        <p>A <strong>Room</strong> is a single conversation thread.</p>
                        <ul>
                            <li>Every message you send and every AI response lives here</li>
                            <li>Tool calls and their results are recorded inline</li>
                            <li>History is saved automatically  —  you can always return</li>
                            <li>Room name is auto-generated from your first message</li>
                        </ul>
                    `
                },
                {
                    title: 'Room Folder (Workspace)',
                    content: `
                        <p>A <strong>Room Folder</strong> is the configuration wrapper around one or more Rooms.</p>
                        <ul>
                            <li>System prompt  —  the agent's persona and instructions</li>
                            <li>Model selection  —  which LLM powers the conversation</li>
                            <li>MCP tools  —  which apps the agent can call</li>
                            <li>Knowledge  —  files and engines attached to the workspace</li>
                        </ul>
                        <p class="muted">Set up the folder once; every Room inside it inherits the settings.</p>
                    `
                }
            )}
            ${C.callout('Think of it like a project folder on your computer. The folder holds the config; the files inside are the individual conversations.', 'info')}
        `
    },

    {
        id: "playground-room-utilities",
        title: "ELSA Room Utilities [PLACEHOLDER]",
        content: `
            <h2>ELSA Room Utilities <span style="font-size:0.6em;font-weight:400;color:var(--muted);vertical-align:middle;">[PLACEHOLDER]</span></h2>
            <p class="lead">Live demo  —  follow along in your own ${CONFIG.productName} instance.</p>
            ${C.cards([
                {
                    badge: 'Demo',
                    title: 'Room List',
                    desc: 'Left sidebar shows all your rooms, sorted by last activity. Click any room to reopen its full history.'
                },
                {
                    badge: 'Demo',
                    title: 'New Chat',
                    desc: 'Starts a fresh room with no prior context. Use when beginning a completely different task.'
                },
                {
                    badge: 'Demo',
                    title: 'Room Settings',
                    desc: 'Three-dots menu on any room  —  rename, delete, or favorite. Favorites are pinned to the top.'
                },
                {
                    badge: 'Demo',
                    title: 'Search',
                    desc: 'Full-text search across all your rooms and message history from the search bar at the top of the sidebar.'
                },
            ])}
            ${C.callout('Placeholder  —  presenter will demo live. Ask questions about anything you see that isn\'t covered on the next slides.', 'tip')}
        `
    },

    {
        id: "playground-ui-tabs",
        title: "Playground UI Tabs",
        content: `
            <h2>The Playground Tabs  —  What Each One Does</h2>
            <p class="lead">Everything in Playground lives in one of these tabs. We'll cover the Agent tab separately when we get to agents.</p>
            ${C.table(
                ['Tab', 'What It Does', 'When You Use It'],
                [
                    [
                        '<strong>Chat</strong>',
                        'The main conversation view. Send messages, see model responses, watch tool calls unfold.',
                        'All the time  —  this is the default view'
                    ],
                    [
                        '<strong>Settings / Instructions</strong>',
                        'Write the system prompt (agent persona, constraints, tool-use instructions) and pick the model.',
                        'When configuring a new Room Folder or tweaking agent behavior'
                    ],
                    [
                        '<strong>Knowledge</strong>',
                        'Attach files, vector engines, and databases to the workspace. Anything added here is available to the agent.',
                        'When your agent needs access to specific documents or data sources'
                    ],
                    [
                        '<strong>Toolbox</strong>',
                        'Add, remove, and inspect MCP servers. Shows which tools the agent can see and call.',
                        'When wiring up your MCP app or debugging tool availability'
                    ],
                ]
            )}
            ${C.callout('The <strong>Agent</strong> tab is where you configure multi-agent pipelines. We\'ll cover that after we build our MCP tools this afternoon.', 'info')}
        `
    },

    // ─── Files & Rooms (moved from Appendix) ─────────────────────────────────

    {
        id: "appendix-files-overview",
        title: "Adding Files to a Chat",
        content: `
            <h2>Adding Files to a Playground Chat</h2>
            <p class="lead">You can attach files directly to a conversation. The file is sent as context for that message  —  the model can read and reason over it inline.</p>
            ${C.flow([
                { title: 'Open Playground', desc: 'Go to Playground from the left sidebar and open or start a Room.' },
                { title: 'Click the Attachment Icon', desc: 'In the chat input bar, click the paperclip icon next to the message box.', arrow: '↓' },
                { title: 'Select Your File', desc: 'Choose a file from your computer. Supported types include PDF, DOCX, TXT, CSV, and images.', arrow: '↓' },
                { title: 'Send with Your Message', desc: 'Type your question and hit Send. The file contents are included as context in that turn.', arrow: '↓' }
            ])}
            ${C.split(
                {
                    title: 'What the Model Sees',
                    content: `
                        <ul>
                            <li>The file is extracted and passed as text context alongside your message</li>
                            <li>The model can summarize, answer questions about, or extract data from it</li>
                            <li>Once attached, the file remains in context for the rest of the conversation</li>
                        </ul>
                    `
                },
                {
                    title: 'What It Does NOT Do',
                    content: `
                        <ul>
                            <li>Does not index or embed the file into a vector engine</li>
                            <li>Does not make the file searchable via semantic search</li>
                            <li>Does not make the file available to other rooms or users</li>
                        </ul>
                        <p class="muted">For searchable, reusable storage  —  use a Vector Engine instead.</p>
                    `
                }
            )}
        `
    },

    {
        id: "appendix-rooms-history",
        title: "Room History",
        content: `
            <h2>Rooms &amp; Chat Session History</h2>
            <p class="lead">A Room is a persistent conversation thread. History is saved automatically  —  you can return to any past conversation.</p>
            ${C.split(
                {
                    title: 'What Gets Saved',
                    content: `
                        <ul>
                            <li>Every message you send and every AI response</li>
                            <li>Tool calls and their results (MCP, Pixel)</li>
                            <li>Room name (auto-generated from first message)</li>
                        </ul>
                    `
                },
                {
                    title: 'What Does NOT Persist',
                    content: `
                        <ul>
                            <li>Browser-only UI state (open panels, scroll position)</li>
                            <li>Unsubmitted draft messages</li>
                        </ul>
                    `
                }
            )}
            ${C.callout('Room history is stored server-side and tied to your user account. Clearing your browser cache or switching devices does <strong>not</strong> lose history.', 'tip')}
        `
    },

    {
        id: "appendix-rooms-management",
        title: "Managing Rooms",
        content: `
            <h2>Managing Rooms</h2>
            ${C.table(
                ['Action', 'How', 'Notes'],
                [
                    ['View past rooms', 'Left sidebar → Rooms list', 'Sorted by last activity'],
                    ['Rename a room', 'Three-dots menu on the room → Rename', 'Helps organize long-running projects'],
                    ['Delete a room', 'Three-dots menu on the room → Delete', 'Permanent  —  deletes all message history'],
                    ['Favorite a room', 'Three-dots menu on the room → Favorite', 'Pins the room for quick access'],
                    ['Search history', 'Search bar at top of Rooms list', 'Full-text search across all your rooms']
                ]
            )}
            ${C.split(
                {
                    title: '+ New Chat (fresh Room)',
                    content: `
                        <ul>
                            <li>Blank context  —  LLM starts with no conversation history</li>
                            <li>Use when starting a completely different task</li>
                            <li>Good for performance: shorter context = faster responses</li>
                        </ul>
                    `
                },
                {
                    title: 'Continue Existing Room',
                    content: `
                        <ul>
                            <li>Full history sent as context to the LLM</li>
                            <li>Use when continuing a multi-turn workflow</li>
                            <li>Watch for context window limits on very long rooms</li>
                        </ul>
                    `
                }
            )}
        `
    },

    // ─── Agent config  —  parked here, referenced in Section 5 (Agents) ──────

    {
        id: "playground-architecture",
        title: "Playground Architecture",
        content: `
            <h2>Playground Architecture  —  Three Layers</h2>
            ${C.layers([
                { label: "Room", items: [
                    { title: "Conversation Thread", desc: "Message history, tool call history" },
                    { title: "Model Responses", desc: "What the agent says and does" },
                ]},
                { label: "Room Folder / Workspace", items: [
                    { title: "System Prompt", desc: "Agent persona and constraints" },
                    { title: "Model Selection", desc: "Which LLM powers this room" },
                    { title: "MCP Tools Available", desc: "Which apps the agent can call" },
                ]},
                { label: "MCP Apps + Engines", items: [
                    { title: "Your App's Tools", desc: "Functions exposed via MCP" },
                    { title: "Vector Engines", desc: "Semantic search backends" },
                    { title: "Function Engines", desc: "Other callable backends" },
                ]},
            ])}
            ${C.callout('A <strong>Room</strong> is a conversation. A <strong>Room Folder</strong> is the configuration that controls how that conversation behaves.', 'info')}
        `
    },

    {
        id: "playground-agent-config",
        title: "What You Configure in an Agent",
        content: `
            <h2>What You Configure in an Agent</h2>
            ${C.table(
                ["Setting", "What It Does"],
                [
                    ["System Prompt", "Gives the agent its persona, constraints, and instructions for using tools"],
                    ["Model", "Which LLM processes the conversation (Claude, GPT-4, etc.)"],
                    ["MCP Tools", "Which apps are exposed as callable tools"],
                    ["Knowledge / Engine Access", "Which vector engines, databases, and functions the agent can reach"],
                ]
            )}
            ${C.callout(`The system prompt is where you give the agent its persona and constraints. <em>"You are an FDA regulatory assistant. Use the search_documents tool to answer questions based only on official FDA guidance."</em>`, 'tip')}
            <div id="pg-agent-carousel" data-idx="0" style="margin-top:16px; border:1px solid var(--border); border-radius:8px; overflow:hidden; background:var(--surface);">
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-bottom:1px solid var(--border); background:var(--surface-2);">
                    <span class="pg-car-label" style="font-weight:600; font-size:0.95rem;">1  —  Agent Instructions</span>
                    <span class="pg-car-counter" style="font-size:0.85rem; color:var(--muted);">1 / 3</span>
                </div>
                <img data-slide="0" src="images/playground/agent/Agent Instruction Page.png" alt="Agent Instructions" style="display:block; width:100%; height:auto;">
                <img data-slide="1" src="images/playground/agent/Agent Knowledge Page.png"   alt="Agent Knowledge"     style="display:none;  width:100%; height:auto;">
                <img data-slide="2" src="images/playground/agent/Agent Toolbox Page.png"     alt="Agent Toolbox"       style="display:none;  width:100%; height:auto;">
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-top:1px solid var(--border); background:var(--surface-2);">
                    <button onclick="var c=document.getElementById('pg-agent-carousel'),imgs=c.querySelectorAll('img[data-slide]'),labels=['1  —  Agent Instructions','2  —  Knowledge','3  —  Toolbox'],idx=+c.dataset.idx;imgs[idx].style.display='none';idx=(idx-1+imgs.length)%imgs.length;imgs[idx].style.display='block';c.dataset.idx=idx;c.querySelector('.pg-car-label').textContent=labels[idx];c.querySelector('.pg-car-counter').textContent=(idx+1)+' / '+imgs.length;" style="padding:6px 18px; border-radius:5px; border:1px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; font-size:0.9rem;">← Prev</button>
                    <button onclick="var c=document.getElementById('pg-agent-carousel'),imgs=c.querySelectorAll('img[data-slide]'),labels=['1  —  Agent Instructions','2  —  Knowledge','3  —  Toolbox'],idx=+c.dataset.idx;imgs[idx].style.display='none';idx=(idx+1)%imgs.length;imgs[idx].style.display='block';c.dataset.idx=idx;c.querySelector('.pg-car-label').textContent=labels[idx];c.querySelector('.pg-car-counter').textContent=(idx+1)+' / '+imgs.length;" style="padding:6px 18px; border-radius:5px; border:1px solid var(--border); background:var(--surface); color:var(--text); cursor:pointer; font-size:0.9rem;">Next →</button>
                </div>
            </div>
        `
    },

];
