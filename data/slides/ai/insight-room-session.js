// Topic: Insight / Room / Session
const slides_insight_room_session = [
        {
            id: "insight-title",
            title: "Insight / Room / Session",
            content: C.titleSlide(
                "Insight / Room / Session",
                `Understanding state management, collaboration, and persistence in ${CONFIG.productName}`,
                "105 minutes"
            )
        },
        {
            id: "insight-what-is",
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
            id: "insight-architecture",
            title: "Architecture Overview",
            content: `
                <h2>Insight / Room / Session Architecture</h2>
                <p>Understanding how these three components work together is key to building stateful ${CONFIG.productName} applications.</p>
                ${C.layers([
                    { label: "HTTP Layer", items: [
                        { title: "Browser", desc: "Holds sessionId cookie" },
                        { title: "REST API", desc: "Receives insightId in requests" },
                    ]},
                    { label: "Session Management", items: [
                        { title: "InsightStore", desc: "Singleton map: insightId → Insight" },
                        { title: "RoomUtils", desc: "Manages Room persistence" },
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
            id: "insight-lifecycle",
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
            id: "insight-state",
            title: "What's Inside an Insight?",
            content: `
                <h2>What's Inside an Insight?</h2>
                <p>An Insight maintains a rich set of state to support complex, multi-step workflows.</p>
                ${C.split(
                    {
                        title: 'Core State',
                        content: `
                            <ul>
                                <li><code>insightId</code>  -  UUID identifier</li>
                                <li><code>user</code>  -  User object (auth context)</li>
                                <li><code>projectId</code>  -  Associated app/project</li>
                                <li><code>varStore</code>  -  Variable assignments</li>
                                <li><code>pixelList</code>  -  Pixel execution history</li>
                                <li><code>taskStore</code>  -  Async task tracking</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Advanced State',
                        content: `
                            <ul>
                                <li><code>insightSheets</code>  -  UI sheet tabs</li>
                                <li><code>insightPanels</code>  -  Visual panels</li>
                                <li><code>rJavaTranslator</code>  -  R environment</li>
                                <li><code>pyTranslator</code>  -  Python GAAS connection</li>
                                <li><code>roomId</code>  -  Associated Room (if any)</li>
                                <li><code>insightFolder</code>  -  Temp file storage</li>
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
            id: "room-what-is",
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
            id: "message-parts-architecture",
            title: "Message Parts Architecture (Schema v2)",
            content: `
                <h2>Message Parts Architecture (Schema v2)</h2>
                <p class="lead">Modern ${CONFIG.productName} messages use a <span class="highlight">composable parts[] architecture</span> instead of legacy flat fields. This enables multimodal content, tool calling, and thinking tokens in a single message.</p>

                ${C.split(
                    {
                        title: 'Legacy Schema v1 (Flat Fields)',
                        content: `
                            <p><strong>Old approach</strong>: Each message had separate flat fields for different content types:</p>
                            ${C.code(`{
  "type": "user",
  "content": "Analyze this image",
  "imageInfos": [{...}],           // Images separate
  "tool_responses": [{...}],       // Tool results separate
  // No support for thinking tokens
}`, 'json')}
                            <p><strong>Problems</strong>:</p>
                            <ul>
                                <li>Hard to mix text + images + tool calls</li>
                                <li>No support for thinking tokens (o1-style reasoning)</li>
                                <li>Difficult to customize UI text vs LLM text</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Modern Schema v2 (Parts Array)',
                        content: `
                            <p><strong>New approach</strong>: Messages contain a <code>parts[]</code> array of composable message parts:</p>
                            ${C.code(`{
  "schemaVersion": 2,
  "io": "input",
  "parts": [
    {"type": "TEXT", "text": "Analyze this image"},
    {"type": "MEDIA", "mediaInfo": {...}},
    {"type": "TOOL_CALL", "toolCall": {...}}
  ]
}`, 'json')}
                            <p><strong>Benefits</strong>:</p>
                            <ul>
                                <li>✅ Composable: Mix any combination of parts</li>
                                <li>✅ Multimodal: Text + images + audio + video</li>
                                <li>✅ Tool calling: ToolCall + ToolResult parts</li>
                                <li>✅ Thinking tokens: ThinkingMessagePart for o1-style models</li>
                            </ul>
                        `
                    }
                )}

                ${C.code(`public abstract class AbstractMessage {
        /**
     * Latest supported message JSON schema version for persisted room messages.
     */
    public static final int LATEST_SCHEMA_VERSION = 2;

        /**
     * Message JSON schema version.
     * Version 1 = legacy flat message fields (type/content/imageInfos/tool_responses...)
     * Version 2 = parts-based schema via parts[]
     */
    @SerializedName("schemaVersion")
    protected Integer schemaVersion;

        /**
     * Discriminator to support clean deserialization into InputMessage vs ResponseMessage
     */
    @SerializedName("io")
    protected MessageIO io;  // INPUT or OUTPUT

    @SerializedName("parts")
    protected List<MessagePart> parts = new ArrayList<>();  // ← The new architecture!

    protected String modelId;
    protected String messageId;
    protected String parentMessageId;
    // ... other fields
}`, 'java', 'prerna/engine/impl/model/message/AbstractMessage.java')}

                ${C.callout(`All new ${CONFIG.productName} code uses <strong>schemaVersion: 2</strong> with parts[]. Legacy messages with schemaVersion: 1 are still supported for backwards compatibility but should be migrated.`, 'tip')}
            `
        },
        {
            id: "message-part-types",
            title: "Message Part Types",
            content: `
                <h2>Message Part Types</h2>
                <p>The <code>parts[]</code> array can contain six different types of message parts, each with specific fields and use cases:</p>

                ${C.code(`public enum MessagePartType {
    TEXT,         // Text content (with optional UI text)
    MEDIA,        // Images, video, audio
    TOOL_CALL,    // LLM requesting tool execution
    TOOL_RESULT,  // Result from tool execution
    THINKING,     // LLM reasoning process (o1-style)
    SYSTEM,       // System-level instructions
    UNKNOWN       // Fallback for unrecognized types
}`, 'java', 'prerna/engine/impl/model/message/MessagePartType.java')}

                ${C.cards([
                    {
                        badge: 'TEXT',
                        title: 'TextMessagePart',
                        desc: '<strong>Fields</strong>: <code>text</code> (what LLM sees), <code>uiText</code> (what user sees)<br><strong>Use case</strong>: Normal conversation text. Use <code>uiText</code> to show simplified text in UI while LLM gets full context.'
                    },
                    {
                        badge: 'MEDIA',
                        title: 'MediaMessagePart',
                        desc: '<strong>Fields</strong>: <code>mediaInfo</code> (MessageInputMedia with URL, type, base64)<br><strong>Use case</strong>: Images, video, audio in multimodal conversations. LLM can analyze visual content.'
                    },
                    {
                        badge: 'TOOL_CALL',
                        title: 'ToolCallMessagePart',
                        desc: '<strong>Fields</strong>: <code>toolCall</code> (Map with id, name, arguments)<br><strong>Use case</strong>: LLM requests tool execution. Room extracts this and calls Insight.runPixel() to execute.'
                    },
                    {
                        badge: 'TOOL_RESULT',
                        title: 'ToolResultMessagePart',
                        desc: '<strong>Fields</strong>: <code>toolResult</code> (ToolResultPart with toolCallId, toolName, output, toolParameterValues, toolStatus)<br><strong>Use case</strong>: Result from tool execution sent back to LLM. Room adds this after Insight executes the tool.'
                    },
                    {
                        badge: 'THINKING',
                        title: 'ThinkingMessagePart',
                        desc: '<strong>Fields</strong>: <code>thinking</code> (String with reasoning process)<br><strong>Use case</strong>: LLM reasoning tokens (o1-style models). Shows how the model arrived at its answer.'
                    },
                    {
                        badge: 'SYSTEM',
                        title: 'SystemMessagePart',
                        desc: '<strong>Fields</strong>: <code>prompt</code> (String with system-level instructions)<br><strong>Use case</strong>: System prompts, meta-instructions that guide LLM behavior without appearing in conversation.'
                    },
                ])}

                <h3>Example: TextMessagePart with UI Customization</h3>
                ${C.code(`public class TextMessagePart extends MessagePart {

    @SerializedName("text")
    private String text;  // What the LLM sees

        /**
     * Optional UI-only text (legacy inputUIPrompt) when text differs.
     */
    @SerializedName("uiText")
    private String uiText;  // What the user sees in the UI

    public TextMessagePart(String text, String uiText) {
        super(MessagePartType.TEXT);
        this.text = text;
        this.uiText = (uiText == null || uiText.isEmpty()) ? text : uiText;
    }

    // Example usage:
    // LLM sees: "Execute PixelQuery(database='MyDB', query='SELECT * FROM users');"
    // UI shows: "Query the database for user records"
}`, 'java', 'prerna/engine/impl/model/message/TextMessagePart.java')}

                ${C.callout('<strong>Why this matters</strong>: Understanding message parts is essential for:<ul><li>Building multimodal chat UIs (MediaMessagePart)</li><li>Debugging tool execution flows (ToolCallMessagePart + ToolResultMessagePart)</li><li>Customizing what users see vs what LLMs see (TextMessagePart.uiText)</li><li>Supporting o1-style reasoning models (ThinkingMessagePart)</li></ul>', 'tip')}
            `
        },
        {
            id: "room-insight-connection",
            title: "Room ↔ Insight Connection",
            content: `
                <h2>Room ↔ Insight Connection</h2>
                <p>Rooms and Insights are complementary: <strong>Rooms</strong> manage LLM conversation history, while <strong>Insights</strong> provide execution context for tools.</p>
                ${C.flow([
                    { title: 'User sends message to Room', desc: 'InputMessage with prompt text', arrow: '↓' },
                    { title: 'Room calls LLM with history', desc: 'room.ask(message, modelEngine)', arrow: '↓ LLM decides to use a tool' },
                    { title: 'LLM returns tool_calls[]', desc: 'ResponseMessage with tool_calls metadata', arrow: '↓' },
                    { title: 'Room uses Insight to execute tool', desc: 'insight.runPixel(toolPixel)  -  runs in Insight context', arrow: '↓' },
                    { title: 'Tool result added as InputMessage', desc: 'toolExecution message with result', arrow: '↓' },
                    { title: 'Room calls LLM again with result', desc: 'Full history including tool execution', arrow: '↓' },
                    { title: 'LLM generates final response', desc: 'ResponseMessage with final answer' },
                ])}
                ${C.callout('The <code>Insight</code> attached to a Room provides variable persistence, frame storage, and access to engines  -  essential for tool execution.', 'tip')}
            `
        },
        {
            id: "session-management",
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
            id: "summary",
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
                    <li><strong>Insights</strong> are stateful execution contexts  -  variables, frames, and Pixel history persist within them</li>
                    <li><strong>Rooms</strong> provide persistent LLM conversation history with tool execution support via an attached Insight</li>
                    <li><strong>Sessions</strong> bind users to their active Insights through the <code>InsightStore</code> singleton</li>
                    <li>Insights are <strong>temporary by default</strong>  -  they're lost on server restart unless explicitly saved</li>
                    <li>Rooms are <strong>persistent</strong>  -  stored in the database and survive restarts</li>
                    <li>The <code>insightId</code> is the <strong>primary key</strong> for managing state across REST API calls</li>
                    <li>Rooms use Insights to execute tools, giving LLMs access to data, engines, and application state</li>
                </ul>
                ${C.callout(`Understanding Insights and Rooms is critical for building stateful ${CONFIG.productName} apps  -  whether you're managing user sessions, implementing LLM chat, or building multi-step workflows.`, 'tip')}
            `
        }
    ];
