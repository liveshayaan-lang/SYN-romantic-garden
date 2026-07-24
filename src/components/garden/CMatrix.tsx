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

    // A mix of katakana and latin characters for a more authentic matrix feel
    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];
    
    // Create an array to store the characters for each drop to make them stable
    const dropChars: string[][] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; // start at random positions above screen
      dropChars[x] = [];
    }

    let animationFrameId: number;
    let lastDrawTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (currentTime - lastDrawTime < interval) return;
      lastDrawTime = currentTime;

      // Dark translucent background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Courier New", monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Only start dropping if y > 0, to stagger the start
        if (drops[i] < 0) {
          drops[i]++;
          continue;
        }

        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw the text
        // Use a bright white/pink for the leading character
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF1493';
        ctx.fillText(text, x, y);

        // Remove shadow for the previous characters so it doesn't get overwhelmingly bright
        ctx.shadowBlur = 0;
        
        // Redraw the previous character in pink to replace the white leading character
        if (dropChars[i].length > 0) {
           ctx.fillStyle = '#FF1493';
           ctx.fillText(dropChars[i][dropChars[i].length - 1], x, y - fontSize);
        }
        dropChars[i].push(text);
        if (dropChars[i].length > height / fontSize) {
            dropChars[i].shift();
        }

        // Avoid center area
        const cx = width / 2;
        const cy = height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        const avoidanceRadius = 200;
        if (dist < avoidanceRadius) {
           // Skip drawing if it's too close to the center to keep it clean for countdown
           ctx.fillStyle = 'black';
           ctx.fillRect(x, y - fontSize, fontSize, fontSize * 2);
        }

        if (y > height && Math.random() > 0.975) {
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60 z-0" />;
}
