// Topic: Pro-Code Apps
const slides_apps_pro_code = [
	{
		id: "procode-title",
		title: "Pro-Code Apps",
		content: C.titleSlide(
			"Pro-Code Apps",
			"Building React portals with @semoss/sdk",
			"105 minutes",
		),
	},
	{
		id: "procode-overview",
		title: "What are Pro-Code Apps?",
		content: `
                <h2>What are Pro-Code Apps?</h2>
                <p class="lead"><span class="highlight">Pro-Code Apps</span> are ${CONFIG.productName} applications built with modern frontend frameworks like React, using the full power of JavaScript tooling.</p>
                <p>Unlike simple HTML portals, pro-code apps use a <strong>build pipeline</strong> to compile TypeScript, bundle assets, and optimize for production.</p>
                ${C.split(
									{
										title: "Simple Apps",
										content: `
                            <ul>
                                <li>Edit <code>portals/index.html</code> directly</li>
                                <li>Vanilla JS or CDN libraries</li>
                                <li>No build step needed</li>
                                <li>Great for dashboards, reports</li>
                            </ul>
                        `,
									},
									{
										title: "Pro-Code Apps",
										content: `
                            <ul>
                                <li>Develop in <code>client/src/</code> with React</li>
                                <li>TypeScript, bundling, hot reload</li>
                                <li>Build → <code>portals/</code> deployment</li>
                                <li>Full component libraries, state management</li>
                            </ul>
                        `,
									},
								)}
                ${C.callout("Pro-code apps give you the full React ecosystem: TypeScript, Tailwind CSS, shadcn/ui components, React Router, and the <code>@semoss/sdk</code> library.", "tip")}
            `,
	},
	{
		id: "procode-structure",
		title: "Portal Folder Structure",
		content: `
                <h2>Portal Folder Structure</h2>
                <p>Pro-code apps separate <strong>source code</strong> (<code>client/</code>) from <strong>build output</strong> (<code>portals/</code>).</p>
                ${C.tree([
									{
										name: "assets/",
										type: "dir",
										children: [
											{
												name: "client/",
												type: "dir",
												desc: "← React source code",
												children: [
													{
														name: "src/",
														type: "dir",
														children: [
															{
																name: "App.tsx",
																type: "file",
																desc: "← main app component",
															},
															{
																name: "main.tsx",
																type: "file",
																desc: "← entry point",
															},
															{
																name: "components/",
																type: "dir",
																desc: "← reusable UI components",
															},
															{
																name: "pages/",
																type: "dir",
																desc: "← route pages",
															},
															{
																name: "hooks/",
																type: "dir",
																desc: "← custom React hooks",
															},
															{
																name: "types.d.ts",
																type: "file",
																desc: "← TypeScript types",
															},
														],
													},
													{
														name: "package.json",
														type: "file",
														desc: "← dependencies",
													},
													{
														name: "tsconfig.json",
														type: "file",
														desc: "← TypeScript config",
													},
													{
														name: "vite.config.ts",
														type: "file",
														desc: "← Vite bundler config",
													},
												],
											},
											{
												name: "portals/",
												type: "dir",
												desc: "← build output (published)",
												children: [
													{
														name: "index.html",
														type: "file",
														desc: "← generated entry point",
													},
													{
														name: "*.js",
														type: "file",
														desc: "← bundled JavaScript",
													},
													{
														name: "*.css",
														type: "file",
														desc: "← compiled styles",
													},
													{
														name: "assets/",
														type: "dir",
														desc: "← images, fonts",
													},
												],
											},
											{ name: "java/", type: "dir", desc: "← custom reactors" },
											{ name: "py/", type: "dir", desc: "← Python functions" },
										],
									},
								])}
                ${C.callout("<strong>Never edit</strong> <code>portals/</code> directly in a pro-code app — it gets overwritten on each build. Edit <code>client/src/</code> instead.", "warning")}
            `,
	},
	{
		id: "procode-sdk",
		title: "@semoss/sdk",
		content: `
                <h2>@semoss/sdk — The ${CONFIG.productName} API Client</h2>
                <p>The <code>@semoss/sdk</code> package provides TypeScript functions to interact with the ${CONFIG.productName} backend.</p>
                ${C.code(
									`import { runPixel, Env } from '@semoss/sdk/react';

// Configure the SDK (usually in main.tsx or App.tsx)
Env.update({
    MODULE: import.meta.env.MODULE || '/Monolith',
    ACCESS_KEY: import.meta.env.ACCESS_KEY || '',
    SECRET_KEY: import.meta.env.SECRET_KEY || '',
    APP: import.meta.env.APP || '',
});

// Run a Pixel command
const result = await runPixel('Echo("Hello!");', 'new');
console.log(result.pixelReturn[0].output);  // "Hello!"`,
									"typescript",
									"Using @semoss/sdk in React",
								)}
                <h3>Key SDK Modules</h3>
                ${C.cards([
									{
										badge: "api/base",
										title: "runPixel()",
										desc: "Execute Pixel commands and get results",
									},
									{
										badge: "api/auth",
										title: "login(), logout()",
										desc: "User authentication functions",
									},
									{
										badge: "api/engine",
										title: "Engine APIs",
										desc: "Interact with engines directly",
									},
									{
										badge: "hooks",
										title: "useInsight()",
										desc: "React hook for accessing insight context and actions",
									},
								])}
                ${C.callout("The SDK provides both imperative APIs (<code>runPixel()</code>) and React hooks (<code>useInsight()</code>) for flexible integration patterns.", "info")}
            `,
	},
	{
		id: "procode-insight-provider",
		title: "InsightProvider & SDK Integration",
		content: `
                <h2>InsightProvider — App Context</h2>
                <p>The <code>InsightProvider</code> wraps your React app to provide insight context and SDK access.</p>
                ${C.code(
									`import { InsightProvider, Env } from '@semoss/sdk/react';
import { App } from './App';

// In main.tsx or index.tsx
// Initialize with app options
ReactDOM.render(
    <InsightProvider options={{ app: 'my-app-id' }}>
        <App />
    </InsightProvider>,
    document.getElementById('root')
);`,
									"typescript",
									"client/src/main.tsx",
								)}
                <h3>useInsight() Hook — Accessing SDK Actions</h3>
                ${C.code(
									`import { useState } from 'react';
import { useInsight } from '@semoss/sdk/react';

function MyComponent() {
    // Local React state
    const [engines, setEngines] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Access SDK actions
    const { insightId, isReady, actions } = useInsight();

    // Fetch data using actions.run()
    const fetchData = async () => {
        setLoading(true);
        try {
            const { pixelReturn } = await actions.run('MyEngines();');
            setEngines(pixelReturn[0]?.output || []);
        } finally {
            setLoading(false);
        }
    };

    if (!isReady) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <p>Insight ID: {insightId}</p>
            <button onClick={fetchData} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Engines'}
            </button>
        </div>
    );
}`,
									"typescript",
									"Using useInsight() with React state",
								)}
                ${C.callout("Use React's <code>useState</code> and <code>useEffect</code> to manage component state. The SDK provides the data fetching methods via <code>actions.run()</code>.", "info")}
            `,
	},
	{
		id: "procode-styling",
		title: "Styling with Tailwind & shadcn/ui",
		content: `
                <h2>Styling with Tailwind CSS & shadcn/ui</h2>
                <p class="lead">Modern ${CONFIG.productName} portals use <strong>Tailwind CSS</strong> for utility-first styling and <strong>shadcn/ui</strong> for pre-built, customizable components.</p>
                <h3>Tailwind CSS</h3>
                <p>Utility-first CSS framework for rapid UI development:</p>
                ${C.code(
									`// Tailwind utility classes in JSX
<div className="flex items-center gap-4 p-6 bg-slate-900 rounded-lg">
    <div className="flex-1">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400">Welcome back</p>
    </div>
    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
        Action
    </button>
</div>`,
									"jsx",
									"Tailwind utility classes",
								)}
                <h3>shadcn/ui Components</h3>
                <p>Copy-paste component library built on Radix UI:</p>
                ${C.code(
									`import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
    <CardHeader>
        <CardTitle>Query Results</CardTitle>
    </CardHeader>
    <CardContent>
        <Button variant="default">Run Query</Button>
        <Button variant="outline">Cancel</Button>
    </CardContent>
</Card>`,
									"jsx",
									"shadcn/ui components",
								)}
                ${C.callout("shadcn/ui components are added to your project (not installed as a dependency), so you own the code and can customize freely.", "tip")}
            `,
	},
	{
		id: "procode-components",
		title: "Common shadcn/ui Components",
		content: `
                <h2>Common shadcn/ui Components</h2>
                <p>shadcn/ui provides production-ready components that work seamlessly with ${CONFIG.productName} portals.</p>
                ${C.table(
									["Component", "Use Case", "Example"],
									[
										[
											"<code>Button</code>",
											"Actions, form submissions",
											'<code>&lt;Button variant="default"&gt;Click&lt;/Button&gt;</code>',
										],
										[
											"<code>Card</code>",
											"Content containers, dashboards",
											"<code>&lt;Card&gt;&lt;CardHeader&gt;...&lt;/CardHeader&gt;&lt;/Card&gt;</code>",
										],
										[
											"<code>Dialog</code>",
											"Modals, confirmations",
											"<code>&lt;Dialog&gt;&lt;DialogTrigger&gt;...&lt;/DialogTrigger&gt;&lt;/Dialog&gt;</code>",
										],
										[
											"<code>Table</code>",
											"Data grids, query results",
											"<code>&lt;Table&gt;&lt;TableHeader&gt;...&lt;/TableHeader&gt;&lt;/Table&gt;</code>",
										],
										[
											"<code>Form</code>",
											"User input with validation",
											"<code>&lt;Form&gt;...&lt;FormField&gt;&lt;/FormField&gt;&lt;/Form&gt;</code>",
										],
										[
											"<code>Select</code>",
											"Dropdowns, filters",
											"<code>&lt;Select&gt;&lt;SelectTrigger&gt;...&lt;/SelectTrigger&gt;&lt;/Select&gt;</code>",
										],
										[
											"<code>Toast</code>",
											"Notifications, alerts",
											'<code>toast({ title: "Success" })</code>',
										],
										[
											"<code>Tabs</code>",
											"Multi-page layouts",
											"<code>&lt;Tabs&gt;&lt;TabsList&gt;...&lt;/TabsList&gt;&lt;/Tabs&gt;</code>",
										],
									],
								)}
                ${C.code(
									`// Installing shadcn/ui components
# Initialize shadcn/ui in your project
npx shadcn@latest init

# Add individual components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add dialog

# Components are added to client/src/components/ui/`,
									"bash",
									"Adding shadcn/ui components",
								)}
            `,
	},
	{
		id: "procode-routing",
		title: "Routing with React Router",
		content: `
                <h2>Multi-Page Apps with React Router</h2>
                <p>Use React Router for navigation between different views in your portal.</p>
                ${C.code(
									`import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { QueryBuilder } from './pages/QueryBuilder';
import { Settings } from './pages/Settings';

function App() {
    return (
        <BrowserRouter>
            <div className="flex h-screen">
                {/* Sidebar Navigation */}
                <nav className="w-64 bg-slate-900 p-4">
                    <Link to="/" className="block p-2 hover:bg-slate-800 rounded">
                        Dashboard
                    </Link>
                    <Link to="/query" className="block p-2 hover:bg-slate-800 rounded">
                        Query Builder
                    </Link>
                    <Link to="/settings" className="block p-2 hover:bg-slate-800 rounded">
                        Settings
                    </Link>
                </nav>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/query" element={<QueryBuilder />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}`,
									"typescript",
									"client/src/App.tsx with routing",
								)}
                ${C.callout("Use hash-based routing (<code>HashRouter</code>) if your portal is served from a subdirectory to avoid path conflicts.", "info")}
            `,
	},
	// COMMENTED OUT - @semoss/renderer slide
	// {
	//     id: "procode-renderer",
	//     title: "@semoss/renderer",
	//     content: `
	//         <h2>@semoss/renderer — Block-Based UI Components</h2>
	//         <p>The <code>@semoss/renderer</code> package provides the <strong>Renderer</strong> component for embedding ${CONFIG.productName} block-based UIs.</p>
	//         ${C.code(\`import { Renderer } from '@semoss/renderer';
	//
	// function MyApp() {
	//     return (
	//         <Renderer
	//             appId="my-app-project-id"
	//             insightId="my-insight-id"
	//         />
	//     );
	// }\`, 'typescript', 'Basic Renderer usage')}
	//         <h3>What is the Renderer?</h3>
	//         ${C.flow([
	//             { title: 'Block System', desc: 'JSON-driven UI components (grids, charts, forms)' },
	//             { title: 'Renderer Component', desc: 'React component that loads and displays blocks', arrow: '↓ GetAppBlocksJson()' },
	//             { title: 'User Interaction', desc: 'Blocks emit Pixel commands on user actions', arrow: '↓ user clicks button' },
	//             { title: 'Backend Processing', desc: 'Pixel runs → updates state → re-renders blocks', accent: true },
	//         ])}
	//         ${C.callout('The Renderer is a full no-code/low-code UI system. You can embed it in pro-code apps to give users a visual builder experience.', 'tip')}
	//     \`
	// },
	// {
	//     id: "procode-renderer-blocks",
	//     title: "Working with Blocks",
	//     content: \`
	//         <h2>Working with Blocks</h2>
	//         <p>Blocks are JSON configurations for UI components. The Renderer interprets them and renders React components.</p>
	//         \${C.code(\`import { Blocks, useBlock, DefaultBlocks } from '@semoss/renderer';
	//
	// function CustomBlockApp({ state }) {
	//     return (
	//         <Blocks state={state} registry={DefaultBlocks}>
	//             <MyCustomGrid />
	//             <MyCustomChart />
	//         </Blocks>
	//     );
	// }
	//
	// function MyCustomGrid() {
	//     // Access block state with useBlock hook
	//     const { data, setData, listeners, slots, insightId, attrs } = useBlock('grid-block-id');
	//
	//     // Update block data
	//     const handleUpdate = () => {
	//         setData('someField', 'new value');
	//     };
	//
	//     return (
	//         <div>
	//             {/* Render grid with block data */}
	//         </div>
	//     );
	// }\`, 'typescript', 'Custom block components')}
	//         <h3>Available Block Types</h3>
	//         \${C.table(
	//             ['Widget Name', 'Purpose', 'Config Class'],
	//             [
	//                 ['<code>grid</code>', 'Data table with sorting, filtering', '<code>GridBlockConfig</code>'],
	//                 ['<code>e-chart</code>', 'Charts (bar, line, pie, scatter)', '<code>EchartVisualizationBlockConfig</code>'],
	//                 ['<code>radio</code>', 'Radio button input', '<code>RadioBlockConfig</code>'],
	//                 ['<code>pdfViewer</code>', 'Embedded PDF viewer', '<code>PDFViewerBlockConfig</code>'],
	//                 ['<code>code</code> (cell)', 'Pixel code editor', '<code>CodeCellConfig</code> (cell type)'],
	//             ]
	//         )}
	//         \${C.callout('<strong>Note:</strong> CodeCell is in DefaultCells, not DefaultBlocks. Cells are a distinct concept from blocks in the renderer.', 'info')}
	//     \`
	// },
	{
		id: "procode-theming",
		title: "Theming with Tailwind",
		content: `
                <h2>Custom Theming with Tailwind CSS</h2>
                <p>Customize your portal's look and feel by extending Tailwind's configuration.</p>
                ${C.code(
									`// tailwind.config.js
export default {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // ${CONFIG.productName} brand colors
                brand: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    500: '#2c5f2d',  // Primary green
                    600: '#16a34a',
                    900: '#14532d',
                },
                // shadcn/ui defaults
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};`,
									"javascript",
									"tailwind.config.js",
								)}
                ${C.code(
									`/* globals.css - CSS variables for theming */
@layer base {
    :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --primary: 142 86% 28%;  /* ${CONFIG.productName} green */
        --primary-foreground: 0 0% 100%;
        --border: 214.3 31.8% 91.4%;
        --radius: 0.5rem;
    }

    .dark {
        --background: 222.2 84% 4.9%;
        --foreground: 210 40% 98%;
        --primary: 142 86% 28%;
        --primary-foreground: 0 0% 100%;
        --border: 217.2 32.6% 17.5%;
    }
}`,
									"css",
									"client/src/globals.css",
								)}
                ${C.callout("Use CSS variables for theme values so users can toggle between light and dark modes dynamically.", "tip")}
            `,
	},
	{
		id: "procode-build-workflow",
		title: "Build & Deploy Workflow",
		content: `
                <h2>Build & Deploy Workflow</h2>
                <p>Pro-code apps use a build pipeline to compile and bundle code before deployment.</p>
                ${C.flow([
									{
										title: "Develop",
										desc: "Edit code in client/src/ with hot reload",
									},
									{
										title: "Build",
										desc: "npm run build → Vite bundles to portals/",
										arrow: "↓ npm run build",
									},
									{
										title: "Publish",
										desc: `Click "Publish files" in ${CONFIG.productName} UI`,
										arrow: "↓ UI button",
									},
									{
										title: "Deploy",
										desc: "portals/ copied to public_home/<projectId>/",
										accent: true,
										arrow: "↓ copy operation",
									},
									{ title: "Live", desc: "App available at published URL" },
								])}
                ${C.code(
									`# In client/ directory
npm install        # Install dependencies
npm run dev        # Start dev server with hot reload
npm run build      # Build for production → ../portals/
npm run preview    # Preview production build locally`,
									"bash",
									"Development commands",
								)}
                ${C.callout("Always test your production build with <code>npm run preview</code> before publishing to catch build issues early.", "tip")}
            `,
	},
	{
		id: "procode-component-example",
		title: "Complete Component Example",
		content: `
                <h2>Building a Query Runner Component</h2>
                <p>Here's a complete example using shadcn/ui components and ${CONFIG.productName} SDK.</p>
                ${C.code(
									`import { useState } from 'react';
import { useInsight } from '@semoss/sdk/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function QueryRunner() {
    const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { actions, insightId } = useInsight();
    const { toast } = useToast();

    const runQuery = async () => {
        if (!query.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a query',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);
        try {
            const pixel = \`Database(database="my-db-id") | Query("<encode>\${query}</encode>");\`;
            const { pixelReturn, errors } = await actions.run(pixel);

            if (errors?.length) {
                toast({
                    title: 'Query Error',
                    description: errors.join(', '),
                    variant: 'destructive',
                });
            } else {
                setResults(pixelReturn[0]?.output || []);
                toast({
                    title: 'Success',
                    description: \`Query returned \${pixelReturn[0]?.output?.length || 0} rows\`,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>SQL Query Runner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Enter your SQL query..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={6}
                        className="font-mono"
                    />
                    <Button onClick={runQuery} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Running...' : 'Run Query'}
                    </Button>
                </CardContent>
            </Card>

            {results.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Results ({results.length} rows)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        {Object.keys(results[0]).map((key) => (
                                            <th key={key} className="p-2 text-left font-medium">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((row, i) => (
                                        <tr key={i} className="border-t">
                                            {Object.values(row).map((val: any, j) => (
                                                <td key={j} className="p-2">
                                                    {String(val)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}`,
									"typescript",
									"client/src/components/QueryRunner.tsx",
								)}
                ${C.callout("This example demonstrates error handling, loading states, toasts, and responsive data display—all common patterns in production portals.", "tip")}
            `,
	},
	{
		id: "procode-recap",
		title: "Recap",
		content: `
                <h2>Pro-Code Apps — Recap</h2>
                ${C.cards([
									{
										badge: "Stack",
										title: "React + TypeScript",
										desc: "Type-safe component development with TSX",
									},
									{
										badge: "Styling",
										title: "Tailwind + shadcn/ui",
										desc: "Utility-first CSS with copy-paste components",
									},
									{
										badge: "SDK",
										title: "@semoss/sdk",
										desc: "runPixel(), useInsight(), authentication APIs",
									},
									{
										badge: "State",
										title: "React Hooks",
										desc: "useState, useEffect for component state management",
									},
									{
										badge: "Routing",
										title: "React Router",
										desc: "Client-side navigation for multi-page apps",
									},
									{
										badge: "Workflow",
										title: "Vite Build",
										desc: "Fast HMR dev server + optimized production builds",
									},
								])}
                <h3>Key Takeaways</h3>
                <ul>
                    <li>Pro-code apps give you full control with modern React ecosystem</li>
                    <li>Usually, use shadcn/ui for production-ready, customizable components</li>
                    <li>Build → Publish workflow deploys to <code>public_home/&lt;projectId&gt;/portals/</code></li>
                </ul>
                <h3>Next Up</h3>
                <p>Custom Reactors — Extend ${CONFIG.productName} functionality with Java backend logic.</p>
            `,
	},
];
