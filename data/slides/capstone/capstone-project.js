// Topic: Capstone  -  Open Build
const slides_capstone_project = [
    {
        id: "capstone-title",
        title: "Open Build",
        content: C.titleSlide(
            "Open Build",
            "60 minutes to build something you'll actually use",
            "60 minutes · No teams · No assigned brief"
        )
    },
    {
        id: "capstone-starting-points",
        title: "Three Starting Points",
        content: `
            <h2>Pick Your Starting Point</h2>
            <p>No assigned project. No teams. Build something you'd actually use  -  or go deeper on something from the training that you want to understand better.</p>
            ${C.cards([
                {
                    badge: 'Starting Point A',
                    title: 'Extend Yesterday\'s App',
                    desc: `Add a ${CONFIG.aiName} agent with your MCP tool, apply a guardrail, or add a second search capability. Build on what you already have.`
                },
                {
                    badge: 'Starting Point B',
                    title: 'Start Something New',
                    desc: 'Pick a real workflow from your team and build a ${CONFIG.productName} app for it  -  use your vector engine, the shared model, MCP, whatever fits the problem.'
                },
                {
                    badge: 'Starting Point C',
                    title: 'Go Deeper',
                    desc: 'Dive into something specific from the training  -  Pixel chains, MCP patterns, API consumption from an existing script. Depth over breadth.'
                }
            ])}
            ${C.callout('The best apps come from real pain points. What do you or your team do today that\'s slow, repetitive, or requires searching through documents?', 'tip')}
        `
    },
    {
        id: "capstone-build-prompts",
        title: "Stuck? Start Here",
        content: `
            <h2>Stuck? Try one of these starting prompts for Claude Code:</h2>
            ${C.table(
                ['Use Case', 'Starter Prompt'],
                [
                    [
                        '<strong>Document Q&A</strong>',
                        '"Build a Q&A app that searches my vector engine and answers questions with source citations"'
                    ],
                    [
                        '<strong>Summarization tool</strong>',
                        '"Build an app that takes a document URL, fetches it, and returns a structured summary with key findings"'
                    ],
                    [
                        '<strong>Comparison tool</strong>',
                        '"Build an app that takes two topics, searches for each in my vector engine, and compares the guidance side by side"'
                    ],
                    [
                        '<strong>Status checker</strong>',
                        '"Build a form where I enter a product name and it returns all relevant regulatory guidance from my documents"'
                    ]
                ]
            )}
            ${C.callout('These are starting points  -  iterate from there. The goal is something you\'d use on Monday.', 'info')}
        `
    },
    {
        id: "capstone-build",
        title: "Build",
        content: `
            <h2>Build</h2>
            <p class="lead">You have 50 minutes. Presenters and helpers are circulating. Ask for help anytime.</p>
            ${C.callout('Publish your app before 2:45 PM if you want to show it.', 'info')}
        `
    },
    {
        id: "capstone-shareout",
        title: "Show & Tell  -  Optional",
        content: `
            <h2>Show & Tell  -  Optional</h2>
            <p>Anyone who wants to share: you have 60 seconds and one screen.</p>
            <ul>
                <li>Show what you built</li>
                <li>Say what problem it solves</li>
                <li>That's it  -  no polish required</li>
            </ul>
            ${C.callout('Completely optional. If you\'d rather keep building, keep building.', 'tip')}
        `
    }
];
