// ===== Training App Controller =====

let currentSlideIndex = 0;
let allSlides = [];
let navStructure = [];
let sidebarSearchQuery = '';
let slideSearchIndex = new Map();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Apply branding from CONFIG
    document.getElementById('logoTitle').textContent = CONFIG.sidebarBranding;
    document.getElementById('pageTitle').textContent = CONFIG.pageTitle;
    document.getElementById('logoSubtitle').textContent = CONFIG.logoSubtitle;

    buildNavStructure();
    buildSidebar();
    buildSchedule();

    // Flatten all slides for sequential navigation
    allSlides = [];
    navStructure.forEach(day => {
        day.chapters.forEach(chapter => {
            chapter.slides.forEach(slide => {
                const chapterLabel = day.display === 'day-only' || !chapter.title ? day.label : chapter.title;
                allSlides.push({
                    ...slide,
                    dayLabel: day.label,
                    chapterLabel
                });
            });
        });
    });
    buildSlideSearchIndex();
    initSidebarSearch();

    // Debug: Log allSlides breakdown by day
    console.log('[DEBUG] allSlides populated:', allSlides.length, 'total slides');
    console.log('[DEBUG] Slides by day:', navStructure.map(day => ({
        label: day.label,
        count: day.chapters.reduce((sum, ch) => sum + (ch.slides?.length || 0), 0)
    })));

    // Load initial slide (check URL hash)
    // Important: This must happen AFTER allSlides is built
    const hash = window.location.hash.slice(1);
    console.log('[DEBUG] Initial hash:', hash);
    if (hash && allSlides.length > 0) {
        const idx = allSlides.findIndex(s => s.id === hash);
        console.log('[DEBUG] Hash lookup result:', { hash, foundIndex: idx, exists: idx >= 0 });
        if (idx >= 0) {
            // Check if this slide belongs to a locked day
            const slide = allSlides[idx];
            const dayIdx = navStructure.findIndex(day => day.label === slide.dayLabel);
            if (dayIdx >= 0 && isDayLocked(dayIdx)) {
                console.warn('[LOCKED] Initial hash points to locked day; defaulting to first slide');
                currentSlideIndex = 0;
            } else {
                currentSlideIndex = idx;
                console.log('[DEBUG] Setting currentSlideIndex to', idx, '(slide:', allSlides[idx]?.id, ')');
            }
        } else {
            console.warn(`Slide not found for hash: #${hash}, defaulting to first slide`);
            currentSlideIndex = 0;
        }
    } else {
        const autoDayIdx = getDayIndexForToday();
        if (autoDayIdx !== null && allSlides.length > 0 && !isDayLocked(autoDayIdx)) {
            const dayLabel = navStructure[autoDayIdx]?.label;
            const firstIdx = allSlides.findIndex(s => s.dayLabel === dayLabel);
            if (firstIdx >= 0) {
                currentSlideIndex = firstIdx;
                console.log('[DEBUG] Auto-jump to today:', dayLabel, 'slide index', firstIdx);
            } else {
                console.log('[DEBUG] Today matched but no slides found; defaulting to first slide');
            }
        } else {
            if (autoDayIdx !== null && isDayLocked(autoDayIdx)) {
                console.log('[DEBUG] Today is locked; defaulting to first slide');
            }
            console.log('[DEBUG] No hash or allSlides empty, defaulting to first slide');
        }
    }

    renderSlide();
    updateNav();
    // Expand sidebar to today's day (if matched and not locked) after initial render
    const autoDayIdx = getDayIndexForToday();
    if (autoDayIdx !== null && !isDayLocked(autoDayIdx)) expandDay(autoDayIdx, true);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'Escape') {
            const modal = document.getElementById('scheduleModal');
            if (modal.classList.contains('open')) toggleSchedule();
        }
    });

    // Handle hash changes (browser back/forward, direct links)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        console.log('[DEBUG] hashchange event fired, new hash:', hash);
        if (hash && allSlides.length > 0) {
            const idx = allSlides.findIndex(s => s.id === hash);
            console.log('[DEBUG] hashchange lookup:', { hash, foundIndex: idx, currentIndex: currentSlideIndex });
            if (idx >= 0 && idx !== currentSlideIndex) {
                // Check if this slide belongs to a locked day
                const slide = allSlides[idx];
                const dayIdx = navStructure.findIndex(day => day.label === slide.dayLabel);
                if (dayIdx >= 0 && isDayLocked(dayIdx)) {
                    console.warn('[LOCKED] Cannot navigate to', hash, '- Day is locked');
                    // Reset hash to current slide
                    window.location.hash = allSlides[currentSlideIndex]?.id || '';
                    return;
                }
                console.log('[DEBUG] Navigating to slide', idx, ':', allSlides[idx]?.id);
                currentSlideIndex = idx;
                renderSlide();
                updateNav();
            } else if (idx < 0) {
                console.warn('[DEBUG] hashchange: Slide not found for hash:', hash);
            } else {
                console.log('[DEBUG] hashchange: Already on this slide');
            }
        }
    });
});

// Build navigation structure from slide data
function buildNavStructure() {
    navStructure = [];

    const hasSessionPlan = typeof SESSION_PLAN !== 'undefined' && SESSION_PLAN && Array.isArray(SESSION_PLAN.days);
    const hasSlideIndex = typeof SLIDES_BY_ID !== 'undefined' && SLIDES_BY_ID;

    if (!hasSessionPlan || !hasSlideIndex) {
        console.warn('[WARN] SESSION_PLAN or SLIDES_BY_ID missing; navigation will be empty.');
        return;
    }

    SESSION_PLAN.days.forEach(day => {
        const dayLabel = day.label || `Day ${day.id || ''}`.trim();
        const hasChapters = Array.isArray(day.chapters) && day.chapters.length > 0;

        if (hasChapters) {
            const chapters = day.chapters.map(ch => {
                const slideIds = Array.isArray(ch.slideIds) ? ch.slideIds : [];
                const slides = slideIds.map(id => SLIDES_BY_ID[id]).filter(Boolean);
                const missing = slideIds.filter(id => !SLIDES_BY_ID[id]);
                if (missing.length) {
                    console.warn('[WARN] Missing slides for chapter', ch.title || 'Untitled', 'in', dayLabel, missing);
                }
                return {
                    title: ch.title || 'Section',
                    slides
                };
            });

            navStructure.push({
                label: dayLabel,
                chapters,
                display: 'chapters'
            });
            return;
        }

        const slideIds = Array.isArray(day.slideIds) ? day.slideIds : [];
        const slides = slideIds.map(id => SLIDES_BY_ID[id]).filter(Boolean);
        const missing = slideIds.filter(id => !SLIDES_BY_ID[id]);
        if (missing.length) {
            console.warn('[WARN] Missing slides for day', day.id || day.label, missing);
        }

        navStructure.push({
            label: dayLabel,
            chapters: [{ title: null, slides }],
            display: 'day-only'
        });
    });

    console.log('[DEBUG] navStructure built from SESSION_PLAN:', navStructure.length, 'days');
}

// Check if a day is locked based on CONFIG.lockedDays
function isDayLocked(dayIdx) {
    if (!CONFIG.lockedDays || !Array.isArray(CONFIG.lockedDays)) return false;
    // dayIdx is 0-indexed, but CONFIG.lockedDays uses 1-indexed day numbers
    const dayNumber = dayIdx + 1;
    return CONFIG.lockedDays.includes(dayNumber);
}

function normalizeSearchQuery(value) {
    return String(value || '').trim().toLowerCase();
}

function htmlToSearchText(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html || '';
    return (temp.textContent || temp.innerText || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function buildSlideSearchIndex() {
    slideSearchIndex = new Map();
    allSlides.forEach(slide => {
        const searchable = `${slide.title || ''} ${htmlToSearchText(slide.content)}`;
        slideSearchIndex.set(slide.id, searchable.toLowerCase());
    });
}

function slideMatchesSearch(slide, query = sidebarSearchQuery) {
    if (!query) return true;
    const searchable = slideSearchIndex.get(slide.id);
    if (searchable) return searchable.includes(query);
    const fallback = `${slide.title || ''} ${htmlToSearchText(slide.content)}`.toLowerCase();
    return fallback.includes(query);
}

function highlightMatch(text, query = sidebarSearchQuery) {
    const source = String(text || '');
    if (!query) return escapeHtml(source);

    const lowerSource = source.toLowerCase();
    let index = 0;
    let output = '';

    while (index < source.length) {
        const matchAt = lowerSource.indexOf(query, index);
        if (matchAt === -1) {
            output += escapeHtml(source.slice(index));
            break;
        }

        output += escapeHtml(source.slice(index, matchAt));
        output += `<mark class="nav-match">${escapeHtml(source.slice(matchAt, matchAt + query.length))}</mark>`;
        index = matchAt + query.length;
    }

    return output;
}

function setSidebarSearchQuery(value) {
    sidebarSearchQuery = normalizeSearchQuery(value);
    buildSidebar();
    updateNav();
}

function initSidebarSearch() {
    const input = document.getElementById('sidebarSearchInput');
    if (!input) return;

    input.addEventListener('input', (event) => {
        setSidebarSearchQuery(event.target.value);
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && input.value) {
            input.value = '';
            setSidebarSearchQuery('');
            event.stopPropagation();
        }
    });
}

// Build sidebar HTML
function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    let html = '';
    let hasExpandedDay = false;

    navStructure.forEach((day, dayIdx) => {
        const locked = isDayLocked(dayIdx);
        const lockedClass = locked ? 'locked' : '';
        const lockIcon = locked ? '<span class="lock-icon">🔒</span>' : '';
        const expandByDefault = sidebarSearchQuery ? true : !hasExpandedDay;

        if (day.display === 'day-only') {
            const slides = (day.chapters[0]?.slides || []).filter(slide => slideMatchesSearch(slide));
            if (sidebarSearchQuery && !slides.length) return;

            html += `<div class="nav-day ${lockedClass}">`;
            html += `<div class="nav-day-header ${expandByDefault ? 'expanded' : ''}" id="dayHeader${dayIdx}" onclick="toggleDay(${dayIdx})">`;
            html += `<span class="arrow">&#9654;</span>`;
            html += `<span>${highlightMatch(day.label)}${lockIcon}</span>`;
            html += `</div>`;
            html += `<div class="nav-day-chapters ${expandByDefault ? 'expanded' : ''}" id="dayChapters${dayIdx}">`;

            slides.forEach(slide => {
                const clickHandler = locked ? '' : `onclick="goToSlide('${slide.id}')"`;
                html += `<div class="nav-topic ${lockedClass}" id="nav-${slide.id}" ${clickHandler}>${highlightMatch(slide.title)}</div>`;
            });

            html += `</div></div>`;
            hasExpandedDay = true;
            return;
        }

        const filteredChapters = day.chapters
            .map((chapter, chIdx) => ({
                ...chapter,
                chIdx,
                slides: chapter.slides.filter(slide => slideMatchesSearch(slide))
            }))
            .filter(chapter => !sidebarSearchQuery || chapter.slides.length > 0);

        if (sidebarSearchQuery && !filteredChapters.length) return;

        html += `<div class="nav-day ${lockedClass}">`;
        html += `<div class="nav-day-header ${expandByDefault ? 'expanded' : ''}" id="dayHeader${dayIdx}" onclick="toggleDay(${dayIdx})">`;
        html += `<span class="arrow">&#9654;</span>`;
        html += `<span>${highlightMatch(day.label)}${lockIcon}</span>`;
        html += `</div>`;
        html += `<div class="nav-day-chapters ${expandByDefault ? 'expanded' : ''}" id="dayChapters${dayIdx}">`;

        filteredChapters.forEach((chapter) => {
            const chapterId = `day${dayIdx}_ch${chapter.chIdx}`;
            const chapterExpanded = sidebarSearchQuery;
            const hasSlides = chapter.slides.length > 0;

            if (!hasSlides) {
                // No slides — render as a plain non-interactive label, no caret
                html += `<div class="nav-chapter-header no-slides ${lockedClass}">`;
                html += `<span>${chapter.title}</span>`;
                html += `</div>`;
                return;
            }

            html += `<div class="nav-chapter-header ${lockedClass} ${chapterExpanded ? 'expanded' : ''}" onclick="toggleChapter('${chapterId}')">`;
            html += `<span class="arrow">&#9654;</span>`;
            html += `<span>${highlightMatch(chapter.title)}</span>`;
            html += `</div>`;
            html += `<div class="nav-chapter-topics ${chapterExpanded ? 'expanded' : ''}" id="${chapterId}">`;

            chapter.slides.forEach(slide => {
                const clickHandler = locked ? '' : `onclick="goToSlide('${slide.id}')"`;
                html += `<div class="nav-topic ${lockedClass}" id="nav-${slide.id}" ${clickHandler}>${highlightMatch(slide.title)}</div>`;
            });

            html += `</div>`;
        });

        html += `</div></div>`;
        hasExpandedDay = true;
    });

    nav.innerHTML = html || '<div class="nav-empty">No matching slides</div>';
}

// Expand/collapse a specific day. If single=true, collapse all others.
function expandDay(dayIdx, single = false) {
    navStructure.forEach((_, idx) => {
        const header = document.getElementById(`dayHeader${idx}`);
        const chapters = document.getElementById(`dayChapters${idx}`);
        if (!header || !chapters) return;

        const shouldExpand = idx === dayIdx;
        if (single) {
            header.classList.toggle('expanded', shouldExpand);
            chapters.classList.toggle('expanded', shouldExpand);
        } else if (shouldExpand) {
            header.classList.add('expanded');
            chapters.classList.add('expanded');
        }
    });
}

// Parse a label like "Day 4 — Thursday, Feb 27" and return a Date (year from today)
function parseDayLabelDate(label) {
    if (!label) return null;
    const m = label.match(/\b([A-Za-z]{3,9})\s+(\d{1,2})\b/);
    if (!m) return null;
    const monthName = m[1].toLowerCase();
    const dayNum = parseInt(m[2], 10);
    const monthMap = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, sept: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11
    };
    const monthIdx = monthMap[monthName];
    if (monthIdx === undefined || Number.isNaN(dayNum)) return null;
    const now = new Date();
    return new Date(now.getFullYear(), monthIdx, dayNum);
}

// Find day index matching today's date in the sidebar labels
function getDayIndexForToday() {
    const today = new Date();
    for (let i = 0; i < navStructure.length; i++) {
        const label = navStructure[i]?.label;
        const parsed = parseDayLabelDate(label);
        if (!parsed) continue;
        if (
            parsed.getFullYear() === today.getFullYear() &&
            parsed.getMonth() === today.getMonth() &&
            parsed.getDate() === today.getDate()
        ) {
            return i;
        }
    }
    return null;
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getSlidesForDay(dayLabel) {
    return allSlides.filter(slide => slide.dayLabel === dayLabel);
}

function buildDayPdfDocument(dayLabel, slides) {
    const exportTitle = `${CONFIG.sidebarBranding} - ${dayLabel}`;
    const generatedAt = new Date().toLocaleString();
    const baseHref = window.location.href.split('#')[0];

    const slideMarkup = slides.map((slide, idx) => `
        <section class="pdf-slide">
            <div class="pdf-slide-meta">
                <span>Slide ${idx + 1} of ${slides.length}</span>
                <span>${escapeHtml(slide.chapterLabel || '')}</span>
            </div>
            <h2 class="pdf-slide-title">${escapeHtml(slide.title || `Slide ${idx + 1}`)}</h2>
            <div class="slide-content">${slide.content}</div>
        </section>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(exportTitle)}</title>
    <base href="${escapeHtml(baseHref)}">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/components.css">
    <style>
        html, body {
            height: auto !important;
            overflow: visible !important;
        }
        body {
            display: block !important;
            margin: 0;
            background: #ffffff;
            color: #111827;
        }
        .pdf-export {
            max-width: 960px;
            margin: 0 auto;
            padding: 32px 28px 24px;
        }
        .pdf-cover {
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 24px;
            padding-bottom: 12px;
        }
        .pdf-cover h1 {
            font-size: 30px;
            margin: 0 0 8px;
            line-height: 1.2;
        }
        .pdf-cover p {
            margin: 0;
            color: #4b5563;
            font-size: 14px;
        }
        .pdf-slide {
            padding-top: 10px;
            margin-top: 20px;
            border-top: 1px solid #e5e7eb;
            page-break-after: always;
            break-after: page;
        }
        .pdf-slide:last-child {
            page-break-after: auto;
            break-after: auto;
        }
        .pdf-slide-meta {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .pdf-slide-title {
            margin-bottom: 18px;
            font-size: 28px;
            color: #111827;
        }
        .slide-content {
            animation: none !important;
        }
        .slide-content pre {
            white-space: pre-wrap !important;
            overflow-wrap: anywhere;
            word-break: break-word;
            break-inside: auto;
            page-break-inside: auto;
        }
        .slide-content pre code,
        .slide-content code {
            white-space: inherit !important;
            overflow-wrap: anywhere;
            word-break: break-word;
        }
        .slide-content .c-code-header {
            flex-wrap: wrap;
            row-gap: 6px;
        }
        .slide-content .c-code-title,
        .slide-content .c-code-lang,
        .slide-content .c-tree-name,
        .slide-content .c-tree-desc {
            overflow-wrap: anywhere;
            word-break: break-word;
        }
        .slide-content .c-tree-item {
            align-items: flex-start;
        }
        .slide-content .c-tree-root,
        .slide-content .c-code,
        .slide-content .c-grid,
        .slide-content .c-compare,
        .slide-content .c-stack,
        .slide-content .c-split,
        .slide-content .c-cards,
        .slide-content .c-callout,
        .slide-content .c-handson,
        .slide-content .diagram-box {
            break-inside: auto;
            page-break-inside: auto;
        }
        .slide-content table,
        .slide-content blockquote,
        .slide-content img {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        @page {
            size: A4 portrait;
            margin: 0.5in;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <main class="pdf-export">
        <section class="pdf-cover">
            <h1>${escapeHtml(CONFIG.sidebarBranding || 'Training')}</h1>
            <p><strong>${escapeHtml(dayLabel)}</strong> - ${slides.length} slides - Generated ${escapeHtml(generatedAt)}</p>
        </section>
        ${slideMarkup}
    </main>
</body>
</html>`;
}

function downloadDayPdf(dayLabel) {
    const slides = getSlidesForDay(dayLabel);
    if (!slides.length) {
        window.alert(`No slides found for ${dayLabel}.`);
        return;
    }

    const exportWindow = window.open('', '_blank');
    if (!exportWindow) {
        window.alert('Popup blocked. Please allow popups, then try downloading the PDF again.');
        return;
    }

    exportWindow.document.open();
    exportWindow.document.write(buildDayPdfDocument(dayLabel, slides));
    exportWindow.document.close();

    const triggerPrint = () => {
        setTimeout(() => {
            exportWindow.focus();
            exportWindow.print();
        }, 250);
    };

    if (exportWindow.document.readyState === 'complete') {
        triggerPrint();
    } else {
        exportWindow.addEventListener('load', triggerPrint, { once: true });
    }

    exportWindow.addEventListener('afterprint', () => {
        exportWindow.close();
    }, { once: true });
}

function downloadCurrentDayPdf() {
    const current = allSlides[currentSlideIndex];
    if (!current || !current.dayLabel) {
        window.alert('No active day found to export.');
        return;
    }
    downloadDayPdf(current.dayLabel);
}

// Toggle day expand/collapse
function toggleDay(dayIdx) {
    const header = document.getElementById(`dayHeader${dayIdx}`);
    const chapters = document.getElementById(`dayChapters${dayIdx}`);
    if (!header || !chapters) return;
    header.classList.toggle('expanded');
    chapters.classList.toggle('expanded');
}

// Toggle chapter expand/collapse
function toggleChapter(chapterId) {
    const el = document.getElementById(chapterId);
    if (!el) return;
    const header = el.previousElementSibling;
    if (!header) return;
    header.classList.toggle('expanded');
    el.classList.toggle('expanded');
}

// Navigate to a specific slide by ID
function goToSlide(slideId) {
    const idx = allSlides.findIndex(s => s.id === slideId);
    if (idx >= 0) {
        // Check if this slide belongs to a locked day
        const slide = allSlides[idx];
        const dayIdx = navStructure.findIndex(day => day.label === slide.dayLabel);
        if (dayIdx >= 0 && isDayLocked(dayIdx)) {
            console.warn('[LOCKED] Cannot navigate to', slideId, '- Day is locked');
            return; // Prevent navigation to locked days
        }

        currentSlideIndex = idx;
        renderSlide();
        updateNav();
    }
}

// Next slide
function nextSlide() {
    if (currentSlideIndex < allSlides.length - 1) {
        let nextIdx = currentSlideIndex + 1;

        // Skip locked days
        while (nextIdx < allSlides.length) {
            const slide = allSlides[nextIdx];
            const dayIdx = navStructure.findIndex(day => day.label === slide.dayLabel);
            if (dayIdx >= 0 && isDayLocked(dayIdx)) {
                nextIdx++;
            } else {
                break; // Found unlocked slide
            }
        }

        if (nextIdx < allSlides.length) {
            currentSlideIndex = nextIdx;
            renderSlide();
            updateNav();
        }
    }
}

// Previous slide
function prevSlide() {
    if (currentSlideIndex > 0) {
        let prevIdx = currentSlideIndex - 1;

        // Skip locked days
        while (prevIdx >= 0) {
            const slide = allSlides[prevIdx];
            const dayIdx = navStructure.findIndex(day => day.label === slide.dayLabel);
            if (dayIdx >= 0 && isDayLocked(dayIdx)) {
                prevIdx--;
            } else {
                break; // Found unlocked slide
            }
        }

        if (prevIdx >= 0) {
            currentSlideIndex = prevIdx;
            renderSlide();
            updateNav();
        }
    }
}

// Render current slide
function renderSlide() {
    const slide = allSlides[currentSlideIndex];
    if (!slide) return;

    // Update content
    const container = document.getElementById('slideContent');
    container.innerHTML = slide.content;
    container.style.animation = 'none';
    container.offsetHeight; // trigger reflow
    container.style.animation = '';

    // Scroll to top
    document.querySelector('.slide-container').scrollTop = 0;

    // Update label
    const label = document.getElementById('slideLabel');
    label.textContent = slide.chapterLabel;

    // Update counter
    const counter = document.getElementById('slideCounter');
    counter.textContent = `${currentSlideIndex + 1} / ${allSlides.length}`;

    // Update progress
    const fill = document.getElementById('progressFill');
    const pct = ((currentSlideIndex + 1) / allSlides.length) * 100;
    fill.style.width = `${pct}%`;

    // Update button states
    document.getElementById('prevBtn').disabled = currentSlideIndex === 0;
    document.getElementById('nextBtn').disabled = currentSlideIndex === allSlides.length - 1;

    // Update URL hash
    window.location.hash = slide.id;
}

// Update sidebar active state
function updateNav() {
    const slide = allSlides[currentSlideIndex];
    if (!slide) return;

    // Remove all active
    document.querySelectorAll('.nav-topic').forEach(el => el.classList.remove('active'));

    // Set active
    const active = document.getElementById(`nav-${slide.id}`);
    if (active) {
        active.classList.add('active');
        // Ensure parent sections are expanded
        let parent = active.parentElement;
        while (parent) {
            if (parent.classList.contains('nav-day-chapters') || parent.classList.contains('nav-chapter-topics')) {
                parent.classList.add('expanded');
                if (parent.previousElementSibling) {
                    parent.previousElementSibling.classList.add('expanded');
                }
            }
            parent = parent.parentElement;
        }
        // Scroll into view
        active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    sidebar.classList.toggle('collapsed');
    toggle.classList.toggle('visible', sidebar.classList.contains('collapsed'));
}

// Schedule modal
function toggleSchedule() {
    const modal = document.getElementById('scheduleModal');
    modal.classList.toggle('open');
}

function closeModal(e) {
    if (e.target === e.currentTarget) {
        toggleSchedule();
    }
}

// Build schedule table
function buildSchedule() {
    const body = document.getElementById('scheduleBody');
    const hasSessionPlan = typeof SESSION_PLAN !== 'undefined' && SESSION_PLAN && Array.isArray(SESSION_PLAN.days);
    const hasSlideIndex = typeof SLIDES_BY_ID !== 'undefined' && SLIDES_BY_ID;

    if (!hasSessionPlan || !hasSlideIndex) {
        body.innerHTML = '<p class="muted">Schedule unavailable.</p>';
        console.warn('[WARN] SESSION_PLAN or SLIDES_BY_ID missing; schedule not built.');
        return;
    }

    const schedule = SESSION_PLAN.days.map(day => {
        const slideIds = Array.isArray(day.slideIds) ? day.slideIds : [];
        const topics = slideIds
            .map(id => SLIDES_BY_ID[id]?.title)
            .filter(Boolean);
        return { day: day.label || `Day ${day.id || ''}`.trim(), topics };
    });

    let html = '<table>';
    html += '<thead><tr><th>Day</th><th>Topics</th></tr></thead>';
    html += '<tbody>';
    schedule.forEach(s => {
        html += `<tr><td class="day-label">${s.day}</td><td>${s.topics.join('<br>')}</td></tr>`;
    });
    html += '</tbody></table>';
    body.innerHTML = html;
}
