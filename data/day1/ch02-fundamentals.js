// Day 1, Chapter 2: Platform Fundamentals (90 min)
const day1_ch02 = {
    title: "Platform Fundamentals",
    slides: [
        {
            id: "d1-platform-title",
            title: "Platform Fundamentals",
            content: C.titleSlide(
                "SEMOSS Platform Fundamentals",
                "Architecture, repositories, and how it all fits together",
                "90 minutes"
            )
        },
        {
            id: "d1-platform-what-is",
            title: "What is SEMOSS?",
            content: `
                <h2>What is SEMOSS?</h2>
                <p class="lead"><span class="highlight">SEMOSS</span> — <strong>Semantic Open Source Software</strong></p>
                <p>A web application platform for building and deploying custom solutions through a lightweight framework providing connectors to:</p>
                ${C.cards([
                    { title: "Databases", desc: "Relational, graph, document stores via JDBC and native drivers" },
                    { title: "LLMs", desc: "OpenAI, Claude, Gemini, open-source models via GAAS Python layer" },
                    { title: "Vector Stores", desc: "FAISS, Weaviate, PGVector for embeddings and semantic search" },
                    { title: "Storage", desc: "Local filesystem, S3, Azure Blob, GCS, MinIO" },
                    { title: "Functions", desc: "Custom API endpoints, Python scripts, reusable logic" },
                    { title: "Guardrails", desc: "PII detection, content filtering, custom validation" },
                ])}
                ${C.callout('SEMOSS started as a visualization tool for RDF data (semantic web) and evolved into a <strong>general-purpose AI application platform</strong>.', 'info')}
            `
        },
        {
            id: "d1-platform-architecture",
            title: "Architecture Overview",
            content: `
                <h2>Three-Tier Architecture</h2>
                <p>Every SEMOSS deployment has three cooperating layers:</p>
                ${C.layers([
                    {
                        label: 'Presentation',
                        items: [
                            { title: 'SemossWeb', desc: 'React/TypeScript — blocks, cells, notebooks' }
                        ]
                    },
                    {
                        label: 'Application',
                        accent: true,
                        items: [
                            { title: 'Monolith', desc: 'REST API, auth, servlets (Tomcat)', accent: true },
                            { title: 'Semoss Core', desc: 'Engines, reactors, Pixel parser', accent: true },
                            { title: 'Python GAAS', desc: 'AI/ML via TCP socket bridge', accent: true }
                        ]
                    },
                    {
                        label: 'Data',
                        items: [
                            { title: 'Database Engines', desc: 'H2, Postgres, MySQL, RDF' },
                            { title: 'Model Engines', desc: 'LLM providers' },
                            { title: 'Vector Engines', desc: 'FAISS, Weaviate' },
                            { title: 'Storage Engines', desc: 'S3, Azure, local' }
                        ]
                    }
                ])}
            `
        },
        {
            id: "d1-platform-request-flow",
            title: "Request Flow",
            content: `
                <h2>How a Request Flows Through SEMOSS</h2>
                <p>When a user clicks "Run" in the notebook, here's what happens:</p>
                ${C.sequence(
                    ['Browser', 'Monolith', 'Semoss Core', 'GAAS (Py)', 'Engine'],
                    [
                        { from: 0, to: 1, label: 'POST /api/engine/runPixel' },
                        { from: 1, to: 2, label: 'Pixel parser → Reactor chain' },
                        { from: 2, to: 3, label: 'TCP: model.ask(prompt)' },
                        { from: 3, to: 4, label: 'OpenAI API call' },
                        { from: 4, to: 3, label: 'LLM response', type: 'response' },
                        { from: 3, to: 2, label: 'NounMetadata result', type: 'response' },
                        { from: 2, to: 1, label: 'JSON payload', type: 'response' },
                        { from: 1, to: 0, label: 'HTTP 200 + pixelReturn', type: 'response' },
                    ]
                )}
                ${C.callout('<strong>Key insight:</strong> The UI never talks to engines directly. Every interaction goes through Pixel → Reactor → Engine.', 'info')}
            `
        },
        {
            id: "d1-platform-java-backend",
            title: "Java Backend Deep Dive",
            content: `
                <h2>Java Backend — Two Repos</h2>
                ${C.split(
                    {
                        title: 'Semoss (Core)',
                        content: `
                            <p><strong>The engine.</strong> Contains all business logic.</p>
                            <ul>
                                <li><code>IEngine</code> interface hierarchy</li>
                                <li><code>AbstractReactor</code> base class</li>
                                <li>Pixel parser (SableCC grammar)</li>
                                <li><code>ReactorFactory</code> — name→class registry</li>
                                <li><code>NounMetadata</code> — universal return type</li>
                                <li>Data frames, security, scheduling</li>
                            </ul>
                            <p>Package root: <code>prerna.*</code></p>
                        `
                    },
                    {
                        title: 'Monolith (Web)',
                        content: `
                            <p><strong>The gateway.</strong> Handles HTTP and auth.</p>
                            <ul>
                                <li>REST API servlets on Tomcat</li>
                                <li>WebSocket support</li>
                                <li>SAML / OAuth integration</li>
                                <li>File upload handling</li>
                                <li>Cluster coordination</li>
                                <li>MCP server endpoints</li>
                            </ul>
                            <p>Package root: <code>prerna.semoss.web.*</code></p>
                        `
                    }
                )}
            `
        },
        {
            id: "d1-platform-python-gaas",
            title: "Python GAAS Layer",
            content: `
                <h2>Python GAAS Layer</h2>
                <p><strong>GAAS</strong> (Generative AI as a Service) — the Python process that handles all AI/ML workloads. Communicates with Java over <strong>TCP sockets</strong>.</p>
                ${C.split(
                    {
                        title: 'Architecture',
                        content: C.flow([
                            { title: 'Java Reactor', desc: 'e.g., LLMReactor.execute()' },
                            { title: 'TCP Socket', desc: 'gaas_tcp_socket_server.py', arrow: 'serialize → TCP' },
                            { title: 'GAAS Handler', desc: 'gaas_gpt_model.py', accent: true, arrow: 'route to provider' },
                            { title: 'Provider SDK', desc: 'openai / anthropic / transformers' },
                        ])
                    },
                    {
                        title: 'Key Files in py/',
                        content: `
                            <ul>
                                <li><code>gaas_gpt_model.py</code> — LLM inference</li>
                                <li><code>gaas_gpt_vector.py</code> — Vector ops</li>
                                <li><code>gaas_gpt_database.py</code> — DB bridge</li>
                                <li><code>gaas_gpt_storage.py</code> — Storage bridge</li>
                                <li><code>gaas_gpt_function.py</code> — Function exec</li>
                                <li><code>gaas_tcp_socket_server.py</code> — TCP server</li>
                                <li><code>gaas_rest_server.py</code> — REST API</li>
                            </ul>
                        `
                    }
                )}
                ${C.callout('<strong>Why Python?</strong> Most AI/ML libraries (PyTorch, LangChain, transformers) are Python-native. GAAS bridges Java with the Python AI ecosystem.', 'info')}
            `
        },
        {
            id: "d1-platform-frontend",
            title: "Frontend (SemossWeb)",
            content: `
                <h2>Frontend: SemossWeb</h2>
                <p>A modern <strong>React/TypeScript</strong> application deployed as a Tomcat webapp.</p>
                ${C.tree([
                    { name: 'SemossWeb/', type: 'dir', children: [
                        { name: 'packages/', type: 'dir', children: [
                            { name: 'client/', type: 'dir', desc: '← main app entry point' },
                            { name: 'cli/', type: 'dir', desc: '← dev CLI tools' },
                        ]},
                        { name: 'libs/', type: 'dir', children: [
                            { name: 'renderer/', type: 'dir', desc: '← block rendering engine' },
                            { name: 'sdk/', type: 'dir', desc: '← backend API client' },
                            { name: 'ui/', type: 'dir', desc: '← shared component library' },
                        ]},
                    ]}
                ])}
                <h3>Block-Based Architecture</h3>
                <p>The UI is built around <strong>blocks</strong> — configurable visual elements that compose into apps:</p>
                ${C.cards([
                    { badge: 'Display', title: 'Charts', desc: 'EChart, Vega visualizations' },
                    { badge: 'Display', title: 'Text / Markdown', desc: 'Rich text, markdown rendering' },
                    { badge: 'Input', title: 'Forms', desc: 'Input, select, slider, upload' },
                    { badge: 'Layout', title: 'Containers', desc: 'Page, sidebar, popover' },
                    { badge: 'Data', title: 'Cells', desc: 'LLM cell, query cell, transforms' },
                    { badge: 'Media', title: 'Embeds', desc: 'Image, iframe, PDF viewer' },
                ])}
            `
        },
        {
            id: "d1-platform-repos",
            title: "Repository Map",
            content: `
                <h2>Repository Map</h2>
                ${C.table(
                    ['Repo', 'Purpose', 'Key Source Paths'],
                    [
                        ['<strong>Semoss</strong>', 'Core platform — engines, reactors, Pixel', '<code>src/prerna/engine/</code> <code>src/prerna/reactor/</code> <code>py/</code>'],
                        ['<strong>Monolith</strong>', 'Web layer — REST API, auth, servlets', '<code>src/prerna/web/</code> <code>src/prerna/auth/</code>'],
                        ['<strong>SemossWeb</strong>', 'Frontend — React UI, blocks, viz', '<code>packages/client/</code> <code>libs/</code>'],
                    ]
                )}
                <h3>Semoss Core — Data Directories</h3>
                ${C.tree([
                    { name: 'Semoss/', type: 'dir', children: [
                        { name: 'db/', type: 'dir', desc: 'Database engines + .smss config' },
                        { name: 'model/', type: 'dir', desc: 'Model engine configs' },
                        { name: 'vector/', type: 'dir', desc: 'Vector database stores' },
                        { name: 'storage/', type: 'dir', desc: 'Storage engine locations' },
                        { name: 'function/', type: 'dir', desc: 'Function engine defs' },
                        { name: 'guardrail/', type: 'dir', desc: 'Guardrail engine defs' },
                        { name: 'project/', type: 'dir', desc: 'Project workspaces' },
                        { name: 'InsightCache/', type: 'dir', desc: 'Cached insight results' },
                        { name: 'py/', type: 'dir', desc: 'Python GAAS layer' },
                    ]}
                ])}
            `
        },
        {
            id: "d1-platform-apps-projects",
            title: "Apps & Projects",
            content: `
                <h2>Apps, Projects & Insights</h2>
                ${C.split(
                    {
                        title: 'Project',
                        content: `
                            <p>A <strong>workspace</strong> containing insights, portals, and config.</p>
                            <ul>
                                <li>Unique UUID identifier</li>
                                <li>Own <code>.smss</code> config file</li>
                                <li>Version-controlled assets</li>
                                <li>Permission model (owner, editor, viewer)</li>
                            </ul>
                        `
                    },
                    {
                        title: 'App (Portal)',
                        content: `
                            <p>A <strong>user-facing interface</strong> built within a project.</p>
                            <ul>
                                <li>Composed of blocks + cells</li>
                                <li>Backed by Pixel recipes</li>
                                <li>Interactive — binds to engines</li>
                                <li>Shareable via URL</li>
                            </ul>
                        `
                    }
                )}
                <h3>On-Disk Structure</h3>
                ${C.tree([
                    { name: 'project/', type: 'dir', children: [
                        { name: 'MyProject__a1b2c3d4-.../', type: 'dir', children: [
                            { name: 'MyProject__a1b2c3d4-....smss', desc: 'project config' },
                            { name: 'version/', type: 'dir', desc: 'insight version history' },
                            { name: 'portals/', type: 'dir', desc: 'app definitions' },
                            { name: 'assets/', type: 'dir', desc: 'uploaded files' },
                        ]}
                    ]}
                ])}
                ${C.callout('Naming convention: <code>Name__UUID</code> — e.g., <code>country_db__bd1dea64-ec6b-49af-9308-94b05551c83d</code>. This pattern applies to all engines and projects.', 'info')}
            `
        },
        {
            id: "d1-platform-navigation",
            title: "UI Overview",
            content: `
                <h2>Navigation & UI Overview</h2>
                <p>The SEMOSS UI is organized around these key areas:</p>
                ${C.cards([
                    { badge: 'Navigate', title: 'Home', desc: 'Browse apps, projects, engines. Central dashboard.' },
                    { badge: 'Build', title: 'Notebook', desc: 'Write Pixel, run code, explore data interactively.' },
                    { badge: 'Build', title: 'App Builder', desc: 'Compose blocks into visual apps with drag-and-drop.' },
                    { badge: 'Manage', title: 'Engine Catalog', desc: 'Create, configure, and monitor all engine types.' },
                    { badge: 'AI', title: 'Chat', desc: 'LLM-powered assistant interface for conversational AI.' },
                    { badge: 'Admin', title: 'Settings', desc: 'User management, security, platform configuration.' },
                ])}
                ${C.callout('<strong>Live Demo:</strong> Open your browser and navigate to the training instance. We will walk through each area together.', 'tip')}
            `
        }
    ]
};
