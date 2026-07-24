import React, { useEffect, useRef, useState } from 'react';
import { CMatrix } from './CMatrix';

const NUM_TEXT_PARTICLES = 1500;

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  isScattering: boolean;
  isActive: boolean;
  isVisible: boolean;

  constructor(w: number, h: number) {
    this.x = w / 2;
    this.y = h / 2;
    this.vx = 0;
    this.vy = 0;
    this.isActive = true;
    this.isVisible = false;
    this.color = '#ffffff';
    this.radius = Math.random() * 1.5 + 1.5;
    this.isScattering = false;
  }

  update(w: number, h: number) {
    if (!this.isActive || !this.isVisible) return;

    if (this.isScattering) {
      this.x += this.vx;
      this.y += this.vy;
      
      // Gradually slow down
      this.vx *= 0.95;
      this.vy *= 0.95;
      
      // Fade out effect by shrinking
      this.radius *= 0.96;
      if (this.radius < 0.1) {
          this.isActive = false;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive || !this.isVisible) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    // Add glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff5e6c';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  scatter(w: number, h: number) {
    this.isScattering = true;
    this.isVisible = true;
    
    // Calculate distance from center to make explosion more dynamic
    const dx = this.x - w/2;
    const dy = this.y - h/2;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    
    // Add some randomness and directional force
    this.vx = (dx / dist) * (Math.random() * 30 + 10) + (Math.random() - 0.5) * 15;
    this.vy = (dy / dist) * (Math.random() * 30 + 10) + (Math.random() - 0.5) * 15;
    
    // Sometimes make them pinkish for variation
    if (Math.random() > 0.7) {
        this.color = '#ff5e6c';
    }
  }
}

export function ParticleCountdown({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [word, setWord] = useState<string | null>(null);
  const [countdownWord, setCountdownWord] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    for (let i = 0; i < NUM_TEXT_PARTICLES; i++) {
      particles.push(new Particle(width, height));
    }

    const getTextPixels = (text: string, fontSize: string) => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return [];

      offCtx.fillStyle = 'white';
      offCtx.font = `bold ${fontSize} Arial, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, width / 2, height / 2);

      const imageData = offCtx.getImageData(0, 0, width, height).data;
      const pixels = [];
      const step = 4;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          if (imageData[index + 3] > 128) {
            pixels.push({ x, y });
          }
        }
      }
      return pixels;
    };

    const prepareParticlesForText = (text: string, fontSize: string = '35vmin') => {
      const pixels = getTextPixels(text, fontSize);
      if (pixels.length === 0) return;
      
      let pixelIdx = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const target = pixels[pixelIdx % pixels.length];
        // Instantly snap them into the shape of the text
        p.x = target.x + (Math.random() - 0.5) * 8;
        p.y = target.y + (Math.random() - 0.5) * 8;
        pixelIdx++;
      }
    };

    const scatterParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        particles[i].scatter(width, height);
      }
    };

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update(width, height);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Sequence: 3 -> 2 -> 1 -> explode '1' into particles -> Welcome -> My -> Love
    const s1 = setTimeout(() => setCountdownWord('3'), 500);
    const s2 = setTimeout(() => setCountdownWord('2'), 1500);
    const s3 = setTimeout(() => {
        setCountdownWord('1');
        // Secretly shape the particles like '1' in the background
        prepareParticlesForText('1', '35vmin');
    }, 2500);
    const s4 = setTimeout(() => {
        setCountdownWord(null);
        scatterParticles();
    }, 3500); 
    
    const s5 = setTimeout(() => setWord('Welcome'), 4500);
    const s6 = setTimeout(() => setWord('My'), 6500);
    const s7 = setTimeout(() => setWord('Love'), 8500);
    
    const s8 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 12000);

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
      clearTimeout(s1); clearTimeout(s2); clearTimeout(s3);
      clearTimeout(s4); clearTimeout(s5); clearTimeout(s6);
      clearTimeout(s7); clearTimeout(s8);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 animate-[fadeInVoid_1.5s_ease-in_forwards] flex items-center justify-center pointer-events-none overflow-hidden">
      <CMatrix />
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      
      {/* HTML Countdown Text (3, 2, 1) */}
      {countdownWord !== null && (
        <div 
          key={`cd-${countdownWord}`} 
          className="absolute z-20 text-pink-300 font-serif font-bold tracking-widest text-center text-[35vmin]"
          style={{
            textShadow: '0 0 20px #ff5e6c, 0 0 40px #ff2a40, 0 0 60px #ff1493',
            animation: 'countdownZoom 1s ease-in-out forwards'
          }}
        >
          {countdownWord}
        </div>
      )}

      {/* Normal Text Words (Welcome, My, Love) */}
      {word !== null && (
        <div 
          key={`word-${word}`} 
          className={`absolute z-20 text-pink-300 font-serif tracking-[0.2em] text-center px-4 ${
            word === 'Welcome' ? 'text-6xl md:text-8xl lg:text-[10rem]' : 'text-4xl md:text-6xl lg:text-8xl'
          }`}
          style={{
            textShadow: '0 0 20px #ff5e6c, 0 0 40px #ff2a40, 0 0 60px #ff1493',
            animation: word === 'Love' 
               ? 'twirlLeftRight 3s ease-in-out forwards' 
               : word === 'Welcome' || word === 'My'
               ? 'wordFade 2s ease-in-out forwards'
               : 'wordFade 1s ease-in-out forwards'
          }}
        >
          {word}
        </div>
      )}

      <style>{`
        @keyframes fadeInVoid {
          0% { background-color: transparent; }
          100% { background-color: black; }
        }
        @keyframes countdownZoom {
          0% { opacity: 0; filter: blur(20px); transform: scale(0.3); }
          20% { opacity: 1; filter: blur(0px); transform: scale(1); }
          80% { opacity: 1; filter: blur(0px); transform: scale(1.1); }
          100% { opacity: 0; filter: blur(10px); transform: scale(1.5); }
        }
        @keyframes wordFade {
          0% { opacity: 0; filter: blur(10px); transform: scale(0.9); }
          20% { opacity: 1; filter: blur(0px); transform: scale(1); }
          80% { opacity: 1; filter: blur(0px); transform: scale(1); }
          100% { opacity: 0; filter: blur(10px); transform: scale(1.1); }
        }
        @keyframes twirlLeftRight {
          0% { opacity: 0; transform: translateX(-150px) rotate(-15deg) scale(0.8); }
          25% { opacity: 1; transform: translateX(-50px) rotate(10deg) scale(1.2); }
          50% { opacity: 1; transform: translateX(0px) rotate(-10deg) scale(1.2); }
          75% { opacity: 1; transform: translateX(50px) rotate(10deg) scale(1.2); }
          100% { opacity: 0; transform: translateX(150px) rotate(-15deg) scale(0.8); }
        }
      `}</style>
    </div>
  );
}
