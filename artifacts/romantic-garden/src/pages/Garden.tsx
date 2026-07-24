import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FlowerBouquet } from '@/components/garden/FlowerBouquet';
import { GrassField } from '@/components/garden/GrassField';
import { MessageBubble } from '@/components/garden/MessageBubble';
import { ParticleField } from '@/components/garden/ParticleField';
import { Firefly } from '@/components/garden/Firefly';

const MESSAGES = [
  { id: 0, text: 'You are my favorite person', x: '7%', y: '28%', delay: 7.5 },
  { id: 1, text: "I'm lucky to have you", x: '63%', y: '26%', delay: 8.2 },
  { id: 2, text: 'You make my world brighter', x: '4%', y: '57%', delay: 8.8 },
  { id: 3, text: 'Every flower reminds me of you', x: '60%', y: '57%', delay: 9.4 },
  { id: 4, text: 'Forever grateful for you', x: '30%', y: '83%', delay: 10.0 },
];

const FIREFLY_COUNT = 18;

export default function Garden() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [bounds, setBounds] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const update = () => setBounds({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX / bounds.w, y: e.clientY / bounds.h });
  };

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden select-none"
      style={{
        background:
          'radial-gradient(ellipse at 55% 65%, #2d0813 0%, #160408 45%, #000000 100%)',
        cursor: 'default',
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Ambient cursor light */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(160,25,45,0.13) 0%, transparent 42%)`,
          transition: 'background 1s ease-out',
        }}
      />

      {/* Canvas particles — sparkles + pollen */}
      <ParticleField />

      {/* Fireflies */}
      {Array.from({ length: FIREFLY_COUNT }).map((_, i) => (
        <Firefly key={i} bounds={bounds} delay={6.5 + i * 0.3} />
      ))}

      {/* Parallax scene */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: (0.5 - mousePos.x) * 14,
          y: (0.5 - mousePos.y) * 9,
        }}
        transition={{ type: 'spring', stiffness: 28, damping: 24 }}
      >
        {/* Grass left */}
        <GrassField side="left" />
        {/* Grass right */}
        <GrassField side="right" />

        {/* Main flower bouquet — center-left anchor */}
        <div
          className="absolute bottom-0"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          <FlowerBouquet mouseX={mousePos.x} />
        </div>

        {/* Message bubbles */}
        {MESSAGES.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            x={m.x}
            y={m.y}
            delay={m.delay}
          />
        ))}
      </motion.div>
    </div>
  );
}
