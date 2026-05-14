// Topic: Day 2 Opener  —  Finish Up & Deploy
const slides_day2_opener = [

    {
        id: "d2-logistics",
        title: "Day 2 Logistics",
        content: `
            <h2>Day 2 Logistics — Thu, May 14</h2>
            ${C.table(
                ['Time', 'Topic'],
                [
                    ['10:00 – 10:45', 'Finish Up & Deploy'],
                    ['10:45 – 11:00', 'Elsa Chat Deep Dive'],
                    ['11:00 – 11:15', 'MCP Fundamentals'],
                    ['11:15 – 12:00', 'MCP in Action'],
                    ['12:00 – 12:30', 'Converting Your App into an MCP'],
                    ['12:30 – 1:30',  '🍽 Lunch'],
                    ['1:30 – 2:00',   'Agents'],
                    ['2:00 – 2:15',   'External API Calls'],
                    ['2:15 – 2:30',   '☕ Break'],
                    ['2:30 – 3:00',   'Agent 47'],
                ]
            )}
            ${C.callout(`Your apps, engines, and access keys from Day 1 are all still there — pick up exactly where you left off.`, 'info')}
        `
    },

    {
        id: "d2-deploy-hardcoded",
        title: "Still Building? Use Yesterday's Prompt",
        content: `
            <h2>Still Building? Pick Up With the Same Prompt</h2>
            <p>If your app isn't fully working yet, use the prompt below to get back on track — it's the same one from yesterday's demo. Swap in your own vector engine ID and iterate from there.</p>
            ${C.code(`Build an app to visualize vector database search results from ELSA.

The user enters a search term, hits Run, and sees the results displayed as clean cards.
Each card should show:
- Source document name
- Page range (from the "Divider" field)
- Relevance score
- The full content passage

Make the vector engine ID and result limit configurable at the top of the file so it's easy to swap in a different engine.

The app calls this Pixel to get results:

VectorDatabaseQuery(engine=["<YOUR-VECTOR-ENGINE-ID>"], command="<search term>", limit=5, filters=[], metaFilters=[]);

Here is one example result to build against:

{
  "Score": 1.7820971012115479,
  "idx": 6,
  "Source": "ai_use.pdf",
  "Modality": "text",
  "Divider": "7, 8",
  "Part": "0",
  "Tokens": 512,
  "Content": "Agencies must remove barriers to innovation and provide the best value for the taxpayer."
}

The results come back inside pixelReturn[0].output as an array. Parse that array and render one card per result. Show a loading state while the query runs and an empty state if no results come back.`, 'text', 'Yesterday\'s Prompt — reuse as-is')}
            ${C.callout('Goal for this session: get your app published with a live URL. It doesn\'t have to be perfect — working and deployed beats polished and local.', 'tip')}
        `
    },

    {
        id: "d2-finish-app",
        title: "Finish & Deploy Your App",
        content: `
            <h2>Finish and Deploy Your App</h2>
            ${C.handson("Finish & Deploy", `
                <p>Open Claude Code in your project folder and pick up where you left off.</p>
                <h4>Resume your session:</h4>
                ${C.code(`/resume`, 'text', 'In Claude Code — opens a list of past conversations to select from')}
                <p>This lets you pick your conversation from yesterday — you still need to select it from the list. Once selected, Claude Code has full context of what you built.</p>

                <h4>Minimum to hit before we move on:</h4>
                <ul>
                    <li>App opens without JS errors</li>
                    <li>Vector search returns results for at least one query</li>
                    <li>Results display in a readable layout</li>
                </ul>

                <h4>Verify deployment:</h4>
                <p>Your app is already deployed — click the link ${CONFIG.productName} generated for your app and confirm it loads and runs correctly.</p>
                ${C.callout('Stuck? Ask Claude Code to explain what it built, then describe the problem. Let it iterate.', 'tip')}
            `)}
        `
    },

    {
        id: "d2-build-mortgage",
        title: "Option: Build the Mortgage Calculator",
        content: `
            <h2>Build the Mortgage Calculator (we will MCP-enable it after lunch)</h2>
            <p>If you would rather follow along with the same app the presenter is using later today, paste this prompt into Claude Code. You will build a frontend-only mortgage calculator now — and in <strong>MCP in Action</strong> after lunch, you will convert that exact app into a callable agent tool.</p>

            ${C.code(`Edit two files only: client/src/pages/HomePage.tsx and py/mcp_driver.py. Do not read or modify any other file. Skip the Startup Checklist.

=== FILE 1: client/src/pages/HomePage.tsx ===
Build a Mortgage Calculator UI.

Inputs (one row at the top):
- Home Price ($) — number input, default 500000
- Down Payment (%) — slider 0 to 50, default 20
- Interest Rate (%) — number input with step 0.05, default 7.0
- Term (years) — select with options 15, 20, 30, default 30

Outputs below the inputs:
- Big monthly payment number (text-5xl, formatted as $X,XXX)
- Three stat cards side by side: Principal, Total Interest, Total Paid
- Amortization bar chart: one row per year, each row shows the year label on the left, a horizontal bar split into principal (filled) and interest (faded), and the ending balance on the right

Recompute live on every input change using the standard amortization formula:
  M = P * (r(1+r)^n) / ((1+r)^n - 1)
where P = principal, r = monthly rate, n = total payments.

Tailwind, clean and modern. Hardcoded math, no API calls, no useInsight.

=== FILE 2: py/mcp_driver.py ===
Replace the contents with one function: calculate_mortgage(home_price, down_payment_pct, annual_rate_pct, years). It does the same math as the UI and we will turn it into an MCP tool after lunch.

Requirements:
- Decorate with @mcp_metadata from smssutil. Include: execution "auto", displayLocation "inline", loadingMessage "Calculating mortgage...", resourceURI "/".
- Type hints on all args. Defaults: down_payment_pct=20.0, annual_rate_pct=7.0, years=30.
- Write a docstring that tells the agent when to use it — something like "Use this whenever a user asks about home affordability, monthly payments, or wants to compare loan scenarios. The math is annoying to do in your head — always call this tool for accurate numbers." Document each arg.
- Compute principal, monthly payment (standard amortization formula above), total interest, total paid, total number of payments.
- Return json.dumps of a dict with: home_price, down_payment_pct, annual_rate_pct, years, principal, monthly_payment, total_interest, total_paid, n_payments. Round dollar amounts to 2 decimals.

Look at any existing Python tool already in py/mcp_driver.py for the import + decorator pattern.`, 'text', 'Claude Code Prompt — builds both UI and Python tool')}

            <p>Once it renders locally, push it up to ${CONFIG.productName} the same way as your Day 1 app and share a screenshot in the chat.</p>

            ${C.callout('You will return to this app in the <strong>MCP in Action</strong> section after lunch. Same UI — but you will add a Python function, run <code>MakePythonMCP</code>, and the agent will be able to call it from Playground.', 'tip')}
        `
    },

];
