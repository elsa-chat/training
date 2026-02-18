// Day 3, Chapter 3: Model Logs (90 min)
const day3_ch03 = {
    title: "Model Logs",
    slides: [
        {
            id: "d3-model-logs-title",
            title: "Model Logs",
            content: C.titleSlide(
                "Model Logs",
                `Tracking, analyzing, and troubleshooting LLM usage in ${CONFIG.productName}`,
                "90 minutes"
            )
        },
        {
            id: "d3-model-logs-overview",
            title: "What are Model Logs?",
            content: `
                <h2>What are Model Logs?</h2>
                <p class="lead">${CONFIG.productName} maintains a comprehensive <span class="highlight">Model Inference Logs Database</span> that captures every LLM interaction for analytics, compliance, and troubleshooting.</p>
                <p>Every time a user interacts with an LLM in ${CONFIG.productName} — whether through chat, Pixel commands, or API calls — the system logs detailed information about the interaction.</p>
                ${C.cards([
                    { badge: 'Why Log?', title: 'Cost Tracking', desc: 'Monitor token usage and API costs per user, project, and model' },
                    { badge: 'Why Log?', title: 'Troubleshooting', desc: 'Debug failed requests, track response times, identify bottlenecks' },
                    { badge: 'Why Log?', title: 'Analytics', desc: 'Understand usage patterns, popular models, user behavior' },
                    { badge: 'Why Log?', title: 'Compliance', desc: 'Audit trail for governance, data privacy, and regulatory requirements' },
                ])}
                ${C.callout('The logs database is <code>MODEL_INFERENCE_LOGS_DB</code> — a dedicated H2/PostgreSQL database separate from your app data.', 'info')}
            `
        },
        {
            id: "d3-model-logs-architecture",
            title: "Logging Architecture",
            content: `
                <h2>Model Logs Architecture</h2>
                <p>The model logging system captures interactions across the entire LLM request/response lifecycle.</p>
                ${C.layers([
                    {
                        label: 'User Layer',
                        items: [
                            { title: 'Chat UI', desc: 'User types message' },
                            { title: 'Notebook', desc: 'LLM() reactor call' },
                            { title: 'REST API', desc: 'POST /api/engine/runPixel' },
                        ]
                    },
                    {
                        label: 'Application Layer',
                        accent: true,
                        items: [
                            { title: 'Model Engine', desc: 'AbstractModelEngine', accent: true },
                            { title: 'Logging Utils', desc: 'ModelInferenceLogsUtils', accent: true },
                        ]
                    },
                    {
                        label: 'Storage Layer',
                        items: [
                            { title: 'Logs Database', desc: 'MODEL_INFERENCE_LOGS_DB', accent: true },
                            { title: 'Tables', desc: 'MESSAGE, ROOM, AGENT, FEEDBACK' },
                        ]
                    },
                ])}
                <h3>Log Capture Points</h3>
                ${C.flow([
                    { title: 'User Request', desc: 'Message sent to LLM via Chat, Pixel, or API' },
                    { title: 'Pre-Logging', desc: 'Create ROOM (conversation) and log initial MESSAGE', arrow: '↓ before API call' },
                    { title: 'LLM Call', desc: 'Forward request to OpenAI/Anthropic/etc.', arrow: '↓ to external API' },
                    { title: 'Response Received', desc: 'LLM returns completion', arrow: '↓' },
                    { title: 'Post-Logging', desc: 'Update MESSAGE with tokens, response time, content', accent: true, arrow: '↓' },
                    { title: 'Feedback', desc: 'User thumbs up/down → FEEDBACK table' },
                ])}
            `
        },
        {
            id: "d3-model-logs-schema",
            title: "Database Schema",
            content: `
                <h2>Model Logs Database Schema</h2>
                <p>The logs database consists of 6 main tables tracking different aspects of model usage.</p>
                <h3>Core Tables</h3>
                ${C.table(
                    ['Table', 'Purpose', 'Key Columns'],
                    [
                        ['<strong>MESSAGE</strong>', 'Individual LLM interactions', 'MESSAGE_ID, MESSAGE_TYPE, MESSAGE_DATA, MESSAGE_TOKENS, RESPONSE_TIME, USER_ID, MODEL_ID, ROOM_ID'],
                        ['<strong>ROOM</strong>', 'Conversation sessions', 'ROOM_ID, ROOM_NAME, INSIGHT_ID, USER_ID, AGENT_ID, MODEL_ID, IS_ACTIVE, WORKSPACE_ID'],
                        ['<strong>AGENT</strong>', 'Model/agent configurations', 'AGENT_ID, AGENT_NAME, AGENT_TYPE, DESCRIPTION, AUTHOR'],
                        ['<strong>FEEDBACK</strong>', 'User ratings (thumbs up/down)', 'MESSAGE_ID, RATING, FEEDBACK_TEXT, FEEDBACK_DATE'],
                        ['<strong>WORKSPACE</strong>', 'Team workspaces', 'WORKSPACE_ID, OWNER, NAME, SYSTEM_PROMPT, IS_ACTIVE'],
                        ['<strong>WORKSPACE_RESOURCE</strong>', 'Resources linked to workspaces', 'WORKSPACE_ID, RESOURCE_ID, RESOURCE_TYPE'],
                    ]
                )}
                <h3>MESSAGE Table (Primary)</h3>
                ${C.code(`// MESSAGE table columns (from ModelInferenceLogsOwlCreator.java)
MESSAGE_ID         VARCHAR(50)      -- Unique message identifier
TRANSACTION_ID     VARCHAR(50)      -- Links request/response pairs
MESSAGE_TYPE       VARCHAR(50)      -- user, assistant, system, function
MESSAGE_DATA       BLOB             -- Actual message content (JSON)
MESSAGE_TOKENS     INTEGER          -- Token count for this message
MESSAGE_METHOD     VARCHAR(50)      -- API method used
RESPONSE_TIME      DOUBLE           -- Milliseconds to complete
DATE_CREATED       TIMESTAMP        -- When message was created
AGENT_ID           VARCHAR(50)      -- Which agent/model was used
MODEL_ID           VARCHAR(50)      -- Model identifier (gpt-4, claude-3, etc.)
INSIGHT_ID         VARCHAR(50)      -- Which insight context
ROOM_ID            VARCHAR(50)      -- Conversation session
SESSIONID          VARCHAR(255)     -- HTTP session
USER_ID            VARCHAR(255)     -- User identifier
USER_NAME          VARCHAR(255)     -- User display name
USER_EMAIL_ID      VARCHAR(50)      -- User email`, 'sql', 'src/prerna/engine/impl/model/inferencetracking/ModelInferenceLogsOwlCreator.java')}
            `
        },
        {
            id: "d3-model-logs-what-gets-logged",
            title: "What Gets Logged",
            content: `
                <h2>What Gets Logged and Why</h2>
                ${C.cards([
                    {
                        badge: 'Message Content',
                        title: 'MESSAGE_DATA',
                        desc: 'Full message text (user prompts, assistant responses, system messages). Stored as BLOB for large content.'
                    },
                    {
                        badge: 'Tokens',
                        title: 'MESSAGE_TOKENS',
                        desc: 'Token count for cost tracking. Each model has different pricing per 1K tokens.'
                    },
                    {
                        badge: 'Performance',
                        title: 'RESPONSE_TIME',
                        desc: 'Milliseconds from request to response. Identifies slow queries and performance issues.'
                    },
                    {
                        badge: 'Context',
                        title: 'ROOM_ID, INSIGHT_ID',
                        desc: 'Links messages to conversations and insights. Enables conversation history reconstruction.'
                    },
                    {
                        badge: 'User Identity',
                        title: 'USER_ID, USER_EMAIL',
                        desc: 'Track usage per user for compliance, billing, and support.'
                    },
                    {
                        badge: 'Model Info',
                        title: 'MODEL_ID, AGENT_ID',
                        desc: 'Which model was used (gpt-4-turbo, claude-3-opus, etc.). Enables model comparison.'
                    },
                ])}
                ${C.callout('<strong>Privacy note:</strong> MESSAGE_DATA contains user prompts and responses. In production, consider encryption, retention policies, and GDPR compliance.', 'warning')}
            `
        },
        {
            id: "d3-model-logs-querying",
            title: "Querying Model Logs",
            content: `
                <h2>Querying Model Logs</h2>
                <p>You can query the logs database like any ${CONFIG.productName} database engine using Pixel or SQL.</p>
                <h3>Via Pixel</h3>
                ${C.code(`// Query recent messages
Database(database="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
  | Query("SELECT MESSAGE_ID, MESSAGE_TYPE, USER_NAME, DATE_CREATED, RESPONSE_TIME
           FROM MESSAGE
           ORDER BY DATE_CREATED DESC
           LIMIT 100")
  | Import()
  | Collect(100);

// Token usage by user
Database(database="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
  | Query("SELECT USER_NAME, SUM(MESSAGE_TOKENS) as TOTAL_TOKENS, COUNT(*) as MESSAGE_COUNT
           FROM MESSAGE
           WHERE DATE_CREATED >= DATEADD('DAY', -7, CURRENT_DATE)
           GROUP BY USER_NAME
           ORDER BY TOTAL_TOKENS DESC")
  | Import()
  | AutoTaskOptions(layout='BarChart')
  | Collect(500);`, 'pixel', 'Querying logs via Pixel')}
                <h3>Via SQL (Direct)</h3>
                ${C.code(`// Get messages for a specific room
SELECT
    m.MESSAGE_ID,
    m.MESSAGE_TYPE,
    m.MESSAGE_DATA,
    m.MESSAGE_TOKENS,
    m.RESPONSE_TIME,
    m.DATE_CREATED,
    r.ROOM_NAME
FROM MESSAGE m
JOIN ROOM r ON m.ROOM_ID = r.ROOM_ID
WHERE r.ROOM_ID = 'abc-123-def'
ORDER BY m.DATE_CREATED ASC;

// Average response time by model
SELECT
    MODEL_ID,
    AVG(RESPONSE_TIME) as AVG_RESPONSE_MS,
    COUNT(*) as REQUEST_COUNT
FROM MESSAGE
WHERE MESSAGE_TYPE = 'assistant'
  AND DATE_CREATED >= DATEADD('DAY', -30, CURRENT_DATE)
GROUP BY MODEL_ID
ORDER BY AVG_RESPONSE_MS DESC;`, 'sql', 'Direct SQL queries')}
            `
        },
        {
            id: "d3-model-logs-troubleshooting",
            title: "Troubleshooting with Logs",
            content: `
                <h2>Common Troubleshooting Scenarios</h2>
                <p>The Spain team frequently asks these questions — here's how to answer them using logs.</p>
                ${C.cards([
                    {
                        badge: 'Question',
                        title: 'Why is the LLM slow?',
                        desc: '<code>SELECT MODEL_ID, AVG(RESPONSE_TIME), MAX(RESPONSE_TIME) FROM MESSAGE WHERE USER_ID = \'user@example.com\' AND DATE_CREATED >= DATEADD(\'HOUR\', -1, CURRENT_TIMESTAMP) GROUP BY MODEL_ID</code><br><br>Check if specific models are slow, or if all requests are slow (network issue).'
                    },
                    {
                        badge: 'Question',
                        title: 'Which users consume the most tokens?',
                        desc: '<code>SELECT USER_NAME, SUM(MESSAGE_TOKENS) as TOTAL_TOKENS FROM MESSAGE GROUP BY USER_NAME ORDER BY TOTAL_TOKENS DESC LIMIT 10</code><br><br>Identify heavy users for cost allocation or usage limits.'
                    },
                    {
                        badge: 'Question',
                        title: 'What did the user ask yesterday?',
                        desc: '<code>SELECT MESSAGE_DATA, DATE_CREATED FROM MESSAGE WHERE USER_ID = \'xyz\' AND MESSAGE_TYPE = \'user\' AND DATE_CREATED >= DATEADD(\'DAY\', -1, CURRENT_DATE) ORDER BY DATE_CREATED DESC</code><br><br>Retrieve conversation history for support.'
                    },
                    {
                        badge: 'Question',
                        title: 'Are there failed requests?',
                        desc: '<code>SELECT MESSAGE_ID, MESSAGE_DATA, DATE_CREATED FROM MESSAGE WHERE MESSAGE_DATA LIKE \'%error%\' OR RESPONSE_TIME IS NULL</code><br><br>Find failed or incomplete requests.'
                    },
                    {
                        badge: 'Question',
                        title: 'Which models are most popular?',
                        desc: '<code>SELECT MODEL_ID, COUNT(*) as USAGE_COUNT FROM MESSAGE GROUP BY MODEL_ID ORDER BY USAGE_COUNT DESC</code><br><br>Understand model adoption and trends.'
                    },
                    {
                        badge: 'Question',
                        title: 'What feedback did users give?',
                        desc: '<code>SELECT f.RATING, f.FEEDBACK_TEXT, m.MESSAGE_DATA FROM FEEDBACK f JOIN MESSAGE m ON f.MESSAGE_ID = m.MESSAGE_ID WHERE f.RATING = false</code><br><br>Find messages with negative feedback (thumbs down).'
                    },
                ])}
            `
        },
        {
            id: "d3-model-logs-analytics",
            title: "Analytics & Insights",
            content: `
                <h2>Analytics on Model Usage</h2>
                <p>The logs database enables powerful analytics for understanding LLM usage across your organization.</p>
                <h3>Cost Analysis</h3>
                ${C.code(`// Daily token usage trend
SELECT
    CAST(DATE_CREATED AS DATE) as DAY,
    SUM(MESSAGE_TOKENS) as TOTAL_TOKENS,
    COUNT(DISTINCT USER_ID) as ACTIVE_USERS
FROM MESSAGE
WHERE DATE_CREATED >= DATEADD('DAY', -30, CURRENT_DATE)
GROUP BY CAST(DATE_CREATED AS DATE)
ORDER BY DAY;

// Estimated cost per user (assuming $0.01 per 1K tokens)
SELECT
    USER_NAME,
    SUM(MESSAGE_TOKENS) as TOTAL_TOKENS,
    ROUND(SUM(MESSAGE_TOKENS) / 1000.0 * 0.01, 2) as ESTIMATED_COST_USD
FROM MESSAGE
WHERE DATE_CREATED >= DATEADD('MONTH', -1, CURRENT_DATE)
GROUP BY USER_NAME
ORDER BY ESTIMATED_COST_USD DESC;`, 'sql', 'Cost analytics queries')}
                <h3>Performance Metrics</h3>
                ${C.code(`// 95th percentile response time by model
SELECT
    MODEL_ID,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY RESPONSE_TIME) as P95_RESPONSE_MS,
    AVG(RESPONSE_TIME) as AVG_RESPONSE_MS,
    COUNT(*) as SAMPLE_SIZE
FROM MESSAGE
WHERE MESSAGE_TYPE = 'assistant'
  AND RESPONSE_TIME IS NOT NULL
GROUP BY MODEL_ID
ORDER BY P95_RESPONSE_MS DESC;

// Requests per hour (traffic patterns)
SELECT
    HOUR(DATE_CREATED) as HOUR_OF_DAY,
    COUNT(*) as REQUEST_COUNT
FROM MESSAGE
WHERE DATE_CREATED >= DATEADD('DAY', -7, CURRENT_DATE)
GROUP BY HOUR(DATE_CREATED)
ORDER BY HOUR_OF_DAY;`, 'sql', 'Performance analytics')}
            `
        },
        {
            id: "d3-model-logs-retention",
            title: "Log Retention & Management",
            content: `
                <h2>Log Retention and Management</h2>
                <p>Model logs grow rapidly — a busy ${CONFIG.productName} instance can generate millions of records per month.</p>
                ${C.flow([
                    { title: 'Monitor Size', desc: 'Check database size regularly', accent: true },
                    { title: 'Define Policy', desc: 'Decide retention period (30 days? 90 days? 1 year?)', arrow: '↓' },
                    { title: 'Archive Old Logs', desc: 'Export to S3/data lake for long-term storage', arrow: '↓ export' },
                    { title: 'Delete Stale Data', desc: 'Remove logs beyond retention period', arrow: '↓ purge' },
                    { title: 'Vacuum/Optimize', desc: 'Reclaim space and rebuild indexes', accent: true },
                ])}
                <h3>Retention Query Examples</h3>
                ${C.code(`// Check database size
SELECT
    COUNT(*) as MESSAGE_COUNT,
    SUM(LENGTH(MESSAGE_DATA)) / 1024 / 1024 as SIZE_MB
FROM MESSAGE;

// Archive messages older than 90 days
-- Step 1: Export to CSV
Database(database="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
  | Query("SELECT * FROM MESSAGE WHERE DATE_CREATED < DATEADD('DAY', -90, CURRENT_DATE)")
  | ToCsv(filePath="archived_messages_2024Q1.csv");

-- Step 2: Delete after confirming export
DELETE FROM MESSAGE
WHERE DATE_CREATED < DATEADD('DAY', -90, CURRENT_DATE);

-- Step 3: Vacuum (H2/PostgreSQL)
VACUUM FULL MESSAGE;`, 'sql', 'Log retention management')}
                ${C.callout('<strong>Best practice:</strong> Run retention cleanup during off-peak hours. Schedule as a monthly job. Always export before deletion.', 'tip')}
            `
        },
        {
            id: "d3-model-logs-handson",
            title: "Hands-on: Query & Analyze Logs",
            content: `
                <h2>Hands-on: Query and Analyze Model Logs</h2>
                ${C.handson('Investigate Model Usage Patterns', `
                    <h4>Scenario</h4>
                    <p>The Spain team reports that LLM responses are slow in the afternoon. Use the logs database to investigate.</p>

                    <h4>Step 1: Check Recent Response Times</h4>
                    ${C.code(`Database(database="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
  | Query("SELECT
            HOUR(DATE_CREATED) as HOUR,
            AVG(RESPONSE_TIME) as AVG_MS,
            MAX(RESPONSE_TIME) as MAX_MS,
            COUNT(*) as COUNT
           FROM MESSAGE
           WHERE DATE_CREATED >= DATEADD('DAY', -1, CURRENT_DATE)
             AND MESSAGE_TYPE = 'assistant'
           GROUP BY HOUR(DATE_CREATED)
           ORDER BY HOUR")
  | Import()
  | AutoTaskOptions(layout='LineChart')
  | Collect(500);`, 'pixel')}

                    <h4>Step 2: Identify Slow Models</h4>
                    ${C.code(`Database(database="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
  | Query("SELECT
            MODEL_ID,
            AVG(RESPONSE_TIME) as AVG_MS,
            COUNT(*) as SAMPLE_SIZE
           FROM MESSAGE
           WHERE DATE_CREATED >= DATEADD('HOUR', -6, CURRENT_TIMESTAMP)
             AND MESSAGE_TYPE = 'assistant'
           GROUP BY MODEL_ID
           HAVING COUNT(*) > 10
           ORDER BY AVG_MS DESC")
  | Import()
  | Collect(100);`, 'pixel')}

                    <h4>Step 3: Find Heavy Users (if applicable)</h4>
                    ${C.code(`Database(database="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
  | Query("SELECT
            USER_NAME,
            COUNT(*) as REQUEST_COUNT,
            SUM(MESSAGE_TOKENS) as TOTAL_TOKENS
           FROM MESSAGE
           WHERE DATE_CREATED >= DATEADD('HOUR', -6, CURRENT_TIMESTAMP)
           GROUP BY USER_NAME
           ORDER BY REQUEST_COUNT DESC
           LIMIT 10")
  | Import()
  | Collect(100);`, 'pixel')}

                    <h4>Step 4: Check for Errors</h4>
                    ${C.code(`Database(database="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d")
  | Query("SELECT
            MESSAGE_ID,
            USER_NAME,
            MODEL_ID,
            DATE_CREATED,
            MESSAGE_DATA
           FROM MESSAGE
           WHERE DATE_CREATED >= DATEADD('HOUR', -6, CURRENT_TIMESTAMP)
             AND (MESSAGE_DATA LIKE '%error%' OR RESPONSE_TIME IS NULL)
           ORDER BY DATE_CREATED DESC")
  | Import()
  | Collect(100);`, 'pixel')}

                    <h4>Step 5: Analyze and Report</h4>
                    <p><strong>Questions to answer:</strong></p>
                    <ul>
                        <li>Is one model consistently slower than others? → Switch models</li>
                        <li>Is traffic higher in the afternoon? → Load balancing or rate limiting</li>
                        <li>Are there error spikes? → Check external API status</li>
                        <li>Is one user generating excessive requests? → Investigate usage pattern</li>
                    </ul>

                    <h4>Bonus: Create a Dashboard</h4>
                    ${C.code(`// Save queries as a dashboard insight
// Add these panels:
// 1. Requests per hour (line chart)
// 2. Average response time by model (bar chart)
// 3. Top 10 users by token count (table)
// 4. Recent errors (table)

// Share with the Spain team for daily monitoring`, 'pixel')}
                `)}
            `
        },
        {
            id: "d3-model-logs-recap",
            title: "Recap",
            content: `
                <h2>Model Logs Recap</h2>
                ${C.cards([
                    {
                        badge: 'Database',
                        title: 'MODEL_INFERENCE_LOGS_DB',
                        desc: 'Dedicated RDBMS tracking all LLM interactions with 6 tables: MESSAGE, ROOM, AGENT, FEEDBACK, WORKSPACE, WORKSPACE_RESOURCE.'
                    },
                    {
                        badge: 'What Gets Logged',
                        title: 'MESSAGE Table',
                        desc: 'Every LLM interaction logs: content (BLOB), tokens (INTEGER), response time (DOUBLE), user, model, timestamp, room context.'
                    },
                    {
                        badge: 'Use Cases',
                        title: 'Cost, Compliance, Troubleshooting',
                        desc: 'Track usage costs, audit for compliance, debug slow/failed requests, analyze user behavior.'
                    },
                    {
                        badge: 'Querying',
                        title: 'Pixel or SQL',
                        desc: 'Use Database() reactor or direct SQL. Join MESSAGE, ROOM, FEEDBACK for rich analytics.'
                    },
                    {
                        badge: 'Analytics',
                        title: 'Insights from Logs',
                        desc: 'Token trends, cost per user, performance metrics (P95 latency), traffic patterns (hourly).'
                    },
                    {
                        badge: 'Retention',
                        title: 'Archive & Purge',
                        desc: 'Export old logs to S3/data lake, delete beyond retention period, vacuum to reclaim space.'
                    },
                ])}
                <h3>Next: Day 3 Ch4</h3>
                <p>API Endpoints — building and consuming REST APIs in ${CONFIG.productName}.</p>
            `
        }
    ]
};
