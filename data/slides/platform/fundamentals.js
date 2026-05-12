// Topic: Platform Fundamentals
const slides_platform_fundamentals = [

    {
        id: "platform-title",
        title: "Platform Fundamentals",
        content: C.titleSlide(
            `${CONFIG.productName} Platform Fundamentals`,
            "How the platform is built and how it fits together",
            "45 minutes"
        )
    },

    // ── ORIGIN & OBJECTIVES ───────────────────────────────────────────────────
    {
        id: "platform-origin",
        title: "What ELSA Delivers",
        content: `
            <h2>${CONFIG.productName} Delivers a Secure AI Sandbox on Day 1</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;margin-top:1rem;">
                ${[
                    {
                        title: 'Quickly prototype AI applications',
                        desc: 'Without deep technical expertise — the catalog and building block ecosystem handles the complexity so you focus on the problem.',
                        badges: ['AI Playground','App Marketplace','Model Zoo']
                    },
                    {
                        title: 'Clear abstraction layer',
                        desc: 'Curtail incremental complexity with open source, multi-model, and multi-cloud integration. The platform adapts as models and providers evolve.',
                        badges: ['AI for Anyone','Vendor Agnostic','Adaptive']
                    },
                    {
                        title: 'Controls & guardrails built in',
                        desc: 'Every app is governed by role-based access control, audit logging, and usage metering — protecting data and meeting compliance requirements.',
                        badges: ['Governance','Monitor Cost','RBAC']
                    },
                ].map(item => `
                    <div style="background:#f0faf5;border:1.5px solid #9ae6b4;border-radius:12px;padding:1.4rem 1.5rem;">
                        <div style="font-weight:700;font-size:1.05rem;color:#1a4731;margin-bottom:.55rem;">${item.title}</div>
                        <p style="font-size:.95rem;color:#444;margin:0 0 .85rem;line-height:1.55;">${item.desc}</p>
                        <div style="display:flex;flex-wrap:wrap;gap:.4rem;">
                            ${item.badges.map(b => `<span style="background:#fff;border:1px solid #68d391;border-radius:5px;padding:.2rem .6rem;font-size:.78rem;color:#276749;font-weight:600;">${b}</span>`).join('')}
                        </div>
                    </div>`).join('')}
            </div>
        `
    },

    // ── BUILDING BLOCKS ───────────────────────────────────────────────────────
    {
        id: "platform-building-blocks",
        title: "Application Building Blocks",
        content: `
            <h2>Application Building Blocks</h2>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-top:.6rem;">

                <!-- MODELS -->
                <div style="background:#f0faf5;border:1.5px solid #68d391;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#276749;margin-bottom:.3rem;">MODELS</div>
                    <p style="font-size:.78rem;color:#444;margin:0 0 .3rem;">Expose AI models in an abstracted manner for use across apps.</p>
                    <p style="font-size:.75rem;color:#2d6a4f;font-weight:600;margin:0;">OpenAI, Claude, Llama, Gemini, Bedrock, Azure OpenAI, locally-hosted…</p>
                </div>

                <!-- DATABASES -->
                <div style="background:#f0faf5;border:1.5px solid #68d391;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#276749;margin-bottom:.3rem;">DATABASES</div>
                    <p style="font-size:.78rem;color:#444;margin:0 0 .3rem;">Expose different structured data sources.</p>
                    <p style="font-size:.75rem;color:#2d6a4f;font-weight:600;margin:0;">RDBMS, Vector DBs, RDF, Graph Databases, Excel/CSV converted to full databases…</p>
                </div>

                <!-- VECTOR DBs -->
                <div style="background:#f0faf5;border:1.5px solid #68d391;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#276749;margin-bottom:.3rem;">VECTOR DBs</div>
                    <p style="font-size:.78rem;color:#444;margin:0 0 .3rem;">Create vector databases from storage for quick semantic search and reuse across apps.</p>
                    <p style="font-size:.75rem;color:#2d6a4f;font-weight:600;margin:0;">FAISS, Pinecone, pgvector, Chroma…</p>
                </div>

                <!-- STORAGE -->
                <div style="background:#f0faf5;border:1.5px solid #68d391;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#276749;margin-bottom:.3rem;">STORAGE</div>
                    <p style="font-size:.78rem;color:#444;margin:0 0 .3rem;">Access unstructured data — audio, video, images, documents, and code.</p>
                    <p style="font-size:.75rem;color:#2d6a4f;font-weight:600;margin:0;">S3, Azure Blob, Google Cloud, SharePoint, OneDrive, SFTP…</p>
                </div>
            </div>

            <!-- ACCESS MANAGEMENT + LOGGING -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-top:.6rem;">
                <div style="background:#ebf8ff;border:1.5px solid #63b3ed;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2b6cb0;margin-bottom:.3rem;">ACCESS MANAGEMENT</div>
                    <p style="font-size:.78rem;color:#444;margin:0;">Control access to catalogs based on security schemas to enable enterprise-wide governance and align with organizational policies.</p>
                </div>
                <div style="background:#ebf8ff;border:1.5px solid #63b3ed;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#2b6cb0;margin-bottom:.3rem;">LOGGING &amp; METERING</div>
                    <p style="font-size:.78rem;color:#444;margin:0;">Monitor LLM usage to meter, throttle, and control access and cost, as well as identify inappropriate usage.</p>
                </div>
            </div>

            <!-- TOOL TIERS -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6rem;margin-top:.6rem;">
                <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#4a5568;margin-bottom:.3rem;">NO-CODE TOOLS</div>
                    <p style="font-size:.75rem;color:#555;margin:0 0 .3rem;">Business users create AI apps without a single line of code.</p>
                    <p style="font-size:.72rem;color:#718096;font-weight:600;margin:0;">Drag &amp; Drop, Agent Builder</p>
                </div>
                <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#4a5568;margin-bottom:.3rem;">CODE-FIRST TOOLS</div>
                    <p style="font-size:.75rem;color:#555;margin:0 0 .3rem;">Developers build custom data pipelines and interfaces.</p>
                    <p style="font-size:.72rem;color:#718096;font-weight:600;margin:0;">Code Editor, Notebook (Pixel)</p>
                </div>
                <div style="background:#f7fafc;border:1px solid #e2e8f0;border-radius:8px;padding:.75rem;">
                    <div style="font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#4a5568;margin-bottom:.3rem;">APP LIBRARY</div>
                    <p style="font-size:.75rem;color:#555;margin:0 0 .3rem;">Test models and access pre-built apps. Customize templates to accelerate delivery.</p>
                    <p style="font-size:.72rem;color:#718096;font-weight:600;margin:0;">Playground, Policy Vector Engine</p>
                </div>
            </div>
        `
    },

    // ── ARCHITECTURE DIAGRAM ──────────────────────────────────────────────────
    {
        id: "platform-arch-diagram",
        title: "Architecture Diagram",
        content: `
            <h2>Platform Architecture</h2>
            <div style="width:100%;text-align:center;margin-top:.5rem;">
                <img
                    src="assets/ai-core-architecture.svg"
                    alt="${CONFIG.productName} Platform Architecture"
                    style="width:100%;height:auto;max-height:78vh;border-radius:8px;"
                    onerror="document.getElementById('arch-fallback').style.display='block';this.style.display='none';"
                >
                <div id="arch-fallback" style="display:none;padding:3rem;border:2px dashed #ddd;border-radius:8px;color:#aaa;">
                    <p style="margin:0;">&#128193; Drop <code>ai-core-architecture.svg</code> in <code>training/assets/</code></p>
                </div>
            </div>
        `
    },

    // ── NAVIGATION ────────────────────────────────────────────────────────────
    {
        id: "platform-navigation",
        title: "Navigation Walkthrough",
        content: `
            <h2>The Five Main Areas</h2>
            <p>Before we dive in, let's orient ourselves. ${CONFIG.productName} is organized around five navigation areas — each with a distinct purpose.</p>
            ${C.cards([
                {
                    badge: 'Discover',
                    title: 'Catalog',
                    desc: 'Browse and search all engines, apps, and projects shared with you. Your starting point for finding what already exists.'
                },
                {
                    badge: 'Connect',
                    title: 'Engines',
                    desc: 'Create and manage connections to databases, AI models, vector stores, storage, and more. The data layer lives here.'
                },
                {
                    badge: 'Build',
                    title: 'Apps',
                    desc: `Create, edit, and run applications. Choose from drag-and-drop, vibe coding, or pro-code — all publishing to the same platform.`
                },
                {
                    badge: 'Experiment',
                    title: 'Playground',
                    desc: 'Interactive sandbox for testing AI models, running ad-hoc queries, and exploring data before building a full app.'
                },
                {
                    badge: 'Admin',
                    title: 'Settings',
                    desc: `Manage users, permissions, and platform configuration. Typically handled by your ${CONFIG.productName} admin.`
                }
            ])}
            ${C.callout('Follow along in your browser as the presenter navigates each area.', 'tip')}
        `
    },

    // ── RBAC ──────────────────────────────────────────────────────────────────
    {
        id: "platform-rbac",
        title: "Access & Permissions",
        content: `
            <h2>Role-Based Access Control</h2>
            <p>${CONFIG.productName} uses three permission levels that apply consistently to both <strong>Engines</strong> and <strong>Apps</strong>.</p>
            ${C.table(
                ['Role', 'Engines', 'Apps'],
                [
                    [
                        '<strong>Owner</strong>',
                        'Create, edit config, delete, share with others',
                        'Create, edit layout & logic, publish, delete, share'
                    ],
                    [
                        '<strong>Edit</strong>',
                        'View details, upload documents, run queries',
                        'Edit content and cells, run, save changes'
                    ],
                    [
                        '<strong>Read-Only</strong>',
                        'Run queries and inference — no config changes',
                        'View and interact with the app — no editing'
                    ]
                ]
            )}
            ${C.callout('If you cannot find an engine or app, you may not have been granted access — ask your admin. Full permission management is covered on Day 2.', 'warning')}
        `
    }
];
