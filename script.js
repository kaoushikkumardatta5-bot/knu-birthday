"use strict";
/* =====================================================================
   CONFIGURATION — everything you need to edit lives in this block
   ===================================================================== */

// Path to your song, RELATIVE to index.html (no leading slash, no C:\ or file:///).
// It is resolved against the page URL, so it works at https://user.github.io/repo-name/
const AUDIO_SRC = "assets/angel.mp3";

// All values are seconds in YOUR recording. Listen and fill these in.
const AUDIO_START_SECONDS = 0;            // where playback begins
const AUDIO_END_SECONDS = null;           // null = play to the natural end; or a number to stop earlier
const KNU_REVEAL_START_SECONDS = 20;      // PLACEHOLDER: phrases start to appear and travel
const KNU_TARGET_COMPLETE_SECONDS = 65;   // PLACEHOLDER: KNU fully assembled (set this just BEFORE the repeated "LOVE YOU")
// The assembly runs between these two values. Keep them ~45 seconds apart for a slow, suspenseful build
// (the slower the gap, the slower the phrases travel); shrink the gap if you ever want it faster.

/* =====================================================================
   LANGUAGE LIBRARY
   Every phrase means "I love you". No South Indian languages are included.
   s = font-size multiplier (tall scripts are scaled down so they fit the strokes)
   w = how often the phrase is drawn (Bengali is weighted up on purpose)
   ===================================================================== */
const SANS = 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
const F = {
  bn: '"KnuBengali","Noto Sans Bengali","Nirmala UI","Kohinoor Bangla","Bangla Sangam MN","Shonar Bangla",' + SANS,
  hi: '"Noto Sans Devanagari","Nirmala UI","Kohinoor Devanagari","Devanagari Sangam MN",' + SANS,
  gu: '"Noto Sans Gujarati","Nirmala UI","Gujarati Sangam MN",' + SANS,
  pa: '"Noto Sans Gurmukhi","Nirmala UI","Gurmukhi Sangam MN",' + SANS,
  ar: '"Noto Naskh Arabic","Geeza Pro","Segoe UI","Arial",' + SANS,
  ja: '"Hiragino Sans","Yu Gothic","Meiryo","Noto Sans JP",' + SANS,
  ko: '"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",' + SANS,
  zh: '"PingFang SC","Microsoft YaHei","Noto Sans SC",' + SANS,
  th: '"Thonburi","Leelawadee UI","Noto Sans Thai",' + SANS,
  la: SANS
};
const LANGS = [
  // Bengali: "আমি তোমাকে ভালোবাসি" is the standard form; "আমি তোমায় ভালোবাসি" is the warm,
  // everyday spoken form; "তোমায় ভালোবাসি" is the short form used where space is tight.
  { l: "Bengali", t: "তোমায় ভালোবাসি", f: F.bn, s: .82, w: 4 },
  { l: "Bengali", t: "আমি তোমায় ভালোবাসি", f: F.bn, s: .82, w: 3 },
  { l: "Bengali", t: "আমি তোমাকে ভালোবাসি", f: F.bn, s: .82, w: 2 },
  { l: "English", t: "I love you", f: F.la, s: 1 },
  { l: "Hindi", t: "मुझे तुमसे प्यार है", f: F.hi, s: .85 },            // gender-neutral form
  { l: "Marathi", t: "माझं तुझ्यावर प्रेम आहे", f: F.hi, s: .85 },
  { l: "Gujarati", t: "હું તને પ્રેમ કરું છું", f: F.gu, s: .85 },
  { l: "Punjabi", t: "ਮੈਨੂੰ ਤੇਰੇ ਨਾਲ ਪਿਆਰ ਹੈ", f: F.pa, s: .85 },          // gender-neutral form
  { l: "Urdu", t: "مجھے تم سے محبت ہے", f: F.ar, s: 1 },
  { l: "French", t: "Je t'aime", f: F.la, s: 1 },
  { l: "Spanish", t: "Te amo", f: F.la, s: 1 },                          // "Te quiero" is the lighter everyday form
  { l: "Portuguese", t: "Eu te amo", f: F.la, s: 1 },
  { l: "Italian", t: "Ti amo", f: F.la, s: 1 },
  { l: "German", t: "Ich liebe dich", f: F.la, s: 1 },
  { l: "Dutch", t: "Ik hou van je", f: F.la, s: 1 },
  { l: "Russian", t: "Я тебя люблю", f: F.la, s: 1 },
  { l: "Ukrainian", t: "Я тебе кохаю", f: F.la, s: 1 },
  { l: "Greek", t: "Σ' αγαπώ", f: F.la, s: 1 },
  { l: "Turkish", t: "Seni seviyorum", f: F.la, s: 1 },
  { l: "Arabic", t: "أحبكِ", f: F.ar, s: 1.05 },                         // feminine address (to a woman)
  { l: "Persian", t: "دوستت دارم", f: F.ar, s: 1 },
  { l: "Japanese", t: "愛してる", f: F.ja, s: 1.05 },
  { l: "Korean", t: "사랑해", f: F.ko, s: 1.05 },
  { l: "Chinese", t: "我爱你", f: F.zh, s: 1.05 },
  { l: "Indonesian", t: "Aku cinta kamu", f: F.la, s: 1 },
  // Vietnamese pronouns encode the speaker: "Anh yêu em" = a man speaking to his partner.
  // If the sender is a woman, change it to "Em yêu anh".
  { l: "Vietnamese", t: "Anh yêu em", f: F.la, s: 1 },
  { l: "Thai", t: "ฉันรักเธอ", f: F.th, s: .88 },
  { l: "Swahili", t: "Nakupenda", f: F.la, s: 1 },
  { l: "Polish", t: "Kocham cię", f: F.la, s: 1 },
  { l: "Romanian", t: "Te iubesc", f: F.la, s: 1 },
  { l: "Swedish", t: "Jag älskar dig", f: F.la, s: 1 },
  { l: "Norwegian", t: "Jeg elsker deg", f: F.la, s: 1 }
];
const COLORS = ["#e9e2ff", "#cdbdf0", "#d6f1e8", "#f4efe6", "#b9c4f5"];

/* =====================================================================
   HELPERS
   ===================================================================== */
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function rng(seed) { // deterministic, so the layout is stable across resizes and replays
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const REVEAL = KNU_REVEAL_START_SECONDS;
const COMPLETE = Math.max(KNU_TARGET_COMPLETE_SECONDS, REVEAL + .1);

/* =====================================================================
   AUDIO + TIMELINE
   The visuals read audio.currentTime directly, so pause / resume / seek stay in sync.
   If audio is blocked or missing, a visual-only clock (fbT) drives the same timeline.
   ===================================================================== */
const audio = $("song"), playBtn = $("playBtn"), muteBtn = $("muteBtn"), replayBtn = $("replayBtn"), noteEl = $("audioNote");
audio.src = new URL(AUDIO_SRC, document.baseURI).href;
let audioFailed = false, audioSynced = false, playing = false, started = false, finished = false, fbT = AUDIO_START_SECONDS;

const note = m => { noteEl.textContent = m || ""; };
function updUI() {
  playBtn.textContent = playing ? "Pause" : "Play";
  playBtn.disabled = audioFailed;
  muteBtn.textContent = audio.muted ? "Unmute" : "Mute";
  muteBtn.disabled = audioFailed;
}
const curT = () => (audioSynced && !audioFailed) ? audio.currentTime : fbT;

audio.addEventListener("error", () => {
  audioFailed = true; playing = false; audioSynced = false;
  note("The music file could not be loaded. Check AUDIO_SRC in script.js and the file name in assets/.");
  updUI();
});
audio.addEventListener("playing", () => {
  playing = true; note("");
  if (!audioSynced) { // visuals may have run ahead on the fallback clock while playback was blocked
    audioSynced = true;
    if (fbT - AUDIO_START_SECONDS > 1 && isFinite(audio.duration) && fbT < audio.duration) audio.currentTime = fbT;
  }
  updUI();
});
audio.addEventListener("pause", () => { playing = false; updUI(); });
audio.addEventListener("ended", () => { finished = true; playing = false; updUI(); });
audio.addEventListener("seeked", () => { // seeking back before the finish re-opens the timeline
  const t = audio.currentTime;
  if (finished && t < COMPLETE - .5 && (AUDIO_END_SECONDS == null || t < AUDIO_END_SECONDS - .5)) finished = false;
});

function tryPlay() {
  if (audioFailed) return;
  const pr = audio.play();
  if (pr && pr.catch) pr.catch(err => {
    if (err && err.name === "NotAllowedError") note("Tap Play to start the music.");
    else { audioFailed = true; note("The music could not be played in this browser."); }
    playing = false; updUI();
  });
}
function begin() {
  if (started) return;
  started = true; finished = false; fbT = AUDIO_START_SECONDS;
  document.body.classList.remove("intro"); document.body.classList.add("started");
  try { if (AUDIO_START_SECONDS > 0) audio.currentTime = AUDIO_START_SECONDS; } catch (e) {}
  tryPlay();
}
function replay() {
  finished = false; fbT = AUDIO_START_SECONDS; note("");
  if (!audioFailed) {
    try { audio.currentTime = AUDIO_START_SECONDS; } catch (e) {}
    tryPlay();
  }
}
$("openBtn").addEventListener("click", begin);
replayBtn.addEventListener("click", replay);
muteBtn.addEventListener("click", () => { audio.muted = !audio.muted; updUI(); });
playBtn.addEventListener("click", () => {
  if (audioFailed) return;
  if (audio.paused) { if (finished) replay(); else tryPlay(); } else audio.pause();
});
updUI();

/* =====================================================================
   THE MOSAIC — phrases ARE the pixels of K, N and U.
   A hidden mask (never drawn on screen) decides where strokes are; text is packed
   row by row only where every sampled point of the text box lies inside a stroke.
   ===================================================================== */
const mc = $("mosaic"), mx = mc.getContext("2d");
let VW = 0, VH = 0, DPR = 1, frags = [], settledDrawn = false;

function drawLetter(c, ch, lw, lh, t) { // mask geometry in a lw x lh box, stroke thickness t
  c.save(); c.beginPath(); c.rect(0, 0, lw, lh); c.clip(); c.fillStyle = c.strokeStyle = "#fff"; c.lineCap = "butt";
  const L = (x1, y1, x2, y2, w) => { c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
  if (ch === "K") { // stem + upper arm + lower arm
    c.fillRect(0, 0, t, lh);
    L(t * .5, lh * .56, lw * 1.06, -lh * .04, t * .95);
    L(lw * .3, lh * .4, lw * 1.06, lh * 1.04, t * .95);
  } else if (ch === "N") { // left stem + diagonal + right stem
    c.fillRect(0, 0, t, lh); c.fillRect(lw - t, 0, t, lh);
    L(t * .3, -lh * .02, lw - t * .3, lh * 1.02, t * .9);
  } else { // U: two stems + smooth curved bottom
    const r = (lw - t) / 2, cy = lh - t / 2 - r;
    c.fillRect(0, 0, t, cy + 1); c.fillRect(lw - t, 0, t, cy + 1);
    c.lineWidth = t; c.beginPath(); c.arc(lw / 2, cy, r, 0, Math.PI); c.stroke();
  }
  c.restore();
}

function buildMosaic() {
  VW = innerWidth; VH = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
  mc.width = Math.round(VW * DPR); mc.height = Math.round(VH * DPR);
  const G = .22, lw = Math.min(VW * .92 / (3 + 2 * G), VH * .5 / 1.25), lh = lw * 1.25, g = lw * G, t = lw * .3;
  const tw = Math.ceil(3 * lw + 2 * g), th = Math.ceil(lh), ox = (VW - tw) / 2, oy = VH * .43 - lh / 2;

  const m = document.createElement("canvas"); m.width = tw; m.height = th;
  const c = m.getContext("2d", { willReadFrequently: true });
  ["K", "N", "U"].forEach((ch, i) => { c.save(); c.translate(i * (lw + g), 0); drawLetter(c, ch, lw, lh, t); c.restore(); });
  const md = c.getImageData(0, 0, tw, th).data;
  const inside = (x, y) => x >= 0 && y >= 0 && x < tw && y < th && md[((y | 0) * tw + (x | 0)) * 4 + 3] > 140;

  const R = rng(2026), rowH = clamp(lh / 30, 7.5, 17), fs = rowH * .7, gap = fs * 1.1, pad = fs * .35, dv = rowH * .42;
  let pool = [], pi = 0;
  const shuffle = () => {
    pool = []; LANGS.forEach(e => { for (let k = 0; k < (e.w || 1); k++) pool.push(e); });
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    pi = 0;
  };
  shuffle();
  const next = () => { if (pi >= pool.length) shuffle(); return pool[pi++]; };
  const ok = (x, y) => inside(x, y - dv) && inside(x, y) && inside(x, y + dv);

  frags = [];
  for (let y = rowH / 2; y < th - rowH / 2 + 1; y += rowH) {
    let x = 0;
    while (x < tw) {
      if (!ok(x, y)) { x++; continue; }
      let xe = x; while (xe < tw && ok(xe, y)) xe++;
      const avail = xe - x - 2 * pad;
      if (avail > fs * 3) {
        const row = []; let cur = 0;
        for (;;) { // pack phrases left to right; try several candidates; skip any that would leave the stroke
          let placed = false;
          for (let k = 0; k < 12; k++) {
            const e = next(), font = (fs * e.s).toFixed(1) + "px " + e.f;
            mx.font = font; const w = mx.measureText(e.t).width;
            if (cur + w <= avail) { row.push({ e, font, w, x: cur }); cur += w + gap; placed = true; break; }
          }
          if (!placed) break;
        }
        if (row.length) {
          const off = (avail - (cur - gap)) / 2;
          row.forEach(r => {
            const tx = ox + x + pad + off + r.x + r.w / 2, ty = oy + y;
            const sx = RM ? tx : R() * VW, sy = RM ? ty : R() * VH, dx = tx - sx, dy = ty - sy, len = Math.hypot(dx, dy) || 1, cv = (R() - .5) * .35 * len;
            frags.push({ t: r.e.t, f: r.font, x: tx, y: ty, sx, sy, cx: -dy / len * cv, cy: dx / len * cv,
              d: RM ? 0 : R() * .55, ph: R() * 6.28, r0: RM ? 0 : (R() - .5) * 1.6, a: .78 + R() * .22,
              c: r.e.l === "Bengali" ? "#fff0cf" : COLORS[Math.floor(R() * COLORS.length)] });
          });
        }
      }
      x = xe + 1;
    }
  }
  settledDrawn = false;
}

function drawMosaic(p, time) {
  mx.setTransform(DPR, 0, 0, DPR, 0, 0); mx.clearRect(0, 0, VW, VH);
  mx.shadowBlur = 0;
  if (p <= 0) return;
  mx.textAlign = "center"; mx.textBaseline = "middle";
  const done = p >= 1;
  if (done) { mx.shadowColor = "rgba(190,170,240,.6)"; mx.shadowBlur = 5; }
  const fade = ease(clamp(p / .2, 0, 1));
  for (const f of frags) {
    const e = ease(clamp((p - f.d) / .45, 0, 1)), arc = Math.sin(Math.PI * e), wob = (1 - e) * Math.sin(time * .0011 + f.ph) * 7;
    const x = lerp(f.sx, f.x, e) + f.cx * arc + wob, y = lerp(f.sy, f.y, e) + f.cy * arc + wob;
    const a = (1 - e) * f.r0, cs = Math.cos(a) * DPR, sn = Math.sin(a) * DPR;
    mx.setTransform(cs, sn, -sn, cs, x * DPR, y * DPR);
    mx.globalAlpha = f.a * fade * (.18 + .82 * e);
    mx.fillStyle = f.c; mx.font = f.f; mx.fillText(f.t, 0, 0);
  }
  mx.globalAlpha = 1; mx.setTransform(1, 0, 0, 1, 0, 0);
}

/* =====================================================================
   AMBIENT EFFECTS: stars, sparkles, butterflies, rose petals (one canvas)
   ===================================================================== */
const fc = $("fx"), fx = fc.getContext("2d");
let FW = 0, FH = 0, FD = 1, stars = [], sparks = [], petals = [], flies = [], lvl = 0;
const small = () => Math.min(innerWidth, innerHeight) < 600;
const WU = new Path2D("M0 0C-8-14-20-8-15 1C-12 5-4 3 0 0Z"), WL = new Path2D("M0 0C-10 4-14 14-7 13C-3 12-1 6 0 0Z");
const WING = [["rgba(170,140,240,.5)", "rgba(110,200,200,.4)"], ["rgba(200,180,250,.5)", "rgba(120,150,230,.4)"], ["rgba(120,210,190,.45)", "rgba(160,130,235,.4)"]];
const PETAL = ["#6b1030", "#8a1c3c", "#a02a4a", "#9b82c4", "#e4bfcb", "#c7b4e0"];

function newSpark(s) { const r = Math.random; s.x = r() * FW; s.y = r() * FH; s.vx = (r() - .5) * .012; s.vy = -r() * .01; s.l = 0; s.m = 2200 + r() * 3600; s.s = 1 + r() * 2; return s; }
function newPetal(p, first) {
  const r = Math.random; p.on = true; p.x = r() * FW; p.y = first ? -20 - r() * FH * .6 : -20; p.vy = .028 + r() * .035; p.vx = (r() - .5) * .01;
  p.rot = r() * 6.28; p.vr = (r() - .5) * .0016; p.ph = r() * 6.28; p.fl = r() * 6.28; p.col = PETAL[Math.floor(r() * PETAL.length)]; p.s = p.rose ? 7 + r() * 3 : 4 + r() * 4;
}
function newFly(b, first) {
  const r = Math.random; b.x = r() * FW; b.y = r() * FH; b.a = r() * 6.28; b.sp = .012 + r() * .014; b.sz = .5 + r() * .7; b.ph = r() * 6.28; b.fr = .008 + r() * .006;
  b.l = first ? r() * 6000 : 0; b.m = 14000 + r() * 9000; b.pal = WING[Math.floor(r() * WING.length)]; b.on = true;
}
function buildFx() {
  FW = innerWidth; FH = innerHeight; FD = Math.min(devicePixelRatio || 1, 1.5); fc.width = Math.round(FW * FD); fc.height = Math.round(FH * FD);
  const r = Math.random, sm = small();
  stars = Array.from({ length: sm ? 60 : 100 }, () => ({ x: r() * FW, y: r() * FH, r: r() * 1.1 + .25, ph: r() * 6.28, sp: .0004 + r() * .0012, a: .25 + r() * .5 }));
  sparks = Array.from({ length: sm ? 14 : 26 }, () => newSpark({}));
  petals = Array.from({ length: (sm ? 11 : 19) + 3 }, (_, i) => { const p = { rose: i < 3, on: false }; return p; });
  petals.forEach(p => { if (p.on !== undefined) p.on = false; });
  flies = Array.from({ length: sm ? 4 : 6 }, () => newFly({}, true));
  if (RM) drawStarsStatic();
}
function drawStarsStatic() {
  fx.setTransform(FD, 0, 0, FD, 0, 0); fx.clearRect(0, 0, FW, FH);
  stars.forEach(s => { fx.globalAlpha = s.a * .8; fx.fillStyle = "#e6e8f2"; fx.beginPath(); fx.arc(s.x, s.y, s.r, 0, 6.283); fx.fill(); });
  fx.globalAlpha = 1;
}
function drawFx(dt, time) {
  if (started && lvl < 1) lvl = Math.min(1, lvl + dt / 14000);
  fx.setTransform(FD, 0, 0, FD, 0, 0); fx.clearRect(0, 0, FW, FH);
  // stars
  fx.fillStyle = "#e6e8f2";
  for (const s of stars) { fx.globalAlpha = s.a * (.55 + .45 * Math.sin(time * s.sp + s.ph)); fx.beginPath(); fx.arc(s.x, s.y, s.r, 0, 6.283); fx.fill(); }
  // sparkles: a few at first, more as the scene opens
  const ns = Math.floor(5 + (sparks.length - 5) * lvl);
  for (let i = 0; i < ns; i++) {
    const s = sparks[i]; s.l += dt; if (s.l >= s.m) newSpark(s);
    s.x += s.vx * dt; s.y += s.vy * dt;
    const a = Math.pow(Math.sin(Math.PI * s.l / s.m), 2);
    fx.globalAlpha = a * .8; fx.fillStyle = "#e9e2ff"; fx.beginPath(); fx.arc(s.x, s.y, s.s * .8, 0, 6.283); fx.fill();
    if (a > .7) { fx.globalAlpha = (a - .7) * 2; fx.strokeStyle = "#f4efe6"; fx.lineWidth = .6; const k = s.s * 3.2;
      fx.beginPath(); fx.moveTo(s.x - k, s.y); fx.lineTo(s.x + k, s.y); fx.moveTo(s.x, s.y - k); fx.lineTo(s.x, s.y + k); fx.stroke(); }
  }
  // butterflies: 2 visible on the opening screen, up to full count after it
  const nf = Math.floor(2 + (flies.length - 2) * lvl);
  for (let i = 0; i < nf; i++) {
    const b = flies[i]; b.l += dt; if (b.l >= b.m) newFly(b);
    b.a += Math.sin(time * .0006 + b.ph) * .0016 * dt;
    if (b.x < FW * .04 || b.x > FW * .96 || b.y < FH * .04 || b.y > FH * .96) {
      const tg = Math.atan2(FH / 2 - b.y, FW / 2 - b.x); b.a += (((tg - b.a + 9.42478) % 6.28319) - 3.14159) * .0018 * dt;
    }
    b.x += Math.cos(b.a) * b.sp * dt; b.y += Math.sin(b.a) * b.sp * dt;
    const al = Math.sin(Math.PI * b.l / b.m), w = .25 + .75 * Math.abs(Math.sin(time * b.fr + b.ph));
    fx.save(); fx.globalAlpha = al * .85; fx.translate(b.x, b.y); fx.rotate(b.a + Math.PI / 2);
    for (const side of [1, -1]) {
      fx.save(); fx.scale(side * w * b.sz, b.sz); fx.fillStyle = b.pal[0]; fx.fill(WU); fx.fillStyle = b.pal[1]; fx.fill(WL);
      fx.lineWidth = .7 / b.sz; fx.strokeStyle = "rgba(235,230,255,.5)"; fx.stroke(WU); fx.restore();
    }
    fx.fillStyle = "rgba(235,230,255,.7)"; fx.fillRect(-.6 * b.sz, -5 * b.sz, 1.2 * b.sz, 12 * b.sz); fx.restore();
  }
  // petals and a few small roses fall once the experience begins
  const np = Math.floor(petals.length * lvl);
  for (let i = 0; i < petals.length; i++) {
    const p = petals[i];
    if (!p.on) { if (i < np) newPetal(p, true); else continue; }
    p.y += p.vy * dt; p.x += (p.vx + Math.sin(time * .0008 + p.ph) * .02) * dt; p.rot += p.vr * dt; p.fl += .0021 * dt;
    if (p.y > FH + 24) { if (i < np) newPetal(p, false); else p.on = false; continue; }
    fx.save(); fx.translate(p.x, p.y); fx.rotate(p.rot); fx.globalAlpha = .8; fx.fillStyle = p.col;
    if (p.rose) {
      const g = fx.createRadialGradient(0, 0, 0, 0, 0, p.s); g.addColorStop(0, "#c23a5c"); g.addColorStop(1, "#5a0f28");
      fx.fillStyle = g; fx.beginPath(); fx.arc(0, 0, p.s, 0, 6.283); fx.fill();
      fx.strokeStyle = "rgba(255,200,215,.35)"; fx.lineWidth = .8; fx.beginPath(); fx.arc(0, 0, p.s * .6, .5, 5); fx.arc(0, 0, p.s * .3, 2, 7); fx.stroke();
    } else {
      fx.scale(1, Math.max(.25, Math.abs(Math.cos(p.fl)))); const s = p.s;
      fx.beginPath(); fx.moveTo(0, -s); fx.quadraticCurveTo(s * .9, -s * .2, 0, s); fx.quadraticCurveTo(-s * .9, -s * .2, 0, -s); fx.fill();
    }
    fx.restore();
  }
  fx.globalAlpha = 1;
}

/* =====================================================================
   MAIN LOOP — a single requestAnimationFrame loop, started once, never duplicated
   ===================================================================== */
let last = 0;
function loop(ts) {
  requestAnimationFrame(loop);
  const dt = Math.min(ts - last || 16, 50); last = ts;
  if (started && !finished && !(audioSynced && !audioFailed)) fbT += dt / 1000; // visual-only clock
  if (started && !finished && AUDIO_END_SECONDS != null && curT() >= AUDIO_END_SECONDS) {
    finished = true; if (!audio.paused) audio.pause();
  }
  const p = !started ? 0 : finished ? 1 : clamp((curT() - REVEAL) / (COMPLETE - REVEAL), 0, 1);
  document.body.classList.toggle("complete", started && p >= 1);
  if (p < 1) { settledDrawn = false; drawMosaic(p, ts); }
  else if (!settledDrawn) { drawMosaic(1, ts); settledDrawn = true; } // finished artwork is drawn once and kept
  if (!RM) drawFx(dt, ts);
}

let rz = 0;
addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { buildMosaic(); buildFx(); }, 150); });
buildMosaic(); buildFx();
if (document.fonts && document.fonts.load) document.fonts.load("12px KnuBengali", "আমি").then(buildMosaic).catch(() => {});
requestAnimationFrame(loop);