"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/redesign/utils";

export const AR_HERO_STILLS = {
  jewellery: {
    src: "/redesign/heroes/jewellery-ar.png",
    alt: "Yellow-gold pavé diamond ring hovering above a smartphone as a luxury AR projection",
    width: 1024,
    height: 576,
  },
  food: {
    src: "/redesign/heroes/food-ar.png",
    alt: "Gourmet plated dish hovering above a smartphone as a luxury AR dining preview",
    width: 1024,
    height: 576,
  },
} as const;

export type ArHeroKind = keyof typeof AR_HERO_STILLS;

const SWAP_MS = 9000;
const RING_COUNT = [1, 2, 3, 4, 5] as const;
const SPARK_COUNT = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const STEAM_COUNT = [1, 2, 3, 4, 5, 6, 7] as const;
const DUST_COUNT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  a: number;
  steam: boolean;
};

function makeParticles(kind: ArHeroKind): Particle[] {
  const steamN = kind === "food" ? 16 : 0;
  const dustN = kind === "food" ? 28 : 34;
  return Array.from({ length: steamN + dustN }, (_, i) => {
    const steam = i < steamN;
    return {
      x: steam ? 0.38 + Math.random() * 0.24 : 0.18 + Math.random() * 0.64,
      y: Math.random(),
      r: steam ? 10 + Math.random() * 22 : 0.5 + Math.random() * 1.6,
      vy: steam ? 0.00018 + Math.random() * 0.00022 : 0.00008 + Math.random() * 0.00018,
      vx: (Math.random() - 0.5) * (steam ? 0.00012 : 0.00006),
      a: steam ? 0.08 + Math.random() * 0.16 : 0.18 + Math.random() * 0.45,
      steam,
    };
  });
}

function HeroFxCanvas({ kind, active }: { kind: ArHeroKind; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const particles = makeParticles(kind);
    const sparkles =
      kind === "jewellery"
        ? Array.from({ length: 7 }, () => ({
            x: 0.42 + Math.random() * 0.16,
            y: 0.16 + Math.random() * 0.22,
            phase: Math.random() * Math.PI * 2,
            speed: 1.4 + Math.random() * 1.8,
            size: 4 + Math.random() * 7,
          }))
        : [];

    let raf = 0;
    let running = true;
    let last = performance.now();

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const draw = (now: number) => {
      if (!running) return;
      raf = window.requestAnimationFrame(draw);
      const dt = Math.min(48, now - last);
      last = now;

      const w = canvas.width;
      const h = canvas.height;
      if (w < 2 || h < 2) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.vy * dt;
        p.x += p.vx * dt;
        if (p.y < -0.08) p.y = 1.06;
        if (p.x < 0.12) p.x = 0.86;
        if (p.x > 0.88) p.x = 0.14;

        const px = p.x * w;
        const py = p.y * h;
        if (p.steam) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, p.r * (window.devicePixelRatio || 1));
          grd.addColorStop(0, `rgba(255, 248, 236, ${p.a})`);
          grd.addColorStop(0.45, `rgba(232, 213, 163, ${p.a * 0.35})`);
          grd.addColorStop(1, "rgba(232, 213, 163, 0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, py, p.r * Math.min(window.devicePixelRatio || 1, 2), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(232, 213, 163, ${p.a})`;
          ctx.beginPath();
          ctx.arc(px, py, p.r * Math.min(window.devicePixelRatio || 1, 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        const pulse = 0.15 + 0.85 * Math.abs(Math.sin(now * 0.001 * s.speed + s.phase));
        const cx = s.x * w;
        const cy = s.y * h;
        const arm = s.size * Math.min(window.devicePixelRatio || 1, 2);
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = `rgba(255, 248, 230, ${pulse})`;
        ctx.lineWidth = 1.1 * Math.min(window.devicePixelRatio || 1, 2);
        ctx.beginPath();
        ctx.moveTo(cx - arm, cy);
        ctx.lineTo(cx + arm, cy);
        ctx.moveTo(cx, cy - arm);
        ctx.lineTo(cx, cy + arm);
        ctx.stroke();
        ctx.restore();
      }
    };

    raf = window.requestAnimationFrame(draw);
    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [kind, active]);

  return <canvas ref={canvasRef} className="ar-hero-loop__canvas" aria-hidden />;
}

function StillPlate({
  kind,
  active,
  priority,
  paused,
}: {
  kind: ArHeroKind;
  active: boolean;
  priority?: boolean;
  paused: boolean;
}) {
  const still = AR_HERO_STILLS[kind];

  return (
    <div
      className={cn("ar-hero-loop__plate", `ar-hero-loop__plate--${kind}`, active && "is-active")}
      aria-hidden={!active}
    >
      <div className="ar-hero-loop__ken">
        <div className="ar-hero-loop__rig">
          <div className="ar-hero-loop__base">
            <Image
              src={still.src}
              alt=""
              width={still.width}
              height={still.height}
              priority={priority}
              sizes="(max-width: 768px) 92vw, 42vw"
              className="ar-hero-loop__img"
            />
          </div>
          <div className="ar-hero-loop__product">
            <Image
              src={still.src}
              alt=""
              width={still.width}
              height={still.height}
              sizes="(max-width: 768px) 92vw, 42vw"
              className="ar-hero-loop__img"
            />
          </div>
        </div>
      </div>

      <div className="ar-hero-loop__fx" aria-hidden>
        <span className="ar-hero-loop__portal" />
        <span className="ar-hero-loop__beams" />
        {RING_COUNT.map((n) => (
          <span key={n} className={`ar-hero-loop__ring r${n}`} />
        ))}
        {kind === "jewellery" ? <span className="ar-hero-loop__scan" /> : null}
        {kind === "jewellery"
          ? SPARK_COUNT.map((n) => <span key={n} className={`ar-hero-loop__spark s${n}`} />)
          : null}
        {kind === "food"
          ? STEAM_COUNT.map((n) => <span key={n} className={`ar-hero-loop__steam w${n}`} />)
          : null}
        {DUST_COUNT.map((n) => (
          <span key={n} className={`ar-hero-loop__dust d${n}`} />
        ))}
      </div>
      <HeroFxCanvas kind={kind} active={active && !paused} />
    </div>
  );
}

export function ArHeroLoop({
  kind,
  swap = false,
  lockKind = null,
  className,
  priority = false,
}: {
  kind?: ArHeroKind;
  swap?: boolean;
  lockKind?: ArHeroKind | null;
  className?: string;
  priority?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPaused(mq.matches);
    sync(); mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const rotating = swap && !kind;
  const [shown, setShown] = useState<ArHeroKind>(kind ?? lockKind ?? "food");

  useEffect(() => {
    if (kind) {
      setShown(kind);
      return;
    }
    if (lockKind) {
      setShown(lockKind);
      return;
    }
    if (!rotating) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setShown("food");
    }, SWAP_MS);
    return () => window.clearInterval(id);
  }, [kind, lockKind, rotating]);

  const showJewellery = kind === "jewellery" || lockKind === "jewellery";
  const showFood = !showJewellery || kind === "food" || rotating || lockKind === "food";
  const jewelleryOn = shown === "jewellery";
  const label = AR_HERO_STILLS[shown].alt;

  return (
    <div className="ar-hero-player" data-paused={paused}>
    <div className={cn("ar-hero-loop", className)} data-kind={shown} role="img" aria-label={label}>
      <div className="ar-hero-loop__stage">
        {showJewellery ? (
          <StillPlate kind="jewellery" paused={paused} active={jewelleryOn} priority={priority && jewelleryOn} />
        ) : null}
        {showFood ? <StillPlate kind="food" paused={paused} active={!jewelleryOn} priority={priority && !jewelleryOn} /> : null}
      </div>
    </div>
    <button type="button" className="hero-motion-control" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play aria-hidden="true"/> : <Pause aria-hidden="true"/>}{paused ? "Play animation" : "Pause animation"}</button>
    </div>
  );
}
