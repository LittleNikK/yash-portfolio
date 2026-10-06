'use client';

/**
 * GALLERY PLAY — 3D rotating ring gallery ("products showcase")
 * (single file, Next.js App Router: app/page.jsx or import it anywhere)
 *
 * Behaviour, matched to the screen recording:
 *
 *  1. Charcoal page (#1e1e1e) with a faint Europe-style map outline behind everything.
 *     Top-left logo "Gallery / Play" (bold + italic), top-right "Menu", and a giant white
 *     "WORDS." headline cut off by the top edge, sitting BEHIND the cards.
 *  2. About two dozen photo cards hang on a big ring in real CSS 3D (perspective, preserve-3d).
 *     The ring turns on its own (about 7 deg/s, front cards sweep right -> left), so cards come
 *     towards you at the centre, grow, then slip edge-on past the left side and round the back,
 *     where they show up small and mirrored (you are looking at their reverse side) – just like
 *     the recording. Each card is tilted a few degrees, the ring leans about 5 deg clockwise.
 *  3. Each card has a small caption at its bottom-left corner ("Formula 1", "Ibiza Off-Season"...).
 *  4. Interaction:  drag / swipe to spin it (with inertia) · mouse wheel gives it a push ·
 *     moving the mouse tilts the ring a little (parallax) · hovering a card slows the ring and
 *     lifts that card toward you · every card is a link.
 *
 * Everything is drawn in code, so it runs out of the box. To use real photos put files in /public
 * and fill the `img` field of each card in CARDS (portrait ~4:5 or square photos work best).
 * Only dependency: next (next/font/google, Inter Tight).
 */

import { useEffect, useMemo, useRef } from 'react';
import { Inter_Tight } from 'next/font/google';

const inter = Inter_Tight({ subsets: ['latin'], display: 'swap', weight: ['400', '500', '700', '800'] });

/* ------------------------------------------------------------------ */
/*  CONTENT                                                             */
/* ------------------------------------------------------------------ */
const HEADING = 'WORDS.';

// w = card width in vw, a = height / width, kind = placeholder artwork style
const CARDS = [
    { title: 'Ibiza Off-Season', href: '#ibiza', img: '', w: 0.145, a: 1.0, bg: ['#eef0f3', '#aab4bd'], fg: '#c98f6b', kind: 'figure' },
    { title: 'Tolu Arokodare', href: '#tolu', img: '', w: 0.155, a: 1.12, bg: ['#7a4630', '#24100a'], fg: '#2f6fb3', kind: 'figure' },
    { title: 'Formula 1', href: '#f1', img: '', w: 0.142, a: 1.28, bg: ['#27705d', '#0f2b2a'], fg: '#e7d44a', kind: 'figure' },
    { title: 'Adidas x Tzolis', href: '#adidas', img: '', w: 0.128, a: 1.45, bg: ['#8a8c8f', '#3a3c3f'], fg: '#16181a', kind: 'figure' },
    { title: 'Tomorrowland x Belgian Tennis', href: '#tomorrowland', img: '', w: 0.15, a: 1.15, bg: ['#050505', '#101010'], fg: '#ededed', kind: 'figure' },
    { title: 'Manchester United', href: '#manutd', img: '', w: 0.15, a: 0.98, bg: ['#c8202b', '#6e0b14'], fg: '#1a1a1a', kind: 'figure' },
    { title: 'Skechers Football', href: '#skechers', img: '', w: 0.12, a: 1.32, bg: ['#7fb2dd', '#3d7a3d'], fg: '#1c1c1c', kind: 'figure' },
    { title: 'Legia Warsaw', href: '#legia', img: '', w: 0.115, a: 1.18, bg: ['#ff7a2a', '#7d1a0a'], fg: '#ffd7a0', kind: 'glow' },
    { title: '125 Years of AFC Ajax', href: '#ajax', img: '', w: 0.095, a: 1.0, bg: ['#c9b7a4', '#7a6a5c'], fg: '#e8e8e6', kind: 'figure' },
    { title: 'Westkurve', href: '#westkurve', img: '', w: 0.095, a: 1.05, bg: ['#47b6c4', '#1f5a7a'], fg: '#e9f6f8', kind: 'blocks' },
    { title: 'NOVA x Beertjes', href: '#nova', img: '', w: 0.075, a: 1.3, bg: ['#5a7a4a', '#232b20'], fg: '#8a5cc2', kind: 'figure' },
    { title: 'Como 1907', href: '#como', img: '', w: 0.085, a: 1.2, bg: ['#bfd2dc', '#4c6f86'], fg: '#1c2e3d', kind: 'figure' },
    { title: 'PSG', href: '#psg', img: '', w: 0.09, a: 0.82, bg: ['#0f4b9a', '#08224a'], fg: '#d9322f', kind: 'blocks' },
    { title: 'Belgium', href: '#belgium', img: '', w: 0.085, a: 1.25, bg: ['#d11f2e', '#7a0f18'], fg: '#f2c230', kind: 'figure' },
    { title: 'Court Side', href: '#court', img: '', w: 0.1, a: 0.82, bg: ['#0a0f1c', '#0c2a52'], fg: '#e8d2b4', kind: 'figure' },
    { title: 'Centre Court', href: '#centre', img: '', w: 0.095, a: 0.95, bg: ['#7a2a1e', '#2c0f0a'], fg: '#efe7d9', kind: 'figure' },
    { title: 'Matchday Crew', href: '#crew', img: '', w: 0.11, a: 0.7, bg: ['#2457b5', '#111c3d'], fg: '#f1c93b', kind: 'figure' },
    { title: 'The Terrace', href: '#terrace', img: '', w: 0.09, a: 1.4, bg: ['#e9e4dd', '#7d2a2a'], fg: '#171717', kind: 'figure' },
    { title: 'Kit Drop 24', href: '#kit', img: '', w: 0.115, a: 1.2, bg: ['#f2f2f0', '#c7c9cc'], fg: '#e33a3a', kind: 'figure' },
    { title: 'Night Game', href: '#night', img: '', w: 0.1, a: 1.1, bg: ['#12141f', '#2b1e44'], fg: '#ff5d8f', kind: 'glow' },
    { title: 'Pitch Side', href: '#pitch', img: '', w: 0.105, a: 0.9, bg: ['#4f9b4a', '#1f4a2a'], fg: '#f4f4f4', kind: 'figure' },
    { title: 'Studio Series', href: '#studio', img: '', w: 0.115, a: 1.25, bg: ['#d8d2c6', '#8f8574'], fg: '#2a2a2a', kind: 'figure' },
];

/* ------------------------------------------------------------------ */
/*  TUNING                                                              */
/* ------------------------------------------------------------------ */
const RING_R = 0.425; // ring radius, in vw
const PERSPECTIVE = 1.45; // in vw
const CARD_SCALE = 0.84; // global size of all cards
const RING_TILT = 5; // deg, clockwise lean of the whole ring
const BASE_SPEED = -7.2; // deg / second (negative = front sweeps right -> left)
const ROWS = [-0.18, 0.09, -0.03, 0.2, -0.11, 0.15]; // vertical offsets in vh, cycled per card
const CENTER_Y = 53; // % of the stage height

/* background map outline (generated contours, viewBox 1000 x 526) */
const MAP_D =
    'M0 234 L13 234 L19 235 L25 233 L30 222 L31 213 L38 207 L50 206 L57 209 L69 212 L77 209 L83 203 L86 190 L85 177 L83 165 L81 158 L75 149 L71 139 L69 133 L64 120 L62 114 L63 108 L66 95 L68 82 L69 70 L69 57 L69 49 L71 38 L72 25 L73 13 L75 0 M419 0 L415 13 L416 25 L415 32 L409 44 L405 51 L399 57 L390 59 L377 59 L370 63 L366 76 L359 82 L352 84 L340 85 L333 89 L330 101 L333 114 L337 120 L346 126 L358 126 L366 127 L365 136 L362 146 L365 156 L371 162 L377 167 L385 171 L396 172 L403 169 L409 165 L421 159 L428 157 L439 152 L445 146 L453 140 L462 146 L472 152 L478 156 L484 160 L496 165 L503 167 L513 171 L520 177 L524 184 L527 196 L522 209 L517 215 L514 222 L510 234 L504 241 L497 246 L491 247 L478 253 L478 260 L479 266 L482 279 L484 285 L491 292 L499 298 L508 304 L516 310 L522 317 L525 323 L528 334 L532 342 L537 349 L546 355 L553 360 L560 364 L568 368 L578 374 L584 380 L591 386 L597 390 L602 399 L598 412 L597 418 L598 425 L601 437 L605 444 L616 449 L629 446 L635 443 L643 437 L652 431 L660 426 L673 426 L686 427 L694 431 L700 437 L706 444 L717 448 L730 449 L742 450 L755 450 L761 450 L767 449 L780 444 L786 442 L795 437 L805 432 L811 429 L824 427 L831 425 L827 418 L830 409 L836 406 L849 401 L855 397 L862 391 L868 383 L873 374 L871 361 L869 349 L874 339 L881 334 L885 323 L887 317 L893 307 L897 298 L894 285 L888 279 L881 276 L868 275 L856 273 L849 269 L843 263 L837 253 L835 247 L832 234 L830 227 L827 215 L830 207 L836 200 L839 190 L842 177 L848 177 L855 178 L868 177 L881 184 L885 190 L892 196 L899 198 L912 198 L925 201 L930 209 L931 219 L936 228 L943 230 L955 234 L962 236 L969 234 L981 229 L994 233 M910 0 L913 6 L912 13 L903 13 L894 6 L893 6 L883 13 L874 18 L863 19 L855 19 L849 17 L836 17 L831 25 L826 32 L819 38 L811 42 L805 44 L797 51 L794 63 L794 76 L796 89 L800 95 L805 103 L811 114 L813 120 L811 133 L811 139 L811 146 L814 158 L808 165 L799 170 L792 172 L780 173 L767 174 L755 173 L745 171 L736 165 L734 158 L736 146 L736 139 L736 131 L733 120 L726 114 L717 109 L711 106 L698 106 L692 109 L679 112 L667 108 L660 107 L652 101 L645 95 L635 90 L623 91 L610 93 L599 89 L591 84 L579 86 L572 90 L560 92 L547 94 L541 97 L533 101 L522 104 L509 103 L498 101 L492 95 L492 82 L493 70 L493 57 L497 46 L499 38 L497 31 L490 32 L484 43 L483 51 L478 59 L472 64 L459 67 L453 70 L440 74 L434 69 L433 57 L434 51 L439 38 L446 32 L452 25 L455 19 L454 6 L452 0 M343 57 L347 51 L346 38 L345 38 L334 44 L332 51 L334 57 L343 57 M327 222 L331 215 L333 208 L334 196 L333 189 L327 182 L321 187 L315 196 L311 203 L308 212 L305 222 L314 226 L327 222 M163 266 L166 260 L168 247 L172 241 L175 228 L168 228 L163 234 L156 241 L147 247 L146 260 L151 272 L163 266 M262 406 L268 399 L270 390 L271 380 L270 374 L270 367 L277 361 L289 360 L302 357 L308 354 L320 349 L325 342 L328 336 L331 323 L328 311 L326 304 L330 298 L340 294 L346 285 L347 279 L352 266 L358 261 L366 266 L371 275 L378 273 L378 260 L377 253 L371 247 L358 244 L352 241 L340 235 L327 239 L321 245 L315 253 L313 260 L308 267 L296 267 L289 266 L283 260 L275 260 L270 267 L264 275 L258 283 L252 290 L245 297 L241 304 L238 311 L234 323 L233 330 L227 342 L225 349 L223 361 L220 368 L214 379 L212 387 L217 393 L226 397 L233 400 L244 406 L252 406 L262 406 M920 260 L921 247 L912 244 L899 244 L897 253 L899 261 L912 265 L920 260 M195 355 L193 349 L186 342 L182 330 L182 323 L178 311 L172 304 L164 298 L157 294 L151 288 L145 282 L138 285 L135 298 L135 311 L138 318 L145 324 L151 335 L157 342 L164 345 L176 349 L182 351 L189 358 L195 355 M202 444 L204 431 L201 425 L195 418 L184 418 L182 425 L188 431 L194 437 L200 444 L202 444 M76 526 L74 520 L69 508 L69 504 L75 494 L82 490 L88 485 L94 478 L94 474 L88 464 L82 456 L75 452 L69 449 L57 445 L44 448 L38 452 L31 458 L25 465 L19 470 L10 475 L2 482 M799 488 L802 482 L805 475 L805 465 L799 461 L786 460 L781 469 L782 482 L786 491 L799 488 M1000 493 L994 497 L981 501 L975 502 L967 501 L956 498 L943 500 L937 503 L930 507 L921 513 L915 520 L911 526 M108 0 L116 13 L124 25 L113 36 L94 32 L79 38 L74 51 L75 69 L88 73 L88 85 L75 90 L57 90 L44 99 L36 108 L35 127 L35 146 L38 158 L46 171 L57 178 L75 180 L94 181 L107 172 L122 177 L132 184 L127 196 L118 203 L103 209 L93 209 L82 210 L69 221 L63 229 L56 241 L51 260 L53 279 L48 292 L43 304 L46 317 L48 336 L38 347 L25 351 L8 355 L13 368 L19 380 L22 399 L25 416 L29 431 L34 444 L32 463 L25 474 L31 478 L44 483 L57 489 L75 494 L83 501 L89 513 L101 524 M539 526 L547 518 L548 501 L541 491 L532 482 L522 473 L512 463 L508 450 L509 434 L522 429 L535 425 L536 406 L528 395 L521 387 L524 374 L516 366 L503 372 L491 375 L478 371 L465 366 L447 365 L428 362 L415 359 L396 357 L382 361 L371 369 L358 377 L346 382 L333 393 L324 399 L314 399 L302 392 L292 380 L283 368 L270 363 L264 355 L259 336 L259 317 L264 304 L269 285 L270 270 L275 253 L270 236 L264 226 L253 215 L245 205 L239 196 L226 189 L214 184 L214 170 L221 158 L220 142 L214 132 L204 120 L199 108 L195 92 L190 76 L187 63 L193 51 L201 41 L214 32 L232 38 L233 51 L245 63 L258 57 L270 46 L275 32 L270 19 L277 13 L283 19 L296 29 L314 26 L327 22 L344 25 L356 32 L371 35 L390 36 L397 44 L394 57 L388 70 L391 82 L384 93 L368 95 L352 96 L338 101 L333 115 L329 133 L340 145 L352 138 L371 137 L390 137 L409 139 L421 140 L434 136 L447 131 L465 128 L484 130 L497 133 L509 127 L516 120 L528 109 L538 101 L537 82 L528 75 L519 63 L509 54 L497 46 L490 38 L491 25 L502 13 L511 6 L523 0 M182 180 L170 171 L170 160 L184 165 L182 180 M561 437 L569 425 L554 425 L553 435 L561 437';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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

/* ------------------------------------------------------------------ */
/*  Placeholder artwork                                                 */
/* ------------------------------------------------------------------ */
function Art({ card }) {
    const [c1, c2] = card.bg;
    const fill = { position: 'absolute', inset: 0 };
    return (
        <div style={{ ...fill, background: `linear-gradient(160deg, ${c1}, ${c2})` }}>
            {card.kind === 'figure' && (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '24%',
                            width: '27%',
                            aspectRatio: '0.82',
                            transform: 'translateX(-50%)',
                            borderRadius: '50% 50% 46% 46%',
                            background: `radial-gradient(circle at 40% 30%, ${card.fg}, rgba(0,0,0,0.45))`,
                            opacity: 0.92,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: '74%',
                            height: '70%',
                            transform: 'translateX(-50%)',
                            borderRadius: '45% 45% 0 0 / 38% 38% 0 0',
                            background: `linear-gradient(${card.fg}, rgba(0,0,0,0.55))`,
                            opacity: 0.88,
                        }}
                    />
                </>
            )}
            {card.kind === 'glow' && (
                <>
                    <div style={{ ...fill, background: `radial-gradient(ellipse at 50% 70%, ${card.fg}, transparent 60%)`, opacity: 0.75 }} />
                    <div
                        style={{
                            ...fill,
                            backgroundImage: `repeating-linear-gradient(90deg, transparent 0 6px, rgba(0,0,0,0.25) 6px 8px)`,
                        }}
                    />
                </>
            )}
            {card.kind === 'blocks' && (
                <>
                    <div style={{ position: 'absolute', left: '10%', top: '12%', width: '48%', height: '34%', background: card.fg, opacity: 0.85, transform: 'rotate(-8deg)' }} />
                    <div style={{ position: 'absolute', right: '8%', bottom: '14%', width: '52%', height: '38%', background: 'rgba(255,255,255,0.65)', transform: 'rotate(6deg)' }} />
                    <div style={{ position: 'absolute', left: '34%', top: '40%', width: '26%', aspectRatio: '1', borderRadius: '50%', background: 'rgba(0,0,0,0.35)' }} />
                </>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                                */
/* ------------------------------------------------------------------ */
export default function GalleryPlay() {
    const sectionRef = useRef(null);
    const ringRef = useRef(null);
    const tiltRef = useRef(null);
    const mapRef = useRef(null);

    // deterministic layout (same on server and client)
    const layout = useMemo(() => {
        const rng = mulberry32(12);
        const n = CARDS.length;
        return CARDS.map((c, i) => ({
            ...c,
            w: c.w * CARD_SCALE,
            phi: (360 / n) * i + (rng() - 0.5) * 7,
            r: RING_R * (0.9 + rng() * 0.2),
            y: ROWS[i % ROWS.length] * 100 + (rng() - 0.5) * 7,
            rz: (rng() - 0.5) * 8,
            z: i,
        }));
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        const ring = ringRef.current;
        const tilt = tiltRef.current;
        const map = mapRef.current;
        if (!section || !ring) return;

        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const st = {
            rot: 0,
            vel: 0, // extra deg/s from wheel / drag inertia
            speed: reduce ? 0 : 1, // eased multiplier of BASE_SPEED (hover slows it)
            speedTarget: reduce ? 0 : 1,
            dragging: false,
            lastX: 0,
            lastT: 0,
            mx: 0,
            my: 0,
            tx: 0,
            ty: 0,
        };
        let raf = 0;
        let last = performance.now();

        const onDown = (e) => {
            st.dragging = true;
            st.lastX = e.clientX;
            st.lastT = performance.now();
            st.vel = 0;
            try {
                section.setPointerCapture(e.pointerId);
            } catch (err) {
                /* ignore */
            }
        };
        const onMove = (e) => {
            const r = section.getBoundingClientRect();
            st.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
            st.my = ((e.clientY - r.top) / r.height) * 2 - 1;
            if (st.dragging) {
                const now = performance.now();
                const dx = e.clientX - st.lastX;
                const dt = Math.max(1, now - st.lastT);
                st.rot += dx * 0.16;
                st.vel = clamp((dx * 0.16 * 1000) / dt, -240, 240);
                st.lastX = e.clientX;
                st.lastT = now;
            }
        };
        const onUp = (e) => {
            st.dragging = false;
            try {
                section.releasePointerCapture(e.pointerId);
            } catch (err) {
                /* ignore */
            }
        };
        const onWheel = (e) => {
            st.vel = clamp(st.vel - (e.deltaY + e.deltaX) * 0.12, -240, 240);
        };
        const onOver = (e) => {
            st.speedTarget = reduce ? 0 : e.target.closest && e.target.closest('[data-card]') ? 0.12 : 1;
        };
        const onLeave = () => {
            st.speedTarget = reduce ? 0 : 1;
            st.mx = 0;
            st.my = 0;
        };

        section.addEventListener('pointerdown', onDown);
        section.addEventListener('pointermove', onMove);
        section.addEventListener('pointerup', onUp);
        section.addEventListener('pointercancel', onUp);
        section.addEventListener('wheel', onWheel, { passive: true });
        section.addEventListener('pointerover', onOver);
        section.addEventListener('pointerleave', onLeave);

        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            const dt = Math.min(64, now - last) / 1000;
            last = now;

            st.speed += (st.speedTarget - st.speed) * (1 - Math.pow(0.0005, dt));
            if (!st.dragging) {
                st.rot += (BASE_SPEED * st.speed + st.vel) * dt;
                st.vel *= Math.pow(0.04, dt); // inertia decay
                if (Math.abs(st.vel) < 0.01) st.vel = 0;
            }

            st.tx += (st.mx - st.tx) * (1 - Math.pow(0.01, dt));
            st.ty += (st.my - st.ty) * (1 - Math.pow(0.01, dt));

            ring.style.transform = `rotateY(${(st.rot + st.tx * 4).toFixed(3)}deg)`;
            if (tilt) tilt.style.transform = `rotateZ(${RING_TILT}deg) rotateX(${(-st.ty * 3.5).toFixed(2)}deg)`;
            if (map) map.style.transform = `translate3d(${(-st.tx * 14).toFixed(1)}px,${(-st.ty * 9).toFixed(1)}px,0) scale(1.04)`;
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            section.removeEventListener('pointerdown', onDown);
            section.removeEventListener('pointermove', onMove);
            section.removeEventListener('pointerup', onUp);
            section.removeEventListener('pointercancel', onUp);
            section.removeEventListener('wheel', onWheel);
            section.removeEventListener('pointerover', onOver);
            section.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <section
            id="projects"
            ref={sectionRef}
            className={`${inter.className} gp-stage`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100svh',
                minHeight: 520,
                overflow: 'hidden',
                background: '#1e1e1e',
                color: '#fff',
                WebkitFontSmoothing: 'antialiased',
                touchAction: 'pan-y',
                userSelect: 'none',
                cursor: 'grab',
            }}
        >
            <style>{`
        .gp-card, .gp-card * { cursor: inherit !important; }
        .gp-card .gp-in{transition:transform .55s cubic-bezier(.2,.7,.1,1), box-shadow .55s ease}
        .gp-card:hover .gp-in{transform:translateZ(5vw) scale(1.06);box-shadow:0 2vw 4vw rgba(0,0,0,.55)}
        .gp-menu{position:relative}
        .gp-menu:after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:1px;background:#fff;transform:scaleX(0);transform-origin:left;transition:transform .35s ease}
        .gp-menu:hover:after{transform:scaleX(1)}
        .gp-stage:active, .gp-stage:active * {cursor:grabbing !important}
        @media (max-width:760px){ .gp-logo{font-size:22px!important} .gp-menu{font-size:15px!important} }
      `}</style>

            {/* faint map outline */}
            <div ref={mapRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
                <svg
                    viewBox="0 0 1000 526"
                    preserveAspectRatio="xMidYMid slice"
                    style={{ width: '100%', height: '100%', display: 'block' }}
                >
                    <path d={MAP_D} fill="none" stroke="#4a4a4a" strokeOpacity="0.85" strokeWidth="1.3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </svg>
            </div>

            {/* giant headline, behind the cards, cut by the top edge */}
            <h1
                style={{
                    position: 'absolute',
                    left: '31.75vw',
                    top: 0,
                    margin: 0,
                    width: '33.6vw',
                    zIndex: 1,
                    lineHeight: 0,
                }}
            >
                <svg viewBox="0 0 537 118" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} role="img" aria-label={HEADING}>
                    <text
                        x="0"
                        y="108"
                        fill="#fff"
                        textLength="537"
                        lengthAdjust="spacingAndGlyphs"
                        style={{ fontFamily: 'inherit', fontWeight: 800, fontSize: 136, letterSpacing: '-0.03em' }}
                    >
                        {HEADING}
                    </text>
                </svg>
            </h1>

            {/* 3D stage */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    perspective: `${PERSPECTIVE * 100}vw`,
                    perspectiveOrigin: '50% 50%',
                }}
            >
                <div
                    ref={tiltRef}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: `${CENTER_Y}%`,
                        width: 0,
                        height: 0,
                        transformStyle: 'preserve-3d',
                        transform: `rotateZ(${RING_TILT}deg)`,
                    }}
                >
                    <div ref={ringRef} style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d', willChange: 'transform' }}>
                        {layout.map((c) => (
                            <a
                                key={c.title}
                                href={c.href}
                                data-card=""
                                draggable={false}
                                className="gp-card"
                                style={{
                                    position: 'absolute',
                                    display: 'block',
                                    left: `${-c.w * 50}vw`,
                                    top: `${-c.w * c.a * 50}vw`,
                                    width: `${c.w * 100}vw`,
                                    height: `${c.w * c.a * 100}vw`,
                                    transformStyle: 'preserve-3d',
                                    transform: `translate3d(0,${c.y}vh,0) rotateY(${c.phi.toFixed(2)}deg) translateZ(${(c.r * 100).toFixed(2)}vw) rotateZ(${c.rz.toFixed(2)}deg)`,
                                    color: '#fff',
                                    textDecoration: 'none',
                                    cursor: 'inherit',
                                }}
                            >
                                <div
                                    className="gp-in"
                                    style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', background: '#111', overflow: 'hidden' }}
                                >
                                    {c.img ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={c.img} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    ) : (
                                        <Art card={c} />
                                    )}
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: '6%',
                                            bottom: '5%',
                                            right: '6%',
                                            fontSize: 'clamp(9px,0.95vw,17px)',
                                            lineHeight: 1.1,
                                            fontWeight: 400,
                                            letterSpacing: '-0.005em',
                                            color: '#fff',
                                            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                                        }}
                                    >
                                        {c.title}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* logo (top-left) */}
            <a
                href="#home"
                className="gp-logo"
                aria-label="Gallery Play"
                style={{
                    position: 'absolute',
                    left: '3.1vw',
                    top: '0.55vw',
                    zIndex: 10,
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: 'clamp(20px,2.3vw,44px)',
                    lineHeight: 0.92,
                    letterSpacing: '-0.04em',
                }}
            >
                <span style={{ display: 'block', fontWeight: 700 }}>Gallery</span>
                <span style={{ display: 'block', fontWeight: 400, fontStyle: 'italic', paddingLeft: '0.42em' }}>
                    Play
                    <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" style={{ marginLeft: 2, verticalAlign: 'baseline' }}>
                        <ellipse cx="7" cy="5" rx="6" ry="4" fill="none" stroke="#fff" strokeWidth="0.9" />
                        <text x="3.2" y="6.8" fill="#fff" style={{ fontSize: 5.2, fontWeight: 700, fontStyle: 'italic' }}>GP</text>
                    </svg>
                </span>
            </a>

            {/* menu (top-right) */}
            <a
                href="#menu"
                className="gp-menu"
                style={{
                    position: 'absolute',
                    right: '6.2vw',
                    top: '0.55vw',
                    zIndex: 10,
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: 'clamp(13px,1.28vw,24px)',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                }}
            >
                Menu
            </a>
        </section>
    );
}