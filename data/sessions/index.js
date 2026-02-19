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
            label: 'Day 1 — Monday, Feb 24',
            slideIds: idsFrom(
                typeof slides_welcome !== 'undefined' ? slides_welcome : null,
                typeof slides_platform_fundamentals !== 'undefined' ? slides_platform_fundamentals : null,
                typeof slides_platform_engines !== 'undefined' ? slides_platform_engines : null,
                typeof slides_platform_pixel_reactors !== 'undefined' ? slides_platform_pixel_reactors : null,
            )
        },
        {
            id: '2',
            label: 'Day 2 — Tuesday, Feb 25',
            slideIds: idsFrom(
                typeof slides_custom_reactors !== 'undefined' ? slides_custom_reactors : null,
                typeof slides_custom_python !== 'undefined' ? slides_custom_python : null,
            )
        },
        {
            id: '3',
            label: 'Day 3 — Wednesday, Feb 26',
            slideIds: idsFrom(
                typeof slides_insight_room_session !== 'undefined' ? slides_insight_room_session : null,
                typeof slides_message_structure !== 'undefined' ? slides_message_structure : null,
                typeof slides_model_logs !== 'undefined' ? slides_model_logs : null,
                typeof slides_api_endpoints !== 'undefined' ? slides_api_endpoints : null,
            )
        },
        {
            id: '4',
            label: 'Day 4 — Thursday, Feb 27',
            slideIds: idsFrom(
                typeof slides_playground !== 'undefined' ? slides_playground : null,
                typeof slides_mcp_fundamentals !== 'undefined' ? slides_mcp_fundamentals : null,
                typeof slides_mcp_building_consuming !== 'undefined' ? slides_mcp_building_consuming : null,
                typeof slides_mcp_ui_premade !== 'undefined' ? slides_mcp_ui_premade : null,
            )
        },
        {
            id: '5',
            label: 'Day 5 — Friday, Feb 28',
            slideIds: idsFrom(
                typeof slides_docker !== 'undefined' ? slides_docker : null,
                typeof slides_security_auth !== 'undefined' ? slides_security_auth : null,
                typeof slides_admin !== 'undefined' ? slides_admin : null,
                typeof slides_capstone_project !== 'undefined' ? slides_capstone_project : null,
            )
        }
    ]
};

console.log('[DEBUG] Session plan initialized:', SESSION_PLAN.days.length, 'days');
