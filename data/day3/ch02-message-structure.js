// Day 3, Chapter 2: Message Structure (90 min)
const day3_ch02 = {
    title: "Message Structure",
    slides: [
        {
            id: "d3-msg-title",
            title: "Message Structure",
            content: C.titleSlide(
                "Message Structure",
                "How data flows through SEMOSS — from browser to backend and back",
                "90 minutes"
            )
        },
        {
            id: "d3-msg-overview",
            title: "Message Flow Overview",
            content: `
                <h2>Message Flow Overview</h2>
                <p class="lead">Every SEMOSS operation is a <span class="highlight">message transformation pipeline</span> — from HTTP request to Pixel execution to JSON response.</p>
                <p>Understanding message structure is critical for debugging, building custom reactors, and integrating with external systems.</p>
                ${C.sequence(
                    ["Browser", "Monolith (REST)", "PixelRunner", "Reactor", "Engine"],
                    [
                        { from: 0, to: 1, label: "POST /api/engine/runPixel" },
                        { from: 1, to: 2, label: "parse expression" },
                        { from: 2, to: 3, label: "execute()" },
                        { from: 3, to: 4, label: "query/inference" },
                        { from: 4, to: 3, label: "raw data", type: "response" },
                        { from: 3, to: 2, label: "NounMetadata", type: "response" },
                        { from: 2, to: 1, label: "pixelReturn[]", type: "response" },
                        { from: 1, to: 0, label: "JSON response", type: "response" },
                    ]
                )}
                ${C.callout('SEMOSS uses <strong>three key message structures</strong>: HTTP JSON (REST API), NounMetadata (internal reactor communication), and PayloadStruct (Java ↔ Python TCP).', 'info')}
            `
        },
        {
            id: "d3-msg-http-input",
            title: "Input: HTTP Request",
            content: `
                <h2>Input: HTTP Request Structure</h2>
                <p>The browser sends Pixel expressions via <strong>POST /api/engine/runPixel</strong> with a structured JSON body.</p>
                ${C.split(
                    {
                        title: 'HTTP Request',
                        content: C.code(`POST /api/engine/runPixel HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "insightId": "abc-123-def",
  "expression": "Database(database=\"sales_db\") | Query(\"SELECT * FROM customers LIMIT 10\") | Import();",
  "tz": "America/New_York"
}`, 'http', 'POST /api/engine/runPixel')
                    },
                    {
                        title: 'Key Fields',
                        content: `
                            <ul>
                                <li><code>insightId</code> — Session context (or "new")</li>
                                <li><code>expression</code> — Pixel command string (required)</li>
                                <li><code>tz</code> — Timezone (optional)</li>
                                <li><code>dropLogging</code> — Disable logging flag (optional)</li>
                            </ul>
                            ${C.callout('The <code>insightId</code> identifies the stateful session where variables, frames, and panels are stored.', 'tip')}
                        `
                    }
                )}
            `
        },
        {
            id: "d3-msg-nounmetadata",
            title: "NounMetadata — Internal Message",
            content: `
                <h2>NounMetadata — The Core Message Type</h2>
                <p class="lead"><span class="highlight">NounMetadata</span> is the primary data structure for passing values between reactors and through the Pixel execution pipeline.</p>
                <p>Every reactor returns a <code>NounMetadata</code> object that wraps the actual data with type information.</p>
                ${C.code(`public class NounMetadata implements Serializable {
    Object value;               // Actual data (String, Map, Frame, etc.)
    PixelDataType noun;        // Type descriptor (CONST_STRING, FRAME, MODEL, etc.)
    List<PixelOperationType> opType;  // Operation context
    String explanation = "";   // Optional description
    List<NounMetadata> additionalReturns;  // Extra outputs

    public NounMetadata(Object value, PixelDataType noun) {
        this.value = value;
        this.noun = noun;
        this.opType.add(PixelOperationType.OPERATION);
    }

    public Object getValue() { return this.value; }
    public PixelDataType getNounType() { return this.noun; }
}`, 'java', 'prerna/sablecc2/om/nounmeta/NounMetadata.java')}
                <h3>Key Components</h3>
                <ul>
                    <li><code>value</code> — The actual payload (String, Integer, Map, Frame, Model, etc.)</li>
                    <li><code>noun</code> — A <code>PixelDataType</code> enum indicating what the value represents</li>
                    <li><code>opType</code> — Metadata about how this value was produced</li>
                    <li><code>additionalReturns</code> — Side-channel for extra outputs (e.g., panel updates)</li>
                </ul>
            `
        },
        {
            id: "d3-msg-pixeldatatype",
            title: "PixelDataType Enum",
            content: `
                <h2>PixelDataType — Typing the Message</h2>
                <p>The <code>PixelDataType</code> enum defines all possible data types that can flow through SEMOSS.</p>
                ${C.cards([
                    { badge: 'Category', title: 'Constants', desc: '<code>CONST_STRING</code>, <code>CONST_INT</code>, <code>CONST_DECIMAL</code>, <code>CONST_DATE</code>, <code>NULL_VALUE</code>' },
                    { badge: 'Category', title: 'Collections', desc: '<code>VECTOR</code>, <code>MAP</code>, <code>FRAME</code>, <code>FRAME_MAP</code>' },
                    { badge: 'Category', title: 'Engines', desc: '<code>MODEL</code>, <code>STORAGE</code>, <code>VECTORDB</code>' },
                    { badge: 'Category', title: 'UI Elements', desc: '<code>PANEL</code>, <code>SHEET</code>, <code>TASK</code>, <code>ORNAMENT_MAP</code>' },
                    { badge: 'Category', title: 'Query Structures', desc: '<code>QUERY_STRUCT</code>, <code>FILTER</code>, <code>JOIN</code>, <code>ALIAS</code>' },
                    { badge: 'Category', title: 'Advanced', desc: '<code>PIXEL_RUNNER</code>, <code>CUSTOM_DATA_STRUCTURE</code>, <code>MCP_TOOL_EXECUTION</code>' },
                ])}
                ${C.code(`// Example: Returning different data types from reactors
// Simple string
return new NounMetadata("Hello, SEMOSS!", PixelDataType.CONST_STRING);

// A database frame (from variable store)
ITableDataFrame frame = (ITableDataFrame) insight.getVarStore().get("myFrame");
return new NounMetadata(frame, PixelDataType.FRAME);

// An LLM model engine (via Utility helper)
IEngine engine = Utility.getEngine(engineId);
return new NounMetadata(engine, PixelDataType.MODEL);

// A task from the task store
TaskStore taskStore = insight.getTaskStore();
return new NounMetadata(taskStore, PixelDataType.TASK);`, 'java', 'Example NounMetadata returns')}
            `
        },
        {
            id: "d3-msg-chaining",
            title: "Chaining & Transformation",
            content: `
                <h2>Chaining — Output Becomes Input</h2>
                <p>When you chain reactors with <code>|</code>, the <code>NounMetadata</code> output of one reactor becomes the input of the next.</p>
                ${C.flow([
                    { title: 'ReactorA.execute()', desc: 'Returns NounMetadata(value=frameA, noun=FRAME)', accent: true, arrow: '↓ frameA' },
                    { title: 'ReactorB receives input', desc: 'this.store.makeNoun(frameA) → accessible via getNoun(0)', arrow: '↓ transforms' },
                    { title: 'ReactorB.execute()', desc: 'Returns NounMetadata(value=frameB, noun=FRAME)', accent: true },
                ])}
                ${C.code(`// Example chain: Database | Query | Import
// Step 1: Database reactor returns DATABASE engine
NounMetadata step1 = new NounMetadata(engine, PixelDataType.ENGINE);

// Step 2: Query reactor receives engine, returns raw ResultSet
// Access piped input via store's GenRowStruct
GenRowStruct grs = this.store.getNoun("curRow");
NounMetadata inputNoun = grs.getNoun(0);  // gets the engine from previous step
IEngine engine = (IEngine) inputNoun.getValue();
ResultSet rs = engine.executeQuery("SELECT * FROM users");
NounMetadata step2 = new NounMetadata(rs, PixelDataType.RAW_DATA_SET);

// Step 3: Import reactor receives ResultSet, creates Frame
GenRowStruct grs3 = this.store.getNoun("curRow");
ResultSet rs = (ResultSet) grs3.getNoun(0).getValue();
ITableDataFrame frame = createFrame(rs);
return new NounMetadata(frame, PixelDataType.FRAME);`, 'java', 'Reactor chaining logic')}
                ${C.callout('The <code>store</code> object in <code>AbstractReactor</code> manages piped inputs via <code>GenRowStruct</code>. Call <code>store.getNoun("curRow")</code> then <code>getNoun(0)</code> to access the previous reactor\'s output.', 'info')}
            `
        },
        {
            id: "d3-msg-http-output",
            title: "Output: JSON Response",
            content: `
                <h2>Output: JSON Response Structure</h2>
                <p>The Monolith REST API serializes the final <code>NounMetadata</code> (or array of them) into a JSON response.</p>
                ${C.code(`{
  "pixelReturn": [
    {
      "pixelExpression": "Database(database=\"sales_db\") | Query(...) | Import();",
      "output": {
        "data": [...],  // depends on PixelDataType
        "headers": ["col1", "col2"],
        "numRows": 10,
        "type": "FRAME"
      },
      "operationType": ["FRAME"],
      "additionalOutput": [
        {
          "type": "PANEL",
          "output": { "panelId": "panel_123", ... }
        }
      ]
    }
  ],
  "insightID": "abc-123-def"
}`, 'json', 'Response structure')}
                <h3>Key Fields</h3>
                <ul>
                    <li><code>pixelReturn[]</code> — Array of results (one per Pixel statement)</li>
                    <li><code>output</code> — Serialized value from <code>NounMetadata.getValue()</code></li>
                    <li><code>operationType</code> — Corresponds to <code>PixelDataType</code></li>
                    <li><code>additionalOutput</code> — From <code>NounMetadata.getAdditionalReturn()</code></li>
                </ul>
            `
        },
        {
            id: "d3-msg-payloadstruct",
            title: "PayloadStruct — Java ↔ Python",
            content: `
                <h2>PayloadStruct — Cross-Process Messages</h2>
                <p class="lead">When SEMOSS needs to invoke Python code (GAAS), it uses <span class="highlight">PayloadStruct</span> for TCP communication.</p>
                <p>This is a separate message protocol optimized for Java ↔ Python serialization.</p>
                ${C.code(`public class PayloadStruct implements Serializable {
    public enum OPERATION {
        R, PYTHON, CHROME, ECHO, ENGINE, REACTOR, INSIGHT, PROJECT, CMD, STDOUT, STDERR, STRUCTURED_STREAM
    };

    public OPERATION operation = OPERATION.PYTHON;
    public String methodName = "method";  // Python function name
    public Object[] payload = null;       // Arguments
    public Class[] payloadClasses = null; // Argument types
    public String engineType = null;      // "PY" for Python

    public String insightId = null;       // Session context
    public String epoc = null;            // Unique request ID (UUID)
    public String projectId = null;       // Project/app ID

    public boolean response = false;      // Request vs response flag
    public boolean hasReturn = true;      // Expect return value?
    public String ex = null;              // Exception message (if error)
}`, 'java', 'prerna/tcp/PayloadStruct.java')}
                ${C.callout('PayloadStruct is used <strong>only</strong> for Java ↔ Python communication over TCP sockets. It\'s NOT used for Pixel execution or REST APIs.', 'warning')}
            `
        },
        {
            id: "d3-msg-payloadstruct-flow",
            title: "PayloadStruct Flow",
            content: `
                <h2>PayloadStruct Message Flow</h2>
                <p>When a Pixel expression calls a Python engine or reactor, SEMOSS serializes a <code>PayloadStruct</code> and sends it over TCP to the Python GAAS process.</p>
                ${C.sequence(
                    ["Java Reactor", "TCPHandler", "Python GAAS", "Python Function"],
                    [
                        { from: 0, to: 1, label: 'PayloadStruct(operation=PYTHON, methodName="myFunc", payload=[arg1, arg2])' },
                        { from: 1, to: 2, label: "TCP socket write (serialized)" },
                        { from: 2, to: 3, label: "deserialize → call myFunc(arg1, arg2)" },
                        { from: 3, to: 2, label: "return result", type: "response" },
                        { from: 2, to: 1, label: "PayloadStruct(response=true, payload=[result])", type: "response" },
                        { from: 1, to: 0, label: "deserialize result", type: "response" },
                    ]
                )}
                ${C.split(
                    {
                        title: 'Request',
                        content: C.code(`PayloadStruct req = new PayloadStruct();
req.operation = OPERATION.PYTHON;
req.methodName = "embed_text";
req.payload = new Object[]{"Hello, world!"};
req.insightId = insight.getInsightId();
req.engineType = "PY";
req.response = false;  // this is a request`, 'java')
                    },
                    {
                        title: 'Response',
                        content: C.code(`PayloadStruct resp = new PayloadStruct();
resp.operation = OPERATION.PYTHON;
resp.methodName = "embed_text";
resp.payload = new Object[]{embedVector};
resp.response = true;  // this is a response
resp.hasReturn = true;`, 'java')
                    }
                )}
            `
        },
        {
            id: "d3-msg-handson",
            title: "Hands-on: Trace a Message",
            content: `
                <h2>Hands-on: Trace a Message Through SEMOSS</h2>
                ${C.handson('Trace message transformation', `
                    <h4>Step 1: Execute a Pixel command</h4>
                    <p>In your browser console, run:</p>
                    ${C.code(`await window.semoss.executePixel(\`
  Database(database="MyDatabase")
  | Query("SELECT name, age FROM people LIMIT 5")
  | Import();
\`);`, 'javascript')}

                    <h4>Step 2: Inspect the HTTP request</h4>
                    <p>Open DevTools → Network tab. Find the <strong>POST /api/engine/runPixel</strong> request. Look at:</p>
                    <ul>
                        <li><strong>Request Payload</strong>: What fields are sent?</li>
                        <li><strong>Response</strong>: What is the structure of <code>pixelReturn[0]</code>?</li>
                    </ul>

                    <h4>Step 3: Create a custom reactor that logs NounMetadata</h4>
                    ${C.code(`package prerna.reactor.custom;

import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.nounmeta.NounMetadata;

public class LogNounReactor extends AbstractReactor {
    @Override
    public NounMetadata execute() {
        organizeKeys();

        // Get the input from previous reactor
        GenRowStruct grs = this.store.getNoun("curRow");
        NounMetadata input = grs.getNoun(0);

        // Log its structure
        logger.info("NounMetadata received:");
        logger.info("  Type: " + input.getNounType());
        logger.info("  Value class: " + input.getValue().getClass().getName());
        logger.info("  OpType: " + input.getOpType());

        // Pass it through unchanged
        return input;
    }
}`, 'java', 'prerna/reactor/custom/LogNounReactor.java')}

                    <h4>Step 4: Test the logger</h4>
                    ${C.code(`Database(database="MyDatabase")
  | Query("SELECT * FROM users LIMIT 3")
  | LogNoun()
  | Import();`, 'pixel')}
                    <p>Check the SEMOSS logs to see the NounMetadata structure printed.</p>

                    <h4>Expected Output</h4>
                    <p>You should see logs like:</p>
                    ${C.code(`INFO: NounMetadata received:
INFO:   Type: RAW_DATA_SET
INFO:   Value class: java.sql.ResultSet
INFO:   OpType: [OPERATION]`, 'text')}
                `)}
            `
        },
        {
            id: "d3-msg-summary",
            title: "Summary",
            content: `
                <h2>Summary: Message Structures in SEMOSS</h2>
                ${C.table(
                    ["Message Type", "Purpose", "Where Used", "Key Fields"],
                    [
                        [
                            "HTTP JSON",
                            "Browser → Server communication",
                            "REST API (/api/engine/runPixel)",
                            "<code>insightId</code>, <code>expression</code>, <code>tz</code>"
                        ],
                        [
                            "NounMetadata",
                            "Internal reactor communication",
                            "Pixel execution pipeline",
                            "<code>value</code>, <code>noun</code> (PixelDataType), <code>opType</code>"
                        ],
                        [
                            "PayloadStruct",
                            "Java ↔ Python TCP communication",
                            "Python GAAS calls",
                            "<code>operation</code>, <code>methodName</code>, <code>payload</code>, <code>response</code>"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>HTTP JSON</strong> is the external API contract (browser ↔ server)</li>
                    <li><strong>NounMetadata</strong> is the internal message format (reactor ↔ reactor)</li>
                    <li><strong>PayloadStruct</strong> enables cross-language calls (Java ↔ Python)</li>
                    <li>Reactor chaining works by passing <code>NounMetadata</code> through the <code>store</code></li>
                    <li><code>PixelDataType</code> enum defines all possible data types in SEMOSS</li>
                </ul>
                ${C.callout('Understanding these three message structures is essential for debugging Pixel execution, building custom reactors, and integrating with external systems.', 'tip')}
            `
        }
    ]
};
