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
                    { title: 'Engine Abstraction (IEngine)', desc: 'A uniform interface wrapping every connection', arrow: '↓ plugs in here' },
                    { title: 'Pixel Commands', desc: 'You interact with every engine the same way, regardless of what\'s underneath', arrow: '↓ talk through' },
                    { title: 'Your App', desc: 'Queries, AI answers, stored files  -  delivered to the user' }
                ])}
                ${C.callout('Everything in ' + CONFIG.productName + ' talks through engines. This uniform abstraction is what makes the platform extensible  -  swap out a database or switch AI providers without rewriting your app.', 'info')}
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
                <p>When you use the Q&amp;A tab or build a prompt in the ${CONFIG.aiName}, you are using one of these pre-configured model engines behind the scenes. You will see them listed in the Engine Catalog as read-only.</p>
                ${C.table(
                    ['What you will do today', 'What your admin handles'],
                    [
                        ['Call model engines from the Q&A tab and ' + CONFIG.aiName, 'Create model engine records and store API credentials'],
                        ['Select a model when building apps', 'Manage compute quotas and provider billing'],
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
                ${C.handson('Navigate to Engine Catalog and add a Vector Engine', `
                    <ol>
                        <li>Open ${CONFIG.productName} in your browser and click <strong>Engines</strong> in the left navigation.</li>
                        <li>Click <strong>Add Engine</strong> (top-right button).</li>
                        <li>Select the <strong>Vector</strong> engine type from the list.</li>
                        <li>Choose the vector database type available in your environment.<br>
                            <em>[Presenter will confirm which vector DB type is available in your environment]</em></li>
                        <li>Give your engine a unique name  -  for example: <code>MyVectorDB_[YourInitials]</code></li>
                        <li>Fill in any required connection fields as directed by the presenter.</li>
                        <li>Click <strong>Save</strong>. Your engine will appear in the Catalog.</li>
                    </ol>
                    <p><strong>What just happened?</strong> ${CONFIG.productName} wrote a <code>.smss</code> config file for your engine, registered it in the platform's metadata database, and it is now available to any app or workflow you build.</p>
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
                        <li>Click the <strong>Documents</strong> tab (or <strong>Upload</strong> button).</li>
                        <li>Click <strong>Add Files</strong> and select the sample FDA guidance documents provided by your presenter.</li>
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
