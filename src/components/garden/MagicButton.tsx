import React from 'react';

const WreathLeaf = ({ cx, cy, rot, scale = 1, delayNum = 0 }: { cx: number, cy: number, rot: number, scale?: number, delayNum?: number }) => (
  <g 
    style={{ 
      animation: `grow-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delayNum}s forwards`,
      transformOrigin: `${cx}px ${cy}px`,
      opacity: 0 
    }}
  >
    <path 
      d="M0,0 Q6,-10 15,0 Q6,10 0,0" 
      fill="#1a3b16" 
      transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`} 
    />
  </g>
);

const WreathFlower = ({ cx, cy, scale, delayNum = 0 }: { cx: number, cy: number, scale: number, delayNum?: number }) => (
  <g 
    style={{ 
      animation: `grow-pop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delayNum}s forwards, pulse-slow 3s infinite alternate ${delayNum}s`,
      transformOrigin: `${cx}px ${cy}px`,
      opacity: 0
    }}
  >
    <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
      <circle cx="0" cy="-4" r="3" fill="#ff5e6c" />
      <circle cx="3.8" cy="-1.2" r="3" fill="#ff5e6c" />
      <circle cx="2.3" cy="3.2" r="3" fill="#ff5e6c" />
      <circle cx="-2.3" cy="3.2" r="3" fill="#ff5e6c" />
      <circle cx="-3.8" cy="-1.2" r="3" fill="#ff5e6c" />
      <circle cx="0" cy="0" r="2.5" fill="#ff2a40" />
      <circle cx="0" cy="0" r="1.5" fill="#ffffff" opacity="0.8" />
    </g>
  </g>
);

export function MagicButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
      
      {/* Background ambient glow behind the button */}
      <div className="absolute w-[250px] h-[80px] bg-[#ff5e6c] rounded-[100px] blur-[50px] opacity-20 pointer-events-none animate-pulse-slow"></div>

      <button
        onClick={onClick}
        className="relative group flex items-center justify-center w-[300px] h-[100px] cursor-pointer bg-transparent border-none outline-none"
      >
        {/* Intricate Vine Wreath wrapping around the button */}
        <div className="absolute inset-0 pointer-events-none drop-shadow-[0_0_8px_rgba(255,94,108,0.3)]">
          <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
            {/* Top Vine */}
            <path 
              d="M 30,50 C 50,10 250,10 270,50" 
              fill="none" 
              stroke="#122610" 
              strokeWidth="2.5" 
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset="100"
              style={{ animation: 'draw-wreath 2s ease-out forwards' }}
            />
            {/* Bottom Vine */}
            <path 
              d="M 270,50 C 250,90 50,90 30,50" 
              fill="none" 
              stroke="#142b12" 
              strokeWidth="2.5"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset="100"
              style={{ animation: 'draw-wreath 2s ease-out 0.2s forwards' }}
            />

            {/* Leaves on Top Vine */}
            <WreathLeaf cx={70} cy={22} rot={-20} scale={1.2} delayNum={0.4} />
            <WreathLeaf cx={110} cy={14} rot={-10} scale={1} delayNum={0.6} />
            <WreathLeaf cx={150} cy={12} rot={5} scale={1.3} delayNum={0.8} />
            <WreathLeaf cx={190} cy={14} rot={20} scale={1} delayNum={1.0} />
            <WreathLeaf cx={230} cy={22} rot={40} scale={1.1} delayNum={1.2} />
            
            <WreathLeaf cx={55} cy={35} rot={-60} scale={0.9} delayNum={0.3} />
            <WreathLeaf cx={130} cy={13} rot={-150} scale={1} delayNum={0.7} />
            <WreathLeaf cx={170} cy={13} rot={160} scale={1.1} delayNum={0.9} />

            {/* Leaves on Bottom Vine */}
            <WreathLeaf cx={70} cy={78} rot={200} scale={1.2} delayNum={0.6} />
            <WreathLeaf cx={110} cy={86} rot={190} scale={1} delayNum={0.8} />
            <WreathLeaf cx={150} cy={88} rot={175} scale={1.3} delayNum={1.0} />
            <WreathLeaf cx={190} cy={86} rot={160} scale={1} delayNum={1.2} />
            <WreathLeaf cx={230} cy={78} rot={140} scale={1.1} delayNum={1.4} />
            
            <WreathLeaf cx={55} cy={65} rot={240} scale={0.9} delayNum={0.5} />
            <WreathLeaf cx={130} cy={87} rot={10} scale={1} delayNum={0.9} />
            <WreathLeaf cx={170} cy={87} rot={-20} scale={1.1} delayNum={1.1} />

            {/* Flowers on Wreath */}
            <WreathFlower cx={30} cy={50} scale={1.4} delayNum={1.5} />
            <WreathFlower cx={270} cy={50} scale={1.4} delayNum={1.7} />
            
            <WreathFlower cx={90} cy={16} scale={1.1} delayNum={1.0} />
            <WreathFlower cx={210} cy={18} scale={1.2} delayNum={1.4} />
            
            <WreathFlower cx={90} cy={84} scale={1.2} delayNum={1.2} />
            <WreathFlower cx={210} cy={82} scale={1.1} delayNum={1.6} />
            
            <WreathFlower cx={150} cy={12} scale={0.9} delayNum={1.8} />
            <WreathFlower cx={150} cy={88} scale={0.9} delayNum={2.0} />
          </svg>
        </div>

        {/* Inner Hover Glow */}
        <div className="absolute inset-8 bg-[#ff5e6c]/0 group-hover:bg-[#ff5e6c]/15 blur-2xl transition-all duration-700 rounded-full" />

        {/* Left Magical Sparkle (moves out slightly on hover) */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-4 text-[#ff5e6c]/60 group-hover:text-[#ff5e6c] transform group-hover:-translate-x-2 group-hover:rotate-180 transition-all duration-700 ease-out z-10 drop-shadow-[0_0_8px_rgba(255,94,108,0.8)]">
           <path fill="currentColor" d="M12,2C12,2 12,10 20,12C12,14 12,22 12,22C12,22 12,14 4,12C12,10 12,2 12,2Z"/>
        </svg>

        {/* Typography */}
        <span 
          className="font-serif tracking-[0.4em] ml-2 text-white/80 group-hover:text-white transition-all duration-700 text-xl md:text-2xl uppercase z-10" 
        >
          Enter
        </span>

        {/* Right Magical Sparkle (moves out slightly on hover) */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 ml-2 text-[#ff5e6c]/60 group-hover:text-[#ff5e6c] transform group-hover:translate-x-2 group-hover:-rotate-180 transition-all duration-700 ease-out z-10 drop-shadow-[0_0_8px_rgba(255,94,108,0.8)]">
           <path fill="currentColor" d="M12,2C12,2 12,10 20,12C12,14 12,22 12,22C12,22 12,14 4,12C12,10 12,2 12,2Z"/>
        </svg>
      </button>

      <style>{`
        @keyframes draw-wreath {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes grow-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse-slow {
          0% { opacity: 0.6; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1.05); }
        }
        .group:hover span {
          text-shadow: 0 0 10px rgba(255,94,108,1), 0 0 20px rgba(255,42,64,0.8);
        }
      `}</style>
    </div>
  );
}
