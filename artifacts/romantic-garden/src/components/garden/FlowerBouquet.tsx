import { motion } from 'framer-motion';
import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface FlowerBouquetProps {
  mouseX?: number;
}

// --- Leaf shapes (teal, large, behind flowers) ---
function Leaf({
  d,
  color,
  delay,
  uid,
}: {
  d: string;
  color: string;
  delay: number;
  uid: string;
}) {
  return (
    <motion.path
      d={d}
      fill={color}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.9, type: 'spring', bounce: 0.25 }}
      style={{ transformOrigin: 'center bottom' }}
    />
  );
}

// --- Single flower head (5 petals as pre-computed circles + glowing center) ---
function FlowerHead({
  cx,
  cy,
  size,
  delay,
  uid,
}: {
  cx: number;
  cy: number;
  size: number;
  delay: number;
  uid: string;
}) {
  // Pre-compute petal centers — 5 evenly spaced, starting from top
  const petalDist = size * 0.68;
  const petalR = size * 0.62;
  const petals = [0, 72, 144, 216, 288].map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      px: Math.cos(rad) * petalDist,
      py: Math.sin(rad) * petalDist,
    };
  });

  return (
    <g transform={`translate(${cx},${cy})`}>
      <defs>
        <radialGradient id={`pg-${uid}`} cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ff9070" />
          <stop offset="45%" stopColor="#e82a18" />
          <stop offset="100%" stopColor="#7a0808" />
        </radialGradient>
        <radialGradient id={`cg-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="50%" stopColor="#fffbe0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd080" stopOpacity="0" />
        </radialGradient>
        <filter id={`glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 5 Petals — circles at pre-computed positions, scale from their own center */}
      {petals.map(({ px, py }, i) => (
        <motion.circle
          key={i}
          cx={px}
          cy={py}
          r={petalR}
          fill={`url(#pg-${uid})`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: delay + i * 0.1,
            duration: 0.6,
            type: 'spring',
            bounce: 0.3,
          }}
          style={{ transformOrigin: `${px}px ${py}px` }}
        />
      ))}

      {/* Center glow halo */}
      <motion.circle
        cx={0}
        cy={0}
        r={size * 0.55}
        fill={`url(#cg-${uid})`}
        filter={`url(#glow-${uid})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.55, duration: 0.5 }}
        style={{ transformOrigin: '0px 0px' }}
      />
      {/* Center bright white dot */}
      <motion.circle
        cx={0}
        cy={0}
        r={size * 0.28}
        fill="#ffffff"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.65, duration: 0.4 }}
        style={{ transformOrigin: '0px 0px' }}
      />
      {/* Twinkling sparkles above the flower */}
      {[0, 1, 2, 3].map((i) => {
        const sparkRad = ((i * 90 - 45) * Math.PI) / 180;
        const sx = Math.cos(sparkRad) * size * 1.2;
        const sy = Math.sin(sparkRad) * size * 1.2;
        return (
          <motion.circle
            key={`sp-${i}`}
            cx={sx}
            cy={sy}
            r={1.8}
            fill="#ffd080"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{
              delay: delay + 1.0 + i * 0.2,
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 2 + i * 0.6,
            }}
            style={{ transformOrigin: `${sx}px ${sy}px` }}
          />
        );
      })}
    </g>
  );
}

// --- Stem ---
function Stem({
  d,
  delay,
}: {
  d: string;
  delay: number;
}) {
  return (
    <motion.path
      d={d}
      stroke="#1d5c2a"
      strokeWidth={3.5}
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay, duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
    />
  );
}

// --- Full bouquet ---
export function FlowerBouquet({ mouseX = 0.5 }: FlowerBouquetProps) {
  const swayRef = useRef<SVGGElement>(null);

  // Sway with GSAP
  useEffect(() => {
    if (!swayRef.current) return;
    const tween = gsap.to(swayRef.current, {
      rotation: -2.5,
      transformOrigin: '160px 490px',
      ease: 'sine.inOut',
      duration: 3.8,
      yoyo: true,
      repeat: -1,
      delay: 7,
    });
    return () => { tween.kill(); };
  }, []);

  // Slight mouse lean on the whole bouquet
  const leanDeg = (mouseX - 0.5) * 3.5;

  // All flowers: { cx, cy, size, stemD, delay }
  const flowers = [
    {
      cx: 72,
      cy: 72,
      size: 24,
      stemD: 'M 158 490 C 148 390, 105 260, 72 72',
      delay: 3.4,
    },
    {
      cx: 120,
      cy: 22,
      size: 28,
      stemD: 'M 160 490 C 152 370, 132 200, 120 22',
      delay: 4.0,
    },
    {
      cx: 162,
      cy: 2,
      size: 33,
      stemD: 'M 162 490 C 162 350, 162 180, 162 2',
      delay: 4.6,
    },
    {
      cx: 206,
      cy: 26,
      size: 28,
      stemD: 'M 164 490 C 172 370, 190 200, 206 26',
      delay: 5.2,
    },
    {
      cx: 250,
      cy: 76,
      size: 24,
      stemD: 'M 166 490 C 178 390, 218 260, 250 76',
      delay: 5.8,
    },
  ];

  // Large broad teal leaves — ovate shapes matching reference
  const leaves = [
    // Far left large leaf (broad ovate, pointing upper-left)
    {
      d: 'M 150 375 C 100 345, 30 295, 5 215 C 30 230, 90 280, 150 375 Z',
      color: '#1a9272',
      delay: 2.8,
    },
    // Left mid leaf (broad, slightly upward)
    {
      d: 'M 148 325 C 108 298, 50 265, 32 188 C 62 208, 110 255, 148 325 Z',
      color: '#18a87e',
      delay: 3.0,
    },
    // Left angled leaf (going lower-left)
    {
      d: 'M 148 410 C 105 405, 48 405, 15 392 C 50 385, 105 390, 148 410 Z',
      color: '#138268',
      delay: 2.9,
    },
    // Right large leaf (broad, pointing upper-right)
    {
      d: 'M 170 370 C 222 338, 292 288, 318 208 C 293 225, 224 272, 170 370 Z',
      color: '#1a9272',
      delay: 3.1,
    },
    // Right mid leaf
    {
      d: 'M 172 318 C 215 290, 272 255, 292 178 C 263 198, 212 248, 172 318 Z',
      color: '#18a87e',
      delay: 3.3,
    },
    // Right angled leaf (going lower-right)
    {
      d: 'M 172 408 C 215 402, 272 400, 308 388 C 272 380, 215 385, 172 408 Z',
      color: '#138268',
      delay: 3.0,
    },
    // Wide left background leaf (big, splaying leftward)
    {
      d: 'M 152 350 C 100 330, 20 310, -20 270 C 10 268, 90 295, 152 350 Z',
      color: '#0f7860',
      delay: 2.6,
    },
    // Wide right background leaf
    {
      d: 'M 168 348 C 222 326, 304 306, 345 265 C 312 264, 224 292, 168 348 Z',
      color: '#0f7860',
      delay: 2.7,
    },
    // Center lower base leaf (fanning down)
    {
      d: 'M 150 440 C 115 448, 65 460, 30 458 C 65 448, 112 438, 150 440 Z',
      color: '#0d6850',
      delay: 2.5,
    },
    {
      d: 'M 170 438 C 207 446, 258 457, 294 455 C 258 445, 206 435, 170 438 Z',
      color: '#0d6850',
      delay: 2.5,
    },
  ];

  return (
    <motion.div
      style={{
        display: 'block',
        transformOrigin: 'center bottom',
      }}
      animate={{ rotate: leanDeg }}
      transition={{ type: 'spring', stiffness: 25, damping: 20 }}
    >
      <svg
        width={324}
        height={492}
        viewBox="0 0 324 492"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <g ref={swayRef}>
          {/* Leaves — behind everything */}
          {leaves.map((l, i) => (
            <Leaf key={i} d={l.d} color={l.color} delay={l.delay} uid={`lf-${i}`} />
          ))}

          {/* Stems */}
          {flowers.map((f, i) => (
            <Stem key={i} d={f.stemD} delay={f.delay - 0.8} />
          ))}

          {/* Flower heads — on top */}
          {flowers.map((f, i) => (
            <FlowerHead
              key={i}
              cx={f.cx}
              cy={f.cy}
              size={f.size}
              delay={f.delay}
              uid={`fh-${i}`}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}
