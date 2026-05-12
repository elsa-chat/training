// Day 4, Chapter 2: Frontend Blocks & Cells (90 min)
const day4_ch02 = {
    title: "Frontend Blocks & Cells",
    slides: [
        {
            id: "d4-blocks-cells-title",
            title: "Frontend Blocks & Cells",
            content: C.titleSlide(
                "Frontend Blocks & Cells",
                "Building reactive UIs and data workflows with ${CONFIG.productName}'s component library",
                "90 minutes"
            )
        },
        {
            id: "d4-blocks-cells-overview",
            title: "Blocks vs Cells: What's the Difference?",
            content: `
                <h2>Blocks vs Cells: What's the Difference?</h2>
                <p class="lead">${CONFIG.productName} provides two complementary component systems: <span class="highlight">Blocks</span> for building reactive UIs and <span class="highlight">Cells</span> for orchestrating data workflows.</p>
                ${C.split(
                    {
                        title: 'Blocks',
                        content: `
                            <p><strong>UI building components</strong> used in App Designer</p>
                            <ul>
                                <li><strong>Purpose:</strong> Interactive user interfaces</li>
                                <li><strong>Examples:</strong> Button, Input, Grid, Chart, Container</li>
                                <li><strong>Event-driven:</strong> onClick, onChange, etc.</li>
                                <li><strong>Visual:</strong> Rendered in the app UI</li>
                                <li><strong>Count:</strong> 40+ built-in types</li>
                            </ul>
                            ${C.callout('Think of Blocks as <strong>frontend components</strong>  -  the visual building blocks of your application.', 'info')}
                        `
                    },
                    {
                        title: 'Cells',
                        content: `
                            <p><strong>Workflow execution units</strong> used in Notebooks</p>
                            <ul>
                                <li><strong>Purpose:</strong> Sequential data processing</li>
                                <li><strong>Examples:</strong> Code, DataImport, FilterData, LLM</li>
                                <li><strong>Execution-driven:</strong> Run order matters</li>
                                <li><strong>Functional:</strong> Transform data, not UI</li>
                                <li><strong>Count:</strong> 20+ built-in types</li>
                            </ul>
                            ${C.callout('Think of Cells as <strong>pipeline steps</strong>  -  the data transformation units of your workflow.', 'tip')}
                        `
                    }
                )}
            `
        },
        {
            id: "d4-blocks-architecture",
            title: "Block Architecture",
            content: `
                <h2>Block Architecture</h2>
                <p>Every Block is defined by a <code>BlockConfig</code> object that specifies its behavior, appearance, and event handlers.</p>
                ${C.code(`import type { BlockConfig } from "@semoss/renderer";

// Block configuration structure
export const config: BlockConfig<ButtonBlockDef> = {
    widget: "button",               // Unique widget identifier
    type: BLOCK_TYPE_ACTION,        // Category: ACTION, DISPLAY, INPUT, LAYOUT
    data: {                         // Default properties
        style: {},                  // CSS styling
        label: "Submit",            // Button text
        loading: false,             // Loading state
        disabled: false,            // Disabled state
        variant: "contained",       // Material-UI variant
        color: "primary",           // Theme color
        show: "true",               // Visibility (supports expressions)
        type: "button"              // HTML button type
    },
    listeners: {                    // Event handlers
        onClick: {
            type: "sync",           // sync or async
            order: []               // List of actions to execute
        },
        preProcess: {
            type: "sync",
            order: []
        }
    },
    slots: {},                      // Child content slots (for containers)
    render: ButtonBlock             // React component to render
};`, 'typescript', 'libs/renderer/src/components/block-defaults/button-block/config.tsx')}
                <h3>Key Concepts</h3>
                <ul>
                    <li><code>widget</code>  -  Unique identifier used in block registry</li>
                    <li><code>type</code>  -  Categorizes blocks for UI organization (Action, Display, Input, Layout, Visualization)</li>
                    <li><code>data</code>  -  Default properties; can be overridden per-instance</li>
                    <li><code>listeners</code>  -  Event handlers with ordered action chains</li>
                    <li><code>render</code>  -  React component that receives <code>data</code> and triggers listeners</li>
                </ul>
            `
        },
        {
            id: "d4-blocks-categories",
            title: "Block Categories",
            content: `
                <h2>Block Categories  -  40+ Built-in Types</h2>
                <p>${CONFIG.productName} ships with a comprehensive library of blocks organized by purpose.</p>
                ${C.table(
                    ['Category', 'Blocks', 'Use Cases'],
                    [
                        [
                            '<strong>Action</strong>',
                            'Button, Link, Upload',
                            'User interactions, form submissions, file uploads'
                        ],
                        [
                            '<strong>Input</strong>',
                            'Input, Checkbox, Radio, Select, Slider, Switch, TimePicker, Ratings',
                            'Data entry, filters, settings, user preferences'
                        ],
                        [
                            '<strong>Display</strong>',
                            'Text, Markdown, HTML, Image, Icon, Audio, PDFViewer, Mermaid',
                            'Content rendering, documentation, media'
                        ],
                        [
                            '<strong>Layout</strong>',
                            'Container, Page, Tab, Sidebar, Accordion, Modal, Popover, Grid, Iteration, Form',
                            'Structuring apps, navigation, repeated elements'
                        ],
                        [
                            '<strong>Visualization</strong>',
                            'EchartVisualization, VegaVisualization, VisualizationFilter, GridDynamicFrame',
                            'Charts, graphs, data grids, analytics'
                        ],
                        [
                            '<strong>Utility</strong>',
                            'Divider, Progress, Chip, FlipCard, Logs, Theme',
                            'Visual separation, loading states, notifications'
                        ]
                    ]
                )}
                ${C.callout('All blocks are exposed via the <code>DefaultBlocks</code> registry and can be extended with custom blocks.', 'info')}
            `
        },
        {
            id: "d4-blocks-event-system",
            title: "Block Event System",
            content: `
                <h2>Block Event System  -  Reactive Behavior</h2>
                <p class="lead">Blocks support event listeners that trigger <span class="highlight">action chains</span>  -  ordered sequences of operations like running Pixel, modifying variables, or navigating pages.</p>
                ${C.flow([
                    { title: 'User Interaction', desc: 'User clicks a button or changes input value', accent: true },
                    { title: 'Trigger Event Listener', desc: 'onClick, onChange, onSubmit, etc.', arrow: '↓' },
                    { title: 'Execute Action Chain', desc: 'Ordered list of actions defined in listeners.order', arrow: '↓' },
                    { title: 'Possible Actions', desc: 'RunCell, ModifyVariable, Redirect, RunPixel, ShowModal', arrow: '↓' },
                    { title: 'Update State', desc: 'StateStore updates variables, re-renders dependent blocks', accent: true }
                ])}
                ${C.code(`// Example: Button block with onClick action chain
{
    "id": "submit-btn",
    "widget": "button",
    "data": {
        "label": "Submit Form"
    },
    "listeners": {
        "onClick": {
            "type": "sync",
            "order": [
                {
                    "action": "RunCell",          // Execute a notebook cell
                    "cellId": "validate-form",
                    "blockOnError": true
                },
                {
                    "action": "ModifyVariable",   // Update a variable
                    "variable": "submitted",
                    "value": true
                },
                {
                    "action": "Redirect",         // Navigate to another page
                    "destination": "success-page"
                }
            ]
        }
    }
}`, 'json', 'Block event configuration')}
                ${C.callout('Action chains execute <strong>in order</strong>. Use <code>blockOnError: true</code> to stop execution if an action fails.', 'warning')}
            `
        },
        {
            id: "d4-blocks-state-binding",
            title: "State Binding & Variables",
            content: `
                <h2>State Binding & Variables</h2>
                <p>Blocks can bind their properties to <strong>StateStore variables</strong> using expressions, enabling reactive UIs that update automatically when data changes.</p>
                ${C.split(
                    {
                        title: 'Static Properties',
                        content: C.code(`// Static label
{
    "widget": "text",
    "data": {
        "content": "Hello World"
    }
}`, 'json')
                    },
                    {
                        title: 'Dynamic Binding',
                        content: C.code(`// Bind to variable
{
    "widget": "text",
    "data": {
        "content": "{{ username }}",
        "show": "{{ isLoggedIn }}"
    }
}

// The {{ }} syntax resolves variables
// from the StateStore at render time`, 'json')
                    }
                )}
                ${C.code(`// Input block syncing to StateStore
{
    "widget": "input",
    "data": {
        "value": "{{ searchTerm }}",     // Displays current value
        "placeholder": "Enter search..."
    },
    "listeners": {
        "onChange": {
            "type": "sync",
            "order": [
                {
                    "action": "ModifyVariable",
                    "variable": "searchTerm",
                    "value": "{{ $event.value }}"  // $event = event payload
                },
                {
                    "action": "RunCell",
                    "cellId": "filter-results"     // Re-run search
                }
            ]
        }
    }
}`, 'json', 'Reactive input with state binding')}
                ${C.callout('Use <code>{{ variable }}</code> for state binding and <code>{{ $event }}</code> to access event payloads in action chains.', 'tip')}
            `
        },
        {
            id: "d4-cells-architecture",
            title: "Cell Architecture",
            content: `
                <h2>Cell Architecture</h2>
                <p>Cells are execution units in <strong>Notebooks</strong>  -  they transform data, run code, or call AI tools. Each cell converts to executable <strong>Pixel code</strong> via its <code>toPixel()</code> function.</p>
                ${C.code(`import type { CellConfig } from "@semoss/renderer";

// Cell configuration structure
export const CodeCellConfig: CellConfig<CodeCellDef> = {
    name: "Code",                       // Display name in UI
    widget: "code",                     // Unique widget identifier
    parameters: {                       // Cell-specific configuration
        type: "pixel",                  // Code language: pixel, py, r, markdown
        code: ""                        // Code content
    },
    view: CodeCell,                     // React component to render cell editor
    toPixel: ({ type, code }) => {      // Convert cell to executable Pixel
        code = typeof code === "string" ? code : code.join("\\n");
        if (type === "r") {
            return \`R("<encode>\${code}</encode>");\`;
        } else if (type === "py") {
            return \`Py("<encode>\${code}</encode>");\`;
        } else if (type === "pixel") {
            return code;
        } else if (type === "markdown") {
            return code;  // Markdown cells are non-executable
        } else {
            throw new Error(\`Invalid type: \${type}\`);
        }
    }
};`, 'typescript', 'libs/renderer/src/components/cell-defaults/code-cell/config.ts')}
                <h3>Key Concepts</h3>
                <ul>
                    <li><code>parameters</code>  -  Cell-specific config (varies by cell type)</li>
                    <li><code>toPixel()</code>  -  Converts cell definition to executable Pixel code</li>
                    <li><code>view</code>  -  React component for editing cell in Notebook UI</li>
                </ul>
            `
        },
        {
            id: "d4-cells-types",
            title: "Cell Types",
            content: `
                <h2>Cell Types  -  Data Workflow Building Blocks</h2>
                <p>Cells are organized by their role in data processing pipelines.</p>
                ${C.cards([
                    { badge: 'Code Execution', title: 'Code Cell', desc: 'Run Pixel, Python, or R code. Supports variables and multi-line scripts.' },
                    { badge: 'Data Ingestion', title: 'DataImport', desc: 'Import data from files (CSV, Excel, JSON). <code>toPixel</code>: <code>Import(...)</code>' },
                    { badge: 'Data Ingestion', title: 'QueryImport', desc: 'Query databases or engines. <code>toPixel</code>: <code>Frame(...) | Query(...)</code>' },
                    { badge: 'Transformation', title: 'FilterData', desc: 'Filter rows based on conditions. <code>toPixel</code>: <code>Filter(...)</code>' },
                    { badge: 'Transformation', title: 'Join', desc: 'Join two frames on keys. <code>toPixel</code>: <code>Join(...)</code>' },
                    { badge: 'Transformation', title: 'ColumnType', desc: 'Convert column data types. <code>toPixel</code>: <code>ConvertDataType(...)</code>' },
                    { badge: 'Transformation', title: 'Uppercase', desc: 'Uppercase text columns. <code>toPixel</code>: <code>Uppercase(...)</code>' },
                    { badge: 'AI Tools', title: 'LLM Cell', desc: 'Call LLM models with prompts and tools. Uses <code>RunRoomPixel</code> or <code>LLMCall</code>' },
                    { badge: 'AI Tools', title: 'TextToSql', desc: 'Convert natural language to SQL. <code>toPixel</code>: <code>TextToSql(...)</code>' },
                    { badge: 'AI Tools', title: 'MCPTool', desc: 'Execute MCP tools from Apps/Engines' },
                    { badge: 'Utility', title: 'SendEmail', desc: 'Send emails. <code>toPixel</code>: <code>SendEmail(...)</code>' }
                ])}
                ${C.callout('All cells implement <code>toPixel()</code> which converts their parameters to a Pixel command string that executes on the backend.', 'info')}
            `
        },
        {
            id: "d4-cells-notebook-execution",
            title: "Notebook Execution Flow",
            content: `
                <h2>Notebook Execution Flow</h2>
                <p>Notebooks are sequences of Cells that execute in order. When a user runs a Notebook, each cell's <code>toPixel()</code> output is sent to the backend PixelRunner.</p>
                ${C.sequence(
                    ["User", "Notebook UI", "StateStore", "Cell.toPixel()", "Backend PixelRunner", "Insight"],
                    [
                        { from: 0, to: 1, label: 'Click "Run Notebook"' },
                        { from: 1, to: 2, label: "Get cells in order" },
                        { from: 2, to: 3, label: "cell.toPixel(params)" },
                        { from: 3, to: 2, label: 'Pixel string (e.g., "Py(...)")', type: "response" },
                        { from: 2, to: 4, label: "POST /api/engine/runPixel" },
                        { from: 4, to: 5, label: "insight.runPixel(pixelString)" },
                        { from: 5, to: 4, label: "PixelRunner results", type: "response" },
                        { from: 4, to: 2, label: "Update state with results", type: "response" },
                        { from: 2, to: 1, label: "Re-render blocks with new data", type: "response" }
                    ]
                )}
                ${C.code(`// Example: Notebook with 3 cells
[
    {
        "id": "import-data",
        "widget": "data-import",
        "parameters": {
            "file": "sales.csv",
            "frame": "salesFrame"
        }
        // toPixel() => Import(filePath="sales.csv", frame="salesFrame");
    },
    {
        "id": "filter-data",
        "widget": "filter-data",
        "parameters": {
            "frame": "salesFrame",
            "column": "region",
            "operator": "==",
            "value": "West"
        }
        // toPixel() => Frame(frame=["salesFrame"]) | Filter(column=["region"], comparator=["=="], value=["West"]);
    },
    {
        "id": "visualize",
        "widget": "code",
        "parameters": {
            "type": "pixel",
            "code": "Panel(0) | AddPanelOrnaments(panel=[\\\"0\\\"], layout=[\\\"BarChart\\\"]) | Visualize();"
        }
        // toPixel() => returns code as-is
    }
]`, 'json', 'Notebook cell sequence')}
            `
        },
        {
            id: "d4-blocks-cells-integration",
            title: "Blocks + Cells Integration",
            content: `
                <h2>Blocks + Cells Integration</h2>
                <p>Blocks and Cells work together to create <strong>reactive data applications</strong>. Blocks display UI, Cells process data, and the StateStore binds them together.</p>
                ${C.layers([
                    { label: "User Interface", items: [
                        { title: "Blocks", desc: "Button, Input, Grid, Chart" }
                    ]},
                    { label: "State Management", accent: true, items: [
                        { title: "StateStore", desc: "Variables + NotebookStore", accent: true }
                    ]},
                    { label: "Data Processing", items: [
                        { title: "Cells (Notebooks)", desc: "DataImport, Filter, LLM" }
                    ]},
                    { label: "Backend Execution", items: [
                        { title: "PixelRunner", desc: "Executes Pixel on Insight" }
                    ]}
                ])}
                ${C.code(`// Typical workflow:
// 1. User enters search term in Input block
//    → Input block updates StateStore variable "searchTerm"
//    → Input's onChange listener triggers "RunCell" action

// 2. Cell executes with updated variable
//    → Cell reads {{ searchTerm }} from StateStore
//    → Cell.toPixel() generates Pixel with search term
//    → Backend runs Pixel, returns filtered results

// 3. Results stored in StateStore
//    → StateStore variable "searchResults" updated
//    → All blocks bound to {{ searchResults }} re-render

// 4. Grid block displays results
//    → Grid's data property: {{ searchResults }}
//    → Grid automatically updates when variable changes`, 'javascript', 'Reactive workflow')}
                ${C.callout('<strong>Pattern:</strong> Blocks handle UI interactions → trigger Cells → Cells update StateStore → Blocks re-render with new data.', 'tip')}
            `
        },
        {
            id: "d4-blocks-cells-handson",
            title: "Hands-on: Build a Search App",
            content: `
                <h2>Hands-on: Build a Search Interface</h2>
                ${C.handson('Create a reactive search app using Blocks + Cells', `
                    <h4>Scenario</h4>
                    <p>Build an app where users can search a database, filter results, and view them in a grid  -  all using Blocks and Cells.</p>

                    <h4>Step 1: Create a Page with Search Input (Block)</h4>
                    <ol>
                        <li>Open the ${CONFIG.productName} App Designer (Blocks Workspace)</li>
                        <li>Drag an <strong>Input Block</strong> onto the canvas</li>
                        <li>Configure the Input:
                            <ul>
                                <li><strong>Placeholder:</strong> "Enter product name..."</li>
                                <li><strong>Value:</strong> <code>{{ searchTerm }}</code> (binds to StateStore variable)</li>
                            </ul>
                        </li>
                        <li>Add an <strong>onChange</strong> event listener:
                            <ul>
                                <li><strong>Action:</strong> ModifyVariable</li>
                                <li><strong>Variable:</strong> <code>searchTerm</code></li>
                                <li><strong>Value:</strong> <code>{{ $event.value }}</code></li>
                            </ul>
                        </li>
                        <li>Add a second action to the onChange listener:
                            <ul>
                                <li><strong>Action:</strong> RunCell</li>
                                <li><strong>Cell ID:</strong> <code>search-cell</code></li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Step 2: Create a Search Cell (Notebook)</h4>
                    <ol>
                        <li>Open the <strong>Notebooks</strong> panel</li>
                        <li>Create a new Notebook named "Search Logic"</li>
                        <li>Add a <strong>Query Import Cell</strong>:
                            <ul>
                                <li><strong>Cell ID:</strong> <code>search-cell</code></li>
                                <li><strong>Engine:</strong> Select your database (e.g., "products-db")</li>
                                <li><strong>Query:</strong> <code>SELECT * FROM products WHERE name LIKE '%{{ searchTerm }}%'</code></li>
                                <li><strong>Frame:</strong> <code>searchResults</code></li>
                            </ul>
                        </li>
                        <li>The cell's <code>toPixel()</code> will generate:
                            ${C.code(`Frame(engine=["products-db"]) | Query("SELECT * FROM products WHERE name LIKE '%<searchTerm>%'") | As(frame=["searchResults"]);`, 'pixel')}
                        </li>
                    </ol>

                    <h4>Step 3: Display Results with a Grid Block</h4>
                    <ol>
                        <li>Return to the App Designer</li>
                        <li>Drag a <strong>GridDynamicFrame Block</strong> below the Input</li>
                        <li>Configure the Grid:
                            <ul>
                                <li><strong>Frame:</strong> <code>{{ searchResults }}</code></li>
                                <li>The grid will automatically render columns from the frame</li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Step 4: Test the App</h4>
                    <ol>
                        <li>Click <strong>Preview</strong> to run the app</li>
                        <li>Type "laptop" in the search input</li>
                        <li>Observe the flow:
                            <ul>
                                <li>Input onChange → ModifyVariable ("searchTerm" = "laptop")</li>
                                <li>Input onChange → RunCell ("search-cell")</li>
                                <li>Cell executes → Pixel query with "laptop"</li>
                                <li>Results stored in "searchResults" variable</li>
                                <li>Grid re-renders with filtered products</li>
                            </ul>
                        </li>
                    </ol>

                    <h4>Bonus: Add a Button to Clear Search</h4>
                    <ol>
                        <li>Add a <strong>Button Block</strong> next to the Input</li>
                        <li>Configure:
                            <ul>
                                <li><strong>Label:</strong> "Clear"</li>
                                <li><strong>onClick:</strong> ModifyVariable → <code>searchTerm</code> = <code>""</code></li>
                                <li><strong>onClick:</strong> ModifyVariable → <code>searchResults</code> = <code>[]</code></li>
                            </ul>
                        </li>
                        <li>Test: Click "Clear" to reset search</li>
                    </ol>

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Search input triggers cell execution on every keystroke</li>
                        <li>Grid updates automatically with filtered results</li>
                        <li>Clear button resets both input and grid</li>
                        <li>All state managed via StateStore variables</li>
                    </ul>
                    ${C.callout(`This pattern  -  <strong>Input → ModifyVariable → RunCell → Grid</strong>  -  is the foundation of most ${CONFIG.productName} reactive apps.`, 'tip')}
                `)}
            `
        },
        {
            id: "d4-blocks-cells-summary",
            title: "Summary",
            content: `
                <h2>Summary: Frontend Blocks & Cells</h2>
                ${C.table(
                    ["Component", "Purpose", "Key Features", "Example Types"],
                    [
                        [
                            "Blocks",
                            "UI building components",
                            "Event listeners, state binding, action chains",
                            "Button, Input, Grid, Chart, Container"
                        ],
                        [
                            "Cells",
                            "Data workflow units",
                            "toPixel() conversion, sequential execution, variables",
                            "Code, DataImport, FilterData, LLM, Join"
                        ],
                        [
                            "StateStore",
                            "Reactive state management",
                            "Variables, change detection, re-rendering",
                            "{{ searchTerm }}, {{ results }}"
                        ],
                        [
                            "BlockConfig",
                            "Block definition",
                            "widget, type, data, listeners, slots, render",
                            "Button config with onClick listener"
                        ],
                        [
                            "CellConfig",
                            "Cell definition",
                            "widget, parameters, view, toPixel()",
                            "Code cell converting to Py(...)"
                        ],
                        [
                            "Action Chain",
                            "Event-driven workflow",
                            "RunCell, ModifyVariable, Redirect, blockOnError",
                            "onClick: [ModifyVar, RunCell, Redirect]"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Blocks</strong> are for UI  -  they render components and handle user interactions</li>
                    <li><strong>Cells</strong> are for data  -  they execute code, transform data, and call AI tools</li>
                    <li><strong>StateStore</strong> binds Blocks and Cells via variables using <code>{{ }}</code> syntax</li>
                    <li><strong>Event listeners</strong> on Blocks trigger action chains (RunCell, ModifyVariable, Redirect)</li>
                    <li><strong>toPixel()</strong> converts Cell configurations to executable Pixel code for the backend</li>
                    <li><strong>Notebooks</strong> are sequences of Cells that run in order to process data pipelines</li>
                    <li>The <strong>reactive pattern</strong>: User Interaction → Block Event → Modify State → Run Cell → Update State → Re-render Blocks</li>
                    <li>${CONFIG.productName} ships with <strong>40+ Blocks</strong> and <strong>20+ Cells</strong> covering most common use cases</li>
                    <li>Custom Blocks and Cells can be added by extending the registry</li>
                </ul>
                ${C.callout(`Blocks + Cells + StateStore = <strong>Reactive Data Applications</strong>. Master this triad and you can build any ${CONFIG.productName} app.`, 'tip')}
            `
        }
    ]
};
