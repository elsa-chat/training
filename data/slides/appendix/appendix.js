// Topic: Appendix  -  Reference & Troubleshooting
const slides_appendix = [
    {
        id: "appendix-title",
        title: "Appendix",
        content: C.titleSlide(
            "Appendix",
            "Reference Topics & Troubleshooting",
            "Parking Lot Questions · Dev Tips"
        )
    },

    // ─── Files ──────────────────────────────────────────────────────────────

    {
        id: "appendix-files-overview",
        title: "Where Do Files Go?",
        content: `
            <h2>Where Do Files Go?</h2>
            <p class="lead">Every file you upload lands in a <span class="highlight">Storage Engine</span>. The engine config (<code>.smss</code>) tells the platform <em>which</em> backend holds those bytes.</p>
            ${C.layers([
                {
                    label: 'You Upload a File',
                    items: [
                        { title: 'UI drag-and-drop' },
                        { title: 'API call' },
                        { title: 'Pixel command' }
                    ]
                },
                {
                    label: 'Storage Engine (smss config)',
                    items: [
                        { title: 'Local filesystem' },
                        { title: 'S3 / Azure Blob / GCS' },
                        { title: 'MinIO / SFTP' }
                    ]
                },
                {
                    label: 'Platform Metadata',
                    items: [
                        { title: 'File record in DB' },
                        { title: 'Engine association' },
                        { title: 'Access control' }
                    ]
                }
            ])}
            ${C.split(
                {
                    title: 'Vector / RAG Engine',
                    content: `
                        <p>Uploaded documents are automatically:</p>
                        <ol>
                            <li>Chunked into passages</li>
                            <li>Embedded via your configured model</li>
                            <li>Indexed (FAISS, Weaviate, PGVector…)</li>
                        </ol>
                        <p class="muted">Raw file lives in storage; index lives in the vector store.</p>
                    `
                },
                {
                    title: 'Database Engine (CSV)',
                    content: `
                        <p>CSV uploads are automatically:</p>
                        <ol>
                            <li>Parsed and schema-inferred</li>
                            <li>Loaded into an H2 (or configured) database</li>
                            <li>OWL ontology generated</li>
                        </ol>
                        <p class="muted">The <code>.smss</code> file points to the resulting DB file.</p>
                    `
                }
            )}
            ${C.callout('The storage location is set <strong>when you create the engine</strong>. To change it later, update the engine\'s <code>.smss</code> config and migrate the files.', 'tip')}
        `
    },

    {
        id: "appendix-files-how-to-add",
        title: "How Do I Add Files?",
        content: `
            <h2>How Do I Add Files?</h2>
            <p class="lead">Three ways  -  pick the one that fits your workflow.</p>
            ${C.flow([
                {
                    title: '1 · Platform UI',
                    desc: 'Navigate to <strong>Engines</strong> in the left sidebar → select your engine → click <strong>Add Files</strong> or drag-and-drop. Works for any engine type.'
                },
                {
                    title: `2 · Pixel Command (in ${CONFIG.aiName})`,
                    desc: 'Use <code>UploadFile</code> reactor to upload programmatically from a Pixel script.'
                },
                {
                    title: '3 · REST API',
                    desc: 'POST to <code>/api/engine/{engineId}/uploadFile</code> with a multipart form body. Useful for batch ingestion pipelines.'
                }
            ])}
            ${C.code(`// Pixel  -  upload a local file to a storage or vector engine
UploadFile(engine=["my-vector-engine"], filePath=["/path/to/doc.pdf"]);

// After upload to a vector engine, trigger re-indexing:
VectorDatabaseIndexDocuments(engine=["my-vector-engine"]);`, 'pixel', 'Pixel  -  Upload & Index')}
            ${C.table(
                ['Method', 'Best For', 'Requires'],
                [
                    ['UI drag-and-drop', 'One-off uploads during setup', 'Browser access'],
                    ['Pixel command', 'Scripted workflows inside the platform', 'Engine access permission'],
                    ['REST API', 'External pipelines, CI/CD ingestion', 'API token + engine permission']
                ]
            )}
        `
    },

    // ─── Rooms & Session History ─────────────────────────────────────────────

    {
        id: "appendix-rooms-history",
        title: "Rooms & Chat Session History",
        content: `
            <h2>Rooms &amp; Chat Session History</h2>
            <p class="lead">A <span class="highlight">Room</span> is a persistent conversation thread. History is saved automatically  -  you can return to any past conversation.</p>
            ${C.split(
                {
                    title: 'What Gets Saved',
                    content: `
                        <ul>
                            <li>Every message you send and every AI response</li>
                            <li>Tool calls and their results (MCP, Pixel)</li>
                            <li>Room name (auto-generated from first message)</li>
                            <li>Associated Insight state at time of each message</li>
                        </ul>
                    `
                },
                {
                    title: 'What Does NOT Persist',
                    content: `
                        <ul>
                            <li>In-memory variable bindings (cleared when Insight closes)</li>
                            <li>Temporary file uploads (unless saved to an engine)</li>
                            <li>Browser-only UI state (open panels, scroll position)</li>
                            <li>Unsubmitted draft messages</li>
                        </ul>
                    `
                }
            )}
            ${C.flow([
                { title: `Open ${CONFIG.aiName}`, desc: 'Left sidebar shows your Room list  -  most recent at top' },
                { title: 'Select a Past Room', desc: 'Full message history reloads. A new Insight is created for continued execution.' },
                { title: 'Continue the Conversation', desc: 'New messages append to the existing thread. History is always preserved.' }
            ])}
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
                    ['View past rooms', `Left sidebar in ${CONFIG.aiName} → Rooms list`, 'Sorted by last activity'],
                    ['Rename a room', 'Click the room name → edit inline', 'Helps organize long-running projects'],
                    ['Delete a room', 'Room context menu → Delete', 'Permanent  -  deletes all message history'],
                    ['Share a room', 'Room context menu → Share Link', 'Recipient must have platform access'],
                    ['Search history', 'Search bar at top of Rooms list', 'Full-text search across all your rooms']
                ]
            )}
            ${C.callout(`Rooms belong to the user who created them. Admins can view all rooms via the Admin panel under <strong>Monitoring → Rooms</strong>.`, 'info')}
            <h3 style="margin-top: 1.5rem;">Room vs. New Chat</h3>
            ${C.split(
                {
                    title: '+ New Chat (fresh Room)',
                    content: `
                        <ul>
                            <li>Blank context  -  LLM starts with no conversation history</li>
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

    // ─── Dev Troubleshooting ─────────────────────────────────────────────────

    {
        id: "appendix-dev-troubleshooting",
        title: "Developer Troubleshooting",
        content: `
            <h2>Developer Troubleshooting</h2>
            <p class="lead">The most common fixes when something looks broken in VS Code or the platform.</p>
            ${C.cards([
                {
                    badge: '#1 Fix',
                    title: 'VS Code: Reload Window',
                    desc: '<kbd>Cmd+Shift+P</kbd> → <strong>Developer: Reload Window</strong>  -  restarts the VS Code renderer process. Fixes stuck extensions, broken IntelliSense, and unresponsive panels without closing your workspace.'
                },
                {
                    badge: '#2 Fix',
                    title: 'Browser: Hard Refresh',
                    desc: '<kbd>Cmd+Shift+R</kbd> (Mac) or <kbd>Ctrl+Shift+R</kbd> (Windows)  -  bypasses the browser cache and re-fetches all assets. Use when you\'ve deployed new code and still see the old UI.'
                },
                {
                    badge: '#3 Fix',
                    title: 'Check the Console',
                    desc: 'Open DevTools → Console tab. Red errors usually pinpoint the broken component. Network tab shows failed API calls with their status codes and response bodies.'
                },
                {
                    badge: '#4 Fix',
                    title: 'Re-run the Pixel',
                    desc: 'If an app cell is stuck or shows stale data, re-execute the Pixel block. Insight state can get out of sync if a previous execution partially failed.'
                }
            ])}
            ${C.callout('VS Code acting up? Always try <strong>Developer: Reload Window</strong> first  -  it restarts the editor without closing any files or losing your workspace state.', 'tip')}
        `
    },

    {
        id: "appendix-dev-reload-window",
        title: "VS Code: Developer: Reload Window",
        content: `
            <h2>VS Code: Developer: Reload Window</h2>
            <p class="lead">Restarts the VS Code renderer process in place  -  all your open files and workspace state are preserved.</p>
            ${C.split(
                {
                    title: 'When to Use It',
                    content: `
                        <ul>
                            <li>Extensions stopped responding or showing errors</li>
                            <li>IntelliSense / autocomplete broken or stale</li>
                            <li>Terminal or panel stuck / not rendering</li>
                            <li>Git decorations not updating</li>
                            <li>After installing or updating an extension</li>
                            <li>Any "just acting weird" situation</li>
                        </ul>
                    `
                },
                {
                    title: 'What It Preserves',
                    content: `
                        <ul>
                            <li>All open editor tabs and unsaved changes</li>
                            <li>Workspace folder and settings</li>
                            <li>Running terminal sessions</li>
                            <li>Breakpoints and debug configuration</li>
                            <li>Extension state (reloads cleanly)</li>
                        </ul>
                    `
                }
            )}
            ${C.flow([
                { title: 'Open the Command Palette', desc: '<kbd>Cmd+Shift+P</kbd> (Mac) · <kbd>Ctrl+Shift+P</kbd> (Windows/Linux)' },
                { title: 'Type "Reload Window"', desc: 'Select <strong>Developer: Reload Window</strong> from the list' },
                { title: 'VS Code restarts the renderer', desc: 'Takes 2–5 seconds. All files reopen exactly where you left them.' }
            ])}
            ${C.callout('This is different from closing and reopening VS Code. Reload Window is faster and does not terminate your terminal processes.', 'info')}
        `
    }
];
