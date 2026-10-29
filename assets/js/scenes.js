/*
 * Moteur d'illustrations de Soalma.
 *
 * Chaque tableau d'un conte décrit sa scène de façon déclarative
 * (ciel, sol, éléments placés). Ce module la transforme en SVG vectoriel,
 * dans un style « papier découpé » : silhouettes sombres devant un ciel
 * en dégradé. Les animations sont en CSS (voir scene.css), ce qui garde
 * les illustrations légères et respecte prefers-reduced-motion.
 */

const W = 1600;
const H = 900;

export const SKIES = {
  night: {
    stops: ['#060918', '#10163A', '#2B2650'],
    moon: { x: 1250, y: 190, r: 44 },
    stars: 140,
    far: '#1B2042', mid: '#12163A', near: '#0B0D24', sil: '#05060F',
  },
  dawn: {
    stops: ['#1C2753', '#6D4468', '#D9825C', '#F4C68C'],
    sun: { x: 420, y: 610, r: 74, c: '#FFE0A8' },
    stars: 30,
    far: '#7A4A5E', mid: '#4C2D45', near: '#2A192D', sil: '#160C19',
  },
  day: {
    stops: ['#5D8DB6', '#A8C7D6', '#ECDCB8'],
    sun: { x: 1270, y: 170, r: 50, c: '#FFF6DC' },
    far: '#B89A72', mid: '#8F6A45', near: '#5F4129', sil: '#2B1B10',
  },
  dusk: {
    stops: ['#22173A', '#6A2D46', '#C8513A', '#F2A24C'],
    sun: { x: 800, y: 615, r: 112, c: '#FFC56E' },
    stars: 18,
    far: '#6E2C3B', mid: '#45192B', near: '#270E1B', sil: '#14070E',
  },
  dust: {
    stops: ['#94704F', '#C59F74', '#E5CA9E'],
    sun: { x: 980, y: 250, r: 62, c: '#FFF3D6', hazy: true },
    far: '#B08B63', mid: '#8E6A47', near: '#6A4B30', sil: '#3B2818',
  },
};

/* Générateur pseudo-aléatoire déterministe : une même scène se dessine
   toujours de la même façon, ce qui évite le scintillement entre rendus. */
function rng(seed) {
  let a = 0;
  for (const ch of String(seed)) a = (a * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let CUR = '';

const f = (n) => Math.round(n * 10) / 10;

function ridge(base, amp, rand, freq = 3, flat = false) {
  const p1 = rand() * 6, p2 = rand() * 6, p3 = rand() * 6;
  let d = `M0,${H} L0,${f(base)}`;
  for (let x = 0; x <= W; x += 20) {
    const t = x / W;
    let y = Math.sin(t * Math.PI * freq + p1) * amp
      + Math.sin(t * Math.PI * freq * 2.3 + p2) * amp * 0.35
      + Math.sin(t * Math.PI * freq * 5.1 + p3) * amp * 0.12;
    if (flat) y *= 0.4;
    d += ` L${x},${f(base + y)}`;
  }
  return d + ` L${W},${H} Z`;
}

/* ---------- Silhouettes ----------
   Chaque fonction dessine dans un repère local : (0,0) au sol,
   au centre de l'élément, y négatif vers le haut. */

const leg = (x, y, cls = '') =>
  `<g transform="translate(${x} ${y})"><g class="sc-leg ${cls}"><path d="M-5,0 L6,0 L6,46 L3,84 L8,90 L-4,90 L-4,46 Z"/></g></g>`;

function horse({ rider = false, cape = false, spear = false, saddle = false, run = false } = {}) {
  const r = run ? ' sc-run' : '';
  let s = `<g class="sc-horse${r}">`;
  s += `<path class="sc-tail" d="M-70,-112 C-94,-104 -100,-78 -94,-46 C-86,-68 -80,-90 -64,-100 Z"/>`;
  s += leg(-50, -90, 'la') + leg(-36, -90, 'lb') + leg(36, -90, 'lb') + leg(48, -90, 'la');
  s += `<ellipse cx="0" cy="-104" rx="64" ry="27"/>`;
  s += `<circle cx="-44" cy="-106" r="28"/><circle cx="44" cy="-104" r="26"/>`;
  s += `<path d="M28,-118 C40,-150 52,-170 64,-182 L86,-170 C78,-150 72,-128 68,-98 Z"/>`;
  s += `<path d="M60,-182 C66,-192 76,-194 82,-188 L112,-150 C114,-144 108,-138 100,-140 L84,-150 C76,-156 66,-166 60,-176 Z"/>`;
  s += `<path d="M69,-189 L72,-207 L80,-190 Z"/>`;
  s += `<path d="M60,-182 C50,-176 44,-160 34,-140 L30,-120 C40,-136 48,-156 62,-170 Z"/>`;
  if (saddle) {
    s += `<path d="M-30,-128 C-20,-140 20,-140 26,-128 L22,-96 L-26,-96 Z" fill="#9E2B25"/>`;
    s += `<path d="M-30,-98 L26,-98 L22,-84 L-26,-84 Z" fill="#E3A63B"/>`;
  }
  if (rider) {
    if (cape) s += `<path class="sc-cape" d="M-6,-182 C-34,-172 -52,-150 -62,-124 L-40,-132 L-24,-140 Z" fill="#9E2B25"/>`;
    s += `<path d="M-8,-130 L14,-128 L22,-94 L12,-90 L4,-118 Z"/>`;
    s += `<path d="M-16,-128 L12,-128 L20,-178 L-6,-186 Z"/>`;
    s += `<circle cx="8" cy="-198" r="12"/>`;
    s += `<ellipse cx="6" cy="-208" rx="13" ry="7"/>`;
    s += `<path d="M14,-176 L44,-150 L40,-145 L10,-168 Z"/>`;
    if (spear) s += `<path d="M-44,-110 L96,-246" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><path d="M96,-246 L88,-226 L104,-234 Z"/>`;
  }
  return s + `</g>`;
}

function person({ robe = true, hat = null, spear = false, staff = false, bow = false, aim = false, wrap = false, bent = false, raise = false, child = false } = {}) {
  const k = child ? 0.7 : 1;
  let s = `<g transform="scale(${k})">`;
  if (bent) {
    s += `<circle cx="22" cy="-140" r="12"/>`;
    s += `<path d="M-6,-128 C10,-140 26,-132 22,-118 L14,-80 L24,-4 L-26,-4 L-20,-70 Z"/>`;
    s += `<path d="M18,-120 L38,-90 L34,-86 L14,-112 Z"/>`;
    s += `<path d="M38,-92 L46,0" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;
    s += `<ellipse cx="18" cy="-150" rx="13" ry="6"/>`;
    return s + `</g>`;
  }
  s += `<circle cx="0" cy="-166" r="13"/>`;
  s += `<rect x="-4" y="-156" width="8" height="10"/>`;
  if (robe) {
    s += `<path d="M-20,-148 Q0,-153 20,-148 L26,-92 L32,-2 L-32,-2 L-26,-92 Z"/>`;
  } else {
    s += `<path d="M-19,-148 Q0,-153 19,-148 L22,-80 L-22,-80 Z"/>`;
    s += `<path d="M-20,-82 L-2,-82 L-6,-2 L-18,-2 Z"/><path d="M2,-82 L20,-82 L18,-2 L6,-2 Z"/>`;
  }
  s += `<path d="M-18,-144 L-30,-92 L-24,-90 L-12,-138 Z"/>`;
  if (raise) s += `<path d="M14,-144 L34,-186 L40,-182 L22,-138 Z"/>`;
  else if (aim) s += `<path d="M14,-142 L62,-136 L62,-128 L14,-132 Z"/>`;
  else s += `<path d="M18,-144 L30,-92 L24,-90 L12,-138 Z"/>`;
  if (wrap) s += `<ellipse cx="0" cy="-178" rx="15" ry="8"/>`;
  if (hat === 'peul') s += `<path d="M-34,-170 L0,-206 L34,-170 Z"/><ellipse cx="0" cy="-170" rx="36" ry="5"/>`;
  if (hat === 'cap') s += `<path d="M-14,-170 C-14,-190 14,-190 14,-170 Z"/>`;
  if (spear) s += `<path d="M30,-4 L30,-230" stroke="currentColor" stroke-width="3.5"/><path d="M30,-246 L24,-226 L36,-226 Z"/>`;
  if (staff) s += `<path d="M-44,-158 L46,-148" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`;
  if (bow && !aim) s += `<path d="M-30,-190 Q-62,-110 -30,-30" fill="none" stroke="currentColor" stroke-width="4"/><path d="M-30,-190 L-30,-30" stroke="currentColor" stroke-width="1.2"/>`;
  if (aim) s += `<path d="M64,-206 Q100,-132 64,-58" fill="none" stroke="currentColor" stroke-width="4"/><path d="M64,-206 L30,-132 L64,-58" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M30,-132 L110,-132" stroke="currentColor" stroke-width="2"/>`;
  return s + `</g>`;
}

function griot() {
  return `<circle cx="0" cy="-118" r="13"/><path d="M-18,-102 Q0,-108 18,-102 L24,-40 L-24,-40 Z"/>
  <ellipse cx="0" cy="-26" rx="44" ry="20"/><path class="sc-talk" d="M14,-98 L40,-126 L46,-121 L22,-90 Z"/>
  <ellipse cx="-2" cy="-130" rx="15" ry="7"/>`;
}

function crowd(rand, { n = 9, w = 420 } = {}) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + (w / (n - 1)) * i + (rand() - 0.5) * 14;
    const h = 0.75 + rand() * 0.35;
    s += `<g transform="translate(${f(x)} 0) scale(${f(h * 100) / 100})">
      <circle cx="0" cy="-94" r="12"/><path d="M-22,-80 Q0,-88 22,-80 L28,0 L-28,0 Z"/></g>`;
  }
  return s;
}

function baobab(rand) {
  let s = `<path d="M-52,0 C-60,-60 -66,-150 -42,-214 L42,-214 C66,-150 60,-60 52,0 Z"/>`;
  const branch = (x, y, ang, len, wdt, depth) => {
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len;
    s += `<path d="M${f(x)},${f(y)} L${f(x2)},${f(y2)}" stroke="currentColor" stroke-width="${f(wdt)}" stroke-linecap="round"/>`;
    if (depth > 0) {
      const n = 2 + (rand() > 0.5 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        branch(x2, y2, ang + (rand() - 0.5) * 1.3, len * (0.55 + rand() * 0.2), wdt * 0.55, depth - 1);
      }
    }
  };
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i - 2.5) * 0.42 + (rand() - 0.5) * 0.2;
    branch(-30 + i * 12, -206, a, 70 + rand() * 30, 20, 3);
  }
  return `<g class="sc-sway-slow">${s}</g>`;
}

function acacia() {
  return `<path d="M-6,0 L6,0 L4,-120 L32,-168 L25,-171 L0,-134 L-22,-168 L-29,-165 L-4,-120 Z"/>
  <g class="sc-sway-slow"><ellipse cx="0" cy="-178" rx="112" ry="20"/><ellipse cx="-34" cy="-190" rx="70" ry="14"/><ellipse cx="42" cy="-188" rx="62" ry="12"/></g>`;
}

function ronier() {
  let s = `<path d="M-8,0 L8,0 L10,-200 L6,-320 L-6,-320 L-10,-200 Z"/><g class="sc-sway">`;
  for (let i = 0; i < 13; i++) {
    const a = (-170 + i * (160 / 12)) * Math.PI / 180;
    const x2 = Math.cos(a) * 92, y2 = -322 + Math.sin(a) * 70;
    const nx = -Math.sin(a) * 9, ny = Math.cos(a) * 9;
    s += `<path d="M0,-322 L${f(x2 + nx)},${f(y2 + ny)} L${f(x2 * 1.05)},${f(-322 + (y2 + 322) * 1.05)} L${f(x2 - nx)},${f(y2 - ny)} Z"/>`;
  }
  return s + `</g>`;
}

function grass(rand, w = 160) {
  let s = '<g class="sc-sway">';
  for (let i = 0; i < 14; i++) {
    const x = -w / 2 + rand() * w, h = 30 + rand() * 50, b = (rand() - 0.5) * 30;
    s += `<path d="M${f(x - 2)},0 Q${f(x + b / 2)},${f(-h / 2)} ${f(x + b)},${f(-h)} Q${f(x + b / 2 + 2)},${f(-h / 2)} ${f(x + 3)},0 Z"/>`;
  }
  return s + '</g>';
}

function hut() {
  return `<path d="M-56,0 L-56,-80 L56,-80 L56,0 Z"/>
  <path d="M-76,-72 Q0,-92 76,-72 L5,-172 L-5,-172 Z"/>
  <path d="M-14,0 L-14,-40 Q0,-56 14,-40 L14,0 Z" fill="#000" opacity=".45"/>
  <path d="M-60,-74 L0,-160 M-30,-80 L0,-160 M30,-80 L0,-160 M60,-74 L0,-160" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>`;
}

function granary() {
  return `<rect x="-26" y="-24" width="6" height="24"/><rect x="20" y="-24" width="6" height="24"/>
  <path d="M-34,-24 L-34,-84 L34,-84 L34,-24 Z"/><path d="M-46,-78 L0,-150 L46,-78 Z"/>`;
}

function tiebele(rand, { round = false } = {}) {
  const body = '#B4552F';
  if (round) {
    return `<path d="M-60,0 L-60,-110 Q0,-130 60,-110 L60,0 Z" fill="${body}"/>
    <path d="M-60,-110 Q0,-130 60,-110 L60,-92 Q0,-112 -60,-92 Z" fill="#1E1410"/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${-56 + i * 14},-92 l7,-14 l7,14 Z" fill="#F2E6D0"/>`).join('')}
    <path d="M-60,-70 C-30,-50 -10,-90 20,-70 S50,-50 60,-62" fill="none" stroke="#F2E6D0" stroke-width="7" stroke-linecap="round"/>
    <path d="M-60,-24 L60,-24 L60,0 L-60,0 Z" fill="#1E1410"/>
    <path d="M-12,0 L-12,-34 Q0,-44 12,-34 L12,0 Z" fill="#0B0705"/>`;
  }
  let s = `<rect x="-110" y="-150" width="220" height="150" fill="${body}"/>
  <rect x="-116" y="-160" width="232" height="16" fill="#2A1A12"/>
  <rect x="-110" y="-144" width="220" height="26" fill="#1E1410"/>`;
  for (let i = 0; i < 11; i++) s += `<path d="M${-110 + i * 20},-118 l10,-22 l10,22 Z" fill="#F2E6D0"/>`;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      const cx = -90 + c * 30 + (r % 2) * 15, cy = -96 + r * 26;
      if (cx > 100) continue;
      s += `<path d="M${cx},${cy - 11} l11,11 l-11,11 l-11,-11 Z" fill="${(r + c) % 2 ? '#1E1410' : '#F2E6D0'}"/>`;
    }
  }
  s += `<rect x="-110" y="-24" width="220" height="24" fill="#1E1410"/>`;
  for (let i = 0; i < 22; i++) s += `<rect x="${-110 + i * 10}" y="-24" width="5" height="24" fill="#B4552F"/>`;
  s += `<path d="M-14,0 L-14,-46 L14,-46 L14,0 Z" fill="#0B0705"/>`;
  return s;
}

function palace(rand) {
  let s = `<path d="M-240,0 L-240,-140 L240,-140 L240,0 Z"/>
  <path d="M-70,0 L-70,-200 L70,-200 L70,0 Z"/>`;
  for (let x = -236; x <= 236; x += 28) {
    if (x > -78 && x < 78) continue;
    s += `<path d="M${x - 8},-140 L${x},-166 L${x + 8},-140 Z"/>`;
  }
  for (let x = -60; x <= 60; x += 24) s += `<path d="M${x - 8},-200 L${x},-228 L${x + 8},-200 Z"/>`;
  s += `<path d="M-30,0 L-30,-90 Q0,-122 30,-90 L30,0 Z" fill="#000" opacity=".5"/>`;
  s += `<path d="M-180,-60 l12,-24 l12,24 Z M150,-60 l12,-24 l12,24 Z" fill="#000" opacity=".35"/>`;
  return s;
}

function hare() {
  return `<ellipse cx="0" cy="-22" rx="26" ry="18"/><circle cx="-12" cy="-18" r="17"/>
  <ellipse cx="26" cy="-40" rx="14" ry="10"/>
  <ellipse cx="20" cy="-66" rx="4.5" ry="21" transform="rotate(-14 20 -66)"/>
  <ellipse cx="29" cy="-64" rx="4.5" ry="20" transform="rotate(9 29 -64)"/>
  <circle cx="-28" cy="-28" r="6"/><rect x="16" y="-16" width="5" height="16"/>
  <ellipse cx="-8" cy="-3" rx="17" ry="4"/>`;
}

function hyena(rand) {
  let s = `<path d="M-58,-58 L-74,-38 L-66,-37 L-52,-52 Z"/>
  <rect x="-48" y="-54" width="8" height="54"/><rect x="-34" y="-54" width="8" height="54"/>
  <rect x="36" y="-70" width="8" height="70"/><rect x="50" y="-70" width="8" height="70"/>
  <path d="M-62,-60 C-60,-82 -20,-94 30,-102 C52,-104 64,-96 64,-80 L58,-56 C30,-50 -20,-48 -58,-46 Z"/>
  <path d="M46,-100 C58,-114 82,-112 92,-98 L106,-84 C106,-78 100,-75 92,-77 L70,-80 C60,-80 52,-84 48,-90 Z"/>
  <circle cx="58" cy="-112" r="8"/><circle cx="70" cy="-114" r="7"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M${-30 + i * 8},${-90 - (i * 1.1)} l3,-9 l3,9 Z"/>`;
  for (let i = 0; i < 9; i++) s += `<circle cx="${f(-40 + rand() * 80)}" cy="${f(-60 - rand() * 28)}" r="${f(3 + rand() * 3)}" fill="#fff" opacity=".08"/>`;
  return s;
}

function crocodile() {
  let s = `<path d="M-160,0 C-120,-6 -80,-16 -40,-24 C0,-30 40,-30 80,-24 L132,-18 C146,-16 156,-11 158,-6 C154,-1 140,-1 122,-3 L80,-6 C40,-2 0,0 -160,0 Z"/>
  <ellipse cx="54" cy="-4" rx="12" ry="5"/><ellipse cx="-34" cy="-4" rx="12" ry="5"/>
  <circle cx="112" cy="-22" r="5"/>`;
  for (let i = 0; i < 12; i++) s += `<path d="M${-70 + i * 11},-25 l4,-8 l4,8 Z"/>`;
  return s;
}

function catfish(color = 'currentColor') {
  return `<g fill="${color}"><path d="M-80,0 C-60,-18 20,-22 60,-14 C76,-10 86,-4 86,0 C86,4 76,10 60,12 C20,18 -60,16 -80,0 Z"/>
  <path d="M-78,0 L-106,-20 L-98,0 L-106,20 Z"/><path d="M-10,-18 L10,-30 L20,-17 Z"/></g>
  <path d="M82,4 C94,10 104,18 114,22 M82,-2 C94,-8 104,-12 112,-18 M78,6 C86,16 90,24 92,32" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;
}

function cow({ white = false } = {}) {
  const c = white ? ' fill="#F1E8D8"' : '';
  return `<g${c}><path d="M-60,-86 L-76,-50 L-72,-49 L-56,-80 Z"/>
  <rect x="-48" y="-64" width="8" height="64"/><rect x="-34" y="-64" width="8" height="64"/>
  <rect x="34" y="-64" width="8" height="64"/><rect x="46" y="-64" width="8" height="64"/>
  <ellipse cx="0" cy="-82" rx="60" ry="26"/>
  <path d="M14,-102 C18,-124 38,-126 42,-104 Z"/>
  <path d="M40,-100 L66,-98 L70,-70 C60,-56 50,-56 44,-62 Z"/>
  <path d="M60,-106 L86,-100 L94,-78 L84,-70 L64,-86 Z"/></g>
  <path d="M70,-104 C58,-132 64,-152 80,-164 M80,-104 C96,-130 106,-146 98,-166" fill="none" stroke="${white ? '#E9DCC4' : 'currentColor'}" stroke-width="6" stroke-linecap="round"/>`;
}

function doe() {
  return `<rect x="-30" y="-64" width="5" height="64"/><rect x="-20" y="-64" width="5" height="64"/>
  <rect x="22" y="-64" width="5" height="64"/><rect x="30" y="-64" width="5" height="64"/>
  <ellipse cx="0" cy="-72" rx="42" ry="17"/><path d="M-42,-78 L-50,-62 L-44,-62 Z"/>
  <path d="M26,-82 L42,-118 L54,-116 L40,-76 Z"/>
  <ellipse cx="54" cy="-120" rx="14" ry="8" transform="rotate(24 54 -120)"/>
  <ellipse cx="44" cy="-132" rx="4" ry="11" transform="rotate(-20 44 -132)"/>
  <ellipse cx="52" cy="-134" rx="4" ry="11" transform="rotate(12 52 -134)"/>`;
}

function well() {
  return `<path d="M-46,-34 L-46,-112 M46,-34 L46,-112" stroke="currentColor" stroke-width="8"/>
  <path d="M-46,-112 L-56,-128 M-46,-112 L-36,-128 M46,-112 L36,-128 M46,-112 L56,-128" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
  <path d="M-54,-116 L54,-116" stroke="currentColor" stroke-width="6"/>
  <path d="M0,-116 L0,-60" stroke="currentColor" stroke-width="1.6"/><path d="M-8,-62 L8,-62 L6,-48 L-6,-48 Z"/>
  <path d="M-56,0 L-56,-30 C-56,-42 56,-42 56,-30 L56,0 Z"/>
  <ellipse cx="0" cy="-32" rx="56" ry="10" fill="#000" opacity=".35"/>`;
}

function okra({ dry = false } = {}) {
  const leaf = dry ? '#7A5A2E' : 'currentColor';
  let s = '';
  for (let i = 0; i < 6; i++) {
    const x = -150 + i * 60, h = 90 + (i % 2) * 18;
    s += `<g transform="translate(${x} 0)"><path d="M-2,0 L2,0 L2,${-h} L-2,${-h} Z"/>`;
    const droop = dry ? 26 : -8;
    s += `<path d="M0,${-h + 20} q-26,${droop} -40,${droop + 14} q16,-4 40,-10 Z" fill="${leaf}"/>`;
    s += `<path d="M0,${-h + 40} q26,${droop} 40,${droop + 14} q-16,-4 -40,-10 Z" fill="${leaf}"/>`;
    s += `<path d="M2,${-h + 10} l6,${dry ? 20 : -16} l3,0 l-5,${dry ? -20 : 16} Z" fill="${dry ? '#5E4424' : 'currentColor'}"/></g>`;
  }
  return s;
}

function ruins(rand, { w = 520 } = {}) {
  let s = '';
  let x = -w / 2;
  while (x < w / 2) {
    const seg = 60 + rand() * 90;
    const h = 90 + rand() * 120;
    if (rand() > 0.18) {
      let top = `M${f(x)},0 L${f(x)},${f(-h)}`;
      for (let t = 0; t <= seg; t += 12) top += ` L${f(x + t)},${f(-h + (rand() - 0.5) * 14)}`;
      s += `<path d="${top} L${f(x + seg)},0 Z"/>`;
      for (let r = 14; r < h - 10; r += 16) {
        s += `<path d="M${f(x)},${-r} L${f(x + seg)},${-r}" stroke="#000" stroke-opacity=".25" stroke-width="2"/>`;
      }
    }
    x += seg + 6;
  }
  return s;
}

function fire() {
  return `<circle class="sc-glow" cx="0" cy="-40" r="150" fill="url(#${CUR}fireglow)"/>
  <path d="M-46,-4 L40,-18 M-40,-18 L46,-4" stroke="#2A140C" stroke-width="12" stroke-linecap="round"/>
  <g class="sc-flame"><path d="M-30,-10 C-36,-40 -14,-60 -6,-94 C4,-70 30,-52 26,-10 Z" fill="#E2552A"/></g>
  <g class="sc-flame b"><path d="M-18,-10 C-20,-34 -4,-46 2,-74 C10,-52 22,-40 16,-10 Z" fill="#F29A3A"/></g>
  <g class="sc-flame c"><path d="M-8,-10 C-8,-24 0,-32 2,-48 C8,-34 12,-24 8,-10 Z" fill="#FFE29A"/></g>
  <g class="sc-embers">${Array.from({ length: 7 }, (_, i) => `<circle cx="${-20 + i * 7}" cy="-60" r="2.4" fill="#FFC76B" style="animation-delay:${(i * 0.37).toFixed(2)}s"/>`).join('')}</g>`;
}

function beam() {
  return `<path d="M-30,-900 L30,-900 L180,0 L-180,0 Z" fill="url(#${CUR}beamgrad)" class="sc-beam"/>
  <circle cx="0" cy="-640" r="26" fill="#FFF7DA" class="sc-glow"/>
  <g class="sc-descend" transform="translate(0 -360) scale(.55)">${horse({ rider: true })}</g>`;
}

function waterfall(rand) {
  let s = `<path d="M-340,0 L-330,-260 L-260,-300 L-180,-280 L-120,-310 L-60,-300 L-60,0 Z"/>
  <path d="M60,0 L60,-290 L140,-320 L230,-290 L300,-270 L350,-240 L360,0 Z"/>`;
  for (let i = 0; i < 6; i++) {
    const x = -54 + i * 21;
    s += `<rect x="${x}" y="-300" width="16" height="300" fill="#E6F0F2" opacity="${f(0.55 + rand() * 0.35)}"/>`;
    s += `<path class="sc-fall" d="M${x + 8},-300 L${x + 8},0" stroke="#fff" stroke-width="3" stroke-dasharray="18 26" style="animation-delay:-${f(rand() * 2)}s"/>`;
  }
  s += `<ellipse cx="0" cy="-6" rx="160" ry="26" fill="#fff" opacity=".1" class="sc-mist"/>`;
  return s;
}

function cliff(side = 'left') {
  const d = side === 'left'
    ? 'M-300,0 L-300,-420 L-220,-440 L-160,-380 L-120,-300 L-60,-260 L-20,-160 L0,0 Z'
    : 'M300,0 L300,-440 L230,-420 L170,-360 L130,-280 L70,-230 L30,-140 L0,0 Z';
  return `<path d="${d}"/><path d="${d}" fill="#fff" opacity=".04" transform="translate(${side === 'left' ? 8 : -8} 6)"/>`;
}

function pond(sky, { w = 900 } = {}) {
  return `<path d="M${-w / 2},0 C${-w / 2 + 60},-30 ${w / 2 - 60},-30 ${w / 2},0 C${w / 2 - 60},40 ${-w / 2 + 60},40 ${-w / 2},0 Z" fill="url(#${CUR}water)"/>
  ${[0, 1, 2].map((i) => `<ellipse class="sc-ripple" cx="${-w / 5 + i * w / 5}" cy="4" rx="40" ry="6" fill="none" stroke="#fff" stroke-opacity=".35" style="animation-delay:${i * 1.3}s"/>`).join('')}`;
}

function python() {
  return `<g class="sc-slither"><path d="M-170,-4 C-130,-26 -90,18 -50,-4 S30,-26 70,-4 S130,8 160,-10" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="168" cy="-13" rx="14" ry="8"/></g>`;
}

function statue() {
  return `<g fill="#3A2416"><ellipse cx="0" cy="-104" rx="14" ry="16"/><path d="M-16,-90 L16,-90 L20,-30 L-20,-30 Z"/>
  <path d="M-20,-30 L-6,-30 L-8,0 L-18,0 Z M6,-30 L20,-30 L18,0 L8,0 Z"/></g>
  <path d="M-8,-110 Q-2,-116 4,-112 M-12,-80 Q-6,-86 -2,-76" stroke="#FFE7B0" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}

/* Correspondance clé → dessin. */
function draw(item, rand, sky) {
  switch (item.k) {
    case 'baobab': return baobab(rand);
    case 'acacia': return acacia();
    case 'ronier': return ronier();
    case 'grass': return grass(rand, item.w);
    case 'hut': return hut();
    case 'granary': return granary();
    case 'tiebele': return tiebele(rand, item);
    case 'palace': return palace(rand);
    case 'horse': return horse({ saddle: item.saddle });
    case 'rider': return horse({ rider: true, cape: item.cape, spear: item.spear, run: item.run });
    case 'woman': return person({ wrap: true, spear: item.spear });
    case 'man': return person({ raise: item.raise, staff: item.staff });
    case 'child': return person({ child: true, robe: false });
    case 'hunter': return person({ robe: false, hat: 'cap', bow: true });
    case 'archer': return person({ robe: false, hat: 'cap', aim: true });
    case 'herder': return person({ hat: 'peul', staff: true });
    case 'oldwoman': return person({ bent: true });
    case 'griot': return griot();
    case 'crowd': return crowd(rand, item);
    case 'fire': return fire();
    case 'hare': return hare();
    case 'hyena': return hyena(rand);
    case 'croc': return crocodile();
    case 'catfish': return catfish(item.c);
    case 'cow': return cow(item);
    case 'doe': return doe();
    case 'well': return well();
    case 'okra': return okra(item);
    case 'ruins': return ruins(rand, item);
    case 'beam': return beam();
    case 'waterfall': return waterfall(rand);
    case 'cliff': return cliff(item.side);
    case 'pond': return pond(sky, item);
    case 'python': return python();
    case 'statue': return statue();
    default: return '';
  }
}

const LAYER_Y = { far: 618, mid: 700, near: 830 };
const LAYER_SCALE = { far: 0.5, mid: 0.82, near: 1.32 };

/**
 * Construit le SVG d'une scène.
 * @param {object} scene  { sky, ground, items: [{k, x, y?, s?, flip?, layer?, anim?}] }
 * @param {string} seed   graine déterministe (identifiant du conte + tableau)
 */
export function renderScene(scene, seed = 'soalma', { title = '' } = {}) {
  const sky = SKIES[scene.sky] || SKIES.night;
  const rand = rng(seed);
  const uid = 's' + Math.floor(rand() * 1e9).toString(36);
  CUR = uid;
  const ground = scene.ground || 'savanna';

  const stops = sky.stops.map((c, i) => `<stop offset="${f((i / (sky.stops.length - 1)) * 100)}%" stop-color="${c}"/>`).join('');

  let defs = `<linearGradient id="${uid}sky" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>
    <radialGradient id="${uid}sun"><stop offset="0%" stop-color="${sky.sun?.c || '#fff'}" stop-opacity=".9"/><stop offset="35%" stop-color="${sky.sun?.c || '#fff'}" stop-opacity=".25"/><stop offset="100%" stop-color="${sky.sun?.c || '#fff'}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${uid}moon"><stop offset="0%" stop-color="#E8EEFF" stop-opacity=".35"/><stop offset="100%" stop-color="#E8EEFF" stop-opacity="0"/></radialGradient>
    <radialGradient id="${uid}fireglow"><stop offset="0%" stop-color="#FFB45C" stop-opacity=".55"/><stop offset="100%" stop-color="#FF7A2E" stop-opacity="0"/></radialGradient>
    <linearGradient id="${uid}beamgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFF6D8" stop-opacity=".85"/><stop offset="100%" stop-color="#FFF6D8" stop-opacity="0"/></linearGradient>
    <linearGradient id="${uid}water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${sky.stops[sky.stops.length - 1]}" stop-opacity=".75"/><stop offset="100%" stop-color="${sky.stops[0]}" stop-opacity=".95"/></linearGradient>
    <radialGradient id="${uid}vig" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient>`;

  let back = `<rect width="${W}" height="${H}" fill="url(#${uid}sky)"/>`;

  if (sky.stars) {
    back += '<g class="sc-stars">';
    for (let i = 0; i < sky.stars; i++) {
      const x = rand() * W, y = rand() * 520 * (sky.stars > 60 ? 1 : 0.6), r = rand() * 1.6 + 0.4;
      const tw = rand() > 0.7 ? ` class="sc-twinkle" style="animation-delay:${f(rand() * 4)}s"` : '';
      back += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#fff" opacity="${f(0.35 + rand() * 0.6)}"${tw}/>`;
    }
    back += '</g>';
  }
  if (sky.moon) {
    const m = sky.moon;
    back += `<circle cx="${m.x}" cy="${m.y}" r="${m.r * 4}" fill="url(#${uid}moon)"/>
      <circle cx="${m.x}" cy="${m.y}" r="${m.r}" fill="#F3F1E6"/>
      <circle cx="${m.x - 12}" cy="${m.y - 8}" r="8" fill="#000" opacity=".06"/><circle cx="${m.x + 14}" cy="${m.y + 12}" r="11" fill="#000" opacity=".05"/>`;
  }
  if (sky.sun) {
    const s = sky.sun;
    back += `<circle class="sc-glow" cx="${s.x}" cy="${s.y}" r="${s.r * 3.4}" fill="url(#${uid}sun)"/>
      <circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="${s.c}" opacity="${s.hazy ? 0.75 : 1}"/>`;
  }
  if (scene.sky === 'dust') {
    back += `<g class="sc-drift">${[0, 1, 2].map((i) => `<rect x="${-200 + i * 600}" y="${300 + i * 90}" width="900" height="120" rx="60" fill="#F2DDB6" opacity=".18"/>`).join('')}</g>`;
  }

  const flat = ground === 'sahel';
  const layers = {
    far: `<path d="${ridge(flat ? 610 : 590, flat ? 14 : 34, rand, 2.2)}" fill="${sky.far}"/>`,
    mid: `<path d="${ridge(flat ? 668 : 660, flat ? 10 : 18, rand, 3.1)}" fill="${sky.mid}"/>`,
    near: `<path d="${ridge(780, 12, rand, 1.6, true)}" fill="${sky.near}"/>`,
  };
  const colors = { far: sky.mid, mid: sky.near, near: sky.sil };

  for (const it of scene.items || []) {
    const layer = it.layer || 'near';
    const s = (it.s || 1) * LAYER_SCALE[layer];
    const y = it.y ?? LAYER_Y[layer];
    const flip = it.flip ? -1 : 1;
    const anim = it.anim ? ` class="sc-${it.anim}"` : '';
    const dim = scene.sky === 'night' && ['tiebele', 'ruins', 'cow'].includes(it.k) ? ' style="filter:brightness(.42) saturate(.7)"' : '';
    layers[layer] += `<g transform="translate(${it.x} ${y}) scale(${f(s * flip * 100) / 100} ${f(s * 100) / 100})" color="${it.color || colors[layer]}" fill="${it.color || colors[layer]}"${dim}><g${anim}>${draw(it, rand, sky)}</g></g>`;
  }

  const label = title ? `<title>${title}</title>` : '';
  return `<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">${label}
<defs>${defs}</defs>
<g class="sc-layer" data-depth="0">${back}</g>
<g class="sc-layer" data-depth="6">${layers.far}</g>
<g class="sc-layer" data-depth="14">${layers.mid}</g>
<g class="sc-layer" data-depth="26">${layers.near}</g>
<rect width="${W}" height="${H}" fill="url(#${uid}vig)" pointer-events="none"/>
</svg>`;
}

/** Parallaxe douce au déplacement du pointeur. */
export function attachParallax(container) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  let raf = 0;
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      container.querySelectorAll('.sc-layer').forEach((g) => {
        const d = +g.dataset.depth;
        g.style.transform = `translate(${f(-dx * d)}px, ${f(-dy * d * 0.4)}px)`;
      });
    });
  };
  container.addEventListener('pointermove', onMove);
  return () => container.removeEventListener('pointermove', onMove);
}
