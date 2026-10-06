'use client';



import { useEffect, useRef, useMemo } from 'react';
import { Inter_Tight } from 'next/font/google';

const inter = Inter_Tight({ subsets: ['latin'], display: 'swap' });

/* ------------------------------------------------------------------ */
/*  CONTENT                                                             */
/* ------------------------------------------------------------------ */
const VIDEO_SRC = '/assets/sample3.jpg';
const IMG_TRAY = '/assets/sample2.jpg';
const IMG_BALL = '/assets/sample1.png';

const CENTER_LINES = [
    'We create visual',
    'experiences for',
    'brands ready to',
    'stand out from',
    'the ordinary.'
];

const BLOCK_LINES = [
    'we design',
    'we create',
    'we inspire',
    'we transform'
];

// position of each floating block in % of the viewport
const BLOCKS = [
    { x: 27.2, y: 19.8 },
    { x: 9.5, y: 34.8 },
    { x: 18.9, y: 58.3 },
    { x: 74.9, y: 27.6 },
    { x: 79.3, y: 60.0 },
];

const LINKS = [
    { label: 'Linkedin', href: '#linkedin' },
    { label: 'Instagram', href: '#instagram' },
    { label: 'Behance', href: '#behance' },
];

/* ------------------------------------------------------------------ */
/*  TIMELINE (u = scroll distance in viewport heights, once pinned)     */
/* ------------------------------------------------------------------ */
const BAND = 6; // black band above the video (vh)
const PIN = 1.75; // how long the section stays pinned (vh of scroll)
const VIDEO_H = 190; // height of the travelling video (vh)
const VIDEO_RATE = 0.45; // video travel per vh of scroll
const SCATTER_FROM = 0.22; // characters start leaving here
const DECODE_FROM = 0.35; // centre copy starts decoding
const DECODE_SPAN = 0.45;
const IMG_START = 0.65; // images enter from the bottom
const TRAY = { left: 24.5, w: 28.6, ratio: 1.22, rate: 1.25 }; // rate = vh travelled per vh scrolled
const BALL = { left: 62.3, w: 13.6, ratio: 0.73, rate: 1.55 };

const GLYPHS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@§è!?.:;(ŭ';
const glyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
};

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

/* deterministic per-character data (same on server and client) */
function buildBlocks() {
    const rng = mulberry32(21);
    return BLOCKS.map((b) => ({
        ...b,
        lines: BLOCK_LINES.map((ln, li) => {
            const chars = [...ln];
            return chars.map((ch, ci) => ({
                ch,
                ci,
                len: chars.length,
                li,
                th: SCATTER_FROM + rng() * 0.8,
                dur: 0.35 + rng() * 0.3,
                dx: (rng() - 0.5) * 150,
                dy: 40 + rng() * 280,
                rot: (rng() - 0.5) * 80,
                glitch: 0.04 + rng() * 0.08,
            }));
        }),
    }));
}

function buildCenter() {
    const rng = mulberry32(5);
    const total = CENTER_LINES.join('').length;
    let n = 0;
    return CENTER_LINES.map((ln) =>
        [...ln].map((ch) => {
            const r = DECODE_FROM + (n++ / total) * DECODE_SPAN + rng() * 0.14;
            return { ch, r };
        })
    );
}

/* ------------------------------------------------------------------ */
/*  Placeholder media (replaced by VIDEO_SRC / IMG_*)                    */
/* ------------------------------------------------------------------ */
function ElevatorPlaceholder() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/sample3.jpg"
                alt="Background"
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                }}
            />
        </div>
    );
}

function TrayPlaceholder() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/sample2.jpg"
                alt="Sample 2"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />
        </div>
    );
}

function BallPlaceholder() {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/assets/sample1.png"
                alt="Sample 1"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function AboutSection() {
    const rootRef = useRef(null);
    const trackRef = useRef(null);
    const videoRef = useRef(null);
    const dimRef = useRef(null);
    const centerRef = useRef(null);
    const trayRef = useRef(null);
    const ballRef = useRef(null);
    const scatterRef = useRef(null);

    const blocks = useMemo(buildBlocks, []);
    const center = useMemo(buildCenter, []);

    useEffect(() => {
        const track = trackRef.current;
        const video = videoRef.current;
        const dim = dimRef.current;
        const cen = centerRef.current;
        const tray = trayRef.current;
        const ball = ballRef.current;
        const sc = scatterRef.current;
        if (!track) return;

        // flatten char data + their elements (same order as render)
        const flat = blocks.flatMap((b) => b.lines.flat());
        const scEls = sc.querySelectorAll('[data-sc]');
        const cFlat = center.flat();
        const ccEls = cen.querySelectorAll('[data-cc]');

        const sCache = flat.map((c) => ({ t: c.ch, tr: '', op: '1' }));
        const cCache = cFlat.map((c) => ({ t: c.ch, op: '0' }));

        let raf = 0;
        let sm = null;
        let last = performance.now();
        let lastFk = -1;
        let lastScrollStep = -1;
        let isScrolling = false;
        let scrollTimer = null;

        const onScroll = () => {
            isScrolling = true;
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isScrolling = false;
            }, 100);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            const dt = Math.min(64, now - last);
            last = now;
            const vh = window.innerHeight;

            const target = Math.max(0, -track.getBoundingClientRect().top);
            if (sm === null) sm = target;
            sm += (target - sm) * (1 - Math.pow(1 - 0.16, dt / 16.667));
            if (Math.abs(target - sm) < 0.05) sm = target;
            const u = Math.min(sm / vh, PIN); // pinned scroll in vh

            // Track active scroll motion
            const scrollStep = Math.floor(sm / 6);
            const scrollMoved = scrollStep !== lastScrollStep;
            lastScrollStep = scrollStep;

            const isMoving = isScrolling || Math.abs(target - sm) > 0.08 || scrollMoved;

            const fk = Math.floor(now / 90);
            const flick = isMoving && (fk !== lastFk || scrollMoved);
            lastFk = fk;

            /* video travel + darkness */
            if (video) video.style.transform = `translate3d(0,${-u * VIDEO_RATE * vh}px,0)`;
            if (dim) {
                const d = 0.93 * smooth(0.25, 0.75, u) + 0.07 * smooth(0.75, 1.6, u);
                dim.style.opacity = d.toFixed(3);
            }

            /* scattering characters */
            for (let i = 0; i < flat.length; i++) {
                const c = flat[i];
                if (c.ch === ' ') continue;
                const el = scEls[i];
                const cache = sCache[i];
                const q = clamp((u - c.th) / c.dur, 0, 1);

                let txt = cache.t;
                let tr = '';
                let op = '1';

                if (u <= 0.01) {
                    txt = c.ch;
                    tr = '';
                    op = '1';
                } else if (q <= 0) {
                    if (isMoving && flick) {
                        const scrollIntensity = Math.min(1, u / SCATTER_FROM);
                        txt = Math.random() < c.glitch * scrollIntensity * 4 ? glyph() : c.ch;
                    } else {
                        txt = cache.t;
                    }
                } else {
                    if (isMoving && flick) {
                        txt = q < 0.6 && Math.random() < 0.55 ? glyph() : c.ch;
                    } else {
                        txt = cache.t;
                    }
                    const e = q * q;
                    const spread = (c.ci - c.len / 2) * q * 7;
                    tr = `translate3d(${(c.dx * q + spread).toFixed(1)}px,${(c.dy * e).toFixed(1)}px,0) rotate(${(c.rot * q).toFixed(1)}deg)`;
                    op = q < 0.2 ? '1' : Math.max(0, 1 - Math.pow((q - 0.2) / 0.8, 0.8)).toFixed(3);
                }

                if (txt !== cache.t) {
                    el.textContent = txt;
                    cache.t = txt;
                }
                if (tr !== cache.tr) {
                    el.style.transform = tr;
                    cache.tr = tr;
                }
                if (op !== cache.op) {
                    el.style.opacity = op;
                    cache.op = op;
                }
            }

            /* centre copy: decode */
            let ci = 0;
            for (let i = 0; i < cFlat.length; i++) {
                const c = cFlat[i];
                if (c.ch === ' ') continue;
                const el = ccEls[i];
                const cache = cCache[i];
                let txt = cache.t;
                let op = '1';
                if (u < c.r - 0.14) {
                    op = '0';
                    txt = c.ch;
                } else if (u < c.r) {
                    if (isMoving && flick) {
                        txt = glyph();
                    } else {
                        txt = cache.t === c.ch ? glyph() : cache.t;
                    }
                } else {
                    txt = c.ch;
                }
                if (txt !== cache.t) {
                    el.textContent = txt;
                    cache.t = txt;
                }
                if (op !== cache.op) {
                    el.style.opacity = op;
                    cache.op = op;
                }
                ci++;
            }
            // centre copy drifts up and fades once the images have passed
            const out = smooth(1.15, 1.65, sm / vh);
            cen.style.transform = `translate3d(0,${(-out * 0.22 * vh).toFixed(1)}px,0)`;
            cen.style.opacity = (1 - out).toFixed(3);

            /* rising images (parallax) */
            const yT = (1.02 - TRAY.rate * (u - IMG_START)) * vh;
            const yB = (1.02 - BALL.rate * (u - IMG_START)) * vh;
            tray.style.transform = `translate3d(0,${yT.toFixed(1)}px,0)`;
            ball.style.transform = `translate3d(0,${yB.toFixed(1)}px,0)`;
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            if (scrollTimer) clearTimeout(scrollTimer);
        };
    }, [blocks, center]);

    return (
        <div
            id="about"
            ref={rootRef}
            className={inter.className}
            style={{ background: '#000', color: '#fff', WebkitFontSmoothing: 'antialiased', overflowX: 'clip' }}
        >
            {/* thin black band (scrolls away) */}
            <div style={{ height: `${BAND}vh`, background: '#000' }} />

            {/* pinned track */}
            <div ref={trackRef} style={{ position: 'relative', height: `${(1 + PIN) * 100}vh` }}>
                <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#000', zIndex: 1 }}>
                    {/* tall video, travels up with scroll */}
                    <div
                        ref={videoRef}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: `${VIDEO_H}vh`,
                            willChange: 'transform',
                            background: '#46555a',
                        }}
                    >
                        {VIDEO_SRC ? (
                            VIDEO_SRC.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video
                                    src={VIDEO_SRC}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                />
                            ) : (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={VIDEO_SRC}
                                    alt="Background"
                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                                />
                            )
                        ) : (
                            <ElevatorPlaceholder />
                        )}
                    </div>

                    {/* darkening */}
                    <div ref={dimRef} style={{ position: 'absolute', inset: 0, background: '#000', opacity: 0, pointerEvents: 'none' }} />

                    {/* floating glitch blocks */}
                    <div ref={scatterRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                        {blocks.map((b, bi) => (
                            <div
                                key={bi}
                                style={{
                                    position: 'absolute',
                                    left: `${b.x}%`,
                                    top: `${b.y}%`,
                                    fontSize: 'clamp(11px,1.07vw,20px)',
                                    lineHeight: 1.04,
                                    fontWeight: 400,
                                    letterSpacing: '-0.01em',
                                    whiteSpace: 'pre',
                                }}
                            >
                                {b.lines.map((line, li) => (
                                    <div key={li}>
                                        {line.map((c, ci) => (
                                            <span
                                                key={ci}
                                                data-sc=""
                                                style={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'transform, opacity' }}
                                            >
                                                {c.ch}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* centre copy (decodes in) */}
                    <p
                        ref={centerRef}
                        style={{
                            position: 'absolute',
                            left: '46%',
                            top: '29.3%',
                            margin: 0,
                            fontSize: 'clamp(11px,1.14vw,22px)',
                            lineHeight: 1.03,
                            fontWeight: 400,
                            letterSpacing: '-0.012em',
                            whiteSpace: 'pre',
                            willChange: 'transform, opacity',
                        }}
                    >
                        {center.map((line, li) => (
                            <span key={li} style={{ display: 'block' }}>
                                {line.map((c, ci) => (
                                    <span key={ci} data-cc="" style={{ opacity: 0, whiteSpace: 'pre' }}>
                                        {c.ch}
                                    </span>
                                ))}
                            </span>
                        ))}
                    </p>

                    {/* rising images */}
                    <div
                        ref={trayRef}
                        style={{
                            position: 'absolute',
                            left: `${TRAY.left}vw`,
                            top: 0,
                            width: `${TRAY.w}vw`,
                            aspectRatio: String(TRAY.ratio),
                            transform: 'translate3d(0,110vh,0)',
                            willChange: 'transform',
                            overflow: 'hidden',
                        }}
                    >
                        {IMG_TRAY ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={IMG_TRAY} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <TrayPlaceholder />
                        )}
                    </div>
                    <div
                        ref={ballRef}
                        style={{
                            position: 'absolute',
                            left: `${BALL.left}vw`,
                            top: 0,
                            width: `${BALL.w}vw`,
                            aspectRatio: String(BALL.ratio),
                            transform: 'translate3d(0,110vh,0)',
                            willChange: 'transform',
                            overflow: 'hidden',
                        }}
                    >
                        {IMG_BALL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={IMG_BALL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <BallPlaceholder />
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}