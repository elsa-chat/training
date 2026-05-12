// Topic: Message Structure
const slides_message_structure = [
        {
            id: "msg-title",
            title: "Message Structure",
            content: `
                <h2>Message Structure in ${CONFIG.productName}</h2>
                <p class="lead">${CONFIG.productName} uses <span class="highlight">AbstractMessage</span> (package <code>prerna.engine.impl.model.message</code>) as the core abstraction for LLM communication.</p>
                <p>This chapter covers the message implementation used for conversational AI, model logs, and persistent chat history.</p>
                ${C.flow([
                    { title: 'AbstractMessage', desc: 'Base class with messageId (UUID v7), modelId, tokens, ornaments' },
                    { title: 'MessageType Enum', desc: 'INPUT_TEXT, INPUT_MEDIA, INPUT_TOOL_EXEC, RESPONSE_TEXT, RESPONSE_TOOL, RESPONSE_MEDIA', arrow: '↓' },
                    { title: 'InputMessage', desc: 'User/system prompts, tool executions, media inputs', arrow: 'extends AbstractMessage' },
                    { title: 'ResponseMessage', desc: 'LLM responses (text, tools, media) with Builder pattern', arrow: 'extends AbstractMessage' },
                ])}
                ${C.callout(`<strong>Key insight:</strong> Every LLM interaction in ${CONFIG.productName} creates AbstractMessage instances that are persisted to the model logs database. This enables conversation history, feedback tracking, and token accounting.`, 'info')}
                <p><strong>Time allocation:</strong> 90 minutes</p>
            `
        },
        {
            id: "msg-abstractmessage",
            title: "AbstractMessage  -  Base Class",
            content: `
                <h2>AbstractMessage  -  The Foundation</h2>
                <p class="lead"><code>AbstractMessage</code> is the abstract base class that represents a single message in an LLM conversation.</p>
                <p>Every user prompt, system message, tool execution, and LLM response extends this class.</p>
                ${C.code(`public abstract class AbstractMessage implements Serializable {
    // Core identification
    protected String messageId;        // UUID v7 generated on creation
    protected String transactionId;    // Groups messages in a conversation
    protected String parentMessageId;  // For branching conversations

    // Model linkage
    protected String modelId;          // Engine ID of the LLM
    protected ModelTypeEnum modelType; // TEXT_GENERATION, EMBEDDINGS, etc.

    // Metadata
    protected Integer tokens;          // Token count for this message
    protected Boolean visible = true;  // Show in UI? (tool execs often hidden)
    protected Boolean platformGenerated = false;
    protected String feedback;         // User thumbs up/down
    protected ZonedDateTime dateCreated;  // UTC timestamp

    // Flexible metadata storage
    protected Map<String, Object> ornaments = new HashMap<>();

    // Constructor: creates UUID v7 messageId and sets dateCreated
    public AbstractMessage() {
        this.messageId = Utility.getRandomUUID7();
        this.dateCreated = ZonedDateTime.now(ZoneId.of("UTC"));
    }

    // Abstract method: subclasses define their type
    public abstract MessageType getMessageType();
}`, 'java', 'prerna/engine/impl/model/message/AbstractMessage.java')}
                <h3>Key Design Patterns</h3>
                ${C.cards([
                    { badge: 'UUID v7', title: 'Time-Ordered IDs', desc: 'messageId uses UUID v7 for sortable, unique identifiers' },
                    { badge: 'Ornaments', title: 'Flexible Metadata', desc: 'Map<String, Object> for RAG chunks, citations, custom data' },
                    { badge: 'Visibility', title: 'UI Control', desc: 'Tool executions set visible=false to hide internal messages' },
                    { badge: 'Transactions', title: 'Conversation Grouping', desc: 'transactionId links related messages together' },
                ])}
            `
        },
        {
            id: "msg-messagetype",
            title: "MessageType Enum",
            content: `
                <h2>MessageType  -  Classifying Messages</h2>
                <p>The <code>MessageType</code> enum defines the six types of messages in an LLM conversation.</p>
                ${C.code(`public enum MessageType {
    // Input message types (user → LLM)
    INPUT_TEXT,       // Plain text user prompt
    INPUT_MEDIA,      // User prompt with images/audio/video
    INPUT_TOOL_EXEC,  // Tool execution result fed back to LLM

    // Response message types (LLM → user)
    RESPONSE_TEXT,    // LLM text response
    RESPONSE_TOOL,    // LLM requesting tool execution
    RESPONSE_MEDIA;   // LLM generating media (images, audio)

    // Helper methods
    public boolean isResponseMessage() {
        return this == RESPONSE_TEXT || this == RESPONSE_TOOL || this == RESPONSE_MEDIA;
    }

    public boolean isInputMessage() {
        return this == INPUT_TEXT || this == INPUT_MEDIA || this == INPUT_TOOL_EXEC;
    }
}`, 'java', 'prerna/engine/impl/model/message/MessageType.java')}
                <h3>Message Flow Pattern</h3>
                ${C.sequence(
                    ["User", "InputMessage", "LLM", "ResponseMessage"],
                    [
                        { from: 0, to: 1, label: "INPUT_TEXT or INPUT_MEDIA" },
                        { from: 1, to: 2, label: "Send to model engine" },
                        { from: 2, to: 3, label: "RESPONSE_TEXT or RESPONSE_TOOL", type: "response" },
                        { from: 3, to: 1, label: "If RESPONSE_TOOL → INPUT_TOOL_EXEC" },
                        { from: 1, to: 2, label: "Continue conversation" },
                    ]
                )}
                ${C.callout('Tool execution creates a loop: LLM returns <code>RESPONSE_TOOL</code>, system executes tool, creates <code>INPUT_TOOL_EXEC</code> message, sends result back to LLM.', 'info')}
            `
        },
        {
            id: "msg-inputmessage",
            title: "InputMessage  -  User Input",
            content: `
                <h2>InputMessage  -  Capturing User Input</h2>
                <p class="lead"><code>InputMessage</code> extends <code>AbstractMessage</code> to represent input from the user (or system) to the LLM.</p>
                <p>It handles text prompts, system prompts, media inputs (images/audio/video), and tool execution results.</p>
                ${C.code(`public class InputMessage extends AbstractMessage {
    private String inputUIPrompt;      // User's original prompt
    private String inputPrompt;        // Effective prompt (may include RAG chunks)
    private String systemPrompt;       // System instructions
    private MessageType type;          // INPUT_TEXT, INPUT_MEDIA, INPUT_TOOL_EXEC

    // Tool execution fields (when type == INPUT_TOOL_EXEC)
    private String toolCallId;         // ID from LLM's tool request
    private String toolName;           // Name of tool that was executed
    private String toolStatus;         // "success" or "error"
    private Map<String, Object> toolParameterValues;

    // Media inputs (images, audio, video)
    private List<MessageInputMedia> mediaInputs;

    // Additional parameters (tools list, temperature, etc.)
    private Map<String, Object> paramMap;

    // Room reference (required by builder)
    Room room;

    @Override
    public MessageType getMessageType() {
        return type;
    }
}`, 'java', 'prerna/engine/impl/model/message/InputMessage.java')}
                <h3>Key Fields</h3>
                ${C.split(
                    {
                        title: 'Text Content',
                        content: `
                            <ul>
                                <li><code>inputUIPrompt</code>  -  Original user text</li>
                                <li><code>inputPrompt</code>  -  Augmented prompt (RAG chunks added)</li>
                                <li><code>systemPrompt</code>  -  System instructions</li>
                            </ul>
                        `
                    },
                    {
                        title: 'Tool Execution',
                        content: `
                            <ul>
                                <li><code>toolCallId</code>  -  Links to LLM's request</li>
                                <li><code>toolName</code>  -  Which tool ran</li>
                                <li><code>toolStatus</code>  -  "success" or "error"</li>
                                <li><code>toolParameterValues</code>  -  Tool inputs</li>
                            </ul>
                        `
                    }
                )}
            `
        },
        {
            id: "msg-responsemessage",
            title: "ResponseMessage  -  LLM Output",
            content: `
                <h2>ResponseMessage  -  LLM Responses</h2>
                <p class="lead"><code>ResponseMessage</code> extends <code>AbstractMessage</code> to represent output from the LLM.</p>
                <p>It captures text responses, tool calls, thinking traces, and media generation.</p>
                ${C.code(`public class ResponseMessage extends AbstractMessage {
    private String content;            // LLM's text response
    private String thinking;           // Claude extended thinking content
    private MessageType type;          // RESPONSE_TEXT, RESPONSE_TOOL, RESPONSE_MEDIA

    // Tool responses (when type == RESPONSE_TOOL)
    private List<Map<String, Object>> toolResponses;

    // Transient link to raw model response
    private transient AskModelEngineResponse<?> modelEngineResponse;

    @Override
    public MessageType getMessageType() {
        return type;
    }

    // Check if this response includes tool calls
    public boolean hasToolResponses() {
        return toolResponses != null && !toolResponses.isEmpty();
    }

    // Factory methods for common response types
    public static ResponseMessage text(String content) {
        return builder().withText(content).withType(MessageType.RESPONSE_TEXT).build();
    }

    public static ResponseMessage toolResponses(List<Map<String, Object>> toolResponses) {
        return builder().withToolResponses(toolResponses).build();
    }
}`, 'java', 'prerna/engine/impl/model/message/ResponseMessage.java')}
                <h3>Response Types</h3>
                ${C.cards([
                    { badge: 'RESPONSE_TEXT', title: 'Text Response', desc: 'LLM returns text content  -  most common type' },
                    { badge: 'RESPONSE_TOOL', title: 'Tool Call Request', desc: 'LLM wants to execute tool(s)  -  triggers tool execution loop' },
                    { badge: 'RESPONSE_MEDIA', title: 'Media Generation', desc: 'LLM generates images or audio (DALL-E, etc.)' },
                ])}
            `
        },
        {
            id: "msg-builder-pattern",
            title: "Builder Pattern",
            content: `
                <h2>Builder Pattern for Message Creation</h2>
                <p>Both <code>InputMessage</code> and <code>ResponseMessage</code> use the Builder pattern for flexible, readable construction.</p>
                ${C.split(
                    {
                        title: 'InputMessage Builder',
                        content: C.code(`// Create a text input message
InputMessage userMsg = InputMessage.builder(room)
    .withInputUIPrompt("What is the weather in Madrid?")
    .withSystemPrompt("You are a helpful assistant.")
    .withType(MessageType.INPUT_TEXT)
    .build();

// Create a multimodal input (text + image)
InputMessage multiModal = InputMessage.builder(room)
    .withInputUIPrompt("What's in this image?")
    .withMediaInput("/path/to/image.jpg", room)
    .build();  // Auto-detects INPUT_MEDIA

// Create a tool execution result
InputMessage toolResult = InputMessage.toolExecution(
    room,
    "call_abc123",           // toolCallId from LLM
    "get_weather",           // tool name
    "{\\"temp\\": 22, \\"condition\\": \\"sunny\\"}", // result
    toolParams,              // original parameters
    "success"                // status
);`, 'java')
                    },
                    {
                        title: 'ResponseMessage Builder',
                        content: C.code(`// Create a text response
ResponseMessage textResp = ResponseMessage.builder()
    .withText("The weather in Madrid is sunny, 22°C.")
    .withType(MessageType.RESPONSE_TEXT)
    .build();

// Create a tool call response
ResponseMessage toolResp = ResponseMessage.builder()
    .withToolResponses(toolCallsList)
    .build();  // Auto-sets RESPONSE_TOOL

// Create from AskModelEngineResponse
AskModelEngineResponse<?> llmResp = modelEngine.ask(...);
ResponseMessage fromLLM = ResponseMessage.Builder
    .fromAskModelEngineResponse(llmResp)
    .build();`, 'java')
                    }
                )}
                ${C.callout('<strong>Key insight:</strong> InputMessage requires a <code>Room</code> reference (enforced by builder), while ResponseMessage does not. This is because InputMessage needs room context for media handling.', 'info')}
            `
        },
        {
            id: "msg-model-logs",
            title: "Persistence to Model Logs",
            content: `
                <h2>Model Logs Database  -  Conversation History</h2>
                <p class="lead">Every <code>AbstractMessage</code> instance is persisted to the <strong>model logs database</strong>, creating a permanent conversation history.</p>
                <p>This enables features like conversation replay, feedback tracking, token accounting, and RAG chunk auditing.</p>
                ${C.flow([
                    { title: 'User sends prompt', desc: 'InputMessage created with messageId (UUID v7)' },
                    { title: 'Saved to model_logs table', desc: 'Row inserted with all fields serialized to JSON', arrow: '↓ INSERT' },
                    { title: 'LLM responds', desc: 'ResponseMessage created, linked via transactionId' },
                    { title: 'Saved to model_logs table', desc: 'Another row inserted', arrow: '↓ INSERT' },
                    { title: 'Conversation continues', desc: 'Each message = one row in model_logs' },
                ])}
                ${C.code(`-- Model logs table schema (simplified)
CREATE TABLE model_logs (
    message_id VARCHAR PRIMARY KEY,     -- UUID v7 from AbstractMessage
    transaction_id VARCHAR,             -- Groups conversation messages
    parent_message_id VARCHAR,          -- For branching
    model_id VARCHAR,                   -- Engine ID
    message_type VARCHAR,               -- INPUT_TEXT, RESPONSE_TEXT, etc.
    content TEXT,                       -- Message content (JSON serialized)
    tokens INTEGER,                     -- Token count
    visible BOOLEAN,                    -- Show in UI?
    feedback VARCHAR,                   -- User thumbs up/down
    date_created TIMESTAMP,             -- UTC timestamp
    ornaments TEXT                      -- JSON metadata (RAG chunks, etc.)
);

-- Query all messages in a conversation
SELECT * FROM model_logs
WHERE transaction_id = 'abc-123-def'
ORDER BY date_created ASC;`, 'sql', 'Model logs schema and query')}
                ${C.callout(`The model logs database is the single source of truth for all LLM conversations in ${CONFIG.productName}. It enables conversation replay, debugging, and analytics.`, 'info')}
            `
        },
        {
            id: "msg-ornaments",
            title: "Ornaments  -  Flexible Metadata",
            content: `
                <h2>Ornaments Pattern  -  Flexible Metadata Storage</h2>
                <p class="lead">The <code>ornaments</code> field in <code>AbstractMessage</code> is a <code>Map&lt;String, Object&gt;</code> that stores flexible metadata.</p>
                <p>This pattern enables extensibility without adding new fields to the base class.</p>
                ${C.code(`// AbstractMessage.java - Ornaments field and methods
protected Map<String, Object> ornaments = new HashMap<>();

public void setOrnament(String key, Object value) {
    if (this.ornaments == null) {
        this.ornaments = new HashMap<>();
    }
    this.ornaments.put(key, value);
}

public Object getOrnament(String key) {
    if (this.ornaments == null) {
        return null;
    }
    return this.ornaments.get(key);
}

public Map<String, Object> getOrnaments() {
    return this.ornaments;
}`, 'java', 'prerna/engine/impl/model/message/AbstractMessage.java')}
                <h3>Common Ornament Keys</h3>
                ${C.table(
                    ['Key', 'Purpose', 'Value Type', 'Example'],
                    [
                        ['<code>chunks</code>', 'RAG document chunks', 'List&lt;Map&gt;', 'Retrieved passages from vector DB'],
                        ['<code>citations</code>', 'Source citations', 'List&lt;String&gt;', 'Document references for factual claims'],
                        ['<code>context</code>', 'Additional context', 'String', 'Extra information not in main prompt'],
                        ['<code>metadata</code>', 'Custom app data', 'Map', 'Application-specific metadata'],
                        ['<code>cost</code>', 'API cost tracking', 'Double', 'Dollar cost of this message'],
                    ]
                )}
                ${C.code(`// Example: Adding RAG chunks to InputMessage
InputMessage msg = InputMessage.builder(room)
    .withInputUIPrompt("What is ${CONFIG.productName}?")
    .withRAGChunks(retrievedChunks)  // Uses setOrnament("chunks", ...)
    .build();

// Example: Adding custom metadata to ResponseMessage
ResponseMessage resp = ResponseMessage.builder()
    .withText("${CONFIG.productName} is a platform for...")
    .withMetadata("source", "documentation")  // Uses setOrnament(...)
    .build();`, 'java', 'Using ornaments in practice')}
                ${C.callout('The ornaments pattern allows custom reactors and apps to attach domain-specific metadata without modifying the core AbstractMessage class.', 'tip')}
            `
        },
        {
            id: "msg-summary",
            title: "Summary",
            content: `
                <h2>Summary: AbstractMessage System</h2>
                ${C.table(
                    ["Class", "Purpose", "Key Fields", "MessageType Values"],
                    [
                        [
                            "<code>AbstractMessage</code>",
                            "Base class for all LLM messages",
                            "messageId (UUID v7), transactionId, modelId, tokens, ornaments",
                            "Abstract  -  defined by subclasses"
                        ],
                        [
                            "<code>InputMessage</code>",
                            "User/system input to LLM",
                            "inputUIPrompt, systemPrompt, mediaInputs, toolCallId",
                            "INPUT_TEXT, INPUT_MEDIA, INPUT_TOOL_EXEC"
                        ],
                        [
                            "<code>ResponseMessage</code>",
                            "LLM output to user",
                            "content, thinking, toolResponses",
                            "RESPONSE_TEXT, RESPONSE_TOOL, RESPONSE_MEDIA"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>AbstractMessage</strong> is the foundation of all LLM conversations in ${CONFIG.productName}</li>
                    <li><strong>MessageType enum</strong> defines 6 message types (3 input, 3 response)</li>
                    <li><strong>Builder pattern</strong> enables flexible, readable message construction</li>
                    <li><strong>Model logs database</strong> persists every message for conversation history</li>
                    <li><strong>Ornaments</strong> provide extensible metadata without schema changes</li>
                    <li><strong>UUID v7</strong> messageIds ensure time-ordered, globally unique identifiers</li>
                    <li><strong>Tool execution loop</strong>: RESPONSE_TOOL → tool execution → INPUT_TOOL_EXEC → continue</li>
                </ul>
                ${C.callout(`Understanding AbstractMessage is essential for debugging LLM conversations, building custom message handlers, and integrating external AI systems with ${CONFIG.productName}.`, 'tip')}
            `
        }
    ];
