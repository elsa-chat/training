// Topic: Welcome & Introduction
const slides_welcome = [
        {
            id: "welcome-title",
            title: "Welcome",
            content: C.titleSlide(
                `Welcome to ${CONFIG.productName} Training`,
                "Spain 2026 — February 23–25",
                "Day 1 of 3"
            )
        },
        {
            id: "welcome-introductions",
            title: "Introductions",
            content: `
                <h2>Introductions</h2>
                <p>Let's get to know each other.</p>
                <ul>
                    <li><strong>Your name</strong> and role</li>
                    <li><strong>Your experience</strong> with ${CONFIG.productName} (if any)</li>
                    <li><strong>What you hope to learn</strong> this week</li>
                </ul>
            `
        },
        {
            id: "welcome-overview",
            title: "Week Overview",
            content: `
                <h2>Training Overview</h2>
                ${C.table(
                    ['Day', 'Focus'],
                    [
                        ['<strong>Day 1 (Mon)</strong>', 'Platform Fundamentals, Engines, Pixel & Reactors, App Building & Extensions'],
                        ['<strong>Day 2 (Tue)</strong>', 'Playground, MCP Fundamentals, AI/LLM Integration'],
                        ['<strong>Day 3 (Wed)</strong>', 'Security, Docker & Admin Operations'],
                    ]
                )}
            `
        },
        {
            id: "welcome-goals",
            title: "Training Goals",
            content: `
                <h2>Training Goals</h2>
                <h3>By end of training you will:</h3>
                <ul>
                    <li>Understand the <strong>${CONFIG.productName} architecture</strong> end-to-end</li>
                    <li>Configure and manage <strong>engines</strong> (databases, LLMs, vector stores, storage)</li>
                    <li>Write and execute <strong>Pixel commands</strong> and build reactor chains</li>
                    <li>Build <strong>custom reactors</strong> and extend the platform</li>
                    <li>Create <strong>apps and insights</strong> using the ${CONFIG.productName} UI</li>
                    <li>Integrate <strong>AI/LLM capabilities</strong> into workflows</li>
                    <li>Deploy and manage a <strong>${CONFIG.productName} instance</strong></li>
                </ul>
                ${C.callout('Each session mixes explanation with hands-on exercises. Ask questions anytime.', 'tip')}
            `
        },
        {
            id: "welcome-logistics",
            title: "Q&A Logistics",
            content: `
                <h2>Q&A & Logistics</h2>
                <ul>
                    <li><strong>Questions:</strong> Ask anytime — raise your hand or type in chat</li>
                    <li><strong>Breaks:</strong> 15 min mid-morning and mid-afternoon, 1 hour lunch</li>
                    <li><strong>Hands-on labs:</strong> You'll work on a shared ${CONFIG.productName} instance</li>
                    <li><strong>Materials:</strong> All slides and exercises are in this training portal</li>
                </ul>
                <h3>Today's Agenda</h3>
                ${C.table(
                    ['Time', 'Topic'],
                    [
                        ['9:00 – 9:30', 'Welcome & Introductions'],
                        ['9:30 – 11:00', 'Platform Fundamentals'],
                        ['11:00 – 11:15', 'Break'],
                        ['11:15 – 12:45', 'Engines: The Resource Layer'],
                        ['12:45 – 1:45', 'Lunch'],
                        ['1:45 – 5:00', 'Pixel & Reactors'],
                    ]
                )}
            `
        }
    ];
