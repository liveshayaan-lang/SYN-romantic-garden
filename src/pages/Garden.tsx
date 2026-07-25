import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlowerBouquet } from '@/components/garden/FlowerBouquet';
import { GrassField } from '@/components/garden/GrassField';
import { MessageBubble } from '@/components/garden/MessageBubble';
import { ParticleField } from '@/components/garden/ParticleField';
import { Firefly } from '@/components/garden/Firefly';
import { ParticleCountdown } from '@/components/garden/ParticleCountdown';
import { MagicButton } from '@/components/garden/MagicButton';
import { HangingVines } from '@/components/garden/HangingVines';
import { ProposalInterface } from '@/components/proposal/ProposalInterface';
import { SpiderClock } from '@/components/garden/SpiderClock';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

const MESSAGES = [
  { id: 0, text: 'You are my favorite person', x: '7%', y: '28%', mobileY: '15%', delay: 7.5 },
  { id: 1, text: "I'm lucky to have you", x: '63%', y: '26%', mobileY: '25%', delay: 8.2 },
  { id: 2, text: 'You make my world brighter', x: '4%', y: '57%', mobileY: '35%', delay: 8.8 },
  { id: 3, text: 'Every flower reminds me of you', x: '60%', y: '57%', mobileY: '45%', delay: 9.4 },
  { id: 4, text: 'Forever grateful for you', x: '30%', y: '83%', mobileY: '85%', delay: 10.0 },
];

const FIREFLY_COUNT = 18;

// Renders fast-moving wind streaks during the storm
const WindLines = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {Array.from({ length: 40 }).map((_, i) => {
        // Randomize the appearance of each wind streak
        const top = Math.random() * 100;
        const width = 200 + Math.random() * 600;
        const duration = 0.5 + Math.random() * 0.4;
        const delay = Math.random() * 1.5;
        
        return (
          <motion.div
            key={i}
            className="absolute h-[2px] bg-white/30 rounded-full"
            style={{ top: `${top}%`, width: `${width}px`, filter: 'blur(1px)' }}
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: '-150vw', opacity: [0, 1, 1, 0] }}
            transition={{ duration, delay, ease: 'linear' }}
          />
        );
      })}
    </div>
  );
};

// YouTube system removed by user request

export default function Garden() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [bounds, setBounds] = useState({ w: 1280, h: 800 });
  const [showCountdown, setShowCountdown] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isStorming, setIsStorming] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [showGenderPrompt, setShowGenderPrompt] = useState(false);
  const [visitorGender, setVisitorGender] = useState<'male' | 'female' | null>(null);
  const [songCommandLocked, setSongCommandLocked] = useState(false);
  const [showOwner, setShowOwner] = useState(false);

  // YT UseEffect removed

  useEffect(() => {
    const handleVoiceWake = () => {
      setIsMicAwake(true);
    };
    
    const handleVoiceSleep = () => {
      setIsMicAwake(false);
    };

    window.addEventListener('voiceWake', handleVoiceWake);
    window.addEventListener('voiceSleep', handleVoiceSleep);

    return () => {
      window.removeEventListener('voiceWake', handleVoiceWake);
      window.removeEventListener('voiceSleep', handleVoiceSleep);
    };
  }, []);

  // duckMusic removed to prevent audio stuttering

  // handlePlaySong removed

  useEffect(() => {
    // Show the Enter button after flower animations complete (~8.5 seconds)
    const t = setTimeout(() => setShowButton(true), 8500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const update = () => setBounds({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX / bounds.w, y: e.clientY / bounds.h });
  };

  const handleEnterClick = () => {
    setIsStorming(true);
    setShowButton(false);
    // Give the 2-second storm animation time to finish before showing the gender prompt
    setTimeout(() => {
      setShowGenderPrompt(true);
    }, 1800); 
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setVisitorGender(gender);
    setShowGenderPrompt(false);
    setShowCountdown(true);
  };

  // Voice Commands
  useVoiceCommand({
    "restart the website": () => { window.location.reload(); },
    "owner": () => { setShowOwner(true); },
    "close owner": () => { setShowOwner(false); },
    "enter": () => { if (showButton && !isStorming) handleEnterClick(); },
    "tap enter": () => { if (showButton && !isStorming) handleEnterClick(); },
    "male": () => { if (showGenderPrompt) handleGenderSelect('male'); },
    "boy": () => { if (showGenderPrompt) handleGenderSelect('male'); },
    "female": () => { if (showGenderPrompt) handleGenderSelect('female'); },
    "girl": () => { if (showGenderPrompt) handleGenderSelect('female'); },
  });

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 55% 65%, #2d0813 0%, #160408 45%, #000000 100%)',
        cursor: 'default',
      }}
      onMouseMove={handleMouseMove}
    >
      <WindLines active={isStorming} />

      {/* UI Elements removed */}

      {/* Blackout overlay for the storm transition */}
      <motion.div 
        className="absolute inset-0 bg-black pointer-events-none z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isStorming ? 0.95 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* Ambient cursor light */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(160,25,45,0.13) 0%, transparent 42%)`,
          transition: 'background 1s ease-out',
        }}
      />

      {/* Decorative Hanging Vines (Internal staggered animation) */}
      <HangingVines isStorming={isStorming} />

      {/* Canvas particles (Gets completely blurred and swept away) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isStorming ? { x: -2000, opacity: 0, filter: 'blur(10px)' } : { opacity: 1 }}
        transition={isStorming ? { duration: 1.2, delay: 0.2, ease: 'easeIn' } : { duration: 2, delay: 1 }}
        style={!isStorming ? { transform: `translate(${(mousePos.x - 0.5) * -150}px, ${(mousePos.y - 0.5) * -80}px)` } : {}}
      >
        <ParticleField />
      </motion.div>

      {/* Fireflies (Blown away almost instantly, very light) */}
      <motion.div
        animate={isStorming ? { x: -2500, y: -500, opacity: 0 } : {}}
        transition={{ duration: 1.2, delay: 0, ease: 'easeIn' }}
      >
        {Array.from({ length: FIREFLY_COUNT }).map((_, i) => (
          <Firefly key={i} bounds={bounds} delay={6.5 + i * 0.3} />
        ))}
      </motion.div>

      {/* Parallax scene containing grass and main flowers */}
      <motion.div
        className="absolute inset-0"
        animate={isStorming ? {} : {
          x: (0.5 - mousePos.x) * 100,
          y: (0.5 - mousePos.y) * 40,
        }}
        transition={{ type: 'spring', stiffness: 28, damping: 24 }}
      >
        {bounds.w < 768 ? (
          <>
            {/* --- MOBILE LAYOUT --- */}
            {/* Mobile Grass */}
            <div className="absolute bottom-0 left-0 w-1/2 h-full scale-[0.55] origin-bottom-left pointer-events-none z-0">
              <GrassField side="left" isStorming={isStorming} />
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full scale-[0.55] origin-bottom-right pointer-events-none z-0">
              <GrassField side="right" isStorming={isStorming} />
            </div>

            {/* Mobile Bouquet - Anchored to the very bottom */}
            <div className="absolute bottom-[8%] w-full h-full flex items-end justify-center pointer-events-none scale-[2.0] origin-bottom z-10">
              <FlowerBouquet mouseX={0.5} isStorming={isStorming} />
            </div>

            {/* Mobile Messages Stacked */}
            <div className="absolute inset-0 pointer-events-none z-30">
              {MESSAGES.map((m) => (
                <motion.div
                  key={m.id}
                  animate={isStorming ? { x: -2000, rotate: -90, opacity: 0 } : {}}
                  transition={{ duration: 1.3, delay: m.delay * 0.05, ease: 'easeIn' }}
                >
                  <MessageBubble text={m.text} x="50%" y={m.mobileY} delay={m.delay} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* --- DESKTOP LAYOUT --- */}
            {/* Desktop Grass */}
            <GrassField side="left" isStorming={isStorming} />
            <GrassField side="right" isStorming={isStorming} />

            {/* Desktop Bouquet */}
            <div className="absolute bottom-0 w-full h-full flex items-end justify-center pointer-events-none">
              <FlowerBouquet mouseX={mousePos.x} isStorming={isStorming} />
            </div>

            {/* Desktop Messages */}
            {MESSAGES.map((m) => (
              <motion.div
                key={m.id}
                animate={isStorming ? { x: -2000, rotate: -90, opacity: 0 } : {}}
                transition={{ duration: 1.3, delay: m.delay * 0.05, ease: 'easeIn' }}
              >
                <MessageBubble text={m.text} x={m.x} y={m.y} delay={m.delay} />
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Prompt removed */}
      {/* Trigger Button */}
      {showButton && !isStorming && (
        <div className="animate-[fadeIn_2s_ease-out_forwards]">
          <MagicButton onClick={handleEnterClick} />
        </div>
      )}

      {/* Gender Selection Prompt */}
      {showGenderPrompt && (
        <motion.div 
          className="absolute inset-0 z-[55] flex flex-col items-center justify-center pointer-events-auto bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl text-white font-serif mb-12"
            style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Who is entering the garden?
          </motion.h2>
          
          <div className="flex gap-8">
            <motion.button
              onClick={() => handleGenderSelect('male')}
              className="px-8 py-4 text-2xl font-serif text-white rounded-xl border border-white/20 hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Male
            </motion.button>
            <motion.button
              onClick={() => handleGenderSelect('female')}
              className="px-8 py-4 text-2xl font-serif text-white rounded-xl border border-white/20 hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Female
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Fullscreen Countdown Animation */}
      {showCountdown && (
        <div className="absolute inset-0 z-50">
          <ParticleCountdown onComplete={() => setShowProposal(true)} />
        </div>
      )}

      {/* The Ultimate Proposal Interface */}
      {showProposal && (
        <div className="absolute inset-0 z-[60]">
          <ProposalInterface visitorGender={visitorGender || 'female'} />
        </div>
      )}

      {/* Spider Clock (Shows after clicking enter) */}
      {isStorming && <SpiderClock />}

      {/* Owner Info Modal */}
      {showOwner && (
        <motion.div 
          className="absolute inset-0 z-[200] flex flex-col items-center justify-center pointer-events-auto bg-black/80 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative max-w-2xl w-full bg-[#160408]/90 border border-pink-500/30 p-6 md:p-8 rounded-3xl shadow-[0_0_40px_rgba(255,20,80,0.4)] flex flex-col items-center text-center">
            <button 
              onClick={() => setShowOwner(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl md:text-4xl text-white font-serif mb-6" style={{ textShadow: '0 0 15px rgba(255, 100, 150, 0.5)' }}>
              Meet the Owner
            </h2>
            <img 
              src="https://i.postimg.cc/3w9R697R/d5b826a1-ddc5-40ee-9581-51697f1bca73.jpg" 
              alt="Website Owner" 
              className="w-full max-h-[50vh] object-contain rounded-xl mb-6 shadow-2xl"
            />
            <p className="text-pink-100 font-serif text-lg md:text-xl mb-4">
              This is the owner of the website.
            </p>
            <p className="text-gray-300 font-serif text-base md:text-lg mb-8 leading-relaxed">
              If you want to explore more of their websites and artworks, you can click the link below to download their APK.
            </p>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="px-8 py-3 md:py-4 bg-pink-600 hover:bg-pink-500 text-white font-serif text-lg rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,20,80,0.4)] inline-block"
            >
              Download APK
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );
}
