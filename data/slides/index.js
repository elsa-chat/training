// Slide library registry (topic-based)
const SLIDE_LIBRARY = [];
const SLIDES_BY_ID = {};

function registerSlideCollection(sourceLabel, slides) {
    if (!Array.isArray(slides)) return;
    slides.forEach(slide => {
        if (!slide || !slide.id) return;
        if (SLIDES_BY_ID[slide.id]) {
            console.warn('[WARN] Duplicate slide id detected:', slide.id, 'from', sourceLabel);
            return;
        }
        const normalized = {
            ...slide,
            duration: typeof slide.duration !== 'undefined' ? slide.duration : null,
            tags: Array.isArray(slide.tags) ? slide.tags : [],
            _source: sourceLabel
        };
        SLIDE_LIBRARY.push(normalized);
        SLIDES_BY_ID[normalized.id] = normalized;
    });
}

// Topic collections (loaded before this file)
registerSlideCollection('Welcome', typeof slides_welcome !== 'undefined' ? slides_welcome : null);
registerSlideCollection('Platform Fundamentals', typeof slides_platform_fundamentals !== 'undefined' ? slides_platform_fundamentals : null);
registerSlideCollection('Engines', typeof slides_platform_engines !== 'undefined' ? slides_platform_engines : null);
registerSlideCollection('Pixel & Reactors', typeof slides_platform_pixel_reactors !== 'undefined' ? slides_platform_pixel_reactors : null);

registerSlideCollection('App Fundamentals', typeof slides_app_fundamentals !== 'undefined' ? slides_app_fundamentals : null);
registerSlideCollection('Python', typeof slides_base_python !== 'undefined' ? slides_base_python : null);
registerSlideCollection('Pro-Code Apps', typeof slides_apps_pro_code !== 'undefined' ? slides_apps_pro_code : null);
registerSlideCollection('Custom Reactors', typeof slides_custom_reactors !== 'undefined' ? slides_custom_reactors : null);
registerSlideCollection('Vibe Coding', typeof slides_vibe_coding !== 'undefined' ? slides_vibe_coding : null);
registerSlideCollection('Day 2 Opener', typeof slides_day2_opener !== 'undefined' ? slides_day2_opener : null);
registerSlideCollection('Python SDK', typeof slides_python_sdk !== 'undefined' ? slides_python_sdk : null);
registerSlideCollection('Day 1 Activity', typeof slides_day1_activity !== 'undefined' ? slides_day1_activity : null);

registerSlideCollection('Agent47', typeof slides_agent47 !== 'undefined' ? slides_agent47 : null);
registerSlideCollection('Insight Room Session', typeof slides_insight_room_session !== 'undefined' ? slides_insight_room_session : null);
registerSlideCollection('Context Engineering', typeof slides_context_engineering !== 'undefined' ? slides_context_engineering : null);
registerSlideCollection('Message Structure', typeof slides_message_structure !== 'undefined' ? slides_message_structure : null);
registerSlideCollection('Model Logs', typeof slides_model_logs !== 'undefined' ? slides_model_logs : null);
registerSlideCollection('API Endpoints', typeof slides_api_endpoints !== 'undefined' ? slides_api_endpoints : null);

registerSlideCollection('Playground', typeof slides_playground !== 'undefined' ? slides_playground : null);
registerSlideCollection('Agents', typeof slides_agents !== 'undefined' ? slides_agents : null);
registerSlideCollection('MCP Fundamentals', typeof slides_mcp_fundamentals !== 'undefined' ? slides_mcp_fundamentals : null);
registerSlideCollection('MCP in Action', typeof slides_mcp_in_action !== 'undefined' ? slides_mcp_in_action : null);
registerSlideCollection('MCP Building & Consuming', typeof slides_mcp_building_consuming !== 'undefined' ? slides_mcp_building_consuming : null);
registerSlideCollection('MCP UI & Premade', typeof slides_mcp_ui_premade !== 'undefined' ? slides_mcp_ui_premade : null);

registerSlideCollection('Docker', typeof slides_docker !== 'undefined' ? slides_docker : null);
registerSlideCollection('Admin', typeof slides_admin !== 'undefined' ? slides_admin : null);

registerSlideCollection('Appendix', typeof slides_appendix !== 'undefined' ? slides_appendix : null);

console.log('[DEBUG] Slide library initialized:', SLIDE_LIBRARY.length, 'slides');
