// Session plan (explicit day mapping)
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
        {
            id: '1',
            label: 'Day 1 — Monday, Feb 23',
            chapters: [
                {
                    title: 'Welcome & Introduction',
                    slideIds: idsFrom(
                        typeof slides_welcome !== 'undefined' ? slides_welcome : null,
                    )
                },
                {
                    title: 'Platform Fundamentals',
                    slideIds: idsFrom(
                        typeof slides_platform_fundamentals !== 'undefined' ? slides_platform_fundamentals : null,
                    )
                },
                {
                    title: 'Engines - The Resource Layer',
                    slideIds: idsFrom(
                        typeof slides_platform_engines !== 'undefined' ? slides_platform_engines : null,
                    )
                },
                {
                    title: 'Pixel & Reactors',
                    slideIds: idsFrom(
                        typeof slides_platform_pixel_reactors !== 'undefined' ? slides_platform_pixel_reactors : null,
                    )
                },
                {
                    title: 'App Fundamentals',
                    slideIds: idsFrom(
                        typeof slides_app_fundamentals !== 'undefined' ? slides_app_fundamentals : null,
                    )
                },
                {
                    title: 'Python in SEMOSS',
                    slideIds: idsFrom(
                        typeof slides_base_python !== 'undefined' ? slides_base_python : null,
                    )
                },
                {
                    title: 'Pro-Code App Development',
                    slideIds: idsFrom(
                        typeof slides_apps_pro_code !== 'undefined' ? slides_apps_pro_code : null,
                    )
                },
                {
                    title: 'Custom Reactor Development',
                    slideIds: idsFrom(
                        typeof slides_custom_reactors !== 'undefined' ? slides_custom_reactors : null,
                    )
                },
                {
                    title: 'Python SDK',
                    slideIds: idsFrom(
                        typeof slides_python_sdk !== 'undefined' ? slides_python_sdk : null,
                    )
                },
                {
                    title: 'Day 1 Activity — Pro-Code App Build',
                    slideIds: idsFrom(
                        typeof slides_day1_activity !== 'undefined' ? slides_day1_activity : null,
                    )
                }
            ]
        },
        {
            id: '2',
            label: 'Day 2 — Tuesday, Feb 24',
            chapters: [
                {
                    title: 'Playground Deep Dive',
                    slideIds: idsFrom(
                        typeof slides_playground !== 'undefined' ? slides_playground : null,
                    )
                },
                {
                    title: 'MCP Fundamentals',
                    slideIds: idsFrom(
                        typeof slides_mcp_fundamentals !== 'undefined' ? slides_mcp_fundamentals : null,
                    )
                },
                {
                    title: 'MCP Building & Consuming',
                    slideIds: idsFrom(
                        typeof slides_mcp_building_consuming !== 'undefined' ? slides_mcp_building_consuming : null,
                    )
                },
                {
                    title: 'MCP UI & Pre-made MCPs',
                    slideIds: idsFrom(
                        typeof slides_mcp_ui_premade !== 'undefined' ? slides_mcp_ui_premade : null,
                    )
                },
                {
                    title: 'Insight, Room & Session Architecture',
                    slideIds: idsFrom(
                        typeof slides_insight_room_session !== 'undefined' ? slides_insight_room_session : null,
                    )
                },
                {
                    title: 'Context Engineering for Agents',
                    slideIds: idsFrom(
                        typeof slides_context_engineering !== 'undefined' ? slides_context_engineering : null,
                    )
                },
                {
                    title: 'Message Structure & Multimodal',
                    slideIds: idsFrom(
                        typeof slides_message_structure !== 'undefined' ? slides_message_structure : null,
                    )
                },
                {
                    title: 'API Endpoints',
                    slideIds: idsFrom(
                        typeof slides_api_endpoints !== 'undefined' ? slides_api_endpoints : null,
                    )
                },
                {
                    title: 'Model Logs',
                    slideIds: idsFrom(
                        typeof slides_model_logs !== 'undefined' ? slides_model_logs : null,
                    )
                }
            ]
        },
        {
            id: '3',
            label: 'Day 3 — Wednesday, Feb 25',
            chapters: [
                {
                    title: 'Security, RBAC & Guardrails',
                    slideIds: idsFrom(
                        typeof slides_security_auth !== 'undefined' ? slides_security_auth : null,
                    )
                },
                {
                    title: 'Infrastructure & Deployment',
                    slideIds: idsFrom(
                        typeof slides_docker !== 'undefined' ? slides_docker : null,
                    )
                },
                {
                    title: 'Admin & Production Best Practices',
                    slideIds: idsFrom(
                        typeof slides_admin !== 'undefined' ? slides_admin : null,
                    )
                }
            ]
        }
    ]
};

console.log('[DEBUG] Session plan initialized:', SESSION_PLAN.days.length, 'days');
