// ===== SEMOSS Training - App Controller =====

let currentSlideIndex = 0;
let allSlides = [];
let navStructure = [];

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
            currentSlideIndex = idx;
            console.log('[DEBUG] Setting currentSlideIndex to', idx, '(slide:', allSlides[idx]?.id, ')');
        } else {
            console.warn(`Slide not found for hash: #${hash}, defaulting to first slide`);
            currentSlideIndex = 0;
        }
    } else {
        const autoDayIdx = getDayIndexForToday();
        if (autoDayIdx !== null && allSlides.length > 0) {
            const dayLabel = navStructure[autoDayIdx]?.label;
            const firstIdx = allSlides.findIndex(s => s.dayLabel === dayLabel);
            if (firstIdx >= 0) {
                currentSlideIndex = firstIdx;
                console.log('[DEBUG] Auto-jump to today:', dayLabel, 'slide index', firstIdx);
            } else {
                console.log('[DEBUG] Today matched but no slides found; defaulting to first slide');
            }
        } else {
            console.log('[DEBUG] No hash or allSlides empty, defaulting to first slide');
        }
    }

    renderSlide();
    updateNav();
    // Expand sidebar to today's day (if matched) after initial render
    const autoDayIdx = getDayIndexForToday();
    if (autoDayIdx !== null) expandDay(autoDayIdx, true);

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

// Build sidebar HTML
function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    let html = '';

    navStructure.forEach((day, dayIdx) => {
        const isFirstDay = dayIdx === 0;
        html += `<div class="nav-day">`;
        html += `<div class="nav-day-header ${isFirstDay ? 'expanded' : ''}" onclick="toggleDay(${dayIdx})">`;
        html += `<span class="arrow">&#9654;</span>`;
        html += `<span>${day.label}</span>`;
        html += `</div>`;
        html += `<div class="nav-day-chapters ${isFirstDay ? 'expanded' : ''}" id="dayChapters${dayIdx}">`;

        if (day.display === 'day-only') {
            const slides = day.chapters[0]?.slides || [];
            slides.forEach(slide => {
                html += `<div class="nav-topic" id="nav-${slide.id}" onclick="goToSlide('${slide.id}')">${slide.title}</div>`;
            });
        } else {
            day.chapters.forEach((chapter, chIdx) => {
                const chapterId = `day${dayIdx}_ch${chIdx}`;
                html += `<div class="nav-chapter-header" onclick="toggleChapter('${chapterId}')">`;
                html += `<span class="arrow">&#9654;</span>`;
                html += `<span>${chapter.title}</span>`;
                html += `</div>`;
                html += `<div class="nav-chapter-topics" id="${chapterId}">`;

                chapter.slides.forEach(slide => {
                    html += `<div class="nav-topic" id="nav-${slide.id}" onclick="goToSlide('${slide.id}')">${slide.title}</div>`;
                });

                html += `</div>`;
            });
        }

        html += `</div></div>`;
    });

    nav.innerHTML = html;
}

// Expand/collapse a specific day. If single=true, collapse all others.
function expandDay(dayIdx, single = false) {
    const headers = document.querySelectorAll('.nav-day-header');
    const chapters = document.querySelectorAll('.nav-day-chapters');
    headers.forEach((header, idx) => {
        const ch = chapters[idx];
        if (!ch) return;
        const shouldExpand = idx === dayIdx;
        if (single) {
            header.classList.toggle('expanded', shouldExpand);
            ch.classList.toggle('expanded', shouldExpand);
        } else if (shouldExpand) {
            header.classList.add('expanded');
            ch.classList.add('expanded');
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

// Toggle day expand/collapse
function toggleDay(dayIdx) {
    const header = document.querySelectorAll('.nav-day-header')[dayIdx];
    const chapters = document.getElementById(`dayChapters${dayIdx}`);
    header.classList.toggle('expanded');
    chapters.classList.toggle('expanded');
}

// Toggle chapter expand/collapse
function toggleChapter(chapterId) {
    const el = document.getElementById(chapterId);
    const header = el.previousElementSibling;
    header.classList.toggle('expanded');
    el.classList.toggle('expanded');
}

// Navigate to a specific slide by ID
function goToSlide(slideId) {
    const idx = allSlides.findIndex(s => s.id === slideId);
    if (idx >= 0) {
        currentSlideIndex = idx;
        renderSlide();
        updateNav();
    }
}

// Next slide
function nextSlide() {
    if (currentSlideIndex < allSlides.length - 1) {
        currentSlideIndex++;
        renderSlide();
        updateNav();
    }
}

// Previous slide
function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
        updateNav();
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
