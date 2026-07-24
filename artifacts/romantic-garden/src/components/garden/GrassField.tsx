import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface GrassFieldProps {
  side: 'left' | 'right';
}

function GrassBlade({
  x,
  height,
  width,
  curve,
  delay,
  color,
}: {
  x: number;
  height: number;
  width: number;
  curve: number;
  delay: number;
  color: string;
}) {
  // Path: starts at base, curves to tip
  const d = `M ${x} 0 C ${x + curve * 0.3} ${-height * 0.4}, ${x + curve * 0.7} ${-height * 0.7}, ${x + curve} ${-height}`;

  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ delay: delay + 1.5, duration: 1.2, ease: 'easeOut' }}
    />
  );
}

export function GrassField({ side }: GrassFieldProps) {
  const blades = useMemo(() => {
    const count = 28;
    return Array.from({ length: count }).map((_, i) => {
      const spread = 240;
      const xBase = side === 'left' ? 20 + (i / count) * spread : 10 + (i / count) * spread;
      const height = 100 + Math.random() * 180;
      const curveMag = (Math.random() - 0.5) * 60;
      const width = 2 + Math.random() * 3;
      const delay = 1.8 + Math.random() * 1.2;
      // Color varies slightly for depth
      const lightness = 20 + Math.floor(Math.random() * 14);
      const color = `hsl(128, 48%, ${lightness}%)`;
      return { id: i, x: xBase, height, curve: curveMag, width, delay, color };
    });
  }, [side]);

  const svgWidth = 280;
  const svgHeight = 320;

  return (
    <div
      className="absolute bottom-0 pointer-events-none"
      style={
        side === 'left'
          ? { left: 0, right: 'auto' }
          : { right: 0, left: 'auto' }
      }
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 ${-svgHeight} ${svgWidth} ${svgHeight}`}
        style={side === 'right' ? { transform: 'scaleX(-1)' } : undefined}
      >
        {/* Sway wrapper */}
        <motion.g
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '140px 0px' }}
        >
          {blades.map((b) => (
            <GrassBlade key={b.id} {...b} />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
