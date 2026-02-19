// Topic: Platform Fundamentals
const slides_platform_fundamentals = [
        {
            id: "platform-title",
            title: "Platform Fundamentals",
            content: C.titleSlide(
                `${CONFIG.productName} Platform Fundamentals`,
                "Architecture, repositories, and how it all fits together",
                "90 minutes"
            )
        },
        {
            id: "platform-what-is",
            title: `What is ${CONFIG.productName}?`,
            content: `
                <h2>What is ${CONFIG.productName}?</h2>
                <p class="lead"><span class="highlight">${CONFIG.productName}</span> — <strong>Semantic Open Source Software</strong></p>
                <p>A web application platform for building and deploying custom solutions through a lightweight framework providing connectors to:</p>
                ${C.cards([
                    { title: "Databases", desc: "Relational, graph, document stores via JDBC and native drivers" },
                    { title: "LLMs", desc: "OpenAI, Claude, Gemini, open-source models via GAAS Python layer" },
                    { title: "Vector Stores", desc: "FAISS, Weaviate, PGVector for embeddings and semantic search" },
                    { title: "Storage", desc: "Local filesystem, S3, Azure Blob, GCS, MinIO" },
                    { title: "Functions", desc: "Custom API endpoints, Python scripts, reusable logic" },
                    { title: "Guardrails", desc: "PII detection, content filtering, custom validation" },
                ])}
                ${C.callout(`${CONFIG.productName} started as a visualization tool for RDF data (semantic web) and evolved into a <strong>general-purpose AI application platform</strong>.`, 'info')}
            `
        },
        {
            id: "platform-architecture",
            title: "Architecture Overview",
            content: `
                <h2>Three-Tier Architecture</h2>
                <p>Every ${CONFIG.productName} deployment has three cooperating layers:</p>
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
            id: "platform-request-flow",
            title: "Request Flow",
            content: `
                <h2>How a Request Flows Through ${CONFIG.productName}</h2>
                <p>When a user clicks "Run" in the notebook, here's what happens:</p>
                ${C.sequence(
                    ["Browser/UI", "REST API", "Reactor Layer", "Engine Layer"],
                    [
                        { from: 0, to: 1, label: "POST /api/engine/runPixel" },
                        { from: 1, to: 2, label: "Parse Pixel → Execute reactors" },
                        { from: 2, to: 3, label: "Query/Inference/Operation" },
                        { from: 3, to: 2, label: "Raw result", type: "response" },
                        { from: 2, to: 1, label: "NounMetadata → JSON", type: "response" },
                        { from: 1, to: 0, label: "HTTP 200 + pixelReturn", type: "response" }
                    ]
                )}
                ${C.callout('<strong>Key insight:</strong> The UI never talks to engines directly. Every interaction goes through <strong>Pixel → Reactor → Engine</strong>. The REST API layer (Monolith) handles HTTP/auth, the Reactor Layer (Semoss Core) parses Pixel and executes logic, and the Engine Layer (databases, models, storage) performs the actual operations.', 'info')}
            `
        },
        {
            id: "platform-java-backend",
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
            id: "platform-python-gaas",
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
            id: "platform-frontend",
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
            id: "platform-repos",
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
                <h3>Key Configuration Files</h3>
                <p>These configuration files control critical platform behavior:</p>
                ${C.cards([
                    {
                        badge: 'Core',
                        title: 'RDF_Map.prop',
                        desc: 'Main platform configuration file. Contains Kubernetes settings, cloud storage (Azure/MinIO), Python/R integration, engine watcher configurations, file paths, frame types, security, admin restrictions, logging, and scheduler settings. Located in Semoss root.'
                    },
                    {
                        badge: 'Core',
                        title: 'social.properties',
                        desc: 'Authentication and OAuth configuration file. Defines login providers (Google, GitHub, Microsoft, ADFS, Okta, LDAP, native login), OAuth client IDs, secret keys, redirect URIs, and SMTP email settings. Located in Semoss root.'
                    },
                    {
                        badge: 'Monolith',
                        title: 'web.xml',
                        desc: 'Servlet configuration for the Tomcat webapp. Defines URL mappings, filters (CORS, auth), session config, and servlet initialization parameters. Located in Monolith/WEB-INF/.'
                    }
                ])}
                ${C.callout('<strong>Pro tip:</strong> When troubleshooting, check these files first — they control engine discovery, database connections, and API routing.', 'tip')}
            `
        },
        {
            id: "platform-apps-projects",
            title: "Apps & Projects",
            content: `
                <h2>Apps & Projects</h2>
                ${C.callout(`In ${CONFIG.productName}, <strong>"app"</strong> and <strong>"project"</strong> are the same thing and used interchangeably. Each app/project is a workspace containing insights, portals, and configuration.`, 'info')}
                <h3>App/Project Characteristics</h3>
                <ul>
                    <li>Unique UUID identifier</li>
                    <li>Own <code>.smss</code> config file</li>
                    <li>Version-controlled assets</li>
                    <li>Permission model (owner, editor, viewer)</li>
                    <li>Composed of blocks + cells</li>
                    <li>Backed by Pixel recipes</li>
                    <li>Interactive — binds to engines</li>
                    <li>Shareable via URL</li>
                </ul>
                <h3>On-Disk Structure</h3>
                ${C.tree([
                    { name: 'project/', type: 'dir', desc: '← base directory', children: [
                        { name: 'ProjectName__UUID/', type: 'dir', desc: '← app/project folder', children: [
                            { name: 'ProjectName__UUID.smss', desc: 'project config' },
                            { name: 'app_root/', type: 'dir', children: [
                                { name: 'version/', type: 'dir', children: [
                                    { name: 'assets/', type: 'dir', desc: 'portals, uploaded files, resources' }
                                ]}
                            ]}
                        ]}
                    ]}
                ])}
                ${C.callout('Naming convention: <code>Name__UUID</code> — e.g., <code>Ginnie_Mae_Mortgage-Backed_Securities__8fd44ada-cd0a-4157-a75e-0ba0174439da</code>. This pattern applies to all engines and projects.', 'info')}
            `
        },
        {
            id: "platform-navigation",
            title: "UI Overview",
            content: `
                <h2>Navigation & UI Overview</h2>
                <p>The ${CONFIG.productName} UI is organized around these key areas:</p>
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
    ];
