import { CONTES, LANGUES, getConte, typo } from './data.js';
import { renderScene, attachParallax } from './scenes.js';
import { $, $$, cardHTML, share, toast, storyUrl, hydrateIcons } from './ui.js';
import { icon } from './icons.js';
import { Narrator, ttsSupported } from './narrator.js';
import { Ambience } from './ambience.js';

const params = new URLSearchParams(location.search);
const conte = getConte(params.get('id'));
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('soalma-' + k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('soalma-' + k, JSON.stringify(v)); } catch { /* stockage indisponible */ } },
};

if (!conte) notFound();
else start(conte);

function notFound() {
  document.title = 'Récit introuvable · Soalma';
  $('#title').textContent = 'Ce récit est introuvable';
  $('#body').innerHTML = `<p>Le lien est peut-être incomplet. Vous pouvez retrouver tous les récits dans la bibliothèque.</p>
    <p><a class="btn btn-primary" href="contes.html">Voir les récits</a></p>`;
  $('.player').hidden = true;
  $('.tools').hidden = true;
  $('#stage').innerHTML = renderScene({ sky: 'night', items: [{ k: 'baobab', x: 800, s: 1.2 }] }, 'introuvable');
}

function start(c) {
  /* ---------- En-tête et métadonnées ---------- */
  document.title = `${c.titre} · Soalma`;
  document.querySelector('meta[name="description"]').content = c.resume;
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: c.titre,
    genre: c.type,
    description: c.resume,
    inLanguage: 'fr',
    isAccessibleForFree: true,
    contentLocation: { '@type': 'Place', name: c.lieu.nom, geo: { '@type': 'GeoCoordinates', latitude: c.lieu.lat, longitude: c.lieu.lon } },
  });
  document.head.append(ld);

  $('#title').textContent = typo(c.titre);
  const type = $('#type');
  type.textContent = c.type + (c.adaptation ? ' · adaptation' : '');
  type.dataset.type = c.type;
  $('#meta').innerHTML = `
    <span>${icon('pin')}${c.lieu.nom}</span>
    <span>${icon('globe')}${c.peuple}, ${LANGUES[c.langue].nom}</span>
    <span>${icon('clock')}${c.duree} min</span>`;
  $('#onmap').href = `carte.html?id=${c.id}`;

  /* ---------- Déroulé : tableaux, moment de choix, fin ---------- */
  const steps = [];
  c.tableaux.forEach((_, i) => {
    steps.push({ kind: 't', i });
    if (c.choix && c.choix.apres === i) steps.push({ kind: 'choice', i });
  });
  steps.push({ kind: 'end', i: c.tableaux.length - 1 });

  let cur = Math.min(Math.max(parseInt(params.get('t'), 10) || 0, 0), steps.length - 1);
  let chosen = null;
  let shownScene = -1;

  const stage = $('#stage');
  const body = $('#body');
  attachParallax($('.stage'));

  const dots = $('#dots');
  dots.innerHTML = c.tableaux.map((t, i) =>
    `<button type="button" data-i="${i}" aria-label="Tableau ${i + 1} : ${t.titre}"></button>`).join('');
  dots.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) go(steps.findIndex((s) => s.kind === 't' && s.i === +b.dataset.i), true);
  });

  /* Mots du glossaire repérés dans le texte */
  const terms = [...c.glossaire].sort((a, b) => b.mot.length - a.mot.length);
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function withTerms(paragraphs) {
    const used = new Set();
    return paragraphs.map((p) => {
      let html = typo(p);
      const slots = [];
      for (const t of terms) {
        if (used.has(t.mot)) continue;
        const re = new RegExp(`(^|[^\\p{L}])(${escRe(t.mot)})(?=[^\\p{L}]|$)`, 'u');
        if (re.test(html)) {
          used.add(t.mot);
          html = html.replace(re, (_, pre, word) => {
            slots.push(`<button type="button" class="term" data-term="${t.mot}" aria-haspopup="dialog">${word}</button>`);
            return `${pre}\u0001${slots.length - 1}\u0002`;
          });
        }
      }
      return html.replace(/\u0001(\d+)\u0002/g, (_, n) => slots[n]);
    });
  }

  function setScene(i) {
    if (i === shownScene) return;
    shownScene = i;
    const t = c.tableaux[i];
    const old = stage.querySelector('.scene');
    stage.insertAdjacentHTML('beforeend', renderScene(t.scene, c.id + i, { title: `Illustration : ${t.titre}` }));
    if (old) setTimeout(() => old.remove(), 900);
    ambience.setScene(t.scene);
  }

  function render(focus = false) {
    const s = steps[cur];
    setScene(s.i);

    const tIndex = s.kind === 't' ? s.i : -1;
    $$('button', dots).forEach((b, i) => {
      if (i === tIndex) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });

    const prevBtn = `<button class="btn btn-ghost" type="button" data-prev ${cur === 0 ? 'disabled' : ''}>${icon('arrowLeft')}Précédent</button>`;

    if (s.kind === 't') {
      const t = c.tableaux[s.i];
      $('#step').textContent = `Tableau ${s.i + 1} sur ${c.tableaux.length}`;
      const next = steps[cur + 1].kind === 'end' ? 'Fin du récit' : steps[cur + 1].kind === 'choice' ? 'À toi de jouer' : 'Suite';
      body.innerHTML = `<div class="tableau">
        <h2 tabindex="-1"><span class="n">${String(s.i + 1).padStart(2, '0')}</span>${typo(t.titre)}</h2>
        <div class="story-text">${withTerms(t.texte).map((p) => `<p>${p}</p>`).join('')}</div>
        <nav class="nav-steps" aria-label="Navigation dans le récit">${prevBtn}
          <button class="btn btn-primary" type="button" data-next>${next}${icon('arrowRight')}</button>
        </nav></div>`;
    } else if (s.kind === 'choice') {
      const ch = c.choix;
      $('#step').textContent = 'À toi de choisir';
      body.innerHTML = `<div class="choice">
        <p class="eyebrow">Et toi, qu'aurais-tu fait ?</p>
        <h2 tabindex="-1">${typo(ch.question)}</h2>
        <div class="choice-options" role="group" aria-label="Choix possibles">
          ${ch.options.map((o, k) => `<button type="button" data-opt="${k}" aria-pressed="${chosen === k}">${typo(o.label)}</button>`).join('')}
        </div>
        <div id="answer" aria-live="polite">${chosen !== null ? `<p class="choice-answer">${typo(ch.options[chosen].reponse)}</p>` : ''}</div>
      </div>
      <nav class="nav-steps" aria-label="Navigation dans le récit">${prevBtn}
        <button class="btn btn-primary" type="button" data-next>${chosen === null ? 'Passer' : 'Écouter la suite'}${icon('arrowRight')}</button>
      </nav>`;
    } else {
      $('#step').textContent = 'Fin du récit';
      renderEnding();
    }

    const pct = (cur / (steps.length - 1)) * 100;
    if (narrator.source !== 'file') $('#progress').style.width = pct + '%';
    $('#now').innerHTML = `<strong>${typo(c.titre)}</strong> · ${$('#step').textContent}`;

    const u = new URL(location.href);
    u.searchParams.set('t', cur);
    history.replaceState(null, '', u);

    if (focus) {
      body.querySelector('h2')?.focus({ preventScroll: true });
      $('#panel').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      if (innerWidth > 980) scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function renderEnding() {
    const lus = new Set(store.get('lus', []));
    lus.add(c.id);
    store.set('lus', [...lus]);

    const dist = (a) => Math.hypot(a.lieu.lon - c.lieu.lon, a.lieu.lat - c.lieu.lat);
    const others = CONTES.filter((x) => x.id !== c.id).sort((a, b) => dist(a) - dist(b)).slice(0, 3);

    body.innerHTML = `<div class="ending">
      <div class="morale">
        <p class="eyebrow">La morale</p>
        <h2 class="visually-hidden" tabindex="-1">Fin du récit</h2>
        <p>« ${typo(c.morale)} »</p>
      </div>

      <section aria-labelledby="quiz-title">
        <p class="eyebrow">Qu'as-tu retenu ?</p>
        <h2 id="quiz-title" style="font-size:var(--step-2)">Deux questions pour finir</h2>
        <form class="quiz" id="quiz">
          ${c.quiz.map((q, k) => `<fieldset>
            <legend>${typo(q.q)}</legend>
            ${q.choix.map((ch, j) => `<label><input type="radio" name="q${k}" value="${j}" required> ${typo(ch)}</label>`).join('')}
            <p class="why" hidden data-why="${k}">${icon('info')}<span>${typo(q.explication)}</span></p>
          </fieldset>`).join('')}
          <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
            <button class="btn btn-primary" type="submit">${icon('check')}Vérifier</button>
            <p class="score" id="score" aria-live="polite" style="margin:0"></p>
          </div>
        </form>
      </section>

      <section aria-labelledby="words-title">
        <p class="eyebrow">Les mots du récit</p>
        <h2 id="words-title" class="visually-hidden">Les mots du récit</h2>
        <dl class="glossary">${glossaryHTML()}</dl>
      </section>

      <section class="sources" aria-labelledby="src-title">
        <h2 id="src-title" style="font:700 0.8rem var(--font-ui);letter-spacing:.1em;text-transform:uppercase">Sources et variantes</h2>
        <ul>${c.sources.map((s) => `<li>${typo(s)}</li>`).join('')}</ul>
        ${c.adaptation ? '<p style="margin-top:8px">Ce récit est une adaptation : il reprend des motifs traditionnels dans une mise en forme écrite pour Soalma.</p>' : ''}
      </section>

      <section aria-labelledby="next-title">
        <p class="eyebrow">Sur la route</p>
        <h2 id="next-title" style="font-size:var(--step-2)">Récits des environs</h2>
        <div class="next-stories">${others.map((o) => cardHTML(o)).join('')}</div>
      </section>

      <nav class="nav-steps" aria-label="Navigation dans le récit">
        <button class="btn btn-ghost" type="button" data-restart>${icon('restart')}Relire depuis le début</button>
        <a class="btn btn-primary" href="carte.html?id=${c.id}">${icon('map')}Retour à la carte</a>
      </nav>
    </div>`;

    $('#quiz').addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = 0;
      c.quiz.forEach((q, k) => {
        const picked = $(`input[name="q${k}"]:checked`, e.target);
        $$(`input[name="q${k}"]`, e.target).forEach((inp) => {
          const lab = inp.closest('label');
          lab.classList.toggle('ok', +inp.value === q.bonne);
          lab.classList.toggle('ko', inp === picked && +inp.value !== q.bonne);
        });
        if (picked && +picked.value === q.bonne) ok++;
        $(`[data-why="${k}"]`, e.target).hidden = false;
      });
      $('#score').textContent = ok === c.quiz.length
        ? `${ok} sur ${ok}. Tu as bien écouté le griot.`
        : `${ok} sur ${c.quiz.length}. Relis les explications ci-dessus.`;
    });
  }

  function glossaryHTML() {
    return c.glossaire.map((g) => `<div id="g-${encodeURIComponent(g.mot)}"><dt>${g.mot}<small>${g.langue}</small></dt><dd>${typo(g.sens)}</dd></div>`).join('');
  }

  function go(i, focus = false) {
    if (i < 0 || i >= steps.length || i === cur) return;
    cur = i;
    render(focus);
    if (listening && narrator.source === 'tts') narrate();
  }

  body.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-next]')) go(cur + 1, true);
    else if (t.closest('[data-prev]')) go(cur - 1, true);
    else if (t.closest('[data-restart]')) { chosen = null; go(0, true); }
    else if (t.closest('[data-opt]')) {
      chosen = +t.closest('[data-opt]').dataset.opt;
      $$('[data-opt]', body).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.opt === chosen)));
      const rep = c.choix.options[chosen].reponse;
      $('#answer').innerHTML = `<p class="choice-answer">${typo(rep)}</p>`;
      $('[data-next]', body).innerHTML = `Écouter la suite${icon('arrowRight')}`;
      if (listening) narrator.read([rep]);
    } else if (t.closest('.term')) openGlossary(t.closest('.term').dataset.term);
  });

  addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea') || $('dialog[open]') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, true); }
  });

  /* ---------- Glossaire ---------- */
  const dlg = $('#glossary');
  $('#glossary-list').innerHTML = glossaryHTML();
  function openGlossary(term) {
    dlg.showModal();
    if (term) {
      const el = document.getElementById('g-' + encodeURIComponent(term));
      el?.scrollIntoView({ block: 'nearest' });
      el?.animate([{ background: 'rgba(232,176,75,.25)' }, { background: 'transparent' }], { duration: 1600 });
    }
  }
  $('#glossary-open').addEventListener('click', () => openGlossary());
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) dlg.close(); });

  /* ---------- Réglages de lecture ---------- */
  const reader = $('.reader');
  const themeBtn = $('#theme');
  function applyTheme(t) {
    reader.dataset.theme = t;
    themeBtn.setAttribute('aria-pressed', String(t === 'jour'));
    themeBtn.innerHTML = icon(t === 'jour' ? 'moon' : 'sun');
    themeBtn.title = t === 'jour' ? 'Mode nuit' : 'Mode jour';
  }
  applyTheme(store.get('theme', 'nuit'));
  themeBtn.addEventListener('click', () => {
    const t = reader.dataset.theme === 'jour' ? 'nuit' : 'jour';
    applyTheme(t);
    store.set('theme', t);
  });

  const sizes = [1, 1.15, 1.3];
  let size = store.get('size', 0);
  const applySize = () => {
    reader.style.setProperty('--reader-scale', sizes[size]);
    $('#size').setAttribute('aria-label', `Taille du texte : ${Math.round(sizes[size] * 100)} %`);
  };
  applySize();
  $('#size').addEventListener('click', () => {
    size = (size + 1) % sizes.length;
    applySize();
    store.set('size', size);
    toast(`Texte à ${Math.round(sizes[size] * 100)} %`);
  });

  $('#share').addEventListener('click', () => {
    const u = new URL(location.href);
    u.searchParams.delete('t');
    share(c.titre, u.href);
  });

  /* ---------- Lecteur audio ---------- */
  const narrator = new Narrator();
  narrator.source = 'tts';
  const ambience = new Ambience();
  let listening = false;

  const voice = $('#voice');
  const langs = [...new Set([c.langue, 'moore', 'dioula'])];
  voice.innerHTML = `<option value="fr">Français · voix de synthèse</option>` +
    langs.map((l) => c.audio[l]
      ? `<option value="${l}">${LANGUES[l].nom} · enregistrement</option>`
      : `<option value="${l}" disabled>${LANGUES[l].nom} · enregistrement à venir</option>`).join('');
  if (!ttsSupported) {
    voice.querySelector('option[value="fr"]').disabled = true;
    const firstRec = voice.querySelector('option:not([disabled])');
    if (firstRec) voice.value = firstRec.value;
  }

  const playBtn = $('#play');
  const setPlayIcon = (on) => {
    playBtn.innerHTML = icon(on ? 'pause' : 'play');
    playBtn.setAttribute('aria-label', on ? 'Mettre en pause' : 'Écouter le récit');
  };
  setPlayIcon(false);

  function stepParagraphs() {
    const s = steps[cur];
    if (s.kind === 't') {
      const t = c.tableaux[s.i];
      return [t.titre + '.', ...t.texte];
    }
    if (s.kind === 'choice') return [c.choix.question, c.choix.options.map((o, k) => `${['Première', 'Deuxième', 'Troisième'][k]} possibilité : ${o.label}.`).join(' ')];
    return ['La morale de ce récit.', c.morale];
  }

  function narrate() {
    narrator.source = 'tts';
    narrator.read(stepParagraphs());
  }

  narrator
    .on('state', (on) => { setPlayIcon(on || listening); ambience.duck(on); })
    .on('para', (i) => {
      const ps = $$('.story-text p', body);
      ps.forEach((p, k) => p.classList.toggle('is-reading', k === i - 1));
      const p = ps[i - 1];
      if (p && innerWidth <= 980) p.scrollIntoView({ block: 'center', behavior: 'smooth' });
    })
    .on('progress', (r) => { $('#progress').style.width = r * 100 + '%'; })
    .on('error', () => toast('Impossible de lire cet enregistrement.'))
    .on('end', () => {
      if (narrator.source !== 'tts' || !listening) { listening = false; setPlayIcon(false); return; }
      const s = steps[cur];
      if (s.kind === 't' && cur + 1 < steps.length) {
        cur++;
        render(false);
        if (steps[cur].kind !== 'end') { narrate(); return; }
        narrate();
        listening = false;
        return;
      }
      if (s.kind === 'choice') return; // on attend le choix de l'auditeur
      listening = false;
      setPlayIcon(false);
    });

  playBtn.addEventListener('click', () => {
    if (listening || narrator.playing) {
      listening = false;
      narrator.stop();
      setPlayIcon(false);
      return;
    }
    if (voice.value === 'fr') {
      if (!ttsSupported) { toast('La synthèse vocale n\'est pas disponible sur ce navigateur.'); return; }
      listening = true;
      narrate();
    } else {
      narrator.source = 'file';
      listening = true;
      narrator.playFile(c.audio[voice.value]);
    }
    setPlayIcon(true);
  });

  voice.addEventListener('change', () => {
    listening = false;
    narrator.stop();
    if (voice.value !== 'fr') toast('Le texte affiché reste la version française.');
  });

  const rates = [1, 1.2, 0.8];
  let rate = store.get('rate', 0);
  const applyRate = () => {
    narrator.setRate(rates[rate]);
    $('#rate').textContent = `${rates[rate]}×`.replace('.', ',');
    $('#rate').setAttribute('aria-label', `Vitesse de lecture : ${rates[rate]}`);
  };
  applyRate();
  $('#rate').addEventListener('click', () => {
    rate = (rate + 1) % rates.length;
    applyRate();
    store.set('rate', rate);
    if (listening && narrator.source === 'tts') narrate();
  });

  const ambBtn = $('#ambience');
  ambBtn.addEventListener('click', () => {
    const on = ambBtn.getAttribute('aria-pressed') !== 'true';
    if (on && !ambience.start()) { toast('Le son n\'est pas disponible sur ce navigateur.'); return; }
    if (!on) ambience.stop();
    ambBtn.setAttribute('aria-pressed', String(on));
    toast(on ? 'Ambiance de la nuit activée' : 'Ambiance coupée');
  });

  addEventListener('pagehide', () => { narrator.stop(); ambience.stop(); });

  render(false);
  hydrateIcons();
}
