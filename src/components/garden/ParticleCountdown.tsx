import React, { useEffect, useRef, useState } from 'react';
import { CMatrix } from './CMatrix';

const NUM_TEXT_PARTICLES = 2500;

class Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  isScattering: boolean;
  isActive: boolean;
  isVisible: boolean;

  constructor(w: number, h: number) {
    this.x = w / 2 + (Math.random() - 0.5) * 50;
    this.y = h / 2 + (Math.random() - 0.5) * 50;
    this.tx = this.x;
    this.ty = this.y;
    this.vx = (Math.random() - 0.5) * 20;
    this.vy = (Math.random() - 0.5) * 20;
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
      
      this.vx *= 0.96;
      this.vy *= 0.96;
      
      this.radius *= 0.95;
      if (this.radius < 0.1) {
          this.isActive = false;
      }
    } else {
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;
      
      this.vx += dx * 0.08;
      this.vy += dy * 0.08;
      
      this.vx *= 0.75;
      this.vy *= 0.75;
      
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive || !this.isVisible) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff5e6c';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  setTarget(tx: number, ty: number) {
    this.isVisible = true;
    this.tx = tx;
    this.ty = ty;
  }

  explodeSlightly() {
    this.vx += (Math.random() - 0.5) * 80;
    this.vy += (Math.random() - 0.5) * 80;
  }

  scatter(w: number, h: number) {
    this.isScattering = true;
    this.isVisible = true;
    
    const dx = this.x - w/2;
    const dy = this.y - h/2;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    
    this.vx = (dx / dist) * (Math.random() * 40 + 10) + (Math.random() - 0.5) * 20;
    this.vy = (dy / dist) * (Math.random() * 40 + 10) + (Math.random() - 0.5) * 20;
    
    if (Math.random() > 0.6) {
        this.color = '#ff5e6c';
    }
  }
}

export function ParticleCountdown({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [word, setWord] = useState<string | null>(null);

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

    const prepareParticlesForText = (text: string, fontSize: string = '35vmin', scatterFirst = false) => {
      const pixels = getTextPixels(text, fontSize);
      if (pixels.length === 0) return;
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (scatterFirst) {
          p.explodeSlightly();
        }
        const target = pixels[Math.floor(Math.random() * pixels.length)];
        p.setTarget(target.x + (Math.random() - 0.5) * 6, target.y + (Math.random() - 0.5) * 6);
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

    const s1 = setTimeout(() => prepareParticlesForText('3', '40vmin', false), 500);
    const s2 = setTimeout(() => prepareParticlesForText('2', '40vmin', true), 1500);
    const s3 = setTimeout(() => prepareParticlesForText('1', '40vmin', true), 2500);
    const s4 = setTimeout(() => scatterParticles(), 3500); 
    
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
      
      {word !== null && (
        <div 
          key={`word-${word}`} 
          className={`absolute z-20 text-pink-300 font-serif tracking-[0.2em] text-center px-4 ${
            word === 'Welcome' ? 'text-6xl md:text-8xl lg:text-[10rem]' : 'text-4xl md:text-6xl lg:text-8xl'
          }`}
          style={{
            textShadow: '0 0 20px #ff5e6c, 0 0 40px #ff2a40, 0 0 60px #ff1493',
            animation: word === 'Love' 
               ? 'loveReveal 3.5s ease-out forwards' 
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
        @keyframes wordFade {
          0% { opacity: 0; filter: blur(10px); transform: scale(0.9); }
          20% { opacity: 1; filter: blur(0px); transform: scale(1); }
          80% { opacity: 1; filter: blur(0px); transform: scale(1); }
          100% { opacity: 0; filter: blur(10px); transform: scale(1.1); }
        }
        @keyframes loveReveal {
          0% { opacity: 0; filter: blur(15px); transform: scale(0.6) translateY(20px); }
          20% { opacity: 1; filter: blur(0px); transform: scale(1.1) translateY(0px); }
          35% { opacity: 1; transform: scale(1); }
          75% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0; filter: blur(10px); transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
