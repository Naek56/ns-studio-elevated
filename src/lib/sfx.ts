/* Sons doux et « satisfaisants » (Web Audio synthétisé, aucun fichier).
   Que des sinus feutrés, attaques douces, volumes bas — pas de sons de
   jeu vidéo. Le contexte audio n'est créé qu'après une interaction. */

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

/* sinus feutré : attaque douce, retombée naturelle */
function tone(freq: number, dur: number, opts: { vol?: number; at?: number; slideTo?: number; attack?: number } = {}) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + (opts.at ?? 0);
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
  const v = opts.vol ?? 0.08;
  const atk = opts.attack ?? 0.03;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(v, t0 + atk);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/* souffle très filtré (texture, jamais agressif) */
function breath(dur: number, opts: { vol?: number; at?: number; lowpass?: number } = {}) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + (opts.at ?? 0);
  const len = Math.max(1, Math.floor(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const env = Math.sin((i / len) * Math.PI); // fondu entrée + sortie
    d[i] = (Math.random() * 2 - 1) * env;
  }
  const src = a.createBufferSource();
  src.buffer = buf;
  const gain = a.createGain();
  gain.gain.value = opts.vol ?? 0.04;
  const filter = a.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = opts.lowpass ?? 700;
  src.connect(filter).connect(gain).connect(a.destination);
  src.start(t0);
}

/* — la palette de sons du site — */

// tap feutré (liens, boutons, choix) — comme un doigt sur du bois
export function sfxTap() {
  tone(190, 0.12, { vol: 0.09, slideTo: 150, attack: 0.006 });
  breath(0.05, { vol: 0.025, lowpass: 1400 });
}

// pop doux (le bouton de l'expérience) — bulle qui éclate, en rond
export function sfxPop() {
  tone(300, 0.22, { vol: 0.1, slideTo: 130, attack: 0.008 });
  breath(0.16, { vol: 0.05, lowpass: 1100 });
}

// « bonne réponse » — deux notes chaleureuses, espacées
export function sfxSuccess() {
  tone(440, 0.28, { vol: 0.07, attack: 0.03 });
  tone(660, 0.42, { vol: 0.06, at: 0.16, attack: 0.04 });
}

// « il était rouge » — une note douce qui retombe
export function sfxHmm() {
  tone(330, 0.35, { vol: 0.06, slideTo: 262, attack: 0.04 });
}

// apparition / glissement — souffle feutré
export function sfxWhoosh() {
  breath(0.5, { vol: 0.045, lowpass: 600 });
  tone(160, 0.45, { vol: 0.035, slideTo: 240, attack: 0.12 });
}

// finale — accord doux, respiration lente
export function sfxFinale() {
  tone(392, 1.1, { vol: 0.045, attack: 0.25 });
  tone(494, 1.1, { vol: 0.04, at: 0.08, attack: 0.25 });
  tone(587, 1.3, { vol: 0.035, at: 0.16, attack: 0.3 });
}

// transition pixels — montée feutrée (souffle + fondamentale douce)
export function sfxPixels() {
  breath(1.2, { vol: 0.05, lowpass: 900 });
  tone(120, 1.2, { vol: 0.04, slideTo: 300, attack: 0.3 });
}

// envoi de formulaire réussi — carillon discret
export function sfxSend() {
  tone(523, 0.3, { vol: 0.06, attack: 0.03 });
  tone(784, 0.5, { vol: 0.05, at: 0.14, attack: 0.05 });
}
