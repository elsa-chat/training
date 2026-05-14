// Session plan  -  2-day ELSA training (10 AM – 3 PM each day)
function idsFrom(...groups) {
    const ids = [];
    groups.forEach(slides => {
        if (!Array.isArray(slides)) return;
        slides.forEach(slide => {
            if (slide && slide.id) ids.push(slide.id);
        });
    });
    return ids;
}

const SESSION_PLAN = {
    days: [
        // ─────────────────────────────────────────────────────────────────────
        // DAY 1  -  Wednesday, May 13  |  10:00 AM – 3:00 PM
        // ─────────────────────────────────────────────────────────────────────
        {
            id: '1',
            label: 'Day 1  -  Wed, May 13',
            chapters: [
                {
                    title: 'Welcome & Introduction',
                    time: '10:00 – 10:30 AM',
                    slideIds: idsFrom(
                        typeof slides_welcome !== 'undefined' ? slides_welcome : null,
                    ).filter(id => id !== 'elsa-demo-divider')
                },
                {
                    title: `${CONFIG.productName} 4.0 Demo`,
                    time: '10:30 AM',
                    slideIds: ['elsa-demo-divider']
                },
                {
                    title: 'Platform Fundamentals',
                    time: '10:30 – 11:15 AM',
                    slideIds: idsFrom(
                        typeof slides_platform_fundamentals !== 'undefined' ? slides_platform_fundamentals : null,
                    )
                },
                {
                    title: ' -  BREAK  - ',
                    time: '11:15 – 11:30 AM',
                    slideIds: []
                },
                {
                    title: 'Engines  -  The Data Layer',
                    time: '11:30 AM – 12:15 PM',
                    slideIds: idsFrom(
                        typeof slides_platform_engines !== 'undefined' ? slides_platform_engines : null,
                    )
                },
                {
                    title: ' -  LUNCH  - ',
                    time: '12:15 – 1:00 PM',
                    slideIds: []
                },
                {
                    title: 'App Fundamentals',
                    time: '1:00 – 1:30 PM',
                    slideIds: idsFrom(
                        typeof slides_app_fundamentals !== 'undefined' ? slides_app_fundamentals : null,
                    )
                },
                {
                    title: 'Pixel & Reactors',
                    time: '1:30 – 2:10 PM',
                    slideIds: idsFrom(
                        typeof slides_platform_pixel_reactors !== 'undefined' ? slides_platform_pixel_reactors : null,
                    )
                },
                {
                    title: 'Vibe Coding  -  Build Your First App',
                    time: '2:10 – 2:55 PM',
                    slideIds: idsFrom(
                        typeof slides_vibe_coding !== 'undefined' ? slides_vibe_coding : null,
                    )
                },
                {
                    title: 'Day 1 Wrap-up',
                    time: '2:55 – 3:00 PM',
                    slideIds: []
                },
            ]
        },

        // ─────────────────────────────────────────────────────────────────────
        // DAY 2  -  Thursday, May 14  |  10:00 AM – 3:00 PM
        // ─────────────────────────────────────────────────────────────────────
        {
            id: '2',
            label: 'Day 2  -  Thu, May 14',
            chapters: [
                {
                    title: 'Day 2 Logistics',
                    time: '10:00 AM',
                    slideIds: ['d2-logistics']
                },
                {
                    title: 'Finish Up & Deploy',
                    time: '10:00 – 10:30 AM',
                    slideIds: idsFrom(
                        typeof slides_day2_opener !== 'undefined' ? slides_day2_opener : null,
                    )
                },
                {
                    title: `${CONFIG.aiName} Deep Dive`,
                    time: '10:30 – 11:00 AM',
                    slideIds: [
                        'playground-title',
                        'playground-what-is',
                        'playground-what-is-room',
                        'room-message-json',
                        'playground-room-utilities',
                        'playground-ui-tabs',
                        'appendix-files-overview',
                        'appendix-rooms-history',
                    ]
                },
                {
                    title: '— BREAK —',
                    time: '11:00 – 11:15 AM',
                    slideIds: []
                },
                {
                    title: 'MCP Fundamentals',
                    time: '11:15 AM – 12:00 PM',
                    slideIds: [
                        'mcp-title',
                        'mcp-what-is',
                        'mcp-why-matters',
                        'mcp-architecture',
                        'mcp-contract',
                        'mcp-human-in-the-loop',
                    ]
                },
                {
                    title: '— LUNCH —',
                    time: '12:00 – 1:00 PM',
                    slideIds: []
                },
                {
                    title: 'MCP in Action',
                    time: '11:15 AM – 12:00 PM',
                    slideIds: [
                        'mcp-in-action-title',
                        'mcp-in-action-overview',
                        'mcp-sample-app',
                        'mcp-convert-agent',
                        'mcp-generated-json',
                        'mcp-playground-wire',
                    ]
                },
                {
                    title: `Agents in ${CONFIG.aiName}`,
                    time: '2:00 – 2:30 PM',
                    slideIds: [
                        'agents-title',
                        'agents-what-is',
                        'playground-architecture',
                        'playground-agent-config',
                        'agents-compose',
                        'agents-handson',
                        'agents-share',
                    ]
                },
                {
                    title: 'External API Calls',
                    time: '2:30 – 3:00 PM',
                    slideIds: [
                        'api-title',
                        'api-consumption-patterns',
                        'api-curl-postman',
                        'api-openai-example',
                        'api-pypi-sdk',
                        'api-token-limits',
                    ]
                },
                {
                    title: 'Agent 47  —  What\'s Next',
                    time: '3:00 – 3:15 PM',
                    slideIds: idsFrom(
                        typeof slides_agent47 !== 'undefined' ? slides_agent47 : null,
                    )
                },
                {
                    title: 'Day 2 Wrap-up',
                    time: '3:15 – 3:20 PM',
                    slideIds: []
                },
            ]
        },

        // ─────────────────────────────────────────────────────────────────────
        // APPENDIX  -  Reference material & content not covered in main sessions
        // ─────────────────────────────────────────────────────────────────────
        {
            id: '3',
            label: 'Appendix',
            chapters: [
                {
                    title: 'Reference & Troubleshooting',
                    slideIds: idsFrom(
                        typeof slides_appendix !== 'undefined' ? slides_appendix : null,
                    )
                },
                {
                    title: 'Python SDK',
                    slideIds: idsFrom(typeof slides_python_sdk !== 'undefined' ? slides_python_sdk : null)
                },
                {
                    title: 'MCP Building & Consuming (deep-dive)',
                    slideIds: idsFrom(typeof slides_mcp_building_consuming !== 'undefined' ? slides_mcp_building_consuming : null)
                },
                {
                    title: 'MCP UI & Premade Tools',
                    slideIds: idsFrom(typeof slides_mcp_ui_premade !== 'undefined' ? slides_mcp_ui_premade : null)
                },
                {
                    title: 'Context Engineering for Agents',
                    slideIds: idsFrom(typeof slides_context_engineering !== 'undefined' ? slides_context_engineering : null)
                },
                {
                    title: 'Model Logs',
                    slideIds: idsFrom(typeof slides_model_logs !== 'undefined' ? slides_model_logs : null)
                },
            ]
        },
    ]
};

console.log('[DEBUG] Session plan initialized:', SESSION_PLAN.days.length, 'days');
