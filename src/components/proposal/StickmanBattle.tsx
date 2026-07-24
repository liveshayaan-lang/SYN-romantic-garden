import React, { useEffect, useRef, useState } from 'react';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const playSwordSlash = () => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) { }
};

const playPowerUp = () => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 1.5);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 25;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 100;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    lfo.stop(ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.3, ctx.currentTime + 1.3);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);

    const msg = new SpeechSynthesisUtterance("Haaaaaaahhhhh!");
    msg.pitch = 1.2;
    msg.rate = 0.8;
    window.speechSynthesis.speak(msg);
  } catch (e) { }
};

// Speech synthesis voices array
let synthVoices: SpeechSynthesisVoice[] = [];
if (typeof window !== 'undefined' && window.speechSynthesis) {
  // Load voices and listen for changes
  synthVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    synthVoices = window.speechSynthesis.getVoices();
  };
}

const playMultiSlash = () => {
  try {
    const ctx = initAudio();
    const bufferSize = ctx.sampleRate * 1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(8000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6);
    filter.Q.value = 15;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.6);
  } catch (e) { }
};

export function StickmanBattle({ onComplete, visitorGender = 'female' }: { onComplete?: () => void, visitorGender?: 'male' | 'female' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<number>(1);
  const [endingTextPhase, setEndingTextPhase] = useState(0);
  const triggerUltimateRef = useRef(false);

  useVoiceCommand({
    "baby inki": () => { triggerUltimateRef.current = true; },
    "baby inko": () => { triggerUltimateRef.current = true; },
    "baby maar": () => { triggerUltimateRef.current = true; },
    "baby maaro": () => { triggerUltimateRef.current = true; },
    "baby bachao": () => { triggerUltimateRef.current = true; },
    "bachao mujhe": () => { triggerUltimateRef.current = true; },
    "maar do inko": () => { triggerUltimateRef.current = true; }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const meIsFemale = visitorGender === 'male';
    const youIsFemale = visitorGender === 'female';

    const meColor = meIsFemale ? '#ff6b81' : '#00ffff';
    const youColor = youIsFemale ? '#ffb3c6' : '#a0c4ff';
    const meTrailColor = meIsFemale ? 'rgba(255, 107, 129, 0.6)' : 'rgba(0, 255, 255, 0.6)';

    class Stickman {
      x: number;
      y: number;
      vx: number;
      vy: number;
      speed: number;
      type: 'you' | 'me' | 'enemy';
      walkCycle: number;
      isDead: boolean;
      isCarried: boolean;
      isCarrying: boolean;
      deathTimer: number;
      swordSwingTimer: number;
      attackType: 'stand' | 'crouch' | 'jump';
      target: Stickman | null;
      downTimer: number;
      trail: { x: number, y: number }[] = [];

      constructor(x: number, y: number, type: 'you' | 'me' | 'enemy') {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.speed = type === 'me' ? 40 : type === 'you' ? 1.5 : (Math.random() * 2 + 1.5);
        this.walkCycle = Math.random() * Math.PI * 2;
        this.isDead = false;
        this.isCarried = false;
        this.isCarrying = false;
        this.deathTimer = 0;
        this.swordSwingTimer = 0;
        this.attackType = 'stand';
        this.target = null;
        this.downTimer = 0;
      }

      update(width: number, height: number, you: Stickman, enemies: Stickman[], currentFrame: number) {
        if (this.isDead) {
          this.deathTimer++;
          return;
        }

        // Override AI for phase 6 ending
        if (currentFrame > 950 && (this.type === 'me' || this.type === 'you')) {
          this.x += this.vx;
          this.y += this.vy;
          return;
        }

        // Hero fallen state in Phase 2
        if (this.type === 'me' && currentFrame > 400 && currentFrame < 650) {
          this.downTimer++;
          this.vx = 0;
          this.vy = 0;
          this.trail = [];
          return;
        }

        // Goku Power up sequence!
        if (this.type === 'me' && currentFrame >= 650 && currentFrame < 700) {
          this.downTimer = 0; // Stand up!
          this.vx = 0;
          this.vy = 0;
          this.trail = [];
          return;
        }

        if (this.type === 'enemy') {
          // Target 'You' or 'Me' based on phase
          const targetChar = (currentFrame > 500 || (you.x - this.x) ** 2 + (you.y - this.y) ** 2 < 4000) ? you : (currentFrame > 400 ? you : you); // After 400 hero is fallen, so target You
          const dx = targetChar.x - this.x;
          const dy = targetChar.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > (currentFrame > 500 ? 15 : 35)) { // swarm closer in phase 3
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
          } else {
            this.vx = 0;
            this.vy = 0;
            // Enemy attacks if near
            if (this.swordSwingTimer <= 0 && Math.random() < 0.05) {
              this.swordSwingTimer = 15;
              if (Math.random() < 0.3) playSwordSlash();
            }
          }
        } else if (this.type === 'me') {
          // Find closest enemy
          let closestEnemy = null;
          let minD = Infinity;
          for (let e of enemies) {
            if (e.isDead) continue;
            const dx = e.x - this.x;
            const dy = e.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minD) {
              minD = dist;
              closestEnemy = e;
            }
          }
          this.target = closestEnemy;

          if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 35) {
              this.vx = (dx / dist) * this.speed;
              this.vy = (dy / dist) * this.speed;
            } else {
              this.vx = 0;
              this.vy = 0;
              // Attack!
              if (this.swordSwingTimer <= 0) {
                this.swordSwingTimer = 10; // faster swing
                playSwordSlash();
                // Randomize attack style
                const r = Math.random();
                if (r < 0.33) this.attackType = 'crouch';
                else if (r < 0.66) this.attackType = 'jump';
                else this.attackType = 'stand';

                this.target.isDead = true;
                this.target.vx = (dx / dist) * 20;
                this.target.vy = (dy / dist) * 20;
              }
            }
          } else {
            // Idle near 'You'
            const dx = you.x - this.x;
            const dy = you.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 80) {
              this.vx = (dx / dist) * this.speed;
              this.vy = (dy / dist) * this.speed;
            } else {
              this.vx = 0;
              this.vy = 0;
            }
          }
        } else if (this.type === 'you') {
          // Panic wander when swarmed (Phase 3)
          const wanderSpeed = currentFrame > 500 ? this.speed * 0.5 : this.speed;
          if (Math.random() < 0.05) {
            this.vx = (Math.random() - 0.5) * wanderSpeed;
            this.vy = (Math.random() - 0.5) * wanderSpeed;
          }
          const dx = (width / 2) - this.x;
          const dy = (height / 2) - this.y;
          this.x += dx * 0.005;
          this.y += dy * 0.005;
        }

        if (this.swordSwingTimer > 0) {
          this.swordSwingTimer--;
        }

        this.x += this.vx;
        this.y += this.vy;

        const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (velocity > 0.1) {
          this.walkCycle += velocity * 0.15;
        }

        // Trail for 'me' flash effect
        if (this.type === 'me' && velocity > 5) {
          this.trail.push({ x: this.x, y: this.y });
          if (this.trail.length > 8) this.trail.shift();
        } else if (this.trail.length > 0) {
          this.trail.shift();
        }
      }

      draw(ctx: CanvasRenderingContext2D, currentFrame: number) {
        ctx.save();

        let drawX = this.x;
        let drawY = this.y;

        // Draw Flash trail for 'me'
        if (this.type === 'me' && this.trail.length > 1 && this.downTimer === 0 && !this.isDead) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(this.trail[0].x, this.trail[0].y - 15);
          for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y - 15);
          }
          ctx.lineTo(drawX, drawY - 15);
          ctx.strokeStyle = meTrailColor;
          ctx.lineWidth = 15;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 20;
          ctx.shadowColor = meColor;
          ctx.stroke();

          // inner core
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 5;
          ctx.shadowBlur = 0;
          ctx.stroke();
          ctx.restore();
        }

        // Apply jump animation offset if jumping
        if (this.type === 'me' && this.swordSwingTimer > 0 && this.attackType === 'jump') {
          const progress = 1 - (this.swordSwingTimer / 10);
          drawY -= Math.sin(progress * Math.PI) * 40; // arc up to 40px
        }

        ctx.translate(drawX, drawY);

        let facingRight = this.vx >= 0 || (this.target && this.target.x > this.x);
        if (this.isCarrying || this.isCarried) {
          facingRight = true; // Always face forward/right while flying
        }
        if (!facingRight && !this.isDead && !(this.type === 'me' && this.downTimer > 0)) {
          ctx.scale(-1, 1);
        }

        ctx.strokeStyle = this.type === 'enemy' ? '#ff4d4d' : (this.type === 'you' ? youColor : meColor);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const drawStickman = () => {
          ctx.save();

          if (this.type === 'me' && this.downTimer > 0) {
            // Fallen state
            ctx.rotate(Math.PI / 2);
            ctx.translate(0, -20);
          } else if (this.isCarried) {
            // Perfect bridal carry pose
            ctx.rotate(-Math.PI / 2.2); // Leaning back
            ctx.translate(5, 20); // Sit perfectly in arms
          } else if ((this.type === 'me' || this.type === 'enemy') && this.swordSwingTimer > 0 && this.attackType === 'crouch') {
            // Crouch state
            ctx.translate(0, 10);
            ctx.scale(1, 0.7);
          }

          // Head
          ctx.beginPath();
          ctx.arc(0, -25, 6, 0, Math.PI * 2);
          ctx.stroke();

          // Flash mask/goggles for 'me'
          if (this.type === 'me' && this.downTimer === 0) {
            ctx.fillStyle = meColor;
            ctx.fillRect(facingRight ? 2 : -2, -27, 4, 2);
          }

          // Skirt for females
          const isThisFemale = (this.type === 'you' && youIsFemale) || (this.type === 'me' && meIsFemale);
          if (isThisFemale) {
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(-8, -5);
            ctx.lineTo(8, -5);
            ctx.closePath();
            ctx.fillStyle = this.type === 'you' ? youColor : meColor;
            ctx.fill();
          }

          // Body
          ctx.beginPath();
          ctx.moveTo(0, -19);
          ctx.lineTo(0, -5);
          ctx.stroke();

          const swing = (this.isCarried || this.isCarrying) ? 0 : Math.sin(this.walkCycle);
          const legAngle = (this.isDead || this.downTimer > 0 || this.isCarried) ? 0.5 : swing * 0.8;
          const armAngle = (this.isDead || this.downTimer > 0 || this.isCarried) ? 0.5 : -swing * 0.8;

          // Legs
          ctx.beginPath();
          ctx.moveTo(0, -5); ctx.lineTo(Math.sin(legAngle) * 10, -5 + Math.cos(legAngle) * 12);
          ctx.moveTo(0, -5); ctx.lineTo(Math.sin(-legAngle) * 10, -5 + Math.cos(-legAngle) * 12);
          ctx.stroke();

          // Arms
          ctx.beginPath();
          if (this.type === 'me' || this.type === 'enemy') {
            const isSwinging = this.swordSwingTimer > 0;
            let armTargetX = 10;
            let armTargetY = -5;
            let swordRot = -Math.PI / 4;

            if (isSwinging) {
              if (this.attackType === 'stand') { armTargetX = 15; armTargetY = -15; swordRot = Math.PI / 4; }
              if (this.attackType === 'jump') { armTargetX = 10; armTargetY = -25; swordRot = Math.PI / 2; }
              if (this.attackType === 'crouch') { armTargetX = 20; armTargetY = -5; swordRot = Math.PI / 3; }
            }

            if (this.isCarrying) {
              ctx.moveTo(0, -15);
              ctx.quadraticCurveTo(10, -5, 20, -15); // Front arm scooping
            } else {
              ctx.moveTo(0, -15);
              ctx.lineTo(armTargetX, armTargetY);
              // Draw Sword
              ctx.save();
              ctx.translate(armTargetX, armTargetY);
              ctx.rotate(swordRot);

              if (this.type === 'me') {
                ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, -2, 6, 4); // Handle
                ctx.fillStyle = '#A9A9A9'; ctx.fillRect(4, -8, 4, 16); // Crossguard
                ctx.fillStyle = meColor; ctx.fillRect(8, -4, 24, 8); // Blade
                ctx.fillRect(32, -2, 4, 4); // Tip
                ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(8, -4, 24, 8); // Outline
              } else {
                // Enemy sword
                ctx.fillStyle = '#333'; ctx.fillRect(-2, -2, 6, 4); // Handle
                ctx.fillStyle = '#555'; ctx.fillRect(4, -8, 4, 16); // Crossguard
                ctx.fillStyle = '#ff4d4d'; ctx.fillRect(8, -4, 24, 8); // Blade
                ctx.fillRect(32, -2, 4, 4); // Tip
                ctx.strokeStyle = '#222'; ctx.lineWidth = 1; ctx.strokeRect(8, -4, 24, 8); // Outline
              }

              ctx.restore();
            }

            // Back arm
            ctx.beginPath();
            ctx.moveTo(0, -15);
            if (this.isCarrying) {
              ctx.quadraticCurveTo(8, -8, 15, -18); // Back arm scooping
            } else {
              ctx.lineTo(Math.sin(armAngle) * 8, -15 + Math.cos(armAngle) * 10);
            }
            ctx.strokeStyle = this.type === 'me' ? meColor : '#ff4d4d';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.moveTo(0, -15);
            if (this.isCarried) {
              ctx.lineTo(5, -25); // Arms around his neck
              ctx.moveTo(0, -15);
              ctx.lineTo(12, -22);
            } else {
              ctx.lineTo(Math.sin(armAngle) * 10, -15 + Math.cos(armAngle) * 10);
              ctx.moveTo(0, -15);
              ctx.lineTo(Math.sin(-armAngle) * 10, -15 + Math.cos(-armAngle) * 10);
            }
            ctx.stroke();
          }

          ctx.restore();
        };

        if (this.isDead) {
          ctx.strokeStyle = '#ff0000';
          if (this.deathTimer > 5) ctx.strokeStyle = '#555';
          ctx.globalAlpha = Math.max(0, 1 - this.deathTimer / 60);

          const slide = this.deathTimer * 0.8;
          const rotation = this.deathTimer * 0.1;

          // Split and slide halves
          ctx.save();
          ctx.translate(-slide, -slide * 0.5); ctx.rotate(-rotation);
          ctx.beginPath(); ctx.rect(-50, -50, 100, 35); ctx.clip();
          drawStickman();
          ctx.restore();

          ctx.save();
          ctx.translate(slide, slide * 0.5); ctx.rotate(rotation);
          ctx.beginPath(); ctx.rect(-50, -15, 100, 50); ctx.clip();
          drawStickman();
          ctx.restore();
        } else {
          drawStickman();
        }

        ctx.restore();

        // Goku Aura for 'me'
        if (this.type === 'me' && currentFrame >= 650 && currentFrame < 700) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          for (let j = 0; j < 3; j++) {
            const radius = 40 + Math.random() * 60;
            ctx.beginPath();
            ctx.ellipse(drawX, drawY - 10, radius * 0.7, radius * 1.3, 0, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(drawX, drawY - 10, 0, drawX, drawY - 10, radius * 1.3);
            const c = meIsFemale ? '255, 107, 129' : '50, 150, 255';
            grad.addColorStop(0, `rgba(${c}, 0.8)`);
            grad.addColorStop(1, `rgba(${c}, 0)`);
            ctx.fillStyle = grad;
            ctx.fill();
          }
          // Energy lightning
          for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(drawX + (Math.random() - 0.5) * 20, drawY + (Math.random() - 0.5) * 20);
            let curX = drawX;
            let curY = drawY;
            for (let k = 0; k < 3; k++) {
              curX += (Math.random() - 0.5) * 80;
              curY += (Math.random() - 0.5) * 80 - 20;
              ctx.lineTo(curX, curY);
            }
            ctx.strokeStyle = Math.random() > 0.5 ? '#ff3333' : meColor;
            ctx.lineWidth = 2 + Math.random() * 4;
            ctx.stroke();
          }
          ctx.restore();
        }

        // Draw Text
        if (this.type === 'me' && this.downTimer > 0) {
          ctx.fillStyle = '#ff0000';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff0000';
          ctx.fillText('Dead', drawX, drawY - 40);
          ctx.shadowBlur = 0;
        } else if (!this.isDead && (this.type === 'you' || this.type === 'me')) {
          ctx.fillStyle = this.type === 'you' ? youColor : meColor;
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(this.type === 'you' ? 'You' : 'Me', drawX, drawY - 40 - (this.type === 'me' && this.attackType === 'jump' && this.swordSwingTimer > 0 ? 40 : 0));

          if (this.type === 'you' && currentFrame > 500 && currentFrame < 700) {
            const shakeX = (Math.random() - 0.5) * 6;
            const shakeY = (Math.random() - 0.5) * 6;
            ctx.fillStyle = '#ff4d4d';
            ctx.font = 'bold 22px Arial';
            ctx.fillText(visitorGender === 'male' ? 'Help!' : 'Help baby!', drawX + shakeX, drawY - 65 + shakeY);
          }
        }
      }
    }

    const you = new Stickman(width / 2 + 50, height / 2, 'you');
    const me = new Stickman(width / 2 - 50, height / 2, 'me');
    let enemies: Stickman[] = [];
    let heartParticles: any[] = [];
    let clouds: any[] = [];
    for (let i = 0; i < 25; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height * 2 - height,
        size: 60 + Math.random() * 100,
        speed: 15 + Math.random() * 20
      });
    }

    let frameCount = 0;
    let animationFrameId: number;
    let showUltimateEffect = 0;

    let slashLines: { x1: number, y1: number, x2: number, y2: number }[] = [];
    let slashTimer = 0;

    const spawnEnemy = () => {
      const isVertical = Math.random() > 0.5;
      const x = isVertical ? (Math.random() > 0.5 ? -10 : width + 10) : Math.random() * width;
      const y = isVertical ? Math.random() * height : (Math.random() > 0.5 ? -10 : height + 10);
      enemies.push(new Stickman(x, y, 'enemy'));
    };

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, width, height);

      frameCount++;

      if (triggerUltimateRef.current) {
        if (frameCount < 650) {
          frameCount = 649;
        }
        triggerUltimateRef.current = false;
      }

      // Phase 1: Normal combat (0 - 300)
      if (frameCount < 300) {
        if (frameCount % 15 === 0) spawnEnemy();
      }
      // Phase 2: Overwhelm (300 - 400)
      else if (frameCount < 400) {
        if (frameCount % 5 === 0) spawnEnemy();
      }
      // Phase 3: Swarm You (400 - 700) -> Handled in Stickman update (hero falls at 400)

      // Phase 4: Awakening & Multi-slash (700)
      if (frameCount === 510) {
        // playHelpBaby sound removed by user request
      }

      if (frameCount === 650) {
        playPowerUp();
      }

      if (frameCount === 700) {
        playMultiSlash();
        me.downTimer = 0;
        let prevX = me.x;
        let prevY = me.y;

        // INSTANT KILL ALL ENEMIES WITH SLASH LINES
        enemies.forEach(e => {
          if (!e.isDead) {
            slashLines.push({ x1: prevX, y1: prevY, x2: e.x, y2: e.y });
            prevX = e.x;
            prevY = e.y;
            e.isDead = true;

            // Knockback
            const dx = e.x - (width / 2);
            const dy = e.y - (height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            e.vx = (dx / dist) * 30; // violently thrown away
            e.vy = (dy / dist) * 30;
          }
        });

        me.x = you.x - 30; // Teleport in front of you
        me.y = you.y;
        slashLines.push({ x1: prevX, y1: prevY, x2: me.x, y2: me.y });

        slashTimer = 20; // Show slashes for 20 frames
        me.swordSwingTimer = 30;
        me.attackType = 'stand';
        showUltimateEffect = 30; // Screen flash effect
      }

      // Draw Multi-slash lightning lines
      if (slashTimer > 0) {
        slashTimer--;
        ctx.save();
        ctx.beginPath();
        slashLines.forEach(line => {
          ctx.moveTo(line.x1, line.y1 - 15);
          ctx.lineTo(line.x2, line.y2 - 15);
        });
        ctx.strokeStyle = `rgba(0, 255, 255, ${slashTimer / 20})`;
        ctx.lineWidth = 3 + (slashTimer / 2);
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ffff';
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${slashTimer / 20})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.stroke();
        ctx.restore();
      }

      // Draw ultimate radial flash effect
      if (showUltimateEffect > 0) {
        showUltimateEffect--;
        ctx.save();
        ctx.beginPath();
        ctx.arc(me.x, me.y, (30 - showUltimateEffect) * 40, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${showUltimateEffect / 30})`;
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 255, 255, ${showUltimateEffect / 60})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Phase 5: Conclusion
      if (frameCount === 800) {
        setEndingTextPhase(1);
      }

      // Phase 6: Surprise Ending
      if (frameCount === 950) {
        setEndingTextPhase(2);
      }

      if (frameCount >= 950 && frameCount < 1100) {
        const centerX = width / 2;
        const centerY = height / 2;

        // Me walks to center - 15
        if (Math.abs(me.x - (centerX - 15)) > 2) me.vx = me.x < centerX - 15 ? 2 : -2; else me.vx = 0;
        if (Math.abs(me.y - centerY) > 2) me.vy = me.y < centerY ? 2 : -2; else me.vy = 0;
        if (me.vx !== 0 || me.vy !== 0) me.walkCycle += 0.2;

        // You walks to center + 15
        if (Math.abs(you.x - (centerX + 15)) > 2) you.vx = you.x < centerX + 15 ? 2 : -2; else you.vx = 0;
        if (Math.abs(you.y - centerY) > 2) you.vy = you.y < centerY ? 2 : -2; else you.vy = 0;
        if (you.vx !== 0 || you.vy !== 0) you.walkCycle += 0.2;
      }

      if (frameCount === 1100) {
        me.vx = 0; me.vy = 0;
        you.vx = 0; you.vy = 0;
        // Explosion of hearts
        for (let i = 0; i < 150; i++) {
          heartParticles.push({
            x: width / 2,
            y: height / 2 - 20,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            life: 150 + Math.random() * 100,
            maxLife: 250,
            size: 5 + Math.random() * 15,
            color: Math.random() > 0.5 ? '#ff4d4d' : '#ffb3c6'
          });
        }
      }

      // Draw background transition for Phase 6
      let camScale = 1;
      let camOffsetX = 0;
      let camOffsetY = 0;

      if (frameCount > 1100) {
        const progress = Math.min((frameCount - 1100) / 100, 1);

        // Dark background transitions to deep romantic purple/pink
        ctx.fillStyle = `rgba(40, 10, 50, ${progress * 0.9})`;
        ctx.fillRect(0, 0, width, height);

        // Draw a massive glowing moon
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 - 150 - (progress * 50), 100 + progress * 50, 0, Math.PI * 2);
        const moonGrad = ctx.createRadialGradient(width / 2, height / 2 - 150 - (progress * 50), 0, width / 2, height / 2 - 150 - (progress * 50), 100 + progress * 50);
        moonGrad.addColorStop(0, `rgba(255, 255, 255, ${progress})`);
        moonGrad.addColorStop(1, `rgba(255, 230, 250, 0)`);
        ctx.fillStyle = moonGrad;
        ctx.fill();
        ctx.restore();

        if (frameCount === 1200) {
          setEndingTextPhase(3);
        }

        if (frameCount === 1500) {
          if (onComplete) onComplete();
        }
      }

      ctx.save();
      if (frameCount > 1400) {
        ctx.translate(camOffsetX, camOffsetY);
        ctx.scale(camScale, camScale);
      }

      // Render Heart Particles
      for (let i = heartParticles.length - 1; i >= 0; i--) {
        const p = heartParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // light gravity
        p.life--;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.size / 20, p.size / 20);
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        // Draw heart
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(0, -3, -5, -15, -15, -15);
        ctx.bezierCurveTo(-30, -15, -30, -2.5, -30, -2.5);
        ctx.bezierCurveTo(-30, 10, -15, 21, 0, 30);
        ctx.bezierCurveTo(15, 21, 30, 10, 30, -2.5);
        ctx.bezierCurveTo(30, -2.5, 30, -15, 15, -15);
        ctx.bezierCurveTo(5, -15, 0, -3, 0, 0);
        ctx.fill();
        ctx.restore();

        if (p.life <= 0) heartParticles.splice(i, 1);
      }

      enemies = enemies.filter(e => e.deathTimer < 60);

      if (frameCount <= 1100) {
        you.update(width, height, you, enemies, frameCount);
        you.draw(ctx, frameCount);

        me.update(width, height, you, enemies, frameCount);
        me.draw(ctx, frameCount);

        enemies.forEach(e => {
          e.update(width, height, you, enemies, frameCount);
          e.draw(ctx, frameCount);
        });
      }

      ctx.restore(); // Restore camera transform

      animationFrameId = requestAnimationFrame(render);
    };

    render();

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

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden animate-[fadeInVoid_0.5s_ease-in_forwards]">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {endingTextPhase === 1 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none px-4 text-center"
          style={{ animation: 'fadeInFinal 3s ease-out forwards' }}
        >
          <h1 className="text-3xl md:text-6xl text-white font-serif mb-4" style={{ textShadow: '0 0 20px #00FFFF' }}>
            I will always protect you.
          </h1>
          <p className="text-lg md:text-2xl text-pink-300 font-serif" style={{ textShadow: '0 0 10px #ffb3c6' }}>
            Forever and always.
          </p>
        </div>
      )}

      {endingTextPhase === 2 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none px-4 text-center"
          style={{ animation: 'fadeOutFinal 2s ease-in forwards' }}
        >
          <h1 className="text-3xl md:text-6xl text-white font-serif mb-4" style={{ textShadow: '0 0 20px #00FFFF' }}>
            I will always protect you.
          </h1>
          <p className="text-lg md:text-2xl text-pink-300 font-serif" style={{ textShadow: '0 0 10px #ffb3c6' }}>
            Forever and always.
          </p>
        </div>
      )}

      {endingTextPhase === 3 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none px-4 text-center"
          style={{ animation: 'fadeInFinal 4s ease-out forwards' }}
        >
          <h1 className="text-4xl md:text-7xl text-white font-serif mb-6 leading-tight" style={{ textShadow: '0 0 30px #ffb3c6' }}>
            You are my universe.
          </h1>
          <p className="text-2xl md:text-4xl text-pink-200 font-serif italic" style={{ textShadow: '0 0 15px #ff4d4d' }}>
            I love you endlessly.
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeInVoid {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeInFinal {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOutFinal {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); filter: blur(5px); }
        }
      `}</style>
    </div>
  );
}
