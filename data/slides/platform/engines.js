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
                <p>Every engine has its configuration as a <code>.smss</code> (${CONFIG.productName} Settings) file — a text based key-value format.</p>
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
                        content: C.code(`ENGINE	877ecba9-9125-40b8-9eb4-b82dbefc92cf
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
                                <li><strong>H2</strong> — Embedded or Server</li>
                                <li><strong>PostgreSQL</strong></li>
                                <li><strong>MySQL / MariaDB</strong></li>
                                <li><strong>SQL Server</strong></li>
                                <li><strong>Oracle</strong></li>
                                <li><strong>Databricks</strong></li>
                                <li><strong>RDF (Sesame, Jena)</strong> — Triple stores</li>
                            </ul>
                            <p><em>And many more — any JDBC-compatible database is supported</em></p>
                        `
                    },
                    {
                        title: 'Each Engine Has',
                        content: `
                            <ul>
                                <li>A <strong>JDBC connection</strong></li>
                                <li>An <strong>OWL metadata layer</strong></li>
                                <li>Registered in <strong>LocalMasterDatabase</strong> for discovery</li>
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
                ${C.code(`# Base Properties
ENGINE	8380e91f-7c0b-46a1-ad2a-d795b24037b5
ENGINE_ALIAS	GPT 5-2
ENGINE_TYPE	prerna.engine.impl.model.OpenAiEngine

KEEP_INPUT_OUTPUT	true
KEEP_CONVERSATION_HISTORY	true
MODEL_TYPE	OPEN_AI
VAR_NAME	openAIModel
INIT_MODEL_ENGINE	import genai_client;\${VAR_NAME} = genai_client.OpenAiClient(
    model_name = '\${MODEL}',
    api_key = '\${OPEN_AI_KEY}',
    chat_type = '\${CHAT_TYPE}',
    context_window = \${CONTEXT_WINDOW},
    max_tokens = \${MAX_TOKENS}
)
MAX_TOKENS	128000
CONTEXT_WINDOW	400000
MODEL	gpt-5.2-2025-12-11
OPEN_AI_KEY	********
CHAT_TYPE	responses
NAME	GPT 5-2
PIPELINE	pipeline.json
MCP_ENABLED	false`, 'properties', 'Model Engine .smss — OpenAI')}
                <h3>Supported Providers</h3>
                <p class="muted">Providers: Anthropic, Azure OpenAI, Bedrock, Google, OpenAI, Text Generation Inference. The init script uses provider-specific client names.</p>
                ${C.table(
                    ['Provider', 'Client Names Used In Init Script'],
                    [
                        ['Anthropic', '<code>genai_client.AnthropicClient</code>'],
                        ['Azure OpenAI', '<code>genai_client.AzureOpenAiClient</code> / <code>genai_client.AzureOpenAiEmbedder</code>'],
                        ['Bedrock', '<code>genai_client.BedrockClient</code> / <code>genai_client.BedrockEmbedder</code>'],
                        ['Google', '<code>genai_client.GoogleGenAiTextClient</code> / <code>genai_client.GoogleGenAiImageClient</code> / <code>genai_client.VertexAiEmbedder</code>'],
                        ['OpenAI', '<code>genai_client.OpenAiClient</code> / <code>genai_client.OpenAiEmbedder</code>'],
                        ['Text Generation Inference', '<code>genai_client.TextGenClient</code> / <code>genai_client.TextEmbeddingsInference</code>'],
                    ]
                )}
                ${C.callout(`<strong>Key insight:</strong> All model engines share a common abstract interface; the differences between providers are encapsulated in the <code>INIT_MODEL_ENGINE</code> script.`, 'info')}
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
                ${C.code(`ENGINE	f5555ec7-5fcc-4cff-91de-0042aa4b8a13
ENGINE_ALIAS	azure semantic search
ENGINE_TYPE	prerna.engine.impl.vector.AzureAISearchRestVectorDatabaseEngine

VECTOR_TYPE	AZURE_AI_SEARCH
EF_CONSTRUCTION	128
RETAIN_EXTRACTED_TEXT	false
INDEX_ENGINE	lucene
CHUNKING_STRATEGY	ALL
M_VALUE	10
INDEX_NAME	test-index
API_VERSION	2024-07-01
DISTANCE_METHOD	euclidean
KEEP_INPUT_OUTPUT	false
INDEX_CLASSES	default
CONTENT_LENGTH	512
API_KEY	********
SPACE_TYPE	l2
HOSTNAME	https://<some dns>
METHOD_NAME	hnsw
CONTENT_OVERLAP	20
DIMENSION_SIZE	1024

EMBEDDER_ENGINE_ID	e4449559-bcff-4941-ae72-0e3f18e06660
EMBEDDER_ENGINE_NAME	TextEmbeddings BAAI-Large-En-V1.5`, 'properties', 'Vector Engine .smss — Azure AI Search')}
                ${C.callout(`<strong>Key insight:</strong> We store the embedder engine so any text added to a vector store is embedded with the same model for consistent searching / retrieval.`, 'info')}
            `
        },
        {
            id: "engines-storage",
            title: "Storage Engines",
            content: `
                <h2>Storage Engines</h2>
                ${C.cards([
                    { badge: 'Storage', title: 'Amazon S3', desc: 'Object storage with bucket + key addressing.' },
                    { badge: 'Storage', title: 'CEPH', desc: 'S3-compatible object storage backend.' },
                    { badge: 'Storage', title: 'DropBox', desc: 'File storage via Dropbox APIs.' },
                    { badge: 'Storage', title: 'Google Cloud', desc: 'GCS bucket storage.' },
                    { badge: 'Storage', title: 'Azure Blob', desc: 'Blob storage with container + blob path.' },
                    { badge: 'Storage', title: 'MinIO', desc: 'S3-compatible object storage service.' },
                    { badge: 'Storage', title: 'Network File System', desc: 'Shared filesystem via NFS.' },
                    { badge: 'Storage', title: 'SFTP', desc: 'File storage over SSH using SFTP.' },
                ])}
                ${C.code(`ENGINE	68b7e856-2312-4106-ab7a-7d7bb006173a
ENGINE_ALIAS	MinIO Example
ENGINE_TYPE	prerna.engine.impl.storage.MinioStorageEngine

MINIO_BUCKET	aicore
MINIO_REGION	us-east-1
MINIO_ENDPOINT	http://localhost:9000
MINIO_ACCESS_KEY	minioadmin-access
MINIO_SECRET_KEY	minioadmin-password123
STORAGE_TYPE	MINIO`, 'properties', 'Storage Engine .smss — MinIO')}
            `
        },
        {
            id: "engines-function",
            title: "Function Engines",
            content: `
                <h2>Function Engines</h2>
                ${C.cards([
                    { badge: 'Function', title: 'AWS Image Text Extraction', desc: 'Text extraction via AWS image services.' },
                    { badge: 'Function', title: 'AWS Polly', desc: 'Text-to-speech synthesis via Polly.' },
                    { badge: 'Function', title: 'AWS Transcribe', desc: 'Speech-to-text via Transcribe.' },
                    { badge: 'Function', title: 'AWS Comprehend', desc: 'NLP analysis via Comprehend.' },
                    { badge: 'Function', title: 'Azure Document Intelligence', desc: 'Document extraction via Azure.' },
                    { badge: 'Function', title: 'Azure Speech to Text', desc: 'Speech-to-text via Azure.' },
                    { badge: 'Function', title: 'Google Speech to Text', desc: 'Speech-to-text via Google.' },
                    { badge: 'Function', title: 'Google OCR', desc: 'OCR via Google vision services.' },
                    { badge: 'Function', title: 'REST Endpoint', desc: 'HTTP-based function endpoints.' },
                    { badge: 'Function', title: 'Local Python Functions', desc: 'Local Python execution.' },
                ])}
                ${C.code(`ENGINE  d94d9acb-8270-4516-8a5a-ee023dfb9c50
ENGINE_ALIAS	APIWrapper
ENGINE_TYPE	prerna.engine.impl.function.LocalPythonFunctionEngine

FUNCTION_NAME	main
FUNCTION_DESCRIPTION	
FUNCTION_TYPE	LOCAL_PYTHON
FUNCTION_REQUIRED_PARAMETERS	["parameter1", "parameter2"]
FUNCTION_PARAMETERS	[
  {"parameterName": "parameter1", "parameterType": "String", "parameterDescription": "description of parameter 1"},
  {"parameterName": "parameter2", "parameterType": "String", "parameterDescription": "description of parameter 2"},
  {"parameterName": "parameter3", "parameterType": "String", "parameterDescription": "description of parameter 3"},
  {"parameterName": "parameter4", "parameterType": "Int", "parameterDescription": "description of parameter 4"}
]

PYTHON_FILE_NAME	main.py`, 'properties', 'Function Engine .smss — Local Python')}
                ${C.callout(`<strong>Important:</strong> <code>FUNCTION_PARAMETERS</code> is a JSON list of objects requiring these keys: <code>parameterName</code>, <code>parameterType</code>, <code>parameterDescription</code>. <code>FUNCTION_REQUIRED_PARAMETERS</code> is a JSON list of strings.`, 'info')}
                ${C.code(`from typing import Optional

def main(parameter1: str, parameter2: str, parameter3: Optional[str] = None, parameter4: Optional[int] = None):
    # custom logic implementation
    pass`, 'python', 'main.py — Function Entry Point')}
            `
        },
        {
            id: "engines-guardrail",
            title: "Guardrail Engines",
            content: `
                <h2>Guardrail Engines</h2>
                ${C.cards([
                    { badge: 'Guardrail', title: 'Detoxify', desc: 'Detects toxic or harmful inputs/outputs.' },
                    { badge: 'Guardrail', title: 'GLiNER', desc: 'Classifies sensitive categories (PII, PHI, etc.) in inputs/outputs.' },
                    { badge: 'Guardrail', title: 'Prompt Injection', desc: 'Detects malicious inputs that attempt to bypass model instructions.' },
                ])}
                <p class="muted">Guardrail engines enforce safety and policy checks for AI workflows.</p>
                ${C.code(`ENGINE	fffd1e30-f92b-4ed7-aa31-006147c28925
ENGINE_ALIAS	GLINER
ENGINE_TYPE	prerna.engine.impl.guardrail.GLiNERGuardrailEngine

MODEL_NAME urchade/gliner_multi_pii-v1`, 'properties', 'Guardrail Engine .smss — GLiNER')}
                ${C.callout(`<strong>Important:</strong> Guardrail engines let you add custom logic on the input/output of any engine, applied through a <code>pipeline.json</code>.`, 'info')}
                ${C.code(`{
  "pipelines": {
    "askRoom": { # method we are adding the guardrail on for this model engine
      "input": [
        {
          "reactorClass": "prerna.reactor.interceptor.GenericGuardrailInputReactor",
          "params": {
            "blockOnGuardrailFailure": true,
            "guardrailEngineId": "aaad1e30-f92b-4ed7-aa31-006147c28925", # the engine id of a detoxify engine
            "directParameters": {
              "threshold": 0.8
            },
            "inputMapping": {
              "prompt": "arg0"
            }
          }
        },
        {
          "reactorClass": "prerna.reactor.interceptor.GenericGuardrailInputReactor",
          "params": {
            "blockOnGuardrailFailure": true,
            "guardrailEngineId": "fffd1e30-f92b-4ed7-aa31-006147c28925", # the engine id of a GLiNER engine
            "directParameters": {
              "labels": [ # a parameter that GLiNER expects to classify against
                "personally identifiable information",
                "driver licence",
                "person",
                "full address",
                "email",
                "passport number",
                "Social Security Number",
                "phone number"
              ],
              "threshold": 0.7
            },
            "inputMapping": {
              "prompt": "arg0"
            }
          }
        }
      ]
    }
  }
}`, 'json', 'pipeline.json — Guardrail Input Filters')}
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
                    { title: '3. Register', desc: 'Entry added to Security DB (all engines) and LocalMasterDatabase (database engines)', arrow: '↓' },
                    { title: '4. Open', desc: 'engine.open(smssProperties) — connection established', accent: true, arrow: '↓' },
                    { title: '5. Use', desc: 'Reactors interact with engine via interface methods', arrow: '↓' },
                    { title: '6. Sync', desc: 'Sync to cloud storage for cluster deployments' },
                ])}
                <h3>Engine Load Decision Tree</h3>
                ${C.decision(
                    'Decision: Is the engine connection already established in this container?',
                    C.flow([
                        { title: 'Connection Exists', desc: 'Use the cached connection', accent: true, arrow: '↓' },
                        { title: 'Return Engine', desc: 'Return connection encapsulated as an engine' },
                    ]),
                    C.flow([
                        { title: 'Pull Storage Details', desc: 'Cloud storage or local filesystem (dev)', accent: true, arrow: '↓' },
                        { title: 'Build Engine', desc: 'Use .smss details to instantiate', arrow: '↓' },
                        { title: 'Store In Container', desc: 'Cache engine for future requests', arrow: '↓' },
                        { title: 'Return Engine', desc: 'Return engine object to calling logic' },
                    ])
                )}
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
