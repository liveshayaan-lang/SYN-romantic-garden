import React from 'react';
import { motion } from 'framer-motion';

const Flower = ({ cx, cy, scale, delayNum, isStorming, stormDelay, isLeft }: { cx: number, cy: number, scale: number, delayNum: number, isStorming?: boolean, stormDelay: number, isLeft: boolean }) => {
  const stormX = isLeft ? -1500 : 1500;
  return (
    <motion.g 
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={isStorming ? {
        x: stormX, y: -200, rotate: isLeft ? -180 : 180, opacity: 0,
        transition: { duration: 1.5, delay: stormDelay, ease: "easeIn" }
      } : {
        scale: 1, opacity: 1,
        transition: { duration: 0.8, delay: delayNum, ease: [0.175, 0.885, 0.32, 1.275] }
      }}
    >
      <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        <circle cx="0" cy="-6" r="5" fill="#ff5e6c" />
        <circle cx="5.7" cy="-1.8" r="5" fill="#ff5e6c" />
        <circle cx="3.5" cy="4.8" r="5" fill="#ff5e6c" />
        <circle cx="-3.5" cy="4.8" r="5" fill="#ff5e6c" />
        <circle cx="-5.7" cy="-1.8" r="5" fill="#ff5e6c" />
        <circle cx="0" cy="0" r="4" fill="#ff2a40" />
        <circle cx="0" cy="0" r="2" fill="#ffffff" opacity="0.8" />
      </g>
    </motion.g>
  );
};

const Leaf = ({ cx, cy, rot, scale = 1, delayNum, isStorming, stormDelay, isLeft }: { cx: number, cy: number, rot: number, scale?: number, delayNum: number, isStorming?: boolean, stormDelay: number, isLeft: boolean }) => {
  const stormX = isLeft ? -1500 : 1500;
  return (
    <motion.g 
      style={{ transformOrigin: `${cx}px ${cy}px` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={isStorming ? {
        x: stormX, y: -150, rotate: isLeft ? -90 : 90, opacity: 0,
        transition: { duration: 1.2, delay: stormDelay, ease: "easeIn" }
      } : {
        scale: 1, opacity: 1,
        transition: { duration: 0.6, delay: delayNum, ease: [0.175, 0.885, 0.32, 1.275] }
      }}
    >
      <path 
        d="M0,0 Q10,-15 25,0 Q10,15 0,0" 
        fill="#162e15" 
        transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`} 
      />
    </motion.g>
  );
};

const Stem = ({ d, stroke, width, delayNum, isStorming, stormDelay, isLeft }: { d: string, stroke: string, width: number, delayNum: number, isStorming?: boolean, stormDelay: number, isLeft: boolean }) => {
  const stormX = isLeft ? -1500 : 1500;
  return (
    <motion.path 
      d={d} 
      fill="none" 
      stroke={stroke} 
      strokeWidth={width} 
      style={{ transformOrigin: 'top left' }}
      initial={{ pathLength: 0 }}
      animate={isStorming ? {
        x: stormX, rotate: isLeft ? -45 : 45, opacity: 0,
        transition: { duration: 1.5, delay: stormDelay, ease: "easeIn" }
      } : {
        pathLength: 1,
        transition: { duration: 2.5, delay: delayNum, ease: "easeOut" }
      }}
    />
  );
};

const VineBranch = ({ side, isStorming }: { side: 'left' | 'right', isStorming?: boolean }) => {
  const isLeft = side === 'left';
  
  return (
    <div 
      className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} w-28 md:w-80 h-28 md:h-80 pointer-events-none z-20 max-md:-top-4 max-md:${isLeft ? '-left-4' : '-right-4'}`}
      style={{ 
        transform: isLeft ? '' : 'scaleX(-1)', 
        transformOrigin: 'center', 
        filter: 'drop-shadow(0px 10px 20px rgba(255,94,108,0.4))'
      }}
    >
      <motion.svg 
        viewBox="0 0 300 300" 
        className="w-full h-full overflow-visible"
        animate={isStorming ? {} : { rotate: [-2, 3, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top left' }}
      >
        
        {/* Stems */}
        <Stem d="M -10,-10 Q 30,20 15,60 T 40,130 T 60,190 T 120,280" stroke="#122610" width={4} delayNum={0} isStorming={isStorming} stormDelay={0.4} isLeft={isLeft} />
        <Stem d="M -10,-10 Q 50,10 40,50 T 110,90 T 190,100 T 280,120" stroke="#183315" width={3} delayNum={0.2} isStorming={isStorming} stormDelay={0.5} isLeft={isLeft} />
        <Stem d="M -10,-10 Q 40,40 30,80 T 90,130 T 140,180 T 200,200" stroke="#0a1409" width={2.5} delayNum={0.4} isStorming={isStorming} stormDelay={0.6} isLeft={isLeft} />
        <Stem d="M -10,-10 Q 20,50 10,90 T 50,140 T 60,190 T 80,220" stroke="#142b12" width={2} delayNum={0.6} isStorming={isStorming} stormDelay={0.7} isLeft={isLeft} />

        {/* Leaves */}
        <Leaf cx={12} cy={60} rot={20} scale={1.2} delayNum={0.5} isStorming={isStorming} stormDelay={0.1} isLeft={isLeft} />
        <Leaf cx={35} cy={135} rot={-10} scale={1} delayNum={1.0} isStorming={isStorming} stormDelay={0.2} isLeft={isLeft} />
        <Leaf cx={65} cy={200} rot={35} scale={1.4} delayNum={1.5} isStorming={isStorming} stormDelay={0.15} isLeft={isLeft} />
        <Leaf cx={100} cy={260} rot={120} scale={0.9} delayNum={2.0} isStorming={isStorming} stormDelay={0.25} isLeft={isLeft} />
        
        <Leaf cx={45} cy={25} rot={110} scale={1.2} delayNum={0.6} isStorming={isStorming} stormDelay={0.1} isLeft={isLeft} />
        <Leaf cx={120} cy={65} rot={80} scale={1.1} delayNum={1.2} isStorming={isStorming} stormDelay={0.3} isLeft={isLeft} />
        <Leaf cx={200} cy={85} rot={135} scale={1.3} delayNum={1.8} isStorming={isStorming} stormDelay={0.2} isLeft={isLeft} />
        <Leaf cx={260} cy={110} rot={45} scale={0.9} delayNum={2.2} isStorming={isStorming} stormDelay={0.35} isLeft={isLeft} />

        <Leaf cx={35} cy={60} rot={45} scale={0.8} delayNum={0.8} isStorming={isStorming} stormDelay={0.15} isLeft={isLeft} />
        <Leaf cx={95} cy={125} rot={60} scale={1.2} delayNum={1.4} isStorming={isStorming} stormDelay={0.25} isLeft={isLeft} />
        <Leaf cx={150} cy={175} rot={15} scale={1} delayNum={2.1} isStorming={isStorming} stormDelay={0.3} isLeft={isLeft} />
        <Leaf cx={45} cy={120} rot={160} scale={1.1} delayNum={1.6} isStorming={isStorming} stormDelay={0.2} isLeft={isLeft} />
        <Leaf cx={70} cy={200} rot={-30} scale={1.3} delayNum={2.4} isStorming={isStorming} stormDelay={0.4} isLeft={isLeft} />

        {/* Flowers */}
        <Flower cx={20} cy={45} scale={1.2} delayNum={0.9} isStorming={isStorming} stormDelay={0.05} isLeft={isLeft} />
        <Flower cx={45} cy={130} scale={1.4} delayNum={1.4} isStorming={isStorming} stormDelay={0.15} isLeft={isLeft} />
        <Flower cx={65} cy={200} scale={0.9} delayNum={2.0} isStorming={isStorming} stormDelay={0.1} isLeft={isLeft} />
        <Flower cx={120} cy={280} scale={1.3} delayNum={2.6} isStorming={isStorming} stormDelay={0.2} isLeft={isLeft} />

        <Flower cx={35} cy={15} scale={1.1} delayNum={1.1} isStorming={isStorming} stormDelay={0.05} isLeft={isLeft} />
        <Flower cx={110} cy={80} scale={1.5} delayNum={1.7} isStorming={isStorming} stormDelay={0.25} isLeft={isLeft} />
        <Flower cx={200} cy={100} scale={1} delayNum={2.2} isStorming={isStorming} stormDelay={0.15} isLeft={isLeft} />
        <Flower cx={280} cy={120} scale={1.2} delayNum={2.7} isStorming={isStorming} stormDelay={0.3} isLeft={isLeft} />

        <Flower cx={80} cy={80} scale={1.4} delayNum={1.5} isStorming={isStorming} stormDelay={0.1} isLeft={isLeft} />
        <Flower cx={130} cy={150} scale={1.2} delayNum={2.1} isStorming={isStorming} stormDelay={0.2} isLeft={isLeft} />
        <Flower cx={195} cy={200} scale={0.8} delayNum={2.5} isStorming={isStorming} stormDelay={0.35} isLeft={isLeft} />
        
        <Flower cx={50} cy={160} scale={1} delayNum={1.8} isStorming={isStorming} stormDelay={0.15} isLeft={isLeft} />
        <Flower cx={90} cy={230} scale={1.1} delayNum={2.3} isStorming={isStorming} stormDelay={0.25} isLeft={isLeft} />
        <Flower cx={150} cy={100} scale={0.9} delayNum={1.9} isStorming={isStorming} stormDelay={0.1} isLeft={isLeft} />

      </motion.svg>
    </div>
  );
};

export function HangingVines({ isStorming }: { isStorming?: boolean }) {
  return (
    <>
      <VineBranch side="left" isStorming={isStorming} />
      <VineBranch side="right" isStorming={isStorming} />
    </>
  );
}
