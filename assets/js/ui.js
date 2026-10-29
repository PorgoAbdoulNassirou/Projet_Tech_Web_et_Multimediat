/* Comportements communs à toutes les pages. */
import { CONTES, LANGUES, typo } from './data.js';
import { renderScene } from './scenes.js';
import { icon } from './icons.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const storyUrl = (id) => `conte.html?id=${encodeURIComponent(id)}`;

export function coverScene(c, title = true) {
  const t = c.tableaux[c.couverture ?? 0];
  return renderScene(t.scene, c.id + (c.couverture ?? 0), { title: title ? `Illustration : ${t.titre}` : '' });
}

export function cardHTML(c, { headingLevel = 3 } = {}) {
  const h = `h${headingLevel}`;
  return `<article class="card">
    <div class="card-media">${coverScene(c)}<span class="badge" data-type="${c.type}">${c.type}</span></div>
    <div class="card-body">
      <${h}><a href="${storyUrl(c.id)}">${typo(c.titre)}</a></${h}>
      <p>${typo(c.accroche)}</p>
      <div class="meta">
        <span>${icon('pin')}${c.lieu.nom.split(',')[0]}</span>
        <span>${icon('globe')}${LANGUES[c.langue].nom}</span>
        <span>${icon('clock')}${c.duree} min</span>
      </div>
    </div>
  </article>`;
}

export function randomStory(exclude) {
  const pool = CONTES.filter((c) => c.id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

let toastTimer;
export function toast(msg) {
  let el = $('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.append(el);
  }
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
}

export async function share(title, url = location.href) {
  if (navigator.share) {
    try { await navigator.share({ title, url }); } catch { /* partage annulé */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast('Lien copié dans le presse-papiers');
  } catch {
    toast(url);
  }
}

function initNav() {
  const btn = $('.nav-toggle');
  const nav = $('#nav');
  if (!btn || !nav) return;
  const close = () => {
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    if (open) nav.querySelector('a')?.focus();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
}

function initRandomLinks() {
  $$('[data-random]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      location.href = storyUrl(randomStory().id);
    });
  });
}

export function initReveal(root = document) {
  const els = $$('.reveal:not(.is-in)', root);
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

/* Les illustrations des vignettes ne s'animent qu'au survol,
   pour économiser la batterie sur les pages qui en affichent beaucoup. */
function pauseThumbnails() {
  const style = document.createElement('style');
  style.textContent = '.card .scene *, .map-item .scene * { animation-play-state: paused; } .card:hover .scene *, .card:focus-within .scene * { animation-play-state: running; }';
  document.head.append(style);
}

function registerSW() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && location.hostname !== 'localhost') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

export function hydrateIcons(root = document) {
  $$('[data-icon]', root).forEach((el) => {
    el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon));
    el.removeAttribute('data-icon');
  });
}

hydrateIcons();
initNav();
initRandomLinks();
initReveal();
pauseThumbnails();
registerSW();
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
