import { CONTES, LANGUES, TYPES, typo } from './data.js';
import { MAP, OUTLINE_PATH, project } from './geo.js';
import { $, $$, coverScene, storyUrl } from './ui.js';
import { icon } from './icons.js';

export const TYPE_COLORS = { Conte: '#E8B04B', 'Légende': '#D2643A', 'Récit historique': '#8FA2FF' };

/* Villes de repère (sans récit) et pays voisins, pour s'orienter. */
const CITIES = [
  ['Koudougou', -2.3627, 12.2526], ['Kaya', -1.0844, 13.0917], ['Dédougou', -3.4608, 12.4636],
  ['Gaoua', -3.1833, 10.3333], ['Djibo', -1.6306, 14.1022], ['Pô', -1.145, 11.1697],
];
const NEIGHBOURS = [
  ['MALI', -4.4, 14.6], ['NIGER', 2.0, 14.4], ['BÉNIN', 2.0, 10.5], ['TOGO', 0.55, 10.25],
  ['GHANA', -1.6, 9.75], ["CÔTE D'IVOIRE", -5.0, 9.55],
];

const params = new URLSearchParams(location.search);
const state = { id: null, type: '', view: '2d' };
let map3d = null;

/* ---------- Carte 2D (SVG) ---------- */
function build2D() {
  const grat = [];
  for (let lon = -5; lon <= 2; lon++) {
    const [x1, y1] = project(lon, MAP.bounds.latMax + 0.3), [x2, y2] = project(lon, MAP.bounds.latMin - 0.3);
    grat.push(`<path class="graticule" d="M${x1},${y1} L${x2},${y2}"/>`);
  }
  for (let lat = 10; lat <= 15; lat++) {
    const [x1, y1] = project(MAP.bounds.lonMin - 0.3, lat), [x2, y2] = project(MAP.bounds.lonMax + 0.3, lat);
    grat.push(`<path class="graticule" d="M${x1},${y1} L${x2},${y2}"/>`);
  }
  const cities = CITIES.map(([n, lon, lat]) => {
    const [x, y] = project(lon, lat);
    return `<circle class="city-dot" cx="${x}" cy="${y}" r="2.5"/><text class="city" x="${x + 7}" y="${y + 4}">${n}</text>`;
  }).join('');
  const neighbours = NEIGHBOURS.map(([n, lon, lat]) => {
    const [x, y] = project(lon, lat);
    return `<text x="${x}" y="${y}" text-anchor="middle" fill="#ADA08A" fill-opacity=".45" style="font:700 13px var(--font-ui);letter-spacing:.3em">${n}</text>`;
  }).join('');

  const pins = CONTES.map((c) => {
    const [x, y] = project(c.lieu.lon, c.lieu.lat);
    const anchor = x > MAP.width * 0.72 ? 'end' : 'start';
    const dx = anchor === 'end' ? -16 : 16;
    return `<g class="pin" data-id="${c.id}" tabindex="0" role="button" style="--pin:${TYPE_COLORS[c.type]}"
      aria-label="${c.titre}, ${c.type.toLowerCase()}, ${c.lieu.nom}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle class="halo" r="12"/><circle class="core" r="8"/>
      <text class="label" x="${dx}" y="5" text-anchor="${anchor}">${c.titre}</text></g>`;
  }).join('');

  $('#map2d').innerHTML = `<svg viewBox="-40 -30 ${MAP.width + 80} ${MAP.height + 60}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Carte du Burkina Faso avec ${CONTES.length} récits">
    <defs>
      <radialGradient id="land" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#2B2540"/><stop offset="100%" stop-color="#1A1628"/></radialGradient>
      <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#F7EFE0" fill-opacity=".07"/></pattern>
      <clipPath id="clip"><path d="${OUTLINE_PATH}"/></clipPath>
    </defs>
    ${grat.join('')}
    ${neighbours}
    <path class="country-glow" d="${OUTLINE_PATH}"/>
    <path class="country" d="${OUTLINE_PATH}"/>
    <rect width="${MAP.width}" height="${MAP.height}" fill="url(#dots)" clip-path="url(#clip)"/>
    ${cities}
    <g id="pins">${pins}</g>
  </svg>`;

  $('#pins').addEventListener('click', (e) => {
    const g = e.target.closest('.pin');
    if (g) select(g.dataset.id, true);
  });
  $('#pins').addEventListener('keydown', (e) => {
    const g = e.target.closest('.pin');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(g.dataset.id, true); }
  });
}

/* ---------- Liste et filtres ---------- */
function buildList() {
  $('#list').innerHTML = CONTES.map((c) => `<li data-id="${c.id}">
    <button class="map-item" type="button" data-id="${c.id}">
      <span class="thumb">${coverScene(c, false)}</span>
      <span><strong>${typo(c.titre)}</strong><small>${c.lieu.nom.split(',')[0]} · ${c.type} · ${LANGUES[c.langue].nom}</small></span>
    </button></li>`).join('');
  $('#list').addEventListener('click', (e) => {
    const b = e.target.closest('.map-item');
    if (b) select(b.dataset.id, true);
  });

  const f = $('#filters');
  f.innerHTML = [['', 'Tous']].concat(TYPES.map((t) => [t, t])).map(([v, l]) =>
    `<button class="chip" type="button" data-v="${v}" aria-pressed="${v === ''}">${v ? `<span class="dot" style="color:${TYPE_COLORS[v]}"></span>` : ''}${l}</button>`).join('');
  f.addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    state.type = b.dataset.v;
    $$('.chip', f).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    applyFilter();
  });
}

const visible = (c) => !state.type || c.type === state.type;

function applyFilter() {
  CONTES.forEach((c) => {
    const on = visible(c);
    $(`.pin[data-id="${c.id}"]`)?.classList.toggle('is-dim', !on);
    $(`.pin[data-id="${c.id}"]`)?.setAttribute('tabindex', on ? '0' : '-1');
    $(`#list li[data-id="${c.id}"]`).hidden = !on;
  });
  map3d?.setFilter(visible);
  if (state.id && !visible(CONTES.find((c) => c.id === state.id))) select(null);
}

/* ---------- Sélection et aperçu ---------- */
function select(id, fromUser = false) {
  if (fromUser) stopTour();
  state.id = id;
  $$('.pin').forEach((p) => p.classList.toggle('is-active', p.dataset.id === id));
  $$('.map-item').forEach((b) => b.setAttribute('aria-current', String(b.dataset.id === id)));
  map3d?.select(id);

  const u = new URL(location.href);
  if (id) u.searchParams.set('id', id); else u.searchParams.delete('id');
  history.replaceState(null, '', u);

  const box = $('#preview');
  $('#stage').classList.toggle('has-preview', !!id);
  if (!id) { box.innerHTML = ''; return; }
  const c = CONTES.find((x) => x.id === id);
  $(`.map-item[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  box.innerHTML = `<article class="preview" aria-labelledby="pv-title">
    <div class="preview-media">${coverScene(c)}
      <span class="badge" data-type="${c.type}">${c.type}</span>
      <button class="icon-btn" type="button" data-close aria-label="Fermer l'aperçu">${icon('x')}</button>
    </div>
    <div class="preview-body">
      <h2 id="pv-title">${typo(c.titre)}</h2>
      <div class="meta"><span>${icon('pin')}${c.lieu.nom}</span><span>${icon('globe')}${c.peuple}, ${LANGUES[c.langue].nom}</span><span>${icon('clock')}${c.duree} min</span></div>
      <p>${typo(c.resume)}</p>
      <div class="row">
        <a class="btn btn-primary" href="${storyUrl(c.id)}">${icon('headphones')}Lire et écouter</a>
      </div>
    </div>
  </article>`;
  box.querySelector('[data-close]').addEventListener('click', () => {
    const pin = $(`.pin[data-id="${id}"]`);
    select(null, true);
    if (state.view === '2d') pin?.focus();
  });
}

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.id) select(null, true);
});

/* ---------- Bascule 2D / 3D ---------- */
async function setView(v) {
  state.view = v;
  $('#v2d').setAttribute('aria-pressed', String(v === '2d'));
  $('#v3d').setAttribute('aria-pressed', String(v === '3d'));
  $('#map2d').hidden = v !== '2d';
  $('#map3d').hidden = v !== '3d';
  $('#hint').innerHTML = v === '2d'
    ? '<kbd>Tab</kbd> pour parcourir les points, <kbd>Entrée</kbd> pour ouvrir'
    : 'Glisser pour tourner, molette pour zoomer';
  if (v === '3d') {
    if (!map3d) {
      $('#map3d').innerHTML = '<p class="webgl-fallback">Chargement du relief…</p>';
      try {
        const { createMap3D } = await import('./map3d.js');
        $('#map3d').innerHTML = '';
        map3d = createMap3D($('#map3d'), CONTES, { colors: TYPE_COLORS, onSelect: (id) => select(id, true) });
        map3d.setFilter(visible);
        map3d.select(state.id);
      } catch (err) {
        $('#map3d').innerHTML = '<p class="webgl-fallback">La vue 3D nécessite WebGL, qui n\'est pas disponible sur cet appareil. La carte 2D reste entièrement utilisable.</p>';
        console.error(err);
        return;
      }
    }
    map3d.start();
  } else {
    map3d?.stop();
  }
  const u = new URL(location.href);
  if (v === '3d') u.searchParams.set('vue', '3d'); else u.searchParams.delete('vue');
  history.replaceState(null, '', u);
}
$('#v2d').addEventListener('click', () => setView('2d'));
$('#v3d').addEventListener('click', () => setView('3d'));

/* ---------- Visite guidée ---------- */
let tourTimer = null;
function stopTour() {
  clearInterval(tourTimer);
  tourTimer = null;
  $('#tour').setAttribute('aria-pressed', 'false');
}
$('#tour').addEventListener('click', () => {
  if (tourTimer) { stopTour(); return; }
  const order = CONTES.filter(visible).sort((a, b) => b.lieu.lat - a.lieu.lat);
  let k = Math.max(0, order.findIndex((c) => c.id === state.id) + 1) % order.length;
  $('#tour').setAttribute('aria-pressed', 'true');
  const step = () => { select(order[k].id); k = (k + 1) % order.length; };
  step();
  tourTimer = setInterval(step, 5500);
});

build2D();
buildList();
applyFilter();
const startId = params.get('id');
if (startId && CONTES.some((c) => c.id === startId)) select(startId);
if (params.get('vue') === '3d') setView('3d');
