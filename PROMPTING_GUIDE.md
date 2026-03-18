# ${CONFIG.productName} Training — Content Generation Guide

Use this guide to generate new chapter content for the training site. Copy the relevant sections into your prompt when asking Claude to create slides.

---

## 1. Slide Data Contract

Each chapter is a JS file exporting a global variable:

```js
// data/day{N}/ch{NN}-{slug}.js
const day{N}_ch{NN} = {
    title: "Chapter Title",       // shown in sidebar
    slides: [
        {
            id: "d{N}-{slug}",    // URL hash + sidebar nav ID
            title: "Sidebar Label",
            content: `...HTML using C.* components...`
        }
    ]
};
```

### ID Convention
- Pattern: `d{day}-{chapter-slug}-{topic-slug}`
- Examples: `d2-custom-reactors-anatomy`, `d3-rag-pipeline`, `d5-deploy-docker`
- Must be unique across ALL days

### Assembly
Each day has an `index.js` that assembles chapters:
```js
// data/day{N}/index.js
const day{N}Data = {
    label: "Day {N} — {Weekday}, {Date}",
    chapters: [day{N}_ch01, day{N}_ch02, ...]
};
```

### Loading in index.html
Add `<script>` tags in order: components → chapters → day index → app.js

---

## 2. Component Reference

All components are called via the `C` object inside template literals: `${C.functionName(...)}`.

### C.titleSlide(title, subtitle?, timeBadge?)
Chapter/section title card. Centered, large serif font.
```js
C.titleSlide("Pixel & Reactors", "The command language of SEMOSS", "90 minutes")
```

### C.flow(steps)
Vertical flow diagram with labeled arrows.
```js
C.flow([
    { title: "Step 1", desc: "Description", accent: true },
    { title: "Step 2", desc: "Description", arrow: "↓ label between steps" },
    { title: "Step 3", desc: "Description" },
])
```
- `title` (required) — bold heading in the box
- `desc` (optional) — muted description below title
- `accent` (optional) — gold border highlight
- `arrow` (optional) — label on the arrow AFTER this step (default: "↓")

### C.layers(layers)
Horizontal layered architecture diagram. Each layer has items side by side.
```js
C.layers([
    { label: "Presentation", items: [{ title: "React UI", desc: "SemossWeb" }] },
    { label: "Application", accent: true, items: [
        { title: "Monolith", desc: "REST API", accent: true },
        { title: "SEMOSS Core", desc: "Engines + Reactors", accent: true },
    ]},
    { label: "Data", items: [{ title: "Engines", desc: "DB, Model, Vector" }] },
])
```

### C.sequence(actors, messages)
Sequence diagram showing request/response flow between actors.
```js
C.sequence(
    ["Browser", "Server", "Database"],
    [
        { from: 0, to: 1, label: "POST /api/runPixel" },
        { from: 1, to: 2, label: "SQL query" },
        { from: 2, to: 1, label: "ResultSet", type: "response" },
        { from: 1, to: 0, label: "JSON response", type: "response" },
    ]
)
```
- `from`/`to` — actor indices (0-based)
- `label` — text on the arrow
- `type` — `"request"` (default, solid line) or `"response"` (dashed line)

### C.code(code, lang, title?)
Code block with language badge and optional title bar.
```js
C.code(`public class MyReactor extends AbstractReactor {
    public NounMetadata execute() { ... }
}`, "java", "src/prerna/reactor/MyReactor.java")
```
- `code` — raw code string (auto HTML-escaped)
- `lang` — language label shown as badge (e.g., "java", "pixel", "python", "bash", "http", "properties")
- `title` — optional header text (e.g., file path)

### C.split(left, right)
Side-by-side panels for comparison.
```js
C.split(
    { title: "Pixel", content: C.code(`Echo("hello");`, "pixel") },
    { title: "REST API", content: C.code(`POST /api/engine/runPixel`, "http") }
)
```
- `title` (optional) — uppercase label above content
- `content` — HTML string (can nest other C.* components)

### C.tree(items)
File/directory tree visualization.
```js
C.tree([
    { name: "src/", type: "dir", children: [
        { name: "prerna/", type: "dir", children: [
            { name: "reactor/", type: "dir", desc: "← all reactors live here" },
            { name: "engine/", type: "dir", desc: "← engine interfaces" },
        ]},
    ]},
])
```
- `name` — file/directory name
- `type` — `"dir"` or `"file"` (auto-detected if `children` present)
- `desc` (optional) — annotation shown to the right
- `children` (optional) — nested items

### C.cards(items)
Grid of concept cards.
```js
C.cards([
    { badge: "Type", title: "Database", desc: "IDatabaseEngine — RDBMS, RDF" },
    { badge: "Type", title: "Model", desc: "IModelEngine — LLMs" },
])
```
- `badge` (optional) — small uppercase label above title
- `title` — bold heading
- `desc` — description text (supports HTML)

### C.callout(content, type?)
Info/tip/warning callout box.
```js
C.callout("This is important info with <strong>HTML</strong> support.", "info")
```
- Types: `"info"` (blue), `"tip"` (green), `"warning"` (amber), `"danger"` (red)

### C.handson(title, content)
Hands-on exercise block with HANDS-ON badge.
```js
C.handson("Build a Custom Reactor", `
    <ol><li>Step 1...</li><li>Step 2...</li></ol>
    ${C.code('...', 'java')}
`)
```

### C.table(headers, rows)
Clean comparison table.
```js
C.table(
    ["Column A", "Column B"],
    [
        ["Row 1A", "Row 1B"],
        ["Row 2A", "Row 2B"],
    ]
)
```

### C.badge(text, type?)
Inline badge/tag.
```js
C.badge("JAVA", "java")    // red-ish
C.badge("PYTHON", "python") // blue-ish
C.badge("PIXEL", "pixel")   // green-ish
C.badge("REST", "rest")     // amber
C.badge("NEW", "accent")    // gold
```

---

## 3. Slide Type Templates

### Title Slide
```js
{
    id: "d{N}-{slug}-title",
    title: "{Chapter Name}",
    content: C.titleSlide("{Chapter Name}", "{One-line description}", "{Duration}")
}
```

### Concept + Diagram
```js
{
    id: "d{N}-{slug}-{topic}",
    title: "{Topic Name}",
    content: `
        <h2>{Topic Name}</h2>
        <p class="lead">{One-sentence definition with <span class="highlight">key term</span>}</p>
        <p>{2-3 sentences of explanation}</p>
        ${C.flow([...])}  // or C.layers([...]) or C.sequence([...])
        ${C.callout('Key takeaway or context.', 'info')}
    `
}
```

### Code Deep Dive
```js
{
    id: "d{N}-{slug}-{topic}",
    title: "{Topic Name}",
    content: `
        <h2>{Topic Name}</h2>
        <p>{Brief context for what this code does}</p>
        ${C.code(`...actual code from the codebase...`, "java", "path/to/File.java")}
        <h3>Key Points</h3>
        <ul>
            <li><code>methodName</code> — what it does</li>
        </ul>
    `
}
```

### Comparison / Split
```js
{
    id: "d{N}-{slug}-{topic}",
    title: "{Topic Name}",
    content: `
        <h2>{Topic Name}</h2>
        ${C.split(
            { title: "Approach A", content: `...` },
            { title: "Approach B", content: `...` }
        )}
    `
}
```

### Hands-on Exercise
```js
{
    id: "d{N}-{slug}-handson",
    title: "Hands-on: {Exercise Name}",
    content: `
        <h2>Hands-on: {Exercise Name}</h2>
        ${C.handson('{Exercise Title}', `
            <h4>Step 1: ...</h4>
            <p>Instructions...</p>
            ${C.code('...', 'pixel')}
            <h4>Step 2: ...</h4>
            ...
        `)}
    `
}
```

---

## 4. Content Guidelines

1. **Every concept slide MUST have a diagram OR code snippet** (ideally both)
2. **Use `C.sequence()`** for any request/response or multi-actor flow
3. **Use `C.code()` with actual codebase snippets** — reference file paths in the title
4. **Use `C.split()`** for showing two representations (e.g., Pixel vs Java, before/after)
5. **Use `C.tree()`** instead of describing file structures in prose
6. **Use `C.flow()`** for step-by-step processes, lifecycles, pipelines
7. **Use `C.layers()`** for architecture diagrams
8. **Use `C.cards()`** for listing 3+ related concepts
9. **Hands-on exercises** should use real Pixel/Java/Python from the ${CONFIG.productName} codebase
10. **Target 4-8 slides per 30 minutes** of training time
11. **Keep text per slide scannable** — if it needs scrolling, split into two slides

---

## 5. Prompt Template

Copy and fill in this template when generating a new chapter:

```
Generate training slide content for the SEMOSS Training site.

Chapter: [CHAPTER_NAME]
Day: [N], Chapter: [NN]
Duration: [X] minutes
Variable name: day[N]_ch[NN]

Topics to cover:
- [TOPIC 1]
- [TOPIC 2]
- [TOPIC 3]
- ...

SEMOSS source references (look at these for accurate code):
- [FILE_PATH_1]
- [FILE_PATH_2]

Output format:
- A single JS file following the slide data contract
- Use the C.* component library for ALL diagrams and code blocks
- Include at least one diagram or code snippet per concept slide
- Include at least one hands-on exercise
- Start with a title slide, end with a recap or hands-on

Read PROMPTING_GUIDE.md for the full component reference and content guidelines.
```

---

## 6. Adding a New Chapter

1. Create `data/day{N}/ch{NN}-{slug}.js`
2. Add `<script src="data/day{N}/ch{NN}-{slug}.js"></script>` to `index.html` BEFORE the day index script
3. Add the chapter variable to the day's `index.js` chapters array
4. Refresh the browser — the sidebar auto-populates
