'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ambientMessages,
  contactChannels,
  missionLog,
  missions,
  navigation,
  operatorProfile,
  postCheckLines,
  skillMatrix,
  systemNotifications,
} from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ─── Panel with PS2-style corner brackets ────────────────── */
function GamePanel({
  children,
  className = '',
  variant = 'green',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'green' | 'red' | 'dim';
}) {
  const color =
    variant === 'red'
      ? 'rgba(196,26,46,0.5)'
      : variant === 'dim'
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(57,255,20,0.45)';

  return (
    <div className={`relative border border-white/[0.07] ${className}`}>
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <span
          key={pos}
          className="absolute"
          style={{
            width: 14,
            height: 14,
            top: pos.startsWith('t') ? -1 : undefined,
            bottom: pos.startsWith('b') ? -1 : undefined,
            left: pos.endsWith('l') ? -1 : undefined,
            right: pos.endsWith('r') ? -1 : undefined,
            borderTop: pos.startsWith('t') ? `1px solid ${color}` : undefined,
            borderBottom: pos.startsWith('b') ? `1px solid ${color}` : undefined,
            borderLeft: pos.endsWith('l') ? `1px solid ${color}` : undefined,
            borderRight: pos.endsWith('r') ? `1px solid ${color}` : undefined,
          }}
        />
      ))}
      {children}
    </div>
  );
}

/* ─── Section label (game level style) ───────────────────── */
function SectorLabel({ number, name, sub }: { number: string; name: string; sub?: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.07]" />
        <span className="font-terminal text-xl text-white/20 tracking-[0.2em]">SECTOR {number}</span>
        <div className="h-px flex-1 bg-white/[0.07]" />
      </div>
      <div className="mt-3 flex items-end gap-6">
        <span className="font-display text-[5rem] leading-none text-white/[0.06] select-none">{number}</span>
        <div>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] leading-none tracking-[0.05em] text-[var(--silver)]">
            {name}
          </h2>
          {sub && (
            <p className="mt-1 font-terminal text-lg tracking-[0.18em] text-white/30">{sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Boot screen ─────────────────────────────────────────── */
function GameBootScreen({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<'crt' | 'post' | 'loading' | 'ready' | 'starting'>('crt');
  const [visibleLines, setVisibleLines] = useState(0);
  const [loadPct, setLoadPct] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  /* Phase progression */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('post'), 700);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'post') return;
    let count = 0;
    const id = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= postCheckLines.length) {
        clearInterval(id);
        setTimeout(() => setPhase('loading'), 300);
      }
    }, 260);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'loading') return;
    let prog = 0;
    const id = setInterval(() => {
      prog = Math.min(100, prog + Math.random() * 5 + 1.5);
      setLoadPct(Math.round(prog));
      if (prog >= 100) {
        clearInterval(id);
        setTimeout(() => setPhase('ready'), 400);
      }
    }, 45);
    return () => clearInterval(id);
  }, [phase]);

  /* Canvas static noise */
  const startStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = () => {
      const id = ctx.createImageData(canvas.width, canvas.height);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
      }
      ctx.putImageData(id, 0, 0);
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, []);

  const handleStart = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('starting');
    startStatic();
    setTimeout(() => {
      cancelAnimationFrame(animRef.current);
      onEnter();
    }, 950);
  }, [phase, onEnter, startStatic]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleStart();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleStart]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const loadBar = '█'.repeat(Math.floor(loadPct / 5)) + '░'.repeat(20 - Math.floor(loadPct / 5));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[var(--bg)]"
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {/* Static canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ opacity: phase === 'starting' ? 1 : 0 }}
      />

      {/* Atmosphere */}
      <div className="scanline-layer pointer-events-none absolute inset-0 opacity-80" />
      <div className="grain-layer pointer-events-none absolute inset-0" />
      <div className="crt-vignette pointer-events-none absolute inset-0" />
      <div className="crt-scan-pass pointer-events-none absolute inset-0 opacity-30" />

      {/* Boot panel */}
      <motion.div
        className="relative z-10 w-[min(94vw,760px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'crt' ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <GamePanel>
          {/* Titlebar */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-2">
            <span className="font-terminal text-lg tracking-[0.25em] text-white/30">
              KRISHNA TAYAL SYSTEMS v1.0
            </span>
            <div className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--red)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--yellow)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--green-dim)]" />
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Big title */}
            <div className="mb-6">
              <p className="font-terminal text-2xl tracking-[0.3em] text-white/20">
                EXECUTABLE LOADED:
              </p>
              <h1 className="font-display text-[clamp(3rem,12vw,7rem)] leading-none tracking-[0.06em] text-white flicker">
                KRISHNA TAYAL.EXE
              </h1>
            </div>

            {/* POST lines */}
            {(phase === 'post' || phase === 'loading' || phase === 'ready' || phase === 'starting') && (
              <div className="mb-5 space-y-0.5 border border-white/[0.06] bg-black/40 p-4">
                {postCheckLines.slice(0, visibleLines).map((line, i) => (
                  <p
                    key={i}
                    className={`font-terminal text-base leading-tight tracking-[0.15em] ${
                      line.startsWith('WARNING')
                        ? 'text-[var(--red-bright)]'
                        : line.startsWith('POST CHECK') || line.startsWith('BIOS')
                        ? 'text-[var(--green)]'
                        : 'text-white/40'
                    }`}
                  >
                    {line}
                  </p>
                ))}
                {phase === 'post' && visibleLines < postCheckLines.length && (
                  <p className="terminal-cursor font-terminal text-base tracking-[0.15em] text-white/40">
                    {postCheckLines[visibleLines]}
                  </p>
                )}
              </div>
            )}

            {/* Loading bar */}
            {(phase === 'loading' || phase === 'ready' || phase === 'starting') && (
              <div className="mb-6">
                <div className="mb-1 flex justify-between font-terminal text-lg tracking-[0.2em]">
                  <span className="text-white/30">LOADING OPERATOR DATA</span>
                  <span className="text-[var(--green)]">{loadPct}%</span>
                </div>
                <div className="border border-white/10 p-0.5">
                  <div
                    className="h-2 bg-gradient-to-r from-[var(--green-dim)] to-[var(--green)]"
                    style={{ width: `${loadPct}%`, transition: 'width 60ms linear' }}
                  />
                </div>
                <p className="mt-1 font-terminal text-base tracking-[0.18em] text-white/20">
                  [{loadBar}] {loadPct}/100
                </p>
              </div>
            )}

            {/* PRESS START */}
            {(phase === 'ready') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 border-t border-white/[0.07] pt-5">
                  <p className="press-start-blink font-terminal text-[2.2rem] tracking-[0.3em] text-[var(--green)]">
                    {'>'} PRESS START
                  </p>
                  <p className="mt-2 font-terminal text-base tracking-[0.2em] text-white/20">
                    [ OR PRESS ENTER ]
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStart}
                  className="group relative overflow-hidden border border-[var(--green)] bg-transparent px-8 py-3 font-terminal text-xl tracking-[0.28em] text-[var(--green)] transition-all duration-200 hover:bg-[var(--green)] hover:text-black"
                >
                  [ INITIALIZE ARCHIVE ]
                  <span className="absolute inset-0 -translate-x-full bg-[var(--green)] transition-transform duration-300 group-hover:translate-x-0 -z-10" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Footer bar */}
          <div className="flex justify-between border-t border-white/[0.06] px-5 py-2 font-terminal text-base tracking-[0.2em] text-white/20">
            <span>BUILD 2026.05</span>
            <span>SIGNAL STABLE</span>
            <span>SECTOR 11</span>
          </div>
        </GamePanel>
      </motion.div>
    </motion.div>
  );
}

/* ─── Game cursor ─────────────────────────────────────────── */
function GameCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (coordRef.current)
        coordRef.current.textContent = `${String(e.clientX).padStart(4, '0')},${String(e.clientY).padStart(4, '0')}`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2"
      style={{ willChange: 'transform' }}
    >
      {/* Crosshair */}
      <div className="relative h-5 w-5">
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--green)] opacity-70" />
        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-[var(--green)] opacity-70" />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-[var(--green)] opacity-40" />
      </div>
      {/* Coordinates HUD */}
      <span
        ref={coordRef}
        className="absolute left-4 top-3 whitespace-nowrap font-terminal text-xs tracking-[0.2em] text-[var(--green)] opacity-40"
      >
        0000,0000
      </span>
    </div>
  );
}

/* ─── Notification / achievement system ───────────────────── */
type NotifType = 'achievement' | 'warning' | 'system' | 'glitch';
interface Notif { id: number; type: NotifType; title: string; body: string; }

function NotificationSystem({ active }: { active: boolean }) {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const counterRef = useRef(0);

  const push = useCallback((type: NotifType, title: string, body: string) => {
    const id = ++counterRef.current;
    setNotifs((prev) => [...prev.slice(-3), { id, type, title, body }]);
    setTimeout(() => setNotifs((prev) => prev.filter((n) => n.id !== id)), 4500);
  }, []);

  useEffect(() => {
    if (!active) return;
    const timers = systemNotifications.map(({ delay, type, title, body }) =>
      setTimeout(() => push(type, title, body), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [active, push]);

  const colors: Record<NotifType, string> = {
    achievement: 'border-[rgba(200,168,50,0.45)] text-[var(--yellow)]',
    warning:     'border-[rgba(196,26,46,0.45)]  text-[var(--red-bright)]',
    system:      'border-[rgba(57,255,20,0.25)]  text-[var(--green)]',
    glitch:      'border-[rgba(255,255,255,0.15)] text-white/50',
  };
  const icons: Record<NotifType, string> = {
    achievement: '🏆',
    warning:     '⚠',
    system:      '◈',
    glitch:      '///',
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {notifs.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 40, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className={`achievement-toast relative max-w-[280px] border px-4 py-3 ${colors[n.type]}`}
          >
            <div className="flex items-center gap-2">
              <span className="font-terminal text-lg">{icons[n.type]}</span>
              <span className="font-terminal text-base tracking-[0.18em]">{n.title}</span>
            </div>
            <p className="mt-0.5 font-terminal text-sm tracking-[0.15em] text-white/40">{n.body}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Ambient ticker ──────────────────────────────────────── */
function AmbientTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ambientMessages.length);
        setVisible(true);
      }, 300);
    }, 4800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-3 border border-[rgba(57,255,20,0.18)] bg-[rgba(4,4,3,0.9)] px-5 py-2 backdrop-blur-md">
        <span
          className="h-1.5 w-1.5 rounded-full bg-[var(--green)] status-dot-pulse"
        />
        <motion.span
          key={index}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="font-terminal text-base tracking-[0.25em] text-[var(--green)]"
        >
          {ambientMessages[index]}
        </motion.span>
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────── */
export default function Home() {
  const [entered, setEntered] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      sessionStorage.getItem('kt-archive-entered') === '1' ||
      new URLSearchParams(window.location.search).get('skip') === '1'
    );
  });
  const [clock, setClock] = useState('');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!entered) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-el',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
      );

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
        });
      });

      gsap.utils.toArray<HTMLElement>('.mission-card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, delay: i * 0.08, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 90%' },
        });
      });

      gsap.utils.toArray<HTMLElement>('.log-entry').forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, x: -16 }, {
          opacity: 1, x: 0, delay: i * 0.1, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }, mainRef);

    const tick = () =>
      setClock(
        new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Calcutta' }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);

    return () => { clearInterval(id); ctx.revert(); };
  }, [entered]);

  return (
    <>
      <AnimatePresence>
        {!entered && (
          <GameBootScreen
            onEnter={() => {
              sessionStorage.setItem('kt-archive-entered', '1');
              setEntered(true);
            }}
          />
        )}
      </AnimatePresence>

      {entered && (
        <>
          <GameCursor />
          <NotificationSystem active={entered} />

          <main ref={mainRef} className="relative overflow-hidden bg-[var(--bg)]">
            {/* Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_10%_6%,rgba(122,12,27,0.2),transparent_28%),radial-gradient(ellipse_at_88%_10%,rgba(57,255,20,0.03),transparent_22%)]" />
            <div className="grain-layer pointer-events-none fixed inset-0 z-10" />
            <div className="scanline-layer pointer-events-none fixed inset-0 z-10" />
            <div className="vhs-layer pointer-events-none fixed inset-0 z-10 opacity-50" />
            <div className="crt-vignette pointer-events-none fixed inset-0 z-10 opacity-50" />

            {/* ── HUD Header ── */}
            <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[rgba(6,6,5,0.82)] backdrop-blur-xl">
              <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[var(--green)] status-dot-pulse" />
                  <span className="font-terminal text-lg tracking-[0.22em] text-white/50">
                    KRISHNA TAYAL ARCHIVE
                  </span>
                  <span className="font-terminal text-sm tracking-[0.2em] text-[var(--red-bright)]">
                    ▶ LIVE
                  </span>
                </div>
                <nav className="flex flex-wrap gap-x-5 gap-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="font-terminal text-base tracking-[0.2em] text-white/30 transition-colors duration-150 hover:text-[var(--green)]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="flex gap-4 font-terminal text-base tracking-[0.2em] text-white/25">
                  <span>BUILD 2026.05</span>
                  <span>{clock || '--:--:--'} IST</span>
                </div>
              </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative mx-auto min-h-screen max-w-[1400px] px-5 pb-16 pt-12">
              {/* Floating sector number background */}
              <div
                className="pointer-events-none absolute right-0 top-4 font-display text-[20vw] leading-none text-white/[0.025] select-none float-bg"
                aria-hidden
              >
                01
              </div>

              <div className="hero-el mb-4 font-terminal text-xl tracking-[0.28em] text-[var(--green)]">
                {'>'} OPERATOR FILE LOADED
              </div>

              <h1
                className="glitch-text hero-el font-display text-[clamp(4.5rem,14vw,11rem)] leading-[0.88] tracking-[0.04em] text-white"
                data-text="KRISHNA TAYAL"
              >
                KRISHNA TAYAL
              </h1>

              <div className="hero-el mt-4 font-terminal text-xl tracking-[0.25em] text-white/30">
                {operatorProfile.sectors.join(' // ')}
              </div>

              <div className="hero-el mt-8 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_260px] lg:grid-cols-[minmax(0,1.2fr)_320px]">
                <GamePanel className="bg-[rgba(8,8,7,0.8)] p-6">
                  <div className="mb-3 font-terminal text-base tracking-[0.22em] text-white/30">
                    SUBJECT PSYCHOLOGICAL PROFILE
                  </div>
                  <p className="font-body text-base leading-7 text-white/60 md:text-lg">
                    {operatorProfile.psychProfile}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {operatorProfile.targetEnvironments.map((env) => (
                      <span
                        key={env}
                        className="border border-white/[0.1] px-3 py-1 font-terminal text-sm tracking-[0.18em] text-white/35"
                      >
                        {env}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a
                      href="#mission-archive"
                      className="border border-[var(--green)] px-5 py-2.5 font-terminal text-lg tracking-[0.2em] text-[var(--green)] transition-all duration-200 hover:bg-[var(--green)] hover:text-black"
                    >
                      {'>'} ACCESS MISSIONS
                    </a>
                    <a
                      href="#transmission"
                      className="border border-white/[0.12] px-5 py-2.5 font-terminal text-lg tracking-[0.2em] text-white/30 transition-all duration-200 hover:border-white/25 hover:text-white/60"
                    >
                      OPEN TRANSMISSION
                    </a>
                  </div>
                </GamePanel>

                <div className="flex flex-col gap-4">
                  <GamePanel className="bg-black/50 p-4" variant="dim">
                    <div className="mb-2 font-terminal text-sm tracking-[0.22em] text-white/25">SYSTEM STATUS</div>
                    <div className="space-y-2">
                      {[
                        { k: 'DESIGNATION', v: operatorProfile.designation },
                        { k: 'STATUS', v: operatorProfile.classification },
                        { k: 'CLOCK', v: `${clock || '--:--:--'} IST` },
                      ].map(({ k, v }) => (
                        <div key={k} className="flex justify-between gap-2">
                          <span className="font-terminal text-sm tracking-[0.16em] text-white/25">{k}</span>
                          <span className={`font-terminal text-sm tracking-[0.14em] ${k === 'STATUS' ? 'text-[var(--green)]' : 'text-white/50'}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </GamePanel>

                  <GamePanel className="bg-[rgba(122,12,27,0.08)] p-4" variant="red">
                    <div className="mb-2 font-terminal text-sm tracking-[0.22em] text-[var(--red-bright)]">KNOWN ISSUES</div>
                    <p className="font-terminal text-base leading-snug tracking-[0.14em] text-white/30">
                      {operatorProfile.knownWeaknesses}
                    </p>
                  </GamePanel>

                  <GamePanel className="bg-black/40 p-4" variant="dim">
                    <div className="mb-2 font-terminal text-sm tracking-[0.22em] text-[var(--yellow)]">STRENGTH VECTOR</div>
                    <p className="font-terminal text-base leading-snug tracking-[0.14em] text-white/40">
                      {operatorProfile.strengthVector}
                    </p>
                  </GamePanel>
                </div>
              </div>
            </section>

            {/* ── Operator File (About) ── */}
            <section
              id="operator-file"
              className="reveal mx-auto max-w-[1400px] border-t border-white/[0.06] px-5 py-14"
            >
              <SectorLabel number="02" name="OPERATOR FILE" sub="CLASSIFIED SUBJECT PROFILE" />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'OPERATING MODE', value: operatorProfile.operatingMode },
                  { label: 'BEST ENVIRONMENTS', value: operatorProfile.targetEnvironments.join(', ') },
                  { label: 'DOMAINS', value: 'Psychology, storytelling, decision design, internet culture, digital experiences.' },
                  { label: 'SIGNAL', value: 'Premium judgment with enough personality to be memorable and enough clarity to be useful.' },
                ].map((item) => (
                  <GamePanel key={item.label} className="bg-[rgba(8,8,7,0.7)] p-5 transition-all duration-300 hover:border-[rgba(57,255,20,0.14)]">
                    <div className="mb-3 font-terminal text-sm tracking-[0.22em] text-white/25">{item.label}</div>
                    <p className="font-body text-base leading-6 text-white/55">{item.value}</p>
                  </GamePanel>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  'Systems before surfaces. But never at the expense of taste.',
                  'Product work should reduce ambiguity, not decorate it.',
                  'Strong narratives make better teams, better interfaces, and better decisions.',
                ].map((p) => (
                  <GamePanel key={p} className="border-[var(--border)] bg-transparent p-4" variant="dim">
                    <p className="font-terminal text-base leading-snug tracking-[0.14em] text-white/30">{p}</p>
                  </GamePanel>
                ))}
              </div>
            </section>

            {/* ── Mission Archive (Projects) ── */}
            <section
              id="mission-archive"
              className="mx-auto max-w-[1400px] border-t border-white/[0.06] px-5 py-14"
            >
              <div className="reveal">
                <SectorLabel number="03" name="MISSION ARCHIVE" sub="STRATEGIC CASE FILES — CLASSIFIED" />
              </div>

              <div className="grid gap-5 xl:grid-cols-3">
                {missions.map((m) => (
                  <article
                    key={m.id}
                    className="mission-card group relative overflow-hidden border border-white/[0.07] bg-[linear-gradient(160deg,rgba(14,14,12,0.95),rgba(6,6,5,0.98))] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(57,255,20,0.18)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                  >
                    {/* Hover scanline effect */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent,transparent_3px,rgba(57,255,20,0.008)_3px,rgba(57,255,20,0.008)_4px)]" />
                    </div>

                    {/* Mission header */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-terminal text-sm tracking-[0.25em] text-white/25">{m.id}</div>
                        <div className="mt-0.5 font-terminal text-sm tracking-[0.2em] text-[var(--green)]">{m.classification}</div>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 border px-2.5 py-1 font-terminal text-sm tracking-[0.18em] ${
                          m.status === 'ACTIVE'
                            ? 'border-[rgba(57,255,20,0.3)] text-[var(--green)]'
                            : 'border-white/[0.12] text-white/30'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${m.status === 'ACTIVE' ? 'bg-[var(--green)] status-dot-pulse' : 'bg-white/25'}`}
                        />
                        {m.status}
                      </div>
                    </div>

                    {/* Visual placeholder */}
                    <div className="relative mb-5 aspect-[16/7] overflow-hidden border border-white/[0.05] bg-black/50">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(57,255,20,0.05),transparent_45%),radial-gradient(ellipse_at_80%_60%,rgba(122,12,27,0.1),transparent_40%)]" />
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                        <div className="absolute left-3 top-3 font-terminal text-xs tracking-[0.25em] text-white/20">CLASSIFIED</div>
                        <div className="absolute bottom-2 right-3 font-terminal text-xs tracking-[0.2em] text-white/15">{m.id}</div>
                        <div className="absolute left-3 bottom-2 font-terminal text-xs tracking-[0.18em] text-[var(--green)]/30">DIFFICULTY: {m.difficulty}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="font-terminal text-sm tracking-[0.18em] text-white/25">{m.operativeRole}</div>
                    <h3 className="mt-2 font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-none tracking-[0.04em] text-white transition-colors duration-300 group-hover:text-[var(--green)]">
                      {m.title}
                    </h3>
                    <p className="mt-3 font-body text-sm leading-6 text-white/45">{m.briefing}</p>

                    <div className="mt-4 border-t border-dashed border-white/[0.09] pt-4">
                      <div className="font-terminal text-sm tracking-[0.2em] text-[var(--green)]">{'>'} OUTCOME</div>
                      <p className="mt-1.5 font-body text-sm leading-6 text-white/50">{m.outcome}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.tools.map((t) => (
                        <span key={t} className="border border-white/[0.09] px-2.5 py-1 font-terminal text-xs tracking-[0.16em] text-white/30 transition-colors duration-200 group-hover:border-white/[0.15]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* ── Mission Log (Experience) ── */}
            <section
              id="mission-log"
              className="reveal mx-auto max-w-[1400px] border-t border-white/[0.06] px-5 py-14"
            >
              <SectorLabel number="04" name="MISSION LOG" sub="DEPLOYMENT HISTORY — CHRONOLOGICAL" />

              <div className="border-l border-white/[0.09] pl-6 md:pl-10">
                {missionLog.map((entry, i) => (
                  <div key={entry.title} className={`log-entry relative ${i > 0 ? 'mt-10' : ''}`}>
                    <span className="absolute -left-[2.05rem] top-1 h-3 w-3 border border-[var(--green)] bg-[var(--bg)] md:-left-[2.65rem]" />
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-terminal text-base tracking-[0.22em] text-[var(--green)]">{entry.period}</span>
                      <span className="border border-white/[0.1] px-2 py-0.5 font-terminal text-xs tracking-[0.18em] text-white/25">{entry.classification}</span>
                    </div>
                    <h3 className="mt-2 font-display text-[clamp(1.3rem,2.3vw,2rem)] leading-none tracking-[0.04em] text-white/80">
                      {entry.title}
                    </h3>
                    <p className="mt-3 max-w-2xl font-body text-base leading-7 text-white/40">{entry.log}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Skill Matrix ── */}
            <section
              id="skill-matrix"
              className="reveal mx-auto max-w-[1400px] border-t border-white/[0.06] px-5 py-14"
            >
              <SectorLabel number="05" name="SKILL MATRIX" sub="CORE SYSTEM ATTRIBUTES" />

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {skillMatrix.map((skill) => (
                  <GamePanel
                    key={skill.code}
                    className="bg-[rgba(8,8,7,0.8)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(57,255,20,0.18)]"
                  >
                    <div className="font-terminal text-sm tracking-[0.25em] text-[var(--green)]">{skill.code}</div>
                    <h3 className="mt-4 font-display text-[1.7rem] leading-none tracking-[0.04em] text-white/80">
                      {skill.title}
                    </h3>
                    <div className="mt-3 font-terminal text-base tracking-[0.1em] text-[var(--green)]/60">
                      {skill.rating}
                    </div>
                    <p className="mt-3 font-body text-sm leading-6 text-white/40">{skill.body}</p>
                  </GamePanel>
                ))}
              </div>
            </section>

            {/* ── Transmission (Contact) ── */}
            <section
              id="transmission"
              className="reveal mx-auto max-w-[1400px] border-t border-white/[0.06] px-5 py-14 mb-20"
            >
              <SectorLabel number="06" name="TRANSMISSION TERMINAL" sub="SECURE COMMUNICATION INTERFACE" />

              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div className="space-y-3">
                  {contactChannels.map((ch) => (
                    <a
                      key={ch.label}
                      href={ch.href}
                      className="group flex items-center justify-between border border-white/[0.07] bg-[rgba(8,8,7,0.7)] p-4 transition-all duration-200 hover:border-[rgba(57,255,20,0.22)] hover:bg-[rgba(12,12,10,0.85)]"
                    >
                      <div>
                        <div className="font-terminal text-sm tracking-[0.25em] text-white/25">{ch.label}</div>
                        <strong className="mt-1 block font-body text-base font-semibold text-white/70 transition-colors duration-200 group-hover:text-white">
                          {ch.value}
                        </strong>
                      </div>
                      <span className="font-terminal text-xs tracking-[0.18em] text-white/20">{ch.protocol}</span>
                    </a>
                  ))}

                  <GamePanel className="mt-4 bg-[rgba(122,12,27,0.06)] p-4" variant="red">
                    <div className="font-terminal text-sm tracking-[0.22em] text-[var(--red-bright)]">RESPONSE PROTOCOL</div>
                    <p className="mt-2 font-terminal text-base leading-snug tracking-[0.14em] text-white/30">
                      Usually within 24h. Longer if the question requires actual thinking.
                    </p>
                  </GamePanel>
                </div>

                <GamePanel className="bg-[rgba(8,8,7,0.8)] p-6">
                  <div className="mb-5 font-terminal text-base tracking-[0.22em] text-[var(--green)]">
                    {'>'} OPEN CHANNEL — ENTER MESSAGE
                  </div>
                  <form className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="CALLSIGN"
                        className="col-span-2 min-h-11 border border-white/[0.09] bg-black/50 px-4 font-terminal text-lg tracking-[0.15em] text-white/70 placeholder:text-white/20 outline-none transition-all focus:border-[rgba(57,255,20,0.3)] md:col-span-1"
                      />
                      <input
                        type="email"
                        placeholder="RETURN ADDRESS"
                        className="col-span-2 min-h-11 border border-white/[0.09] bg-black/50 px-4 font-terminal text-lg tracking-[0.15em] text-white/70 placeholder:text-white/20 outline-none transition-all focus:border-[rgba(57,255,20,0.3)] md:col-span-1"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="TRANSMISSION SUBJECT"
                      className="min-h-11 border border-white/[0.09] bg-black/50 px-4 font-terminal text-lg tracking-[0.15em] text-white/70 placeholder:text-white/20 outline-none transition-all focus:border-[rgba(57,255,20,0.3)]"
                    />
                    <textarea
                      rows={5}
                      placeholder="MESSAGE BODY"
                      className="border border-white/[0.09] bg-black/50 px-4 py-3 font-terminal text-lg leading-relaxed tracking-[0.15em] text-white/70 placeholder:text-white/20 outline-none transition-all focus:border-[rgba(57,255,20,0.3)]"
                    />
                    <button
                      type="submit"
                      className="group relative overflow-hidden border border-[var(--green)] bg-transparent py-3 font-terminal text-xl tracking-[0.25em] text-[var(--green)] transition-all duration-200 hover:bg-[var(--green)] hover:text-black"
                    >
                      {'>'} TRANSMIT MESSAGE
                    </button>
                    <p className="font-terminal text-sm tracking-[0.18em] text-white/20">
                      ENCRYPTED CHANNEL — STAKEHOLDER ALIGNMENT STILL PENDING
                    </p>
                  </form>
                </GamePanel>
              </div>
            </section>

            {/* ── Footer ── */}
            <footer className="mx-auto mb-24 max-w-[1400px] border-t border-white/[0.06] px-5 py-4">
              <div className="flex flex-col gap-1 font-terminal text-sm tracking-[0.2em] text-white/20 md:flex-row md:justify-between">
                <span>KRISHNA TAYAL ARCHIVE — BUILD 2026.05</span>
                <span>BLACK // DIRTY GREY // CRT GREEN // DEEP RED // MUTED YELLOW</span>
                <span>{clock || '--:--:--'} IST</span>
              </div>
            </footer>

            <AmbientTicker />
          </main>
        </>
      )}
    </>
  );
}
