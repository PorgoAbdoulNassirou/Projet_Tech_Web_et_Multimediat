/*
 * Ambiance sonore générée en temps réel avec la Web Audio API.
 * Aucun fichier à télécharger : grillons, feu, vent, eau et quelques
 * notes de balafon sur une gamme pentatonique sont synthétisés.
 */

const PENTA = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

export class Ambience {
  constructor() {
    this.ctx = null;
    this.on = false;
    this.layers = {};
    this.timers = [];
    this.preset = { crickets: true, fire: false, wind: false, water: false };
  }

  _init() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    const len = this.ctx.sampleRate * 2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    this.layers.wind = this._noiseLayer('lowpass', 380, 0.7);
    this.layers.water = this._noiseLayer('bandpass', 900, 0.5);
    return true;
  }

  _noiseLayer(type, freq, q) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.08 + Math.random() * 0.1;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = freq * 0.35;
    lfo.connect(lfoGain).connect(filter.frequency);
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    lfo.start();
    return gain;
  }

  _chirp(t) {
    const c = this.ctx;
    for (let i = 0; i < 3; i++) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = 4300 + Math.random() * 300;
      const s = t + i * 0.055;
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.012, s + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.04);
      o.connect(g).connect(this.master);
      o.start(s);
      o.stop(s + 0.05);
    }
  }

  _crackle(t) {
    const c = this.ctx;
    const src = c.createBufferSource();
    src.buffer = this.noise;
    const f = c.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 1400 + Math.random() * 2000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.02 + Math.random() * 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + Math.random() * 0.05);
    src.connect(f).connect(g).connect(this.master);
    src.start(t, Math.random() * 1.5, 0.1);
  }

  _note(t, freq, vel = 0.05) {
    const c = this.ctx;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    // Son de lame de bois : fondamentale et partiel aigu qui s'éteint vite
    [[1, 1], [3.9, 0.35], [9.2, 0.12]].forEach(([m, a]) => {
      const o = c.createOscillator();
      const og = c.createGain();
      o.frequency.value = freq * m;
      og.gain.setValueAtTime(a, t);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.9 / m);
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + 1);
    });
    g.connect(this.master);
  }

  _phrase() {
    const t = this.ctx.currentTime + 0.05;
    let idx = Math.floor(Math.random() * 5);
    const n = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      idx = Math.max(0, Math.min(PENTA.length - 1, idx + Math.floor(Math.random() * 5) - 2));
      this._note(t + i * (0.22 + Math.random() * 0.12), PENTA[idx], 0.035 + Math.random() * 0.02);
    }
  }

  _loop(fn, min, max) {
    const tick = () => {
      if (!this.on) return;
      fn();
      this.timers.push(setTimeout(tick, min + Math.random() * (max - min)));
    };
    this.timers.push(setTimeout(tick, Math.random() * min));
  }

  /** Choisit les couches en fonction de la scène affichée. */
  setScene(scene) {
    const keys = (scene.items || []).map((i) => i.k);
    this.preset = {
      crickets: scene.sky === 'night' || scene.sky === 'dusk',
      fire: keys.includes('fire'),
      wind: scene.sky === 'dust' || scene.ground === 'sahel',
      water: keys.includes('pond') || keys.includes('waterfall'),
    };
    this._apply();
  }

  _apply() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.layers.wind.gain.setTargetAtTime(this.preset.wind ? 0.09 : 0.025, t, 1.2);
    this.layers.water.gain.setTargetAtTime(this.preset.water ? 0.06 : 0, t, 1.2);
  }

  start() {
    if (!this.ctx && !this._init()) return false;
    this.ctx.resume();
    this.on = true;
    this.master.gain.setTargetAtTime(0.9, this.ctx.currentTime, 0.8);
    this._apply();
    this._loop(() => { if (this.preset.crickets) this._chirp(this.ctx.currentTime + 0.02); }, 350, 1400);
    this._loop(() => { if (this.preset.fire) this._crackle(this.ctx.currentTime + 0.01); }, 40, 260);
    this._loop(() => this._phrase(), 3500, 7500);
    return true;
  }

  stop() {
    this.on = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this.ctx) this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
  }

  /** Baisse l'ambiance pendant que la voix raconte. */
  duck(active) {
    if (!this.ctx || !this.on) return;
    this.master.gain.setTargetAtTime(active ? 0.4 : 0.9, this.ctx.currentTime, 0.4);
  }
}
