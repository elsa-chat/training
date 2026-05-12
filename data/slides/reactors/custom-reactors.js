// Topic: Building Your Own Reactor
const slides_custom_reactors = [
        {
            id: "reactor-title",
            title: "Building Your Own Reactor",
            content: C.titleSlide(
                "Building Your Own Reactor",
                "Java reactor development, registration, and testing",
                "90 minutes"
            )
        },
        {
            id: "reactor-interface",
            title: "Reactor Interface & Implementation",
            content: `
                <h2>Reactor Interface & Implementation</h2>
                <p class="lead">Every reactor implements <code>IReactor</code>, but in practice you always extend <span class="highlight">AbstractReactor</span>  -  it handles noun management, planner integration, and error utilities for you.</p>
                ${C.split(
                    {
                        title: 'IReactor (Interface)',
                        content: `
                            <p>Defines the contract every reactor must fulfill:</p>
                            <ul>
                                <li><code>execute()</code>  -  Run logic, return result</li>
                                <li><code>getNounStore()</code>  -  Access input parameters</li>
                                <li><code>mergeUp()</code>  -  Push data to parent reactor</li>
                                <li><code>getInputs()</code> / <code>getOutputs()</code></li>
                                <li><code>setInsight()</code> / <code>setPixelPlanner()</code></li>
                                <li><code>getHelp()</code> / <code>getSignature()</code></li>
                            </ul>
                        `
                    },
                    {
                        title: 'AbstractReactor (Base Class)',
                        content: `
                            <p>Provides all the plumbing so you focus on logic:</p>
                            <ul>
                                <li><code>keysToGet</code>  -  Declare expected inputs</li>
                                <li><code>keyRequired</code>  -  Mark required vs optional</li>
                                <li><code>organizeKeys()</code>  -  Auto-map inputs to <code>keyValue</code></li>
                                <li><code>NounStore store</code>  -  Full access to raw inputs</li>
                                <li><code>Insight insight</code>  -  Current session context</li>
                                <li>Typed getters: <code>getString()</code>, <code>getInt()</code>, <code>getBoolean()</code>, <code>getMap()</code>, <code>getList()</code></li>
                            </ul>
                        `
                    }
                )}
                ${C.callout('<strong>Rule of thumb:</strong> Always extend <code>AbstractReactor</code>. Implementing <code>IReactor</code> directly means reimplementing noun management, planner integration, and error handling from scratch.', 'warning')}
            `
        },
        {
            id: "reactor-skeleton",
            title: "Reactor Skeleton",
            content: `
                <h2>Reactor Skeleton</h2>
                <p>Every custom reactor follows the same structure. Here is the minimal pattern.</p>
                ${C.code(`package com.myorg.reactors;

import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.PixelOperationType;
import prerna.sablecc2.om.nounmeta.NounMetadata;

public class MyCustomReactor extends AbstractReactor {

    public MyCustomReactor() {
        // 1. Declare input parameter names
        this.keysToGet = new String[]{"inputText", "maxLength", "uppercase"};

        // 2. Mark required (1) vs optional (0)
        this.keyRequired = new int[]{1, 0, 0};
    }

    @Override
    public NounMetadata execute() {
        // 3. Map Pixel arguments into keyValue
        organizeKeys();

        // 4. Retrieve inputs (typed getters from AbstractReactor)
        String inputText = getString("inputText");
        Integer maxLength = getInt("maxLength", 100);       // default = 100
        Boolean uppercase = getBoolean("uppercase", false);  // default = false

        // 5. Core logic
        String result = inputText;
        if (uppercase) {
            result = result.toUpperCase();
        }
        if (result.length() > maxLength) {
            result = result.substring(0, maxLength) + "...";
        }

        // 6. Return typed result
        return new NounMetadata(result, PixelDataType.CONST_STRING);
    }

    @Override
    public String getReactorDescription() {
        return "Processes input text with optional truncation and case conversion.";
    }
}`, 'java', 'Minimal custom reactor pattern')}
                ${C.callout('The class name determines the Pixel command name. <code>MyCustomReactor</code> → <code>MyCustom()</code>. The "Reactor" suffix is stripped automatically.', 'tip')}
            `
        },
        {
            id: "reactor-inputs-nounstore",
            title: "Inputs  -  NounStore Deep Dive",
            content: `
                <h2>Inputs  -  NounStore Deep Dive</h2>
                <p>When Pixel calls your reactor, all arguments are placed in the <code>NounStore</code> as <code>GenRowStruct</code> containers, each holding one or more <code>NounMetadata</code> objects.</p>
                <h3>How Input Flows</h3>
                ${C.flow([
                    { title: 'Pixel Call', desc: 'MyCustom(inputText=["hello"], maxLength=[50])' },
                    { title: 'NounStore', desc: 'Key → GenRowStruct map populated by parser', arrow: '→' },
                    { title: 'organizeKeys()', desc: 'Maps first value of each key into keyValue map', arrow: '→' },
                    { title: 'Typed Getters', desc: 'getString(), getInt(), getList(), getMap()...' },
                ])}
                <h3>Accessing Inputs</h3>
                ${C.code(`// SIMPLE: Use typed getters (preferred)
String text = getString("inputText");                    // single value
Integer count = getInt("limit", 10);                     // with default
Boolean flag = getBoolean("verbose", false);             // with default
Map<String, Object> config = getMap("paramValuesMap");   // map input

// LISTS: Use list getters
List<String> columns = getListString("columns");         // ["col1", "col2"]
List<Integer> ids = getListInteger("ids");               // [1, 2, 3]

// RAW: Access NounStore directly for complex cases
GenRowStruct grs = this.store.getGenRowStruct("myKey");
if (grs != null && !grs.isEmpty()) {
    NounMetadata noun = grs.getNoun(0);
    PixelDataType type = noun.getNounType();  // inspect type
    Object rawValue = noun.getValue();         // get raw object
}`, 'java', 'Input retrieval patterns')}
                ${C.callout('<strong>Key alias support:</strong> Define <code>keysToGet</code> with comma-separated aliases like <code>"engine,engineId,model"</code>. The first name is canonical; all others are accepted alternatives.', 'info')}
            `
        },
        {
            id: "reactor-outputs-nounmetadata",
            title: "Outputs  -  NounMetadata",
            content: `
                <h2>Outputs  -  NounMetadata</h2>
                <p>Every reactor returns a <code>NounMetadata</code> object that wraps the result with type classification and operation signals.</p>
                ${C.table(
                    ['Field', 'Type', 'Purpose'],
                    [
                        ['<code>value</code>', 'Object', 'The actual result  -  String, Map, List, ITableDataFrame, etc.'],
                        ['<code>nounType</code>', '<code>PixelDataType</code>', 'Classifies the data for downstream consumers'],
                        ['<code>opType</code>', '<code>PixelOperationType</code>', 'Signals how the system and UI should handle the result'],
                    ]
                )}
                <h3>Common Return Patterns</h3>
                ${C.code(`// Simple values
return new NounMetadata("done", PixelDataType.CONST_STRING);
return new NounMetadata(42, PixelDataType.CONST_INT);
return new NounMetadata(true, PixelDataType.BOOLEAN);

// Structured data
return new NounMetadata(myMap, PixelDataType.MAP, PixelOperationType.OPERATION);
return new NounMetadata(myList, PixelDataType.LIST);

// New data frame (signals UI to register it)
return new NounMetadata(newFrame, PixelDataType.FRAME, PixelOperationType.NEW_FRAME);

// Chart data (signals UI to update a panel)
return new NounMetadata(vizPayload, PixelDataType.MAP, PixelOperationType.VIZ_DATA);

// Messages (displayed as toasts in UI)
return NounMetadata.getSuccessNounMessage("Import completed!");
return NounMetadata.getErrorNounMessage("File not found");
return NounMetadata.getWarningNounMessage("3 rows skipped");`, 'java', 'Return patterns by use case')}
                <h3>Key PixelOperationTypes</h3>
                ${C.table(
                    ['PixelOperationType', 'When to Use'],
                    [
                        ['<code>OPERATION</code>', 'Generic successful result  -  default for most reactors'],
                        ['<code>VIZ_DATA</code>', 'Returning data that should render in a UI panel (chart, grid)'],
                        ['<code>NEW_FRAME</code>', 'You created a new ITableDataFrame'],
                        ['<code>FRAME_DATA_CHANGE</code>', 'You modified an existing frame\'s data'],
                        ['<code>PANEL_ORNAMENT_CHANGE</code>', 'You changed a panel\'s visual settings'],
                        ['<code>SUCCESS_MESSAGE / ERROR</code>', 'Display a toast notification to the user'],
                        ['<code>FILE_DOWNLOAD</code>', 'Trigger a file download in the browser'],
                    ]
                )}
            `
        },
        {
            id: "reactor-development-workflow",
            title: "Development Workflow",
            content: `
                <h2>Java Reactor Development Workflow</h2>
                <p>The cycle from writing code to running your reactor in ${CONFIG.productName}.</p>
                ${C.flow([
                    { title: '1. Write Reactor', desc: 'Create your Java class extending AbstractReactor' },
                    { title: '2. Compile', desc: 'Build the .class file (javac or IDE build)', arrow: '↓' },
                    { title: '3. Deploy', desc: 'Copy .class into project/version/assets/java/<package>/', arrow: '↓' },
                    { title: '4. Reload', desc: 'Run ReloadInsightClasses("<project-id>") in Pixel', arrow: '↓' },
                    { title: '5. Invoke & Test', desc: 'Call your reactor from Pixel or the console' },
                ])}
                <h3>File Placement</h3>
                ${C.code(`# Project directory structure
<SEMOSS_HOME>/project/<project-id>/
    version/
        assets/
            java/
                com/
                    myorg/
                        reactors/
                            MyCustomReactor.class    ← compiled class
                            AddNumbersReactor.class
            py/
                ...`, 'bash', 'Where to place compiled reactor classes')}
                <h3>Reload & Invoke</h3>
                ${C.code(`// Step 1: Set context to your project
SetContext("<your-project-id>");

// Step 2: Reload classes (clears cached classloaders)
ReloadInsightClasses("<your-project-id>");

// Step 3: Invoke your reactor
result = MyCustom(inputText=["Hello World"], maxLength=[5], uppercase=[true]);
// result = "HELLO..."`, 'pixel', 'Deploying and calling the reactor')}
                ${C.callout('<strong>No server restart needed.</strong> <code>ReloadInsightClasses()</code> clears the classloader cache for the project and picks up new or updated .class files immediately.', 'tip')}
            `
        },
        {
            id: "reactor-registering",
            title: "Registering Custom Reactors",
            content: `
                <h2>Registering Custom Reactors</h2>
                <p>Reactors are discovered by the project classloader based on file placement and naming conventions.</p>
                <h3>Registration Rules</h3>
                ${C.cards([
                    { badge: 'Naming', title: 'Class Name = Pixel Name', desc: 'MyCustomReactor → MyCustom(). The "Reactor" suffix is automatically stripped when registering the Pixel command name.' },
                    { badge: 'Packaging', title: 'Package Structure Matters', desc: 'The .class file must live in a directory matching its Java package declaration (e.g., com/myorg/reactors/).' },
                    { badge: 'Scope', title: 'Project-Scoped', desc: 'Custom reactors are only available within the project they\'re deployed to. Use SetContext() before invoking.' },
                    { badge: 'Override', title: 'Name Collisions', desc: 'If your reactor name matches a core reactor, the project-level reactor takes precedence within that project context.' },
                ])}
                <h3>MCP Tool Registration</h3>
                <p>Reactors automatically expose themselves as MCP tools via the <code>asMcpTool()</code> method inherited from <code>AbstractReactor</code>.</p>
                ${C.code(`// AbstractReactor.asMcpTool() generates this automatically:
{
    "name": "MyCustom",
    "title": "My Custom",
    "description": "Processes input text with optional truncation...",
    "inputSchema": {
        "type": "object",
        "properties": {
            "inputText":  { "type": "string", "description": "..." },
            "maxLength":  { "type": "integer", "description": "..." },
            "uppercase":  { "type": "string", "description": "..." }
        },
        "required": ["inputText"]
    }
}`, 'json', 'Auto-generated MCP tool definition')}
                ${C.callout('Override <code>getDescriptionForKey(String key)</code> to provide meaningful descriptions for each parameter. These descriptions surface in MCP tool definitions and the <code>help()</code> output.', 'tip')}
            `
        },
        {
            id: "reactor-testing-debugging",
            title: "Testing & Debugging",
            content: `
                <h2>Testing & Debugging Reactors</h2>
                <p>Strategies for validating your reactor at each stage of development.</p>
                <h3>Pixel Console Testing</h3>
                ${C.code(`// Test basic invocation
result = MyCustom(inputText=["test"]);
result;  // Inspect the return value

// Test with all parameters
result = MyCustom(inputText=["Hello World"], maxLength=[5], uppercase=[true]);
result;  // "HELLO..."

// Test missing required input (should throw)
result = MyCustom(maxLength=[10]);
// Error: "Required input(s) missing: inputText"

// Test edge cases
result = MyCustom(inputText=[""], uppercase=[true]);
result = MyCustom(inputText=["x"], maxLength=[1000]);

// Check help text
Help(reactor=["MyCustom"]);`, 'pixel', 'Testing from the Pixel console')}
                <h3>Debugging Techniques</h3>
                ${C.table(
                    ['Technique', 'How', 'When to Use'],
                    [
                        ['<strong>Pixel Console</strong>', 'Call reactor directly with test inputs', 'Quick smoke tests and edge case validation'],
                        ['<strong>Logger</strong>', '<code>getLogger(ClassName).info("value: " + val)</code>', 'Tracing execution flow and variable state'],
                        ['<strong>IDE Debugger</strong>', 'Attach Eclipse/IntelliJ to Tomcat process', 'Stepping through complex logic and breakpoints'],
                        ['<strong>Error Returns</strong>', 'Return <code>NounMetadata.getErrorNounMessage(msg)</code>', 'Surfacing errors to the UI during development'],
                        ['<strong>Help Command</strong>', '<code>Help(reactor=["MyCustom"])</code>', 'Verifying input definitions and MCP schema'],
                    ]
                )}
                ${C.code(`// Using the built-in logger inside your reactor
Logger logger = getLogger(MyCustomReactor.class.getName());
logger.info("Input text: " + inputText);
logger.info("Max length: " + maxLength);
logger.warn("Text was truncated from " + original + " to " + maxLength);`, 'java', 'Logging inside a reactor')}
                ${C.callout('<strong>Common pitfall:</strong> If your reactor doesn\'t appear after <code>ReloadInsightClasses()</code>, check that (1) the package directory matches the class declaration, (2) the .class file compiled without errors, and (3) you called <code>SetContext()</code> for the correct project.', 'warning')}
            `
        },
        {
            id: "reactor-best-practices",
            title: "Best Practices",
            content: `
                <h2>Best Practices for Reactor Design</h2>
                ${C.cards([
                    { badge: 'Single Purpose', title: 'One Reactor, One Job', desc: 'Keep reactors focused on a single task. For complex operations, compose multiple reactors via Pixel rather than building monolithic execute() methods.' },
                    { badge: 'Validation', title: 'Validate Inputs Early', desc: 'Check required parameters, types, and value ranges at the top of execute(). Use keyRequired for basics, then add custom checks with clear error messages.' },
                    { badge: 'Typing', title: 'Use Precise Return Types', desc: 'Always use the most specific PixelDataType and PixelOperationType. Don\'t return a Map as CONST_STRING  -  downstream consumers and the UI depend on accurate types.' },
                    { badge: 'Descriptions', title: 'Document Everything', desc: 'Override getReactorDescription() and getDescriptionForKey() for every reactor. This powers Help(), MCP tool generation, and onboarding for other developers.' },
                    { badge: 'Errors', title: 'Fail Gracefully', desc: 'Use try-catch blocks and return NounMetadata.getErrorNounMessage() with actionable messages. Throw SemossPixelException for hard failures that should halt execution.' },
                    { badge: 'Naming', title: 'Clear, Consistent Names', desc: 'Use descriptive class names that read as verbs: AddMovieReactor, ExportReportReactor, ValidateSchemaReactor. The "Reactor" suffix is stripped for the Pixel command.' },
                ])}
                <h3>Anti-Patterns to Avoid</h3>
                ${C.table(
                    ['Anti-Pattern', 'Why It\'s a Problem', 'Better Approach'],
                    [
                        ['"God" reactor (500+ line execute)', 'Hard to test, debug, and reuse', 'Split into smaller reactors composed via Pixel'],
                        ['Swallowing exceptions silently', 'Failures go undetected', 'Log + return error NounMetadata or throw SemossPixelException'],
                        ['Hardcoding engine/project IDs', 'Breaks across environments', 'Accept IDs as input parameters'],
                        ['Ignoring keyRequired', 'Null pointer exceptions at runtime', 'Always define keyRequired array matching keysToGet'],
                        ['Returning wrong PixelDataType', 'UI updates break or data is misinterpreted', 'Match the type to the actual value object'],
                    ]
                )}
            `
        },
        {
            id: "reactor-handson",
            title: "Hands-on: Build a Reactor",
            content: `
                <h2>Hands-on: Build a Custom Reactor</h2>
                ${C.handson('Build a CRUD Reactor', `
                    <h4>Step 1: Create the Reactor Class</h4>
                    <p>Build a reactor that inserts a record into a database engine.</p>
                    ${C.code(`package com.training.reactors;

import prerna.reactor.AbstractReactor;
import prerna.engine.api.IDatabaseEngine;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.PixelOperationType;
import prerna.sablecc2.om.nounmeta.NounMetadata;
import prerna.util.Utility;

public class AddMovieReactor extends AbstractReactor {

    public AddMovieReactor() {
        this.keysToGet = new String[]{"engine", "title", "year", "genre"};
        this.keyRequired = new int[]{1, 1, 1, 0};
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();

        String engineId = testDatabaseId(getString("engine"), true);
        String title = getString("title");
        Integer year = getInt("year");
        String genre = getString("genre", "Unknown");

        IDatabaseEngine engine = Utility.getDatabase(engineId);
        String sql = "INSERT INTO movies (title, year, genre) VALUES ('"
            + title.replace("'", "''") + "', " + year + ", '"
            + genre.replace("'", "''") + "')";

        try {
            engine.insertData(sql);
        } catch (Exception e) {
            return NounMetadata.getErrorNounMessage(
                "Failed to insert movie: " + e.getMessage()
            );
        }

        return NounMetadata.getSuccessNounMessage(
            "Added movie: " + title + " (" + year + ")"
        );
    }

    @Override
    public String getReactorDescription() {
        return "Inserts a movie record into the specified database engine.";
    }

    @Override
    protected String getDescriptionForKey(String key) {
        if (key.equals("title")) return "The movie title";
        if (key.equals("year")) return "Release year (integer)";
        if (key.equals("genre")) return "Genre category (optional, defaults to Unknown)";
        return super.getDescriptionForKey(key);
    }
}`, 'java')}

                    <h4>Step 2: Compile and Deploy</h4>
                    ${C.code(`# Compile (adjust classpath for your environment)
javac -cp "/opt/semosshome/lib/*" AddMovieReactor.java

# Deploy to project
cp AddMovieReactor.class \\
  /opt/semosshome/project/<project-id>/version/assets/java/com/training/reactors/`, 'bash')}

                    <h4>Step 3: Reload and Test</h4>
                    ${C.code(`// Reload project classes
SetContext("<project-id>");
ReloadInsightClasses("<project-id>");

// Test: happy path
AddMovie(engine=["my_db"], title=["Inception"], year=[2010], genre=["Sci-Fi"]);
// Success: "Added movie: Inception (2010)"

// Test: missing required field
AddMovie(engine=["my_db"], title=["Inception"]);
// Error: "Required input(s) missing: year"

// Test: optional genre defaults
AddMovie(engine=["my_db"], title=["Tenet"], year=[2020]);
// Success: "Added movie: Tenet (2020)"  -  genre = "Unknown"

// Check help and MCP schema
Help(reactor=["AddMovie"]);`, 'pixel')}
                `)}
            `
        },
        {
            id: "reactor-recap",
            title: "Recap",
            content: `
                <h2>Building Your Own Reactor  -  Recap</h2>
                ${C.cards([
                    { badge: 'Interface', title: 'AbstractReactor', desc: 'Always extend AbstractReactor  -  it handles NounStore, organizeKeys(), typed getters, and error utilities' },
                    { badge: 'Inputs', title: 'keysToGet + NounStore', desc: 'Declare parameters with keysToGet/keyRequired, retrieve via getString(), getInt(), getMap(), etc.' },
                    { badge: 'Outputs', title: 'NounMetadata', desc: 'Wrap results with PixelDataType + PixelOperationType for typed, actionable returns' },
                    { badge: 'Deploy', title: 'Hot Reload', desc: 'Place .class files in project/version/assets/java/, then ReloadInsightClasses()  -  no restart' },
                    { badge: 'Register', title: 'Auto-Discovery', desc: 'Class name minus "Reactor" suffix = Pixel command. MCP tool schema generated automatically.' },
                    { badge: 'Debug', title: 'Console + Logger', desc: 'Test from Pixel console, use getLogger() for tracing, attach IDE debugger for complex issues' },
                    { badge: 'Design', title: 'Best Practices', desc: 'Single purpose, validate early, precise types, document with getReactorDescription()' },
                ])}
            `
        }
    ];
