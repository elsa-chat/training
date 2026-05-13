// Topic: Appendix  -  Reference & Troubleshooting
const slides_appendix = [
    {
        id: "appendix-title",
        title: "Appendix",
        content: C.titleSlide(
            "Appendix",
            "Reference Topics & Troubleshooting",
            "Parking Lot Questions · Dev Tips"
        )
    },

    // ─── Dev Troubleshooting ─────────────────────────────────────────────────

    {
        id: "appendix-dev-troubleshooting",
        title: "Developer Troubleshooting",
        content: `
            <h2>Developer Troubleshooting</h2>
            <p class="lead">The most common fixes when something looks broken in VS Code or the platform.</p>
            ${C.cards([
                {
                    badge: '#1 Fix',
                    title: 'VS Code: Reload Window',
                    desc: '<kbd>Cmd+Shift+P</kbd> → <strong>Developer: Reload Window</strong>  -  restarts the VS Code renderer process. Fixes stuck extensions, broken IntelliSense, and unresponsive panels without closing your workspace.'
                },
                {
                    badge: '#2 Fix',
                    title: 'Browser: Hard Refresh',
                    desc: '<kbd>Cmd+Shift+R</kbd> (Mac) or <kbd>Ctrl+Shift+R</kbd> (Windows)  -  bypasses the browser cache and re-fetches all assets. Use when you\'ve deployed new code and still see the old UI.'
                },
                {
                    badge: '#3 Fix',
                    title: 'Check the Console',
                    desc: 'Open DevTools → Console tab. Red errors usually pinpoint the broken component. Network tab shows failed API calls with their status codes and response bodies.'
                },
                {
                    badge: '#4 Fix',
                    title: 'Re-run the Pixel',
                    desc: 'If an app cell is stuck or shows stale data, re-execute the Pixel block. Insight state can get out of sync if a previous execution partially failed.'
                }
            ])}
            ${C.callout('VS Code acting up? Always try <strong>Developer: Reload Window</strong> first  -  it restarts the editor without closing any files or losing your workspace state.', 'tip')}
        `
    },

    {
        id: "appendix-dev-reload-window",
        title: "VS Code: Developer: Reload Window",
        content: `
            <h2>VS Code: Developer: Reload Window</h2>
            <p class="lead">Restarts the VS Code renderer process in place  -  all your open files and workspace state are preserved.</p>
            ${C.split(
                {
                    title: 'When to Use It',
                    content: `
                        <ul>
                            <li>Extensions stopped responding or showing errors</li>
                            <li>IntelliSense / autocomplete broken or stale</li>
                            <li>Terminal or panel stuck / not rendering</li>
                            <li>Git decorations not updating</li>
                            <li>After installing or updating an extension</li>
                            <li>Any "just acting weird" situation</li>
                        </ul>
                    `
                },
                {
                    title: 'What It Preserves',
                    content: `
                        <ul>
                            <li>All open editor tabs and unsaved changes</li>
                            <li>Workspace folder and settings</li>
                            <li>Running terminal sessions</li>
                            <li>Breakpoints and debug configuration</li>
                            <li>Extension state (reloads cleanly)</li>
                        </ul>
                    `
                }
            )}
            ${C.flow([
                { title: 'Open the Command Palette', desc: '<kbd>Cmd+Shift+P</kbd> (Mac) · <kbd>Ctrl+Shift+P</kbd> (Windows/Linux)' },
                { title: 'Type "Reload Window"', desc: 'Select <strong>Developer: Reload Window</strong> from the list' },
                { title: 'VS Code restarts the renderer', desc: 'Takes 2–5 seconds. All files reopen exactly where you left them.' }
            ])}
            ${C.callout('This is different from closing and reopening VS Code. Reload Window is faster and does not terminate your terminal processes.', 'info')}
        `
    }
];
