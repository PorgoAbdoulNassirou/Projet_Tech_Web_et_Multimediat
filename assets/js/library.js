import { CONTES, LANGUES, TYPES } from './data.js';
import { $, cardHTML } from './ui.js';

const params = new URLSearchParams(location.search);
const state = {
  q: params.get('q') || '',
  type: params.get('type') || '',
  langue: params.get('langue') || '',
};

const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

function haystack(c) {
  return norm([c.titre, c.accroche, c.resume, c.peuple, c.lieu.nom, c.lieu.zone, LANGUES[c.langue].nom, c.type].join(' '));
}

function chips(el, key, values, label) {
  el.innerHTML = [['', 'Tous']].concat(values).map(([v, l]) =>
    `<button type="button" class="chip" data-v="${v}" aria-pressed="${state[key] === v}">${l}</button>`).join('');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    state[key] = b.dataset.v;
    el.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    update();
  });
  el.setAttribute('aria-label', label);
}

chips($('#f-type'), 'type', TYPES.map((t) => [t, t]), 'Type de récit');
const langs = [...new Set(CONTES.map((c) => c.langue))];
chips($('#f-langue'), 'langue', langs.map((l) => [l, LANGUES[l].nom]), 'Langue d\'origine');

const input = $('#q');
input.value = state.q;
input.addEventListener('input', () => { state.q = input.value; update(); });

$('#reset').addEventListener('click', () => {
  state.q = ''; state.type = ''; state.langue = '';
  input.value = '';
  document.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === '')));
  update();
  input.focus();
});

function update() {
  const q = norm(state.q.trim());
  const list = CONTES.filter((c) =>
    (!state.type || c.type === state.type) &&
    (!state.langue || c.langue === state.langue) &&
    (!q || haystack(c).includes(q)));

  $('#results').innerHTML = list.map((c) => cardHTML(c, { headingLevel: 2 })).join('');
  $('#empty').hidden = list.length > 0;
  $('#count').textContent = `${list.length} récit${list.length > 1 ? 's' : ''}`;

  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(state)) if (v) p.set(k, v);
  history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
}

update();
