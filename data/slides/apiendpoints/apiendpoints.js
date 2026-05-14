// Topic: API Endpoints  -  Consuming ELSA from Existing Workflows
const slides_api_endpoints = [
    {
        id: "api-title",
        title: "Consuming ELSA from Your Existing Workflows",
        content: C.titleSlide(
            `External API Calls`,
            `REST API · OpenAI SDK · Python SDK`,
            "30 minutes"
        )
    },
    {
        id: "api-curl-postman",
        title: "REST API",
        content: `
            <h2>REST API  —  The Simplest Possible Test</h2>
            <p>Before writing any code, confirm the endpoint is reachable and your key works. Any HTTP client will do — CURL, Postman, Insomnia, or a browser extension.</p>
            ${C.code(`curl ${CONFIG.openaiEndpoint}/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <access-key>:<secret-key>" \\
  -d '{
    "model": "${CONFIG.sharedModelEngineId}",
    "messages": [
      { "role": "user", "content": "Tell me about the FDA CDER office and its role." }
    ]
  }'`, 'bash', 'CURL  —  OpenAI-compatible endpoint')}
            ${C.split(
                {
                    title: 'What to check in the response',
                    content: `
                        <ul>
                            <li><code>choices[0].message.content</code>  —  the model's reply</li>
                            <li><code>model</code>  —  confirms which engine responded</li>
                            <li><code>usage.total_tokens</code>  —  input + output token count</li>
                        </ul>
                        <p class="muted">A <code>401</code> means bad key. A <code>404</code> means bad URL or engine ID.</p>
                    `
                },
                {
                    title: 'Postman',
                    content: `
                        <p>Postman is the same request with a GUI. Set:</p>
                        <ul>
                            <li><strong>Method:</strong> <code>POST</code></li>
                            <li><strong>URL:</strong> <code>${CONFIG.openaiEndpoint}/chat/completions</code></li>
                            <li><strong>Auth:</strong> Bearer token → <code>access-key:secret-key</code></li>
                            <li><strong>Body:</strong> JSON with <code>model</code> and <code>messages</code></li>
                        </ul>
                        <p class="muted">Useful for sharing test cases with teammates who don't use the CLI.</p>
                    `
                }
            )}
        `
    },

    {
        id: "api-consumption-patterns",
        title: "Three Ways to Call ELSA Externally",
        content: `
            <h2>Three Ways to Call ${CONFIG.productName} from Outside the Platform</h2>
            ${C.table(
                ['Method', 'When to Use', 'What You Need'],
                [
                    [
                        '<strong>REST API</strong>',
                        'Verify connectivity, one-off tests, share requests with teammates (CURL, Postman, Insomnia, etc.)',
                        '<code>access:secret</code> key + any HTTP client'
                    ],
                    [
                        '<strong>OpenAI SDK (Python / JS)</strong>',
                        'Scripts, CI jobs, or any existing tool already using the OpenAI client',
                        '<code>pip install openai</code> — swap <code>base_url</code> and <code>api_key</code>, nothing else changes'
                    ],
                    [
                        '<strong>PyPI SDK (<code>ai-server-sdk</code>)</strong>',
                        `Python scripts that need more than chat  —  run Pixel, query engines, manage insights`,
                        '<code>pip install ai-server-sdk</code> + base URL + access/secret keys'
                    ]
                ]
            )}
            ${C.handson('Follow Along — Install Required Packages', `
                <p>Before the next slides, install both client libraries in your Python environment:</p>
                ${C.code(`pip install openai ai-server-sdk`, 'bash', 'Install packages')}
            `)}
            ${C.callout('All three use the same credentials: <code>access-key:secret-key</code> in the Authorization header. Generate them in ${CONFIG.productName} → Settings → My Profile → Personal Access Tokens.', 'info')}
        `
    },
    {
        id: "api-openai-example",
        title: "OpenAI-Compatible  -  Live Example",
        content: `
            <h2>OpenAI-Compatible Endpoint  -  Live Example</h2>
            ${C.handson(`Live Example: Call ${CONFIG.productName} from Python`, `
                <p>This is the same code you'd write to call OpenAI. The only differences are <code>base_url</code> and <code>api_key</code>.</p>
                ${C.code(`from openai import OpenAI
import httpx

client = OpenAI(
    api_key="<your-access-key>:<your-secret-key>",
    base_url="${CONFIG.openaiEndpoint}",
    http_client=httpx.Client(verify=False)  # bypass self-signed cert
)

response = client.chat.completions.create(
    model="${CONFIG.sharedModelEngineId}",
    messages=[
        {"role": "user", "content": "Tell me about the FDA CDER office and its role."}
    ]
)
print(response.choices[0].message.content)`, 'python', `Call ${CONFIG.productName} with the OpenAI SDK`)}
                <p>That's it. No special library. No ${CONFIG.productName}-specific code.</p>
            `)}
            ${C.callout('On corporate networks, internal servers often use TLS certificates signed by a private CA that your machine does not trust by default. When the OpenAI SDK cannot verify the certificate chain, it throws an SSL error and refuses to connect — even if the server is reachable. Passing <code>http_client=httpx.Client(verify=False)</code> bypasses this check. The alternative is to install your organization\'s root CA certificate into your system trust store, but <code>verify=False</code> is the quickest workaround during hands-on exercises. Do not use it in production code.', 'warning')}
            ${C.callout('Same code you\'d write for OpenAI. Just swap the base_url and api_key.', 'info')}
        `
    },
    {
        id: "api-pypi-sdk",
        title: "PyPI SDK (ai-server-sdk)",
        content: `
            <h2>PyPI SDK  -  When You Need More Than Chat</h2>
            <p>The <code>ai-server-sdk</code> gives you full access to ${CONFIG.productName} from Python  -  not just chat completions, but Pixel expressions, engine management, and streaming.</p>
            ${C.code(`from ai_server import ServerClient

client = ServerClient(
    base="${CONFIG.elsaUrl}",
    access_key="<your-access-key>",
    secret_key="<your-secret-key>"
)

# Run any Pixel expression
result = client.run_pixel('AskModelEngine(engine=["${CONFIG.sharedModelEngineId}"], command=["Hello"]);')`, 'python', 'ai-server-sdk basic connection')}
            ${C.callout('Use the PyPI SDK when you need more than just chat  -  running Pixel, querying engines, managing insights programmatically.', 'tip')}
        `
    },
    {
        id: "api-token-limits",
        title: "Token and Usage Limits",
        content: `
            <h2>Usage Limits  -  Shared Infrastructure</h2>
            <p>This ${CONFIG.productName} environment serves the whole FDA team. Usage limits are configured by your admin to keep the platform available for everyone.</p>
            ${C.callout(`This ${CONFIG.productName} environment has usage limits configured by your FDA admin: [presenter will share specific limits]. Respect these limits  -  shared infrastructure serves the whole team.`, 'warning')}
            <h3>What Counts Against Limits</h3>
            ${C.table(
                ['What', 'Counts As'],
                [
                    ['Each API call to a model engine', 'Token usage (input + output)'],
                    ['Streaming responses', 'Same as non-streaming  -  full token count'],
                    ['Calls from external scripts via OpenAI SDK', 'Attributed to your access key / user'],
                    [`Calls from inside ${CONFIG.productName} apps and notebooks`, 'Attributed to the logged-in user']
                ]
            )}
            ${C.callout('If you\'re running batch jobs or stress-testing, coordinate with your admin first. One runaway script can exhaust the shared quota.', 'info')}
        `
    }
];
