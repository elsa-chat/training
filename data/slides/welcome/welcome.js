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
        title: "Introductions",
        content: `
            <h2>Introductions</h2>
            <p>Let's get to know each other.</p>
            <ul>
                <li><strong>Your name</strong> and team / role</li>
                <li><strong>Your background</strong> — technical, non-technical, or business</li>
                <li><strong>One thing you want to walk away able to do</strong> in ${CONFIG.productName}</li>
            </ul>
            ${C.callout('No coding experience required to get value from this training. Every session has activities for all skill levels.', 'tip')}
        `
    },
    {
        id: "welcome-overview",
        title: "Two-Day Overview",
        content: `
            <h2>Training Overview</h2>
            ${C.table(
                ['Day', 'Date', 'Focus', 'Key Outcome'],
                [
                    [
                        '<strong>Day 1</strong>',
                        'Wed, May 13',
                        'Platform Foundations + Your First App',
                        'Understand ELSA end-to-end; publish a working app using Vibe Coding'
                    ],
                    [
                        '<strong>Day 2</strong>',
                        'Thu, May 14',
                        'MCP, Playground & Production',
                        'Turn your app into an AI agent; connect APIs; apply security; capstone build'
                    ],
                ]
            )}
            <h3>Daily Schedule</h3>
            ${C.table(
                ['Block', 'Time'],
                [
                    ['Morning session', '10:00 AM – 12:15 PM'],
                    ['Lunch', '12:15 – 1:00 PM'],
                    ['Afternoon session', '1:00 – 3:00 PM'],
                ]
            )}
            ${C.callout('One 15-minute break each morning. All hands-on exercises are tiered — do as much or as little as fits your background.', 'info')}
        `
    },
    {
        id: "welcome-goals",
        title: "Training Goals",
        content: `
            <h2>Training Goals</h2>
            <h3>By the end of Day 2 you will be able to:</h3>
            ${C.cards([
                { badge: 'Everyone', title: 'Navigate ELSA', desc: 'Understand the platform, find engines, open Playground, and use pre-built apps' },
                { badge: 'Everyone', title: 'Vibe Code an App', desc: 'Use AI-assisted generation to describe and publish a working app — no coding required' },
                { badge: 'Everyone', title: 'Use MCP in Playground', desc: 'Connect tools to an AI agent and run a multi-step workflow' },
                { badge: 'Technical', title: 'Write Pixel', desc: 'Chain Pixel commands to query engines, call LLMs, and drive app logic' },
                { badge: 'Technical', title: 'Build MCP Tools', desc: 'Expose Python functions as tools an agent can call via the MCP pattern' },
                { badge: 'Technical', title: 'Integrate APIs', desc: 'Configure OpenAI/Anthropic endpoints and hit them from your app' },
            ])}
            ${C.callout('Ask questions anytime — raise your hand or drop it in chat. There are no wrong questions here.', 'tip')}
        `
    },
    {
        id: "welcome-logistics",
        title: "Logistics",
        content: `
            <h2>Logistics</h2>
            <h3>Today's Agenda — Day 1 (Wed, May 13)</h3>
            ${C.table(
                ['Time', 'Topic'],
                [
                    ['10:00 – 10:30', 'Welcome & Introductions'],
                    ['10:30 – 11:15', 'Platform Fundamentals'],
                    ['11:15 – 11:30', '☕ Break'],
                    ['11:30 – 12:15', 'Engines — The Data Layer'],
                    ['12:15 – 1:00',  '🍽 Lunch'],
                    ['1:00 – 1:40',   'Pixel & Reactors — Concepts & Demo'],
                    ['1:40 – 2:10',   'App Fundamentals'],
                    ['2:10 – 2:55',   'Vibe Coding — Build Your First App'],
                    ['2:55 – 3:00',   'Day 1 Wrap-up'],
                ]
            )}
            ${C.callout(`<strong>Instance:</strong> You will work on the shared ${CONFIG.productName} training instance throughout both days. Your apps and engines persist between Day 1 and Day 2.`, 'info')}
        `
    },
    {
        id: "welcome-day2-logistics",
        title: "Day 2 Agenda",
        content: `
            <h2>Day 2 Agenda — Thu, May 14</h2>
            ${C.table(
                ['Time', 'Topic'],
                [
                    ['10:00 – 10:15', 'Day 1 Recap & Q&A'],
                    ['10:15 – 11:00', 'MCP Fundamentals'],
                    ['11:00 – 11:45', 'Playground Deep Dive + Hands-on'],
                    ['11:45 – 12:00', '☕ Break'],
                    ['12:00 – 12:45', '🍽 Lunch'],
                    ['12:45 – 1:15',  'OpenAI / Anthropic API Endpoints'],
                    ['1:15 – 1:45',   'Security & RBAC'],
                    ['1:45 – 2:45',   'Capstone: End-to-End App Build'],
                    ['2:45 – 3:00',   'Wrap-up, Q&A & Feedback'],
                ]
            )}
            ${C.callout('Backup sections (Python SDK, structured output, image processing, model logs) are ready if either day moves faster than planned.', 'tip')}
        `
    }
];
