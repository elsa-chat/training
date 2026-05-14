// Topic: Agent47  -  Agentic App Builder (Backup / Optional)
const slides_agent47 = [

    {
        id: "agent47-title",
        title: "What's Next: Agentic App Builder",
        content: C.titleSlide(
            "What's Next",
            `Agentic App Builder  -  Build and Deploy Agents Without Leaving ${CONFIG.productName}`,
            "Early Preview · Name TBD"
        )
    },

    {
        id: "agent47-what-is",
        title: "Agentic App Builder  -  What It Is",
        content: `
            <h2>Agentic App Builder</h2>
            <p class="lead">Everything you built this week  -  engines, MCP tools, apps  -  comes together in a single visual workspace.</p>
            ${C.cards([
                {
                    badge: 'Visual',
                    title: 'In-Platform Builder',
                    desc: `Design, configure, and deploy agents directly inside ${CONFIG.productName}. No context-switching, no external tools.`
                },
                {
                    badge: 'Assistants',
                    title: 'Choose Your AI Pair',
                    desc: 'Switch between Claude Code, GitHub Copilot, and other assistants from the workspace settings panel.'
                },
                {
                    badge: 'Model-Agnostic',
                    title: 'Pick Your Model',
                    desc: 'GPT, Claude, Gemini  -  select per project. The platform wires the model to your agent automatically.'
                },
                {
                    badge: 'Native MCP',
                    title: 'Tools Built In',
                    desc: 'Your MCP tools are first-class citizens. Connect engines, APIs, and custom reactors with a settings panel  -  not config files.'
                },
            ])}
            ${C.callout(`This is the next evolution of what you practiced in ${CONFIG.aiName} today  -  structured, native, and deployable.`, 'tip')}
        `
    },

    {
        id: "agent47-vs-today",
        title: "Ways to Build Apps",
        content: `
            <h2>Ways to Build Apps on ${CONFIG.productName}</h2>
            <p class="lead">Three paths  -  pick the one that fits your team and skill level.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-top:0.75rem;">

                <div style="background:#f8f9fa;border-radius:10px;padding:1rem;">
                    <div style="font-size:0.65rem;font-weight:700;letter-spacing:.08em;color:#888;margin-bottom:.5rem;">OPTION 1</div>
                    <div style="font-weight:700;font-size:.95rem;margin-bottom:.4rem;">Low-Code / Drag &amp; Drop</div>
                    <p style="font-size:.8rem;color:#555;margin:0 0 .6rem;">Visual builder  -  drag components onto a canvas, wire up data, publish. No code required.</p>
                    <ul style="font-size:.78rem;color:#444;margin:0;padding-left:1.1rem;line-height:1.7;">
                        <li>Point-and-click component layout</li>
                        <li>Connect engines without writing Pixel</li>
                        <li>Publish with one click</li>
                    </ul>
                    <p style="font-size:.72rem;color:#aaa;margin:.6rem 0 0;font-style:italic;">Best for: anyone, fastest path to a working app</p>
                </div>

                <div style="background:#f8f9fa;border-radius:10px;padding:1rem;">
                    <div style="font-size:0.65rem;font-weight:700;letter-spacing:.08em;color:#888;margin-bottom:.5rem;">OPTION 2</div>
                    <div style="font-weight:700;font-size:.95rem;margin-bottom:.4rem;">Pro-Code + Vibe Coding</div>
                    <p style="font-size:.8rem;color:#555;margin:0 0 .6rem;">Write Pixel and React directly  -  or describe what you want and let the AI generate it for you.</p>
                    <ul style="font-size:.78rem;color:#444;margin:0;padding-left:1.1rem;line-height:1.7;">
                        <li>Full control over logic and layout</li>
                        <li>Vibe Coding generates the scaffold</li>
                        <li>Iterate in code, deploy as a portal</li>
                    </ul>
                    <p style="font-size:.72rem;color:#aaa;margin:.6rem 0 0;font-style:italic;">Best for: technical teams, custom workflows</p>
                </div>

                <div style="background:#FDF3E0;border:2px solid var(--accent);border-radius:10px;padding:1rem;">
                    <div style="font-size:0.65rem;font-weight:700;letter-spacing:.08em;color:var(--accent);margin-bottom:.5rem;">OPTION 3  -  COMING SOON</div>
                    <div style="font-weight:700;font-size:.95rem;margin-bottom:.4rem;">Agentic App Builder</div>
                    <p style="font-size:.8rem;color:#555;margin:0 0 .6rem;">Build an app where the AI is the engine  -  not just a widget. Connect engines, tools, and models from a visual workspace.</p>
                    <ul style="font-size:.78rem;color:#444;margin:0;padding-left:1.1rem;line-height:1.7;">
                        <li>Visual agent configuration</li>
                        <li>MCP tools wired in natively</li>
                        <li>Build, test, deploy in one place</li>
                    </ul>
                    <p style="font-size:.72rem;color:#aaa;margin:.6rem 0 0;font-style:italic;">Best for: agent-native workflows, production agents</p>
                </div>

            </div>
            ${C.callout('Same platform, same engines, same models  -  three different entry points depending on what you need to build.', 'info')}
        `
    },

    {
        id: "agent47-preview",
        title: "Early Preview",
        content: `
            <h2>Early Preview</h2>
            <p style="color:#666;font-size:0.85rem;margin-bottom:0.75rem;">The workspace: canvas on the left, configuration panel on the right. Tabs for Build, Issues, Engines, History, and Settings.</p>
            <div id="agent47-img-wrap" style="width:100%;border-radius:8px;overflow:hidden;">
                <img
                    src="assets/agent47-preview.png"
                    alt="Agentic App Builder preview"
                    style="width:100%;height:auto;display:block;border-radius:8px;"
                    onerror="document.getElementById('agent47-img-wrap').innerHTML='<div style=&quot;padding:3rem;border:2px dashed #ddd;border-radius:8px;text-align:center;color:#aaa&quot;><p style=&quot;font-size:1rem;margin:0&quot;>&#128193; Drop <code>agent47-preview.png</code> in <code>training/assets/</code></p></div>';"
                >
            </div>
        `
    },

    {
        id: "agent47-closes-loop",
        title: "Why It Matters",
        content: `
            <h2>Why It Matters  -  Closing the Loop</h2>
            <p class="lead">This week you built each layer separately. The Agentic App Builder is where they converge.</p>
            ${C.flow([
                {
                    title: 'Engines',
                    desc: 'Vector, LLM, and data engines you built are directly connectable  -  no config file, just pick from the Engines tab.',
                },
                {
                    title: 'MCP Tools',
                    desc: 'The tools you wrote and consumed today become the agent\'s callable actions  -  wired in through the workspace settings panel.'
                },
                {
                    title: 'Apps',
                    desc: 'Instead of publishing a static portal, you publish an agent-native app. The AI is built into the product, not bolted on.'
                },
                {
                    title: 'You Stay in Control',
                    desc: 'History tab, Issues tab, model selection, assistant selection  -  full observability and configurability without leaving the platform.',
                },
            ])}
            ${C.callout(`The paradigm shift we talked about on Day 1  -  this is the platform experience that makes it real.`, 'tip')}
        `
    },

];
