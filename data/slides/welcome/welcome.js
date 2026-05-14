// Topic: Welcome & Introduction
const slides_welcome = [
    {
        id: "welcome-title",
        title: "Welcome",
        content: C.titleSlide(
            `Welcome to ${CONFIG.productName} Training`,
            "Build AI-Powered Applications on the Enterprise Platform",
            "2-Day Workshop · May 13–14, 2026"
        )
    },
    {
        id: "welcome-introductions",
        title: "ELSA: Year One",
        content: `
            <h2>${CONFIG.productName}: Year One</h2>
            <p>Launched June 2, 2025. Here is what has changed in twelve months.</p>
            ${C.flow([
                {
                    title: 'Launch  -  June 2025',
                    desc: 'Chat interface + document Q&amp;A. Ask questions, get answers. The AI was a destination you went to.'
                },
                {
                    title: 'Integrations',
                    desc: 'Enterprise document repositories and PubMed connected. Your data, not just uploaded files.'
                },
                {
                    title: CONFIG.productName + ' 4.0',
                    desc: 'MCP integration ships. The AI stops being a chatbot and starts being an agent  -  it calls your tools for you.'
                }
            ])}
            ${C.split(
                {
                    title: 'Old Way',
                    content: `
                        <ol>
                            <li>Open your documents across multiple systems</li>
                            <li>Manually copy the right context into the chat window</li>
                            <li>Get an answer  -  then go back and do the work yourself</li>
                        </ol>
                        <p class="muted">You go to the AI. You carry the context. You execute the result.</p>
                    `
                },
                {
                    title: 'ELSA 4.0 Way',
                    content: `
                        <ol>
                            <li>Describe what you need in plain English</li>
                            <li>The agent finds the documents, calls the tools, runs the workflow</li>
                            <li>You review and decide  -  the AI does the legwork</li>
                        </ol>
                        <p class="muted">The AI comes to your work. You stay in control.</p>
                    `
                }
            )}
            ${C.callout(`This training shows you how to build on that foundation  -  not just use ${CONFIG.productName}, but extend it for your team's specific workflows.`, 'tip')}
        `
    },
    {
        id: "welcome-paradigm",
        title: "The Paradigm Shift",
        content: `
            <h2>The Paradigm Shift</h2>
            <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1.5rem;align-items:start;margin-top:1rem;">

                <!-- OLD -->
                <div style="background:#f8f9fa;border-radius:12px;padding:1.25rem;">
                    <div style="font-size:0.7rem;font-weight:700;letter-spacing:.1em;color:#888;margin-bottom:.75rem;">OLD PARADIGM</div>
                    <div style="font-size:1.5rem;text-align:center;margin-bottom:.5rem;">🧑‍💼</div>
                    <p style="font-size:.85rem;color:#555;text-align:center;margin:0 0 .75rem;">You navigate every system yourself.<br>You construct the context. You copy-paste.</p>
                    <div style="display:flex;flex-direction:column;gap:.35rem;">
                        ${['Listings System','Document Repo','Approval System','SharePoint','Research Hub','Search 360','ServiceNow','Appian','Email'].map(t =>
                            `<div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:.3rem .65rem;font-size:.78rem;color:#444;">${t}</div>`
                        ).join('')}
                    </div>
                    <div style="text-align:center;margin:.75rem 0 .25rem;font-size:.8rem;color:#aaa;">↓ manual effort</div>
                    <div style="background:#e2e8f0;border-radius:6px;padding:.35rem .65rem;font-size:.78rem;color:#666;text-align:center;">AI (one of many tabs)</div>
                </div>

                <!-- ARROW -->
                <div style="display:flex;align-items:center;font-size:1.5rem;color:var(--accent);padding-top:4rem;">→</div>

                <!-- NEW -->
                <div style="background:#FDF3E0;border:2px solid var(--accent);border-radius:12px;padding:1.25rem;">
                    <div style="font-size:0.7rem;font-weight:700;letter-spacing:.1em;color:var(--accent);margin-bottom:.75rem;">NEW PARADIGM  -  ELSA 4.0</div>
                    <div style="font-size:1.5rem;text-align:center;margin-bottom:.5rem;">🧑‍💼</div>
                    <p style="font-size:.85rem;color:#555;text-align:center;margin:0 0 .75rem;"><em>"Find the guidance on X and summarize it for my review."</em><br><span style="font-size:.75rem;color:#888;">Plain English. One interface.</span></p>
                    <div style="background:var(--accent);border-radius:8px;padding:.5rem .75rem;font-size:.85rem;font-weight:600;color:#fff;text-align:center;margin-bottom:.75rem;">AI Agent (ELSA)</div>
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#888;text-align:center;margin-bottom:.5rem;">via Model Context Protocol</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.35rem;">
                        ${['Listings System','Document Repo','Approval System','SharePoint','Research Hub','Search 360','ServiceNow','Appian'].map(t =>
                            `<div style="background:#fff;border:1px solid #f0c97a;border-radius:6px;padding:.3rem .5rem;font-size:.72rem;color:#444;">${t}</div>`
                        ).join('')}
                    </div>
                </div>
            </div>

            <div style="margin-top:1rem;">
                ${C.callout('1 UI &nbsp;·&nbsp; Plain English &nbsp;·&nbsp; AI finds the context, runs the workflow, brings you the result &nbsp;·&nbsp; You stay in control', 'tip')}
            </div>
        `
    },
    {
        id: "welcome-paradigm-img",
        title: "The Paradigm Shift (cont.)",
        content: `
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                <img
                    src="assets/paradigm-shift.png"
                    alt="Old vs New Paradigm"
                    style="width:100%;height:auto;max-height:85vh;object-fit:contain;border-radius:6px;display:block;"
                    onerror="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:'<div style=&quot;padding:3rem;border:2px dashed #ddd;border-radius:8px;text-align:center;color:#aaa&quot;><p style=&quot;font-size:1rem;margin:0&quot;>📁 Drop paradigm-shift.png in training/assets/</p></div>'}));"
                >
            </div>
        `
    },
    {
        id: "welcome-goals",
        title: "Training Goals",
        content: `
            <h2>Training Goals</h2>
            <h3>By the end of Day 2 you will be able to:</h3>
            ${C.cards([
                { badge: 'Everyone', title: 'Navigate ELSA', desc: `Understand the platform, find engines, open ${CONFIG.aiName}, and use pre-built apps` },
                { badge: 'Everyone', title: 'Vibe Code an App', desc: 'Use AI-assisted generation to describe and publish a working app  -  no coding required' },
                { badge: 'Everyone', title: `Use MCP in ${CONFIG.aiName}`, desc: 'Connect tools to an AI agent and run a multi-step workflow' },
                { badge: 'Technical', title: 'Write Pixel', desc: 'Chain Pixel commands to query engines, call LLMs, and drive app logic' },
                { badge: 'Technical', title: 'Build MCP Tools', desc: 'Expose Python functions as tools an agent can call via the MCP pattern' },
                { badge: 'Technical', title: 'Integrate APIs', desc: 'Configure OpenAI/Anthropic endpoints and hit them from your app' },
            ])}
            ${C.callout('Ask questions anytime  -  raise your hand or drop it in chat. There are no wrong questions here.', 'tip')}
        `
    },
    {
        id: "welcome-logistics",
        title: "Day 1 Logistics",
        content: `
            <h2>Day 1 Logistics — Wed, May 13</h2>
            ${C.table(
                ['Time', 'Topic'],
                [
                    ['10:00 – 10:30', 'Welcome & Introductions'],
                    ['10:30 – 11:15', 'Platform Fundamentals'],
                    ['11:15 – 11:30', '☕ Break'],
                    ['11:30 – 12:15', 'Engines  -  The Data Layer'],
                    ['12:15 – 1:00',  '🍽 Lunch'],
                    ['1:00 – 1:40',   'Pixel & Reactors  -  Concepts & Demo'],
                    ['1:40 – 2:10',   'App Fundamentals'],
                    ['2:10 – 2:55',   'Vibe Coding  -  Build Your First App'],
                    ['2:55 – 3:00',   'Day 1 Wrap-up'],
                ]
            )}
            ${C.callout(`<strong>Instance:</strong> You will work on the shared ${CONFIG.productName} training instance throughout both days. Your apps and engines persist between Day 1 and Day 2.`, 'info')}
        `
    },
    {
        id: "welcome-day2-logistics",
        title: "Day 2 Logistics",
        content: `
            <h2>Day 2 Logistics — Thu, May 14</h2>
            ${C.table(
                ['Time', 'Topic'],
                [
                    ['10:00 – 11:00', 'Finish Up & Deploy'],
                    ['11:00 – 11:15', 'MCP Fundamentals'],
                    ['11:15 – 12:00', 'MCP in Action'],
                    ['12:00 – 12:30', 'Converting Your App into an MCP'],
                    ['12:30 – 1:30',  '🍽 Lunch'],
                    ['1:30 – 2:00',   'Agents'],
                    ['2:00 – 2:15',   'External API Calls'],
                    ['2:15 – 2:30',   '☕ Break'],
                    ['2:30 – 3:00',   'Agent 47'],
                ]
            )}
            ${C.callout(`Your apps, engines, and access keys from Day 1 are all still there — pick up exactly where you left off.`, 'info')}
        `
    },
    {
        id: "elsa-demo-divider",
        title: "ELSA 4.0 Demo",
        content: C.titleSlide(
            `${CONFIG.productName} 4.0  —  Live Demo`,
            "Walkthrough",
            ""
        )
    }
];
