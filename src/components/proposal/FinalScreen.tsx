import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; r: number; a: number; v: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * Math.PI * 2,
        v: Math.random() * 0.02 + 0.005
      });
    }

    const shootingStars: { x: number; y: number; l: number; v: number; angle: number; opacity: number; color: string }[] = [];

    const spawnShootingStar = () => {
      // Allow shooting stars from multiple angles
      const angle = Math.random() * Math.PI * 2;
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: Math.random() * 100 + 50,
        v: Math.random() * 20 + 10,
        angle: angle,
        opacity: 1,
        color: Math.random() > 0.5 ? '255, 255, 255' : '0, 255, 255'
      });
      setTimeout(spawnShootingStar, Math.random() * 2000 + 1000);
    };
    setTimeout(spawnShootingStar, 1000);
    setTimeout(spawnShootingStar, 2500);

    let animationFrameId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Draw normal stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.a += s.v;
        const opacity = Math.abs(Math.sin(s.a));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle) * s.l, s.y - Math.sin(s.angle) * s.l);
        gradient.addColorStop(0, `rgba(${s.color}, ${s.opacity})`);
        gradient.addColorStop(1, `rgba(${s.color}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.l, s.y - Math.sin(s.angle) * s.l);
        ctx.stroke();

        s.x += Math.cos(s.angle) * s.v;
        s.y += Math.sin(s.angle) * s.v;
        s.opacity -= 0.015;

        if (s.opacity <= 0 || s.x > width * 1.5 || s.y > height * 1.5 || s.x < -width/2 || s.y < -height/2) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width < 768;
    const fontSize = isMobile ? 35 : 80;
    const textHeight = isMobile ? 40 : 100;
    const text = "Thanks for Visiting";
    
    // Use an offscreen canvas to extract pixel data
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.font = `bold ${fontSize}px serif`;
    const textMetrics = offCtx.measureText(text);
    const textWidth = Math.ceil(textMetrics.width);
    
    offCanvas.width = textWidth;
    offCanvas.height = textHeight;
    offCtx.font = `bold ${fontSize}px serif`;
    offCtx.fillStyle = 'white';
    offCtx.textBaseline = 'top';
    offCtx.fillText(text, 0, 0);

    const imageData = offCtx.getImageData(0, 0, textWidth, textHeight).data;
    const particles: any[] = [];

    const startX = (width - textWidth) / 2;
    const startY = height / 2 - (isMobile ? 120 : 150);
    
    // Density of particles
    const step = isMobile ? 1 : 2;

    for (let y = 0; y < textHeight; y += step) {
      for (let x = 0; x < textWidth; x += step) {
        const alpha = imageData[(y * textWidth + x) * 4 + 3];
        if (alpha > 128) {
           particles.push({
             targetX: startX + x,
             targetY: startY + y,
             x: Math.random() * width,
             y: Math.random() * height, // Fall from the sky or around
             vx: 0,
             vy: 0,
             radius: isMobile ? (Math.random() * 1 + 0.5) : (Math.random() * 1.5 + 0.5),
             color: Math.random() > 0.8 ? '#ff2a40' : '#ffffff',
             delay: Math.random() * 60 // frames delay before moving
           });
        }
      }
    }

    let time = 0;
    let frame = 0;
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;
      frame++;
      
      const globalFloatX = Math.sin(time) * 15;
      const globalFloatY = Math.cos(time * 0.8) * 10;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        if (frame > p.delay) {
          const dx = (p.targetX + globalFloatX) - p.x;
          const dy = (p.targetY + globalFloatY) - p.y;
          
          p.vx += dx * (isMobile ? 0.03 : 0.015);
          p.vy += dy * (isMobile ? 0.03 : 0.015);
          p.vx *= 0.85;
          p.vy *= 0.85;
          
          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow to red particles
        if (p.color === '#ff2a40') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff2a40';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />;
}

export function FinalScreen() {
  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-[#030308] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    >
      <StarryBackground />
      
      {/* Realistic Crescent Moon */}
      <motion.div
        className="absolute top-4 right-4 md:top-10 md:right-20 z-10 w-48 h-48 md:w-80 md:h-80"
        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        style={{ mixBlendMode: 'screen' }}
      >
        <img 
          src="/SYN-romantic-garden/moon.png" 
          alt="Crescent Moon" 
          className="w-full h-full object-contain opacity-90"
          style={{ mixBlendMode: 'screen' }}
        />
      </motion.div>

      <ParticleText />

      <motion.div 
        className="relative z-30 flex flex-col items-center justify-center text-center px-4 mt-32 md:mt-48"
      >
        <motion.p 
          className="text-xl md:text-3xl text-gray-200 font-serif italic max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 2 }}
          style={{ textShadow: '0 0 10px rgba(0,0,0,0.8)' }}
        >
          You are the most precious part of my universe. <br/> 
          I promise to love you, protect you, and cherish you forever.
        </motion.p>
        
        <motion.div
          className="mt-12 md:mt-16 relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 5.5, type: 'spring', stiffness: 100 }}
        >
          {/* Glowing Aura Behind Heart */}
          <motion.div
            className="absolute w-24 h-24 md:w-32 md:h-32 bg-[#ff2a40] rounded-full blur-[40px] z-0"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Beating Heart Icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <svg className="w-20 h-20 md:w-28 md:h-28 text-[#ff2a40] drop-shadow-[0_0_20px_rgba(255,42,64,0.8)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
