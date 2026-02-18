// Day 3, Chapter 1: Insight / Room / Session (105 min)
const day3_ch01 = {
    title: "Insight / Room / Session",
    slides: [
        {
            id: "d3-insight-title",
            title: "Insight / Room / Session",
            content: C.titleSlide(
                "Insight / Room / Session",
                `Understanding state management, collaboration, and persistence in ${CONFIG.productName}`,
                "105 minutes"
            )
        },
        {
            id: "d3-insight-what-is",
            title: "What are Insights, Rooms, and Sessions?",
            content: `
                <h2>What are Insights, Rooms, and Sessions?</h2>
                <p class="lead">${CONFIG.productName} uses three interconnected concepts to manage stateful interactions: <span class="highlight">Insights</span> (execution context), <span class="highlight">Rooms</span> (conversation history), and <span class="highlight">Sessions</span> (HTTP session binding).</p>
                ${C.cards([
                    { badge: 'Concept', title: 'Insight', desc: 'A stateful execution context holding variables, frames, panels, and R/Python environments. Identified by a unique <code>insightId</code> (UUID).' },
                    { badge: 'Concept', title: 'Room', desc: 'A persistent conversation thread with an LLM, storing message history and associated with an Insight for tool execution.' },
                    { badge: 'Concept', title: 'Session', desc: 'The HTTP session binding that maps users to their active insights. Managed by <code>InsightStore</code>.' },
                ])}
                ${C.callout('Think of it this way: <strong>Insights</strong> are the execution engine, <strong>Rooms</strong> are the LLM memory, and <strong>Sessions</strong> are the glue that binds them to users.', 'tip')}
            `
        },
        {
            id: "d3-insight-architecture",
            title: "Architecture Overview",
            content: `
                <h2>Insight / Room / Session Architecture</h2>
                <p>Understanding how these three components work together is key to building stateful ${CONFIG.productName} applications.</p>
                ${C.layers([
                    { label: "HTTP Layer", items: [
                        { title: "Browser", desc: "Holds sessionId cookie" },
                        { title: "REST API", desc: "Receives insightId in requests" },
                    ]},
                    { label: "Session Management", accent: true, items: [
                        { title: "InsightStore", desc: "Singleton map: insightId → Insight", accent: true },
                        { title: "RoomUtils", desc: "Manages Room persistence", accent: true },
                    ]},
                    { label: "Execution Context", items: [
                        { title: "Insight", desc: "VarStore, PixelList, TaskStore, Frames" },
                        { title: "Room", desc: "Message history, LLM context" },
                    ]},
                ])}
                ${C.callout('The <code>InsightStore</code> is a singleton in-memory cache. When a user closes their browser or the server restarts, temporary insights are lost unless explicitly saved.', 'info')}
            `
        },
        {
            id: "d3-insight-lifecycle",
            title: "Insight Lifecycle",
            content: `
                <h2>Insight Lifecycle & State Management</h2>
                <p>An <code>Insight</code> is created when a user opens an app or runs Pixel. It persists in memory as long as it's actively used.</p>
                ${C.sequence(
                    ["Browser", "REST API", "InsightStore", "Insight", "PixelRunner"],
                    [
                        { from: 0, to: 1, label: 'POST /api/engine/runPixel (insightId="new")' },
                        { from: 1, to: 2, label: "get or create Insight" },
                        { from: 2, to: 3, label: 'new Insight(insightId=UUID)' },
                        { from: 3, to: 2, label: "Insight object", type: "response" },
                        { from: 2, to: 1, label: "return Insight", type: "response" },
                        { from: 1, to: 4, label: "insight.runPixel(expression)" },
                        { from: 4, to: 1, label: "PixelRunner results", type: "response" },
                        { from: 1, to: 0, label: 'JSON response (insightId returned)', type: "response" },
                    ]
                )}
                ${C.code(`// Creating a new Insight (from Insight.java constructor)
public Insight() {
    this.pixelList = new PixelList(500);
    this.taskStore = new TaskStore();
    this.insightId = GUID.v7().toUUID().toString();  // UUID identifier
    this.varStore = new VarStore();                 // Variable storage
    // Add default sheet (Sheet1)
    insightSheets.put(DEFAULT_SHEET_ID, new InsightSheet(DEFAULT_SHEET_ID, "Sheet1"));
}`, 'java', 'prerna/om/Insight.java')}
            `
        },
        {
            id: "d3-insight-state",
            title: "What's Inside an Insight?",
            content: `
                <h2>What's Inside an Insight?</h2>
                <p>An Insight maintains a rich set of state to support complex, multi-step workflows.</p>
                ${C.split(
                    {
                        title: 'Core State',
                        content: `
                            <ul>
                                <li><code>insightId</code> — UUID identifier</li>
                                <li><code>user</code> — User object (auth context)</li>
                                <li><code>projectId</code> — Associated app/project</li>
                                <li><code>varStore</code> — Variable assignments</li>
                                <li><code>pixelList</code> — Pixel execution history</li>
                                <li><code>taskStore</code> — Async task tracking</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Advanced State',
                        content: `
                            <ul>
                                <li><code>insightSheets</code> — UI sheet tabs</li>
                                <li><code>insightPanels</code> — Visual panels</li>
                                <li><code>rJavaTranslator</code> — R environment</li>
                                <li><code>pyTranslator</code> — Python GAAS connection</li>
                                <li><code>roomId</code> — Associated Room (if any)</li>
                                <li><code>insightFolder</code> — Temp file storage</li>
                            </ul>
                        `
                    }
                )}
                ${C.code(`// Running Pixel on an Insight
public PixelRunner runPixel(String pixelString) {
    List<String> pixelList = new ArrayList<String>();
    pixelList.add(pixelString);
    return runPixel(pixelList);
}

public PixelRunner runPixel(PixelRunner runner, List<String> pixelList) {
    for (int i = 0; i < size; i++) {
        String pixelString = pixelList.get(i);
        classLogger.info("Pixel >>> {}", pixelString);
        try {
            runner.runPixel(pixelString, this);  // this = Insight
        } catch (SemossPixelException e) {
            // Handle errors
        }
    }
    return runner;
}`, 'java', 'prerna/om/Insight.java')}
            `
        },
        {
            id: "d3-room-what-is",
            title: "What is a Room?",
            content: `
                <h2>What is a Room?</h2>
                <p class="lead">A <span class="highlight">Room</span> is a persistent conversation thread with an LLM, storing message history and providing context for tool execution.</p>
                <p>Rooms are stored in the <code>MODEL_INFERENCE_LOGS_DB</code> database and survive server restarts.</p>
                ${C.code(`public class Room {
    private String room_id;           // Unique room identifier
    private String userId;            // Owner user ID
    private String roomName;          // Display name (auto-generated or set)
    private String projectId;         // Associated app/project
    private String modelId;           // Default LLM model
    private boolean isActive;         // Is this room active?
    private Timestamp createdAt;      // Creation timestamp
    private Timestamp updatedAt;      // Last modified timestamp

    private Insight insight;          // Associated Insight for execution context
    private List<AbstractMessage> messages = new ArrayList<>();  // Conversation history
    private String options;           // JSON: tools, workspace, system prompt

    public ResponseMessage ask(InputMessage msg, IModelEngine modelEngine) {
        // Add message to history
        messages.add(msg);

        // Build message history JSON
        String messageJsonString = MessageUtils.getMessageHistoryFromMessageId(
            this.messages, msg.getMessageId()
        );

        // Call LLM with full history
        AskModelEngineResponse llmResponse = modelEngine.askRoom(
            msg.getInputPrompt(), this, msg, kwArgMap
        );

        // Create response message and add to history
        ResponseMessage response = ResponseMessage.Builder
            .fromAskModelEngineResponse(llmResponse).build();
        messages.add(response);

        // Persist to database
        ModelInferenceLogsUtils.llm2_updateRoomMessages(
            room_id, userId, getMessagesAsString()
        );

        return response;
    }
}`, 'java', 'prerna/engine/impl/model/Room.java')}
            `
        },
        {
            id: "d3-room-insight-connection",
            title: "Room ↔ Insight Connection",
            content: `
                <h2>Room ↔ Insight Connection</h2>
                <p>Rooms and Insights are complementary: <strong>Rooms</strong> manage LLM conversation history, while <strong>Insights</strong> provide execution context for tools.</p>
                ${C.flow([
                    { title: 'User sends message to Room', desc: 'InputMessage with prompt text', accent: true, arrow: '↓' },
                    { title: 'Room calls LLM with history', desc: 'room.ask(message, modelEngine)', arrow: '↓ LLM decides to use a tool' },
                    { title: 'LLM returns tool_calls[]', desc: 'ResponseMessage with tool_calls metadata', arrow: '↓' },
                    { title: 'Room uses Insight to execute tool', desc: 'insight.runPixel(toolPixel) — runs in Insight context', accent: true, arrow: '↓' },
                    { title: 'Tool result added as InputMessage', desc: 'toolExecution message with result', arrow: '↓' },
                    { title: 'Room calls LLM again with result', desc: 'Full history including tool execution', arrow: '↓' },
                    { title: 'LLM generates final response', desc: 'ResponseMessage with final answer', accent: true },
                ])}
                ${C.callout('The <code>Insight</code> attached to a Room provides variable persistence, frame storage, and access to engines — essential for tool execution.', 'tip')}
            `
        },
        {
            id: "d3-session-management",
            title: "Session Management via API",
            content: `
                <h2>Session Management via API</h2>
                <p>The REST API uses <code>insightId</code> to bind requests to the correct Insight. The <code>InsightStore</code> is a singleton in-memory cache.</p>
                ${C.sequence(
                    ["Browser", "POST /api/engine/runPixel", "InsightStore.getInstance()", "Insight"],
                    [
                        { from: 0, to: 1, label: '{ "insightId": "abc-123", "expression": "..." }' },
                        { from: 1, to: 2, label: 'InsightStore.get("abc-123")' },
                        { from: 2, to: 3, label: "retrieve cached Insight" },
                        { from: 3, to: 2, label: "Insight object", type: "response" },
                        { from: 2, to: 1, label: "Insight object", type: "response" },
                        { from: 1, to: 3, label: "insight.runPixel(expression)" },
                        { from: 3, to: 1, label: "PixelRunner results", type: "response" },
                        { from: 1, to: 0, label: "JSON response", type: "response" },
                    ]
                )}
                ${C.split(
                    {
                        title: 'Creating a New Insight',
                        content: C.code(`POST /api/engine/runPixel
{
  "insightId": "new",
  "expression": "Echo(\\"Hello\\");"
}

// Response includes generated insightId
{
  "insightId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "pixelReturn": [...]
}`, 'http')
                    },
                    {
                        title: 'Using Existing Insight',
                        content: C.code(`POST /api/engine/runPixel
{
  "insightId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "expression": "myVar = \\"value\\";"
}

// Variables persist in this Insight
{
  "insightId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "pixelReturn": [...]
}`, 'http')
                    }
                )}
            `
        },
        {
            id: "d3-handson",
            title: "Hands-on: Manage Insights and Rooms",
            content: `
                <h2>Hands-on: Create and Manage Insights/Rooms via API</h2>
                ${C.handson('Insight and Room API exploration', `
                    <h4>Part 1: Create a temporary Insight and run Pixel</h4>
                    ${C.code(`// In browser console or Postman
const response = await fetch('http://localhost:8080/api/engine/runPixel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        insightId: "new",
        expression: "myVar = 42; Echo(myVar);"
    })
});

const data = await response.json();
console.log("InsightID:", data.insightId);
console.log("Result:", data.pixelReturn[0].output);`, 'javascript')}

                    <h4>Part 2: Reuse the same Insight</h4>
                    ${C.code(`// Use the insightId from Part 1
const response2 = await fetch('http://localhost:8080/api/engine/runPixel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        insightId: data.insightId,  // ← Same insight!
        expression: "Echo(myVar * 2);"  // myVar is still 42
    })
});

const data2 = await response2.json();
console.log("Result:", data2.pixelReturn[0].output);  // Should be 84`, 'javascript')}

                    <h4>Part 3: Inspect Insight state</h4>
                    ${C.code(`// Get all variables in the Insight
const varsResponse = await fetch('http://localhost:8080/api/engine/runPixel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        insightId: data.insightId,
        expression: "CurrentVariables();"
    })
});

const varsData = await varsResponse.json();
console.log("Variables:", varsData.pixelReturn[0].output);

// Drop the Insight (clean up)
await fetch('http://localhost:8080/api/engine/runPixel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        insightId: data.insightId,
        expression: "DropInsight();"
    })
});`, 'javascript')}

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Part 1: You should see <code>insightId</code> returned with <code>42</code> as the result</li>
                        <li>Part 2: The variable <code>myVar</code> persists, so you get <code>84</code></li>
                        <li>Part 3: All variables in the Insight are listed via <code>CurrentVariables()</code></li>
                    </ul>
                `)}
            `
        },
        {
            id: "d3-summary",
            title: "Summary",
            content: `
                <h2>Summary: Insights, Rooms, and Sessions</h2>
                ${C.table(
                    ["Concept", "Purpose", "Lifetime", "Storage", "Key Properties"],
                    [
                        [
                            "Insight",
                            "Execution context for Pixel",
                            "In-memory (session)",
                            "InsightStore (RAM)",
                            "<code>insightId</code>, <code>varStore</code>, <code>pixelList</code>, <code>taskStore</code>"
                        ],
                        [
                            "Room",
                            "Persistent LLM conversation",
                            "Permanent (until deleted)",
                            "MODEL_INFERENCE_LOGS_DB",
                            "<code>room_id</code>, <code>messages[]</code>, <code>insight</code>, <code>options</code>"
                        ],
                        [
                            "Session",
                            "HTTP session binding",
                            "Browser session",
                            "HTTP session + InsightStore",
                            "<code>sessionId</code> cookie, <code>insightId</code> mapping"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Insights</strong> are stateful execution contexts — variables, frames, and Pixel history persist within them</li>
                    <li><strong>Rooms</strong> provide persistent LLM conversation history with tool execution support via an attached Insight</li>
                    <li><strong>Sessions</strong> bind users to their active Insights through the <code>InsightStore</code> singleton</li>
                    <li>Insights are <strong>temporary by default</strong> — they're lost on server restart unless explicitly saved</li>
                    <li>Rooms are <strong>persistent</strong> — stored in the database and survive restarts</li>
                    <li>The <code>insightId</code> is the <strong>primary key</strong> for managing state across REST API calls</li>
                    <li>Rooms use Insights to execute tools, giving LLMs access to data, engines, and application state</li>
                </ul>
                ${C.callout(`Understanding Insights and Rooms is critical for building stateful ${CONFIG.productName} apps — whether you're managing user sessions, implementing LLM chat, or building multi-step workflows.`, 'tip')}
            `
        }
    ]
};
