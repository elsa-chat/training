// Day 1, Chapter 4: Pixel & Reactors (195 min)
const day1_ch04 = {
    title: "Pixel & Reactors",
    slides: [
        {
            id: "d1-pixel-title",
            title: "Pixel & Reactors",
            content: C.titleSlide(
                "Pixel & Reactors",
                `The command language and execution engine of ${CONFIG.productName}`,
                "195 minutes"
            )
        },
        {
            id: "d1-pixel-what-is",
            title: "What is Pixel?",
            content: `
                <h2>What is Pixel?</h2>
                <p class="lead"><span class="highlight">Pixel</span> is the domain-specific command language of ${CONFIG.productName}.</p>
                <p>Every action in ${CONFIG.productName} — querying data, calling an LLM, building a visualization — is ultimately a Pixel command. The UI generates Pixel under the hood.</p>
                ${C.cards([
                    { title: 'Declarative', desc: 'Describe what you want, not how to do it' },
                    { title: 'Chainable', desc: 'Pipe operator | flows output → input' },
                    { title: 'Reactor-Backed', desc: 'Each command maps to a Java class' },
                    { title: 'Serializable', desc: 'Recipes can be saved, shared, replayed' },
                ])}
                ${C.callout('Think of Pixel as the <strong>glue between the UI and the backend</strong>. Everything the user does through clicks generates a Pixel command behind the scenes.', 'tip')}
            `
        },
        {
            id: "d1-pixel-syntax",
            title: "Pixel Syntax",
            content: `
                <h2>Pixel Syntax & Structure</h2>
                ${C.code(`// Basic syntax
ReactorName(param1=value1, param2=value2);

// Chaining — output of A flows into B
ReactorA(param1=value1) | ReactorB(param2=value2);

// Multi-statement
statement1;
statement2;
statement3;`, 'pixel', 'Pixel Syntax Rules')}
                <h3>Rules</h3>
                <ul>
                    <li>Statements end with a <strong>semicolon</strong> <code>;</code></li>
                    <li>Parameters use <strong>key=value</strong> syntax</li>
                    <li>Strings in <strong>double quotes</strong>: <code>"hello"</code></li>
                    <li>Lists in <strong>brackets</strong>: <code>["a", "b", "c"]</code></li>
                    <li>Pipe <code>|</code> chains commands (output → input)</li>
                    <li>Positional params map to keys <code>"0"</code>, <code>"1"</code>, etc.</li>
                </ul>
            `
        },
        {
            id: "d1-pixel-basic-commands",
            title: "Basic Pixel Commands",
            content: `
                <h2>Basic Pixel Commands</h2>
                ${C.code(`// Echo — return a value
Echo("Hello, World!");

// List your engines
MyEngines();

// Query a database (use engine ID for database engines)
Database(database="bd1dea64-ec6b-49af-9308-94b05551c83d") | Query("SELECT * FROM users LIMIT 10");

// Call an LLM (use engine ID)
LLM(engine="a1b2c3d4-5e6f-7890-abcd-1234567890ab", command="What is SEMOSS?");

// Get engine metadata
EngineMetadata(engine="bd1dea64-ec6b-49af-9308-94b05551c83d");

// Query and collect results
Database(database="bd1dea64-ec6b-49af-9308-94b05551c83d")
  | Query("SELECT name, age FROM people")
  | Collect(500);`, 'pixel', 'Common Pixel Commands')}
            `
        },
        {
            id: "d1-pixel-chaining",
            title: "Chaining (Recipes)",
            content: `
                <h2>Chaining Pixel Commands (Recipes)</h2>
                <p>The real power of Pixel is <strong>chaining</strong> — composing multiple operations into a pipeline.</p>
                ${C.split(
                    {
                        title: 'Query → Transform → Visualize',
                        content: C.code(`Database(database="a7f3c2e1-9d8b-4c5a-b6e7-3f2a1d9c8b7a")
  | Query("SELECT region, SUM(revenue) as total FROM sales GROUP BY region")
  | Import()
  | Frame()
  | QueryAll()
  | AutoTaskOptions(panel="0", layout="BarChart")
  | Collect(500);`, 'pixel')
                    },
                    {
                        title: 'What Each Step Does',
                        content: `
                            <ol>
                                <li><code>Database()</code> — select engine</li>
                                <li><code>Query()</code> — run SQL</li>
                                <li><code>Import()</code> — load into frame</li>
                                <li><code>Frame()</code> — reference the frame</li>
                                <li><code>QueryAll()</code> — select all rows</li>
                                <li><code>AutoTaskOptions()</code> — set viz type</li>
                                <li><code>Collect()</code> — limit and return</li>
                            </ol>
                        `
                    }
                )}
                ${C.callout(`<strong>Recipes</strong> are saved chains of Pixel commands. When you save an insight, ${CONFIG.productName} saves the Pixel recipe that produced it. Recipes can be replayed, shared, and embedded in apps.`, 'info')}
            `
        },
        {
            id: "d1-pixel-variables",
            title: "Variables in Pixel",
            content: `
                <h2>Variables in Pixel</h2>
                ${C.code(`// Assignment
myVar = "Hello World";
count = 42;
myList = ["a", "b", "c"];

// Using variables
myEngine = "my-gpt4-engine";
LLM(engine=myEngine, command="Tell me a joke");

// Database query example
Database(database = "66cf4dbb-483f-42e7-8804-4e3d5af89287") | Query("<encode> your select query </encode>") | Collect(500);`, 'pixel', 'Pixel Variables')}
                ${C.callout('Variables persist within the scope of the current <strong>insight</strong> (session). They are not shared across different insights or users.', 'info')}
            `
        },
        {
            id: "d1-reactors-what-are",
            title: "What are Reactors?",
            content: `
                <h2>What are Reactors?</h2>
                <p class="lead">A <span class="highlight">Reactor</span> is a Java class that executes a single operation in the ${CONFIG.productName} pipeline.</p>
                <p>When you write <code>Echo("hello")</code>, ${CONFIG.productName}:</p>
                ${C.flow([
                    { title: '1. Parse', desc: 'Pixel parser tokenizes "Echo(\\"hello\\")"' },
                    { title: '2. Resolve', desc: 'ReactorFactory looks up EchoReactor class', arrow: '↓ ReactorFactory' },
                    { title: '3. Instantiate', desc: 'new EchoReactor() created', arrow: '↓ reflection' },
                    { title: '4. Bind Parameters', desc: 'setNoun("0", "hello")', arrow: '↓ setNoun()' },
                    { title: '5. Execute', desc: 'execute() runs core logic', accent: true, arrow: '↓ execute()' },
                    { title: '6. Return', desc: 'NounMetadata result passed to next reactor or to UI' },
                ])}
            `
        },
        {
            id: "d1-reactors-anatomy",
            title: "Anatomy of a Reactor",
            content: `
                <h2>Anatomy of a Reactor</h2>
                ${C.code(`// src/prerna/date/reactor/DateReactor.java
package prerna.date.reactor;

import java.util.Calendar;
import prerna.date.SemossDate;
import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.nounmeta.NounMetadata;

public class DateReactor extends AbstractReactor {
    private static final String DEFAULT_FORMAT = "yyyy-MM-dd";

    public DateReactor() {
        this.keysToGet = new String[]{"date", "format"};
        this.keyRequired = new int[] {0,0};
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();
        SemossDate date = null;
        String pattern = DEFAULT_FORMAT;

        // determine format
        if(this.keyValue.containsKey(this.keysToGet[1])) {
            pattern = this.keyValue.get(this.keysToGet[1]);
        }

        if(this.keyValue.containsKey(this.keysToGet[0])) {
            String strDate = this.keyValue.get(this.keysToGet[0]);
            date = new SemossDate(strDate, pattern);
            date.getZonedDateTime();
        } else {
            date = new SemossDate(Calendar.getInstance().getTime(), pattern);
        }

        return new NounMetadata(date, PixelDataType.CONST_DATE);
    }

    @Override
    public String getReactorDescription() {
        return "Get todays date or return a date based on a specific date input and format";
    }

    @Override
    protected String getDescriptionForKey(String key) {
        if("date".equals(key)) {
            return "A specific date to return. This is a string and assumes a date of yyyy-MM-dd";
        } else if("format".equals(key)) {
            return "A specified format for the date parameter to parse. This should be a Java compliant format";
        }
        return super.getDescriptionForKey(key);
    }
}`, 'java', 'DateReactor — Production code from prerna.date.reactor')}
                <h3>Key Patterns</h3>
                <ul>
                    <li><code>keysToGet</code> — declares expected parameter names ("date", "format")</li>
                    <li><code>keyRequired</code> — specifies which params are required (0=optional for both)</li>
                    <li><code>organizeKeys()</code> — populates <code>keyValue</code> map from input params</li>
                    <li><code>execute()</code> — the core logic, always returns <code>NounMetadata</code></li>
                    <li><code>getReactorDescription()</code> — provides user-facing documentation</li>
                    <li><code>getDescriptionForKey()</code> — documents each parameter</li>
                    <li><code>NounMetadata</code> — wraps <strong>value</strong> + <strong>PixelDataType</strong></li>
                </ul>
            `
        },
        {
            id: "d1-reactors-builtin",
            title: "Built-in Reactors",
            content: `
                <h2>Built-in Reactors Overview</h2>
                ${C.table(
                    ['Category', 'Reactors', 'Location in src/'],
                    [
                        ['<strong>Data</strong>', 'Database, Query, Import, Frame', '<code>reactor/database/</code>'],
                        ['<strong>Transform</strong>', 'Filter, Sort, Join, Group', '<code>reactor/frame/</code>'],
                        ['<strong>AI / LLM</strong>', 'LLM, Embeddings, VectorSearch', '<code>reactor/model/</code>'],
                        ['<strong>Visualization</strong>', 'AutoTaskOptions, Collect', '<code>reactor/task/</code>'],
                        ['<strong>Export</strong>', 'ToCsv, ToExcel, Export', '<code>reactor/export/</code>'],
                        ['<strong>Security</strong>', 'SetEnginePermission', '<code>reactor/security/</code>'],
                        ['<strong>Utility</strong>', 'Echo, If, AddVar, UUID', '<code>reactor/</code> (root)'],
                        ['<strong>Engine Mgmt</strong>', 'MyEngines, EngineMetadata', '<code>reactor/engine/</code>'],
                        ['<strong>Project</strong>', 'CreateProject, SaveInsight', '<code>reactor/project/</code>'],
                        ['<strong>Agent</strong>', 'Agent orchestration reactors', '<code>reactor/agent/</code>'],
                    ]
                )}
                ${C.callout('The full reactor registry is in <code>ReactorFactory.java</code>. This class maps reactor names (strings) to Java classes.', 'info')}
            `
        },
        {
            id: "d1-reactors-nounmetadata",
            title: "NounMetadata & PixelDataType",
            content: `
                <h2>NounMetadata — The Universal Return Type</h2>
                <p>Every reactor returns a <code>NounMetadata</code> object. This is the contract that makes chaining work.</p>
                ${C.code(`// NounMetadata wraps three things:
NounMetadata result = new NounMetadata(
    value,                    // the actual data (String, Map, Frame, Vector, etc.)
    PixelDataType.FRAME,      // what type of data this is
    PixelOperationType.OPERATION  // what kind of operation produced this
);

// Common PixelDataTypes:
//   CONST_STRING, CONST_INT, CONST_DECIMAL
//   FRAME, MAP, VECTOR
//   BOOLEAN, NULL_VALUE
//   TASK (for visualizations)

// Common PixelOperationTypes:
//   OPERATION — normal operation return (default)
//   ERROR     — something failed
//   SUCCESS   — operation completed (no data)
//   WARNING   — succeeded with caveats`, 'java', 'NounMetadata Structure')}
                ${C.split(
                    {
                        title: 'Chaining via NounMetadata',
                        content: `
                            <p>When reactors are chained with <code>|</code>, the <code>NounMetadata</code> from reactor A becomes an input noun for reactor B.</p>
                            <p>This is how <code>Database() | Query()</code> works — Database returns the engine reference, Query picks it up.</p>
                        `
                    },
                    {
                        title: 'Error Propagation',
                        content: `
                            <p>If a reactor returns <code>PixelOperationType.ERROR</code>, the chain <strong>stops</strong>. The error message propagates back to the caller.</p>
                            <p>This is why <code>Database("nonexistent") | Query("...")</code> fails cleanly.</p>
                        `
                    }
                )}
            `
        },
        {
            id: "d1-reactors-rest-api",
            title: "REST API for Pixel",
            content: `
                <h2>Calling Pixel via REST API</h2>
                <p>The UI calls the same REST endpoints you can call with curl or Postman.</p>
                ${C.code(`// Run Pixel via REST
POST /api/engine/runPixel
Content-Type: application/json

{
    "insightId": "new",
    "expression": "Echo(\\"Hello from the API!\\");"
}

// Response structure
{
    "pixelReturn": [{
        "pixelExpression": "Echo(\\"Hello from the API!\\");",
        "pixelId": "...",
        "output": "Hello from the API!",
        "operationType": ["OPERATION"]
    }]
}`, 'http', 'Pixel REST API')}
                <h3>Key Endpoints</h3>
                ${C.table(
                    ['Endpoint', 'Method', 'Purpose'],
                    [
                        ['<code>/api/engine/runPixel</code>', 'POST', 'Execute Pixel commands'],
                        ['<code>/api/engine/openInsight</code>', 'POST', 'Open a new insight session'],
                        ['<code>/api/engine/getEngines</code>', 'GET', 'List available engines'],
                        ['<code>/api/auth/login</code>', 'POST', 'Authenticate'],
                    ]
                )}
                ${C.callout('<strong>DevTools tip:</strong> Open browser DevTools → Network tab to see the Pixel commands the UI generates as you interact with it.', 'tip')}
            `
        },
        {
            id: "d1-reactors-request-flow-full",
            title: "Full Request Flow",
            content: `
                <h2>Full Request Flow: UI → Reactor → Engine</h2>
                <p>Putting it all together — here's what happens when a user runs a Pixel command:</p>
                ${C.sequence(
                    ["Browser/UI", "REST API (Monolith)", "PixelRunner", "Reactor", "Engine"],
                    [
                        { from: 0, to: 1, label: "POST /api/engine/runPixel" },
                        { from: 1, to: 2, label: "Parse Pixel expression" },
                        { from: 2, to: 3, label: "Instantiate & execute()" },
                        { from: 3, to: 4, label: "Execute operation (query/inference)" },
                        { from: 4, to: 3, label: "Raw result", type: "response" },
                        { from: 3, to: 2, label: "NounMetadata", type: "response" },
                        { from: 2, to: 1, label: "pixelReturn[]", type: "response" },
                        { from: 1, to: 0, label: "JSON response", type: "response" }
                    ]
                )}
                ${C.callout('The <strong>PixelRunner</strong> parses the Pixel string, resolves reactor names to classes (via ReactorFactory), and executes them in sequence. Each reactor returns a <code>NounMetadata</code> object that becomes the input to the next reactor in the chain.', 'info')}
            `
        },
        {
            id: "d1-reactors-error-handling",
            title: "Error Handling",
            content: `
                <h2>Error Handling in Reactors</h2>
                ${C.split(
                    {
                        title: 'In Java (Reactor Code)',
                        content: C.code(`// Option 1: Throw an exception
throw new IllegalArgumentException(
    "Engine 'my_engine' not found"
);

// Option 2: Return error NounMetadata
NounMetadata error = new NounMetadata(
    "Something went wrong",
    PixelDataType.CONST_STRING,
    PixelOperationType.ERROR
);
return error;`, 'java')
                    },
                    {
                        title: 'In Pixel',
                        content: C.code(`// Errors stop the chain
Database(database="00000000-0000-0000-0000-000000000000")
  | Query("SELECT 1");
// → Error: Engine '00000000-...'
//   not found

// Check the Notebook output
// for detailed error messages

// Server logs have full
// Java stack traces`, 'pixel')
                    }
                )}
                <h3>Response Types</h3>
                ${C.cards([
                    { badge: 'Success', title: 'OPERATION', desc: 'Normal operation returned — query results, strings, maps' },
                    { badge: 'Success', title: 'SUCCESS', desc: 'Operation completed — no data payload (e.g., permission set)' },
                    { badge: 'Problem', title: 'WARNING', desc: 'Succeeded with caveats — partial results, deprecation notice' },
                    { badge: 'Problem', title: 'ERROR', desc: 'Failed — stops the chain, error message returned to caller' },
                ])}
            `
        },
        {
            id: "d1-pixel-handson",
            title: "Hands-on: Pixel & Reactors",
            content: `
                <h2>Hands-on: Write Pixel & Call Reactors</h2>
                ${C.handson('Pixel Exercises', `
                    <h4>Exercise 1: Basic Commands</h4>
                    <p>Open the Notebook and run:</p>
                    ${C.code(`// Simple echo
Echo("Hello from Spain!");

// List your engines
MyEngines();

// Use a variable
greeting = "Hola, Madrid!";
Echo(greeting);`, 'pixel')}

                    <h4>Exercise 2: Query a Database</h4>
                    ${C.code(`Database(database="f9e8d7c6-b5a4-4321-9876-1e2d3c4b5a6f")
  | Query("SELECT * FROM country LIMIT 5");`, 'pixel')}

                    <h4>Exercise 3: Call an LLM</h4>
                    ${C.code(`LLM(engine="a1b2c3d4-5e6f-7890-abcd-1234567890ab",
    command="What is the capital of Spain?");`, 'pixel')}

                    <h4>Exercise 4: Chain Commands</h4>
                    ${C.code(`Database(database="f9e8d7c6-b5a4-4321-9876-1e2d3c4b5a6f")
  | Query("SELECT country_name, population FROM country ORDER BY population DESC LIMIT 10")
  | Import()
  | Frame()
  | QueryAll()
  | AutoTaskOptions(panel="0", layout="BarChart")
  | Collect(500);`, 'pixel')}

                    <h4>Exercise 5: REST API (Bonus)</h4>
                    ${C.code(`curl -X POST http://localhost:8080/api/engine/runPixel \\
  -H "Content-Type: application/json" \\
  -d '{"insightId":"new","expression":"Echo(\\"Hello from API!\\");"}'`, 'bash')}
                `)}
            `
        },
        {
            id: "d1-recap",
            title: "Day 1 Recap",
            content: `
                ${C.titleSlide("Day 1 Recap", "What we covered today")}
                ${C.cards([
                    { badge: 'Chapter 1', title: 'Platform Fundamentals', desc: 'Three-tier architecture: Java + Python GAAS + React frontend' },
                    { badge: 'Chapter 1', title: 'Repository Structure', desc: 'Semoss (core), Monolith (web), SemossWeb (frontend)' },
                    { badge: 'Chapter 2', title: 'Engines', desc: 'Six engine types: Database, Model, Vector, Storage, Function, Guardrail' },
                    { badge: 'Chapter 2', title: '.smss Files', desc: 'Engine configuration, lifecycle, and cloud sync' },
                    { badge: 'Chapter 3', title: 'Pixel', desc: 'Command language: syntax, chaining, variables, recipes' },
                    { badge: 'Chapter 3', title: 'Reactors', desc: 'Java execution classes: lifecycle, NounMetadata, ReactorFactory' },
                ])}
                <h3>Tomorrow: Day 2</h3>
                <p>Advanced development — building custom reactors, advanced Pixel patterns, extending the platform.</p>
                ${C.callout('<strong>Questions?</strong> Ask now or come find us during the evening.', 'tip')}
            `
        }
    ]
};
