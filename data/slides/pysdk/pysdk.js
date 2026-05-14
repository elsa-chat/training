// Topic: Python SDK (ai-server-sdk)
const slides_python_sdk = [
        {
            id: "sdk-title",
            title: "Python SDK  -  ai-server-sdk",
            content: C.titleSlide(
                "Python SDK  -  ai-server-sdk",
                `Interacting with ${CONFIG.productName} programmatically from Python`,
                "60 minutes"
            )
        },
        {
            id: "sdk-overview",
            title: "ai-server-sdk Overview",
            content: `
                <h2>ai-server-sdk Overview</h2>
                <p class="lead">The <code>ai-server-sdk</code> package on PyPI provides a Python client for connecting to a ${CONFIG.productName} instance, managing sessions, and interacting with all engine types programmatically.</p>
                ${C.code(`pip install ai-server-sdk`, 'bash', 'Install from PyPI')}
                <h3>Core Components</h3>
                ${C.table(
                    ['Class', 'Import', 'Purpose'],
                    [
                        ['<code>ServerClient</code>', '<code>from ai_server import ServerClient</code>', `Establishes an authenticated connection to a ${CONFIG.productName} instance. Manages insights, runs Pixel commands, and provides OpenAI-compatible endpoints.`],
                        ['<code>ModelEngine</code>', '<code>from ai_server import ModelEngine</code>', 'Send prompts to LLMs with <code>.ask()</code>. Supports context, temperature, max tokens, and other generation parameters.'],
                        ['<code>VectorEngine</code>', '<code>from ai_server import VectorEngine</code>', 'Add/remove documents, list uploads, and perform nearest neighbor similarity searches against vector stores.'],
                        ['<code>DatabaseEngine</code>', '<code>from ai_server import DatabaseEngine</code>', `Execute SQL queries, insert data, and delete records from ${CONFIG.productName} database engines.`],
                        ['<code>FunctionEngine</code>', '<code>from ai_server import FunctionEngine</code>', `Execute pre-defined ${CONFIG.productName} function engines with custom parameter dictionaries.`],
                        ['<code>StorageEngine</code>', '<code>from ai_server import StorageEngine</code>', 'List files and file details from cloud storage engines (S3, Azure Blob, etc.).'],
                    ]
                )}
                <h3>Connection & Authentication</h3>
                ${C.code(`from ai_server import ServerClient
from dotenv import load_dotenv
import os

load_dotenv('.env')
server_connection = ServerClient(
    base=os.getenv('DEV_URL'),
    access_key=os.getenv('DEV_ACCESS_KEY'),
    secret_key=os.getenv('DEV_SECRET_KEY')
)

# Every connection starts with an active insight
print(server_connection.cur_insight)

# Run Pixel commands directly
result = server_connection.run_pixel('1+1')`, 'python', `Connecting to a ${CONFIG.productName} instance`)}
                <h3>OpenAI-Compatible Endpoint</h3>
                <p>The SDK also exposes an OpenAI-compatible endpoint, so you can use the standard <code>openai</code> Python package to interact with any model registered in ${CONFIG.productName}.</p>
                ${C.code(`from openai import OpenAI
import httpx

http_client = httpx.Client()
http_client.cookies = server_connection.cookies

client = OpenAI(
    api_key="EMPTY",
    base_url=server_connection.get_openai_endpoint(),
    default_headers=server_connection.get_auth_headers(),
    http_client=http_client
)

response = client.chat.completions.create(
    model="<engine-id>",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"},
    ],
    extra_body={"insight_id": server_connection.cur_insight}
)`, 'python', `Using the OpenAI SDK against ${CONFIG.productName}`)}
                ${C.callout('<strong>Notebook walkthrough:</strong> We will now step through the SDK notebook live, covering each engine type with hands-on examples.', 'tip')}
            `
        },
    ];
