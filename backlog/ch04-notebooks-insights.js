// Day 4, Chapter 4: Notebooks & Insights (75 min)
const day4_ch04 = {
    title: "Notebooks & Insights",
    slides: [
        {
            id: "d4-notebooks-insights-title",
            title: "Notebooks & Insights",
            content: C.titleSlide(
                "Notebooks & Insights",
                "Orchestrating data workflows and managing execution contexts in ${CONFIG.productName} apps",
                "75 minutes"
            )
        },
        {
            id: "d4-notebooks-what-are",
            title: "What are Notebooks?",
            content: `
                <h2>What are Notebooks in ${CONFIG.productName}?</h2>
                <p class="lead">A <span class="highlight">Notebook</span> is a named sequence of Cells that execute in order to process data, call APIs, or orchestrate workflows.</p>
                <p>Notebooks are the <strong>data pipeline layer</strong> in ${CONFIG.productName} apps — they sit between user interactions (Blocks) and backend execution (Insights).</p>
                ${C.cards([
                    { badge: 'Purpose', title: 'Orchestration', desc: 'Define multi-step data processing pipelines with clear execution order' },
                    { badge: 'Purpose', title: 'Reusability', desc: 'Save and reuse workflows across apps and insights' },
                    { badge: 'Purpose', title: 'Debugging', desc: 'Run cells individually to isolate issues, view intermediate results' },
                    { badge: 'Purpose', title: 'Collaboration', desc: 'Share notebooks as templates for common tasks (ETL, reporting, ML)' }
                ])}
                ${C.split(
                    {
                        title: 'UI Component',
                        content: `
                            <p>Notebooks appear in the <strong>Notebooks</strong> panel in the App Designer:</p>
                            <ul>
                                <li>Drag-and-drop cells to reorder</li>
                                <li>Run individual cells or "Run All"</li>
                                <li>View cell outputs inline</li>
                                <li>Add/remove/duplicate cells</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Execution Model',
                        content: `
                            <p>When triggered (by block action or manually):</p>
                            <ul>
                                <li>Cells execute sequentially (top to bottom)</li>
                                <li>Each cell's <code>toPixel()</code> generates Pixel code</li>
                                <li>Pixel sent to backend Insight for execution</li>
                                <li>Results stored in StateStore variables</li>
                            </ul>
                        `
                    }
                )}
            `
        },
        {
            id: "d4-notebooks-structure",
            title: "Notebook Structure",
            content: `
                <h2>Notebook Structure</h2>
                <p>A Notebook is a JSON object stored in the StateStore with metadata and a list of cell IDs.</p>
                ${C.code(`{
    "id": "search-notebook",
    "name": "Product Search Logic",
    "description": "Queries database, filters results, calculates stats",
    "list": [
        "cell-1-import-data",
        "cell-2-filter-by-region",
        "cell-3-calculate-totals",
        "cell-4-generate-chart"
    ],
    "isLoading": false,
    "variables": {
        "searchTerm": "laptop",
        "region": "West",
        "resultsFrame": "filtered_products"
    }
}`, 'json', 'Notebook data structure')}
                ${C.flow([
                    { title: 'User Triggers Notebook', desc: 'Block action: RunCell or "Run All" button', accent: true },
                    { title: 'Iterate Over list[]', desc: 'For each cellId in order', arrow: '↓' },
                    { title: 'Resolve Cell Config', desc: 'state.getCell(cellId) → CellConfig', arrow: '↓' },
                    { title: 'Call toPixel()', desc: 'cell.toPixel(params) → Pixel string', arrow: '↓' },
                    { title: 'Execute on Insight', desc: 'POST /api/engine/runPixel', arrow: '↓' },
                    { title: 'Update StateStore', desc: 'Store results in variables', arrow: '↓' },
                    { title: 'Next Cell or Finish', desc: 'Repeat until all cells complete', accent: true }
                ])}
                ${C.callout('Notebooks stop execution on error by default. Use <code>blockOnError: false</code> in block event actions to continue despite errors.', 'warning')}
            `
        },
        {
            id: "d4-notebooks-interaction",
            title: "Notebook Interaction",
            content: `
                <h2>Notebook Interaction — UI Features</h2>
                <p>The Notebook UI component (React) provides developer tools for building and testing workflows.</p>
                ${C.table(
                    ['Feature', 'Purpose', 'How It Works'],
                    [
                        [
                            '<strong>Run All Button</strong>',
                            'Execute entire notebook',
                            'Dispatches <code>ActionMessages.RUN_QUERY</code> with <code>queryId</code>'
                        ],
                        [
                            '<strong>Run Cell (Play Icon)</strong>',
                            'Execute single cell',
                            'Dispatches <code>ActionMessages.RUN_CELL</code> with <code>cellId</code>'
                        ],
                        [
                            '<strong>Drag & Drop</strong>',
                            'Reorder cells',
                            'Uses @dnd-kit, dispatches <code>MOVE_CELL</code> with active/over IDs'
                        ],
                        [
                            '<strong>Add Cell Button</strong>',
                            'Insert new cell',
                            'Opens cell type selector, dispatches <code>ADD_CELL</code>'
                        ],
                        [
                            '<strong>Delete Cell</strong>',
                            'Remove cell',
                            'Dispatches <code>DELETE_CELL</code> with <code>cellId</code>'
                        ],
                        [
                            '<strong>Cell Console</strong>',
                            'View outputs',
                            'Displays PixelRunner results (Success, Error, Warning, Frame)'
                        ],
                        [
                            '<strong>Variables Panel</strong>',
                            'Inspect state',
                            'Shows current StateStore values, types, and previews'
                        ]
                    ]
                )}
                ${C.code(`// Example: Triggering notebook execution from a block
{
    "widget": "button",
    "data": { "label": "Search" },
    "listeners": {
        "onClick": {
            "type": "sync",
            "order": [
                {
                    "action": "RunCell",          // Can run individual cell
                    "cellId": "import-data"
                },
                {
                    "action": "RunQuery",         // Or run entire notebook
                    "queryId": "search-notebook"
                }
            ]
        }
    }
}`, 'json', 'Block triggering notebook execution')}
            `
        },
        {
            id: "d4-insights-what-are",
            title: "What are Insights?",
            content: `
                <h2>What are Insights?</h2>
                <p class="lead">An <span class="highlight">Insight</span> is the backend execution context where Pixel code runs — it holds variables, frames, R/Python environments, and execution history.</p>
                <p>Every ${CONFIG.productName} app session is backed by an Insight. When you open an app, ${CONFIG.productName} creates or retrieves an Insight identified by a unique <code>insightId</code> (UUID).</p>
                ${C.layers([
                    { label: "Frontend", items: [
                        { title: "Blocks + Cells", desc: "User interface + data logic" }
                    ]},
                    { label: "State Management", accent: true, items: [
                        { title: "StateStore", desc: "Frontend state (variables, blocks, cells)", accent: true },
                        { title: "InsightStore", desc: "Backend map: insightId → Insight", accent: true }
                    ]},
                    { label: "Execution Context (Insight)", items: [
                        { title: "VarStore", desc: "Backend variables (frames, params, dynamic vars)" },
                        { title: "PixelRunner", desc: "Executes Pixel commands" },
                        { title: "PyTranslator / RJavaTranslator", desc: "Python/R environments" }
                    ]},
                    { label: "Data Layer", items: [
                        { title: "Engines", desc: "Databases, models, vector stores, storage" }
                    ]}
                ])}
                ${C.callout('<strong>Key distinction:</strong> StateStore (frontend) holds UI state. Insight VarStore (backend) holds execution state. They sync via API calls but are separate.', 'info')}
            `
        },
        {
            id: "d4-insights-anatomy",
            title: "Insight Anatomy",
            content: `
                <h2>Anatomy of an Insight</h2>
                <p>The <code>Insight</code> class (prerna.om.Insight) is the central execution context for all ${CONFIG.productName} operations.</p>
                ${C.code(`public class Insight implements Serializable {
    // Core identification
    protected String insightId;           // UUID identifier
    protected User user;                  // Authenticated user
    protected String projectId;           // Associated app/project
    protected String roomId;              // Associated Room (if any)

    // State management
    private VarStore varStore;            // Variable storage
    private PixelList pixelList;          // Execution history (500 pixels)
    private TaskStore taskStore;          // Async task tracking

    // Execution environments
    private PyTranslator pyTranslator;    // Python GAAS connection
    private AbstractRJavaTranslator rJavaTranslator;  // R environment

    // UI state
    private Map<String, InsightSheet> insightSheets;   // Sheet tabs
    private Map<String, InsightPanel> insightPanels;   // Visual panels

    // Temporary storage
    private String insightFolder;         // Temp file directory
    private BlockingQueue<NounMetadata> delayedMessages;

    // Methods
    public PixelRunner runPixel(String pixelString) { ... }
    public PixelRunner runPixel(List<String> pixelList) { ... }
    public NounMetadata getVarValue(String varName) { ... }
    public void setVarValue(String varName, Object value) { ... }
}`, 'java', 'prerna/om/Insight.java (simplified)')}
                <h3>Key Components</h3>
                <ul>
                    <li><code>insightId</code> — Unique identifier used in API requests (<code>POST /api/engine/runPixel?insightId=...</code>)</li>
                    <li><code>VarStore</code> — Stores frames, parameters, and dynamic variables</li>
                    <li><code>PixelList</code> — Keeps last 500 Pixel commands for history/undo</li>
                    <li><code>TaskStore</code> — Manages async operations (iterators, long-running tasks)</li>
                    <li><code>PyTranslator</code> — Manages Python GAAS session for <code>Py()</code> execution</li>
                    <li><code>insightSheets</code> — UI sheet tabs (multi-sheet apps like Excel)</li>
                    <li><code>insightPanels</code> — Visual output panels (charts, grids, maps)</li>
                </ul>
            `
        },
        {
            id: "d4-insights-varstore",
            title: "VarStore — Variable Management",
            content: `
                <h2>VarStore — Variable Management in Insights</h2>
                <p>The <code>VarStore</code> is the backend variable store within an Insight, holding all data created during execution.</p>
                ${C.code(`public class VarStore implements InMemStore<String, NounMetadata> {
    // Main storage
    private Map<String, NounMetadata> varMap;

    // Categorized tracking
    private Set<ITableDataFrame> allCreatedFrames;
    private List<String> frameKeys;                // Frame variable names
    private List<String> insightParametersKeys;    // App parameters
    private List<String> preDefinedParametersKeys; // Pre-defined params
    private List<String> dynamicVars;              // Dynamic variables

    // Methods
    public void put(String varName, NounMetadata value) { ... }
    public NounMetadata get(String varName) { ... }
    public boolean containsKey(String varName) { ... }
    public Map<String, NounMetadata> getAll() { ... }
}`, 'java', 'prerna/sablecc2/om/VarStore.java')}
                ${C.split(
                    {
                        title: 'Variable Types',
                        content: `
                            <p>Variables are stored as <code>NounMetadata</code> with a <code>PixelDataType</code>:</p>
                            <ul>
                                <li><code>CONST_STRING</code> — Text values</li>
                                <li><code>CONST_INT</code> — Numbers</li>
                                <li><code>CONST_DATE</code> — Dates</li>
                                <li><code>VECTOR</code> — Arrays/lists</li>
                                <li><code>MAP</code> — JSON objects</li>
                                <li><code>FRAME</code> — Data frames</li>
                                <li><code>FORMATTED_DATA_SET</code> — Query results</li>
                                <li><code>LAMBDA</code> — Functions</li>
                                <li><code>CUSTOM_DATA_STRUCTURE</code> — Custom types</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Variable Access',
                        content: C.code(`// Setting a variable in Pixel
searchTerm = "laptop";

// Getting a variable
echo(<searchTerm>);

// Using in reactors
Filter(column=["region"], value=[<region>]);

// From Java code
insight.getVarValue("searchTerm");
insight.setVarValue("resultsCount", 42);`, 'pixel', 'Variable usage')
                    }
                )}
            `
        },
        {
            id: "d4-insights-panels",
            title: "Insight Panels & Visualizations",
            content: `
                <h2>Insight Panels & Visualizations</h2>
                <p class="lead">Panels are visual output containers in Insights that display charts, grids, maps, and other data visualizations.</p>
                <p>When you call <code>Panel(0)</code> in Pixel, you're referencing an <code>InsightPanel</code> object within the Insight.</p>
                ${C.sequence(
                    ["Notebook Cell", "Pixel: Panel()", "Insight", "InsightPanel", "Frontend Block"],
                    [
                        { from: 0, to: 1, label: 'Visualize() call in cell' },
                        { from: 1, to: 2, label: 'insight.runPixel("Panel(0) | ...")' },
                        { from: 2, to: 3, label: 'Create or get panel by ID' },
                        { from: 3, to: 2, label: 'Panel config + data', type: 'response' },
                        { from: 2, to: 1, label: 'JSON response with panel data', type: 'response' },
                        { from: 1, to: 4, label: 'StateStore updated with panel config' },
                        { from: 4, to: 1, label: 'Visualization block renders chart', type: 'response' }
                    ]
                )}
                ${C.code(`// Creating a visualization panel in a notebook cell
Frame(frame=["salesFrame"])
    | Select(region, product, revenue)
    | Panel(0)
    | AddPanelOrnaments(panel=["0"], layout=["BarChart"])
    | SetPanelView(panel=["0"], view=["visualization"])
    | Visualize();

// The Panel(0) reactor:
// 1. Creates an InsightPanel with id="0"
// 2. AddPanelOrnaments() configures chart type
// 3. SetPanelView() sets display mode
// 4. Visualize() renders the chart

// Result: Frontend receives panel config
{
    "panelId": "0",
    "type": "visualization",
    "layout": "BarChart",
    "data": { ... },
    "ornaments": { ... }
}`, 'pixel', 'Panel creation workflow')}
                ${C.callout('Panels persist in the Insight session. You can update them with <code>RefreshPanelTaskReactor</code> or clear them with <code>RemovePanel</code>.', 'tip')}
            `
        },
        {
            id: "d4-notebooks-insights-integration",
            title: "Notebooks + Insights Integration",
            content: `
                <h2>How Notebooks and Insights Work Together</h2>
                <p>Understanding the data flow between Notebooks (frontend), Insights (backend), and Variables (state synchronization) is key to building ${CONFIG.productName} apps.</p>
                ${C.flow([
                    { title: '1. User Interaction', desc: 'User clicks button → Block onClick event', accent: true },
                    { title: '2. Modify StateStore', desc: 'ModifyVariable action updates frontend state', arrow: '↓' },
                    { title: '3. Trigger Notebook', desc: 'RunQuery action starts notebook execution', arrow: '↓' },
                    { title: '4. Cell-by-Cell Execution', desc: 'For each cell: toPixel() → API call', arrow: '↓' },
                    { title: '5. Backend Pixel Execution', desc: 'Insight.runPixel() executes on VarStore', arrow: '↓' },
                    { title: '6. Store Results', desc: 'Results saved to Insight VarStore', arrow: '↓' },
                    { title: '7. Sync to Frontend', desc: 'API response updates StateStore variables', arrow: '↓' },
                    { title: '8. Re-render Blocks', desc: 'Blocks bound to variables re-render with new data', accent: true }
                ])}
                ${C.code(`// Complete workflow example
// 1. Input block modifies StateStore
{
    "widget": "input",
    "data": { "value": "{{ searchTerm }}" },
    "listeners": {
        "onChange": {
            "order": [
                { "action": "ModifyVariable", "variable": "searchTerm", "value": "{{ $event.value }}" },
                { "action": "RunQuery", "queryId": "search-notebook" }
            ]
        }
    }
}

// 2. Notebook executes cells
// Cell 1: QueryImport → toPixel() → Frame(...) | Query("SELECT * WHERE name LIKE '%<searchTerm>%'")
// Cell 2: FilterData → toPixel() → Filter(...)
// Cell 3: Code → toPixel() → resultsCount = <salesFrame>.shape[0];

// 3. Backend execution
// Insight receives Pixel strings, executes on VarStore
// VarStore now has: salesFrame (FRAME), resultsCount (CONST_INT)

// 4. Frontend sync
// StateStore updated with: { salesFrame: {...}, resultsCount: 42 }

// 5. Grid block re-renders
{
    "widget": "grid-dynamic-frame",
    "data": { "frame": "{{ salesFrame }}" }
}
// Grid detects salesFrame change, displays new data`, 'javascript', 'Full integration workflow')}
            `
        },
        {
            id: "d4-notebooks-variables-ui",
            title: "Variables Panel",
            content: `
                <h2>Variables Panel — Inspecting State</h2>
                <p>The <strong>Variables</strong> panel in the App Designer shows all StateStore variables with type indicators and preview values.</p>
                ${C.table(
                    ['Type', 'Description'],
                    [
                        ['<code>String</code>', 'Text values'],
                        ['<code>Number</code>', 'Integers, floats'],
                        ['<code>Date</code>', 'Date/time values'],
                        ['<code>Array</code>', 'Lists/vectors'],
                        ['<code>JSON</code>', 'Objects/maps'],
                        ['<code>Frame</code>', 'Data frames (tables)'],
                        ['<code>Function</code>', 'Lambda/callable'],
                        ['<code>Query</code>', 'Query objects'],
                        ['<code>Storage</code>', 'Storage references'],
                        ['<code>Block</code>', 'Block references'],
                        ['<code>Cell</code>', 'Cell references'],
                        ['<code>Brain</code>', 'AI/LLM context']
                    ]
                )}
                ${C.callout('Use the Variables panel to debug state issues — if a block isn\'t rendering, check if the variable it binds to exists and has the expected value.', 'tip')}
                ${C.code(`// Variables panel actions
// - Create: Add new variable with initial value
// - Edit: Change variable value (triggers re-render)
// - Delete: Remove variable from StateStore
// - Copy: Duplicate variable with new name
// - Preview: View full variable content in modal

// Variables are synced between StateStore and Insight VarStore
// - Frontend changes (ModifyVariable) → sent to backend on next Pixel execution
// - Backend changes (Pixel assigns) → returned in API response → update StateStore`, 'javascript', 'Variable panel operations')}
            `
        },
        {
            id: "d4-notebooks-insights-handson",
            title: "Hands-on: Build an Analytics Dashboard",
            content: `
                <h2>Hands-on: Build an Analytics Dashboard with Notebooks</h2>
                ${C.handson('Create a multi-cell notebook with visualizations', `
                    <h4>Scenario</h4>
                    <p>Build a sales analytics dashboard that imports data, calculates KPIs, and displays charts using a notebook + blocks.</p>

                    <h4>Step 1: Create a Notebook</h4>
                    <ol>
                        <li>Open the <strong>Notebooks</strong> panel in the App Designer</li>
                        <li>Click <strong>New Notebook</strong>, name it "Sales Analytics"</li>
                    </ol>

                    <h4>Step 2: Add Data Import Cell</h4>
                    <ol>
                        <li>Click <strong>Add Cell</strong> → <strong>Query Import</strong></li>
                        <li>Configure:
                            <ul>
                                <li><strong>Engine:</strong> Select your sales database</li>
                                <li><strong>Query:</strong> <code>SELECT * FROM sales WHERE year = 2026</code></li>
                                <li><strong>Frame:</strong> <code>salesFrame</code></li>
                            </ul>
                        </li>
                        <li>Click <strong>Run Cell</strong> to test — verify data loads in cell console</li>
                    </ol>

                    <h4>Step 3: Add Code Cell for KPI Calculation</h4>
                    <ol>
                        <li>Click <strong>Add Cell</strong> → <strong>Code Cell</strong></li>
                        <li>Type: <strong>Pixel</strong></li>
                        <li>Code:
                            ${C.code(`// Calculate total revenue
totalRevenue = <salesFrame> | Select(revenue) | Sum();

// Calculate average order value
avgOrderValue = <salesFrame> | Select(revenue) | Average();

// Count unique customers
uniqueCustomers = <salesFrame> | Select(customer_id) | Unique() | Count();`, 'pixel')}
                        </li>
                        <li>Run cell — check Variables panel for new variables</li>
                    </ol>

                    <h4>Step 4: Add Filter Transformation Cell</h4>
                    <ol>
                        <li>Click <strong>Add Cell</strong> → <strong>Filter Data</strong></li>
                        <li>Configure:
                            <ul>
                                <li><strong>Frame:</strong> <code>salesFrame</code></li>
                                <li><strong>Column:</strong> <code>region</code></li>
                                <li><strong>Operator:</strong> <code>==</code></li>
                                <li><strong>Value:</strong> <code>{{ selectedRegion }}</code> (variable binding)</li>
                            </ul>
                        </li>
                        <li>Create variable <code>selectedRegion</code> with default value "West"</li>
                    </ol>

                    <h4>Step 5: Add Visualization Cell</h4>
                    <ol>
                        <li>Click <strong>Add Cell</strong> → <strong>Code Cell</strong></li>
                        <li>Code:
                            ${C.code(`// Create bar chart panel
Frame(frame=["salesFrame"])
    | Select(product, revenue)
    | Panel(0)
    | AddPanelOrnaments(panel=["0"], layout=["BarChart"])
    | SetPanelView(panel=["0"], view=["visualization"])
    | Visualize();`, 'pixel')}
                        </li>
                        <li>Run cell — panel 0 created in Insight</li>
                    </ol>

                    <h4>Step 6: Create UI with Blocks</h4>
                    <ol>
                        <li>Switch to <strong>App Designer</strong></li>
                        <li>Add a <strong>Select Block</strong>:
                            <ul>
                                <li><strong>Options:</strong> ["North", "South", "East", "West"]</li>
                                <li><strong>Value:</strong> <code>{{ selectedRegion }}</code></li>
                                <li><strong>onChange:</strong> ModifyVariable → <code>selectedRegion</code> = <code>{{ $event.value }}</code></li>
                                <li><strong>onChange:</strong> RunQuery → <code>search-analytics</code></li>
                            </ul>
                        </li>
                        <li>Add three <strong>Text Blocks</strong> to display KPIs:
                            <ul>
                                <li>"Total Revenue: {{ totalRevenue }}"</li>
                                <li>"Avg Order Value: {{ avgOrderValue }}"</li>
                                <li>"Unique Customers: {{ uniqueCustomers }}"</li>
                            </ul>
                        </li>
                        <li>Add a <strong>Vega Visualization Block</strong>:
                            <ul>
                                <li><strong>Panel ID:</strong> <code>0</code> (binds to panel created by cell)</li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Step 7: Test the Dashboard</h4>
                    <ol>
                        <li>Click <strong>Preview</strong></li>
                        <li>Observe: KPIs display initial values, chart renders</li>
                        <li>Change region in select dropdown</li>
                        <li>Observe: Notebook re-runs → KPIs update → chart updates</li>
                    </ol>

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Notebook imports data, calculates KPIs, creates chart panel</li>
                        <li>Blocks display KPIs and chart from notebook-generated variables/panels</li>
                        <li>Changing region triggers notebook re-execution</li>
                        <li>UI updates reactively when variables change</li>
                        <li>Variables panel shows all intermediate values for debugging</li>
                    </ul>

                    <h4>Bonus: Add a Button to Refresh Data</h4>
                    <ol>
                        <li>Add a <strong>Button Block</strong> with label "Refresh"</li>
                        <li>onClick: RunQuery → <code>search-analytics</code></li>
                        <li>Test: Click button to re-run notebook without changing region</li>
                    </ol>

                    ${C.callout(`This pattern — <strong>Notebook for logic + Blocks for UI</strong> — is how most production ${CONFIG.productName} apps are built. Notebooks handle data, Blocks handle presentation.`, 'tip')}
                `)}
            `
        },
        {
            id: "d4-notebooks-insights-summary",
            title: "Summary",
            content: `
                <h2>Summary: Notebooks & Insights</h2>
                ${C.table(
                    ["Component", "Purpose", "Key Features", "Location"],
                    [
                        [
                            "Notebook",
                            "Multi-cell workflow orchestrator",
                            "Sequential execution, drag-and-drop, run all/individual, debugging",
                            "StateStore (frontend)"
                        ],
                        [
                            "Insight",
                            "Backend execution context",
                            "VarStore, PixelRunner, PyTranslator, TaskStore, panels",
                            "InsightStore (backend, in-memory)"
                        ],
                        [
                            "VarStore",
                            "Backend variable storage",
                            "Frames, parameters, dynamic vars, categorized tracking",
                            "Inside Insight"
                        ],
                        [
                            "StateStore",
                            "Frontend state management",
                            "Variables, blocks, cells, notebooks, change detection",
                            "Frontend (React/MobX)"
                        ],
                        [
                            "InsightPanel",
                            "Visualization container",
                            "Charts, grids, maps, panel ornaments, view modes",
                            "Insight.insightPanels"
                        ],
                        [
                            "Variables Panel",
                            "State inspection UI",
                            "Type icons, previews, create/edit/delete, copy",
                            "App Designer sidebar"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Notebooks</strong> orchestrate multi-step data workflows by executing cells sequentially</li>
                    <li><strong>Insights</strong> are the backend execution context where Pixel code runs on VarStore</li>
                    <li><strong>StateStore</strong> (frontend) and <strong>VarStore</strong> (backend) sync via API calls</li>
                    <li><strong>Cells</strong> in notebooks convert to Pixel via <code>toPixel()</code>, then execute on Insight</li>
                    <li><strong>Variables</strong> bind notebooks and blocks together — notebooks write, blocks read</li>
                    <li><strong>Panels</strong> are visual output containers created by <code>Panel()</code> and rendered by blocks</li>
                    <li><strong>Variables Panel</strong> shows all StateStore variables for debugging</li>
                    <li><strong>Drag-and-drop</strong> cell reordering enables fast prototyping</li>
                    <li><strong>Run All vs Run Cell</strong> — use Run Cell for debugging, Run All for production</li>
                    <li>Notebooks persist across sessions when saved with the app</li>
                    <li><strong>InsightId</strong> is the key that links frontend actions to backend execution</li>
                    <li>The <strong>workflow pattern</strong>: Input → ModifyVariable → RunNotebook → Update VarStore → Sync StateStore → Re-render Blocks</li>
                </ul>
                ${C.callout(`Mastering Notebooks and Insights unlocks the full power of ${CONFIG.productName} — you can build complex, stateful, data-driven applications with minimal code.`, 'tip')}
            `
        }
    ]
};
