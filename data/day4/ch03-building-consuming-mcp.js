// Day 4, Chapter 3: Building & Consuming MCP (105 min)
const day4_ch03 = {
    title: "Building & Consuming MCP",
    slides: [
        {
            id: "d4-build-title",
            title: "Building & Consuming MCP",
            content: C.titleSlide(
                "Building & Consuming MCP",
                "Creating Production MCP Tools and Integrating with External Apps",
                "105 minutes"
            )
        },
        {
            id: "d4-build-overview",
            title: "MCP Development Workflow",
            content: `
                <h2>MCP Development Workflow</h2>
                <p class="lead">Building production MCP tools involves a <span class="highlight">development → build → publish → test</span> cycle.</p>
                ${C.flow([
                    { title: '1. Develop Backend', desc: 'Write Python functions or Java reactors', accent: true, arrow: '↓' },
                    { title: '2. Generate MCP JSON', desc: 'Run MakePythonMCP or MakePixelMCP', arrow: '↓' },
                    { title: '3. (Optional) Build Portal UI', desc: 'React client → pnpm run build → portals/', arrow: '↓' },
                    { title: '4. Publish', desc: 'Publish files to public_home', accent: true, arrow: '↓' },
                    { title: '5. Test in Playground', desc: 'Configure MCP server and test tools', arrow: '↓' },
                    { title: '6. Deploy', desc: 'Make available to users or external apps', accent: true },
                ])}
                ${C.callout(`${CONFIG.productName} MCP tools can be consumed in two ways: <strong>internally</strong> via Playground/Rooms, or <strong>externally</strong> via MCP-compatible clients like Claude Code CLI.`, 'info')}
            `
        },
        {
            id: "d4-build-python-advanced",
            title: "Advanced Python MCP Patterns",
            content: `
                <h2>Advanced Python MCP Patterns</h2>
                <p>Beyond simple functions, Python MCPs can implement complex patterns for data processing, async execution, and error handling.</p>
                ${C.code(`from semoss import Insight
import smssutil
import asyncio
import base64
import traceback

@smssutil.mcp_metadata({
    'execution': 'auto',
    'displayLocation': 'inline',
    'loadingMessage': 'Processing data...'
})
def process_dataframe(table_name: str, operation: str = "summary"):
    """
    Processes a database table and returns statistical summary.
    Operations: 'summary', 'describe', 'head', 'tail'
    """
    insight = Insight()

    # Query database
    pixel = f"""
    Database(database="{insight.insight_id}_DATABASE") |
    Query("SELECT * FROM {table_name}") |
    Collect(500);
    """

    try:
        result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
        df = result[0].get("output")

        if operation == "summary":
            return f"Table '{table_name}': {len(df)} rows, {len(df.columns)} columns"
        elif operation == "describe":
            return df.describe().to_string()
        elif operation == "head":
            return df.head(10).to_string()
        elif operation == "tail":
            return df.tail(10).to_string()
        else:
            return f"Unknown operation: {operation}"

    except Exception as e:
        return f"Error processing table: {str(e)}\\n{traceback.format_exc()}"


@smssutil.mcp_metadata({
    'execution': 'ask',  # Require confirmation for write operations
    'loadingMessage': 'Uploading to vector database...'
})
def upload_to_vector_db(file_path: str, vector_engine_name: str):
    """
    Uploads a file to a vector database for semantic search.
    Requires user confirmation before execution.
    """
    insight = Insight()

    pixel = f"""
    VectorDatabaseUpload(
        engine="{vector_engine_name}",
        filePath="{file_path}"
    );
    """

    try:
        result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
        return f"Successfully uploaded '{file_path}' to vector database '{vector_engine_name}'"
    except Exception as e:
        return f"Upload failed: {str(e)}"`, 'python', 'py/mcp_driver.py - Advanced patterns')}
                ${C.callout('Use <code>execution: \'ask\'</code> for destructive operations (writes, deletes, uploads) to prevent accidental data modification.', 'warning')}
            `
        },
        {
            id: "d4-build-java-mcp",
            title: "Java/Pixel MCP Pattern",
            content: `
                <h2>Building Java/Pixel MCP Tools</h2>
                <p>Java reactors provide ${CONFIG.productName}-native MCP tools with full access to engines, insights, and the reactor ecosystem.</p>
                ${C.code(`package reactors.examples;

import prerna.reactor.AbstractReactor;
import prerna.sablecc2.om.PixelDataType;
import prerna.sablecc2.om.ReactorKeysEnum;
import prerna.sablecc2.om.nounmeta.NounMetadata;
import prerna.util.Utility;

public class GetProjectFilesReactor extends AbstractReactor {

    public GetProjectFilesReactor() {
        this.keysToGet = new String[] {
            ReactorKeysEnum.PROJECT.getKey(),
            ReactorKeysEnum.FILE_PATH.getKey()
        };
        this.keyRequired = new int[] { 1, 0 };  // PROJECT required
    }

    @Override
    public NounMetadata execute() {
        organizeKeys();

        String projectId = this.keyValue.get(this.keysToGet[0]);
        String subPath = this.keyValue.get(this.keysToGet[1]);

        if (subPath == null) {
            subPath = "";
        }

        // Get project asset folder
        String projectFolder = Utility.getProjectAssetFolder(projectId);
        String fullPath = projectFolder + "/" + subPath;

        // List files in the directory
        File dir = new File(fullPath);
        if (!dir.exists() || !dir.isDirectory()) {
            return new NounMetadata(
                "Error: Path does not exist or is not a directory",
                PixelDataType.CONST_STRING
            );
        }

        File[] files = dir.listFiles();
        List<Map<String, String>> fileList = new ArrayList<>();

        for (File file : files) {
            Map<String, String> fileInfo = new HashMap<>();
            fileInfo.put("name", file.getName());
            fileInfo.put("type", file.isDirectory() ? "directory" : "file");
            fileInfo.put("size", String.valueOf(file.length()));
            fileList.add(fileInfo);
        }

        return new NounMetadata(fileList, PixelDataType.VECTOR);
    }

    @Override
    public String getReactorDescription() {
        return "Lists files and directories in a project's asset folder. "
            + "Optionally specify a subpath to list a specific directory.";
    }
}`, 'java', 'java/src/reactors/examples/GetProjectFilesReactor.java')}
                ${C.code(`// Generate pixel_mcp.json from the reactor
MakePixelMCP(
    project="your-project-id",
    reactorNames=["GetProjectFilesReactor"]
);

// Test the tool via Pixel
GetProjectFiles(
    project="your-project-id",
    filePath="py"  // List files in py/ folder
);`, 'pixel', 'Generating and testing Pixel MCP')}
            `
        },
        {
            id: "d4-build-engine-mcp",
            title: "Engine MCP Pattern",
            content: `
                <h2>Exposing Engines as MCP Tools</h2>
                <p>Existing ${CONFIG.productName} engines (Database, Vector, Storage, Function) can be exposed as MCP tools with a single command.</p>
                ${C.table(
                    ["Engine Type", "Generated MCP Tools", "Use Case"],
                    [
                        [
                            "Database",
                            "<code>DatabaseQuery</code><br><code>DatabaseExecute</code>",
                            "Allow models to query SQL databases"
                        ],
                        [
                            "Vector",
                            "<code>VectorDatabaseUpload</code><br><code>VectorDatabaseQuery</code>",
                            "Semantic search over documents"
                        ],
                        [
                            "Storage",
                            "<code>StorageUpload</code><br><code>StorageDownload</code>",
                            "File upload/download from cloud storage"
                        ],
                        [
                            "Function",
                            "<code>ExecuteFunction</code>",
                            "Call serverless functions or APIs"
                        ]
                    ]
                )}
                ${C.code(`// Expose a vector database as MCP
MakeEngineMCP(engine="my-vector-db-name");

// This generates MCP tools:
// - VectorDatabaseUpload(engine, filePath)
// - VectorDatabaseQuery(engine, query, limit)

// Models can now call these tools in Playground:
// User: "Upload the file /data/docs/manual.pdf to my-vector-db"
// Model calls: VectorDatabaseUpload(engine="my-vector-db-name", filePath="/data/docs/manual.pdf")

// User: "Search for information about authentication"
// Model calls: VectorDatabaseQuery(engine="my-vector-db-name", query="authentication", limit=5)`, 'pixel', 'Exposing vector database as MCP')}
                ${C.callout('Engine MCP is the fastest way to add data access capabilities to Playground without writing custom code.', 'tip')}
            `
        },
        {
            id: "d4-build-portal-ui",
            title: "Building Custom Portal UIs",
            content: `
                <h2>MCP with Custom Portal UI</h2>
                <p>For tools that need rich interactions (forms, editors, visualizations), add a React portal UI.</p>
                ${C.flow([
                    { title: 'Create client/', desc: 'React + Vite + Tailwind', accent: true, arrow: '↓' },
                    { title: 'Map routes', desc: 'routes.constants.tsx: MCP tool → React component', arrow: '↓' },
                    { title: 'Build UI', desc: 'components/mcp/YourTool.tsx', arrow: '↓' },
                    { title: 'Link MCP tool', desc: 'resourceURI: "/" in @mcp_metadata or pixel_mcp.json', accent: true, arrow: '↓' },
                    { title: 'Build portals/', desc: 'pnpm run build → portals/', arrow: '↓' },
                    { title: 'Publish', desc: `${CONFIG.productName} publishes portals/ to public_home`, accent: true },
                ])}
                ${C.split(
                    {
                        title: 'Python decorator with resourceURI',
                        content: C.code(`@smssutil.mcp_metadata({
    'execution': 'ask',
    'displayLocation': 'sidebar',
    'resourceURI': '/'  # Opens portal at root path
})
def show_code_editor():
    """
    Opens a code editor portal UI for writing Python scripts.
    """
    return "Portal UI opened"`, 'python')
                    },
                    {
                        title: 'React component',
                        content: C.code(`// client/src/components/mcp/CodeEditor.tsx
import { useAppContext } from '@semoss/sdk';

export function CodeEditor() {
  const { actions } = useAppContext();
  const [code, setCode] = useState('');

  const handleRun = async () => {
    const encoded = btoa(code);
    const result = await actions.runMCPTool(
      'execute_python_code',
      { code_b64: encoded }
    );
    // Send result to Playground
    await actions.sendMCPResponseToPlayground(result);
  };

  return (
    <div>
      <textarea value={code} onChange={e => setCode(e.target.value)} />
      <button onClick={handleRun}>Run Code</button>
    </div>
  );
}`, 'typescript')
                    }
                )}
            `
        },
        {
            id: "d4-consume-playground",
            title: "Consuming MCP in Playground",
            content: `
                <h2>Consuming MCP in SEMOSS Playground</h2>
                <p>Once an MCP is published, configure it in Playground to make tools available to the model.</p>
                ${C.sequence(
                    ["User", "Playground UI", "MCP App", "Model"],
                    [
                        { from: 0, to: 1, label: "Configure MCP server" },
                        { from: 1, to: 2, label: "Load mcp/*.json schemas" },
                        { from: 2, to: 1, label: "Tool definitions", type: "response" },
                        { from: 1, to: 3, label: "System prompt + tools" },
                        { from: 0, to: 3, label: "User question" },
                        { from: 3, to: 1, label: "Tool call (execute_python_code)" },
                        { from: 1, to: 2, label: "RunMCPTool(name, params)" },
                        { from: 2, to: 1, label: "Tool result", type: "response" },
                        { from: 1, to: 3, label: "Tool result" },
                        { from: 3, to: 1, label: "Model response with result", type: "response" },
                        { from: 1, to: 0, label: "Display answer", type: "response" },
                    ]
                )}
                ${C.code(`// Playground configuration (in UI)
1. Open Playground settings
2. Navigate to "MCP Servers" section
3. Click "Add MCP Server"
4. Select your app/project
5. Playground auto-loads mcp/py_mcp.json and mcp/pixel_mcp.json
6. Tools appear in Playground sidebar and model's tool list

// The model can now call your tools:
User: "Run this Python code: print('Hello from MCP')"

Model sees tools:
- execute_python_code(code_b64: string)
- say_hello(name: string)
- count_to_n(n: number)

Model calls: execute_python_code(code_b64="cHJpbnQoJ0hlbGxvIGZyb20gTUNQJyk=")
SEMOSS executes: py/mcp_driver.py execute_python_code() function
Result: "Hello from MCP"
Model incorporates result into response`, 'plaintext', 'Playground MCP workflow')}
            `
        },
        {
            id: "d4-consume-external",
            title: "Consuming MCP from External Apps",
            content: `
                <h2>Consuming SEMOSS MCP from External Applications</h2>
                <p>SEMOSS MCP servers can be consumed by MCP-compatible clients like Claude Code CLI, LangChain, or custom applications.</p>
                ${C.code(`// Example: Connect Claude Code CLI to SEMOSS MCP

// 1. SEMOSS side: Publish your MCP app
MakePythonMCP(project="your-project-id");
// Publish files to make MCP accessible

// 2. Get MCP endpoint URL (typically):
// http://localhost:8080/api/mcp/<projectId>

// 3. Configure Claude Code CLI (~/.config/claude/config.json):
{
  "mcpServers": {
    "semoss-tools": {
      "url": "http://localhost:8080/api/mcp/your-project-id",
      "headers": {
        "Authorization": "Bearer <your-semoss-api-key>"
      }
    }
  }
}

// 4. Claude Code CLI now has access to your SEMOSS MCP tools
// The model can call execute_python_code, database queries, etc.`, 'json', 'External MCP configuration')}
                ${C.callout('External MCP consumption requires <strong>authentication</strong>. Use SEMOSS API keys or OAuth tokens in the Authorization header.', 'warning')}
                ${C.code(`// Example: Using SEMOSS MCP from Python with LangChain
from langchain.agents import initialize_agent
from langchain.tools import Tool
from langchain_anthropic import ChatAnthropic
import requests

def call_semoss_mcp_tool(tool_name: str, params: dict):
    """Call a SEMOSS MCP tool via REST API"""
    response = requests.post(
        f"http://localhost:8080/api/mcp/your-project-id/tools/{tool_name}",
        json=params,
        headers={"Authorization": "Bearer <api-key>"}
    )
    return response.json()

# Define LangChain tool that wraps SEMOSS MCP
execute_code_tool = Tool(
    name="execute_python_code",
    func=lambda code: call_semoss_mcp_tool("execute_python_code", {"code_b64": code}),
    description="Executes Python code and returns the result"
)

# Create agent with SEMOSS tool
llm = ChatAnthropic(model="claude-sonnet-4-5")
agent = initialize_agent([execute_code_tool], llm, agent="zero-shot-react-description")

# Use the agent
result = agent.run("Calculate the factorial of 5 using Python")
print(result)`, 'python', 'LangChain integration with SEMOSS MCP')}
            `
        },
        {
            id: "d4-consume-authentication",
            title: "MCP Authentication & Security",
            content: `
                <h2>MCP Authentication & Security</h2>
                <p>Securing MCP endpoints is critical when exposing tools to external applications.</p>
                ${C.cards([
                    { badge: 'Security', title: 'API Keys', desc: 'Generate SEMOSS API keys for service-to-service authentication' },
                    { badge: 'Security', title: 'OAuth Tokens', desc: 'Use OAuth 2.0 for user-based authentication' },
                    { badge: 'Security', title: 'Tool Permissions', desc: 'execution: ask prevents auto-execution of destructive tools' },
                    { badge: 'Security', title: 'Rate Limiting', desc: 'Configure rate limits on MCP endpoints to prevent abuse' },
                ])}
                ${C.code(`// Secure MCP endpoint access patterns

// 1. API Key authentication (service accounts)
POST /api/mcp/<projectId>/tools/execute_python_code
Headers:
  Authorization: Bearer sk-semoss-<api-key>
Body:
  { "code_b64": "cHJpbnQoJ0hlbGxvJyk=" }

// 2. OAuth 2.0 authentication (user sessions)
POST /api/mcp/<projectId>/tools/upload_to_vector_db
Headers:
  Authorization: Bearer <oauth-access-token>
Body:
  { "file_path": "/data/doc.pdf", "vector_engine_name": "my-vector-db" }

// 3. Tool-level security (execution modes)
@mcp_metadata({
    'execution': 'disabled'  # Tool hidden from model, only callable via direct API
})
def admin_delete_all_data():
    """DANGER: Deletes all data. Admin only."""
    # ...

@mcp_metadata({
    'execution': 'ask'  # Requires user confirmation
})
def send_email(to: str, subject: str, body: str):
    """Sends an email. Requires user approval."""
    # ...`, 'python', 'MCP security patterns')}
                ${C.callout('Always use <code>execution: \'ask\'</code> or <code>execution: \'disabled\'</code> for tools that modify data, send emails, or perform privileged operations.', 'danger')}
            `
        },
        {
            id: "d4-build-handson",
            title: "Hands-on: Build Complete MCP App",
            content: `
                <h2>Hands-on: Build a Database Query MCP</h2>
                ${C.handson('Create an MCP that lets models query databases', `
                    <h4>Part 1: Set Up App Structure</h4>
                    <ol>
                        <li>Create new app in SEMOSS: "Database Query MCP"</li>
                        <li>Navigate to <code>project/Database_Query_MCP__&lt;uuid&gt;/app_root/version/assets/</code></li>
                        <li>Create <code>py/mcp_driver.py</code></li>
                    </ol>

                    <h4>Part 2: Write Python MCP Tools</h4>
                    ${C.code(`from semoss import Insight
import smssutil
import json

@smssutil.mcp_metadata({
    'execution': 'auto',
    'displayLocation': 'inline'
})
def list_database_tables(database_id: str):
    """
    Lists all tables in a database engine.
    Returns table names as JSON array.
    """
    insight = Insight()
    pixel = f"""
    Database(database="{database_id}") |
    QueryAll("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='PUBLIC'") |
    Collect(100);
    """
    result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
    df = result[0].get("output")
    return json.dumps(df['TABLE_NAME'].tolist())


@smssutil.mcp_metadata({
    'execution': 'auto',
    'loadingMessage': 'Querying database...'
})
def query_database(database_id: str, query: str, limit: int = 10):
    """
    Executes a SELECT query on a database and returns results.
    Automatically appends LIMIT if not present.
    """
    insight = Insight()

    # Safety: ensure it's a SELECT query
    if not query.strip().upper().startswith("SELECT"):
        return "Error: Only SELECT queries are allowed"

    # Add LIMIT if not present
    if "LIMIT" not in query.upper():
        query = f"{query} LIMIT {limit}"

    pixel = f"""
    Database(database="{database_id}") |
    Query("{query}") |
    Collect({limit});
    """

    try:
        result = insight.run_pixel(pixel=pixel, insight_id=insight.insight_id)
        df = result[0].get("output")
        return df.to_json(orient='records', indent=2)
    except Exception as e:
        return f"Query error: {str(e)}"`, 'python')}

                    <h4>Part 3: Generate MCP JSON</h4>
                    ${C.code(`MakePythonMCP(project="<your-database-query-mcp-project-id>");`, 'pixel')}
                    <p>Verify <code>mcp/py_mcp.json</code> was created with 2 tools.</p>

                    <h4>Part 4: Test in Playground</h4>
                    <ol>
                        <li>Open Playground settings → Add MCP Server → Select "Database Query MCP"</li>
                        <li>Ask: <em>"List all tables in database bd1dea64-ec6b-49af-9308-94b05551c83d"</em></li>
                        <li>Model calls <code>list_database_tables()</code> and shows table names</li>
                        <li>Ask: <em>"Query the EMPLOYEES table and show me the first 5 rows"</em></li>
                        <li>Model calls <code>query_database(query="SELECT * FROM EMPLOYEES", limit=5)</code></li>
                    </ol>

                    <h4>Part 5: (Optional) Expose as Engine MCP</h4>
                    ${C.code(`// Alternative: Use MakeEngineMCP for simpler database exposure
MakeEngineMCP(engine="bd1dea64-ec6b-49af-9308-94b05551c83d");

// This auto-generates DatabaseQuery and DatabaseExecute tools`, 'pixel')}

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Part 2: Two Python functions with proper decorators</li>
                        <li>Part 3: <code>mcp/py_mcp.json</code> with 2 tools</li>
                        <li>Part 4: Model successfully queries database via MCP</li>
                        <li>Part 5: Engine MCP approach also works</li>
                    </ul>
                `)}
            `
        },
        {
            id: "d4-build-summary",
            title: "Summary",
            content: `
                <h2>Summary: Building & Consuming MCP</h2>
                <h3>Building MCP Tools</h3>
                <ul>
                    <li><strong>Python MCP</strong>: Functions in <code>py/mcp_driver.py</code> with <code>@mcp_metadata</code> decorators</li>
                    <li><strong>Java/Pixel MCP</strong>: Custom reactors with <code>MakePixelMCP()</code></li>
                    <li><strong>Engine MCP</strong>: Expose existing engines with <code>MakeEngineMCP()</code></li>
                    <li><strong>Portal UI</strong>: React client with <code>resourceURI: '/'</code> for rich interactions</li>
                </ul>
                <h3>Consuming MCP</h3>
                <ul>
                    <li><strong>Internal</strong>: Playground → MCP Servers → Add your app → Tools available to model</li>
                    <li><strong>External</strong>: Claude Code CLI, LangChain, custom apps via <code>/api/mcp/&lt;projectId&gt;</code></li>
                    <li><strong>Security</strong>:
                        <ul>
                            <li>API keys for service accounts</li>
                            <li>OAuth for user sessions</li>
                            <li><code>execution: 'ask'</code> for destructive operations</li>
                        </ul>
                    </li>
                </ul>
                ${C.callout('Next chapter: MCP UI customization, displayLocation options, and pre-made MCP examples (Room Shell, Vector PDF).', 'tip')}
            `
        }
    ]
};
