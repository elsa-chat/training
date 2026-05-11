// Topic: Pixel & Reactors
const slides_platform_pixel_reactors = [
    {
        id: "pixel-title",
        title: "Pixel & Reactors",
        content: C.titleSlide(
            "Pixel & Reactors",
            `The language and logic layer of ${CONFIG.productName}`,
            "50 minutes"
        )
    },
    {
        id: "pixel-what-is",
        title: "Pixel — The Expression Language",
        content: `
            <h2>Pixel — The Expression Language</h2>
            <ul>
                <li><strong>Expression language</strong> — not a general-purpose programming language, purpose-built for ${CONFIG.productName}</li>
                <li><strong>Everything chains</strong> — the output of one command flows into the next</li>
                <li><strong>Human-readable</strong> — commands read like plain English verbs</li>
                <li><strong>Runs server-side</strong> — executes on the ${CONFIG.productName} backend, not in your browser</li>
            </ul>
            ${C.code(`## Ask a question to a model ##
LLM(
    engine=["<model-id>"],
    command=["<encode>What is ELSA?</encode>"]
);

## Search a vector database for relevant document chunks ##
VectorDatabaseQuery(
    engine=["<vector-id>"],
    command=["<your question>"],
    limit=[3]
);`, "pixel")}
            ${C.callout(`You already ran Pixel when you used the Q&A tab on your vector engine. Now you'll write it yourself.`, "info")}
        `
    },
    {
        id: "pixel-reactors-concept",
        title: "What is a Reactor?",
        content: `
            <h2>What is a Reactor?</h2>
            ${C.cards([
                {
                    title: "What it is",
                    desc: `A Java class that executes when you run a Pixel command. Every command name maps to exactly one reactor.`
                },
                {
                    title: "What you do",
                    desc: `Call them by name with parameters — you don't write them. <code>LLM(engine=["id"], command=["hello"])</code> calls the LLM reactor.`
                },
                {
                    title: "Why it matters",
                    desc: `Every capability in ${CONFIG.productName} is a reactor. Knowing they exist tells you what's possible.`
                }
            ])}
            ${C.callout(`There are 1000+ built-in reactors. The ones you'll use most: <code>LLM</code>, <code>VectorDatabaseQuery</code>, <code>Py</code>, <code>Database</code>, <code>SaveAsset</code>.`, "tip")}
        `
    },
    {
        id: "pixel-notebook-intro",
        title: "The Notebook — Your Pixel + Python Workspace",
        content: `
            <h2>The Notebook — Your Pixel + Python Workspace</h2>
            ${C.flow([
                { title: "Open Notebook", desc: "From the left nav, open a Notebook in your project", accent: true },
                { title: "Add a Pixel cell", desc: "Click + and choose Pixel cell type" },
                { title: "Write your expression", desc: "Type any Pixel command — e.g. VectorDatabaseQuery(...)" },
                { title: "Run", desc: "Press Run or Shift+Enter to execute", accent: true },
                { title: "See the result", desc: "Output appears inline below the cell" }
            ])}
            <h3 style="margin-top: 1.2rem;">Two cell types</h3>
            <ul>
                <li><strong>Pixel cells</strong> — run Pixel expressions against ${CONFIG.productName} engines and reactors</li>
                <li><strong>Python cells</strong> — run Python directly; useful for processing, formatting, or calling libraries</li>
            </ul>
            ${C.callout(`Open your Notebook now. We'll run four exercises together.`, "info")}
        `
    },
    {
        id: "pixel-handson-1",
        title: "Hands-on: Exercise 1 — Vector Search",
        content: `
            <h2>Hands-on: Exercise 1 — Vector Search</h2>
            ${C.handson("Exercise 1: Query Your Vector Engine", `
                <p><strong>Goal:</strong> Retrieve relevant document chunks from your vector engine using a semantic search.</p>
                <p>Add a Pixel cell and run:</p>
                ${C.code(`VectorDatabaseQuery(
    engine=["<your-vector-engine-id>"],
    command=["<type a question about your documents>"],
    limit=[5]
);`, "pixel")}
                <h4>What to observe</h4>
                <ul>
                    <li>The returned chunks — document text, source file, and similarity score</li>
                    <li>How the <code>limit</code> parameter controls how many chunks come back</li>
                    <li>Which chunks score highest for your question</li>
                </ul>
                ${C.callout("Find your engine ID in the Engines catalog — it's the UUID shown on the engine card.", "tip")}
            `)}
        `
    },
    {
        id: "pixel-handson-2",
        title: "Hands-on: Exercise 2 — Call the Model",
        content: `
            <h2>Hands-on: Exercise 2 — Call the Shared Model Engine</h2>
            ${C.handson("Exercise 2: Call the Shared Model Engine", `
                <p><strong>Goal:</strong> Send a plain prompt to the shared LLM and observe the response.</p>
                <p>Add a new Pixel cell and run:</p>
                ${C.code(`LLM(
    engine=["<shared-model-engine-id>"],
    command=["<encode>In one paragraph, what is retrieval-augmented generation?</encode>"]
);`, "pixel")}
                <h4>What to observe</h4>
                <ul>
                    <li>The full text response returned inline in the Notebook</li>
                    <li>Response time — notice it's a direct model call with no context injection</li>
                </ul>
                ${C.callout("The presenter will share the shared model engine ID on the screen now.", "info")}
            `)}
        `
    },
    {
        id: "pixel-handson-3",
        title: "Hands-on: Exercise 3 — Full RAG Chain",
        content: `
            <h2>Hands-on: Exercise 3 — Your First RAG Pipeline</h2>
            ${C.handson("Exercise 3: Your First RAG Pipeline", `
                <p><strong>Goal:</strong> Chain vector search into a model call — this is the core pattern behind every AI Q&A app.</p>
                <p>Add a Pixel cell and run — replace <strong>both</strong> instances of <code>YOUR QUESTION</code> with the same question:</p>
                ${C.code(`## Step 1: get relevant context from your vector engine ##
context = VectorDatabaseQuery(
    engine=["<your-vector-engine-id>"],
    command=["YOUR QUESTION"],
    limit=[3]
);

## Step 2: pass the retrieved chunks as system prompt, question as command ##
LLM(
    engine=["<shared-model-engine-id>"],
    context=[context],
    command=["<encode>Using only the provided context, answer: YOUR QUESTION</encode>"]
);`, "pixel")}
                <h4>What to observe</h4>
                <ul>
                    <li>The <code>context</code> parameter sends the retrieved chunks to the model as its system prompt</li>
                    <li>The <code>command</code> parameter is your question — the model sees context first, then the question</li>
                    <li>Compare the answer quality to Exercise 2 — the model now has your documents</li>
                </ul>
                ${C.callout(`This is exactly what the Q&A tab does under the hood — now you're driving it directly.`, "info")}
            `)}
        `
    },
    {
        id: "pixel-handson-4",
        title: "Hands-on: Exercise 4 — Python Cell",
        content: `
            <h2>Hands-on: Exercise 4 — Python Cell in Notebook</h2>
            ${C.handson("Exercise 4: Python Cell in Notebook", `
                <p><strong>Goal:</strong> Show that Python and Pixel cells coexist — process the RAG result with Python.</p>
                <p>After running Exercise 3, add a <strong>Python cell</strong> below it:</p>
                ${C.code(`# The result from the previous Pixel cell is available as a string
# Use Python to reformat or extract from it
result = "paste your RAG result here"
words = len(result.split())
print(f"Response length: {words} words")
print(f"First 100 chars: {result[:100]}")`, "python")}
                <h4>What to observe</h4>
                <ul>
                    <li>Python executes in the same Notebook session as your Pixel cells</li>
                    <li>You can use any standard Python library for post-processing</li>
                </ul>
                ${C.callout("Python cells are useful for data processing, formatting, or calling libraries. Pixel and Python can pass data between each other.", "tip")}
            `)}
        `
    },
    {
        id: "pixel-summary",
        title: "Summary — Pixel & Reactors",
        content: `
            <h2>Summary — Pixel & Reactors</h2>
            ${C.cards([
                {
                    title: "Pixel",
                    desc: "The expression language of ${CONFIG.productName}. Human-readable, chainable, runs server-side. Every UI action generates Pixel under the hood."
                },
                {
                    title: "Reactors",
                    desc: "The executors. 1000+ built-in Java classes — one per command. You call them by name; you don't write them."
                },
                {
                    title: "Notebook",
                    desc: "Your workspace for writing and running Pixel and Python side by side. The fastest way to explore and prototype."
                },
                {
                    title: "RAG Pattern",
                    desc: "<code>VectorDatabaseQuery</code> → <code>LLM</code>. This two-step chain is the foundation of every AI Q&A application."
                }
            ])}
            ${C.callout(`Tomorrow you'll wrap this RAG chain into an MCP tool so an AI agent can call it on demand.`, "info")}
        `
    }
];
