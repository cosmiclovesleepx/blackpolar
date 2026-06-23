'use strict';

/**
 * public/js/index.js — Black Polar Portfolio App
 * Cargado con: <script src="/public/js/index.js" defer>
 */

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const TEAM = [
  {
    id:   'ID-001',
    name: 'Samuel Figueroa',
    role: 'Principal Software Developer',
  },
  {
    id:   'ID-002',
    name: 'Franco Muller',
    role: 'Head Administrator',
  },
  {
    id:   'ID-003',
    name: 'Jhonathan Carlos',
    role: 'Assistant Software Engineer',
  },
];

/* ══════════════════════════════════════════════════════════
   RENDER — Team
══════════════════════════════════════════════════════════ */
function renderTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  // Person icon SVG (blank placeholder)
  const personIcon = `
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
      stroke="var(--white)" stroke-width="1" class="team-avatar-icon"
      aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>`;

  grid.innerHTML = TEAM.map((m, i) => `
    <div class="team-card rv ${i > 0 ? 'd' + i : ''}">
      <div class="team-avatar" aria-hidden="true">
        ${personIcon}
      </div>
      <div class="team-info">
        <div class="team-id">
          <div class="dot-live" style="width:5px;height:5px;" aria-hidden="true"></div>
          ${m.id} · Active
        </div>
        <h3 class="team-name">${m.name}</h3>
        <p class="team-role">${m.role}</p>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════════
   HEADER SCROLL
══════════════════════════════════════════════════════════ */
function initScrollHeader() {
  const hdr = document.getElementById('hdr');
  if (!hdr) return;
  const update = () => hdr.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ══════════════════════════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════════════════════════ */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

  const observe = () => document.querySelectorAll('.rv:not(.in)').forEach(el => observer.observe(el));
  observe();

  // Re-observe after team renders
  const teamGrid = document.getElementById('team-grid');
  if (teamGrid) new MutationObserver(observe).observe(teamGrid, { childList: true });
}

/* ══════════════════════════════════════════════════════════
   STATS COUNTER
══════════════════════════════════════════════════════════ */
function initCounters() {
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const DURATION = 1400;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const t0     = performance.now();
      const tick   = now => {
        const p = Math.min((now - t0) / DURATION, 1);
        el.textContent = Math.round(easeOut(p) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════
   MOBILE NAV
══════════════════════════════════════════════════════════ */
function initMobileNav() {
  const nav    = document.getElementById('mob-nav');
  const toggle = document.getElementById('mob-toggle');
  const close  = document.getElementById('mob-close');
  if (!nav || !toggle) return;

  const open  = () => { nav.classList.add('open'); nav.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; toggle.setAttribute('aria-expanded', 'true'); };
  const shut  = () => { nav.classList.remove('open'); nav.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; toggle.setAttribute('aria-expanded', 'false'); };

  toggle.addEventListener('click', () => nav.classList.contains('open') ? shut() : open());
  if (close) close.addEventListener('click', shut);

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
  window.addEventListener('resize', () => { if (window.innerWidth > 768) shut(); }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   PROJECT FILTERS
══════════════════════════════════════════════════════════ */
function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      document.querySelectorAll('.proj-row').forEach(row => {
        const cat = row.dataset.cat || '';
        row.style.display = (filter === 'all' || cat.includes(filter)) ? 'grid' : 'none';
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════════════════════ */
function initYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
function init() {
  renderTeam();
  initScrollHeader();
  initReveal();
  initCounters();
  initMobileNav();
  initFilters();
  initYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
