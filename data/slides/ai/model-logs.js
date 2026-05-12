// Topic: Model Logs
const slides_model_logs = [
        {
            id: "model-logs-title",
            title: "Model & Audit Logs",
            content: C.titleSlide(
                "Model & Audit Logs",
                `Tracking, analyzing, and troubleshooting LLM usage and engine operations in ${CONFIG.productName}`,
                "90 minutes"
            )
        },
        {
            id: "model-logs-overview",
            title: "What are Model Logs?",
            content: `
                <h2>What are Model Logs?</h2>
                <p class="lead">${CONFIG.productName} maintains a comprehensive <span class="highlight">Model Inference Logs Database</span> that captures every LLM interaction for analytics, compliance, and troubleshooting.</p>
                <p>Every time a user interacts with an LLM in ${CONFIG.productName}  -  whether through chat, Pixel commands, or API calls  -  the system logs detailed information about the interaction.</p>
                ${C.cards([
                    { badge: 'Why Log?', title: 'Cost Tracking', desc: 'Monitor token usage and API costs per user, project, and model' },
                    { badge: 'Why Log?', title: 'Troubleshooting', desc: 'Debug failed requests, track response times, identify bottlenecks' },
                    { badge: 'Why Log?', title: 'Analytics', desc: 'Understand usage patterns, popular models, user behavior' },
                    { badge: 'Why Log?', title: 'Compliance', desc: 'Audit trail for governance, data privacy, and regulatory requirements' },
                ])}
                ${C.callout('The logs database is <code>MODEL_INFERENCE_LOGS_DB</code>  -  a dedicated H2/PostgreSQL database separate from your app data.', 'info')}
            `
        },
        {
            id: "model-logs-architecture",
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
                        items: [
                            { title: 'Model Engine', desc: 'AbstractModelEngine' },
                            { title: 'Logging Utils', desc: 'ModelInferenceLogsUtils' },
                        ]
                    },
                    {
                        label: 'Storage Layer',
                        items: [
                            { title: 'Logs Database', desc: 'MODEL_INFERENCE_LOGS_DB' },
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
                    { title: 'Post-Logging', desc: 'Update MESSAGE with tokens, response time, content', arrow: '↓' },
                    { title: 'Feedback', desc: 'User thumbs up/down → FEEDBACK table' },
                ])}
            `
        },
        {
            id: "model-logs-schema",
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
            id: "model-logs-what-gets-logged",
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
            id: "model-logs-querying",
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
            id: "model-logs-troubleshooting",
            title: "Troubleshooting with Logs",
            content: `
                <h2>Common Troubleshooting Scenarios</h2>
                <p>These are common questions from operations teams  -  here's how to answer them using logs.</p>
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
            id: "model-logs-analytics",
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
            id: "model-logs-retention",
            title: "Log Retention & Management",
            content: `
                <h2>Log Retention and Management</h2>
                <p>Model logs grow rapidly  -  a busy ${CONFIG.productName} instance can generate millions of records per month.</p>
                ${C.flow([
                    { title: 'Monitor Size', desc: 'Check database size regularly' },
                    { title: 'Define Policy', desc: 'Decide retention period (30 days? 90 days? 1 year?)', arrow: '↓' },
                    { title: 'Archive Old Logs', desc: 'Export to S3/data lake for long-term storage', arrow: '↓ export' },
                    { title: 'Delete Stale Data', desc: 'Remove logs beyond retention period', arrow: '↓ purge' },
                    { title: 'Vacuum/Optimize', desc: 'Reclaim space and rebuild indexes' },
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
            id: "model-logs-handson",
            title: "Hands-on: Query & Analyze Logs",
            content: `
                <h2>Hands-on: Query and Analyze Model Logs</h2>
                ${C.handson('Investigate Model Usage Patterns', `
                    <h4>Scenario</h4>
                    <p>Users report that LLM responses are slow in the afternoon. Use the logs database to investigate.</p>

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

// Share with the ops team for daily monitoring`, 'pixel')}
                `)}
            `
        },
        {
            id: "audit-logs-overview",
            title: "Audit Logs: The Other Half",
            content: `
                <h2>Audit Logs: The Other Half</h2>
                <p class="lead">While Model Inference Logs track LLM conversations, <span class="highlight">Audit Logs</span> capture every engine operation for operational telemetry and compliance.</p>
                ${C.split(
                    {
                        title: 'MODEL_INFERENCE_LOGS_DB',
                        content: `
                            <h4>What It Tracks</h4>
                            <ul>
                                <li><strong>LLM Conversations</strong>  -  User messages, assistant responses, system prompts</li>
                                <li><strong>Chat Context</strong>  -  Rooms (conversation sessions), feedback (thumbs up/down)</li>
                                <li><strong>Token Usage</strong>  -  MESSAGE_TOKENS for cost tracking</li>
                                <li><strong>User Behavior</strong>  -  Conversation history, model preferences</li>
                            </ul>
                            <h4>Primary Use Case</h4>
                            <p><strong>Chat history and user experience analytics</strong></p>
                        `
                    },
                    {
                        title: 'AUDIT_LOGS_DB',
                        content: `
                            <h4>What It Tracks</h4>
                            <ul>
                                <li><strong>Engine Operations</strong>  -  Every database query, model inference, vector search, function call</li>
                                <li><strong>Request/Response Payloads</strong>  -  Full REQUEST and RESPONSE CLOBs for debugging</li>
                                <li><strong>Reactor Names</strong>  -  INPUT_REACTOR_NAME, OUTPUT_REACTOR_NAME, METHOD_NAME</li>
                                <li><strong>Success/Failure</strong>  -  IS_SUCCESS flag, error messages</li>
                                <li><strong>Performance</strong>  -  REQUEST_START_TIME, RESPONSE_END_TIME</li>
                            </ul>
                            <h4>Primary Use Case</h4>
                            <p><strong>Operational telemetry, debugging, compliance auditing</strong></p>
                        `
                    }
                )}
                ${C.callout('These are <strong>TWO separate databases</strong>. Model logs = chat history. Audit logs = operational telemetry. Both are used together for comprehensive observability.', 'info')}
            `
        },
        {
            id: "audit-logs-schema",
            title: "Audit Logs Schema",
            content: `
                <h2>Audit Logs Database Schema</h2>
                <p>The audit logs database consists of 2 main tables capturing engine operations and server-side logging.</p>
                <h3>AUDIT_LOGS Table (29 Columns)</h3>
                ${C.code(`-- AUDIT_LOGS table structure (from AuditLogsDbOwlCreator.java)
LOG_ID                         VARCHAR(255)   -- Unique log identifier
REQUEST_ID                     VARCHAR(255)   -- Links related requests
IS_SUCCESS                     BOOLEAN        -- Did the operation succeed?
SESSION_ID                     VARCHAR(255)   -- HTTP session
USER_ID                        VARCHAR(255)   -- User identifier
USER_TYPE                      VARCHAR(255)   -- User type (local, oauth, etc.)
SPAN_ID                        VARCHAR(255)   -- Distributed tracing span
INSIGHT_ID                     VARCHAR(255)   -- Insight context
PROJECT_ID                     VARCHAR(255)   -- Project ID
PROJECT_NAME                   VARCHAR(255)   -- Project name
ROOM_ID                        VARCHAR(255)   -- Room/conversation ID
ENGINE_ID                      VARCHAR(255)   -- Engine identifier
ENGINE_NAME                    VARCHAR(255)   -- Engine name
ENGINE_TYPE                    VARCHAR(255)   -- Engine type (Database, Model, Vector, etc.)
METHOD_NAME                    VARCHAR(255)   -- Method called on engine
ENGINE_SUBTYPE                 VARCHAR(255)   -- Engine subtype (e.g., PostgreSQL, OpenAI)
INPUT_REACTOR_NAME             VARCHAR(255)   -- Reactor that initiated the call
OUTPUT_REACTOR_NAME            VARCHAR(255)   -- Reactor that processed output
MESSAGE                        CLOB           -- Log message (formatted string)
REQUEST                        CLOB           -- Full request payload (JSON)
RESPONSE                       CLOB           -- Full response payload (JSON)
NUMBER_OF_TOKENS_IN_PROMPT     INTEGER        -- Token count in prompt
NUMBER_OF_TOKENS_IN_RESPONSE   INTEGER        -- Token count in response
REQUEST_START_TIME             TIMESTAMP      -- When request started
RESPONSE_END_TIME              TIMESTAMP      -- When response completed
LOG_LEVEL                      VARCHAR(255)   -- Log level (INFO, WARN, ERROR)
LOG_TIMESTAMP                  TIMESTAMP      -- When log was created
LOGGER_NAME                    VARCHAR(255)   -- Logger name (e.g., EngineLogger)
LOGGER_LOCATION                VARCHAR(255)   -- Source code location`, 'sql', 'src/prerna/engine/logging/AuditLogsDbOwlCreator.java (lines 73-89)')}
                <h3>SERVER_LOGS Table (11 Columns)</h3>
                ${C.code(`-- SERVER_LOGS table structure (from AuditLogsDbOwlCreator.java)
LOG_ID          VARCHAR(255)   -- Unique log identifier
SESSION_ID      VARCHAR(255)   -- HTTP session
REQUEST_ID      VARCHAR(255)   -- Links related requests
USER_ID         VARCHAR(255)   -- User identifier
USER_TYPE       VARCHAR(255)   -- User type
LEVEL           VARCHAR(50)    -- Log level (INFO, WARN, ERROR, DEBUG)
LOGGER_NAME     VARCHAR(255)   -- Logger name
LOGGER_LOCATION VARCHAR(255)   -- Source code location
THREAD_NAME     VARCHAR(255)   -- Thread name
LOG_TIMESTAMP   TIMESTAMP      -- When log was created
MESSAGE         CLOB           -- Log message (may include stack traces)`, 'sql', 'src/prerna/engine/logging/AuditLogsDbOwlCreator.java (lines 91-96)')}
                <h3>Column Groups</h3>
                ${C.table(
                    ['Group', 'Columns', 'Purpose'],
                    [
                        ['<strong>Identity</strong>', 'USER_ID, USER_TYPE, SESSION_ID', 'Who made the request'],
                        ['<strong>Context</strong>', 'INSIGHT_ID, PROJECT_ID, ROOM_ID, SPAN_ID', 'Where and when'],
                        ['<strong>Engine</strong>', 'ENGINE_ID, ENGINE_NAME, ENGINE_TYPE, ENGINE_SUBTYPE', 'Which engine was called'],
                        ['<strong>Reactor</strong>', 'INPUT_REACTOR_NAME, OUTPUT_REACTOR_NAME, METHOD_NAME', 'Which reactor handled the request'],
                        ['<strong>Content</strong>', 'REQUEST, RESPONSE, MESSAGE (all CLOBs)', 'Full payloads for debugging'],
                        ['<strong>Timing</strong>', 'REQUEST_START_TIME, RESPONSE_END_TIME', 'Performance metrics'],
                        ['<strong>Tokens</strong>', 'NUMBER_OF_TOKENS_IN_PROMPT, NUMBER_OF_TOKENS_IN_RESPONSE', 'LLM cost tracking'],
                    ]
                )}
            `
        },
        {
            id: "audit-logs-when-to-use",
            title: "Model Logs vs Audit Logs",
            content: `
                <h2>Model Logs vs Audit Logs: When to Use Which</h2>
                <p>Both logging systems complement each other. Here's how to choose the right one for your use case.</p>
                ${C.table(
                    ['Question', 'Use This', 'Table / Column'],
                    [
                        ['What did the user ask the LLM?', '<strong>Model Inference Logs</strong>', '<code>MESSAGE.MESSAGE_DATA</code> (user messages)'],
                        ['Did the engine call succeed or fail?', '<strong>Audit Logs</strong>', '<code>AUDIT_LOGS.IS_SUCCESS</code>'],
                        ['Which reactor handled the request?', '<strong>Audit Logs</strong>', '<code>AUDIT_LOGS.INPUT_REACTOR_NAME</code>, <code>OUTPUT_REACTOR_NAME</code>'],
                        ['Full API request/response payload?', '<strong>Audit Logs</strong>', '<code>AUDIT_LOGS.REQUEST</code>, <code>RESPONSE</code> (CLOBs)'],
                        ['Token usage for cost tracking?', '<strong>Both</strong>', 'Model: <code>MESSAGE.MESSAGE_TOKENS</code><br>Audit: <code>AUDIT_LOGS.NUMBER_OF_TOKENS_IN_PROMPT/RESPONSE</code>'],
                        ['User conversation history?', '<strong>Model Inference Logs</strong>', '<code>ROOM</code> + <code>MESSAGE</code> tables'],
                        ['Server errors and stack traces?', '<strong>Audit Logs</strong>', '<code>SERVER_LOGS.MESSAGE</code> (CLOB with full stack trace)'],
                        ['How long did the LLM take to respond?', '<strong>Both</strong>', 'Model: <code>MESSAGE.RESPONSE_TIME</code><br>Audit: <code>RESPONSE_END_TIME - REQUEST_START_TIME</code>'],
                        ['Which project/insight was used?', '<strong>Both</strong>', 'Model: <code>MESSAGE.INSIGHT_ID</code><br>Audit: <code>AUDIT_LOGS.PROJECT_ID</code>, <code>INSIGHT_ID</code>'],
                        ['What method was called on the engine?', '<strong>Audit Logs</strong>', '<code>AUDIT_LOGS.METHOD_NAME</code> (e.g., "ask", "query", "search")'],
                    ]
                )}
                ${C.callout('<strong>Rule of thumb:</strong> Model logs for <em>what users said</em>. Audit logs for <em>what the system did</em>.', 'tip')}
            `
        },
        {
            id: "audit-logs-usage-reactors",
            title: "Built-in Usage Reactors",
            content: `
                <h2>Built-in Usage Reactors</h2>
                <p>${CONFIG.productName} provides reactors to query both logging systems without writing raw SQL. These reactors handle permission checks and return formatted data.</p>
                <h3>Model Inference Logs Reactors</h3>
                ${C.code(`// Get overall engine usage stats (requires engine ownership)
GetAllEngineUsage(engine="my-gpt4-engine", limit=100, offset=0, startDate="2024-01-01", endDate="2024-12-31");
// Returns: total tokens, message count, unique users, response times

// Get per-user usage breakdown (requires engine ownership)
GetEngineUsagePerUser(engine="my-gpt4-engine", limit=50, startDate="2024-01-01");
// Returns: user_name, total_tokens, message_count

// Get per-project usage breakdown (requires admin)
GetEngineUsagePerProject(engine="my-gpt4-engine", limit=50, startDate="2024-01-01");
// Returns: project_id, project_name, total_tokens, message_count`, 'pixel', 'Model inference tracking reactors')}
                <h3>Admin Usage Reactors</h3>
                ${C.code(`// Admin-only: Get usage across all users (no ownership check)
AdminGetAllEngineUsage(engine="my-gpt4-engine", limit=100);

// Admin-only: Get per-user usage without ownership restriction
AdminGetEngineUsagePerUser(engine="my-gpt4-engine", limit=50);`, 'pixel', 'Admin reactors (require admin role)')}
                <h3>Audit Logs Reactor</h3>
                ${C.code(`// Query audit logs timeline with filters
AuditLogReport(paramValuesMap={
    "engineId": "my-db-engine",           // Optional: filter by engine
    "projectId": "abc-123",               // Optional: filter by project
    "roomId": "room-xyz",                 // Optional: filter by room
    "sessionId": "session-456",           // Optional: filter by session
    "filterUserId": "user@example.com",   // Optional: filter by user (owner/admin only)
    "dateRangeType": "week",              // "day" | "week" | "month" | "custom"
    "dateRangeValue": 2,                  // Number of periods (e.g., 2 weeks)
    "startDate": "2024-01-01T00:00:00Z",  // Required if dateRangeType="custom"
    "endDate": "2024-12-31T23:59:59Z"     // Required if dateRangeType="custom"
}, limit=100, offset=0);
// Returns: { totalCount: 1234, logs: [ {logId, requestId, isSuccess, ...}, ... ] }`, 'pixel', 'src/prerna/logging/AuditLogReportReactor.java')}
                ${C.callout('These reactors query the logs for you  -  <strong>no raw SQL needed</strong> for common usage reports. They handle permission checks and return formatted data ready for dashboards.', 'tip')}
            `
        },
        {
            id: "audit-logs-infrastructure",
            title: "How Logging Works",
            content: `
                <h2>How Logging Works Under the Hood</h2>
                <p>The logging system uses a dual-path architecture: audit logs capture engine operations, while model inference logs track LLM conversations.</p>
                ${C.sequence(
                    ['User', 'Engine', 'log4j2', 'AuditLogsJDBCAppender', 'ServerLogsJDBCAppender', 'ModelEngineInferenceLogsWorker'],
                    [
                        { from: 0, to: 1, label: 'Request (Pixel, REST, etc.)' },
                        { from: 1, to: 2, label: 'EngineLogger.info(...)' },
                        { from: 2, to: 3, label: 'Route to AUDIT_LOGS' },
                        { from: 2, to: 4, label: 'Route to SERVER_LOGS' },
                        { from: 3, to: 3, label: 'Batch insert to AUDIT_LOGS table', type: 'request' },
                        { from: 4, to: 4, label: 'Batch insert to SERVER_LOGS table', type: 'request' },
                        { from: 1, to: 5, label: 'Async worker thread (model engines only)' },
                        { from: 5, to: 5, label: 'Insert to MODEL_INFERENCE_LOGS_DB', type: 'request' },
                        { from: 1, to: 0, label: 'Response', type: 'response' },
                    ]
                )}
                <h3>Key Infrastructure Components</h3>
                ${C.cards([
                    {
                        badge: 'log4j2.xml',
                        title: 'EngineLogger',
                        desc: 'AsyncLogger named "EngineLogger" routes to <strong>both</strong> AuditLogsJDBCAppender and ServerLogsJDBCAppender. Configured in <code>log4j2.xml</code>.'
                    },
                    {
                        badge: 'Audit Path',
                        title: 'AuditLogsJDBCAppender',
                        desc: 'Batches log events (default 100) and inserts into <code>AUDIT_LOGS</code> table. Flushes every 60 seconds or when batch is full. Source: <code>AuditLogsJDBCAppender.java</code>'
                    },
                    {
                        badge: 'Server Path',
                        title: 'ServerLogsJDBCAppender',
                        desc: 'Batches general server logs and inserts into <code>SERVER_LOGS</code> table. Captures stack traces and error details.'
                    },
                    {
                        badge: 'Model Path',
                        title: 'ModelEngineInferenceLogsWorker',
                        desc: 'Async thread that writes to MODEL_INFERENCE_LOGS_DB. Only runs for model/vector engines. Respects <code>keepInputOutput()</code> flag for privacy.'
                    },
                ])}
                <h3>keepInputOutput() Flag (Privacy Control)</h3>
                <p>Model and vector engines have a <code>keepInputOutput()</code> flag in their <code>.smss</code> configuration:</p>
                ${C.code(`# In .smss file for a model engine
ENGINE_KEEP_INPUT_OUTPUT = true   # Store full prompt/response in model logs
ENGINE_KEEP_INPUT_OUTPUT = false  # Only store metadata (tokens, timing)  -  no content`, 'properties', 'Model engine .smss configuration')}
                ${C.callout('<strong>Privacy note:</strong> When <code>keepInputOutput=false</code>, prompt/response content is <em>not</em> stored in MODEL_INFERENCE_LOGS_DB (only tokens and timing). However, AUDIT_LOGS may still capture REQUEST/RESPONSE payloads depending on log level. Configure both for full privacy compliance.', 'warning')}
            `
        },
        {
            id: "model-logs-recap",
            title: "Recap",
            content: `
                <h2>Model & Audit Logs Recap</h2>
                ${C.cards([
                    {
                        badge: 'Model Logs',
                        title: 'MODEL_INFERENCE_LOGS_DB',
                        desc: 'Dedicated RDBMS tracking all LLM interactions with 6 tables: MESSAGE, ROOM, AGENT, FEEDBACK, WORKSPACE, WORKSPACE_RESOURCE. Focus: chat history and user experience.'
                    },
                    {
                        badge: 'Audit Logs',
                        title: 'AUDIT_LOGS_DB',
                        desc: 'Separate database tracking every engine operation with 2 tables: AUDIT_LOGS (29 columns) and SERVER_LOGS (11 columns). Focus: operational telemetry and compliance.'
                    },
                    {
                        badge: 'What Gets Logged',
                        title: 'MESSAGE vs AUDIT_LOGS',
                        desc: 'Model logs: user messages, assistant responses, tokens, room context. Audit logs: reactor names, request/response payloads (CLOBs), success/failure, performance timing.'
                    },
                    {
                        badge: 'Use Cases',
                        title: 'Cost, Compliance, Troubleshooting',
                        desc: 'Track usage costs, audit for compliance, debug slow/failed requests, analyze user behavior, identify which reactors are being called.'
                    },
                    {
                        badge: 'Built-in Reactors',
                        title: 'No SQL Needed',
                        desc: 'GetAllEngineUsage(), GetEngineUsagePerUser(), GetEngineUsagePerProject(), AuditLogReport()  -  all handle permission checks and return formatted data.'
                    },
                    {
                        badge: 'Infrastructure',
                        title: 'Dual-Path Logging',
                        desc: 'EngineLogger → log4j2 → AuditLogsJDBCAppender + ServerLogsJDBCAppender (batched). ModelEngineInferenceLogsWorker (async) → MODEL_INFERENCE_LOGS_DB. Respects keepInputOutput() flag.'
                    },
                    {
                        badge: 'Analytics',
                        title: 'Insights from Logs',
                        desc: 'Token trends, cost per user, performance metrics (P95 latency), traffic patterns (hourly), reactor usage, error rates.'
                    },
                    {
                        badge: 'Retention',
                        title: 'Archive & Purge',
                        desc: 'Export old logs to S3/data lake, delete beyond retention period, vacuum to reclaim space. Apply to both databases.'
                    },
                ])}
                <h3>Next: API Endpoints</h3>
                <p>Building and consuming REST APIs in ${CONFIG.productName}.</p>
            `
        }
    ];
