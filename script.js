/* =========================================================
   Dimitar Porkov — Portfolio
   ========================================================= */

(function () {
    'use strict';

    const root = document.documentElement;

    /* ---------- Theme ---------- */
    const themeToggle = document.getElementById('themeToggle');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Initial theme: saved preference, else system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
        applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        applyTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    /* ---------- Mobile menu ---------- */
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            burger.setAttribute('aria-expanded', String(open));
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Dynamic year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll('.section');
    if ('IntersectionObserver' in window) {
        revealEls.forEach(el => el.classList.add('reveal'));
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => io.observe(el));
    }

    /* ---------- PDF export ---------- */
    // html2pdf (~1MB) is only needed when the user actually exports, so it
    // is lazy-loaded on first click instead of blocking every page load.
    const HTML2PDF_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    let html2pdfLoading = null;
    function loadHtml2pdf() {
        if (typeof html2pdf !== 'undefined') return Promise.resolve();
        if (!html2pdfLoading) {
            html2pdfLoading = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = HTML2PDF_SRC;
                s.onload = resolve;
                s.onerror = () => { html2pdfLoading = null; reject(new Error('html2pdf failed to load')); };
                document.head.appendChild(s);
            });
        }
        return html2pdfLoading;
    }

    const exportBtn = document.getElementById('exportPdfBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportBtn.setAttribute('aria-busy', 'true');

            loadHtml2pdf().then(() => {
                const element = document.getElementById('resume-content');
                const body = document.body;

                // Switch to a clean, light, print-friendly rendering state.
                // Force any scroll-reveal sections fully visible so they aren't
                // captured mid-animation (or invisible) in the exported PDF —
                // remembering which ones we forced so we can restore them.
                body.classList.add('pdf-rendering');
                const forced = [];
                document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
                    el.classList.add('in-view');
                    forced.push(el);
                });
                const restore = () => {
                    body.classList.remove('pdf-rendering');
                    forced.forEach(el => el.classList.remove('in-view'));
                    exportBtn.removeAttribute('aria-busy');
                };

                const opt = {
                    margin: 0.5,
                    filename: 'Dimitar_Porkov_Resume.pdf',
                    image: { type: 'jpeg', quality: 0.95 },
                    html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
                    pagebreak: {
                        mode: ['css', 'legacy'],
                        avoid: ['.timeline-item', '.contact-card', '.about-aside', '.feature-list li', '.section-head', '.skill-card', '.testimonial']
                    }
                };

                return html2pdf().set(opt).from(element).save()
                    .then(restore)
                    .catch(err => {
                        console.error('PDF generation error:', err);
                        restore();
                        alert('Error generating PDF. Please try again.');
                    });
            }).catch(err => {
                console.error(err);
                exportBtn.removeAttribute('aria-busy');
                alert('Could not load the PDF library. Please check your connection and try again.');
            });
        });
    }

    /* ---------- Scrollspy nav ---------- */
    const navAnchors = document.querySelectorAll('.nav-links a');
    const navMap = {};
    navAnchors.forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) navMap[href.slice(1)] = a;
    });
    const spySections = document.querySelectorAll('main section[id]');
    const siteNav = document.getElementById('siteNav');
    if (spySections.length) {
        let spyTicking = false;
        let spyOffset = 130;
        const measureSpyOffset = () => {
            // The "current section" line sits a bit below the sticky nav, so
            // the offset follows the nav's real height instead of a magic number.
            spyOffset = (siteNav ? siteNav.offsetHeight : 66) + 64;
        };
        const updateSpy = () => {
            spyTicking = false;
            let current = null;
            spySections.forEach(s => {
                if (s.getBoundingClientRect().top <= spyOffset) current = s.id;
            });
            navAnchors.forEach(a => a.classList.toggle('active', !!current && navMap[current] === a));
        };
        const onScroll = () => {
            if (!spyTicking) { spyTicking = true; requestAnimationFrame(updateSpy); }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => { measureSpyOffset(); onScroll(); });
        measureSpyOffset();
        updateSpy();
    }

    /* ---------- Hero constellation ---------- */
    const hero = document.querySelector('.hero');
    const canvas = document.getElementById('heroCanvas');
    if (hero && canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Same breakpoint as the CSS mobile styles — one source of truth.
        const mqMobile = window.matchMedia('(max-width: 680px)');

        const ICONS = {
            user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg>',
            skills: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5"/></svg>',
            exp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
            lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>',
            mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
        };
        const LINKS = [
            { t: 'About',      d: 'Who I am',            href: '#about',      ic: 'user' },
            { t: 'Skills',     d: 'My tech stack',       href: '#skills',     ic: 'skills' },
            { t: 'Experience', d: "Where I've worked",   href: '#experience', ic: 'exp' },
            { t: 'Home Lab',   d: 'Projects I build',    href: '#homelab',    ic: 'lab' },
            { t: 'Contact',    d: 'Get in touch',        href: '#contact',    ic: 'mail' }
        ];

        let accent = 'rgb(91,140,255)', dotColor = 'rgb(151,161,179)', labelColor = 'rgb(151,161,179)';
        function readColors() {
            const cs = getComputedStyle(root);
            accent = cs.getPropertyValue('--accent').trim() || accent;
            dotColor = cs.getPropertyValue('--text-muted').trim() || dotColor;
            labelColor = cs.getPropertyValue('--text').trim() || labelColor;
        }
        readColors();

        const pop = document.createElement('div');
        pop.className = 'cn-pop';
        pop.innerHTML = '<div class="cn-pop-head"><span class="cn-ico"></span><h4></h4></div><p></p>';
        hero.appendChild(pop);
        const popIco = pop.querySelector('.cn-ico');
        const popTitle = pop.querySelector('h4');
        const popDesc = pop.querySelector('p');

        let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
        let nodes = [], hotspots = [], interactive = true, raf = null, hovered = null;

        function showPop(node) {
            if (!node || !node.link) return;
            hovered = node;
            popTitle.textContent = node.link.t;
            popDesc.textContent = node.link.d;
            popIco.innerHTML = ICONS[node.link.ic];
            pop.style.left = node.x + 'px';
            pop.style.top = node.y + 'px';
            pop.classList.add('show');
        }
        function hidePop() { hovered = null; pop.classList.remove('show'); }

        function build() {
            interactive = !mqMobile.matches;
            const count = interactive ? Math.min(56, Math.round(W / 26)) : 22;
            nodes = [];
            for (let i = 0; i < count; i++) {
                nodes.push({
                    x: Math.random() * W, y: Math.random() * H,
                    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
                    r: 1.2 + Math.random() * 1.1
                });
            }
            // Nav nodes are only meaningful with hotspots (desktop); on
            // small screens leave every node as a plain ambient dot.
            if (interactive) {
                LINKS.forEach((l, i) => { nodes[i].link = l; nodes[i].r = 4; });
            }

            hotspots.forEach(h => h.el.remove());
            hotspots = [];
            if (interactive) {
                LINKS.forEach((l, i) => {
                    const a = document.createElement('a');
                    a.className = 'cn-hotspot';
                    a.href = l.href;
                    a.setAttribute('aria-label', l.t);
                    a.addEventListener('mouseenter', () => showPop(nodes[i]));
                    a.addEventListener('mouseleave', hidePop);
                    a.addEventListener('focus', () => showPop(nodes[i]));
                    a.addEventListener('blur', hidePop);
                    hero.appendChild(a);
                    hotspots.push({ el: a, node: nodes[i] });
                });
            } else {
                hidePop();
            }
        }

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = hero.clientWidth; H = hero.clientHeight;
            canvas.width = W * dpr; canvas.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            build();
        }

        // Mobile browsers fire resize when the URL bar shows/hides during
        // scroll — only the height changes, so skip the full rebuild then.
        function onResize() {
            if (hero.clientWidth === W) {
                H = hero.clientHeight;
                canvas.height = H * dpr;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                return;
            }
            resize();
        }

        const TAU = Math.PI * 2;
        function frame() {
            ctx.clearRect(0, 0, W, H);
            if (!reduceMotion) {
                for (const n of nodes) {
                    n.x += n.vx; n.y += n.vy;
                    if (n.x < 0 || n.x > W) n.vx *= -1;
                    if (n.y < 0 || n.y > H) n.vy *= -1;
                }
            }
            ctx.strokeStyle = accent; ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 130) {
                        ctx.globalAlpha = 0.16 * (1 - dist / 130);
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
            for (const n of nodes) {
                if (n.link) {
                    ctx.fillStyle = accent;
                    ctx.beginPath(); ctx.arc(n.x, n.y, n.r + (hovered === n ? 2 : 0), 0, TAU); ctx.fill();
                    ctx.globalAlpha = 0.4; ctx.strokeStyle = accent;
                    ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 5, 0, TAU); ctx.stroke();
                    ctx.globalAlpha = 1;
                    if (interactive) {
                        ctx.fillStyle = labelColor; ctx.globalAlpha = 0.85;
                        ctx.font = '600 11px Inter, sans-serif'; ctx.textAlign = 'center';
                        ctx.fillText(n.link.t, n.x, n.y - 11);
                        ctx.globalAlpha = 1;
                    }
                } else {
                    ctx.fillStyle = dotColor; ctx.globalAlpha = 0.5;
                    ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, TAU); ctx.fill();
                    ctx.globalAlpha = 1;
                }
            }
            for (const h of hotspots) { h.el.style.left = h.node.x + 'px'; h.el.style.top = h.node.y + 'px'; }
            if (hovered) { pop.style.left = hovered.x + 'px'; pop.style.top = hovered.y + 'px'; }
            raf = requestAnimationFrame(frame);
        }

        // Run the animation only while the hero is actually on screen AND
        // the tab is visible — no wasted CPU below the fold or in background.
        let heroOnScreen = true;
        function startLoop() { if (!raf) raf = requestAnimationFrame(frame); }
        function stopLoop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
        function syncLoop() {
            if (heroOnScreen && !document.hidden) startLoop();
            else stopLoop();
        }

        resize();
        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                heroOnScreen = entries[0].isIntersecting;
                syncLoop();
            }).observe(hero);
        }
        syncLoop();
        window.addEventListener('resize', onResize);
        document.addEventListener('visibilitychange', syncLoop);
        if (themeToggle) themeToggle.addEventListener('click', readColors);
    }
})();
