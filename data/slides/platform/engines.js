// Topic: Engines: The Resource Layer
const slides_platform_engines = [
        {
            id: "engines-title",
            title: "Engines: The Resource Layer",
            content: C.titleSlide(
                "Engines: The Resource Layer",
                `The pluggable abstraction that connects ${CONFIG.productName} to everything`,
                "90 minutes"
            )
        },
        {
            id: "engines-what-are",
            title: "What are Engines?",
            content: `
                <h2>What are Engines?</h2>
                <p class="lead">An <span class="highlight">Engine</span> is ${CONFIG.productName}'s pluggable abstraction for connecting to external systems.</p>
                <p>Think of engines as <strong>managed connectors</strong>. Each engine wraps a connection to an external service and exposes a uniform interface.</p>
                ${C.flow([
                    { title: 'IEngine', desc: 'Base interface — open(), close(), getEngineName(), getEngineId()', accent: true },
                    { title: 'Type-Specific Interface', desc: 'IDatabaseEngine, IModelEngine, IVectorDatabaseEngine, etc.', arrow: 'extends' },
                    { title: 'Implementation Class', desc: 'e.g., H2EmbeddedServerEngine, OpenAiEngine, FaissDatabase', arrow: 'implements' },
                    { title: '.smss Config', desc: 'Key-value file that configures the implementation' },
                ])}
                ${C.callout(`<strong>Key insight:</strong> Everything in ${CONFIG.productName} talks through engines — databases, AI models, file storage, custom APIs. This uniform abstraction is what makes the platform extensible.`, 'info')}
            `
        },
        {
            id: "engines-types",
            title: "Engine Types",
            content: `
                <h2>Six Engine Types</h2>
                ${C.cards([
                    { badge: 'Data', title: 'Database', desc: '<code>IDatabaseEngine</code> — RDBMS (H2, Postgres, MySQL), RDF/Graph, Databricks' },
                    { badge: 'AI', title: 'Model', desc: '<code>IModelEngine</code> — LLMs via GAAS: OpenAI, Claude, Gemini, local models' },
                    { badge: 'AI', title: 'Vector', desc: '<code>IVectorDatabaseEngine</code> — FAISS, Weaviate, PGVector, ChromaDB' },
                    { badge: 'Infra', title: 'Storage', desc: '<code>IStorageEngine</code> — Local filesystem, S3, Azure Blob, GCS, MinIO' },
                    { badge: 'Logic', title: 'Function', desc: '<code>IFunctionEngine</code> — Custom API endpoints, Python scripts, reusable logic' },
                    { badge: 'Safety', title: 'Guardrail', desc: '<code>IGuardrailReactorFunctionEngine</code> — PII detection, content filtering, validation' },
                ])}
            `
        },
        {
            id: "engines-interface-hierarchy",
            title: "Interface Hierarchy",
            content: `
                <h2>Engine Interface Hierarchy</h2>
                <p>All engine types share a common ancestor and follow the same lifecycle:</p>
                ${C.code(`// src/prerna/engine/api/IEngine.java
public interface IEngine {
    void open(Properties smssProp) throws Exception;
    void close() throws IOException;

    String getEngineId();
    String getEngineName();
    CATALOG_TYPE getCatalogType();

    // Engine types enum
    enum CATALOG_TYPE {
        DATABASE, MODEL, VECTOR, STORAGE, FUNCTION, GUARDRAIL, VENV, PROJECT
    }
}

// src/prerna/engine/api/IDatabaseEngine.java
public interface IDatabaseEngine extends IEngine {
    Object execQuery(String query);
    void insertData(String query);
    DATABASE_TYPE getDatabaseType();
}

// src/prerna/engine/api/IModelEngine.java
public interface IModelEngine extends IEngine {
    // Routed through Python GAAS layer
    MODEL_TYPE getModelType(); // TEXT_GENERATION, EMBEDDINGS
}`, 'java', 'Engine Interface Hierarchy — src/prerna/engine/api/')}
            `
        },
        {
            id: "engines-smss",
            title: ".smss Configuration Files",
            content: `
                <h2>.smss Configuration Files</h2>
                <p>Every engine has its configuration as a <code>.smss</code> (SEMOSS Settings) file — a text based key-value format.</p>
                <h3>Required Values For Each Engine</h3>
                <ul>
                    <li><code>ENGINE</code> — <code>&lt;UUID&gt;</code></li>
                    <li><code>ENGINE_ALIAS</code> — <code>&lt;The Display Name&gt;</code></li>
                    <li><code>ENGINE_TYPE</code> — <code>&lt;The Java Fully Qualified Name&gt;</code></li>
                </ul>
                <p class="muted">Other <code>.smss</code> fields depend on the specific engine implementation class. These values can also be stored in a secret store based on your deployment.</p>
                ${C.split(
                    {
                        title: 'Database Engine .smss',
                        content: C.code(`#Base Properties
ENGINE	877ecba9-9125-40b8-9eb4-b82dbefc92cf
ENGINE_ALIAS AuditLogs
ENGINE_TYPE	prerna.engine.impl.rdbms.RDBMSNativeEngine
OWL	AuditLogs_OWL.OWL

RDBMS_TYPE	postgres
DATABASE	semoss_audit
SCHEMA	public
DRIVER	org.postgresql.Driver
USERNAME	myuser
PASSWORD	mypassword
CONNECTION_URL	jdbc:postgresql://db:5432/semoss_audit?currentSchema=public
USE_CONNECTION_POOLING	true
POOL_MIN_SIZE       10
POOL_MAX_SIZE       50
AUTO_COMMIT         false

DATABASE_ZONEID UTC`, 'properties', 'db/AuditLogs.smss')
                    },
                    {
                        title: 'Key Fields',
                        content: `
                            <ul>
                                <li><code>ENGINE</code> — the unique ID that anchors everything (<strong>required</strong>)</li>
                                <li><code>ENGINE_ALIAS</code> — the human-friendly name shown in the UI (<strong>required</strong>)</li>
                                <li><code>ENGINE_TYPE</code> — the implementation class that defines the rest (<strong>required</strong>)</li>
                                <li>All other fields are implementation-specific for <code>prerna.engine.impl.rdbms.RDBMSNativeEngine</code></li>
                            </ul>
                        `
                    }
                )}
            `
        },
        {
            id: "engines-database-deep",
            title: "Database Engines",
            content: `
                <h2>Database Engines — Deep Dive</h2>
                ${C.split(
                    {
                        title: 'Supported Types',
                        content: `
                            <p><strong>${CONFIG.productName} can connect to almost ALL major databases</strong> via JDBC drivers. Common examples:</p>
                            <ul>
                                <li><strong>H2</strong> — Embedded (local master DB)</li>
                                <li><strong>PostgreSQL</strong> — Primary RDBMS</li>
                                <li><strong>MySQL / MariaDB</strong></li>
                                <li><strong>SQL Server / Oracle</strong></li>
                                <li><strong>Databricks</strong></li>
                                <li><strong>RDF / Sesame</strong> — Triple stores</li>
                            </ul>
                            <p><em>And many more — any JDBC-compatible database is supported!</em></p>
                        `
                    },
                    {
                        title: 'Each Engine Has',
                        content: `
                            <ul>
                                <li>A <strong>JDBC connection</strong> (pooled)</li>
                                <li>An <strong>OWL metadata layer</strong></li>
                                <li>Registered in <strong>LocalMasterDatabase</strong></li>
                            </ul>
                        `
                    }
                )}
                ${C.code(`# Base Properties
ENGINE	877ecba9-9125-40b8-9eb4-b82dbefc92cf	# unique engine id
ENGINE_ALIAS AuditLogs	# display name in UI
ENGINE_TYPE	prerna.engine.impl.rdbms.RDBMSNativeEngine	# implementation class
OWL	AuditLogs_OWL.OWL	# metadata schema file

# Database Connection
RDBMS_TYPE	postgres	# rdbms type
DATABASE	semoss_audit	# database name
SCHEMA	public	# schema name
DRIVER	org.postgresql.Driver	# JDBC driver class
USERNAME	myuser	# database user
PASSWORD	mypassword	# database password
CONNECTION_URL	jdbc:postgresql://db:5432/semoss_audit?currentSchema=public	# JDBC URL
USE_CONNECTION_POOLING	true	# enable pooling
POOL_MIN_SIZE       10	# min connections
POOL_MAX_SIZE       50	# max connections
AUTO_COMMIT         false	# transaction behavior

DATABASE_ZONEID UTC	# database timezone`, 'properties', 'Example Database Engine .smss')}
                ${C.code(`// How a database query flows through the system
// 1. Pixel command (uses engine ID, not name)
Database(database="bd1dea64-ec6b-49af-9308-94b05551c83d") | Query("SELECT * FROM users LIMIT 10");

// 2. Java: DatabaseReactor resolves the engine by ID
IDatabaseEngine engine = Utility.getDatabase("bd1dea64-ec6b-49af-9308-94b05551c83d");

// 3. Java: QueryReactor executes against the engine
Object result = engine.execQuery(sqlString);

// 4. Results wrapped in NounMetadata and returned`, 'java', 'Database Query Flow')}
                ${C.callout(`<strong>System Databases</strong> — ${CONFIG.productName} uses multiple internal databases for different concerns.<br>
                ${C.table(
                    ['Database', 'What it Stores'],
                    [
                        ['<code>LocalMasterDatabase</code>', 'Core metadata for engines, projects, users, and permissions'],
                        ['<code>Security DB</code>', 'Authorization and security-related metadata'],
                        ['<code>Scheduler DB</code>', 'Scheduled jobs, triggers, and run history (if enabled)'],
                        ['<code>Model Logs DB</code>', 'Model/LLM request + response logs and related telemetry (if enabled)'],
                        ['<code>Audit Logs DB</code>', 'Audit events for user/system actions (if enabled)'],
                        ['<code>Themes DB</code>', 'UI themes and styling configuration'],
                        ['<code>Prompt DB</code>', 'Prompt templates, reusable prompt assets, and prompt metadata'],
                    ]
                )}`, 'info')}
            `
        },
        {
            id: "engines-model-deep",
            title: "Model Engines",
            content: `
                <h2>Model Engines — LLM Integration</h2>
                <p>Model engines connect to AI providers. All inference routes through the Python GAAS layer.</p>
                ${C.sequence(
                    ['Pixel', 'LLMReactor', 'GAAS (Python)', 'Provider API'],
                    [
                        { from: 0, to: 1, label: 'LLM(engine="e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b", command="...")' },
                        { from: 1, to: 2, label: 'TCP: model_engine.ask(prompt, params)' },
                        { from: 2, to: 3, label: 'openai.chat.completions.create(...)' },
                        { from: 3, to: 2, label: 'completion response', type: 'response' },
                        { from: 2, to: 1, label: 'text result via TCP', type: 'response' },
                        { from: 1, to: 0, label: 'NounMetadata(CONST_STRING)', type: 'response' },
                    ]
                )}
                <h3>Supported Providers</h3>
                ${C.table(
                    ['Provider', 'Model Type', 'Config Key'],
                    [
                        ['OpenAI', 'TEXT_GENERATION, EMBEDDINGS', '<code>OPENAI_API_KEY</code>'],
                        ['Anthropic (Claude)', 'TEXT_GENERATION', '<code>ANTHROPIC_API_KEY</code>'],
                        ['Azure OpenAI', 'TEXT_GENERATION, EMBEDDINGS', '<code>AZURE_*</code> keys'],
                        ['Google (Gemini)', 'TEXT_GENERATION', '<code>GOOGLE_API_KEY</code>'],
                        ['AWS Bedrock', 'TEXT_GENERATION', 'AWS credentials'],
                        ['Local (GGUF/HF)', 'TEXT_GENERATION, EMBEDDINGS', 'Model path on disk'],
                    ]
                )}
            `
        },
        {
            id: "engines-vector-deep",
            title: "Vector Engines",
            content: `
                <h2>Vector Engines — Embeddings & Search</h2>
                <p>Vector engines enable <strong>RAG</strong> (Retrieval-Augmented Generation) by storing document embeddings and supporting semantic search.</p>
                ${C.flow([
                    { title: '1. Ingest Documents', desc: 'Upload PDFs, CSVs, text files' },
                    { title: '2. Chunk', desc: 'Split documents into smaller passages', arrow: '↓ chunking strategy' },
                    { title: '3. Embed', desc: 'Convert chunks to vectors via Model Engine', accent: true, arrow: '↓ model.embed()' },
                    { title: '4. Store', desc: 'Write vectors + metadata to vector DB', arrow: '↓ FAISS / Weaviate / PGVector' },
                    { title: '5. Query', desc: 'User asks a question → embed query → nearest neighbor search' },
                ])}
                ${C.code(`// Pixel: Add documents to a vector engine
VectorDatabaseUpload(
    engine="a1b2c3d4-5e6f-7890-abcd-ef1234567890",
    filePath="/path/to/document.pdf"
);

// Pixel: Search the vector engine
VectorDatabaseQuery(
    engine="a1b2c3d4-5e6f-7890-abcd-ef1234567890",
    searchStatement="What is the refund policy?",
    limit=5
);`, 'pixel', 'Vector Engine — Pixel Commands')}
            `
        },
        {
            id: "engines-storage",
            title: "Storage Engines",
            content: `
                <h2>Storage Engines</h2>
                ${C.cards([
                    { badge: 'Storage', title: 'Local', desc: 'Server filesystem — default for dev. Path-based access.' },
                    { badge: 'Storage', title: 'S3 / MinIO', desc: 'Object storage — bucket + key. Used in production.' },
                    { badge: 'Storage', title: 'Azure Blob', desc: 'Container + blob path. Enterprise deployments.' },
                ])}
                ${C.code(`// Storage engine — pull file from storage
Storage(storage="8be5fb68-ffab-47bd-af2a-cd409b51e732")
    | PullFromStorage(storagePath="/your/storage/path", filePath="/your/local/path");`, 'pixel', 'Storage — Pixel Command')}
            `
        },
        {
            id: "engines-function",
            title: "Function Engines",
            content: `
                <h2>Function Engines</h2>
                ${C.cards([
                    { badge: 'Function', title: 'Custom APIs', desc: 'Wrap external REST APIs as callable engine functions.' },
                    { badge: 'Function', title: 'Python Scripts', desc: `Execute Python code as a ${CONFIG.productName} function engine.` },
                ])}
                ${C.code(`// Function engine — call weather API
ExecuteFunctionEngine(
    engine="06383ab4-4738-4fe8-a7e9-737a14da737d",
    map=[{"city": "Madrid", "units": "metric", "lang": "es"}]
);`, 'pixel', 'Function — Pixel Command')}
            `
        },
        {
            id: "engines-guardrail",
            title: "Guardrail Engines",
            content: `
                <h2>Guardrail Engines</h2>
                ${C.cards([
                    { badge: 'Guardrail', title: 'Validation', desc: 'Pre/post processing for LLM I/O — PII, toxicity, custom rules.' },
                ])}
                <p class="muted">Guardrail engines enforce safety and policy checks for AI workflows.</p>
            `
        },
        {
            id: "engines-lifecycle",
            title: "Engine Lifecycle",
            content: `
                <h2>Engine Lifecycle</h2>
                ${C.flow([
                    { title: '1. Create', desc: 'User creates via UI or API call' },
                    { title: '2. Write .smss', desc: 'Config file written to db/ | model/ | vector/ etc.', arrow: '↓' },
                    { title: '3. Register', desc: 'Entry added to Security DB (all engines) and LocalMasterDatabase (database engines)', accent: true, arrow: '↓' },
                    { title: '4. Open', desc: 'engine.open(smssProperties) — connection established', arrow: '↓' },
                    { title: '5. Use', desc: 'Reactors interact with engine via interface methods', arrow: '↓' },
                    { title: '6. Sync (optional)', desc: 'SMSS watcher syncs to cloud storage for cluster deployments' },
                ])}
                ${C.code(`// Utility.java — how ${CONFIG.productName} loads an engine on startup
// Note: Actual signature is private static with 2 params, simplified here for teaching
private static IEngine loadEngine(String smssFilePath, Properties smssProp) {
    Properties props = (smssProp != null) ? smssProp : Utility.loadProperties(smssFilePath);
    String engineClass = props.getProperty("ENGINE_TYPE");

    IEngine engine = (IEngine) Class.forName(engineClass).newInstance();
    engine.open(props);  // establish connection

    return engine;
}`, 'java', 'Engine Loading — src/prerna/util/Utility.java')}
            `
        },
        {
            id: "engines-handson",
            title: "Hands-on: Create Database from CSV",
            content: `
                <h2>Hands-on: Create Database from CSV</h2>
                ${C.handson('Upload CSV → H2 Database Engine', `
                    <h4>Part 1: Create the Engine via UI</h4>
                    <ol>
                        <li>Open the ${CONFIG.productName} training instance in your browser</li>
                        <li>Navigate to <strong>Database Catalog</strong></li>
                        <li>Click <strong>Add Database</strong></li>
                        <li>Choose <strong>File Upload</strong> method</li>
                        <li>Select <strong>H2</strong> database type</li>
                        <li>Choose a sample CSV file (e.g., sales data, customer list, any dataset)</li>
                        <li>Name your database (e.g., <code>MySalesDB</code>)</li>
                        <li>Click <strong>Upload</strong> — ${CONFIG.productName} creates an H2 database automatically</li>
                        <li>Wait for the import to complete</li>
                    </ol>
                    <h4>Part 2: Explore What Got Created</h4>
                    <p>Behind the scenes, ${CONFIG.productName} created several files. Let's find them:</p>
                    <ol>
                        <li>Navigate to the server filesystem: <code>db/</code> directory</li>
                        <li>Find your new database folder: <code>MySalesDB__[UUID]/</code></li>
                        <li>Inside you'll see:
                            <ul>
                                <li><code>MySalesDB__[UUID].smss</code> — Engine configuration file</li>
                                <li><code>database.mv.db</code> — H2 database file</li>
                                <li><code>MySalesDB_OWL.OWL</code> — Schema metadata</li>
                            </ul>
                        </li>
                        <li>Open the <code>.smss</code> file — notice the fields we learned about (ENGINE, ENGINE_ALIAS, ENGINE_TYPE, CONNECTION_URL, etc.)</li>
                    </ol>
                    <h4>Part 3: Query Your New Database</h4>
                    <ol>
                        <li>Go to <strong>Notebook</strong> in ${CONFIG.productName}</li>
                        <li>Run a query using Pixel: <code>Database(database="[your-engine-id]") | Query("SELECT * FROM [table-name] LIMIT 10");</code></li>
                        <li>See your CSV data now queryable as a database!</li>
                    </ol>
                    <h4>Key Takeaway</h4>
                    <p><strong>UI Action → File System Result:</strong> When you upload a CSV, ${CONFIG.productName} creates an H2 engine, registers it in LocalMasterDatabase, writes a <code>.smss</code> config, and stores the data. This is the engine lifecycle in action!</p>
                `)}
            `
        }
    ];
