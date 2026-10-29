import { CONTES, LANGUES } from './data.js';
import { renderScene, attachParallax } from './scenes.js';
import { $, cardHTML, initReveal } from './ui.js';

/* Décor de la veillée en arrière-plan */
const heroBg = $('#hero-bg');
heroBg.innerHTML = renderScene({
  sky: 'night',
  items: [
    { k: 'baobab', x: 1330, layer: 'mid', s: 1.45 },
    { k: 'hut', x: 760, layer: 'far' }, { k: 'hut', x: 880, layer: 'far' }, { k: 'granary', x: 980, layer: 'far' },
    { k: 'griot', x: 1040, s: 0.95 },
    { k: 'fire', x: 1180, s: 0.9 },
    { k: 'crowd', x: 1380, n: 5, w: 230, s: 0.75 },
    { k: 'grass', x: 620, w: 300 },
  ],
}, 'accueil');
attachParallax($('.hero'));

/* Braises qui montent du feu, dessinées sur un canvas */
const canvas = $('#embers');
const ctx = canvas.getContext('2d');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let sparks = [];
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function spawn() {
  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  sparks.push({
    x: w * (0.62 + Math.random() * 0.2),
    y: h * 0.86,
    vx: (Math.random() - 0.3) * 0.5,
    vy: -0.6 - Math.random() * 1.1,
    life: 1,
    r: 0.8 + Math.random() * 1.8,
  });
}
let running = true;
function frame() {
  if (!running) return;
  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);
  if (sparks.length < 70 && Math.random() < 0.5) spawn();
  sparks = sparks.filter((p) => p.life > 0);
  for (const p of sparks) {
    p.x += p.vx + Math.sin(p.y / 40) * 0.25;
    p.y += p.vy;
    p.life -= 0.006;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.life > 0.5 ? '#FFD38A' : '#FF8A3D';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}
if (!reduce) {
  resize();
  addEventListener('resize', resize);
  new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    if (running) requestAnimationFrame(frame);
  }).observe(canvas);
}

/* Chiffres et contenus dynamiques */
$('#stat-recits').textContent = CONTES.length;
$('#stat-langues').textContent = new Set(CONTES.map((c) => c.langue)).size;
$('#stat-tableaux').textContent = CONTES.reduce((n, c) => n + c.tableaux.length, 0);

const featured = ['yennenga', 'lievre-hyene', 'tiebele'];
$('#featured').innerHTML = featured
  .map((id) => CONTES.find((c) => c.id === id))
  .map((c) => cardHTML(c))
  .join('');

const used = new Set(CONTES.map((c) => c.langue));
$('#langs').innerHTML = Object.entries(LANGUES)
  .filter(([code]) => used.has(code))
  .map(([code, l]) => {
    const n = CONTES.filter((c) => c.langue === code).length;
    return `<article class="lang reveal">
      <span class="who">${l.peuple} · ${l.zone}</span>
      <h3>${l.nom}</h3>
      <p>${l.texte}</p>
      <p><a href="contes.html?langue=${code}">${n} récit${n > 1 ? 's' : ''}</a></p>
    </article>`;
  })
  .join('');
initReveal();
