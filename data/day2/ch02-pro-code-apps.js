// Day 2, Chapter 2: Pro-Code Apps (105 min)
const day2_ch02 = {
    title: "Pro-Code Apps",
    slides: [
        {
            id: "d2-procode-title",
            title: "Pro-Code Apps",
            content: C.titleSlide(
                "Pro-Code Apps",
                "Building React portals with @semoss/sdk and @semoss/renderer",
                "105 minutes"
            )
        },
        {
            id: "d2-procode-overview",
            title: "What are Pro-Code Apps?",
            content: `
                <h2>What are Pro-Code Apps?</h2>
                <p class="lead"><span class="highlight">Pro-Code Apps</span> are SEMOSS applications built with modern frontend frameworks like React, using the full power of JavaScript tooling.</p>
                <p>Unlike simple HTML portals, pro-code apps use a <strong>build pipeline</strong> to compile TypeScript, bundle assets, and optimize for production.</p>
                ${C.split(
                    {
                        title: 'Simple Apps',
                        content: `
                            <ul>
                                <li>Edit <code>portals/index.html</code> directly</li>
                                <li>Vanilla JS or CDN libraries</li>
                                <li>No build step needed</li>
                                <li>Great for dashboards, reports</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Pro-Code Apps',
                        content: `
                            <ul>
                                <li>Develop in <code>client/src/</code> with React</li>
                                <li>TypeScript, bundling, hot reload</li>
                                <li>Build → <code>portals/</code> deployment</li>
                                <li>Full component libraries, state management</li>
                            </ul>
                        `
                    }
                )}
                ${C.callout('Pro-code apps give you the full React ecosystem: TypeScript, Material-UI, MobX, routing, and the <code>@semoss/sdk</code> and <code>@semoss/renderer</code> libraries.', 'tip')}
            `
        },
        {
            id: "d2-procode-structure",
            title: "Portal Folder Structure",
            content: `
                <h2>Portal Folder Structure</h2>
                <p>Pro-code apps separate <strong>source code</strong> (<code>client/</code>) from <strong>build output</strong> (<code>portals/</code>).</p>
                ${C.tree([
                    { name: "assets/", type: "dir", children: [
                        { name: "client/", type: "dir", desc: "← React source code", children: [
                            { name: "src/", type: "dir", children: [
                                { name: "App.tsx", type: "file", desc: "← main app component" },
                                { name: "main.tsx", type: "file", desc: "← entry point" },
                                { name: "components/", type: "dir", desc: "← reusable UI components" },
                                { name: "pages/", type: "dir", desc: "← route pages" },
                                { name: "hooks/", type: "dir", desc: "← custom React hooks" },
                                { name: "stores/", type: "dir", desc: "← MobX state stores" },
                                { name: "types.d.ts", type: "file", desc: "← TypeScript types" },
                            ]},
                            { name: "package.json", type: "file", desc: "← dependencies" },
                            { name: "tsconfig.json", type: "file", desc: "← TypeScript config" },
                            { name: "vite.config.ts", type: "file", desc: "← Vite bundler config" },
                        ]},
                        { name: "portals/", type: "dir", desc: "← build output (published)", children: [
                            { name: "index.html", type: "file", desc: "← generated entry point" },
                            { name: "*.js", type: "file", desc: "← bundled JavaScript" },
                            { name: "*.css", type: "file", desc: "← compiled styles" },
                            { name: "assets/", type: "dir", desc: "← images, fonts" },
                        ]},
                        { name: "java/", type: "dir", desc: "← custom reactors" },
                        { name: "py/", type: "dir", desc: "← Python functions" },
                    ]}
                ])}
                ${C.callout('<strong>Never edit</strong> <code>portals/</code> directly in a pro-code app — it gets overwritten on each build. Edit <code>client/src/</code> instead.', 'warning')}
            `
        },
        {
            id: "d2-procode-sdk",
            title: "@semoss/sdk",
            content: `
                <h2>@semoss/sdk — The SEMOSS API Client</h2>
                <p>The <code>@semoss/sdk</code> package provides TypeScript functions to interact with the SEMOSS backend.</p>
                ${C.code(`import { runPixel, Env } from '@semoss/sdk/react';

// Configure the SDK (usually in main.tsx or App.tsx)
Env.update({
    MODULE: process.env.MODULE || '',
    ACCESS_KEY: process.env.ACCESS_KEY || '',
    SECRET_KEY: process.env.SECRET_KEY || '',
    APP: process.env.APP || '',
});

// Run a Pixel command
const result = await runPixel('Echo("Hello!");', 'new');
console.log(result.pixelReturn[0].output);  // "Hello!"`, 'typescript', 'Using @semoss/sdk in React')}
                <h3>Key SDK Modules</h3>
                ${C.cards([
                    { badge: 'api/base', title: 'runPixel()', desc: 'Execute Pixel commands and get results' },
                    { badge: 'api/auth', title: 'login(), logout()', desc: 'User authentication functions' },
                    { badge: 'api/engine', title: 'Engine APIs', desc: 'Interact with engines directly' },
                    { badge: 'stores', title: 'InsightStore', desc: 'MobX store for insight state' },
                ])}
            `
        },
        {
            id: "d2-procode-insight-provider",
            title: "InsightProvider & State",
            content: `
                <h2>InsightProvider — App Context</h2>
                <p>The <code>InsightProvider</code> wraps your React app to provide insight context and state management.</p>
                ${C.code(`import { InsightProvider, Env } from '@semoss/sdk/react';
import { App } from './App';

// In main.tsx or index.tsx
// Initialize with app options
ReactDOM.render(
    <InsightProvider options={{ app: 'my-app-id' }}>
        <App />
    </InsightProvider>,
    document.getElementById('root')
);`, 'typescript', 'client/src/main.tsx')}
                <h3>useInsight() Hook — Accessing Insight State</h3>
                ${C.code(`import { useInsight } from '@semoss/sdk/react';

function MyComponent() {
    // Use the useInsight() hook to access insight state
    const { insightId, isReady, isAuthorized, actions } = useInsight();

    // Use actions to run Pixel commands
    const fetchData = async () => {
        const result = await actions.run('MyEngines();');
        console.log(result);
    };

    if (!isReady) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>Insight ID: {insightId}</p>
            <button onClick={fetchData}>Fetch Engines</button>
        </div>
    );
}`, 'typescript', 'Using useInsight() hook in components')}
                ${C.callout('Always use the <code>useInsight()</code> hook in React components. The InsightStore uses <strong>MobX</strong> for reactive state management, and hooks provide the React-idiomatic way to access it.', 'info')}
            `
        },
        {
            id: "d2-procode-renderer",
            title: "@semoss/renderer",
            content: `
                <h2>@semoss/renderer — Block-Based UI Components</h2>
                <p>The <code>@semoss/renderer</code> package provides the <strong>Renderer</strong> component for embedding SEMOSS block-based UIs.</p>
                ${C.code(`import { Renderer } from '@semoss/renderer';

function MyApp() {
    return (
        <Renderer
            appId="my-app-project-id"
            insightId="my-insight-id"
        />
    );
}`, 'typescript', 'Basic Renderer usage')}
                <h3>What is the Renderer?</h3>
                ${C.flow([
                    { title: 'Block System', desc: 'JSON-driven UI components (grids, charts, forms)' },
                    { title: 'Renderer Component', desc: 'React component that loads and displays blocks', arrow: '↓ GetAppBlocksJson()' },
                    { title: 'User Interaction', desc: 'Blocks emit Pixel commands on user actions', arrow: '↓ user clicks button' },
                    { title: 'Backend Processing', desc: 'Pixel runs → updates state → re-renders blocks', accent: true },
                ])}
                ${C.callout('The Renderer is a full no-code/low-code UI system. You can embed it in pro-code apps to give users a visual builder experience.', 'tip')}
            `
        },
        {
            id: "d2-procode-renderer-blocks",
            title: "Working with Blocks",
            content: `
                <h2>Working with Blocks</h2>
                <p>Blocks are JSON configurations for UI components. The Renderer interprets them and renders React components.</p>
                ${C.code(`import { Blocks, useBlock, DefaultBlocks } from '@semoss/renderer';

function CustomBlockApp({ state }) {
    return (
        <Blocks state={state} blocks={DefaultBlocks}>
            <MyCustomGrid />
            <MyCustomChart />
        </Blocks>
    );
}

function MyCustomGrid() {
    // Access block state with useBlock hook
    const { data, setData, listeners, slots, insightId, attrs } = useBlock('grid-block-id');

    // Update block data
    const handleUpdate = () => {
        setData('someField', 'new value');
    };

    return (
        <div>
            {/* Render grid with block data */}
        </div>
    );
}`, 'typescript', 'Custom block components')}
                <h3>Available Block Types</h3>
                ${C.table(
                    ['Widget Name', 'Purpose', 'Config Class'],
                    [
                        ['<code>grid</code>', 'Data table with sorting, filtering', '<code>GridBlockConfig</code>'],
                        ['<code>e-chart</code>', 'Charts (bar, line, pie, scatter)', '<code>EchartVisualizationBlockConfig</code>'],
                        ['<code>radio</code>', 'Radio button input', '<code>RadioBlockConfig</code>'],
                        ['<code>pdfViewer</code>', 'Embedded PDF viewer', '<code>PDFViewerBlockConfig</code>'],
                        ['<code>code</code> (cell)', 'Pixel code editor', '<code>CodeCellConfig</code> (cell type)'],
                    ]
                )}
                ${C.callout('<strong>Note:</strong> CodeCell is in DefaultCells, not DefaultBlocks. Cells are a distinct concept from blocks in the renderer.', 'info')}
            `
        },
        {
            id: "d2-procode-ui-customization",
            title: "UI Customization",
            content: `
                <h2>UI Customization</h2>
                <p>Pro-code apps support full theming and styling with Material-UI (MUI).</p>
                ${C.code(`import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2c5f2d',  // SEMOSS green
        },
        background: {
            default: '#1a1a1a',
            paper: '#2a2a2a',
        },
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            {/* Your app components */}
        </ThemeProvider>
    );
}`, 'typescript', 'Theme customization with MUI')}
                <h3>Layout Patterns</h3>
                ${C.cards([
                    { badge: 'Pattern', title: 'Header + Content', desc: 'AppBar with navigation + main content area' },
                    { badge: 'Pattern', title: 'Sidebar + Main', desc: 'Drawer navigation + content pane' },
                    { badge: 'Pattern', title: 'Dashboard Grid', desc: 'Grid of cards/widgets with MUI Grid' },
                    { badge: 'Pattern', title: 'Tabbed Interface', desc: 'Tabs component for multi-page apps' },
                ])}
            `
        },
        {
            id: "d2-procode-build-workflow",
            title: "Build & Deploy Workflow",
            content: `
                <h2>Build & Deploy Workflow</h2>
                <p>Pro-code apps use a build pipeline to compile and bundle code before deployment.</p>
                ${C.flow([
                    { title: 'Develop', desc: 'Edit code in client/src/ with hot reload' },
                    { title: 'Build', desc: 'npm run build → Vite bundles to portals/', arrow: '↓ npm run build' },
                    { title: 'Publish', desc: 'Click "Publish files" in SEMOSS UI', arrow: '↓ UI button' },
                    { title: 'Deploy', desc: 'portals/ copied to public_home/<projectId>/', accent: true, arrow: '↓ copy operation' },
                    { title: 'Live', desc: 'App available at published URL' },
                ])}
                ${C.code(`# In client/ directory
npm install        # Install dependencies
npm run dev        # Start dev server with hot reload
npm run build      # Build for production → ../portals/
npm run preview    # Preview production build locally`, 'bash', 'Development commands')}
                ${C.callout('Always test your production build with <code>npm run preview</code> before publishing to catch build issues early.', 'tip')}
            `
        },
        {
            id: "d2-procode-component-example",
            title: "Custom Component Example",
            content: `
                <h2>Building a Custom Component</h2>
                <p>Here's a complete example of a custom React component that runs Pixel commands.</p>
                ${C.code(`import { useState } from 'react';
import { runPixel, useInsight } from '@semoss/sdk/react';
import { Button, TextField, Card, CardContent } from '@mui/material';

export function QueryRunner() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const { insightId } = useInsight();

    const runQuery = async () => {
        setLoading(true);
        try {
            const pixel = \`Database(database="my_db") | Query("\${query}");\`;
            const { pixelReturn, errors } = await runPixel(
                pixel,
                insightId
            );

            if (errors.length) {
                alert('Error: ' + errors.join(', '));
            } else {
                setResults(pixelReturn[0].output);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="SQL Query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={runQuery}
                    disabled={loading}
                >
                    {loading ? 'Running...' : 'Run Query'}
                </Button>
                {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
            </CardContent>
        </Card>
    );
}`, 'typescript', 'client/src/components/QueryRunner.tsx')}
            `
        },
        {
            id: "d2-procode-handson",
            title: "Hands-on: Build a Portal",
            content: `
                <h2>Hands-on: Build a React Portal</h2>
                ${C.handson('Create a Pro-Code App', `
                    <h4>Step 1: Set Up the Project</h4>
                    <p>In your app's <code>assets/</code> folder, create a <code>client/</code> directory:</p>
                    ${C.code(`cd project/MyApp__<projectId>/app_root/version/assets/
mkdir client
cd client
npm init -y
npm install react react-dom @mui/material
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom`, 'bash')}

                    <h4>Step 2: Create App Structure</h4>
                    <p>Create the following files:</p>
                    ${C.code(`client/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
├── package.json
├── tsconfig.json
└── vite.config.ts`, 'text')}

                    <h4>Step 3: Write App.tsx</h4>
                    ${C.code(`import { InsightProvider, Env } from '@semoss/sdk/react';
import { Button } from '@mui/material';

Env.update({ MODULE: window.location.origin });

export function App() {
    return (
        <InsightProvider>
            <div style={{ padding: '2rem' }}>
                <h1>My Pro-Code App</h1>
                <Button
                    variant="contained"
                    onClick={() => alert('Hello from React!')}
                >
                    Click Me
                </Button>
            </div>
        </InsightProvider>
    );
}`, 'typescript')}

                    <h4>Step 4: Configure Vite</h4>
                    ${C.code(`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    root: 'src',
    base: './',
    build: {
        outDir: '../../portals',
        emptyOutDir: true,
    },
    resolve: {
        alias: { '@': resolve(__dirname, './src') },
    },
    plugins: [react()],
});`, 'typescript', 'vite.config.ts')}

                    <h4>Step 5: Build & Publish</h4>
                    ${C.code(`npm run build
# Output written to ../portals/

# In SEMOSS UI, click "Publish files"
# Visit: <base-url>/public_home/<projectId>/portals/index.html`, 'bash')}

                    <h4>Bonus: Add Pixel Integration</h4>
                    ${C.code(`import { runPixel, useInsight } from '@semoss/sdk/react';

function DataFetcher() {
    const [data, setData] = useState(null);
    const { insightId } = useInsight();

    const fetchData = async () => {
        const { pixelReturn } = await runPixel(
            'MyEngines();',
            insightId
        );
        setData(pixelReturn[0].output);
    };

    return (
        <button onClick={fetchData}>
            Fetch My Engines
        </button>
    );
}`, 'typescript')}
                `)}
            `
        },
        {
            id: "d2-procode-recap",
            title: "Recap",
            content: `
                <h2>Pro-Code Apps — Recap</h2>
                ${C.cards([
                    { badge: 'Concept', title: 'Build Pipeline', desc: 'client/ (source) → portals/ (build output) → published URL' },
                    { badge: 'Library', title: '@semoss/sdk', desc: 'API client: runPixel(), InsightStore, authentication' },
                    { badge: 'Library', title: '@semoss/renderer', desc: 'Block-based UI components with Renderer component' },
                    { badge: 'State', title: 'MobX', desc: 'Reactive state management via InsightStore' },
                    { badge: 'UI', title: 'Material-UI', desc: 'Component library for theming and layouts' },
                    { badge: 'Workflow', title: 'Dev → Build → Publish', desc: 'npm run build → SEMOSS publish → live deployment' },
                ])}
                <h3>Next Up</h3>
                <p>Custom Reactors — Extend SEMOSS functionality with Java backend logic.</p>
            `
        }
    ]
};
