import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HEART_SVG = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Generate 30 floating hearts with random properties
    const newHearts: Heart[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      size: Math.random() * 20 + 10, // 10px to 30px
      duration: Math.random() * 8 + 8, // 8s to 16s float time
      delay: Math.random() * 5, // 0 to 5s delay
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5 opacity
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0"
          style={{ left: `${heart.x}%` }}
          initial={{ y: '100%', opacity: 0, scale: 0.5 }}
          animate={{
            y: '-120vh',
            opacity: [0, heart.opacity, heart.opacity, 0],
            scale: [0.5, 1, 1, 0.5],
            rotate: [0, -20, 20, -10, 0] // gentle sway
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="rgba(255, 94, 108, 0.8)"
            style={{ filter: 'drop-shadow(0 0 5px rgba(255,94,108,0.5))' }}
          >
            <path d={HEART_SVG} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
