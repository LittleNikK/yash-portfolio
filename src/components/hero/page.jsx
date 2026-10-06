'use client';


import { useEffect, useRef } from 'react';
import { Inter_Tight } from 'next/font/google';

const inter = Inter_Tight({ subsets: ['latin'], display: 'swap' });

/* ------------------------------- config ------------------------------- */
const WORD = 'YASH’';
const CUSTOM_TEXTURES = []; // e.g. ['/donut.jpg', '/cloud.jpg']  (empty => procedural)
const SWITCH_MS = 7000; // auto texture change interval
const FADE_MS = 900; // crossfade between textures
const TAU = Math.PI * 2;

/* ------------------------------ helpers ------------------------------- */
const mk = (w, h) => {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// cheap blur: repeated halving + bilinear upscale (works in every browser, no ctx.filter)
function blurCanvas(src, radius) {
  const f = Math.max(2, radius * 1.6);
  let cur = src;
  while (cur.width / 2 >= src.width / f) {
    const n = mk(Math.ceil(cur.width / 2), Math.ceil(cur.height / 2));
    const x = n.getContext('2d');
    x.imageSmoothingQuality = 'high';
    x.drawImage(cur, 0, 0, n.width, n.height);
    cur = n;
  }
  const out = mk(src.width, src.height);
  const o = out.getContext('2d');
  o.imageSmoothingQuality = 'high';
  o.drawImage(cur, 0, 0, out.width, out.height);
  return out;
}

/* ------------------------------ layout -------------------------------- */
function computeLayout(Wd, Hd, family) {
  const probe = 100;
  const c = mk(4, 4).getContext('2d');
  const ls = -0.045; // letter-spacing in em
  c.font = `900 ${probe}px ${family}`;
  if ('letterSpacing' in c) c.letterSpacing = `${ls * probe}px`;
  const m = c.measureText(WORD);
  const wProbe = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const margin = Math.max(8, Wd * 0.0065);
  const fs = (probe * (Wd - margin * 2)) / wProbe;
  const asc = (c.measureText('N').actualBoundingBoxAscent / probe) * fs;

  // match the tall, condensed-ish proportions of the reference
  let capT = Wd * 0.195;
  capT = Math.min(capT, Hd * 0.52);
  const sy = clamp(capT / asc, 0.8, 1.45);
  const cap = asc * sy;
  const cy = Hd * 0.52;
  const y = cy + cap / 2; // baseline
  return {
    fs,
    sy,
    ls: ls * fs,
    x: margin + (m.actualBoundingBoxLeft * fs) / probe,
    y,
    top: y - cap - fs * 0.08,
    bottom: y + fs * 0.08,
    font: `900 ${fs}px ${family}`,
  };
}

function drawWord(ctx, L, puff = 0) {
  ctx.save();
  ctx.font = L.font;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${L.ls}px`;
  ctx.textBaseline = 'alphabetic';
  ctx.translate(L.x, L.y);
  ctx.scale(1, L.sy);
  ctx.fillText(WORD, 0, 0);
  if (puff) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = puff;
    ctx.strokeText(WORD, 0, 0);
  }
  ctx.restore();
}

/* ----------------------------- shading -------------------------------- */
// edge darkening + glossy top-left rim, clipped to what is already drawn (source-atop)
function shade(c, mask, fs, o) {
  const w = mask.width;
  const h = mask.height;
  c.save();
  c.globalCompositeOperation = 'source-atop';

  const b = blurCanvas(mask, fs * 0.06);
  const S = mk(w, h);
  const s = S.getContext('2d');
  s.fillStyle = o.dark;
  s.fillRect(0, 0, w, h);
  s.globalCompositeOperation = 'destination-out';
  s.drawImage(b, 0, 0);
  c.globalAlpha = o.darkA;
  c.drawImage(S, 0, 0);

  const b2 = blurCanvas(mask, fs * 0.02);
  const Hc = mk(w, h);
  const hc = Hc.getContext('2d');
  hc.drawImage(b2, 0, 0);
  hc.globalCompositeOperation = 'destination-out';
  hc.drawImage(b2, fs * 0.03, fs * 0.036);
  hc.globalCompositeOperation = 'source-in';
  hc.fillStyle = o.hi;
  hc.fillRect(0, 0, w, h);
  c.globalAlpha = o.hiA;
  c.drawImage(Hc, 0, 0);
  c.restore();
}

/* ---------------------------- textures -------------------------------- */
function makeDonut(L, mask, Wd, Hd) {
  const rng = mulberry32(11);
  const u = Wd / 1568;
  const t = mk(Wd, Hd);
  const c = t.getContext('2d');
  c.drawImage(mask, 0, 0);
  c.globalCompositeOperation = 'source-atop';

  const g = c.createLinearGradient(0, L.top, 0, L.bottom);
  g.addColorStop(0, '#f6adba');
  g.addColorStop(0.5, '#ee97a9');
  g.addColorStop(1, '#dc7590');
  c.fillStyle = g;
  c.fillRect(0, 0, Wd, Hd);

  // glaze mottling
  for (let i = 0; i < 520; i++) {
    const x = rng() * Wd;
    const y = L.top + rng() * (L.bottom - L.top);
    const r = (0.03 + rng() * 0.1) * L.fs;
    c.fillStyle = rng() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(180,40,90,0.06)';
    c.beginPath();
    c.arc(x, y, r, 0, TAU);
    c.fill();
  }

  // sprinkles
  const palette = ['#d2173d', '#d2173d', '#ff3b5c', '#ff3b5c', '#a30f2c', '#ffffff', '#ff8fa3'];
  const count = Math.round((Wd * (L.bottom - L.top)) / 620);
  c.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const x = rng() * Wd;
    const y = L.top + rng() * (L.bottom - L.top);
    const a = rng() * Math.PI;
    const len = (3 + rng() * 5) * u;
    const dx = (Math.cos(a) * len) / 2;
    const dy = (Math.sin(a) * len) / 2;
    c.strokeStyle = palette[Math.floor(rng() * palette.length)];
    c.lineWidth = (1.6 + rng() * 1.2) * u;
    c.beginPath();
    c.moveTo(x - dx, y - dy);
    c.lineTo(x + dx, y + dy);
    c.stroke();
    if (rng() > 0.86) {
      c.fillStyle = 'rgba(255,255,255,0.85)';
      c.beginPath();
      c.arc(x - dx * 0.4, y - dy * 0.4 - 0.6 * u, 0.9 * u, 0, TAU);
      c.fill();
    }
  }

  shade(c, mask, L.fs, { dark: '#7d1433', darkA: 0.72, hi: '#ffffff', hiA: 0.85 });

  // a few glossy glints
  c.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < 90; i++) {
    const x = rng() * Wd;
    const y = L.top + rng() * (L.bottom - L.top);
    const r = (2 + rng() * 7) * u;
    const gg = c.createRadialGradient(x, y, 0, x, y, r);
    gg.addColorStop(0, 'rgba(255,255,255,0.55)');
    gg.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gg;
    c.beginPath();
    c.arc(x, y, r, 0, TAU);
    c.fill();
  }
  return t;
}

function makeCloud(L, mask, Wd, Hd) {
  const rng = mulberry32(29);
  const t = mk(Wd, Hd);
  const c = t.getContext('2d');
  c.drawImage(mask, 0, 0);
  c.globalCompositeOperation = 'source-atop';
  c.fillStyle = '#d7dbe2';
  c.fillRect(0, 0, Wd, Hd);

  // sample points inside the letters
  const md = mask.getContext('2d').getImageData(0, 0, Wd, Hd).data;
  const pts = [];
  const target = Math.round((Wd * (L.bottom - L.top)) / 300);
  let tries = 0;
  while (pts.length < target && tries < target * 12) {
    tries++;
    const x = Math.floor(rng() * Wd);
    const y = Math.floor(L.top + rng() * (L.bottom - L.top));
    if (y < 0 || y >= Hd) continue;
    if (md[(y * Wd + x) * 4 + 3] > 128) {
      pts.push({ x, y, r: (0.05 + rng() * 0.06) * L.fs });
    }
  }
  pts.sort((a, b) => a.y - b.y);

  for (const p of pts) {
    const g = c.createRadialGradient(p.x - p.r * 0.32, p.y - p.r * 0.38, p.r * 0.08, p.x, p.y, p.r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.55, '#f3f5f8');
    g.addColorStop(0.85, '#d3d7de');
    g.addColorStop(1, '#a9aeb9');
    c.fillStyle = g;
    c.beginPath();
    c.arc(p.x, p.y, p.r, 0, TAU);
    c.fill();
  }

  shade(c, mask, L.fs, { dark: '#59606c', darkA: 0.5, hi: '#ffffff', hiA: 0.6 });
  return t;
}

function makeImageTexture(img, L, mask, Wd, Hd) {
  const t = mk(Wd, Hd);
  const c = t.getContext('2d');
  c.drawImage(mask, 0, 0);
  c.globalCompositeOperation = 'source-atop';
  const bw = Wd;
  const bh = L.bottom - L.top;
  const s = Math.max(bw / img.width, bh / img.height);
  const w = img.width * s;
  const h = img.height * s;
  c.drawImage(img, (bw - w) / 2, L.top + (bh - h) / 2, w, h);
  shade(c, mask, L.fs, { dark: '#000', darkA: 0.35, hi: '#fff', hiA: 0.35 });
  return t;
}

const loadImage = (src) =>
  new Promise((res) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => res(null);
    i.src = src;
  });

/* ------------------------------ component ----------------------------- */
export default function Hero() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let disposed = false;
    let raf = 0;
    let S = null; // built scene
    let buildId = 0;
    let stamps = [];
    let baseDrawn = false;

    const pointer = { x: 0, y: 0, has: false, last: -1e9 };
    const head = { x: 0, y: 0, init: false };
    let texIdx = 0;
    let prevIdx = 0;
    let fadeStart = -1e9;
    let nextSwitch = performance.now() + SWITCH_MS;

    /* ---- build everything for the current size ---- */
    async function build() {
      const id = ++buildId;
      const rect = wrap.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const Wd = Math.round(W * dpr);
      const Hd = Math.round(H * dpr);

      const family = inter.style.fontFamily;
      try {
        await document.fonts.load(`900 100px ${family}`, WORD);
      } catch (e) {
        /* fall back silently */
      }
      if (disposed || id !== buildId) return;

      canvas.width = Wd;
      canvas.height = Hd;
      const L = computeLayout(Wd, Hd, family);

      // base: white + black word
      const base = mk(Wd, Hd);
      const bc = base.getContext('2d');
      bc.fillStyle = '#fff';
      bc.fillRect(0, 0, Wd, Hd);
      bc.fillStyle = '#000';
      drawWord(bc, L, 0);

      // slightly puffed letter mask for the textured letters
      const mask = mk(Wd, Hd);
      const mc = mask.getContext('2d');
      mc.fillStyle = '#fff';
      mc.strokeStyle = '#fff';
      drawWord(mc, L, L.fs * 0.02);

      let textures = [];
      if (CUSTOM_TEXTURES.length) {
        const imgs = await Promise.all(CUSTOM_TEXTURES.map(loadImage));
        textures = imgs.filter(Boolean).map((im) => makeImageTexture(im, L, mask, Wd, Hd));
      }
      if (!textures.length) {
        textures = [makeDonut(L, mask, Wd, Hd), makeCloud(L, mask, Wd, Hd)];
      }
      if (disposed || id !== buildId) return;

      // low-res ink field
      const fk = 0.5;
      const fw = Math.max(2, Math.round(W * fk));
      const fh = Math.max(2, Math.round(H * fk));
      const F = mk(fw, fh);
      const fctx = F.getContext('2d', { willReadFrequently: true });

      // soft sprite, profile (1 - d^2)^2
      const sprite = mk(128, 128);
      const sc = sprite.getContext('2d');
      const sg = sc.createRadialGradient(64, 64, 0, 64, 64, 64);
      [0, 0.2, 0.4, 0.6, 0.8, 1].forEach((d) => {
        const a = Math.pow(1 - d * d, 2);
        sg.addColorStop(d, `rgba(255,255,255,${a})`);
      });
      sc.fillStyle = sg;
      sc.fillRect(0, 0, 128, 128);

      const R = mk(Wd, Hd);
      const rctx = R.getContext('2d');

      S = {
        W, H, dpr, Wd, Hd, L, base, textures,
        F, fctx, fw, fh, fk, sprite, R, rctx,
        Rb: clamp(W * 0.085, 60, 150),
        ctx: canvas.getContext('2d'),
      };
      baseDrawn = false;
    }

    /* ---- per-frame ---- */
    function switchTexture(now) {
      if (!S || S.textures.length < 2) return;
      prevIdx = texIdx;
      texIdx = (texIdx + 1) % S.textures.length;
      fadeStart = now;
      nextSwitch = now + SWITCH_MS;
    }

    function update(now, k) {
      const active = pointer.has && now - pointer.last < 1400;

      if (pointer.has) {
        if (!head.init) {
          head.x = pointer.x;
          head.y = pointer.y;
          head.init = true;
        }
        const ease = 1 - Math.pow(1 - 0.2, k);
        const nx = head.x + (pointer.x - head.x) * ease;
        const ny = head.y + (pointer.y - head.y) * ease;
        const dx = nx - head.x;
        const dy = ny - head.y;
        const mv = Math.hypot(dx, dy);

        if (active) {
          const Rh = S.Rb * (0.85 + 0.15 * Math.sin(now * 0.004));
          const steps = Math.min(14, Math.max(1, Math.ceil(mv / (S.Rb * 0.14))));
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            stamps.push({
              x: head.x + dx * t,
              y: head.y + dy * t,
              r: Rh * rand(0.78, 1.05),
              vx: 0, vy: 0, g: 0, d: 0.985,
            });
          }
          // drips / tendrils
          if (mv > 3 && Math.random() < Math.min(1, mv / 30)) {
            const n = Math.random() < 0.5 ? 2 : 1;
            for (let i = 0; i < n; i++) {
              const a = rand(0, TAU);
              const dist = rand(0.5, 1.2) * S.Rb;
              stamps.push({
                x: nx + Math.cos(a) * dist,
                y: ny + Math.sin(a) * dist,
                r: S.Rb * rand(0.1, 0.28),
                vx: -dx * 0.06 + rand(-0.4, 0.4),
                vy: -dy * 0.06 + rand(0, 0.8),
                g: 0.03,
                d: 0.972,
              });
            }
          }
        }
        head.x = nx;
        head.y = ny;
      }

      const fv = Math.pow(0.97, k);
      for (const s of stamps) {
        s.vx *= fv;
        s.x += s.vx * k;
        s.y += s.vy * k;
        s.vy += s.g * k;
        s.r *= Math.pow(s.d, k);
      }
      stamps = stamps.filter((s) => s.r > 2.5);
      if (stamps.length > 800) stamps.splice(0, stamps.length - 800);

      if (now > nextSwitch) switchTexture(now);
    }

    function draw(now) {
      const { ctx, Wd, Hd } = S;
      if (!stamps.length) {
        if (!baseDrawn) {
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(S.base, 0, 0);
          baseDrawn = true;
        }
        return;
      }
      baseDrawn = false;

      // 1) accumulate stamps on the low-res field
      const { fctx, fw, fh, fk, sprite } = S;
      fctx.globalCompositeOperation = 'source-over';
      fctx.clearRect(0, 0, fw, fh);
      fctx.globalCompositeOperation = 'lighter';
      for (const s of stamps) {
        const r = s.r * 1.8 * fk;
        fctx.drawImage(sprite, s.x * fk - r, s.y * fk - r, r * 2, r * 2);
      }
      fctx.globalCompositeOperation = 'source-over';

      // 2) threshold alpha => metaball
      const img = fctx.getImageData(0, 0, fw, fh);
      const d = img.data;
      const T0 = 0.44;
      const T1 = 0.52;
      for (let i = 3; i < d.length; i += 4) {
        const a = d[i] / 255;
        let v;
        if (a <= T0) v = 0;
        else if (a >= T1) v = 1;
        else {
          const x = (a - T0) / (T1 - T0);
          v = x * x * (3 - 2 * x);
        }
        d[i] = (v * 255) | 0;
        d[i - 1] = 0;
        d[i - 2] = 0;
        d[i - 3] = 0;
      }
      fctx.putImageData(img, 0, 0);

      // 3) reveal layer (black + textured letters) masked by the blob
      const { rctx, R, textures } = S;
      rctx.globalCompositeOperation = 'source-over';
      rctx.globalAlpha = 1;
      rctx.clearRect(0, 0, Wd, Hd);
      rctx.fillStyle = '#000';
      rctx.fillRect(0, 0, Wd, Hd);
      const t = clamp((now - fadeStart) / FADE_MS, 0, 1);
      if (t < 1 && prevIdx !== texIdx) {
        rctx.drawImage(textures[prevIdx], 0, 0);
        rctx.globalAlpha = t;
        rctx.drawImage(textures[texIdx], 0, 0);
        rctx.globalAlpha = 1;
      } else {
        rctx.drawImage(textures[texIdx], 0, 0);
      }
      rctx.globalCompositeOperation = 'destination-in';
      rctx.imageSmoothingEnabled = true;
      rctx.imageSmoothingQuality = 'high';
      rctx.drawImage(S.F, 0, 0, Wd, Hd);
      rctx.globalCompositeOperation = 'source-over';

      // 4) compose
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(S.base, 0, 0);
      ctx.drawImage(R, 0, 0);
    }

    let last = performance.now();
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (!S) return;
      const dt = Math.min(50, now - last);
      last = now;
      update(now, dt / 16.667);
      draw(now);
    }

    /* ---- events ---- */
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.has = true;
      pointer.last = performance.now();
    };
    const onDown = (e) => {
      onMove(e);
      switchTexture(performance.now());
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    wrap.addEventListener('pointerdown', onDown, { passive: true });

    let rz = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(rz);
      rz = setTimeout(build, 150);
    });
    ro.observe(wrap);

    build().then(() => {
      if (!disposed) raf = requestAnimationFrame(tick);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(rz);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <main
      ref={wrapRef}
      className={inter.className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: 420,
        overflow: 'hidden',
        background: '#fff',
        isolation: 'isolate',
        touchAction: 'none',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* canvas: base wordmark + ink reveal */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />

      {/* accessible heading (visually hidden — the visible one is on the canvas) */}
      <h1
        style={{
          position: 'absolute', width: 1, height: 1, overflow: 'hidden',
          clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap',
        }}
      >
        YASH’
      </h1>

      {/* UI layer: white + difference blend => inverts inside the ink blob */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          color: '#fff',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          padding: 'clamp(8px, 0.65vw, 14px)',
        }}
      >
        {/* tagline + CTA */}
        {/* <div style={{ position: 'absolute', left: 'clamp(8px,0.65vw,14px)', top: 'clamp(8px,0.65vw,14px)' }}>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(17px, 1.55vw, 28px)',
              lineHeight: 1,
              fontWeight: 600,
              letterSpacing: '-0.025em',
            }}
          >
            Not a style, a perspective.
            <br />
            Because Nothin’ is Everythin’.
          </p>

          <a
            href="#contact"
            style={{
              pointerEvents: 'auto',
              marginTop: 'clamp(16px, 1.6vw, 28px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'clamp(10px, 0.9vw, 16px)',
              height: 'clamp(40px, 3.2vw, 56px)',
              padding: '0 clamp(16px, 1.3vw, 24px)',
              borderRadius: 999,
              background: '#fff',
              color: '#000',
              textDecoration: 'none',
              fontSize: 'clamp(11px, 0.83vw, 15px)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Book a call
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
              <path d="M0 6h18M13 1l5 5-5 5" stroke="#000" strokeWidth="1.3" />
            </svg>
          </a>
        </div> */}

        {/* menu */}
        <a
          href="#menu"
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            right: 'clamp(8px,0.65vw,14px)',
            top: 'clamp(24px, 2.1vw, 40px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#fff',
            textDecoration: 'none',
            fontSize: 'clamp(11px, 0.83vw, 15px)',
            fontWeight: 800,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}
        >
          Menu
          <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true">
            <path d="M0 1h10M0 5h10" stroke="#fff" strokeWidth="1.6" />
          </svg>
        </a>

        {/* footer row */}
        <div
          style={{
            position: 'absolute',
            left: 'clamp(8px,0.65vw,14px)',
            right: 'clamp(8px,0.65vw,14px)',
            bottom: 'clamp(8px, 0.7vw, 14px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 'clamp(10px, 0.78vw, 14px)',
            fontWeight: 800,
            letterSpacing: '0.01em',
          }}
        >
          <span>Creative studio in Pune, India</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(8px,0.8vw,14px)' }}>
            <a href="#linkedin" style={{ pointerEvents: 'auto', color: '#fff', textDecoration: 'none' }}>
              LINKEDIN
            </a>
            <span aria-hidden="true">•</span>
            <a href="#instagram" style={{ pointerEvents: 'auto', color: '#fff', textDecoration: 'none' }}>
              INSTAGRAM
            </a>
            <span
              aria-hidden="true"
              style={{
                width: 'clamp(20px,1.7vw,30px)',
                height: 'clamp(16px,1.3vw,24px)',
                borderRadius: 5,
                background: '#fff',
                color: '#000',
                display: 'grid',
                placeItems: 'center',
                fontSize: 'clamp(9px,0.7vw,12px)',
                fontWeight: 900,
              }}
            >
              N
            </span>
          </span>
        </div>
      </div>
    </main>
  );
}