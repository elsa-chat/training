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
        title: "Adding Files to a Playground Chat",
        content: `
            <h2>Adding Files to a Playground Chat</h2>
            <p class="lead">In the Playground, you can attach files directly to your conversation. The file is sent as context for that message  -  the model can read and reason over it inline.</p>
            ${C.flow([
                { title: 'Open Playground', desc: 'Go to the Playground from the left sidebar and open or start a Room.' },
                { title: 'Click the Attachment Icon', desc: 'In the chat input bar, click the paperclip / attachment icon next to the message box.', arrow: '↓' },
                { title: 'Select Your File', desc: 'Choose a file from your computer. Supported types include PDF, DOCX, TXT, CSV, and images.', arrow: '↓' },
                { title: 'Send with Your Message', desc: 'Type your question and hit Send. The file contents are included as context in that turn of the conversation.', arrow: '↓' }
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
                    title: 'What It Does Not Do',
                    content: `
                        <ul>
                            <li>Does not index or embed the file into a Knowledge Repository</li>
                            <li>Does not make the file searchable via semantic search</li>
                            <li>Does not make the file available to other rooms or users</li>
                        </ul>
                        <p class="muted">For searchable, reusable storage use a Vector Engine instead.</p>
                    `
                }
            )}
            ${C.callout('Files attached in a Playground room are persisted to the platform  -  they will still be there if you return to that room later. They are not, however, indexed for search.', 'info')}
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
            ${C.flow([
                { title: 'Open Playground', desc: 'Left sidebar shows your Room list  -  most recent at top' },
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
                    ['View past rooms', 'Left sidebar in Playground → Rooms list', 'Sorted by last activity'],
                    ['Rename a room', 'Three dots menu on the room → Rename', 'Helps organize long-running projects'],
                    ['Delete a room', 'Three dots menu on the room → Delete', 'Permanent  -  deletes all message history'],
                    ['Favorite a room', 'Three dots menu on the room → Favorite', 'Pins the room for quick access'],
                    ['Search history', 'Search bar at top of Rooms list', 'Full-text search across all your rooms']
                ]
            )}
            ${C.callout(`Rooms belong to the user who created them. Admins can query room and message history via the <strong>ModelInferenceLogs</strong> db.`, 'info')}
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
