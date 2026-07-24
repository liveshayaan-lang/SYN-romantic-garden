import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FireflyProps {
  bounds: { w: number; h: number };
  delay: number;
}

export function Firefly({ bounds, delay }: FireflyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const startX = 80 + Math.random() * (bounds.w - 160);
    const startY = bounds.h * 0.15 + Math.random() * (bounds.h * 0.65);

    gsap.set(el, { x: startX, y: startY, opacity: 0 });

    // Drift path
    const drift = () => {
      const nx = Math.max(30, Math.min(bounds.w - 30, startX + (Math.random() - 0.5) * 340));
      const ny = Math.max(40, Math.min(bounds.h - 60, startY + (Math.random() - 0.5) * 240));
      gsap.to(el, {
        x: nx,
        y: ny,
        duration: 8 + Math.random() * 7,
        ease: 'sine.inOut',
        onComplete: drift,
      });
    };

    // Blink
    const blink = () => {
      const peak = 0.55 + Math.random() * 0.45;
      gsap.to(el, {
        opacity: peak,
        duration: 0.9 + Math.random() * 0.8,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.set(el, { opacity: 0.05 + Math.random() * 0.15 });
          gsap.delayedCall(0.5 + Math.random() * 2.5, blink);
        },
      });
    };

    const t = gsap.delayedCall(delay, () => {
      gsap.to(el, { opacity: 0.6, duration: 1 });
      drift();
      gsap.delayedCall(1.5, blink);
    });

    return () => {
      t.kill();
      gsap.killTweensOf(el);
    };
  }, [bounds, delay]);

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none rounded-full will-change-transform"
      style={{
        width: 5,
        height: 5,
        background: '#fffbe8',
        boxShadow: '0 0 7px 3px rgba(255,230,100,0.7)',
        opacity: 0,
        zIndex: 30,
      }}
    />
  );
}
