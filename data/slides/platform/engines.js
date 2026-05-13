// Topic: Engines  -  The Data Layer
const slides_platform_engines = [
        {
            id: "engines-title",
            title: "Engines  -  The Data Layer",
            content: C.titleSlide(
                "Engines  -  The Data Layer",
                `The pluggable abstraction that connects ${CONFIG.productName} to everything`,
                "35 minutes"
            )
        },
        {
            id: "engines-what-is",
            title: "What is an Engine?",
            content: `
                <h2>What is an Engine?</h2>
                <p class="lead">An <span class="highlight">Engine</span> is ${CONFIG.productName}'s uniform connector to any external system  -  database, AI model, file store, or custom API.</p>
                ${C.flow([
                    { title: 'Your Data, Models & Storage', desc: 'Databases, LLMs, vector stores, files  -  anything external' },
                    { title: 'Engine Abstraction (IEngine)', desc: 'A uniform interface wrapping every connection', arrow: '↓' },
                    { title: 'Pixel Commands', desc: 'You interact with every engine the same way, regardless of what\'s underneath', arrow: '↓' },
                    { title: 'Your App', desc: 'Queries, AI answers, stored files  -  delivered to the user' }
                ])}
                ${C.callout('Engines are how ' + CONFIG.productName + ' connects to everything external  -  databases, models, storage, all of it. Swap providers or change what\'s underneath without touching your app.', 'info')}
            `
        },
        {
            id: "engines-types",
            title: "Engine Types",
            content: `
                <h2>Six Engine Types</h2>
                <p>${CONFIG.productName} ships with six engine types, each designed for a different category of external system.</p>
                ${C.cards([
                    {
                        badge: 'Data',
                        title: 'Database',
                        desc: 'Connect to relational databases (Postgres, MySQL, H2, SQL Server), RDF/graph stores, and Databricks.'
                    },
                    {
                        badge: 'AI',
                        title: 'Model',
                        desc: 'Call large language models  -  OpenAI, Claude, Gemini, Bedrock, Azure OpenAI, or locally-hosted models.'
                    },
                    {
                        badge: 'RAG',
                        title: 'Vector',
                        desc: 'Store document embeddings and run semantic search via FAISS, Weaviate, PGVector, or Azure AI Search.'
                    },
                    {
                        badge: 'Infra',
                        title: 'Storage',
                        desc: 'Read and write files to S3, Azure Blob, GCS, MinIO, SFTP, or local filesystem.'
                    },
                    {
                        badge: 'Logic',
                        title: 'Function',
                        desc: 'Wrap custom Python scripts or REST endpoints so they can be called like any other engine.'
                    },
                    {
                        badge: 'Safety',
                        title: 'Guardrail',
                        desc: 'Intercept inputs and outputs for PII detection, toxicity filtering, and custom content validation.'
                    }
                ])}
            `
        },
        {
            id: "engines-model-note",
            title: "Model Engines  -  Training Note",
            content: `
                <h2>Model Engines in This Training</h2>
                ${C.callout('<strong>Note:</strong> Model engines in this training environment are pre-configured and shared. You will <em>call</em> them but not create them. This is by design  -  model engine credentials and compute are managed by your ' + CONFIG.productName + ' admin.', 'warning')}
                <p>Any time you are chatting inside ${CONFIG.productName}, you are using a model engine. They also power the Q&amp;A tab, the Playground, and any app that calls a model.</p>
                ${C.table(
                    ['What you will do today', 'What your admin handles'],
                    [
                        ['Chat inside ' + CONFIG.productName + ' (Q&A, Playground)', 'Create model engine records and store API credentials'],
                        ['Call models via API from your apps', 'Manage compute quotas and provider billing'],
                        ['View model engine details in the Catalog', 'Rotate keys and upgrade model versions']
                    ]
                )}
            `
        },
        {
            id: "engines-handson-vector",
            title: "Hands-on: Create Your Vector Engine",
            content: `
                <h2>Hands-on: Create Your Vector Engine</h2>
                ${C.handson('Create a FAISS Vector Engine', `
                    <ol>
                        <li>In the left sidebar, click <strong>Vector</strong>.</li>
                        <li>Click <strong>Add Vector</strong> (top-right button).</li>
                        <li>On the "Connect to Vector Database" page, select <strong>FAISS</strong>.</li>
                        <li>Fill in the form:
                            <ul>
                                <li><strong>Catalog Name</strong>  -  use something unique, e.g. <code>FDA_Docs_[YourInitials]</code></li>
                                <li><strong>Embedder</strong>  -  select the embedding model from the dropdown (there should be one available)</li>
                                <li>Leave <strong>Chunking Strategy</strong>, <strong>Content Length</strong>, and <strong>Content Overlap</strong> at their defaults</li>
                            </ul>
                        </li>
                        <li>Click <strong>Save</strong>. Your vector engine will appear in the Vector Catalog.</li>
                        <li>Open your engine from the Catalog, go to <strong>Settings</strong>, and copy the <strong>Engine ID</strong>  -  you will need it in later exercises.</li>
                    </ol>
                    <p><strong>What just happened?</strong> ${CONFIG.productName} created a FAISS index backed by your chosen embedding model. Any documents you add will be chunked, embedded, and stored here  -  ready for semantic search across your apps.</p>
                `)}
            `
        },
        {
            id: "engines-handson-ingest",
            title: "Hands-on: Ingest Documents",
            content: `
                <h2>Hands-on: Upload Documents into Your Vector Engine</h2>
                ${C.handson('Upload FDA guidance documents into your vector engine', `
                    <ol>
                        <li>In the Engine Catalog, find and open the vector engine you just created.</li>
                        <li>Click <strong>Add Files</strong> and select the sample FDA guidance documents provided by your presenter.</li>
                        <li>Click <strong>Embed New Document</strong> to start ingestion.</li>
                        <li>Wait for ingestion to complete  -  the platform will chunk, embed, and index each document automatically.</li>
                        <li>When finished, the document list will show your files with a green status indicator.</li>
                    </ol>
                    <p><strong>What just happened under the hood?</strong></p>
                    ${C.flow([
                        { title: '1. Upload', desc: 'Document stored in the platform' },
                        { title: '2. Chunk', desc: 'Text split into overlapping passages', arrow: '↓' },
                        { title: '3. Embed', desc: 'Each chunk converted to a vector via the configured model engine', arrow: '↓' },
                        { title: '4. Index', desc: 'Vectors written to your vector database  -  ready to search', arrow: '↓' }
                    ])}
                `)}
                ${C.callout('Use the sample FDA guidance documents provided by your presenter.', 'tip')}
            `
        },
        {
            id: "engines-qa-tab",
            title: "Vector Search Example",
            content: `
                <h2>Vector Search Example - The Q&amp;A Tab</h2>
                <p>Every Knowledge Repository has a built-in Q&amp;A interface. No app building required.</p>
                ${C.flow([
                    { title: 'Open your Knowledge Repository', desc: 'Find it under Vector in the Engine Catalog and click to open' },
                    { title: 'Click the Q&A Tab', desc: 'Built into every Knowledge Repository automatically', arrow: '↓' },
                    { title: 'Enter a question and click Generate Answer', desc: 'Ask about anything covered in your uploaded documents', arrow: '↓' },
                    { title: 'Review the Policy Extraction Response', desc: 'The platform retrieves relevant passages and generates a grounded conclusion', arrow: '↓' }
                ])}
                ${C.callout('You just got an AI-powered answer from your own documents with zero code. This is the foundation everything else builds on  -  every RAG workflow, every document Q&A app, starts here.', 'tip')}
            `
        },
        {
            id: "engines-demo-database",
            title: "Presenter Demo: Database Engine from CSV",
            content: `
                <h2>Presenter Demo</h2>
                <p class="lead">Creating a Database Engine from a CSV file</p>
                ${C.cards([
                    {
                        badge: 'Demo Step 1',
                        title: 'Navigate to Database Catalog',
                        desc: 'Shows the same Engine Catalog you used  -  but filtered to Database engines.'
                    },
                    {
                        badge: 'Demo Step 2',
                        title: 'Add Engine → File Upload',
                        desc: 'Select H2 as the database type and upload a CSV. The platform creates a relational database automatically.'
                    },
                    {
                        badge: 'Demo Step 3',
                        title: 'Explore What Was Created',
                        desc: 'The .smss config file, the H2 database file, and the OWL schema metadata  -  the same pattern as your vector engine.'
                    },
                    {
                        badge: 'Demo Step 4',
                        title: 'Query the Data',
                        desc: 'Open the engine\'s Query tab and run a SQL query against the CSV data  -  now a live database.'
                    }
                ])}
                ${C.callout('Notice the pattern: the same flow (Add Engine → configure → save → use) applies whether you\'re connecting a vector store, a database, or any other engine type.', 'info')}
            `
        }
    ];
