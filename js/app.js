// ===== SEMOSS Training - App Controller =====

let currentSlideIndex = 0;
let allSlides = [];
let navStructure = [];

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    buildNavStructure();
    buildSidebar();
    buildSchedule();

    // Flatten all slides for sequential navigation
    allSlides = [];
    navStructure.forEach(day => {
        day.chapters.forEach(chapter => {
            chapter.slides.forEach(slide => {
                allSlides.push({
                    ...slide,
                    dayLabel: day.label,
                    chapterLabel: chapter.title
                });
            });
        });
    });

    // Load initial slide (check URL hash)
    // Important: This must happen AFTER allSlides is built
    const hash = window.location.hash.slice(1);
    if (hash && allSlides.length > 0) {
        const idx = allSlides.findIndex(s => s.id === hash);
        if (idx >= 0) {
            currentSlideIndex = idx;
        } else {
            console.warn(`Slide not found for hash: #${hash}, defaulting to first slide`);
            currentSlideIndex = 0;
        }
    }

    renderSlide();
    updateNav();

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
        if (hash && allSlides.length > 0) {
            const idx = allSlides.findIndex(s => s.id === hash);
            if (idx >= 0 && idx !== currentSlideIndex) {
                currentSlideIndex = idx;
                renderSlide();
                updateNav();
            }
        }
    });
});

// Build navigation structure from slide data
function buildNavStructure() {
    navStructure = [];

    // Collect all loaded day data
    const dayDataSources = [
        typeof day1Data !== 'undefined' ? day1Data : null,
        typeof day2Data !== 'undefined' ? day2Data : null,
        typeof day3Data !== 'undefined' ? day3Data : null,
        typeof day4Data !== 'undefined' ? day4Data : null,
        typeof day5Data !== 'undefined' ? day5Data : null,
    ];

    dayDataSources.forEach(dayData => {
        if (dayData) navStructure.push(dayData);
    });
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

        day.chapters.forEach((chapter, chIdx) => {
            const chapterId = `day${dayIdx}_ch${chIdx}`;
            html += `<div class="nav-chapter-header ${isFirstDay ? 'expanded' : ''}" onclick="toggleChapter('${chapterId}')">`;
            html += `<span class="arrow">&#9654;</span>`;
            html += `<span>${chapter.title}</span>`;
            html += `</div>`;
            html += `<div class="nav-chapter-topics ${isFirstDay ? 'expanded' : ''}" id="${chapterId}">`;

            chapter.slides.forEach(slide => {
                html += `<div class="nav-topic" id="nav-${slide.id}" onclick="goToSlide('${slide.id}')">${slide.title}</div>`;
            });

            html += `</div>`;
        });

        html += `</div></div>`;
    });

    nav.innerHTML = html;
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
    const schedule = [
        { day: 'Day 1 - Monday, Feb 24', topics: ['Welcome & Introduction', 'Platform Fundamentals', 'Engines: The Data Layer', 'Pixel & Reactors'] },
        { day: 'Day 2 - Tuesday, Feb 25', topics: ['Pro-Code Apps (@semoss/sdk)', 'Custom Reactors', 'Custom Python'] },
        { day: 'Day 3 - Wednesday, Feb 26', topics: ['Pixel Advanced', 'Message Structure', 'API Integration', 'Architecture Deep Dive'] },
        { day: 'Day 4 - Thursday, Feb 27', topics: ['Playground', 'Frontend Blocks & Cells', 'App Building', 'Notebooks & Insights'] },
        { day: 'Day 5 - Friday, Feb 28', topics: ['Docker Deployment', 'Security & Authentication', 'Admin & Monitoring', 'Capstone Project'] },
    ];

    let html = '<table>';
    html += '<thead><tr><th>Day</th><th>Topics</th></tr></thead>';
    html += '<tbody>';
    schedule.forEach(s => {
        html += `<tr><td class="day-label">${s.day}</td><td>${s.topics.join('<br>')}</td></tr>`;
    });
    html += '</tbody></table>';
    body.innerHTML = html;
}
