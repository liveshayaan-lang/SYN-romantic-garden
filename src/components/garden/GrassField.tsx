import { motion } from 'framer-motion';

interface GrassFieldProps {
  side: 'left' | 'right';
  isStorming?: boolean;
}

const TaperedLeaf = ({
  startX,
  height,
  curve,
  width,
  color,
  delay,
  isStorming,
  stormDelay,
  isLeft
}: {
  startX: number;
  height: number;
  curve: number;
  width: number;
  color: string;
  delay: number;
  isStorming?: boolean;
  stormDelay: number;
  isLeft: boolean;
}) => {
  const d = `
    M ${startX - width} 250 
    C ${startX - width + curve * 0.4} ${250 - height * 0.4} 
      ${startX + curve * 0.8} ${250 - height * 0.8} 
      ${startX + curve} ${250 - height} 
    C ${startX + curve * 0.6} ${250 - height * 0.8} 
      ${startX + width + curve * 0.4} ${250 - height * 0.4} 
      ${startX + width} 250 
    Z
  `;

  // If right grass (isLeft=false), SVG is scaledX(-1). 
  // To fly left on screen, we must move right in SVG coords.
  const stormX = isLeft ? -1500 - Math.random() * 500 : 1500 + Math.random() * 500;
  const stormRotate = isLeft ? -45 - Math.random() * 45 : 45 + Math.random() * 45;

  return (
    <motion.path
      d={d}
      fill={color}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={isStorming ? {
        x: stormX,
        y: -100 - Math.random() * 200,
        rotate: stormRotate,
        opacity: 0,
        transition: { duration: 1.2 + Math.random() * 0.8, delay: stormDelay, ease: "easeIn" }
      } : { 
        scaleY: 1, 
        opacity: 1,
        transition: { duration: 2.5, delay, ease: [0.175, 0.885, 0.32, 1.1] }
      }}
      style={{ transformOrigin: '250px 250px' }}
    />
  );
};

export function GrassField({ side, isStorming }: GrassFieldProps) {
  const isLeft = side === 'left';
  const svgWidth = 450;
  const svgHeight = 280;

  const cDark = '#0d2b12';
  const cMid = '#17471f';
  const cLight = '#236e2f';
  const cAccent = '#329c44';

  const stormSporeX = isLeft ? -1500 : 1500;

  return (
    <div
      className="absolute bottom-0 pointer-events-none z-10"
      style={isLeft ? { left: '-30px', right: 'auto' } : { right: '-30px', left: 'auto' }}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{
          transform: isLeft ? 'none' : 'scaleX(-1)',
          filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.8)) drop-shadow(0px -5px 15px rgba(22,46,21,0.5))',
        }}
        className={`overflow-visible max-md:scale-[0.35] max-md:origin-bottom-${isLeft ? 'left' : 'right'} transition-transform`}
      >
        <defs>
          <linearGradient id="baseGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="#020406" />
          </linearGradient>
        </defs>

        <motion.g
          animate={isStorming ? {} : { rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'bottom left' }}
        >
          {/* Deep Background layer - Extra density */}
          <TaperedLeaf startX={0} height={250} curve={90} width={15} color={cDark} delay={0.4} isStorming={isStorming} stormDelay={0.05} isLeft={isLeft} />
          <TaperedLeaf startX={30} height={230} curve={60} width={13} color={cDark} delay={0.6} isStorming={isStorming} stormDelay={0.15} isLeft={isLeft} />
          <TaperedLeaf startX={70} height={260} curve={130} width={16} color={cDark} delay={0.8} isStorming={isStorming} stormDelay={0.25} isLeft={isLeft} />
          <TaperedLeaf startX={110} height={210} curve={100} width={14} color={cDark} delay={1.0} isStorming={isStorming} stormDelay={0.35} isLeft={isLeft} />
          <TaperedLeaf startX={150} height={240} curve={150} width={15} color={cDark} delay={1.2} isStorming={isStorming} stormDelay={0.45} isLeft={isLeft} />
          <TaperedLeaf startX={190} height={220} curve={120} width={14} color={cDark} delay={1.4} isStorming={isStorming} stormDelay={0.55} isLeft={isLeft} />
          <TaperedLeaf startX={230} height={250} curve={170} width={15} color={cDark} delay={1.6} isStorming={isStorming} stormDelay={0.65} isLeft={isLeft} />
          <TaperedLeaf startX={270} height={200} curve={140} width={13} color={cDark} delay={1.8} isStorming={isStorming} stormDelay={0.75} isLeft={isLeft} />

          {/* Mid layer - Denser */}
          <TaperedLeaf startX={10} height={190} curve={50} width={12} color={cMid} delay={0.7} isStorming={isStorming} stormDelay={0.1} isLeft={isLeft} />
          <TaperedLeaf startX={50} height={200} curve={80} width={13} color={cMid} delay={0.9} isStorming={isStorming} stormDelay={0.2} isLeft={isLeft} />
          <TaperedLeaf startX={90} height={170} curve={70} width={11} color={cMid} delay={1.1} isStorming={isStorming} stormDelay={0.3} isLeft={isLeft} />
          <TaperedLeaf startX={130} height={180} curve={110} width={12} color={cMid} delay={1.3} isStorming={isStorming} stormDelay={0.4} isLeft={isLeft} />
          <TaperedLeaf startX={170} height={160} curve={120} width={11} color={cMid} delay={1.5} isStorming={isStorming} stormDelay={0.5} isLeft={isLeft} />
          <TaperedLeaf startX={210} height={190} curve={140} width={12} color={cMid} delay={1.7} isStorming={isStorming} stormDelay={0.6} isLeft={isLeft} />
          <TaperedLeaf startX={250} height={170} curve={130} width={10} color={cMid} delay={1.9} isStorming={isStorming} stormDelay={0.7} isLeft={isLeft} />
          <TaperedLeaf startX={300} height={150} curve={150} width={11} color={cMid} delay={2.1} isStorming={isStorming} stormDelay={0.8} isLeft={isLeft} />

          {/* Foreground layer - Lush and thick */}
          <TaperedLeaf startX={5} height={140} curve={-10} width={10} color={cLight} delay={1.0} isStorming={isStorming} stormDelay={0.15} isLeft={isLeft} />
          <TaperedLeaf startX={35} height={120} curve={40} width={11} color={cLight} delay={1.2} isStorming={isStorming} stormDelay={0.25} isLeft={isLeft} />
          <TaperedLeaf startX={75} height={150} curve={60} width={10} color={cLight} delay={1.4} isStorming={isStorming} stormDelay={0.35} isLeft={isLeft} />
          <TaperedLeaf startX={115} height={110} curve={70} width={9} color={cLight} delay={1.6} isStorming={isStorming} stormDelay={0.45} isLeft={isLeft} />
          <TaperedLeaf startX={155} height={130} curve={90} width={10} color={cLight} delay={1.8} isStorming={isStorming} stormDelay={0.55} isLeft={isLeft} />
          <TaperedLeaf startX={195} height={110} curve={100} width={8} color={cLight} delay={2.0} isStorming={isStorming} stormDelay={0.65} isLeft={isLeft} />
          <TaperedLeaf startX={235} height={140} curve={110} width={10} color={cLight} delay={2.2} isStorming={isStorming} stormDelay={0.75} isLeft={isLeft} />
          <TaperedLeaf startX={285} height={100} curve={120} width={9} color={cLight} delay={2.4} isStorming={isStorming} stormDelay={0.85} isLeft={isLeft} />

          {/* Accent small leaves - Extra highlights */}
          <TaperedLeaf startX={15} height={90} curve={50} width={8} color={cAccent} delay={1.3} isStorming={isStorming} stormDelay={0.2} isLeft={isLeft} />
          <TaperedLeaf startX={55} height={80} curve={-10} width={7} color={cAccent} delay={1.5} isStorming={isStorming} stormDelay={0.3} isLeft={isLeft} />
          <TaperedLeaf startX={95} height={100} curve={80} width={9} color={cAccent} delay={1.7} isStorming={isStorming} stormDelay={0.4} isLeft={isLeft} />
          <TaperedLeaf startX={135} height={70} curve={50} width={7} color={cAccent} delay={1.9} isStorming={isStorming} stormDelay={0.5} isLeft={isLeft} />
          <TaperedLeaf startX={175} height={90} curve={70} width={8} color={cAccent} delay={2.1} isStorming={isStorming} stormDelay={0.6} isLeft={isLeft} />
          <TaperedLeaf startX={215} height={80} curve={90} width={7} color={cAccent} delay={2.3} isStorming={isStorming} stormDelay={0.7} isLeft={isLeft} />
          <TaperedLeaf startX={265} height={70} curve={80} width={6} color={cAccent} delay={2.5} isStorming={isStorming} stormDelay={0.8} isLeft={isLeft} />
          <TaperedLeaf startX={315} height={60} curve={100} width={6} color={cAccent} delay={2.7} isStorming={isStorming} stormDelay={0.9} isLeft={isLeft} />

          {/* Magical Pink Spores - More of them */}
          {[
            { cx: 80, cy: 30, r: 3.5, fill: '#ff5e6c', delay: 2.0, sd: 0.1 },
            { cx: 200, cy: 50, r: 3, fill: '#ff5e6c', delay: 2.2, sd: 0.3 },
            { cx: 50, cy: 100, r: 2.5, fill: '#ff2a40', delay: 2.4, sd: 0.2 },
            { cx: 130, cy: 120, r: 3.5, fill: '#ff5e6c', delay: 2.6, sd: 0.5 },
            { cx: 270, cy: 140, r: 2.5, fill: '#ff5e6c', delay: 2.8, sd: 0.4 },
            { cx: 160, cy: 60, r: 2, fill: '#ff2a40', delay: 2.3, sd: 0.25 },
            { cx: 240, cy: 90, r: 3, fill: '#ff5e6c', delay: 2.7, sd: 0.45 },
            { cx: 330, cy: 170, r: 2.5, fill: '#ff5e6c', delay: 2.9, sd: 0.55 },
          ].map((sp, i) => (
            <motion.circle
              key={i}
              cx={sp.cx} cy={sp.cy} r={sp.r} fill={sp.fill}
              style={{ filter: 'drop-shadow(0 0 6px #ff5e6c)' }}
              initial={{ scale: 0 }}
              animate={isStorming ? {
                x: stormSporeX, opacity: 0,
                transition: { duration: 0.8, delay: sp.sd, ease: 'easeIn' }
              } : { 
                scale: [0, 1, 1.2, 1],
                opacity: [0, 1, 0.8, 1],
                transition: { duration: 1.5, delay: sp.delay, repeat: Infinity, repeatType: 'reverse' }
              }}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
