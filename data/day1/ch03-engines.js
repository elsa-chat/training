// Day 1, Chapter 3: Engines — The Data Layer (90 min)
const day1_ch03 = {
    title: "Engines: The Data Layer",
    slides: [
        {
            id: "d1-engines-title",
            title: "Engines: The Data Layer",
            content: C.titleSlide(
                "Engines: The Data Layer",
                "The pluggable abstraction that connects SEMOSS to everything",
                "90 minutes"
            )
        },
        {
            id: "d1-engines-what-are",
            title: "What are Engines?",
            content: `
                <h2>What are Engines?</h2>
                <p class="lead">An <span class="highlight">Engine</span> is SEMOSS's pluggable abstraction for connecting to external systems.</p>
                <p>Think of engines as <strong>managed connectors</strong>. Each engine wraps a connection to an external service and exposes a uniform interface.</p>
                ${C.flow([
                    { title: 'IEngine', desc: 'Base interface — open(), close(), getEngineName(), getEngineId()', accent: true },
                    { title: 'Type-Specific Interface', desc: 'IDatabaseEngine, IModelEngine, IVectorDatabaseEngine, etc.', arrow: 'extends' },
                    { title: 'Implementation Class', desc: 'e.g., H2EmbeddedServerEngine, OpenAiEngine, FaissDatabase', arrow: 'implements' },
                    { title: '.smss Config', desc: 'Key-value file that configures the implementation' },
                ])}
                ${C.callout('<strong>Key insight:</strong> Everything in SEMOSS talks through engines — databases, AI models, file storage, custom APIs. This uniform abstraction is what makes the platform extensible.', 'info')}
            `
        },
        {
            id: "d1-engines-types",
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
            id: "d1-engines-interface-hierarchy",
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
            id: "d1-engines-database-deep",
            title: "Database Engines",
            content: `
                <h2>Database Engines — Deep Dive</h2>
                ${C.split(
                    {
                        title: 'Supported Types',
                        content: `
                            <p><strong>SEMOSS can connect to almost ALL major databases</strong> via JDBC drivers. Common examples:</p>
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
                ${C.code(`// How a database query flows through the system
// 1. Pixel command (uses engine ID, not name)
Database(database="bd1dea64-ec6b-49af-9308-94b05551c83d") | Query("SELECT * FROM users LIMIT 10");

// 2. Java: DatabaseReactor resolves the engine by ID
IDatabaseEngine engine = Utility.getDatabase("bd1dea64-ec6b-49af-9308-94b05551c83d");

// 3. Java: QueryReactor executes against the engine
Object result = engine.execQuery(sqlString);

// 4. Results wrapped in NounMetadata and returned`, 'java', 'Database Query Flow')}
                ${C.callout('<strong>LocalMasterDatabase</strong> — Every SEMOSS instance has a master H2 database that stores metadata about all engines, projects, users, and permissions.', 'info')}
            `
        },
        {
            id: "d1-engines-model-deep",
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
            id: "d1-engines-vector-deep",
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
            id: "d1-engines-storage-function-guardrail",
            title: "Storage, Function & Guardrail",
            content: `
                <h2>Storage, Function & Guardrail Engines</h2>
                ${C.cards([
                    { badge: 'Storage', title: 'Local', desc: 'Server filesystem — default for dev. Path-based access.' },
                    { badge: 'Storage', title: 'S3 / MinIO', desc: 'Object storage — bucket + key. Used in production.' },
                    { badge: 'Storage', title: 'Azure Blob', desc: 'Container + blob path. Enterprise deployments.' },
                    { badge: 'Function', title: 'Custom APIs', desc: 'Wrap external REST APIs as callable engine functions.' },
                    { badge: 'Function', title: 'Python Scripts', desc: 'Execute Python code as a SEMOSS function engine.' },
                    { badge: 'Guardrail', title: 'Validation', desc: 'Pre/post processing for LLM I/O — PII, toxicity, custom rules.' },
                ])}
                ${C.code(`// Storage engine — upload a file
Storage(engine="b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e")
    | UploadFile(filePath="/local/data.csv", storagePath="uploads/data.csv");

// Function engine — call a custom API
Function(engine="c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f")
    | RunFunction(city="Madrid");

// Guardrail — apply to an LLM call
LLM(engine="d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a", command="...", guardrails=["pii_filter"]);`, 'pixel', 'Storage, Function & Guardrail — Pixel Commands')}
            `
        },
        {
            id: "d1-engines-smss",
            title: ".smss Configuration Files",
            content: `
                <h2>.smss Configuration Files</h2>
                <p>Every engine is persisted on disk as a <code>.smss</code> (SEMOSS Settings) file — a simple key-value format.</p>
                ${C.split(
                    {
                        title: 'Database Engine .smss',
                        content: C.code(`# Base Properties
ENGINE         66cf4dbb-483f-42e7-8804-4e3d5af89287
ENGINE_ALIAS   Diabetes
ENGINE_TYPE    prerna.engine.impl.rdbms.RDBMSNativeEngine
OWL            Diabetes_OWL.OWL

# Database Connection
RDBMS_TYPE     H2_DB
DRIVER         org.h2.Driver
USERNAME       sa
PASSWORD       ****
CONNECTION_URL jdbc:h2:nio:@BaseFolder@/db/@ENGINE@/database`, 'properties', 'db/Diabetes__66cf4dbb-483f-42e7-8804-4e3d5af89287.smss')
                    },
                    {
                        title: 'Key Fields',
                        content: `
                            <ul>
                                <li><code>ENGINE</code> — Display name</li>
                                <li><code>ENGINE_TYPE</code> — Fully qualified Java class</li>
                                <li><code>OWL</code> — Schema metadata file</li>
                                <li><code>RDBMS_TYPE</code> — Database flavor</li>
                                <li><code>CONNECTION_URL</code> — JDBC URL</li>
                            </ul>
                            <p><strong>Placeholders:</strong></p>
                            <ul>
                                <li><code>@BaseFolder@</code> — SEMOSS install root</li>
                                <li><code>@ENGINE@</code> — Engine folder name</li>
                            </ul>
                        `
                    }
                )}
            `
        },
        {
            id: "d1-engines-lifecycle",
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
                ${C.code(`// Utility.java — how SEMOSS loads an engine on startup
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
            id: "d1-engines-handson",
            title: "Hands-on: Create Database from CSV",
            content: `
                <h2>Hands-on: Create Database from CSV</h2>
                ${C.handson('Upload CSV → H2 Database Engine', `
                    <h4>Part 1: Create the Engine via UI</h4>
                    <ol>
                        <li>Open the SEMOSS training instance in your browser</li>
                        <li>Navigate to <strong>Database Catalog</strong></li>
                        <li>Click <strong>Add Database</strong></li>
                        <li>Choose <strong>File Upload</strong> method</li>
                        <li>Select <strong>H2</strong> database type</li>
                        <li>Choose a sample CSV file (e.g., sales data, customer list, any dataset)</li>
                        <li>Name your database (e.g., <code>MySalesDB</code>)</li>
                        <li>Click <strong>Upload</strong> — SEMOSS creates an H2 database automatically</li>
                        <li>Wait for the import to complete</li>
                    </ol>
                    <h4>Part 2: Explore What Got Created</h4>
                    <p>Behind the scenes, SEMOSS created several files. Let's find them:</p>
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
                        <li>Go to <strong>Notebook</strong> in SEMOSS</li>
                        <li>Run a query using Pixel: <code>Database(database="[your-engine-id]") | Query("SELECT * FROM [table-name] LIMIT 10");</code></li>
                        <li>See your CSV data now queryable as a database!</li>
                    </ol>
                    <h4>Key Takeaway</h4>
                    <p><strong>UI Action → File System Result:</strong> When you upload a CSV, SEMOSS creates an H2 engine, registers it in LocalMasterDatabase, writes a <code>.smss</code> config, and stores the data. This is the engine lifecycle in action!</p>
                `)}
            `
        }
    ]
};
