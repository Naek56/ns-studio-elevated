/* Petits sons synthétisés (Web Audio) — aucun fichier externe.
   Le contexte audio n'est créé qu'après la première interaction
   (politiques d'autoplay des navigateurs). */

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  try {
    if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; at?: number; slideTo?: number } = {}) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + (opts.at ?? 0);
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
  const v = opts.vol ?? 0.12;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(v, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur: number, opts: { vol?: number; at?: number; lowpass?: number } = {}) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + (opts.at ?? 0);
  const len = Math.max(1, Math.floor(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  src.buffer = buf;
  const gain = a.createGain();
  gain.gain.value = opts.vol ?? 0.08;
  const filter = a.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = opts.lowpass ?? 1800;
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(t0);
}

/* — les sons de l'expérience — */

// pop cartoon (clic sur le bouton rouge)
export function sfxPop() {
  tone(320, 0.18, { type: "square", vol: 0.1, slideTo: 90 });
  noise(0.22, { vol: 0.12, lowpass: 2600 });
  tone(680, 0.1, { type: "triangle", vol: 0.08, at: 0.05, slideTo: 1200 });
}

// clic UI discret (choix du quiz, avance)
export function sfxClick() {
  tone(520, 0.07, { type: "triangle", vol: 0.07 });
}

// bonne réponse (petit carillon montant)
export function sfxSuccess() {
  tone(523, 0.14, { type: "sine", vol: 0.1 });
  tone(659, 0.16, { type: "sine", vol: 0.1, at: 0.09 });
  tone(784, 0.22, { type: "sine", vol: 0.1, at: 0.18 });
}

// « il était rouge » (ton descendant, doux)
export function sfxHmm() {
  tone(392, 0.16, { type: "sine", vol: 0.09 });
  tone(311, 0.22, { type: "sine", vol: 0.09, at: 0.12 });
}

// réapparition du bouton (whoosh feutré)
export function sfxWhoosh() {
  noise(0.4, { vol: 0.06, lowpass: 900 });
  tone(180, 0.35, { type: "sine", vol: 0.05, slideTo: 320 });
}

// finale (accord doux)
export function sfxFinale() {
  tone(392, 0.8, { type: "sine", vol: 0.06 });
  tone(494, 0.8, { type: "sine", vol: 0.055, at: 0.05 });
  tone(587, 1.0, { type: "sine", vol: 0.05, at: 0.1 });
}

// transition pixels (montée grésillante)
export function sfxPixels() {
  noise(1.1, { vol: 0.07, lowpass: 2400 });
  tone(140, 1.1, { type: "sawtooth", vol: 0.035, slideTo: 520 });
}
