// ===== SEMOSS Training — Component Library =====
// Usage: ${C.flow([...])} inside template literals in slide content

const C = {

    // ── Vertical flow diagram with labeled arrows ──
    // steps: [{ title, desc?, arrow? }]  arrow is label on the arrow AFTER this step
    flow(steps) {
        return `<div class="c-flow">${steps.map((s, i) => {
            let html = `<div class="c-flow-step${s.accent ? ' accent' : ''}">
                <div class="c-flow-title">${s.title}</div>
                ${s.desc ? `<div class="c-flow-desc">${s.desc}</div>` : ''}
            </div>`;
            if (i < steps.length - 1) {
                html += `<div class="c-flow-arrow">${s.arrow || '↓'}</div>`;
            }
            return html;
        }).join('')}</div>`;
    },

    // ── Horizontal layered architecture diagram ──
    // layers: [{ label, items: [{ title, desc? }], accent? }]
    layers(layers) {
        return `<div class="c-layers">${layers.map(layer => {
            const items = layer.items.map(item =>
                `<div class="c-layer-item${item.accent ? ' accent' : ''}">
                    <div class="c-layer-item-title">${item.title}</div>
                    ${item.desc ? `<div class="c-layer-item-desc">${item.desc}</div>` : ''}
                </div>`
            ).join('');
            return `<div class="c-layer${layer.accent ? ' accent' : ''}">
                ${layer.label ? `<div class="c-layer-label">${layer.label}</div>` : ''}
                <div class="c-layer-items">${items}</div>
            </div>`;
        }).join('')}</div>`;
    },

    // ── Sequence diagram ──
    // actors: ["Frontend", "Monolith", "GAAS", "Engine"]
    // messages: [{ from: 0, to: 1, label: "POST /runPixel", type?: "request"|"response" }]
    sequence(actors, messages) {
        const actorHtml = actors.map((a, i) =>
            `<div class="c-seq-actor" style="left:${(i / (actors.length - 1)) * 100}%">
                <div class="c-seq-actor-box">${a}</div>
                <div class="c-seq-lifeline"></div>
            </div>`
        ).join('');

        const msgHtml = messages.map((m, i) => {
            const left = Math.min(m.from, m.to);
            const right = Math.max(m.from, m.to);
            const leftPct = (left / (actors.length - 1)) * 100;
            const rightPct = (right / (actors.length - 1)) * 100;
            const isReverse = m.from > m.to;
            const type = m.type || 'request';
            return `<div class="c-seq-msg ${type}${isReverse ? ' reverse' : ''}" style="top:${(i + 1) * 48}px; left:${leftPct}%; width:${rightPct - leftPct}%">
                <div class="c-seq-msg-label">${m.label}</div>
                <div class="c-seq-msg-line"></div>
            </div>`;
        }).join('');

        const height = (messages.length + 1) * 48 + 40;
        return `<div class="c-seq" style="height:${height}px">
            <div class="c-seq-actors">${actorHtml}</div>
            <div class="c-seq-messages">${msgHtml}</div>
        </div>`;
    },

    // ── Code block with language badge and optional title ──
    code(code, lang, title) {
        const trimmed = code.replace(/^\n+/, '').replace(/\n+$/, '');
        const escaped = trimmed.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<div class="c-code">
            ${title ? `<div class="c-code-header"><span class="c-code-title">${title}</span><span class="c-code-lang">${lang || ''}</span></div>` : `<div class="c-code-header"><span class="c-code-lang">${lang || ''}</span></div>`}
            <pre><code>${escaped}</code></pre>
        </div>`;
    },

    // ── Side-by-side split view ──
    // left: { title, content }  right: { title, content }
    split(left, right) {
        return `<div class="c-split">
            <div class="c-split-panel">
                ${left.title ? `<div class="c-split-title">${left.title}</div>` : ''}
                <div class="c-split-content">${left.content}</div>
            </div>
            <div class="c-split-divider"></div>
            <div class="c-split-panel">
                ${right.title ? `<div class="c-split-title">${right.title}</div>` : ''}
                <div class="c-split-content">${right.content}</div>
            </div>
        </div>`;
    },

    // ── File/directory tree ──
    // items: [{ name, children?: [], type?: "dir"|"file" }]
    tree(items, depth = 0) {
        return `<div class="c-tree${depth === 0 ? ' c-tree-root' : ''}">${items.map(item => {
            const isDir = item.type === 'dir' || item.children;
            const icon = isDir ? '📁' : '📄';
            const annotation = item.desc ? `<span class="c-tree-desc">${item.desc}</span>` : '';
            let html = `<div class="c-tree-item" style="padding-left:${depth * 20}px">
                <span class="c-tree-icon">${icon}</span>
                <span class="c-tree-name${isDir ? ' dir' : ''}">${item.name}</span>
                ${annotation}
            </div>`;
            if (item.children) {
                html += C.tree(item.children, depth + 1);
            }
            return html;
        }).join('')}</div>`;
    },

    // ── Concept cards grid ──
    // items: [{ title, desc, badge? }]
    cards(items) {
        return `<div class="c-cards">${items.map(item =>
            `<div class="c-card">
                ${item.badge ? `<div class="c-card-badge">${item.badge}</div>` : ''}
                <div class="c-card-title">${item.title}</div>
                <div class="c-card-desc">${item.desc}</div>
            </div>`
        ).join('')}</div>`;
    },

    // ── Callout box ──
    // type: "info" | "warning" | "tip" | "danger"
    callout(content, type = 'info') {
        const icons = { info: 'ℹ️', warning: '⚠️', tip: '💡', danger: '🚨' };
        return `<div class="c-callout ${type}">
            <span class="c-callout-icon">${icons[type] || ''}</span>
            <div class="c-callout-content">${content}</div>
        </div>`;
    },

    // ── Hands-on exercise ──
    // steps: string[] or HTML string
    handson(title, content) {
        return `<div class="c-handson">
            <div class="c-handson-header">
                <span class="c-handson-badge">HANDS-ON</span>
                <span class="c-handson-title">${title}</span>
            </div>
            <div class="c-handson-body">${content}</div>
        </div>`;
    },

    // ── Table ──
    // headers: string[], rows: string[][]
    table(headers, rows) {
        const th = headers.map(h => `<th>${h}</th>`).join('');
        const trs = rows.map(row =>
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('');
        return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`;
    },

    // ── Inline badge ──
    badge(text, type = 'default') {
        return `<span class="c-badge ${type}">${text}</span>`;
    },

    // ── Title slide ──
    titleSlide(title, subtitle, timeBadge) {
        return `<div class="slide-title-card">
            <h1>${title}</h1>
            <div class="divider"></div>
            ${subtitle ? `<p class="lead">${subtitle}</p>` : ''}
            ${timeBadge ? `<span class="time-badge">${timeBadge}</span>` : ''}
        </div>`;
    }
};
