'use client';


import { useEffect, useRef, useState, useCallback } from 'react';
import { Inter_Tight } from 'next/font/google';

const inter = Inter_Tight({ subsets: ['latin'], display: 'swap' });

/* ------------------------------------------------------------------ */
/*  TV SCREEN VIDEO SOURCE                                             */
/* ------------------------------------------------------------------ */
// Demo video provided by user
const TV_VIDEO_SRC = '/assets/test1.mp4';

const HALL_IMAGE = ''; // Optional custom image for hall

const STUDIO_LINES = [
  'We turn ideas into visual stories,',
  'shaping bold identities built to stand out,',
  'with design that makes brands unforgettable.',
];

/* ------------------------------------------------------------------ */
/*  GEOMETRY / TIMELINE                                                 */
/* ------------------------------------------------------------------ */
const BAND = 0.39; // black band height (fraction of viewport height)
const ZOOM = 1.35; // scroll distance (in viewport heights) of the pinned zoom-out
const HOLD = 0.1; // tiny hold at full-bleed before the zoom starts

// Hall reference dimensions
const REF_W = 1500;
const REF_H = 780;
const OFF = 70;

// TV Screen window dimensions (centered on the back gallery wall)
const WIN = { x: 461, y: 56, w: 578, h: 350 };
const WCX = WIN.x + WIN.w / 2;
const WCY = WIN.y + WIN.h / 2;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ------------------------------------------------------------------ */
/*  THE HALL (SVG)                                                      */
/* ------------------------------------------------------------------ */
function Hall() {
  const seamsL = [];
  const seamsR = [];
  [60, 130, 200, 262, 322, 384].forEach((x, i) => {
    const yEnd = 60 + 0.3132 * x;
    seamsL.push(<line key={'a' + i} x1={x} y1={-70} x2={x} y2={yEnd} />);
    seamsR.push(<line key={'b' + i} x1={REF_W - x} y1={-70} x2={REF_W - x} y2={yEnd} />);
  });
  const lowSeamsL = [];
  const lowSeamsR = [];
  [62, 126, 190, 250].forEach((x, i) => {
    const yTop = 152 + 0.2237 * x;
    lowSeamsL.push(<line key={'c' + i} x1={x} y1={yTop} x2={x} y2={420} />);
    lowSeamsR.push(<line key={'d' + i} x1={REF_W - x} y1={yTop} x2={REF_W - x} y2={420} />);
  });
  const floorRays = [];
  for (let i = -5; i <= 5; i++) {
    floorRays.push(<line key={'f' + i} x1={750 + i * 34} y1={422} x2={750 + i * 190} y2={640} />);
  }

  if (HALL_IMAGE) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={HALL_IMAGE}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }}
      />
    );
  }

  return (
    <svg
      viewBox={`0 ${-OFF} ${REF_W} ${REF_H}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hl-conc-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9a9e9c" />
          <stop offset="1" stopColor="#5b5f5e" />
        </linearGradient>
        <linearGradient id="hl-conc-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#9a9e9c" />
          <stop offset="1" stopColor="#5b5f5e" />
        </linearGradient>
        <linearGradient id="hl-low-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f7371" />
          <stop offset="0.55" stopColor="#4a4e4d" />
          <stop offset="1" stopColor="#2b2e2e" />
        </linearGradient>
        <linearGradient id="hl-low-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#6f7371" />
          <stop offset="0.55" stopColor="#4a4e4d" />
          <stop offset="1" stopColor="#2b2e2e" />
        </linearGradient>
        <linearGradient id="hl-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d5251" />
          <stop offset="1" stopColor="#2c2f2f" />
        </linearGradient>
        <linearGradient id="hl-recess" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1010" />
          <stop offset="0.6" stopColor="#2a2d2d" />
          <stop offset="1" stopColor="#3c4040" />
        </linearGradient>
        <linearGradient id="hl-ceil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d8180" />
          <stop offset="1" stopColor="#2f3232" />
        </linearGradient>
        <linearGradient id="hl-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f938e" />
          <stop offset="0.3" stopColor="#6a6d6a" />
          <stop offset="0.7" stopColor="#262827" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <linearGradient id="hl-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="hl-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#58792f" />
          <stop offset="0.55" stopColor="#3a5420" />
          <stop offset="1" stopColor="#1c2a0f" />
        </linearGradient>
        <linearGradient id="hl-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c8180" />
          <stop offset="0.5" stopColor="#c9cdcc" />
          <stop offset="1" stopColor="#6d7271" />
        </linearGradient>
        <linearGradient id="hl-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hl-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="hl-blades" x="-4%" y="-8%" width="108%" height="116%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85 0.28" numOctaves="2" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.12  0 0 0 0 0.2  0 0 0 0 0.05  0 0 0 1.7 -0.3"
            result="g"
          />
          <feComposite in="g" in2="SourceGraphic" operator="in" result="tex" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="tex" />
          </feMerge>
        </filter>
      </defs>

      {/* base */}
      <rect x="0" y="-70" width="1500" height="780" fill="#141515" />

      {/* back wall recess */}
      <rect x="447" y="-70" width="603" height="490" fill="url(#hl-recess)" />
      <polygon points="415,-70 1085,-70 1050,42 447,42" fill="url(#hl-ceil)" opacity="0.9" />

      {/* TV Screen Outer Casing & Bezel on the wall */}
      <rect
        x="455"
        y="50"
        width="590"
        height="362"
        rx="6"
        fill="#0f1113"
        stroke="#2c3033"
        strokeWidth="3.5"
      />
      <rect
        x="459"
        y="54"
        width="582"
        height="354"
        rx="3"
        fill="#040506"
        stroke="#181a1c"
        strokeWidth="1.5"
      />
      {/* TV Power Standby LED indicator */}
      <circle cx="750" cy="410" r="2.5" fill="#22c55e" opacity="0.8" />
      <circle cx="750" cy="410" r="5" fill="#22c55e" opacity="0.25" />

      <g stroke="#000" strokeOpacity="0.25" strokeWidth="1.5">
        {[560, 680, 800, 920, 1000].map((x) => (
          <line key={x} x1={x} y1={42} x2={x} y2={420} />
        ))}
      </g>
      {/* ceiling light strips */}
      <g stroke="#fff" strokeLinecap="round">
        <line x1="545" y1="-52" x2="955" y2="-52" strokeWidth="7" />
        <line x1="575" y1="-32" x2="925" y2="-32" strokeWidth="6" />
        <line x1="610" y1="-13" x2="890" y2="-13" strokeWidth="5" />
      </g>
      <line x1="750" y1="-60" x2="750" y2="-4" stroke="#000" strokeOpacity="0.45" strokeWidth="2" />
      <ellipse cx="750" cy="-30" rx="330" ry="55" fill="url(#hl-glow)" />

      {/* left: upper wall, beam, lower wall */}
      <polygon points="0,-70 447,-70 447,200 0,60" fill="url(#hl-conc-l)" />
      <g stroke="#000" strokeOpacity="0.16" strokeWidth="2">{seamsL}</g>
      <polygon points="0,152 447,252 447,420 0,420" fill="url(#hl-low-l)" />
      <rect x="305" y="252" width="142" height="168" fill="#232626" opacity="0.7" />
      <g stroke="#000" strokeOpacity="0.2" strokeWidth="2">{lowSeamsL}</g>
      <polygon points="0,60 447,200 447,252 0,152" fill="url(#hl-beam)" />
      <line x1="0" y1="60" x2="447" y2="200" stroke="#9aa09e" strokeOpacity="0.55" strokeWidth="2" />

      {/* right: mirrored */}
      <polygon points="1500,-70 1053,-70 1053,200 1500,60" fill="url(#hl-conc-r)" />
      <g stroke="#000" strokeOpacity="0.16" strokeWidth="2">{seamsR}</g>
      <polygon points="1500,152 1053,252 1053,420 1500,420" fill="url(#hl-low-r)" />
      <rect x="1053" y="252" width="142" height="168" fill="#232626" opacity="0.7" />
      <g stroke="#000" strokeOpacity="0.2" strokeWidth="2">{lowSeamsR}</g>
      <polygon points="1500,60 1053,200 1053,252 1500,152" fill="url(#hl-beam)" />
      <line x1="1500" y1="60" x2="1053" y2="200" stroke="#9aa09e" strokeOpacity="0.55" strokeWidth="2" />

      {/* floor */}
      <rect x="0" y="418" width="1500" height="292" fill="url(#hl-floor)" />
      <g stroke="#000" strokeOpacity="0.22" strokeWidth="1.4">
        {floorRays}
        <line x1="0" y1="446" x2="1500" y2="446" />
        <line x1="0" y1="482" x2="1500" y2="482" />
        <line x1="0" y1="530" x2="1500" y2="530" />
        <line x1="0" y1="590" x2="1500" y2="590" />
      </g>
      {/* screen light on the floor */}
      <rect x="483" y="420" width="536" height="60" fill="url(#hl-shine)" />
      <ellipse cx="750" cy="470" rx="380" ry="38" fill="#fff" opacity="0.07" />

      {/* floor melts into black */}
      <rect x="0" y="430" width="1500" height="190" fill="url(#hl-fade)" />
      <rect x="0" y="615" width="1500" height="100" fill="#000" />

      {/* grass mounds */}
      <path
        d="M0,372 C60,364 130,360 190,366 C230,372 255,398 300,420 C380,440 480,452 552,460 C540,470 470,476 400,480 C330,484 280,482 240,482 L0,494 Z"
        fill="url(#hl-grass)"
        filter="url(#hl-blades)"
      />
      <path
        d="M1500,350 C1440,344 1380,352 1330,372 C1250,402 1150,430 1070,444 C1020,452 985,456 968,462 C990,472 1040,480 1110,486 C1250,492 1380,494 1500,498 Z"
        fill="url(#hl-grass)"
        filter="url(#hl-blades)"
      />

      {/* plaque stands */}
      <g>
        <polygon points="225,393 270,383 284,395 240,406" fill="#dfe2e1" />
        <polygon points="240,406 284,395 281,480 243,482" fill="url(#hl-steel)" />
        <polygon points="1275,393 1230,383 1216,395 1260,406" fill="#dfe2e1" />
        <polygon points="1260,406 1216,395 1219,482 1257,484" fill="url(#hl-steel)" />
      </g>

      {/* side vignette */}
      <rect x="0" y="-70" width="1500" height="780" fill="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  TV SCREEN COMPONENT — Continuous single video playback (or blank)  */
/* ------------------------------------------------------------------ */
function TVScreen({ muted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (TV_VIDEO_SRC) {
      const p = v.play();
      if (p && p.catch) p.catch(() => { });
    }
  }, [muted]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#040506',
        overflow: 'hidden',
      }}
    >
      {TV_VIDEO_SRC ? (
        <video
          ref={videoRef}
          src={TV_VIDEO_SRC}
          autoPlay
          loop
          muted={muted}
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        /* Blank TV Screen (Standby Mode) */
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(165deg, #090a0d 0%, #030405 60%, #010202 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Subtle TV glass glare / reflection */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.035) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />
          {/* Subtle power LED at bottom center */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px rgba(34, 197, 94, 0.7)',
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE / WORKS SECTION                                                */
/* ------------------------------------------------------------------ */
export default function WorksSection() {
  const trackRef = useRef(null);
  const hallRef = useRef(null);
  const studioRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [revealed, setRevealed] = useState(false);

  /* ---- scroll engine: window zoom while the stage is pinned ---- */
  useEffect(() => {
    const track = trackRef.current;
    const hall = hallRef.current;
    if (!track || !hall) return;

    let raf = 0;
    let vw = 0;
    let vh = 0;
    let k = 1;
    let S = 1;
    let ts = null;
    let last = performance.now();

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const Rw = Math.max(vw, (vh * REF_W) / 710 * 0.92);
      k = Rw / REF_W;
      hall.style.width = REF_W * k + 'px';
      hall.style.height = REF_H * k + 'px';
      hall.style.setProperty('--k', String(k));
      hall.style.transformOrigin = `${WCX * k}px ${(WCY + OFF) * k}px`;
      S = Math.max(vw / (WIN.w * k), vh / (WIN.h * k)) * 1.012;
    };
    measure();
    window.addEventListener('resize', measure);

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(64, now - last);
      last = now;

      const scrolled = -track.getBoundingClientRect().top;
      const t0 = clamp((scrolled - HOLD * vh) / ((ZOOM - HOLD) * vh), 0, 1);
      if (ts === null) ts = t0;
      ts += (t0 - ts) * (1 - Math.pow(1 - 0.16, dt / 16.667));
      if (Math.abs(t0 - ts) < 0.0004) ts = t0;

      const e = ts * ts * (3 - 2 * ts); // smoothstep
      const s = Math.exp(Math.log(S) * (1 - e)); // S (full-bleed) -> 1 (hall)

      // Center the TV nicely with comfortable optical balance
      const downShift = 35;
      const targetCy = vh / 2 + downShift;
      const cy = vh / 2 + (targetCy - vh / 2) * e;
      const X = vw / 2 - WCX * k;
      const Y = cy - (WCY + OFF) * k;
      hall.style.transform = `translate3d(${X}px,${Y}px,0) scale(${s})`;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* ---- studio text reveal ---- */
  useEffect(() => {
    const el = studioRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setRevealed(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleSound = useCallback(() => setMuted((m) => !m), []);

  const logoStyle = {
    fontWeight: 900,
    fontSize: 'clamp(16px,1.75vw,32px)',
    letterSpacing: '-0.04em',
    lineHeight: 1,
  };

  return (
    <div
      className={inter.className}
      style={{ background: '#000', color: '#fff', WebkitFontSmoothing: 'antialiased', overflowX: 'clip' }}
    >
      <style>{`
        .wk-arrow{display:inline-block;transition:transform .25s ease}
        .wk-viewall:hover .wk-arrow{transform:translate(3px,2px)}
        .wk-line{display:block;overflow:hidden}
        .wk-line>span{display:block;transform:translateY(110%);transition:transform .95s cubic-bezier(.2,.7,.1,1)}
        .wk-in .wk-line>span{transform:translateY(0)}
        .wk-fade{opacity:0;transform:translateY(24px);transition:opacity .9s ease .15s,transform .9s cubic-bezier(.2,.7,.1,1) .15s}
        .wk-in .wk-fade{opacity:1;transform:none}
      `}</style>



      {/* =========================== WORKS =========================== */}
      <section style={{ position: 'relative', background: '#000' }}>
        {/* "WORKS": sticky label under the logo; the screen slides over it */}
        <div style={{ position: 'sticky', top: 0, height: 0, zIndex: 1, pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left: 'clamp(8px,0.9vw,18px)',
              top: 'clamp(12px,1.55vw,28px)',
              paddingTop: 'clamp(16px,1.75vw,32px)',
              ...logoStyle,
              fontSize: 'clamp(16px,1.75vw,32px)',
            }}
          >
            WORKS
          </div>
        </div>

        {/* black band: these texts scroll away with the page */}
        <div style={{ position: 'relative', height: `${BAND * 100}vh`, background: '#000' }}>
          <a
            href="#works"
            className="wk-viewall"
            style={{
              position: 'absolute',
              left: 'clamp(8px,0.9vw,18px)',
              top: '10.2vh',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 'clamp(24px,2.5vw,48px)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            View all <span className="wk-arrow" style={{ fontSize: '0.38em', marginLeft: '0.55em', letterSpacing: 0 }}>↳</span>
          </a>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '13.4vh',
              transform: 'translateX(-50%)',
              fontSize: 'clamp(11px,1.05vw,20px)',
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
            }}
          >
            (01)
          </div>
          <div
            style={{
              position: 'absolute',
              right: 'clamp(8px,1.1vw,20px)',
              top: '13.4vh',
              fontSize: 'clamp(11px,1.05vw,20px)',
              fontWeight: 500,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.06em',
            }}
          >

          </div>
        </div>

        {/* pinned track: scroll = zoom */}
        <div ref={trackRef} style={{ position: 'relative', height: `${(1 + ZOOM) * 100}vh` }}>
          <div
            style={{
              position: 'sticky',
              top: 0,
              height: '100vh',
              overflow: 'hidden',
              background: '#000',
              zIndex: 2,
            }}
          >
            {/* hall + TV screen (scaled by scroll) */}
            <div
              ref={hallRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                willChange: 'transform',
                background: '#000',
              }}
            >
              <Hall />

              {/* The TV Screen Display */}
              <div
                style={{
                  position: 'absolute',
                  display: 'block',
                  left: `${(WIN.x / REF_W) * 100}%`,
                  top: `${((WIN.y + OFF) / REF_H) * 100}%`,
                  width: `${(WIN.w / REF_W) * 100}%`,
                  height: `${(WIN.h / REF_H) * 100}%`,
                  background: '#040506',
                  boxShadow:
                    '0 0 0 calc(var(--k,1)*2px) #0e1012, 0 10px 30px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                }}
              >
                <TVScreen muted={muted} />
              </div>
            </div>

            {/* SOUND pill: rides on the top edge of the screen */}
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={!muted}
              style={{
                position: 'absolute',
                zIndex: 5,
                left: '50%',
                top: '16px',
                transform: 'translateX(-50%)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'clamp(5px,0.45vw,8px)',
                height: 'clamp(16px,1.25vw,24px)',
                padding: '0 clamp(6px,0.55vw,10px) 0 clamp(8px,0.7vw,13px)',
                border: 0,
                borderRadius: 999,
                background: '#000',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: 'clamp(8px,0.62vw,12px)',
                fontWeight: 600,
                letterSpacing: '0.02em',
                cursor: 'pointer',
              }}
            >
              SOUND
              <span
                style={{
                  position: 'relative',
                  width: 'clamp(15px,1.15vw,22px)',
                  height: 'clamp(8px,0.62vw,12px)',
                  borderRadius: 999,
                  background: muted ? '#4a4a4a' : '#fff',
                  transition: 'background .25s',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: muted ? '10%' : '52%',
                    height: '72%',
                    aspectRatio: '1',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    background: muted ? '#fff' : '#000',
                    transition: 'left .25s, background .25s',
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================== STUDIO =========================== */}
      <section
        ref={studioRef}
        className={revealed ? 'wk-in' : ''}
        style={{
          position: 'relative',
          background: '#000',
          padding: '0.4vw clamp(8px,1.2vw,22px) 34vh',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '42vw 1fr', alignItems: 'start' }}>
          <div style={{ fontSize: 'clamp(13px,1.45vw,28px)', fontWeight: 500, letterSpacing: '-0.02em', paddingLeft: '1.2vw' }}>

          </div>

          <div>
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(13px,1.42vw,27px)',
                lineHeight: 1.08,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                maxWidth: '38vw',
              }}
            >
              {STUDIO_LINES.map((l, i) => (
                <span className="wk-line" key={i}>
                  <span style={{ transitionDelay: `${0.07 * i}s` }}>{l}</span>
                </span>
              ))}
            </p>

            {/* big studio showcase image */}
            <div
              className="wk-fade"
              style={{
                marginTop: '3.6vw',
                width: '43.2vw',
                aspectRatio: '1.68',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/workbig.jpg"
                alt="Studio work showcase"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>

        {/* small pedestal image + caption */}
        <div
          className="wk-fade"
          style={{ position: 'absolute', left: '21.6vw', top: 'calc(0.4vw + 17.2vw)', width: '13.5vw' }}
        >
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/worksmall.jpg"
              alt="Work detail"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <p
            style={{
              margin: '1.35vw 0 0',
              fontSize: 'clamp(13px,1.42vw,27px)',
              lineHeight: 1.04,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              width: '8.5vw',
            }}
          >
            designed to stand out.
          </p>
        </div>

        {/* big statement */}
        <h2
          className="wk-fade"
          style={{
            margin: '21vw 0 0',
            paddingLeft: '0.2vw',
            fontSize: 'clamp(40px,4.8vw,92px)',
            lineHeight: 0.98,
            letterSpacing: '-0.05em',
            maxWidth: '40vw',
          }}
        >
          Forms follow perspective.
        </h2>
      </section>
    </div>
  );
}