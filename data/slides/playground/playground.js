// Topic: ${CONFIG.aiName}  —  Day 2 Section 2
const slides_playground = [

    // ─── SECTION 2: PLAYGROUND OVERVIEW ──────────────────────────────────────

    {
        id: "playground-title",
        title: `${CONFIG.aiName}`,
        content: C.titleSlide(
            `${CONFIG.aiName}  —  Your AI Workspace`,
            "Rooms · Tools · Agents · Files",
            "30 minutes"
        )
    },

    {
        id: "elsa-chat-overview",
        title: `${CONFIG.aiName}  —  The Interface`,
        content: `
            <h2>${CONFIG.aiName}  —  The Interface</h2>
            ${C.split(
                {
                    title: 'Getting Started',
                    content: `
                        <ul>
                            <li>When you open ${CONFIG.aiName} you land on a <strong>chat interface</strong></li>
                            <li>The first message you send <strong>creates a Room</strong>  —  a persistent workspace for that conversation</li>
                            <li>Every subsequent message is added to that room, building up a shared context the agent reasons over</li>
                            <li>The <strong>room navigator on the left</strong> lists all your rooms  —  click any to switch back to it</li>
                        </ul>
                    `
                },
                {
                    title: 'Configuring a Room',
                    content: `
                        <ul>
                            <li><strong>System prompt</strong>  —  set a standing instruction for the agent in this room</li>
                            <li><strong>Model</strong>  —  choose which LLM the agent uses</li>
                            <li><strong>Vectors & tools</strong>  —  attach engines or MCP toolboxes the agent can call</li>
                            <li><strong>Agents</strong>  —  wire in a pre-built agent (we'll cover this later today)</li>
                            <li><strong>Documents</strong>  —  upload files for the agent to read in this room</li>
                        </ul>
                    `
                }
            )}
            ${C.callout(`<strong>Prompt Optimizer</strong>  —  paste a rough system prompt and ${CONFIG.aiName} will rewrite it into a cleaner, more effective instruction for the model.`, 'tip')}
        `
    },

    {
        id: "playground-what-is",
        title: `What is ${CONFIG.aiName}?`,
        content: `
            <h2>What is ${CONFIG.aiName}?</h2>
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
            ${C.callout(`Everything you built in Day 1  —  your vector engine, your app  —  can be wired into ${CONFIG.aiName} as agent tools. That\`s what the rest of today is about.', 'info')}
        `
    },

    {
        id: "playground-what-is-room",
        title: "What is a Room?",
        content: `
            <h2>A Room Has Two Pieces</h2>
            <p class="lead">When you open a Room, two things spin up: a conversation record in the database, and a working directory on disk.</p>
            ${C.split(
                {
                    title: 'Message History (in the DB)',
                    content: `
                        <p>Every message in the conversation is persisted in <code>ModelInferenceLogsDatabase</code>.</p>
                        <ul>
                            <li>User prompts, assistant responses, tool calls, tool results  —  all in order</li>
                            <li>Token counts, response time, and model used  —  per message</li>
                            <li>Stored in a structured <strong>parts schema</strong> so the same conversation can be replayed to any model provider</li>
                            <li>Survives logout, browser switch, device switch  —  it is server-side</li>
                        </ul>
                        <p class="muted">Tables: <code>ROOM</code> (room metadata + full message JSON) and <code>MESSAGE</code> (per-message ledger with token counts).</p>
                    `
                },
                {
                    title: 'Room Folder (on disk)',
                    content: `
                        <p>Every room gets its own working directory at <code>&lt;baseFolder&gt;/room/&lt;roomId&gt;/</code>.</p>
                        <ul>
                            <li>MCP tool scratch space  —  files written by tools the agent calls</li>
                            <li>User uploads attached to the conversation</li>
                            <li>Session state for Copilot CLI runs (<code>events.jsonl</code>, <code>session.db</code>)</li>
                            <li>Synced to cluster storage via rclone  —  pulled on open, pushed when the agent finishes</li>
                        </ul>
                        <p class="muted">Walk away, come back tomorrow  —  the folder is rehydrated from cloud storage automatically.</p>
                    `
                }
            )}
            ${C.callout('The DB row is the conversation; the folder is the workspace. Together they make a Room portable across sessions and across nodes in a cluster.', 'info')}
        `
    },

    {
        id: "room-message-json",
        title: "Room Message JSON  —  Parts Schema",
        content: `
            <h2>How One Conversation Talks to Every Model</h2>
            <p class="lead">${CONFIG.productName} stores every message in a model-agnostic <strong>parts</strong> schema. When you swap from Claude to GPT to Bedrock, the platform translates the same parts into each provider's wire format  —  you do not rewrite anything.</p>
            ${C.code(`{
  "schemaVersion": 2,
  "io": "input",            // input | response
  "messageId": "abc123",
  "modelId": "claude-3-7-sonnet",
  "parts": [
    { "type": "TEXT",        "text": "Find FDA guidance on AI use" },
    { "type": "TOOL_CALL",   "toolCall":   { "name": "search_documents", "args": { "question": "AI use" } } },
    { "type": "TOOL_RESULT", "toolResult": { "callId": "tc_1", "content": "..." } },
    { "type": "THINKING",    "text": "The user is asking about..." }
  ],
  "tokens": 312,
  "cacheReadTokens": 0,
  "cacheCreationTokens": 0
}`, 'json', 'One message in the parts schema')}
            ${C.cards([
                { badge: 'Part', title: 'TEXT', desc: 'Plain text from user or assistant.' },
                { badge: 'Part', title: 'TOOL_CALL', desc: 'Agent invokes a tool. Includes name and arguments.' },
                { badge: 'Part', title: 'TOOL_RESULT', desc: 'Tool returns. Linked to its call by id.' },
                { badge: 'Part', title: 'THINKING', desc: 'Reasoning trace (Claude extended thinking, o1 reasoning, etc.).' },
                { badge: 'Part', title: 'MEDIA', desc: 'Images, audio, attached files.' },
                { badge: 'Part', title: 'SYSTEM', desc: 'System instructions threaded into the conversation.' },
            ])}
            ${C.callout('Because parts are typed and ordered, the platform can reshape one history into the Anthropic, OpenAI, or Bedrock wire format on the fly. The Room does not care which model you swap to.', 'tip')}
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
        title: `${CONFIG.aiName} UI Tabs`,
        content: `
            <h2>The ${CONFIG.aiName} Tabs  —  What Each One Does</h2>
            <p class="lead">Everything in ${CONFIG.aiName} lives in one of these tabs. We'll cover the Agent tab separately when we get to agents.</p>
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
            <h2>Adding Files to a ${CONFIG.aiName} Chat</h2>
            <p class="lead">You can attach files directly to a conversation. The file is sent as context for that message  —  the model can read and reason over it inline.</p>
            ${C.flow([
                { title: `Open ${CONFIG.aiName}`, desc: `Go to ${CONFIG.aiName} from the left sidebar and open or start a Room.` },
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


    // ─── Agent config  —  parked here, referenced in Section 5 (Agents) ──────

    {
        id: "playground-architecture",
        title: `${CONFIG.aiName} Architecture`,
        content: `
            <h2>${CONFIG.aiName} Architecture  —  Three Layers</h2>
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
