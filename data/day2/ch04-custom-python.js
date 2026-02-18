// Day 2, Chapter 4: Custom Python (105 min)
const day2_ch04 = {
    title: "Custom Python",
    slides: [
        {
            id: "d2-python-title",
            title: "Custom Python",
            content: C.titleSlide(
                "Custom Python",
                "Python GAAS runtime and Java-Python communication",
                "105 minutes"
            )
        },
        {
            id: "d2-python-gaas-overview",
            title: "What is GAAS?",
            content: `
                <h2>What is GAAS?</h2>
                <p class="lead"><span class="highlight">GAAS</span> (Generative AI Agent Services) is SEMOSS's out-of-process Python runtime.</p>
                <p>Python code runs in a <strong>separate process</strong> from the Java server, communicating over a <strong>TCP socket</strong> using a shared message protocol.</p>
                ${C.cards([
                    { badge: 'Isolation', title: 'Separate Process', desc: 'Python crashes don\'t take down the Java server' },
                    { badge: 'Scalability', title: 'Async Execution', desc: 'Long-running Python tasks don\'t block HTTP threads' },
                    { badge: 'Flexibility', title: 'Package Management', desc: 'Install any pip package without restarting' },
                    { badge: 'Security', title: 'Sandboxed Imports', desc: 'Blocks dangerous modules (socket, subprocess)' },
                ])}
                ${C.callout('<strong>Why separate?</strong> Running Python in-process (via Jython or GraalVM) limits package compatibility. Out-of-process execution gives full access to the Python ecosystem.', 'info')}
            `
        },
        {
            id: "d2-python-architecture",
            title: "GAAS Architecture",
            content: `
                <h2>GAAS Architecture</h2>
                <p>The GAAS runtime is a multi-threaded Python TCP server that manages per-insight execution contexts.</p>
                ${C.layers([
                    {
                        label: "Java Layer (Semoss)",
                        items: [
                            { title: "PyTranslator", desc: "Java client for Python calls" },
                            { title: "SocketClient", desc: "TCP socket communication" },
                            { title: "PayloadStruct", desc: "Message protocol" }
                        ]
                    },
                    {
                        label: "Communication",
                        accent: true,
                        items: [
                            { title: "TCP Socket", desc: "localhost:9999", accent: true },
                            { title: "JSON Framing", desc: "4-byte len + 20-byte epoc + JSON", accent: true }
                        ]
                    },
                    {
                        label: "Python Layer (GAAS)",
                        items: [
                            { title: "gaas_tcp_socket_server.py", desc: "TCP server" },
                            { title: "gaas_tcp_server_handler.py", desc: "Request handler" },
                            { title: "gaas_server_proxy.py", desc: "Python → Java callbacks" }
                        ]
                    }
                ])}
                ${C.callout('The GAAS server starts when SEMOSS starts (via <code>RUN_PYTHON_AS_SERVICE=true</code>) and listens on <code>localhost:9999</code>.', 'tip')}
            `
        },
        {
            id: "d2-python-payloadstruct",
            title: "PayloadStruct Protocol",
            content: `
                <h2>PayloadStruct — The Message Protocol</h2>
                <p><code>PayloadStruct</code> is the shared message schema for Java ↔ Python communication.</p>
                ${C.code(`public class PayloadStruct {
    // Correlation/flow
    public String epoc;           // Request/response ID (UUID)
    public boolean response;      // Is this a response?
    public boolean interim;       // Streaming chunk?
    public String parentEpoc;     // Parent request ID

    // Routing
    public enum OPERATION {
        R, PYTHON, CHROME, ECHO, ENGINE, REACTOR, INSIGHT, PROJECT, CMD, STDOUT, STDERR, STRUCTURED_STREAM
    }
    public OPERATION operation;
    public String methodName;

    // Data
    public Object[] payload;           // Actual data
    public Class[] payloadClasses;     // Java types
    public String[] payloadClassNames; // Type names for Python

    // Context
    public String insightId;           // Namespace for Python globals
    public String executionInsightId;  // Execution context
    public String projectId;           // App context
    public String[] asset_paths;       // sys.path additions

    // Errors
    public String ex;                  // Error message (if any)
}`, 'java', 'src/prerna/tcp/PayloadStruct.java (simplified)')}
                <h3>Key Fields</h3>
                <ul>
                    <li><code>epoc</code> — Unique request ID used to correlate requests and responses</li>
                    <li><code>operation</code> — Type of operation (PYTHON, ENGINE, REACTOR, etc.)</li>
                    <li><code>payload</code> — The actual data being sent (e.g., Python code string, results)</li>
                    <li><code>insightId</code> — Insight namespace (Python globals dict key)</li>
                    <li><code>ex</code> — Error message string (non-null = failure)</li>
                </ul>
            `
        },
        {
            id: "d2-python-communication-flow",
            title: "Java → Python Communication",
            content: `
                <h2>Java → Python Communication Flow</h2>
                <p>When Java needs to run Python code, it sends a PayloadStruct over the TCP socket and waits for a response.</p>
                ${C.sequence(
                    ['PyTranslator (Java)', 'SocketClient', 'TCP Socket', 'GAAS Handler', 'Python Runtime'],
                    [
                        { from: 0, to: 1, label: 'getString("str(42)")' },
                        { from: 1, to: 2, label: 'PayloadStruct{ operation=PYTHON, payload=["str(42)"] }' },
                        { from: 2, to: 3, label: 'Read 4-byte len + 20-byte epoc + JSON' },
                        { from: 3, to: 4, label: 'exec(code, insight_globals)' },
                        { from: 4, to: 3, label: 'result = "42"', type: 'response' },
                        { from: 3, to: 2, label: 'PayloadStruct{ response=true, payload=["42"] }', type: 'response' },
                        { from: 2, to: 1, label: 'JSON response', type: 'response' },
                        { from: 1, to: 0, label: 'return "42"', type: 'response' },
                    ]
                )}
                ${C.callout('Each request gets a unique <code>epoc</code> UUID. Java blocks until a response with the same <code>epoc</code> arrives.', 'info')}
            `
        },
        {
            id: "d2-python-insight-globals",
            title: "Per-Insight Globals",
            content: `
                <h2>Per-Insight Execution Context</h2>
                <p>GAAS maintains a <strong>separate globals dictionary</strong> for each insight, similar to Jupyter notebooks.</p>
                ${C.code(`# In gaas_tcp_server_handler.py
class InsightGlobalStore:
    """Singleton store for per-insight Python globals."""

    def __init__(self):
        self.insight_globals = {}  # { insightId: globals_dict }

    def get_insight_globals(self, insight_id: str) -> dict:
        """Get or create globals dict for an insight."""
        if insight_id not in self.insight_globals:
            self.insight_globals[insight_id] = {
                '__name__': '__main__',
                '__smss_cwd__': os.getcwd(),  # per-insight CWD
            }
        return self.insight_globals[insight_id]

    def remove_insight_globals(self, insight_id: str):
        """Clear globals for an insight (cleanup)."""
        if insight_id in self.insight_globals:
            del self.insight_globals[insight_id]`, 'python', 'py/gaas_tcp_server_handler.py (simplified)')}
                <h3>What This Means</h3>
                ${C.split(
                    {
                        title: 'Isolation',
                        content: `
                            <p>Each insight gets its own namespace. Variables defined in insight A are invisible to insight B.</p>
                            <p>Perfect for multi-user environments.</p>
                        `
                    },
                    {
                        title: 'Persistence',
                        content: `
                            <p>Variables persist across Pixel commands within the same insight.</p>
                            <p>Similar to Jupyter: run cells, build state incrementally.</p>
                        `
                    }
                )}
            `
        },
        {
            id: "d2-python-calling-from-pixel",
            title: "Calling Python from Pixel",
            content: `
                <h2>Calling Python from Pixel</h2>
                <p>SEMOSS provides several Pixel reactors to execute Python code.</p>
                ${C.code(`// Run Python code (wrapped in <encode> blocks)
Py("<encode>x = 10; print(x)</encode>");  // Output: 10

// Run Python and get result
result = Py("<encode>42 * 2</encode>");
Echo(result);  // 84

// Load a Python file from app assets
LoadPyFromFileProjectPy(
    filePath="my_module.py",
    alias="my_module"
);

// Call a function from loaded module
result = Py("<encode>my_module.my_function('arg1', 'arg2')</encode>");

// Check installed packages (returns all installed packages)
CheckPyPackages();  // Lists all packages
CheckPyPackages(reload=true);  // Force refresh`, 'pixel', 'Python execution Pixel commands')}
                <h3>Common Patterns</h3>
                ${C.table(
                    ['Reactor', 'Purpose', 'Example'],
                    [
                        ['<code>Py()</code>', 'Execute Python code (needs &lt;encode&gt; blocks)', '<code>Py("&lt;encode&gt;import pandas as pd&lt;/encode&gt;")</code>'],
                        ['<code>LoadPyFromFileProjectPy()</code>', 'Load app Python file', '<code>LoadPyFromFileProjectPy(filePath="...", alias="...")</code>'],
                        ['<code>CheckPyPackages()</code>', 'List installed packages', '<code>CheckPyPackages(reload=true)</code>'],
                        ['<code>GenerateFrameFromPyVariable()</code>', 'Import Python DataFrame', '<code>GenerateFrameFromPyVariable(varName="df")</code>'],
                    ]
                )}
                ${C.callout('<strong>Important:</strong> The <code>Py()</code> reactor requires Python code to be wrapped in <code>&lt;encode&gt;</code> tags for proper encoding.', 'warning')}
            `
        },
        {
            id: "d2-python-calling-from-java",
            title: "Calling Python from Java",
            content: `
                <h2>Calling Python from Java Reactors</h2>
                <p>Java reactors can execute Python code using the <code>PyTranslator</code> class.</p>
                ${C.code(`import prerna.ds.py.PyTranslator;

public class MyReactor extends AbstractReactor {

    @Override
    public NounMetadata execute() {
        // Get the insight's Python translator
        Insight insight = getInsight();
        PyTranslator pyTranslator = insight.getPyTranslator();

        // Execute Python code
        String pythonCode = "import pandas as pd; df = pd.DataFrame({'a': [1,2,3]})";
        pyTranslator.runEmptyPy(pythonCode);

        // Get a string result from Python
        String result = pyTranslator.getString("str(len(df))");
        // result = "3"

        // Get a list
        List<Object> myList = pyTranslator.getList("df['a'].tolist()");
        // myList = [1, 2, 3]

        return new NounMetadata(result, PixelDataType.CONST_STRING);
    }
}`, 'java', 'Using PyTranslator in custom reactors')}
                <h3>PyTranslator Public Methods</h3>
                <ul>
                    <li><code>runEmptyPy(script)</code> — Run Python code without returning a value</li>
                    <li><code>getString(script)</code> — Get a string result</li>
                    <li><code>getList(script)</code> — Get a list result</li>
                    <li><code>getBoolean(script)</code> — Get a boolean result</li>
                </ul>
            `
        },
        {
            id: "d2-python-callbacks",
            title: "Python → Java Callbacks",
            content: `
                <h2>Python → Java Callbacks</h2>
                <p>Python code can call <strong>back into Java</strong> to run reactors or access engines.</p>
                ${C.code(`# In Python (using gaas_server_proxy)
import gaas_server_proxy as gsp
import uuid

# Call a reactor from Python (runs Pixel expression)
epoc = str(uuid.uuid4())
result = gsp.callReactor(
    epoc=epoc,
    pixel="MyCustomReactor(param1='value1');",
    insight_id="my-insight-id"
)

# Access an engine from Python
epoc = str(uuid.uuid4())
result = gsp.callEngine(
    epoc=epoc,
    engine_type="DATABASE",
    engine_id="my_database",
    method_name="query",
    method_args=["SELECT * FROM users"],
    method_arg_types=["java.lang.String"],
    insight_id="my-insight-id"
)`, 'python', 'py/gaas_server_proxy.py — callReactor() line 98, callEngine() line 138')}
                ${C.sequence(
                    ['Python Code', 'gaas_server_proxy', 'TCP Socket', 'Java SocketClient', 'Reactor/Engine'],
                    [
                        { from: 0, to: 1, label: 'callReactor(epoc, pixel="...", insight_id="...")' },
                        { from: 1, to: 2, label: 'PayloadStruct{ operation=REACTOR, epoc, pixel }' },
                        { from: 2, to: 3, label: 'JSON request (response=false)' },
                        { from: 3, to: 4, label: 'Parse & execute Pixel' },
                        { from: 4, to: 3, label: 'NounMetadata result', type: 'response' },
                        { from: 3, to: 2, label: 'PayloadStruct{ response=true, epoc, payload }', type: 'response' },
                        { from: 2, to: 1, label: 'Wake condition variable with epoc', type: 'response' },
                        { from: 1, to: 0, label: 'return result', type: 'response' },
                    ]
                )}
                ${C.callout('This callback mechanism enables Python code to orchestrate complex SEMOSS workflows — run queries, call LLMs, generate insights — all from Python.', 'tip')}
            `
        },
        {
            id: "d2-python-packages",
            title: "Package Management",
            content: `
                <h2>Installing Python Packages</h2>
                <p>SEMOSS uses the system's <code>pip</code> to install packages for the GAAS runtime.</p>
                ${C.code(`# Via Pixel
Py("<encode>import subprocess; subprocess.check_call(['pip', 'install', 'requests'])</encode>");

# Or via Python console in UI
import subprocess
subprocess.check_call(['pip', 'install', 'scikit-learn'])

# Check installed packages
CheckPyPackages();  // Returns list of all installed packages
CheckPyPackages(reload=true);  // Force refresh the package list`, 'pixel', 'Installing packages')}
                <h3>Best Practices</h3>
                ${C.flow([
                    { title: 'requirements.txt', desc: 'List dependencies in app\'s py/ folder' },
                    { title: 'Install on Init', desc: 'Run pip install on app load or first use', arrow: '↓ LoadPyFromFileProjectPy()' },
                    { title: 'Version Pin', desc: 'Specify exact versions (requests==2.28.0)', arrow: '↓ reproducibility' },
                    { title: 'Check First', desc: 'Use CheckPyPackages() before import', accent: true },
                ])}
                ${C.callout('<strong>Warning:</strong> Packages are installed <em>globally</em> for the GAAS process, not per-app. Version conflicts can occur if multiple apps need different package versions.', 'warning')}
            `
        },
        {
            id: "d2-python-console",
            title: "Python Console",
            content: `
                <h2>Python Console Usage</h2>
                <p>SEMOSS provides an interactive Python console in the UI for exploring data and testing code.</p>
                ${C.split(
                    {
                        title: 'Features',
                        content: `
                            <ul>
                                <li>Interactive REPL (like Jupyter)</li>
                                <li>Syntax highlighting</li>
                                <li>Auto-complete</li>
                                <li>Per-insight namespace</li>
                                <li>Output streaming</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Example Session',
                        content: C.code(`>>> import pandas as pd
>>> df = pd.DataFrame({'x': [1,2,3]})
>>> df.describe()
              x
count  3.000000
mean   2.000000
std    1.000000
min    1.000000
max    3.000000`, 'python')
                    }
                )}
                <h3>Console Flow</h3>
                ${C.flow([
                    { title: 'Type Code', desc: 'User enters Python in console UI' },
                    { title: 'Send to GAAS', desc: 'Py() reactor sends code via TCP', arrow: '↓ WebSocket' },
                    { title: 'Execute', desc: 'GAAS runs in insight globals', arrow: '↓ exec()' },
                    { title: 'Stream Output', desc: 'stdout/stderr streamed back', arrow: '↓ STDOUT operation' },
                    { title: 'Display Result', desc: 'Console shows output and result', accent: true },
                ])}
            `
        },
        {
            id: "d2-python-writing-functions",
            title: "Writing Python Functions",
            content: `
                <h2>Writing Python Functions for SEMOSS</h2>
                <p>Apps can include custom Python functions in <code>assets/py/</code> and expose them as MCP tools or Pixel commands.</p>
                ${C.code(`# assets/py/mcp_driver.py
"""
MCP driver for my app.
Functions here become MCP tools.
"""

def process_text(text: str, operation: str) -> dict:
    """
    Process text with various operations.

    Args:
        text: Input text to process
        operation: One of 'upper', 'lower', 'reverse'

    Returns:
        dict with 'result' and 'length' keys
    """
    if operation == 'upper':
        result = text.upper()
    elif operation == 'lower':
        result = text.lower()
    elif operation == 'reverse':
        result = text[::-1]
    else:
        raise ValueError(f"Unknown operation: {operation}")

    return {
        'result': result,
        'length': len(result)
    }

def query_data(engine_id: str, sql: str):
    """
    Query a database engine from Python.

    Uses gaas_server_proxy to call back into Java.
    """
    import gaas_server_proxy as gsp
    import uuid

    epoc = str(uuid.uuid4())
    result = gsp.callEngine(
        epoc=epoc,
        engine_type="DATABASE",
        engine_id=engine_id,
        method_name="query",
        method_args=[sql],
        method_arg_types=["java.lang.String"],
        insight_id=None  # or pass insight_id parameter
    )
    return result`, 'python', 'assets/py/mcp_driver.py')}
            `
        },
        {
            id: "d2-python-handson",
            title: "Hands-on: Python Integration",
            content: `
                <h2>Hands-on: Custom Python Functions</h2>
                ${C.handson('Build a Python MCP Tool', `
                    <h4>Step 1: Create Python Module</h4>
                    <p>In your app's <code>assets/py/</code> folder, create <code>mcp_driver.py</code>:</p>
                    ${C.code(`# assets/py/mcp_driver.py
def calculate_stats(numbers: list) -> dict:
    """Calculate statistics for a list of numbers."""
    import statistics

    return {
        'mean': statistics.mean(numbers),
        'median': statistics.median(numbers),
        'stdev': statistics.stdev(numbers) if len(numbers) > 1 else 0,
        'min': min(numbers),
        'max': max(numbers),
    }

def fetch_data_from_api(url: str) -> dict:
    """Fetch JSON data from an API."""
    import requests
    response = requests.get(url)
    return response.json()`, 'python')}

                    <h4>Step 2: Load the Module in SEMOSS</h4>
                    ${C.code(`// Load the Python file
LoadPyFromFileProjectPy(
    projectId="<your-app-project-id>",
    filePath="mcp_driver.py"
);

// Call a function
result = Py("<encode>calculate_stats([1, 2, 3, 4, 5])</encode>");
Echo(result);`, 'pixel')}

                    <h4>Step 3: Generate MCP Manifest</h4>
                    ${C.code(`// Generate MCP tool definition
MakePythonMCP("<your-app-project-id>");

// Output: assets/mcp/py_mcp.json`, 'pixel')}

                    <h4>Step 4: Use from Python Console</h4>
                    <p>Open the Python console in SEMOSS and run:</p>
                    ${C.code(`>>> import mcp_driver
>>> stats = mcp_driver.calculate_stats([10, 20, 30, 40, 50])
>>> print(stats)
{'mean': 30.0, 'median': 30.0, 'stdev': 15.8..., 'min': 10, 'max': 50}`, 'python')}

                    <h4>Step 5: Call Java from Python</h4>
                    ${C.code(`# Add to mcp_driver.py
import gaas_server_proxy as gsp
import uuid

def query_database(engine_id: str, table: str, insight_id: str = None):
    """Query a database from Python."""
    sql = f"SELECT * FROM {table} LIMIT 10"
    epoc = str(uuid.uuid4())
    result = gsp.callEngine(
        epoc=epoc,
        engine_type="DATABASE",
        engine_id=engine_id,
        method_name="query",
        method_args=[sql],
        method_arg_types=["java.lang.String"],
        insight_id=insight_id
    )
    return result

# In console:
>>> data = mcp_driver.query_database("my_db", "users")
>>> print(len(data))
10`, 'python')}
                `)}
            `
        },
        {
            id: "d2-python-recap",
            title: "Recap",
            content: `
                <h2>Custom Python — Recap</h2>
                ${C.cards([
                    { badge: 'Architecture', title: 'GAAS Runtime', desc: 'Out-of-process Python server via TCP socket (localhost:9999)' },
                    { badge: 'Protocol', title: 'PayloadStruct', desc: 'JSON message schema with epoc correlation IDs' },
                    { badge: 'Isolation', title: 'Per-Insight Globals', desc: 'Each insight gets its own Python namespace' },
                    { badge: 'Java → Python', title: 'PyTranslator', desc: 'Public methods: getString(), getList(), getBoolean(), runEmptyPy()' },
                    { badge: 'Python → Java', title: 'Callbacks', desc: 'gaas_server_proxy for reactor/engine calls' },
                    { badge: 'Packages', title: 'pip install', desc: 'Install packages globally for GAAS process' },
                    { badge: 'Tools', title: 'MCP Functions', desc: 'assets/py/mcp_driver.py → MakePythonMCP()' },
                ])}
                <h3>Next: Day 3</h3>
                <p>Advanced topics — Insights, Rooms, Sessions, Model Logs, and REST API endpoints.</p>
            `
        }
    ]
};
