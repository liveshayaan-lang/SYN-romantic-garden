import { motion } from 'framer-motion';
import { useState } from 'react';

interface MessageBubbleProps {
  text: string;
  x: string;
  y: string;
  delay: number;
}

export function MessageBubble({ text, x, y, delay }: MessageBubbleProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute -translate-x-1/2"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: 'easeOut' }}
    >
      {/* Gentle float loop */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.3 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div
          animate={
            hovered
              ? { y: -5, boxShadow: '0 0 18px 6px rgba(180,30,60,0.55)' }
              : { y: 0, boxShadow: '0 0 8px 2px rgba(120,15,35,0.35)' }
          }
          transition={{ duration: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, #4a0818 0%, #380612 100%)',
            border: '1px solid rgba(140,30,55,0.7)',
            borderRadius: '999px',
            padding: '7px 18px',
            whiteSpace: 'nowrap',
            cursor: 'default',
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '13px',
              fontWeight: 500,
              color: hovered ? '#ffffff' : 'rgba(255,220,230,0.92)',
              letterSpacing: '0.03em',
              transition: 'color 0.3s',
            }}
          >
            {text}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
