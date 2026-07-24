import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface FlowerProps {
  x: string;
  y: string;
  scale?: number;
  delay: number;
}

export function Flower({ x, y, scale = 1, delay }: FlowerProps) {
  const swayRef = useRef<SVGGElement>(null);
  const stemLength = 250;
  const flowerId = useMemo(() => Math.random().toString(36).substring(7), []);

  useEffect(() => {
    if (!swayRef.current) return;
    const duration = 4 + Math.random() * 3;
    const offset = Math.random() * 2;
    
    const tween = gsap.to(swayRef.current, {
      rotation: -3 + Math.random() * 6,
      transformOrigin: '50% 300px',
      ease: 'sine.inOut',
      duration,
      yoyo: true,
      repeat: -1,
      delay: delay + 2 + offset,
    });
    
    return () => {
      tween.kill();
    };
  }, [delay]);

  const petalPath = "M50,50 C25,35 15,10 50,-5 C85,10 75,35 50,50 Z";

  return (
    <motion.div
      className="absolute bottom-0 will-change-transform z-10 pointer-events-none origin-bottom"
      style={{ left: x, bottom: y, scale }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay, duration: 0.5 }}
    >
      <svg
        width="100"
        height="300"
        viewBox="0 -20 100 320"
        className="overflow-visible"
      >
        <defs>
          <radialGradient id={`petal-grad-${flowerId}`} cx="50%" cy="100%" r="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="10%" stopColor="#ffb380" />
            <stop offset="40%" stopColor="#ff3333" />
            <stop offset="100%" stopColor="#800000" />
          </radialGradient>
          <radialGradient id={`center-glow-${flowerId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffe6cc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
          </radialGradient>
          <filter id={`blur-glow-${flowerId}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g ref={swayRef}>
          {/* Stem */}
          <motion.path
            d="M50 300 C45 200, 55 100, 50 50"
            stroke="#1d4e28"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: delay + 0.1, duration: 1.5, ease: "easeInOut" }}
          />

          {/* Leaves */}
          <motion.path
            d="M50 220 C20 200, -10 180, 10 150 C20 180, 40 200, 50 220 Z"
            fill="#143c1d"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 1.0, duration: 0.8 }}
            style={{ transformOrigin: '50px 220px' }}
          />
          <motion.path
            d="M50 180 C80 160, 110 140, 90 110 C80 140, 60 160, 50 180 Z"
            fill="#1d4e28"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 1.2, duration: 0.8 }}
            style={{ transformOrigin: '50px 180px' }}
          />

          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
            <motion.path
              key={`back-${i}`}
              d={petalPath}
              fill={`url(#petal-grad-${flowerId})`}
              initial={{ scale: 0, opacity: 0, rotate: rotation }}
              animate={{ scale: 0.9, opacity: 0.9, rotate: rotation }}
              transition={{ delay: delay + 1.5 + (i * 0.1), duration: 1, type: 'spring', bounce: 0.2 }}
              style={{ transformOrigin: '50px 50px' }}
            />
          ))}
          
          {[30, 100, 170, 240, 310].map((rotation, i) => (
            <motion.path
              key={`front-${i}`}
              d={petalPath}
              fill={`url(#petal-grad-${flowerId})`}
              initial={{ scale: 0, opacity: 0, rotate: rotation }}
              animate={{ scale: 0.75, opacity: 1, rotate: rotation }}
              transition={{ delay: delay + 2.0 + (i * 0.1), duration: 1, type: 'spring', bounce: 0.2 }}
              style={{ transformOrigin: '50px 50px' }}
            />
          ))}

          {/* Falling petal */}
          <motion.path
            d={petalPath}
            fill={`url(#petal-grad-${flowerId})`}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 0.6, 0.6, 0.6, 0], 
              opacity: [0, 1, 1, 0, 0], 
              x: [0, 10, -20, 30], 
              y: [0, 100, 200, 300],
              rotate: [0, 45, 120, 200]
            }}
            transition={{ 
              delay: delay + 6 + Math.random() * 10, 
              duration: 8 + Math.random() * 5, 
              repeat: Infinity,
              repeatDelay: 5 + Math.random() * 10,
              ease: "linear"
            }}
            style={{ transformOrigin: '50px 50px' }}
          />
          
          {/* Glowing Center */}
          <motion.circle
            cx="50"
            cy="50"
            r="8"
            fill={`url(#center-glow-${flowerId})`}
            filter={`url(#blur-glow-${flowerId})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 2.6, duration: 1 }}
          />
          
          {/* Sparkles around center */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={`sparkle-${i}`}
              cx={50 + (Math.random() * 20 - 10)}
              cy={50 + (Math.random() * 20 - 10)}
              r={0.5 + Math.random() * 1}
              fill="#ffffff"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{
                delay: delay + 3 + Math.random() * 2,
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}
