import React, { useEffect, useRef } from 'react';

export function CMatrix() {
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

    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const fontSize = 10; // Smaller font size for MORE quantity
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];
    
    const dropChars: string[][] = [];

    // Increase initial drops so it's dense
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; 
      dropChars[x] = [];
    }

    let animationFrameId: number;
    let lastDrawTime = 0;
    const fps = 45; // slightly faster for more dynamic matrix
    const interval = 1000 / fps;

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (currentTime - lastDrawTime < interval) return;
      lastDrawTime = currentTime;

      // Dark translucent background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Courier New", monospace`;

      const getRenderX = (origX: number, currY: number) => {
          // Removed avoidance logic so they merge over the countdown
          return origX;
      };

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] < 0) {
          drops[i] += 0.5; // fall slightly slower initially to build density
          continue;
        }

        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const renderX = getRenderX(x, y);

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF1493';
        ctx.fillText(text, renderX, y);

        ctx.shadowBlur = 0;
        
        if (dropChars[i].length > 0) {
           ctx.fillStyle = '#FF1493';
           const prevY = y - fontSize;
           const prevRenderX = getRenderX(x, prevY);
           ctx.fillText(dropChars[i][dropChars[i].length - 1], prevRenderX, prevY);
        }
        
        dropChars[i].push(text);
        if (dropChars[i].length > height / fontSize) {
            dropChars[i].shift();
        }

        if (y > height && Math.random() > 0.95) {
          drops[i] = 0;
          dropChars[i] = [];
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const newColumns = Math.floor(width / fontSize);
      while (drops.length < newColumns) {
        drops.push(Math.random() * -100);
        dropChars.push([]);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-80 z-0" />;
}
