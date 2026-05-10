// Session plan — 2-day ELSA training (10 AM – 3 PM each day)
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
        // DAY 1 — Wednesday, May 13  |  10:00 AM – 3:00 PM
        // ─────────────────────────────────────────────────────────────────────
        {
            id: '1',
            label: 'Day 1 — Wed, May 13',
            chapters: [
                {
                    title: 'Welcome & Introduction',
                    time: '10:00 – 10:30 AM',
                    slideIds: idsFrom(
                        typeof slides_welcome !== 'undefined' ? slides_welcome : null,
                    )
                },
                {
                    title: 'Platform Fundamentals',
                    time: '10:30 – 11:15 AM',
                    slideIds: idsFrom(
                        typeof slides_platform_fundamentals !== 'undefined' ? slides_platform_fundamentals : null,
                    )
                },
                {
                    title: '— BREAK —',
                    time: '11:15 – 11:30 AM',
                    slideIds: []
                },
                {
                    title: 'Engines — The Data Layer',
                    time: '11:30 AM – 12:15 PM',
                    slideIds: idsFrom(
                        typeof slides_platform_engines !== 'undefined' ? slides_platform_engines : null,
                    )
                },
                {
                    title: '— LUNCH —',
                    time: '12:15 – 1:00 PM',
                    slideIds: []
                },
                {
                    title: 'Pixel & Reactors',
                    time: '1:00 – 1:40 PM',
                    slideIds: idsFrom(
                        typeof slides_platform_pixel_reactors !== 'undefined' ? slides_platform_pixel_reactors : null,
                    )
                },
                {
                    title: 'App Fundamentals',
                    time: '1:40 – 2:10 PM',
                    slideIds: idsFrom(
                        typeof slides_app_fundamentals !== 'undefined' ? slides_app_fundamentals : null,
                    )
                },
                {
                    title: 'Vibe Coding — Build Your First App',
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
        // DAY 2 — Thursday, May 14  |  10:00 AM – 3:00 PM
        // ─────────────────────────────────────────────────────────────────────
        {
            id: '2',
            label: 'Day 2 — Thu, May 14',
            chapters: [
                {
                    title: 'MCP Fundamentals',
                    time: '10:00 – 10:45 AM',
                    slideIds: idsFrom(
                        typeof slides_mcp_fundamentals !== 'undefined' ? slides_mcp_fundamentals : null,
                    )
                },
                {
                    title: 'Playground Deep Dive',
                    time: '10:45 – 11:30 AM',
                    slideIds: idsFrom(
                        typeof slides_playground !== 'undefined' ? slides_playground : null,
                    )
                },
                {
                    title: '— BREAK —',
                    time: '11:30 – 11:45 AM',
                    slideIds: []
                },
                {
                    title: '— LUNCH —',
                    time: '11:45 AM – 12:30 PM',
                    slideIds: []
                },
                {
                    title: 'API Endpoints',
                    time: '12:30 – 1:00 PM',
                    slideIds: idsFrom(
                        typeof slides_api_endpoints !== 'undefined' ? slides_api_endpoints : null,
                    )
                },
                {
                    title: 'Security & RBAC',
                    time: '1:00 – 1:30 PM',
                    slideIds: idsFrom(
                        typeof slides_security_auth !== 'undefined' ? slides_security_auth : null,
                    )
                },
                {
                    title: 'Capstone: End-to-End App Build',
                    time: '1:30 – 2:45 PM',
                    slideIds: idsFrom(
                        typeof slides_capstone_project !== 'undefined' ? slides_capstone_project : null,
                    )
                },
                {
                    title: 'Wrap-up, Q&A & Feedback',
                    time: '2:45 – 3:00 PM',
                    slideIds: []
                },
            ]
        },

        // ─────────────────────────────────────────────────────────────────────
        // BACKUP / OPTIONAL — Pull in if either day runs ahead of schedule
        // ─────────────────────────────────────────────────────────────────────
        {
            id: '3',
            label: 'Backup / Optional Sections',
            chapters: [
                {
                    title: 'Python SDK (30 min) — best after App Fundamentals, Day 1',
                    slideIds: idsFrom(
                        typeof slides_python_sdk !== 'undefined' ? slides_python_sdk : null,
                    )
                },
                {
                    title: 'MCP Building & Consuming (Day 2 deep-dive)',
                    slideIds: idsFrom(
                        typeof slides_mcp_building_consuming !== 'undefined' ? slides_mcp_building_consuming : null,
                    )
                },
                {
                    title: 'Context Engineering for Agents (Day 2)',
                    slideIds: idsFrom(
                        typeof slides_context_engineering !== 'undefined' ? slides_context_engineering : null,
                    )
                },
                {
                    title: 'Model Logs (15 min) — fold into Engines or Security',
                    slideIds: idsFrom(
                        typeof slides_model_logs !== 'undefined' ? slides_model_logs : null,
                    )
                },
                {
                    title: 'MCP UI & Premade Tools',
                    slideIds: idsFrom(
                        typeof slides_mcp_ui_premade !== 'undefined' ? slides_mcp_ui_premade : null,
                    )
                },
            ]
        }
    ]
};

console.log('[DEBUG] Session plan initialized:', SESSION_PLAN.days.length, 'days');
