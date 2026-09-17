import { useEffect, useRef } from 'react';

interface ArcSegment {
  radius: number;
  start: number;
  length: number;
  width: number;
  speed: number;
  alpha: number;
}

interface Particle {
  radius: number;
  angle: number;
  speed: number;
  size: number;
  alpha: number;
  wobble: number;
}

interface Ring {
  segments: ArcSegment[];
  squash: number;
}

export default function ReactorOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const RING_RADII = [0.3, 0.42, 0.55, 0.68, 0.8, 0.93];
    const rings: Ring[] = RING_RADII.map((radius, ringIndex) => {
      const segments: ArcSegment[] = [];
      const count = 26 + Math.floor(rand() * 30);
      for (let i = 0; i < count; i++) {
        segments.push({
          radius,
          start: rand() * Math.PI * 2,
          length: 0.05 + rand() * 0.5,
          width: 0.6 + rand() * 1.8,
          speed: (ringIndex % 2 === 0 ? 1 : -1) * (0.05 + rand() * 0.22),
          alpha: 0.25 + rand() * 0.75,
        });
      }
      return { segments, squash: 0.82 + rand() * 0.14 };
    });

    const particles: Particle[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        radius: 0.2 + rand() * 0.76,
        angle: rand() * Math.PI * 2,
        speed: (rand() < 0.5 ? -1 : 1) * (0.08 + rand() * 0.5),
        size: 0.6 + rand() * 1.6,
        alpha: 0.3 + rand() * 0.7,
        wobble: rand() * Math.PI * 2,
      });
    }

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const t = now / 1000;
      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.46;
      ctx.clearRect(0, 0, width, height);

      const pulse = 0.9 + Math.sin(t * 1.4) * 0.08;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.48 * pulse);
      core.addColorStop(0, 'rgba(255, 238, 205, 0.95)');
      core.addColorStop(0.22, 'rgba(255, 195, 95, 0.55)');
      core.addColorStop(0.55, 'rgba(255, 145, 40, 0.18)');
      core.addColorStop(1, 'rgba(255, 120, 20, 0)');
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.35);
      ctx.strokeStyle = 'rgba(255, 224, 160, 0.85)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        ctx.arc(0, 0, R * (0.08 + s * 0.055), s * 2.1, s * 2.1 + 2.4);
        ctx.stroke();
      }
      ctx.restore();

      for (const ring of rings) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, ring.squash);
        for (const seg of ring.segments) {
          const angle = seg.start + t * seg.speed;
          const flicker = 0.72 + 0.28 * Math.sin(t * 6 + seg.start * 11);
          const light = 42 + seg.alpha * 26;
          ctx.beginPath();
          ctx.strokeStyle = `hsla(${26 + seg.alpha * 14}, 100%, ${light}%, ${seg.alpha * 0.8 * flicker})`;
          ctx.lineWidth = seg.width;
          ctx.arc(0, 0, seg.radius * R, angle, angle + seg.length);
          ctx.stroke();
        }
        ctx.restore();
      }

      for (const particle of particles) {
        const angle = particle.angle + t * particle.speed;
        const px = cx + Math.cos(angle) * particle.radius * R;
        const py = cy + Math.sin(angle) * particle.radius * R * 0.88;
        const twinkle = 0.55 + 0.45 * Math.sin(t * 3 + particle.wobble);
        ctx.beginPath();
        ctx.fillStyle = `hsla(32, 100%, ${58 + particle.alpha * 18}%, ${particle.alpha * twinkle})`;
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (reduceMotion) {
      draw(1600);
    } else {
      let raf = 0;
      const start = performance.now();
      const loop = (now: number) => {
        draw(now - start);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  return <canvas ref={canvasRef} className="orb-canvas" aria-hidden="true" />;
}
