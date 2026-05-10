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
        {
            id: "platform-architecture",
            title: "Architecture Overview",
            content: `
                <h2>Three-Layer Architecture</h2>
                <p>Every ${CONFIG.productName} deployment has three cooperating layers. Understanding this mental model will make every exercise today click into place.</p>
                ${C.layers([
                    {
                        label: 'Layer 1 — Presentation',
                        items: [
                            { title: 'React Frontend', desc: 'SemossWeb — what you see in the browser' }
                        ]
                    },
                    {
                        label: 'Layer 2 — Application',
                        accent: true,
                        items: [
                            { title: 'Java Backend', desc: 'Pixel parser, Reactors, Engine APIs', accent: true },
                            { title: 'REST API (Monolith)', desc: 'Auth, HTTP routing, servlets on Tomcat', accent: true }
                        ]
                    },
                    {
                        label: 'Layer 3 — AI / Inference',
                        items: [
                            { title: 'Python GAAS', desc: 'Out-of-process AI model inference — talks to LLM providers' }
                        ]
                    }
                ])}
                ${C.callout('This is a mental model slide — you do not need to know Java or Python to use ' + CONFIG.productName + '. But knowing which layer does what helps when something behaves unexpectedly.', 'info')}
            `
        },
        {
            id: "platform-request-flow",
            title: "Request Flow",
            content: `
                <h2>How Every Action Travels Through ${CONFIG.productName}</h2>
                <p>Whether you click a button, run a query, or ask the AI a question — the same path is always followed.</p>
                ${C.sequence(
                    ["Browser", "Pixel Engine", "Reactor", "Engine"],
                    [
                        { from: 0, to: 1, label: "User action → POST /api/engine/runPixel" },
                        { from: 1, to: 2, label: "Parse Pixel expression → dispatch Reactor" },
                        { from: 2, to: 3, label: "Query / Inference / Operation" },
                        { from: 3, to: 2, label: "Raw result", type: "response" },
                        { from: 2, to: 1, label: "Structured result (NounMetadata)", type: "response" },
                        { from: 1, to: 0, label: "JSON response → UI renders", type: "response" }
                    ]
                )}
                ${C.callout('Every action in ' + CONFIG.productName + ' follows this path — you\'ll see this play out in every hands-on exercise today.', 'tip')}
            `
        },
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
                        desc: 'Create, edit, and run low-code applications. Compose visual blocks and wire them to engines without writing code.'
                    },
                    {
                        badge: 'Experiment',
                        title: 'Playground',
                        desc: 'Interactive sandbox for testing AI models, running ad-hoc queries, and exploring data before building a full app.'
                    },
                    {
                        badge: 'Admin',
                        title: 'Settings',
                        desc: 'Manage users, permissions, and platform configuration. Typically handled by your ${CONFIG.productName} admin.'
                    }
                ])}
                ${C.callout('Follow along in your browser as the presenter navigates each area.', 'tip')}
            `
        },
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
