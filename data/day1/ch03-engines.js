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
                            <ul>
                                <li><strong>H2</strong> — Embedded (local master DB)</li>
                                <li><strong>PostgreSQL</strong> — Primary RDBMS</li>
                                <li><strong>MySQL / MariaDB</strong></li>
                                <li><strong>SQL Server / Oracle</strong></li>
                                <li><strong>Databricks</strong></li>
                                <li><strong>RDF / Sesame</strong> — Triple stores</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Each Engine Has',
                        content: `
                            <ul>
                                <li>A <strong>JDBC connection</strong> (pooled)</li>
                                <li>An <strong>OWL metadata layer</strong></li>
                                <li>Connection URL with <code>@BaseFolder@</code> placeholder</li>
                                <li>Registered in <strong>LocalMasterDatabase</strong></li>
                            </ul>
                        `
                    }
                )}
                ${C.code(`// How a database query flows through the system
// 1. Pixel command
Database(database="my_db") | Query("SELECT * FROM users LIMIT 10");

// 2. Java: DatabaseReactor resolves the engine
IDatabaseEngine engine = Utility.getDatabase("my_db");

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
                        { from: 0, to: 1, label: 'LLM(engine="gpt4", command="...")' },
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
    engine="my_vector_db",
    filePath="/path/to/document.pdf"
);

// Pixel: Search the vector engine
VectorDatabaseQuery(
    engine="my_vector_db",
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
Storage(engine="my_s3")
    | UploadFile(filePath="/local/data.csv", storagePath="uploads/data.csv");

// Function engine — call a custom API
Function(engine="weather_api")
    | RunFunction(city="Madrid");

// Guardrail — apply to an LLM call
LLM(engine="gpt4", command="...", guardrails=["pii_filter"]);`, 'pixel', 'Storage, Function & Guardrail — Pixel Commands')}
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
ENGINE         LocalMasterDatabase
ENGINE_TYPE    prerna.engine.impl.rdbms.H2EmbeddedServerEngine
OWL            MasterDatabase_OWL.OWL

RDBMS_TYPE     H2_DB
DRIVER         org.h2.Driver
USERNAME       sa
PASSWORD       ****
CONNECTION_URL jdbc:h2:nio:@BaseFolder@/db/@ENGINE@/database
USE_CONNECTION_POOLING  false
DATABASE_ZONEID UTC`, 'properties', 'db/LocalMasterDatabase.smss')
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
                    { title: '3. Register', desc: 'Entry added to LocalMasterDatabase', accent: true, arrow: '↓' },
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
            title: "Hands-on: Configure an LLM Engine",
            content: `
                <h2>Hands-on: Configure an LLM Engine</h2>
                ${C.handson('Create Your First Model Engine', `
                    <ol>
                        <li>Open the SEMOSS training instance in your browser</li>
                        <li>Navigate to <strong>Engine Catalog → Add Engine → Model</strong></li>
                        <li>Select <strong>OpenAI</strong> as the provider</li>
                        <li>Enter your API key in the configuration</li>
                        <li>Set the model to <strong>gpt-4</strong></li>
                        <li>Name your engine (e.g., <code>my-gpt4-engine</code>)</li>
                        <li>Click <strong>Test Connection</strong> to verify</li>
                        <li>Save the engine</li>
                    </ol>
                    <h4>Verify</h4>
                    <ol>
                        <li>Find the engine in the catalog</li>
                        <li>Go to <strong>Chat</strong> and select your engine — ask it a question</li>
                        <li>Open the <strong>Notebook</strong> and run: <code>LLM(engine="my-gpt4-engine", command="Hello!");</code></li>
                    </ol>
                    <h4>Bonus: Find the .smss</h4>
                    <p>Navigate to the <code>model/</code> directory on the server filesystem and find the <code>.smss</code> file for your new engine. What fields does it contain?</p>
                `)}
            `
        }
    ]
};
