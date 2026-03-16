// Topic: App Fundamentals
const slides_app_fundamentals = [
        {
            id: "app-title",
            title: "App Fundamentals",
            content: C.titleSlide(
                "App Fundamentals",
                `Understanding ${CONFIG.productName} applications and architecture`,
                "90 minutes"
            )
        },
        {
            id: "app-what-is",
            title: "What is an App?",
            content: `
                <h2>What is an App in ${CONFIG.productName}?</h2>
                <p class="lead">An <span class="highlight">App</span> (also called a <span class="highlight">Project</span>) is a self-contained application workspace in ${CONFIG.productName}.</p>
                <p>Apps bundle together custom code, UI components, data connections, and configuration into a deployable unit. Think of them as mini-applications built on the ${CONFIG.productName} platform.</p>
                ${C.cards([
                    { badge: 'Identity', title: 'Project ID', desc: 'Stable UUID that persists across renames' },
                    { badge: 'Storage', title: 'Git-Backed', desc: 'Built-in version control for collaboration' },
                    { badge: 'Publishing', title: 'Web-Served', desc: 'Deploy to public URLs for end users' },
                    { badge: 'Extensible', title: 'Multi-Language', desc: 'Java reactors + Python functions + React UI' },
                ])}
                ${C.callout('<strong>App vs Project:</strong> Internally called "Project" (you\'ll see ProjectId in code), but the UI calls them "Apps". Same thing.', 'info')}
            `
        },
        {
            id: "app-architecture",
            title: "Three-Layer Architecture",
            content: `
                <h2>App Architecture: Three Layers</h2>
                <p>${CONFIG.productName} apps are built with a clean separation of concerns across three technology layers:</p>
                ${C.layers([
                    {
                        label: "Presentation Layer",
                        items: [
                            { title: "React UI", desc: "assets/portals/" },
                            { title: "@semoss/sdk", desc: "API client library" },
                            // { title: "@semoss/renderer", desc: "Embed components" }
                        ]
                    },
                    {
                        label: "Application Layer",
                        accent: true,
                        items: [
                            { title: "Custom Reactors", desc: "assets/java/", accent: true },
                            { title: "Python GAAS", desc: "assets/py/", accent: true },
                            { title: "Pixel Commands", desc: "Orchestration logic", accent: true }
                        ]
                    },
                    {
                        label: "Data Layer",
                        items: [
                            { title: "Engines", desc: "Database, Model, Vector" }
                        ]
                    }
                ])}
                ${C.callout('Each layer can be developed independently. Frontend devs work in <code>portals/</code>, backend devs work in <code>java/</code> or <code>py/</code>, and they communicate via Pixel commands.', 'tip')}
            `
        },
        {
            id: "app-filesystem",
            title: "App Filesystem Structure",
            content: `
                <h2>App Filesystem Structure</h2>
                <p>Every app has a predictable on-disk structure. The <strong>assets/</strong> folder is your workspace.</p>
                ${C.tree([
                    { name: "project/", type: "dir", children: [
                        { name: "sampleProject__f1fc427c-c830-4bbe-a21d-02c6c513bfa2/", type: "dir", desc: "← folder naming pattern", children: [
                            { name: "app_root/", type: "dir", children: [
                                { name: "version/", type: "dir", desc: "← git repo root", children: [
                                    { name: ".git/", type: "dir", desc: `← managed by ${CONFIG.productName}` },
                                    { name: "assets/", type: "dir", desc: "← YOUR CODE GOES HERE", children: [
                                        { name: "portals/", type: "dir", desc: "← published UI (HTML/CSS/JS)" },
                                        { name: "client/", type: "dir", desc: "← React/Vite source (optional)" },
                                        { name: "java/", type: "dir", desc: "← custom reactors (optional)" },
                                        { name: "py/", type: "dir", desc: "← Python functions (optional)" },
                                        { name: "classes/", type: "dir", desc: "← compiled Java (generated)" },
                                        { name: "mcp/", type: "dir", desc: "← MCP tool manifests (generated)" },
                                        { name: ".admin/", type: "dir", desc: "← UI metadata" },
                                        { name: ".notebooks/", type: "dir", desc: "← saved notebooks" }
                                    ]}
                                ]}
                            ]}
                        ]},
                        { name: "sampleProject__f1fc427c-c830-4bbe-a21d-02c6c513bfa2.smss", type: "file", desc: "← project metadata" }
                    ]}
                ])}
                ${C.callout('<strong>Key Rule:</strong> Never hand-edit <code>classes/</code> or <code>mcp/</code> — they are generated. Edit <code>java/</code> and <code>py/</code> instead.', 'warning')}
            `
        },
        {
            id: "app-portals",
            title: "Portals: The UI Layer",
            content: `
                <h2>Portals — The Published UI</h2>
                <p>The <code>assets/portals/</code> folder contains the <strong>runnable web application</strong> served to end users.</p>
                ${C.split(
                    {
                        title: "Direct Editing",
                        content: `
                            <p><strong>Simple apps:</strong> Edit <code>portals/index.html</code> directly.</p>
                            <p>Use vanilla HTML/CSS/JS or include libraries via CDN.</p>
                            <p>Perfect for dashboards, reports, and static UIs.</p>
                        `
                    },
                    {
                        title: "Build Pipeline",
                        content: `
                            <p><strong>Complex apps:</strong> Develop in <code>client/</code> with React/Vite.</p>
                            <p>Build output gets copied into <code>portals/</code>.</p>
                            <p>Full modern frontend stack: TypeScript, bundling, hot reload.</p>
                        `
                    }
                )}
                ${C.code(`<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        // Read injected environment (added on publish)
        const env = JSON.parse(
            document.getElementById('semoss-env')?.textContent || '{}'
        );
        // MODULE is the platform base path (e.g., "/Monolith" or "/abc/Monolith")
        // It's injected at publish time, so you don't hardcode it.
        const MODULE = env.MODULE || '/Monolith';

        // Run a Pixel command via REST
        fetch(\`\${MODULE}/api/engine/runPixel\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expression: 'Echo("Hello from my app!");',
                insightId: 'new'
            })
        })
        .then(res => res.json())
        .then(result => console.log(result.pixelReturn));
    </script>
</body>
</html>`, 'html', 'assets/portals/index.html (simple example)')}
                ${C.callout('The platform injects <code>env.MODULE</code> at publish time to handle deployments with extra base paths (e.g., <code>/abc/Monolith</code>). Apps should always use <code>MODULE</code> so users don’t have to manage paths.', 'info')}
            `
        },
        {
            id: "app-java-layer",
            title: "Java Layer: Custom Reactors",
            content: `
                <h2>Java Layer — Custom Reactors</h2>
                <p>Apps can define <strong>project-specific reactors</strong> that extend ${CONFIG.productName} functionality.</p>
                ${C.tree([
                    { name: "assets/java/", type: "dir", children: [
                        { name: "src/", type: "dir", desc: "← source code", children: [
                            { name: "com/mycompany/reactor/", type: "dir", children: [
                                { name: "CustomReactor.java", type: "file" }
                            ]}
                        ]},
                        { name: "pom.xml", type: "file", desc: "← Maven config (optional)" }
                    ]}
                ])}
                <h3>Compilation Flow</h3>
                ${C.flow([
                    { title: 'Write Code', desc: 'Create reactors in assets/java/src/' },
                    { title: 'Recompile', desc: 'UI button or CompileAppReactors(project="<projectId>")', arrow: '↓ "Recompile reactors"' },
                    { title: 'Compile', desc: `${CONFIG.productName} compiles .java → .class`, arrow: '↓ javac or Maven' },
                    { title: 'Load', desc: '.class files written to assets/classes/', arrow: '↓ dynamic loading' },
                    { title: 'Available', desc: 'Call from Pixel: MyReactor();', accent: true }
                ])}
                ${C.callout(`If you use Maven (<code>pom.xml</code>), ${CONFIG.productName} will automatically resolve dependencies. Otherwise, it does simple <code>javac</code> compilation.`, 'info')}
            `
        },
        {
            id: "app-python-layer",
            title: "Python Layer: GAAS Functions",
            content: `
                <h2>Python Layer — GAAS Functions</h2>
                <p>Python code runs out-of-process via <strong>GAAS</strong> (Generative AI Agent Services). Apps can bundle Python modules for custom logic.</p>
                ${C.tree([
                    { name: "assets/py/", type: "dir", children: [
                        { name: "my_module.py", type: "file", desc: "← custom Python modules" },
                        { name: "smss_driver.py", type: "file", desc: "← legacy name" },
                        { name: "requirements.txt", type: "file", desc: "← pip dependencies" }
                    ]}
                ])}
                ${C.code(`# assets/py/my_module.py
def process_data(data):
    """Custom data processing function."""
    # Your Python logic here
    return {"processed": True, "count": len(data)}

def call_llm(prompt):
    """Call an LLM via ${CONFIG.productName}."""
    # Use GAAS to call engines
    return "LLM response"`, 'python', 'assets/py/my_module.py (example)')}
                <h3>Loading Python Code</h3>
                ${C.code(`// Load Python module from app's py/ folder
LoadPyFromFileProjectPy(
    filePath="version/assets/py/my_module.py",
    alias="my_module",
    space="<projectId>"
);

// Call a function (code wrapped in <encode> blocks)
result = Py("<encode>my_module.process_data({'key': 'value'})</encode>");`, 'pixel', 'Pixel commands to load and run Python')}
            `
        },
        {
            id: "app-publishing",
            title: "Publishing Workflow",
            content: `
                <h2>Publishing Workflow</h2>
                <p>Publishing makes your app's UI available to end users at a public URL.</p>
                <h4>Publishing Steps</h4>
                <ol>
                    <li><strong>Developer</strong> clicks "Publish" button in ${CONFIG.productName} UI</li>
                    <li><strong>${CONFIG.productName}</strong> copies <code>assets/portals/</code> → <code>public_home/<projectId>/portals/</code></li>
                    <li><strong>Web Server</strong> serves the files via HTTP</li>
                    <li><strong>Live URL:</strong> <code>&lt;base-url&gt;/public_home/&lt;projectId&gt;/portals/index.html</code></li>
                </ol>
                <h3>Key Points</h3>
                <ul>
                    <li>Only <code>assets/portals/</code> is published — <code>java/</code>, <code>py/</code>, <code>client/</code> are NOT served</li>
                    <li>Publishing is a <strong>copy operation</strong> (or symlink, depending on config)</li>
                    <li><strong>Default:</strong> public home is enabled in standard deployments. If disabled, set <code>public_home_enable=true</code> in the project <code>.smss</code></li>
                    <li>URL pattern: <code>&lt;base-url&gt;/public_home/&lt;projectId&gt;/portals/index.html</code></li>
                    <li>Re-publish after every <code>portals/</code> change to update the live site</li>
                </ul>
                ${C.callout('<strong>Tip:</strong> During development, work directly in <code>assets/portals/</code> and publish frequently to test changes.', 'tip')}
            `
        },
        {
            id: "app-versioning",
            title: "Versioning & Git",
            content: `
                <h2>Versioning & Git Integration</h2>
                <p>Every app's <code>app_root/version/</code> folder is a <strong>git repository</strong> managed by ${CONFIG.productName}.</p>
                ${C.cards([
                    { badge: 'Auto-Init', title: 'Git Repo', desc: `${CONFIG.productName} initializes .git/ when you create an app` },
                    { badge: 'Commits', title: 'Version History', desc: 'UI actions trigger commits automatically' },
                    { badge: 'Sync', title: 'Cloud Sync', desc: 'Push/pull to remote repos for collaboration' },
                    { badge: 'Rollback', title: 'Time Travel', desc: 'Revert to previous versions via git history' },
                ])}
                ${C.code(`# Navigate to app folder
cd project/MyApp__<projectId>/app_root/version/

# Check git status
git status

# View commit history
git log --oneline

# Create a branch for experimentation
git checkout -b experimental-feature

# Push to remote (if configured)
git push origin main`, 'bash', 'Git commands in app_root/version/')}
                ${C.callout(`${CONFIG.productName} manages git commits for UI actions (save, publish, etc.), but you can also use <code>git</code> CLI directly for advanced workflows.`, 'info')}
            `
        },
        {
            id: "app-context-reactors",
            title: "Set Context & Load App Reactors",
            content: `
                <h2>Set Context & Load App Reactors</h2>
                <p><code>SetContext(projectId)</code> switches the active project for your insight. Once set, the app's custom reactors are available.</p>
                ${C.code(`// Switch your insight to an app context
SetContext("e258b9dd-6114-4928-b376-15edf191f4bd");

// Now you can call app reactors by name
SampleApp();`, 'pixel')}
                ${C.callout('Think of <code>SetContext</code> as “load this app into the current insight.” It makes the app’s reactors and assets available in that context.', 'info')}
            `
        },
        {
            id: "app-handson",
            title: "Hands-on: Create an App",
            content: `
                <h2>Hands-on: Create Your First App</h2>
                ${C.handson(`Build a Simple ${CONFIG.productName} App`, `
                    <h4>Step 1: Create the App</h4>
                    <ol>
                        <li>In ${CONFIG.productName} UI, click <strong>Create New App</strong></li>
                        <li>Name it "Training App"</li>
                        <li>Note the <strong>Project ID</strong> shown in the URL</li>
                    </ol>

                    <h4>Step 2: Explore the File Structure</h4>
                    <p>Open the app's file browser in the UI. You should see:</p>
                    ${C.code(`assets/
  portals/
  .admin/
  .notebooks/`, 'text')}

                    <h4>Step 3: Create a Simple Portal</h4>
                    <p>Edit <code>assets/portals/index.html</code> with this content:</p>
                    ${C.code(`<!DOCTYPE html>
<html>
<head>
    <title>Training App</title>
    <style>
        body { font-family: sans-serif; padding: 2rem; }
        h1 { color: #2c5f2d; }
    </style>
</head>
<body>
    <h1>Hello from ${CONFIG.productName}!</h1>
    <p>This is my first ${CONFIG.productName} app.</p>
    <button onclick="runPixelCmd()">Run Pixel</button>
    <pre id="output"></pre>

    <script type="module">
        // Read injected environment (added on publish)
        const env = JSON.parse(
            document.getElementById('semoss-env')?.textContent || '{}'
        );
        const MODULE = env.MODULE || '/Monolith';

        async function runPixelCmd() {
            const res = await fetch(\`\${MODULE}/api/engine/runPixel\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    expression: 'Echo("Hello, World!");',
                    insightId: 'new'
                })
            });
            const { pixelReturn, errors } = await res.json();
            document.getElementById('output').textContent =
                JSON.stringify(pixelReturn, null, 2);
        }

        // Make function global for onclick
        window.runPixelCmd = runPixelCmd;
    </script>
</body>
</html>`, 'html')}

                    <h4>Step 4: Publish the App</h4>
                    <ol>
                        <li>Click <strong>Publish files</strong> in the app UI</li>
                        <li>Open the published URL: <code>&lt;base-url&gt;/public_home/&lt;projectId&gt;/portals/index.html</code></li>
                        <li>Click the "Run Pixel" button to test the SDK integration</li>
                    </ol>

                    <h4>Step 5: Check Git History</h4>
                    ${C.code(`cd project/Training\\ App__<projectId>/app_root/version/
git log --oneline`, 'bash')}
                `)}
            `
        },
        {
            id: "app-recap",
            title: "Recap",
            content: `
                <h2>App Fundamentals — Recap</h2>
                ${C.cards([
                    { badge: 'Concept', title: 'Apps = Projects', desc: 'Self-contained workspaces with UUID identity and git versioning' },
                    { badge: 'Structure', title: 'assets/ Folder', desc: 'portals/ (UI) + java/ (reactors) + py/ (functions)' },
                    { badge: 'Architecture', title: 'Three Layers', desc: 'React frontend + Java/Python backend + Pixel orchestration' },
                    { badge: 'Publishing', title: 'portals/ → public_home/', desc: 'Copy UI to web-served directory for end users' },
                    { badge: 'Versioning', title: 'Git-Backed', desc: 'Automatic version control with commit history' },
                    { badge: 'Context', title: 'SetContext', desc: 'Load an app into the current insight to access its reactors' },
                ])}
                <h3>Next Up</h3>
                <p>Pro-Code Apps — Build sophisticated React portals with <code>@semoss/sdk</code>.</p>
            `
        }
    ];
