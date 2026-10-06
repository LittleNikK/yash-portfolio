'use client';



import { useEffect, useRef, useState } from 'react';
import { Hanken_Grotesk } from 'next/font/google';

const font = Hanken_Grotesk({ subsets: ['latin'], display: 'swap', weight: ['400', '500', '600', '700'] });

/* ------------------------------------------------------------------ */
/*  CONTENT                                                             */
/* ------------------------------------------------------------------ */
const SKILLS = [
  {
    title: 'Product Design',
    text: 'From “we have an idea” to flows, prototypes and systems ready to grow.',
    img: '', // e.g. '/skills/product.jpg'
    art: 'phone',
  },
  {
    title: 'Brand & Art Direction',
    text: 'Identities with a point of view, built to be recognized, remembered and used.',
    img: '',
    art: 'brand',
  },
  {
    title: 'UX | UI',
    text: 'Clear interfaces for real behavior, weird edge cases and every screen in between.',
    img: '',
    art: 'ux',
  },
  {
    title: 'Motion & 3D',
    text: 'Motion and 3D that explain, elevate and occasionally steal the show.',
    img: '',
    art: 'motion',
  },
];

const PREVIEW_W = 316; // px at a 1500px-wide viewport; scales with the viewport
const PREVIEW_H = 218;
const REF_VW = 1500;
const EASE = 0.14; // follow speed (0..1 per 60fps frame)

/* ------------------------------------------------------------------ */
/*  Placeholder artwork for the preview (replaced by `img`)             */
/* ------------------------------------------------------------------ */
function Art({ kind }) {
  const fill = { position: 'absolute', inset: 0 };
  if (kind === 'phone') {
    return (
      <div style={{ ...fill, background: 'linear-gradient(135deg,#f4f5f7,#dfe3ea)' }}>
        <div
          style={{
            position: 'absolute',
            left: '-6%',
            top: '34%',
            width: '58%',
            height: '90%',
            borderRadius: '14% / 9%',
            transform: 'rotate(-26deg)',
            background: 'linear-gradient(160deg,#27357a,#141c4a)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '12%',
            top: '52%',
            width: '14%',
            height: '14%',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.35)',
            transform: 'rotate(-26deg)',
          }}
        />
      </div>
    );
  }
  if (kind === 'brand') {
    return (
      <div style={{ ...fill, background: '#fff' }}>
        <div
          style={{
            ...fill,
            backgroundImage:
              'radial-gradient(circle,#10256f 22%,transparent 24%), radial-gradient(circle,#10256f 22%,transparent 24%)',
            backgroundSize: '18px 18px',
            backgroundPosition: '0 0, 9px 9px',
            clipPath: 'polygon(0 0,62% 0,34% 100%,0 100%)',
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '40%',
            top: '22%',
            width: '44%',
            height: '60%',
            background: 'linear-gradient(135deg,#1d3fbb,#0c1f6e)',
            transform: 'rotate(18deg)',
            borderRadius: 4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8%',
            bottom: '10%',
            width: '16%',
            height: '16%',
            background: '#f5b800',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }
  if (kind === 'ux') {
    return (
      <div style={{ ...fill, background: '#eef0f3' }}>
        <div
          style={{
            position: 'absolute',
            left: '12%',
            top: '8%',
            width: '76%',
            height: '66%',
            background: '#fff',
            border: '5px solid #2b2d31',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ display: 'flex', gap: 6, padding: '6px 6px 0' }}>
              {[0, 1, 2, 3].map((c) => (
                <div
                  key={c}
                  style={{
                    flex: 1,
                    height: 34,
                    borderRadius: 4,
                    background: ['#e4f5e4', '#e6f0fb', '#fdf1dc', '#f3e6f7'][(r + c) % 4],
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: '40%', bottom: '10%', width: '20%', height: '14%', background: '#2b2d31' }} />
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: '22%', height: '30%', background: '#e8a90f', borderRadius: '100% 0 0 0' }} />
      </div>
    );
  }
  return (
    <div style={{ ...fill, background: 'linear-gradient(135deg,#dfe6f7,#f6eede)' }}>
      {[
        { l: '28%', t: '22%', w: '36%', h: '26%', c: '#8fc57a', r: -28 },
        { l: '55%', t: '44%', w: '40%', h: '9%', c: '#f07a2e', r: -28 },
        { l: '4%', t: '36%', w: '34%', h: '8%', c: '#4f73d9', r: -28 },
        { l: '16%', t: '66%', w: '40%', h: '8%', c: '#b7d3b0', r: -28 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.l,
            top: b.t,
            width: b.w,
            height: b.h,
            background: b.c,
            transform: `rotate(${b.r}deg)`,
            borderRadius: 4,
            boxShadow: '0 8px 14px rgba(0,0,0,0.18)',
          }}
        />
      ))}
      {[
        { l: '8%', t: '28%', s: 22, c: '#f2b88a' },
        { l: '76%', t: '22%', s: 24, c: '#2f55e6' },
        { l: '84%', t: '62%', s: 18, c: '#6fcf5a' },
        { l: '48%', t: '62%', s: 14, c: '#8b6a4a' },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.l,
            top: s.t,
            width: s.s,
            height: s.s,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%,#fff,${s.c} 60%)`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The custom cursor sprite (white bird with long ears)                */
/* ------------------------------------------------------------------ */
function BirdCursor() {
  return (
    <svg width="46" height="44" viewBox="0 0 46 44" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <g stroke="#0b0b0b" strokeWidth="3.2" strokeLinejoin="round" fill="none" opacity="0.9">
        <path d="M16 4c3-2 7 4 7 12-3 2-6 3-9 2-2-5-2-12 2-14z" />
        <path d="M30 6c4-1 8 3 3 10-3 4-7 7-11 8-1-2-1-5 1-9 2-5 4-8 7-9z" />
        <path d="M9 22c4-4 14-5 18-1 4 4 2 12-5 14-6 1-14-1-15-6-1-3 0-5 2-7z" />
      </g>
      <g fill="#f4f4f2" stroke="#d9d9d6" strokeWidth="0.8">
        <path d="M16 4c3-2 7 4 7 12-3 2-6 3-9 2-2-5-2-12 2-14z" />
        <path d="M30 6c4-1 8 3 3 10-3 4-7 7-11 8-1-2-1-5 1-9 2-5 4-8 7-9z" />
        <path d="M9 22c4-4 14-5 18-1 4 4 2 12-5 14-6 1-14-1-15-6-1-3 0-5 2-7z" />
      </g>
      {/* beak */}
      <path d="M8 26 L1 34" stroke="#bdbdba" strokeWidth="1.4" strokeLinecap="round" />
      {/* eye */}
      <circle cx="13" cy="24" r="1.5" fill="#111" />
      {/* feet */}
      <path d="M17 36l-2 4M21 36l0 4M24 36l2 3" stroke="#cfcfcb" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function SkillsetSection() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const rowRefs = useRef([]);
  const previewRef = useRef(null);
  const cursorRef = useRef(null);
  const [active, setActive] = useState(-1); // -1 => nothing hovered (all rows lit)
  const [shown, setShown] = useState(false);
  const [inSection, setInSection] = useState(false);

  const activeRef = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const coarse = window.matchMedia && window.matchMedia('(hover: none)').matches;

    const ptr = { x: 0, y: 0, has: false, inSec: false };
    const pos = { x: 0, y: 0 }; // trailing preview centre (starts parked at the top-left corner)
    let lastX = 0;
    let tilt = 0;
    let raf = 0;
    let last = performance.now();

    const hit = () => {
      if (!ptr.has || !ptr.inSec) return -1;
      const lr = list.getBoundingClientRect();
      if (ptr.y < lr.top || ptr.y > lr.bottom || ptr.x < lr.left || ptr.x > lr.right) return -1;
      for (let i = 0; i < rowRefs.current.length; i++) {
        const r = rowRefs.current[i].getBoundingClientRect();
        if (ptr.y >= r.top && ptr.y < r.bottom) return i;
      }
      return -1;
    };

    const apply = () => {
      const h = hit();
      if (h !== activeRef.current) {
        activeRef.current = h;
        setActive(h);
        setShown(h !== -1);
      }
    };

    const onMove = (e) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.has = true;
      const sr = section.getBoundingClientRect();
      const inside = e.clientY >= sr.top && e.clientY <= sr.bottom;
      if (inside !== ptr.inSec) {
        ptr.inSec = inside;
        setInSection(inside);
      }
      apply();
    };
    const onLeave = () => {
      ptr.inSec = false;
      setInSection(false);
      apply();
    };

    if (!coarse) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;

      // re-run the hit test every frame so scrolling under a still pointer updates the row
      if (!coarse && ptr.has) {
        const sr = section.getBoundingClientRect();
        const inside = ptr.y >= sr.top && ptr.y <= sr.bottom;
        if (inside !== ptr.inSec) {
          ptr.inSec = inside;
          setInSection(inside);
        }
        apply();
      }

      // trailing preview
      const k = 1 - Math.pow(1 - EASE, dt / 16.667);
      if (ptr.has) {
        pos.x += (ptr.x - pos.x) * k;
        pos.y += (ptr.y - pos.y) * k;
      }
      const sc = window.innerWidth / REF_VW;
      const prev = previewRef.current;
      if (prev) {
        prev.style.transform = `translate3d(${(pos.x - (PREVIEW_W * sc) / 2).toFixed(1)}px,${(pos.y - (PREVIEW_H * sc) / 2).toFixed(1)}px,0)`;
      }

      // cursor sprite follows exactly, tilts with horizontal velocity
      const cur = cursorRef.current;
      if (cur && ptr.has) {
        const vx = ptr.x - lastX;
        lastX = ptr.x;
        tilt += (clamp(vx * 1.2, -18, 18) - tilt) * 0.2;
        cur.style.transform = `translate3d(${ptr.x - 14}px,${ptr.y - 28}px,0) rotate(${(tilt + 8).toFixed(1)}deg)`;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const lit = (i) => active === -1 || active === i;
  const sc = 'calc(100vw / 1500)';

  return (
    <div className={font.className} style={{ WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        .sk-section.sk-hide-cursor, .sk-section.sk-hide-cursor * { cursor: none !important; }
        .sk-row { transition: none; }
        .sk-num, .sk-title, .sk-text { transition: color .35s ease; }
        @media (max-width: 760px) {
          .sk-grid { grid-template-columns: 2.2rem 1fr !important; }
          .sk-text { grid-column: 2; margin-top: 8px; }
        }
      `}</style>

      <section
        id="skills"
        ref={sectionRef}
        className={`sk-section${inSection ? ' sk-hide-cursor' : ''}`}
        style={{
          position: 'relative',
          background: '#0b0b0b',
          color: '#fff',
          padding: 'clamp(48px, 4.8vw, 84px) 0 8.5vw',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '0 6.55vw 0 6.5vw' }}>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(48px,6.8vw,130px)',
              fontWeight: 500,
              letterSpacing: '-0.035em',
              lineHeight: 1,
              color: '#f0f0ee',
            }}
          >
            Skillset
          </h2>

          <div ref={listRef} style={{ marginTop: 'clamp(26px,3.7vw,70px)' }}>
            {SKILLS.map((s, i) => (
              <div
                key={s.title}
                ref={(el) => (rowRefs.current[i] = el)}
                className="sk-row"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.72)',
                  borderBottom: i === SKILLS.length - 1 ? '1px solid rgba(255,255,255,0.72)' : 'none',
                  boxSizing: 'border-box',
                  minHeight: 'clamp(110px,10.65vw,200px)',
                  padding: 'clamp(30px,4.2vw,80px) 0 clamp(24px,2.4vw,46px)',
                }}
              >
                <div
                  className="sk-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '7.35vw 44.8vw 1fr',
                    alignItems: 'baseline',
                  }}
                >
                  <span
                    className="sk-num"
                    style={{
                      fontSize: 'clamp(10px,0.95vw,18px)',
                      color: lit(i) ? '#a9a9a6' : '#4d4d4b',
                      fontWeight: 500,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="sk-title"
                    style={{
                      margin: 0,
                      fontSize: 'clamp(22px,2.75vw,52px)',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      color: lit(i) ? '#f4f4f2' : '#5f5f5d',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="sk-text"
                    style={{
                      margin: 0,
                      maxWidth: '35vw',
                      fontSize: 'clamp(11px,1.08vw,20px)',
                      lineHeight: 1.37,
                      fontWeight: 500,
                      color: lit(i) ? '#c9c9c6' : '#4a4a48',
                    }}
                  >
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* trailing preview (fixed, follows the pointer with a lag) */}
      <div
        ref={previewRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: `calc(${PREVIEW_W} * ${sc})`,
          height: `calc(${PREVIEW_H} * ${sc})`,
          zIndex: 50,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            opacity: shown ? 1 : 0,
            transition: 'opacity .25s ease',
          }}
        >
          {SKILLS.map((s, i) => (
            <div key={s.title} style={{ position: 'absolute', inset: 0, visibility: active === i ? 'visible' : 'hidden' }}>
              {s.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <Art kind={s.art} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* custom cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 70,
          pointerEvents: 'none',
          opacity: inSection ? 1 : 0,
          transition: 'opacity .15s ease',
          willChange: 'transform',
        }}
      >
        <BirdCursor />
      </div>


    </div>
  );
}

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}