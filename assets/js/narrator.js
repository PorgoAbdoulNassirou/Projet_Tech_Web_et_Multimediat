/*
 * Narration vocale.
 *
 * Deux sources possibles :
 *  - la synthèse vocale du navigateur (Web Speech API), en français,
 *    avec un suivi paragraphe par paragraphe pour le surlignage ;
 *  - un enregistrement réel (élément <audio>) dans une langue nationale.
 */

const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;

export const ttsSupported = !!synth;

let voice = null;
function pickVoice() {
  if (!synth) return;
  const voices = synth.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('fr'));
  const prefer = [/natural|neural|online/i, /google/i, /denise|henri|eloise|amelie|thomas/i];
  voice = prefer.map((re) => voices.find((v) => re.test(v.name))).find(Boolean) || voices.find((v) => /fr-FR/i.test(v.lang)) || voices[0] || null;
}
if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
}

/* Découpe en phrases : certains navigateurs coupent les énoncés trop longs. */
const sentences = (text) => text.match(/[^.!?…»]+[.!?…»]+["»\s]*|[^.!?…]+$/g)?.map((s) => s.trim()).filter(Boolean) || [text];

export class Narrator {
  constructor() {
    this.rate = 1;
    this.playing = false;
    this.paragraphs = [];
    this.index = 0;
    this.token = 0;
    this.audio = null;
    this.handlers = {};
  }

  on(evt, fn) { this.handlers[evt] = fn; return this; }
  emit(evt, ...a) { this.handlers[evt]?.(...a); }

  /* ---- Synthèse vocale ---- */
  read(paragraphs, from = 0) {
    this.stop(false);
    this.paragraphs = paragraphs;
    this.index = from;
    this.playing = true;
    this.emit('state', true);
    this._next(++this.token);
  }

  _next(token) {
    if (token !== this.token || !this.playing) return;
    if (this.index >= this.paragraphs.length) {
      this.playing = false;
      this.emit('para', -1);
      this.emit('state', false);
      this.emit('end');
      return;
    }
    this.emit('para', this.index);
    const parts = sentences(this.paragraphs[this.index]);
    let k = 0;
    const speakPart = () => {
      if (token !== this.token || !this.playing) return;
      if (k >= parts.length) {
        this.index++;
        setTimeout(() => this._next(token), 350);
        return;
      }
      const u = new SpeechSynthesisUtterance(parts[k++]);
      u.lang = 'fr-FR';
      if (voice) u.voice = voice;
      u.rate = 0.95 * this.rate;
      u.pitch = 0.95;
      u.onend = speakPart;
      u.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') speakPart();
      };
      this._u = u; // garde une référence : évite que l'énoncé soit libéré trop tôt
      synth.speak(u);
    };
    speakPart();
  }

  /* ---- Enregistrement ---- */
  playFile(src) {
    this.stop(false);
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.addEventListener('timeupdate', () => {
        if (this.audio.duration) this.emit('progress', this.audio.currentTime / this.audio.duration);
      });
      this.audio.addEventListener('ended', () => { this.playing = false; this.emit('state', false); this.emit('end'); });
      this.audio.addEventListener('error', () => { this.playing = false; this.emit('state', false); this.emit('error'); });
    }
    if (!this.audio.src.endsWith(src)) this.audio.src = src;
    this.audio.playbackRate = this.rate;
    this.playing = true;
    this.emit('state', true);
    this.audio.play().catch(() => { this.playing = false; this.emit('state', false); });
  }

  setRate(r) {
    this.rate = r;
    if (this.audio) this.audio.playbackRate = r;
  }

  stop(emit = true) {
    this.token++;
    this.playing = false;
    synth?.cancel();
    this.audio?.pause();
    if (emit) { this.emit('state', false); this.emit('para', -1); }
  }
}
