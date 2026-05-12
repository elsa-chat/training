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
        title: "Pixel  -  The Expression Language",
        content: `
            <h2>Pixel  -  The Expression Language</h2>
            <ul>
                <li><strong>Expression language</strong>  -  not a general-purpose programming language, purpose-built for ${CONFIG.productName}</li>
                <li><strong>Everything chains</strong>  -  the output of one command flows into the next</li>
                <li><strong>Human-readable</strong>  -  commands read like plain English verbs</li>
                <li><strong>Runs server-side</strong>  -  executes on the ${CONFIG.productName} backend, not in your browser</li>
            </ul>
            ${C.code(`## Ask a question to a model ##
LLM(
    engine=["<model-id>"],
    command=["What is ELSA?"]
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
                    desc: `Call them by name with parameters  -  you don't write them. <code>LLM(engine=["id"], command=["hello"])</code> calls the LLM reactor.`
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
        title: "The Notebook  -  Your Pixel + Python Workspace",
        content: `
            <h2>The Notebook  -  Your Pixel + Python Workspace</h2>
            ${C.flow([
                { title: "Open Notebook", desc: "From the left nav, open a Notebook in your project" },
                { title: "Add a Pixel cell", desc: "Click + and choose Pixel cell type" },
                { title: "Write your expression", desc: "Type any Pixel command  -  e.g. VectorDatabaseQuery(...)" },
                { title: "Run", desc: "Press Run or Shift+Enter to execute" },
                { title: "See the result", desc: "Output appears inline below the cell" }
            ])}
            <h3 style="margin-top: 1.2rem;">Two cell types</h3>
            <ul>
                <li><strong>Pixel cells</strong>  -  run Pixel expressions against ${CONFIG.productName} engines and reactors</li>
                <li><strong>Python cells</strong>  -  run Python directly; useful for processing, formatting, or calling libraries</li>
            </ul>
            ${C.callout(`Open your Notebook now. We'll run four exercises together.`, "info")}
        `
    },
    {
        id: "pixel-handson-1",
        title: "Hands-on: Exercise 1  -  Vector Search",
        content: `
            <h2>Hands-on: Exercise 1  -  Vector Search</h2>
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
                    <li>The returned chunks  -  document text, source file, and similarity score</li>
                    <li>How the <code>limit</code> parameter controls how many chunks come back</li>
                    <li>Which chunks score highest for your question</li>
                </ul>
                ${C.callout("Find your engine ID in the Engines catalog  -  it's the UUID shown on the engine card.", "tip")}
            `)}
        `
    },
    {
        id: "pixel-handson-2",
        title: "Hands-on: Exercise 2  -  Call the Model",
        content: `
            <h2>Hands-on: Exercise 2  -  Call the Shared Model Engine</h2>
            ${C.handson("Exercise 2: Call the Shared Model Engine", `
                <p><strong>Goal:</strong> Send a plain prompt to the shared LLM and observe the response.</p>
                <p>Add a new Pixel cell and run:</p>
                ${C.code(`LLM(
    engine=["${CONFIG.sharedModelEngineId}"],
    command=["In one paragraph, what is retrieval-augmented generation?"]
);`, "pixel")}
                <h4>What to observe</h4>
                <ul>
                    <li>The full text response returned inline in the Notebook</li>
                    <li>Response time  -  notice it's a direct model call with no context injection</li>
                </ul>
                ${C.callout(`Shared model engine ID: <code>${CONFIG.sharedModelEngineId}</code>  -  copy this into the Pixel cell above.`, "info")}
            `)}
        `
    },
    {
        id: "pixel-handson-3",
        title: "Hands-on: Exercise 3  -  Full RAG Chain in Python",
        content: `
            <h2>Hands-on: Exercise 3  -  Your First RAG Pipeline in Python</h2>
            ${C.handson("Exercise 3: RAG Pipeline across Python Cells", `
                <p><strong>Goal:</strong> Run the full RAG chain across three Python cells  -  fetch context from your vector engine and pass it inline to the LLM.</p>
                <p><strong>Cell 1 - Setup</strong><br><small>Import the Insight client, set your engine IDs and question, then instantiate the connection to the platform.</small></p>
                ${C.code(`from semoss import Insight

VECTOR_ENGINE_ID = "<your-vector-engine-id>"
MODEL_ENGINE_ID = "${CONFIG.sharedModelEngineId}"
QUESTION = "<your question about the documents>"

insight = Insight()`, "python")}
                <p><strong>Cell 2 - Vector Search</strong><br><small>Run a semantic search against your Knowledge Repository. The platform returns the top 3 document chunks most relevant to your question.</small></p>
                ${C.code(`pixel = f'VectorDatabaseQuery(engine=["{VECTOR_ENGINE_ID}"], command=["{QUESTION}"], limit=[3]);'
result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
chunks = result[0]['pixelReturn'][0]['output']
print(f"Retrieved {len(chunks)} chunks")`, "python")}
                <p><strong>Cell 3 - Build Prompt &amp; Call LLM</strong><br><small>Concatenate the retrieved chunks into a single context string, inject it directly into the prompt, then call the model. The answer is grounded in your documents.</small></p>
                ${C.code(`context_text = "\\n".join([chunk['Content'] for chunk in chunks])
prompt = f"Context:\\n{context_text}\\n\\nUsing only the context above, answer: {QUESTION}"

pixel = f'LLM(engine=["{MODEL_ENGINE_ID}"], command=["{prompt}"]);'
answer = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
print(answer[0]['pixelReturn'][0]['output']['response'])`, "python")}
                <h4>What to observe</h4>
                <ul>
                    <li>Cell 2 prints the number of chunks retrieved  -  inspect them before passing to the model</li>
                    <li>The context is string-appended directly into the prompt  -  no separate <code>context=</code> parameter</li>
                    <li>Compare the answer to Exercise 2  -  the model now has your documents as grounding</li>
                </ul>
                ${C.callout(`This is exactly what the Q&A tab does under the hood  -  now you're driving it directly from Python.`, "info")}
            `)}
        `
    },
    {
        id: "pixel-summary",
        title: "Summary  -  Pixel & Reactors",
        content: `
            <h2>Summary  -  Pixel & Reactors</h2>
            ${C.cards([
                {
                    title: "Pixel",
                    desc: `The expression language of ${CONFIG.productName}. Human-readable, chainable, runs server-side. Every UI action generates Pixel under the hood.`
                },
                {
                    title: "Reactors",
                    desc: "The executors. 1000+ built-in Java classes  -  one per command. You call them by name; you don't write them."
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
