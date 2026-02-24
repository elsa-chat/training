// Topic: Context Engineering for Agents
const slides_context_engineering = [
    {
        id: "context-engineering-title",
        title: "Context Engineering for Agents",
        content: C.titleSlide(
            "Context Engineering for Agents",
            "The art and science of managing LLM context windows at scale",
            "60 minutes"
        )
    },
    {
        id: "context-what-is",
        title: "What is Context Engineering?",
        content: `
            <h2>What is Context Engineering?</h2>
            <p class="lead">"The delicate art and science of filling the context window with just the right information for the next step" — <strong>Andrej Karpathy</strong></p>

            ${C.callout('Think of the LLM context window like <strong>RAM in a computer</strong> — a finite resource that requires careful curation. What you put in the context directly determines what the LLM can do.', 'tip')}

            <h3>Three Types of Context</h3>
            ${C.cards([
                { badge: 'Instructions', title: 'Instructions', desc: 'System prompts, few-shot examples, tool descriptions, user memories — how the agent should behave' },
                { badge: 'Knowledge', title: 'Knowledge', desc: 'Facts, historical information, RAG results, documentation — what the agent needs to know' },
                { badge: 'Tools', title: 'Tools', desc: 'Tool execution results, feedback from previous steps, intermediate outputs — what the agent has learned' },
            ])}

            <h3>Why Context Engineering Matters</h3>
            <ul>
                <li><strong>Long-running agents accumulate tokens rapidly</strong> — A multi-step task can fill a 200K context window in minutes</li>
                <li><strong>Context quality determines reliability</strong> — Wrong context = hallucinations, failures, wasted API calls</li>
                <li><strong>Production viability depends on it</strong> — Cognition states it's "effectively the #1 job of engineers building AI agents"</li>
            </ul>
        `
    },
    {
        id: "context-failure-modes",
        title: "Context Failure Modes",
        content: `
            <h2>Context Failure Modes</h2>
            <p>As agents run longer tasks, poor context management leads to predictable failure patterns:</p>

            ${C.split(
                {
                    title: 'Failure Modes',
                    content: `
                        <ul>
                            <li><strong>Context Poisoning</strong><br>
                            Hallucinations or errors enter the context, compounding in future steps</li>

                            <li><strong>Context Distraction</strong><br>
                            Too much information overwhelms the LLM's training, reducing accuracy</li>

                            <li><strong>Context Confusion</strong><br>
                            Superfluous details influence responses in unexpected ways</li>

                            <li><strong>Context Clash</strong><br>
                            Contradictory information from different sources creates inconsistent behavior</li>
                        </ul>
                    `
                },
                {
                    title: 'Real-World Impact',
                    content: `
                        <ul>
                            <li><strong>Token costs explode</strong><br>
                            Sending unnecessary context to LLMs wastes money at scale</li>

                            <li><strong>Latency increases</strong><br>
                            Larger contexts = slower inference times</li>

                            <li><strong>Accuracy degrades</strong><br>
                            Studies show performance drops as context fills with irrelevant information</li>

                            <li><strong>Agents fail silently</strong><br>
                            Subtle context issues cause subtle failures that are hard to debug</li>
                        </ul>
                    `
                }
            )}

            ${C.callout(`In ${CONFIG.productName}, context failures often manifest as: <ul><li>Rooms forgetting tool execution results</li><li>Insights accumulating stale variables</li><li>LLMs repeating failed tool calls</li><li>Multi-turn conversations losing coherence</li></ul>`, 'warning')}
        `
    },
    {
        id: "context-four-strategies",
        title: "Four Context Engineering Strategies",
        content: `
            <h2>Four Context Engineering Strategies</h2>
            <p class="lead">Modern agent systems combine <strong>all four</strong> complementary approaches to manage context at scale. Each strategy addresses different aspects of context management, and they work together simultaneously.</p>

            ${C.cards([
                {
                    badge: '1',
                    title: 'Write Context',
                    desc: 'Externalize information to persistent storage (scratchpads, memories, databases)'
                },
                {
                    badge: '2',
                    title: 'Select Context',
                    desc: 'Retrieve only relevant information (RAG, tool description search, memory retrieval)'
                },
                {
                    badge: '3',
                    title: 'Compress Context',
                    desc: 'Summarize or trim existing context (recursive summarization, message pruning)'
                },
                {
                    badge: '4',
                    title: 'Isolate Context',
                    desc: 'Separate contexts into multiple agents or environments (multi-agent, sandboxes)'
                },
            ])}

            ${C.callout('These strategies are <strong>not sequential</strong> — production agents use all four simultaneously. The key is choosing the right strategy for each type of information and combining them effectively.', 'tip')}

            <h3>Strategy Trade-offs</h3>
            ${C.table(
                ["Strategy", "Benefit", "Cost", `${CONFIG.productName} Example`],
                [
                    ["Write Context", "Infinite persistence", "Retrieval complexity", "Room.options (tools, workspace, system prompt)"],
                    ["Select Context", "Precision control", "Retrieval failures", "Vector engine RAG, MCP tool filtering"],
                    ["Compress Context", "Token efficiency", "Information loss", "Message history summarization"],
                    ["Isolate Context", "Context clarity", "Token multiplication", "Multi-agent teams, Insight isolation"]
                ]
            )}
        `
    },
    {
        id: "context-write-select",
        title: "Strategy 1 & 2: Write and Select Context",
        content: `
            <h2>Strategy 1: Write Context</h2>
            <p>Externalize information to persistent storage instead of keeping it in the LLM context window.</p>

            ${C.cards([
                {
                    badge: 'Scratchpads',
                    title: 'Scratchpads',
                    desc: 'Temporary notes saved during task execution. Example: Anthropic\'s multi-agent researcher saves research plans to Memory to persist across agent turns.'
                },
                {
                    badge: 'Memories',
                    title: 'Long-term Memories',
                    desc: 'Persistent storage across sessions. Products like ChatGPT, Cursor, and Windsurf auto-generate memories from user-agent interactions.'
                },
            ])}

            <h2>Strategy 2: Select Context</h2>
            <p>Retrieve only the most relevant information for each step instead of sending everything.</p>

            ${C.split(
                {
                    title: 'Memory Types (Select What)',
                    content: `
                        <ul>
                            <li><strong>Episodic Memory</strong><br>
                            Few-shot examples for behavioral guidance<br>
                            <em>Example: Show the LLM past successful tool executions</em></li>

                            <li><strong>Procedural Memory</strong><br>
                            Instructions steering agent actions<br>
                            <em>Example: System prompts with {{VAR}} replacements</em></li>

                            <li><strong>Semantic Memory</strong><br>
                            Task-relevant factual information<br>
                            <em>Example: RAG results from vector database</em></li>
                        </ul>
                    `
                },
                {
                    title: 'Selection Techniques (Select How)',
                    content: `
                        <ul>
                            <li><strong>Tool Description Retrieval</strong><br>
                            RAG applied to tool descriptions improves selection accuracy by 3×<br>
                            <em>Example: Filter available tools dynamically based on conversation context</em></li>

                            <li><strong>Hybrid Retrieval</strong><br>
                            Combine embedding search + keyword search + re-ranking<br>
                            <em>Windsurf: "grep/file search + knowledge graph + re-ranking"</em></li>

                            <li><strong>Message History Filtering</strong><br>
                            Select relevant past messages instead of full history<br>
                            <em>Example: Retrieve only messages relevant to current task</em></li>
                        </ul>
                    `
                }
            )}
        `
    },
    {
        id: "context-compress-isolate",
        title: "Strategy 3 & 4: Compress and Isolate Context",
        content: `
            <h2>Strategy 3: Compress Context</h2>
            <p>Reduce the size of existing context through summarization or trimming.</p>

            ${C.cards([
                {
                    badge: 'Summarization',
                    title: 'Recursive Summarization',
                    desc: 'Claude Code implements "auto-compact" after 95% context utilization, using recursive or hierarchical summarization. Cognition applies summarization at agent boundaries during knowledge transfer.'
                },
                {
                    badge: 'Trimming',
                    title: 'Message Pruning',
                    desc: 'Hard-coded heuristics remove older messages or apply trained pruning models like Provence. Trade-off: lose specificity and potentially critical context.'
                },
            ])}

            <h2>Strategy 4: Isolate Context</h2>
            <p>Separate contexts into multiple agents or environments to prevent context pollution.</p>

            ${C.split(
                {
                    title: 'Multi-Agent Architecture',
                    content: `
                        <p><strong>Anthropic Research Findings</strong>: Isolated subagent contexts outperformed single-agent approaches, with agents "exploring different aspects of the question simultaneously" in parallel.</p>

                        <p><strong>Trade-off</strong>: Up to 15× more tokens than single-agent chat, but higher accuracy and better context isolation.</p>

                        <p><strong>Key Pattern</strong>: Each agent gets its own isolated context and state. Agents communicate via explicit message passing, not shared context.</p>
                    `
                },
                {
                    title: 'Sandboxes & State Objects',
                    content: `
                        <p><strong>Code-based Environments</strong>: HuggingFace isolates token-heavy objects (images, audio) in sandboxes, keeping only return values in LLM context.</p>

                        <p><strong>State Objects</strong>: Runtime state schemas (Pydantic) selectively expose fields to the LLM while isolating other information.</p>

                        <p><strong>Key Pattern</strong>: Keep token-heavy data (images, large files, full datasets) outside LLM context. Send only metadata, summaries, or return values.</p>
                    `
                }
            )}
        `
    },
    {
        id: "context-semoss-patterns",
        title: `Context Engineering in ${CONFIG.productName}`,
        content: `
            <h2>Context Engineering Patterns in ${CONFIG.productName}</h2>
            <p>How the four strategies map to ${CONFIG.productName} architecture:</p>

            ${C.table(
                ["Strategy", `${CONFIG.productName} Component`, "Implementation Pattern", "Use Case"],
                [
                    [
                        "<strong>Write Context</strong>",
                        "Room + MODEL_INFERENCE_LOGS_DB",
                        "Full message history persisted to database for long-running conversations",
                        "Multi-session conversations with full context retention and retrieval"
                    ],
                    [
                        "<strong>Write Context</strong>",
                        "insightFolder / Room Folder",
                        "File storage on disk preserved across sessions for document/artifact persistence",
                        "Save generated files, uploaded documents, or intermediate outputs that persist between sessions"
                    ],
                    [
                        "<strong>Select Context</strong>",
                        "Vector Engine + RAG",
                        "Semantic search over documents, code, or knowledge bases",
                        "Question-answering over large document sets (e.g., enterprise docs)"
                    ],
                    [
                        "<strong>Select Context</strong>",
                        "MCP Tool Filtering",
                        "Dynamically filter available tools based on conversation context",
                        "Playground with 100+ MCP tools — only show relevant 10-15"
                    ],
                    [
                        "<strong>Select Context</strong>",
                        "Business-Specific MCP Tools",
                        "Engage MCP tools to retrieve context from enterprise systems (CRM, databases, APIs)",
                        "Pull customer data, inventory records, or business logic on-demand instead of preloading everything"
                    ],
                    [
                        "<strong>Compress Context</strong>",
                        "Message History Summarization",
                        "Summarize older Room messages before passing to LLM",
                        "Conversations exceeding 100K tokens — summarize turns 1-50, keep 51+ verbatim"
                    ],
                    [
                        "<strong>Isolate Context</strong>",
                        "1-off Messages (non-maintained)",
                        "Single-use messages added to conversation without database persistence",
                        "One-time context injection without polluting permanent history (e.g., system hints, temporary instructions)"
                    ],
                    [
                        "<strong>Isolate Context</strong>",
                        "Multi-Agent Teams",
                        "Each agent has isolated Insight + Room, explicit message passing",
                        "Research tasks: one agent searches web, another analyzes, another writes report"
                    ]
                ]
            )}

            ${C.callout(`Best Practice: Combine all four strategies. Example: A research agent might <strong>write</strong> findings to Room.options, <strong>select</strong> relevant docs via vector search, <strong>compress</strong> older messages via summarization, and <strong>isolate</strong> web search + analysis into separate agents.`, 'tip')}
        `
    },
    {
        id: "context-design-decisions",
        title: "Making Context Engineering Decisions",
        content: `
            <h2>When to Use Each Strategy</h2>
            <p>Choosing the right context engineering approach depends on your use case:</p>

            ${C.flow([
                {
                    title: 'Step 1: Identify Your Context Type',
                    desc: 'Is this Instructions, Knowledge, or Tools? Different types need different strategies.',
                    accent: true,
                    arrow: '↓'
                },
                {
                    title: 'Step 2: Estimate Context Growth',
                    desc: 'How fast will context accumulate? Short tasks (<10 turns) vs long tasks (100+ turns) need different approaches.',
                    arrow: '↓'
                },
                {
                    title: 'Step 3: Choose Primary Strategy',
                    desc: 'Write (persistent), Select (precision), Compress (efficiency), or Isolate (clarity)?',
                    arrow: '↓'
                },
                {
                    title: 'Step 4: Layer Additional Strategies',
                    desc: 'Combine strategies for production robustness (e.g., Write + Select + Compress).',
                    accent: true
                },
            ])}

            <h3>Decision Matrix</h3>
            ${C.table(
                ["If You Need...", "Primary Strategy", "Why", `${CONFIG.productName} Pattern`],
                [
                    ["Session persistence across restarts", "<strong>Write Context</strong>", "Database outlives in-memory LLM context", "Room message history in MODEL_INFERENCE_LOGS_DB"],
                    ["Precision retrieval from large knowledge base", "<strong>Select Context</strong>", "Only relevant info sent to LLM", "Vector engine RAG over 10K documents"],
                    ["Efficient long conversations (100+ turns)", "<strong>Compress Context</strong>", "Summarize old messages, keep recent verbatim", "Summarize turns 1-80, keep 81-100 full"],
                    ["Parallel research with no cross-contamination", "<strong>Isolate Context</strong>", "Each agent explores independently", "Multi-agent teams with isolated Insights"],
                    ["Multi-modal workflows (images, video, audio)", "<strong>Isolate Context</strong>", "Keep token-heavy data out of LLM context", "insightFolder for files, LLM sees paths only"],
                    ["Tool calling with 100+ available tools", "<strong>Select Context</strong>", "Filter tools dynamically based on conversation", "MCP tool filtering in playground"],
                ]
            )}

            ${C.callout(`Real-world example: <strong>Windsurf code agent</strong> combines all four strategies:<ul><li><strong>Write</strong>: Saves code edits to files (persistent)</li><li><strong>Select</strong>: Uses grep + knowledge graph + re-ranking for codebase retrieval</li><li><strong>Compress</strong>: Summarizes file diffs instead of sending full files</li><li><strong>Isolate</strong>: Separates code execution sandbox from LLM context</li></ul>`, 'tip')}
        `
    },
    {
        id: "context-summary",
        title: "Summary: Context Engineering Essentials",
        content: `
            <h2>Summary: Context Engineering Essentials</h2>

            <h3>Key Takeaways</h3>
            <ul>
                <li><strong>Context engineering is critical infrastructure</strong> — Cognition calls it "the #1 job of engineers building AI agents"</li>
                <li><strong>Four complementary strategies</strong> — Write (persist), Select (retrieve), Compress (summarize), Isolate (separate)</li>
                <li><strong>No single solution</strong> — Production agents combine multiple strategies simultaneously</li>
                <li><strong>Trade-offs matter</strong> — Multi-agent improves accuracy but costs 15× more tokens; summarization saves tokens but loses specificity</li>
                <li><strong>${CONFIG.productName} provides primitives for all four strategies</strong> — Room (write), Vector engines (select), message summarization (compress), multi-agent teams (isolate)</li>
            </ul>

            <h3>Context Failure Modes to Avoid</h3>
            ${C.cards([
                { badge: 'Poisoning', title: 'Context Poisoning', desc: 'Hallucinations compound across turns → Validate tool results before adding to context' },
                { badge: 'Distraction', title: 'Context Distraction', desc: 'Too much info overwhelms LLM → Use Select strategy to filter relevance' },
                { badge: 'Confusion', title: 'Context Confusion', desc: 'Superfluous details mislead → Keep context focused on current task' },
                { badge: 'Clash', title: 'Context Clash', desc: 'Contradictory info creates inconsistency → Use Isolate strategy to separate concerns' },
            ])}

            <h3>Practical Implementation Checklist</h3>
            <ol>
                <li><strong>Audit your context growth</strong> — Track tokens per turn, identify growth patterns</li>
                <li><strong>Classify your context</strong> — Label each piece as Instructions, Knowledge, or Tools</li>
                <li><strong>Apply appropriate strategies</strong> — Write for persistence, Select for precision, Compress for efficiency, Isolate for clarity</li>
                <li><strong>Monitor failure modes</strong> — Watch for poisoning, distraction, confusion, clash in production</li>
                <li><strong>Iterate on trade-offs</strong> — Balance token cost vs accuracy vs latency for your specific use case</li>
            </ol>

            ${C.callout(`Next Steps: In the following sessions, you'll apply these context engineering principles to ${CONFIG.productName} Playground (system prompts, tool filtering) and MCP integration (tool description retrieval, multi-agent isolation).`, 'tip')}
        `
    }
];
