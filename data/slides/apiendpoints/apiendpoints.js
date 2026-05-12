// Topic: API Endpoints  -  Consuming ELSA from Existing Workflows
const slides_api_endpoints = [
    {
        id: "api-title",
        title: "Consuming ELSA from Your Existing Workflows",
        content: C.titleSlide(
            `Consuming ${CONFIG.productName} from Your Existing Workflows`,
            `If it speaks OpenAI, it can speak ${CONFIG.productName}`,
            "30 minutes"
        )
    },
    {
        id: "api-big-idea",
        title: "The Big Idea",
        content: `
            <h2>You Already Did This</h2>
            ${C.callout('You already did this. When you configured settings.json yesterday to point Claude Code at ${CONFIG.productName}  -  that was exactly this pattern. Claude Code uses the OpenAI SDK; you pointed it at ${CONFIG.productName}\'s OpenAI-compatible endpoint.', 'tip')}
            ${C.flow([
                { title: 'Your Tool or Script', desc: 'Claude Code, a Python script, a CI job, anything that uses the OpenAI format' },
                { title: 'OpenAI SDK', desc: 'The same library you\'d use to call OpenAI', arrow: '↓' },
                { title: '${CONFIG.productName} OpenAI-Compatible Endpoint', desc: 'Accepts requests in standard OpenAI format', arrow: '↓' },
                { title: '${CONFIG.productName} Model Engine', desc: 'Routes to whichever model is configured  -  GPT-4, Claude, a local model, anything', arrow: '↓' },
                { title: 'Response Back', desc: 'Formatted exactly as OpenAI would return it' }
            ])}
            <p>Any tool that uses the OpenAI API format can be redirected to use ${CONFIG.productName}'s models instead  -  no code changes required except the base URL and key.</p>
        `
    },
    {
        id: "api-consumption-patterns",
        title: "Three Ways to Consume",
        content: `
            <h2>Three Consumption Patterns</h2>
            ${C.table(
                ['Pattern', 'When to Use', 'What You Need'],
                [
                    [
                        '<strong>OpenAI-compatible endpoint</strong>',
                        'Existing tools or scripts, Claude Code, any OpenAI SDK client',
                        'Base URL + <code>access:secret</code> key'
                    ],
                    [
                        '<strong>PyPI SDK (<code>ai-server-sdk</code>)</strong>',
                        'Python scripts that need full ${CONFIG.productName} access  -  engines, Pixel, streaming',
                        '<code>pip install ai-server-sdk</code>'
                    ],
                    [
                        '<strong>LLM Pixel reactor (<code>AskModelEngine</code>)</strong>',
                        'Inside ${CONFIG.productName} Notebooks and apps  -  you\'re already authenticated',
                        'Engine ID only'
                    ]
                ]
            )}
            ${C.callout('Start with the OpenAI-compatible endpoint. It works with the widest range of tools and requires the least code.', 'tip')}
        `
    },
    {
        id: "api-openai-example",
        title: "OpenAI-Compatible  -  Live Example",
        content: `
            <h2>OpenAI-Compatible Endpoint  -  Live Example</h2>
            ${C.handson('Live Example: Call ${CONFIG.productName} from Python', `
                <p>This is the same code you'd write to call OpenAI. The only differences are <code>base_url</code> and <code>api_key</code>.</p>
                ${C.code(`from openai import OpenAI

client = OpenAI(
    api_key="<your-access-key>:<your-secret-key>",
    base_url="${CONFIG.openaiEndpoint}"
)

response = client.chat.completions.create(
    model="${CONFIG.sharedModelEngineId}",
    messages=[
        {"role": "user", "content": "Summarize the key points of FDA 21 CFR Part 11"}
    ]
)
print(response.choices[0].message.content)`, 'python', 'Call ${CONFIG.productName} with the OpenAI SDK')}
                <p>That's it. No special library. No ${CONFIG.productName}-specific code.</p>
            `)}
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
            ${C.callout('This ${CONFIG.productName} environment has usage limits configured by your FDA admin: [presenter will share specific limits]. Respect these limits  -  shared infrastructure serves the whole team.', 'warning')}
            <h3>What Counts Against Limits</h3>
            ${C.table(
                ['What', 'Counts As'],
                [
                    ['Each API call to a model engine', 'Token usage (input + output)'],
                    ['Streaming responses', 'Same as non-streaming  -  full token count'],
                    ['Calls from external scripts via OpenAI SDK', 'Attributed to your access key / user'],
                    ['Calls from inside ${CONFIG.productName} apps and notebooks', 'Attributed to the logged-in user']
                ]
            )}
            ${C.callout('If you\'re running batch jobs or stress-testing, coordinate with your admin first. One runaway script can exhaust the shared quota.', 'info')}
        `
    }
];
