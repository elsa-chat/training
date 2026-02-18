// Day 3, Chapter 4: API Endpoints (105 min)
const day3_ch04 = {
    title: "API Endpoints",
    slides: [
        {
            id: "d3-api-title",
            title: "API Endpoints",
            content: C.titleSlide(
                "API Endpoints",
                `How External Clients Call ${CONFIG.productName} via OpenAI and Anthropic APIs`,
                "105 minutes"
            )
        },
        {
            id: "d3-api-overview",
            title: `Overview: ${CONFIG.productName} as an API Provider`,
            content: `
                <h2>Overview: ${CONFIG.productName} as an API Provider</h2>
                <p class="lead">${CONFIG.productName} implements <span class="highlight">OpenAI-compatible</span> and <span class="highlight">Anthropic-compatible</span> API endpoints, allowing external clients to interact with ${CONFIG.productName} models using standard commercial API formats.</p>
                <p>This enables tools like Claude Code CLI, OpenAI SDK clients, LangChain, and custom applications to connect to ${CONFIG.productName} without modification.</p>
                ${C.cards([
                    { badge: 'Endpoint', title: 'OpenAI API', desc: 'Compatible with OpenAI SDK clients: /v1/chat/completions, /completions, /embeddings, /models' },
                    { badge: 'Endpoint', title: 'Anthropic API', desc: 'Compatible with Anthropic SDK: /v1/messages with full Messages API format' },
                    { badge: 'Use Case', title: 'Claude Code CLI', desc: `Connect Claude Code to ${CONFIG.productName} by configuring base URL to point to your ${CONFIG.productName} instance` },
                    { badge: 'Use Case', title: 'Custom Apps', desc: `Build applications using OpenAI/Anthropic SDKs that call ${CONFIG.productName} models instead of commercial APIs` },
                ])}
                ${C.callout(`${CONFIG.productName} API endpoints are <strong>inbound</strong> — they accept requests FROM external clients and route them to configured model engines. This is different from configuring engines to call external APIs.`, 'info')}
            `
        },
        {
            id: "d3-api-architecture",
            title: "API Request Architecture",
            content: `
                <h2>API Request Architecture</h2>
                <p>When an external client sends a request to ${CONFIG.productName} API endpoints, the request flows through authentication, endpoint handling, Room creation, and model execution.</p>
                ${C.flow([
                    { title: 'External Client', desc: 'OpenAI SDK, Anthropic SDK, Claude Code CLI, curl, etc.', accent: true, arrow: '↓' },
                    { title: 'HTTP Request', desc: 'POST /model/openai/v1/chat/completions OR /model/anthropic/v1/messages', arrow: '↓' },
                    { title: 'OpenAIFilter', desc: 'Authenticate using Bearer token (access_key:secret_key)', arrow: '↓' },
                    { title: 'OpenAIEndpoints / AnthropicEndpoints', desc: 'Parse request, extract model ID, messages, parameters', accent: true, arrow: '↓' },
                    { title: 'Room Creation', desc: 'RoomUtils.createRoomIfNotExists(roomId, insight, engine)', arrow: '↓' },
                    { title: 'Format Translation', desc: 'Convert OpenAI/Anthropic format → InputMessage (AbstractMessage)', arrow: '↓' },
                    { title: 'Model Execution', desc: 'room.ask(InputMessage, engine) → IModelEngine.askRoom()', arrow: '↓' },
                    { title: 'Response Translation', desc: 'AskModelEngineResponse → OpenAI/Anthropic response format', arrow: '↓' },
                    { title: 'HTTP Response', desc: 'JSON (or SSE stream) in OpenAI/Anthropic format', accent: true },
                ])}
                ${C.callout(`The <code>model</code> parameter in the API request is the <strong>engine ID</strong> of a configured ${CONFIG.productName} model engine. ${CONFIG.productName} looks up the engine and routes the request to it.`, 'tip')}
            `
        },
        {
            id: "d3-api-authentication",
            title: "Authentication: OpenAIFilter",
            content: `
                <h2>Authentication: OpenAIFilter</h2>
                <p>${CONFIG.productName} uses the <code>OpenAIFilter</code> servlet filter to authenticate API requests using ${CONFIG.productName} user access keys.</p>
                <p>The filter intercepts requests and validates the <code>Authorization</code> header in a special format compatible with OpenAI SDK clients.</p>
                ${C.code(`// OpenAIFilter.java - Authentication flow
public class OpenAIFilter implements Filter {
    @Override
    public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain arg2)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) arg0;
        HttpSession session = request.getSession(false);
        User user = null;

        // Check if user already has a session
        if (session != null) {
            user = (User) session.getAttribute(Constants.SESSION_USER);
        }

        if (user != null) {
            arg2.doFilter(arg0, arg1);
            return;
        }

        // Extract Bearer token from Authorization header
        String authValue = request.getHeader("Authorization");
        if (authValue != null && authValue.startsWith("Bearer")) {
            String bearerToken = authValue.substring("Bearer".length()).trim();

            // SEMOSS format: "access_key:secret_key"
            // OpenAI SDK sets this as Bearer token
            if (bearerToken != null && !bearerToken.isEmpty()) {
                String[] split = bearerToken.split(":");
                if (split != null && split.length == 2) {
                    String accessKey = split[0];
                    String secretKey = split[1];

                    // Validate keys and retrieve user
                    user = SecurityUserAccessKeyUtils.validateKeysAndReturnUser(accessKey, secretKey);

                    if (user != null && token != null) {
                        // Create session and attach user
                        session = request.getSession(true);
                        session.setAttribute(Constants.SESSION_USER, user);
                        session.setAttribute(Constants.SESSION_USER_ID_LOG, token.getId());
                    }
                }
            }
        }

        // Continue filter chain (NoUserInSessionFilter will catch unauthorized)
        arg2.doFilter(requestWrapper, arg1);
    }
}`, 'java', 'prerna/web/conf/OpenAIFilter.java')}
                ${C.callout(`To authenticate with ${CONFIG.productName} API endpoints, format your Bearer token as <code>access_key:secret_key</code>. Generate access/secret keys in ${CONFIG.productName} Admin UI under User Management.`, 'tip')}
            `
        },
        {
            id: "d3-api-openai-endpoints",
            title: "OpenAI-Compatible Endpoints",
            content: `
                <h2>OpenAI-Compatible Endpoints</h2>
                <p>${CONFIG.productName} implements OpenAI-compatible REST endpoints at <code>/model/openai/*</code> using JAX-RS resource classes.</p>
                ${C.table(
                    ["Endpoint", "Method", "OpenAI Equivalent", "Purpose"],
                    [
                        [
                            "<code>/model/openai/v1/chat/completions</code>",
                            "POST",
                            "/v1/chat/completions",
                            "Chat completion with conversation history, tools, streaming"
                        ],
                        [
                            "<code>/model/openai/v1/responses</code>",
                            "POST",
                            "N/A (SEMOSS extension)",
                            "Codex-style sticky-state streaming for app builders"
                        ],
                        [
                            "<code>/model/openai/completions</code>",
                            "POST",
                            "/v1/completions",
                            "Legacy text completion (single prompt, no history)"
                        ],
                        [
                            "<code>/model/openai/embeddings</code>",
                            "POST",
                            "/v1/embeddings",
                            "Generate embeddings for text (vector search, RAG)"
                        ],
                        [
                            "<code>/model/openai/models</code>",
                            "GET",
                            "/v1/models",
                            "List all model engines user has access to"
                        ],
                        [
                            "<code>/model/openai/models/{id}</code>",
                            "GET",
                            "/v1/models/{id}",
                            "Get details for a specific model engine"
                        ]
                    ]
                )}
                ${C.code(`// OpenAIEndpoints.java - Chat completions endpoint
@Path("/model/openai")
@PermitAll
public class OpenAIEndpoints {

    @POST
    @Path("/v1/chat/completions")
    @Consumes({ "application/json" })
    @Produces({ "application/json;charset=utf-8", "text/event-stream" })
    public Response runV1ModelChatCompletion(@Context HttpServletRequest request) {
        return runModelChatCompletion(request);
    }

    @POST
    @Path("/chat/completions")
    @Consumes({ "application/json" })
    @Produces({ "application/json;charset=utf-8", "text/event-stream" })
    public Response runModelChatCompletion(@Context HttpServletRequest request) {
        // 1. Extract user from session (set by OpenAIFilter)
        // 2. Parse JSON request body
        // 3. Extract model ID, messages, stream flag
        // 4. Create/retrieve Room
        // 5. Execute model request
        // 6. Return OpenAI-formatted response (JSON or SSE stream)
    }
}`, 'java', 'prerna/semoss/web/services/local/OpenAIEndpoints.java')}
                ${C.callout(`${CONFIG.productName} OpenAI endpoints accept the same request format as OpenAI API, but the <code>model</code> parameter is the <strong>${CONFIG.productName} engine ID</strong>, not an OpenAI model name like "gpt-4".`, 'info')}
            `
        },
        {
            id: "d3-api-anthropic-endpoints",
            title: "Anthropic-Compatible Endpoints",
            content: `
                <h2>Anthropic-Compatible Endpoints</h2>
                <p>${CONFIG.productName} implements Anthropic Messages API at <code>/model/anthropic/v1/messages</code>, enabling Claude Code CLI and Anthropic SDK clients to connect.</p>
                ${C.split(
                    {
                        title: 'Anthropic Messages API Endpoint',
                        content: C.code(`// AnthropicEndpoints.java
@Path("/model/anthropic")
@PermitAll
public class AnthropicEndpoints {

    @POST
    @Path("/v1/messages")
    @Consumes({ "application/json" })
    @Produces({ "application/json;charset=utf-8", "text/event-stream" })
    public Response createMessage(@Context HttpServletRequest request) {
        // 1. Authenticate user (via OpenAIFilter)
        // 2. Parse Anthropic Messages API request
        // 3. Extract: model, messages, system, tools, stream
        // 4. Create/retrieve Room
        // 5. Translate Anthropic format → OpenAI format → InputMessage
        // 6. Execute: room.ask(InputMessage, engine)
        // 7. Translate response → Anthropic Messages API format
        // 8. Return JSON or SSE stream

        boolean isStreamingRequest = Boolean.parseBoolean(
            dataMap.getOrDefault("stream", false).toString()
        );

        if (!isStreamingRequest) {
            return handleNonStreamingRequest(engine, insight, room, msg, engineId);
        } else {
            return handleStreamingRequest(engine, insight, room, dataMap, sessionId, jobId, engineId);
        }
    }
}`, 'java', 'prerna/semoss/web/services/local/AnthropicEndpoints.java')
                    },
                    {
                        title: 'Anthropic Request Format',
                        content: C.code(`// Example Anthropic API request to SEMOSS
POST /model/anthropic/v1/messages
Authorization: Bearer <access_key>:<secret_key>
Content-Type: application/json

{
  "model": "abc-123-engine-id",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "What is SEMOSS?"
    }
  ],
  "system": "You are a helpful assistant.",
  "stream": false
}

// Response (Anthropic Messages API format)
{
  "id": "msg_01...",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "SEMOSS is a platform..."
    }
  ],
  "model": "abc-123-engine-id",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 48
  }
}`, 'json')
                    }
                )}
                ${C.callout(`Claude Code CLI connects to ${CONFIG.productName} by setting the base URL to your ${CONFIG.productName} instance: <code>export ANTHROPIC_BASE_URL="http://localhost:8080/model/anthropic"</code>`, 'tip')}
            `
        },
        {
            id: "d3-api-request-flow",
            title: "Request Flow: From API to Engine",
            content: `
                <h2>Request Flow: From API to Engine</h2>
                <p>The full request flow from external client to model engine and back involves several translation and routing steps.</p>
                ${C.sequence(
                    ["External Client", "OpenAIFilter", "OpenAIEndpoints", "Room", "IModelEngine"],
                    [
                        { from: 0, to: 1, label: "POST /v1/chat/completions" },
                        { from: 1, to: 1, label: "Validate Bearer token" },
                        { from: 1, to: 2, label: "Create session, attach user" },
                        { from: 2, to: 2, label: "Parse JSON request" },
                        { from: 2, to: 2, label: "Extract model ID, messages" },
                        { from: 2, to: 3, label: "RoomUtils.createRoomIfNotExists()" },
                        { from: 3, to: 2, label: "Room instance", type: "response" },
                        { from: 2, to: 2, label: "Build InputMessage" },
                        { from: 2, to: 3, label: "room.ask(InputMessage, engine)" },
                        { from: 3, to: 4, label: "engine.askRoom(question, room, msg, params)" },
                        { from: 4, to: 4, label: "Call provider API or Python GAAS" },
                        { from: 4, to: 3, label: "AskModelEngineResponse", type: "response" },
                        { from: 3, to: 2, label: "ResponseMessage", type: "response" },
                        { from: 2, to: 2, label: "Format as OpenAI JSON" },
                        { from: 2, to: 0, label: "HTTP 200 + JSON response", type: "response" },
                    ]
                )}
                ${C.code(`// OpenAIEndpoints.java - Main request handling flow
public Response runModelChatCompletion(@Context HttpServletRequest request) {
    // 1. Get authenticated user from session (set by OpenAIFilter)
    User user = (User) session.getAttribute(Constants.SESSION_USER);

    // 2. Parse request body to extract parameters
    Map<String, Object> dataMap = objectMapper.readValue(requestData, mapType);
    String engineId = (String) dataMap.remove("model");
    Object fullPrompt = dataMap.remove("messages");
    boolean isStreamingRequest = Boolean.parseBoolean(dataMap.get("stream").toString());

    // 3. Security check: can user access this engine?
    if (!SecurityEngineUtils.userCanViewEngine(user, engineId)) {
        return WebUtility.getResponse(errorMap, 403);
    }
    IModelEngine engine = Utility.getModel(engineId);

    // 4. Get or create Insight and Room
    String insightId = (String) dataMap.remove("insight_id");
    String roomId = (String) dataMap.remove("room_id");
    room = RoomUtils.createRoomIfNotExists(roomId, insight, engine, null);

    // 5. Build parameters for model call
    dataMap.put(AbstractModelEngine.FULL_PROMPT, fullPrompt);
    dataMap.put(AbstractModelEngine.APPEND_FULL_PROMPT, appendFullPrompt);

    // 6. Execute model request
    if (!isStreamingRequest) {
        InputMessage msg = InputMessage.builder(room)
            .withModelType(engine.getModelType())
            .withParamMap(dataMap)
            .build();
        ResponseMessage response = room.ask(msg, engine);
        AskModelEngineResponse llmResponse = response.getModelEngineResponse();

        // 7. Format response as OpenAI JSON
        Map<String, Object> processedResponse =
            OpenAIChatCompletionsHelper.processAskModelEngineResponse(engineId, llmResponse);
        return WebUtility.getResponse(processedResponse, 200);
    } else {
        // Handle streaming (covered in next slide)
    }
}`, 'java', 'prerna/semoss/web/services/local/OpenAIEndpoints.java:122')}
            `
        },
        {
            id: "d3-api-room-creation",
            title: "Room Creation from API Requests",
            content: `
                <h2>Room Creation from API Requests</h2>
                <p>When an API request comes in, ${CONFIG.productName} creates or retrieves a <span class="highlight">Room</span> to manage the conversation context and message history.</p>
                <p>The <code>room_id</code> parameter (optional) allows clients to maintain conversation continuity across multiple API calls.</p>
                ${C.code(`// OpenAIEndpoints.java - Room creation logic
String insightId = WebUtility.inputSanitizer((String) dataMap.remove("insight_id"));
if (insightId == null) {
    Set<String> sessionInsights = InsightStore.getInstance().getInsightIDsForSession(SESSION_ID);
    if (sessionInsights == null || sessionInsights.isEmpty()) {
        // Create new Insight
        insight = new Insight();
        InsightStore.getInstance().put(insight);
        insightId = insight.getInsightId();
        InsightStore.getInstance().addToSessionHash(SESSION_ID, insightId);
    } else {
        // Reuse existing Insight from session
        insightId = sessionInsights.iterator().next();
        insight = InsightStore.getInstance().get(insightId);
    }
} else {
    insight = InsightStore.getInstance().get(insightId);
    InsightStore.getInstance().addToSessionHash(SESSION_ID, insightId);
}

// Set user on Insight
insight.setUser(user);

// Create or retrieve Room
String roomId = WebUtility.inputSanitizer((String) dataMap.remove("room_id"));
room = RoomUtils.createRoomIfNotExists(roomId, insight, engine, null);`, 'java', 'prerna/semoss/web/services/local/OpenAIEndpoints.java:224-255')}
                ${C.callout('<strong>Insight</strong> = user session context. <strong>Room</strong> = conversation thread. One Insight can have multiple Rooms. The <code>room_id</code> parameter lets clients create separate conversations within the same session.', 'info')}
                ${C.code(`// Example API request with room_id (conversation continuity)
// First request - creates new room
POST /v1/chat/completions
{
  "model": "abc-123",
  "messages": [{"role": "user", "content": "What is SEMOSS?"}],
  "room_id": "my-conversation-1"
}

// Second request - continues same room (maintains history)
POST /v1/chat/completions
{
  "model": "abc-123",
  "messages": [{"role": "user", "content": "Tell me more"}],
  "room_id": "my-conversation-1"  // Same room = conversation history preserved
}`, 'json')}
            `
        },
        {
            id: "d3-api-format-translation",
            title: "Format Translation: API → AbstractMessage",
            content: `
                <h2>Format Translation: API → AbstractMessage</h2>
                <p>${CONFIG.productName} translates external API formats (OpenAI, Anthropic) into its internal <code>AbstractMessage</code> format, then translates responses back.</p>
                ${C.flow([
                    { title: 'OpenAI/Anthropic Request', desc: 'External client sends messages in commercial API format', accent: true, arrow: '↓' },
                    { title: 'Extract Messages', desc: 'Parse messages array from request JSON', arrow: '↓' },
                    { title: 'Build InputMessage', desc: 'InputMessage.builder(room).withParamMap(dataMap).build()', accent: true, arrow: '↓' },
                    { title: 'Set FULL_PROMPT', desc: 'dataMap.put(FULL_PROMPT, messages) — messages in OpenAI format', arrow: '↓' },
                    { title: 'Room.ask()', desc: 'Room receives InputMessage, converts to provider format', arrow: '↓' },
                    { title: 'Engine Execution', desc: 'IModelEngine.askRoom() calls provider API or Python GAAS', accent: true, arrow: '↓' },
                    { title: 'AskModelEngineResponse', desc: 'Unified response object with messageType, response, tokens', arrow: '↓' },
                    { title: 'Format Back to API', desc: 'OpenAIChatCompletionsHelper.processAskModelEngineResponse()', arrow: '↓' },
                    { title: 'Return to Client', desc: 'JSON in OpenAI or Anthropic format', accent: true },
                ])}
                ${C.split(
                    {
                        title: 'Building InputMessage',
                        content: C.code(`// OpenAIEndpoints.java - Create InputMessage
InputMessage msg = InputMessage.builder(room)
    .withModelType(engine.getModelType())
    .withParamMap(dataMap)  // Contains FULL_PROMPT with messages
    .build();

// dataMap already has FULL_PROMPT set
dataMap.put(AbstractModelEngine.FULL_PROMPT, fullPrompt);
dataMap.put(AbstractModelEngine.APPEND_FULL_PROMPT, appendFullPrompt);

// Room.ask() handles the rest
ResponseMessage response = room.ask(msg, engine);
AskModelEngineResponse llmResponse = response.getModelEngineResponse();`, 'java', 'prerna/semoss/web/services/local/OpenAIEndpoints.java:274-277')
                    },
                    {
                        title: 'Formatting Response Back',
                        content: C.code(`// OpenAIChatCompletionsHelper.java - Format response
public static Map<String, Object> processAskModelEngineResponse(
        String engineId, AskModelEngineResponse llmResponse) {

    Map<String, Object> llmResponseMap = new HashMap<>();
    llmResponseMap.put("id", llmResponse.getMessageId());
    llmResponseMap.put("model", engineId);
    llmResponseMap.put("object", "chat.completion");
    llmResponseMap.put("created", Instant.now().getEpochSecond());

    // Usage tokens
    Map<String, Object> usage = new HashMap<>();
    usage.put("completion_tokens", llmResponse.getNumberOfTokensInResponse());
    usage.put("prompt_tokens", llmResponse.getNumberOfTokensInPrompt());
    llmResponseMap.put("usage", usage);

    // Build choices array with message content
    Map<String, Object> message = new HashMap<>();
    message.put("content", llmResponse.getStringResponse());
    message.put("role", "assistant");

    Map<String, Object> choice = new HashMap<>();
    choice.put("finish_reason", "stop");
    choice.put("index", 0);
    choice.put("message", message);

    llmResponseMap.put("choices", List.of(choice));
    return llmResponseMap;
}`, 'java', 'prerna/semoss/web/services/local/OpenAIChatCompletionsHelper.java:234-320')
                    }
                )}
            `
        },
        {
            id: "d3-api-streaming",
            title: "Streaming Responses via SSE",
            content: `
                <h2>Streaming Responses via SSE</h2>
                <p>When <code>stream: true</code> is set, ${CONFIG.productName} returns responses as <span class="highlight">Server-Sent Events (SSE)</span> instead of a single JSON object.</p>
                <p>${CONFIG.productName} uses <code>PixelJobManager</code> to execute the model request asynchronously and poll for partial responses.</p>
                ${C.code(`// OpenAIEndpoints.java - Streaming response handling
if (isStreamingRequest) {
    classLogger.info("Starting streaming response for model: " + engineId);

    return Response.ok()
        .header("Content-Type", "text/event-stream")
        .header("Cache-Control", "no-cache")
        .header("Connection", "keep-alive")
        .entity(new StreamingOutput() {
            @Override
            public void write(OutputStream output) throws IOException {
                String messageId = "chatcmpl-" + JOB_ID;
                long creationTimestamp = Instant.now().getEpochSecond();
                String jobId = null;

                try (Writer writer = new BufferedWriter(new OutputStreamWriter(output))) {
                    // Start async Pixel job
                    jobId = startAsyncModelRequest(engine, finalInsight, finalRoom, dataMap, SESSION_ID);

                    boolean started = false;

                    // Poll for partial responses
                    STREAM_COMPLETE_LOOP: while (true) {
                        PixelJobThread jt = PixelJobManager.getManager().getJob(jobId);
                        List<Map<String, Object>> partialResponseContent =
                            PixelJobManager.getManager().getStreamOut(jobId);
                        PixelJobStatus jobStatus = jt == null ?
                            PixelJobStatus.UNKNOWN_JOB : jt.getPixelJobStatus();

                        if (partialResponseContent != null && partialResponseContent.size() > 0) {
                            for (Map<String, Object> streamObj : partialResponseContent) {
                                String streamType = (String) streamObj.get("stream_type");
                                Map<String, Object> dataMap = (Map<String, Object>) streamObj.get("data");

                                if (streamType.equalsIgnoreCase("content")) {
                                    if (dataMap.containsKey("finish_reason")) {
                                        String finishReason = (String) dataMap.get("finish_reason");
                                        OpenAIChatCompletionsHelper.writeFinishReason(
                                            engineId, messageId, creationTimestamp, finishReason, writer
                                        );
                                        break STREAM_COMPLETE_LOOP;
                                    } else {
                                        String newContent = (String) dataMap.get("content");
                                        if (newContent != null && !newContent.isEmpty()) {
                                            OpenAIChatCompletionsHelper.writeContentChunk(
                                                engineId, messageId, creationTimestamp,
                                                newContent, started, writer
                                            );
                                            started = true;
                                        }
                                    }
                                }
                            }
                        }

                        if (jobStatus == PixelJobStatus.PROGRESS_COMPLETE) {
                            break STREAM_COMPLETE_LOOP;
                        }

                        Thread.sleep(100);  // Poll every 100ms
                    }
                } finally {
                    if (jobId != null) {
                        PixelJobManager.getManager().clearJob(jobId);
                        PixelJobManager.getManager().removeJob(jobId);
                    }
                }
            }
        }).build();
}`, 'java', 'prerna/semoss/web/services/local/OpenAIEndpoints.java:288-433')}
                ${C.callout('Streaming uses <strong>polling</strong>, not native SSE push. The endpoint polls <code>PixelJobManager</code> every 100ms for new chunks from the Python GAAS layer or Java engine.', 'info')}
            `
        },
        {
            id: "d3-api-code-example",
            title: "Code Example: Full Request Handling",
            content: `
                <h2>Code Example: Full Request Handling</h2>
                <p>Here's how <code>OpenAIEndpoints.runModelChatCompletion()</code> handles a complete API request from start to finish.</p>
                ${C.code(`@POST
@Path("/v1/chat/completions")
@Consumes({ "application/json" })
@Produces({ "application/json;charset=utf-8", "text/event-stream" })
public Response runV1ModelChatCompletion(@Context HttpServletRequest request) {
    return runModelChatCompletion(request);
}

@POST
@Path("/chat/completions")
@Consumes({ "application/json" })
@Produces({ "application/json;charset=utf-8", "text/event-stream" })
public Response runModelChatCompletion(@Context HttpServletRequest request) {
    HttpSession session = request.getSession(false);
    User user = null;

    if (session != null) {
        user = ((User) session.getAttribute(Constants.SESSION_USER));
    }

    // Authentication check
    if (user == null) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put(Constants.ERROR_MESSAGE, "User session is invalid");
        return WebUtility.getResponse(errorMap, 401);
    }

    final String SESSION_ID = session.getId();
    final String JOB_ID = GUID.v7().toUUID().toString();
    Insight insight = null;
    Room room = null;
    ObjectMapper objectMapper = new ObjectMapper();

    // Parse request body
    StringBuilder requestData = new StringBuilder();
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(request.getInputStream()))) {
        String line;
        while ((line = reader.readLine()) != null) {
            requestData.append(line);
        }
    } catch (IOException e) {
        classLogger.error(Constants.STACKTRACE, e);
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put(Constants.ERROR_MESSAGE, "Bad Request: The 'data' parameter is missing.");
        return WebUtility.getResponse(errorMap, 400);
    }

    // Convert JSON to Map
    TypeReference<Map<String, Object>> mapType = new TypeReference<Map<String, Object>>() {};
    Map<String, Object> dataMap;
    try {
        dataMap = objectMapper.readValue(WebUtility.jsonSanitizer(requestData.toString()), mapType);
    } catch (JsonProcessingException e) {
        classLogger.error(Constants.STACKTRACE, e);
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put(Constants.ERROR_MESSAGE, "Error processing JSON data: " + e.getMessage());
        return WebUtility.getResponse(errorMap, 400);
    }

    boolean isStreamingRequest = false;
    if (dataMap.containsKey("stream")) {
        isStreamingRequest = Boolean.parseBoolean(dataMap.get("stream").toString());
    }

    // Extract model (engine ID) and messages
    String engineId = WebUtility.inputSanitizer((String) dataMap.remove("model"));
    if (engineId == null || engineId.isEmpty()) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put(Constants.ERROR_MESSAGE, "Bad Request: Missing 'model' field.");
        return WebUtility.getResponse(errorMap, 400);
    }
    IModelEngine engine = Utility.getModel(engineId);

    Object fullPrompt = dataMap.remove("messages");
    if (fullPrompt == null) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put(Constants.ERROR_MESSAGE, "Please provide 'messages'.");
        return WebUtility.getResponse(errorMap, 400);
    }

    // Security check
    if (!SecurityEngineUtils.userCanViewEngine(user, engineId)) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put(Constants.ERROR_MESSAGE, "User does not have access to this model");
        return WebUtility.getResponse(errorMap, 403);
    }

    // Create/retrieve Room
    String insightId = WebUtility.inputSanitizer((String) dataMap.remove("insight_id"));
    String roomId = WebUtility.inputSanitizer((String) dataMap.remove("room_id"));
    room = RoomUtils.createRoomIfNotExists(roomId, insight, engine, null);

    dataMap.put(AbstractModelEngine.FULL_PROMPT, fullPrompt);
    dataMap.put(AbstractModelEngine.APPEND_FULL_PROMPT, appendFullPrompt);

    // Execute request
    if (!isStreamingRequest) {
        AskModelEngineResponse llmResponse;
        try {
            InputMessage msg = InputMessage.builder(room)
                .withModelType(engine.getModelType())
                .withParamMap(dataMap)
                .build();
            ResponseMessage response = room.ask(msg, engine);
            llmResponse = response.getModelEngineResponse();
        } catch (Exception e) {
            classLogger.error(Constants.STACKTRACE, e);
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put(Constants.ERROR_MESSAGE, e.getMessage());
            return WebUtility.getResponse(errorMap, 400);
        }

        Map<String, Object> processedResponse =
            OpenAIChatCompletionsHelper.processAskModelEngineResponse(engineId, llmResponse);
        return WebUtility.getResponse(processedResponse, 200);
    } else {
        // Handle streaming (see previous slide)
        return handleStreamingResponse(...);
    }
}`, 'java', 'prerna/semoss/web/services/local/OpenAIEndpoints.java:110-287')}
            `
        },
        {
            id: "d3-api-handson",
            title: `Hands-on: Call ${CONFIG.productName} from OpenAI SDK`,
            content: `
                <h2>Hands-on: Call ${CONFIG.productName} from OpenAI SDK</h2>
                ${C.handson(`Connect to ${CONFIG.productName} using OpenAI Python SDK`, `
                    <h4>Prerequisites</h4>
                    <ul>
                        <li>${CONFIG.productName} instance running at <code>http://localhost:8080</code></li>
                        <li>${CONFIG.productName} user access key and secret key (generate in Admin UI)</li>
                        <li>Configured model engine (any LLM engine) with ID</li>
                    </ul>

                    <h4>Part 1: Install OpenAI Python SDK</h4>
                    ${C.code(`pip install openai`, 'bash')}

                    <h4>Part 2: Connect to SEMOSS via OpenAI SDK</h4>
                    ${C.code(`from openai import OpenAI

# Configure client to point to SEMOSS
client = OpenAI(
    base_url="http://localhost:8080/model/openai",
    api_key="<your-access-key>:<your-secret-key>"  # SEMOSS format
)

# Call SEMOSS model (use your engine ID)
response = client.chat.completions.create(
    model="abc-123-engine-id",  # Replace with your SEMOSS engine ID
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is SEMOSS?"}
    ],
    temperature=0.7,
    max_tokens=200
)

print(response.choices[0].message.content)`, 'python')}

                    <h4>Part 3: Test Streaming</h4>
                    ${C.code(`# Streaming response
stream = client.chat.completions.create(
    model="abc-123-engine-id",
    messages=[{"role": "user", "content": "Count to 10 slowly"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)`, 'python')}

                    <h4>Part 4: List Available Models</h4>
                    ${C.code(`# List all model engines you have access to
models = client.models.list()
for model in models.data:
    print(f"ID: {model.id}, Alias: {model.alias}, Created: {model.created}")`, 'python')}

                    <h4>Part 5: Maintain Conversation Context</h4>
                    ${C.code(`# Use room_id to maintain conversation history
response1 = client.chat.completions.create(
    model="abc-123-engine-id",
    messages=[{"role": "user", "content": "My name is Alice"}],
    extra_body={"room_id": "conversation-1"}
)

# Follow-up in same room (remembers "Alice")
response2 = client.chat.completions.create(
    model="abc-123-engine-id",
    messages=[{"role": "user", "content": "What is my name?"}],
    extra_body={"room_id": "conversation-1"}
)

print(response2.choices[0].message.content)  # Should mention "Alice"`, 'python')}

                    <h4>Expected Outcomes</h4>
                    <ul>
                        <li>Part 1: SDK installed successfully</li>
                        <li>Part 2: Response from ${CONFIG.productName} model via OpenAI SDK</li>
                        <li>Part 3: Streaming chunks printed in real-time</li>
                        <li>Part 4: List of your ${CONFIG.productName} model engines</li>
                        <li>Part 5: Conversation context preserved across calls</li>
                    </ul>
                `)}
                ${C.callout('<strong>Claude Code CLI</strong> works the same way: set <code>ANTHROPIC_BASE_URL=http://localhost:8080/model/anthropic</code> and <code>ANTHROPIC_API_KEY=access_key:secret_key</code>', 'tip')}
            `
        },
        {
            id: "d3-api-summary",
            title: "Summary",
            content: `
                <h2>Summary: API Endpoints</h2>
                ${C.table(
                    ["Component", "Path", "Purpose", "Key Code"],
                    [
                        [
                            "OpenAIFilter",
                            "/model/openai/*",
                            "Authenticate API requests using Bearer tokens",
                            "<code>prerna.web.conf.OpenAIFilter</code>"
                        ],
                        [
                            "OpenAI Endpoints",
                            "/v1/chat/completions, /embeddings, /models",
                            "Handle OpenAI-compatible API requests",
                            "<code>prerna.semoss.web.services.local.OpenAIEndpoints</code>"
                        ],
                        [
                            "Anthropic Endpoints",
                            "/v1/messages",
                            "Handle Anthropic Messages API requests",
                            "<code>prerna.semoss.web.services.local.AnthropicEndpoints</code>"
                        ],
                        [
                            "Room Creation",
                            "N/A",
                            "Create or retrieve conversation Rooms from API requests",
                            "<code>RoomUtils.createRoomIfNotExists()</code>"
                        ],
                        [
                            "Format Translation",
                            "N/A",
                            "Translate OpenAI/Anthropic → InputMessage → back",
                            "<code>OpenAIChatCompletionsHelper</code>"
                        ],
                        [
                            "Streaming",
                            "SSE",
                            "Poll PixelJobManager for partial responses",
                            "<code>PixelJobManager.getStreamOut()</code>"
                        ]
                    ]
                )}
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>${CONFIG.productName} is an API provider</strong> — external clients call ${CONFIG.productName} using OpenAI/Anthropic SDK formats</li>
                    <li><strong>Authentication</strong> uses ${CONFIG.productName} access/secret keys in Bearer token format: <code>access_key:secret_key</code></li>
                    <li><strong>model parameter</strong> is the ${CONFIG.productName} engine ID (UUID), not a commercial model name like "gpt-4"</li>
                    <li><strong>Room creation</strong> happens automatically from API requests using <code>room_id</code> parameter for conversation continuity</li>
                    <li><strong>Format translation</strong> converts OpenAI/Anthropic formats → <code>InputMessage</code> → back to external format</li>
                    <li><strong>Streaming</strong> uses polling architecture with <code>PixelJobManager</code>, not native SSE push</li>
                    <li><strong>Compatible clients</strong>: OpenAI SDK, Anthropic SDK, Claude Code CLI, LangChain, curl, custom apps</li>
                    <li><strong>Endpoints</strong> are at <code>/model/openai/*</code> and <code>/model/anthropic/*</code></li>
                </ul>
                ${C.callout(`${CONFIG.productName} API endpoints enable <strong>drop-in replacement</strong> for commercial APIs. Point your OpenAI/Anthropic SDK client at ${CONFIG.productName} and use your configured model engines instead of commercial models.`, 'tip')}
            `
        }
    ]
};
