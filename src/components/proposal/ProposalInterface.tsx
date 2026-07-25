import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingHearts } from './FloatingHearts';
import { StickmanBattle } from './StickmanBattle';
import { EarthDate } from './EarthDate';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

export function ProposalInterface({ visitorGender = 'female' }: { visitorGender?: 'male' | 'female' }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [showProtectPrompt, setShowProtectPrompt] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [showEarthDate, setShowEarthDate] = useState(false);

  useEffect(() => {
    if (accepted) {
      const timer = setTimeout(() => {
        setShowProtectPrompt(true);
      }, 2500); // Wait 2.5 seconds showing FOREVER before showing the prompt
      
      const autoClickTimer = setTimeout(() => {
        setShowBattle(true);
      }, 6500); // Auto-click "Show me!" 4 seconds after the prompt appears

      return () => {
        clearTimeout(timer);
        clearTimeout(autoClickTimer);
      };
    }
  }, [accepted]);

  const handleNoHover = () => {
    // Move the 'No' button randomly away from the cursor, bounded by screen size
    const maxX = Math.min(window.innerWidth * 0.35, 250);
    const maxY = Math.min(window.innerHeight * 0.35, 250);
    const randomX = (Math.random() - 0.5) * maxX * 2;
    const randomY = (Math.random() - 0.5) * maxY * 2;
    setNoPosition({ x: randomX, y: randomY });
  };

  useVoiceCommand({
    "yes": () => { if (!accepted) setAccepted(true); },
    "i will": () => { if (!accepted) setAccepted(true); },
    "no": () => { if (!accepted) handleNoHover(); },
    "show me": () => { if (showProtectPrompt) setShowBattle(true); },
  });

  if (showEarthDate) {
    return <EarthDate />;
  }

  if (showBattle) {
    return <StickmanBattle visitorGender={visitorGender} onComplete={() => setShowEarthDate(true)} />;
  }

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden font-serif"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{
        background: 'radial-gradient(ellipse at center, #1c020b 0%, #000000 100%)'
      }}
    >
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div 
            key="proposal-card"
            className="relative z-10 p-8 md:p-12 mx-4 max-w-xl text-center rounded-3xl"
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, delay: 0.5 }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
            }}
          >
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-wide"
              style={{ textShadow: '0 0 20px rgba(255, 94, 108, 0.8)' }}
            >
              My Love,
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 mb-12 leading-relaxed">
              Every flower in this garden blooms just for you. From the moment you entered my life, 
              everything became infinitely brighter and more beautiful. I want to spend the rest 
              of my life making you smile.
            </p>

            <h2 className="text-3xl md:text-4xl text-white mb-10 italic">
              Would you like to spend the rest of your life with me?
            </h2>

            <div className="flex flex-row items-center justify-center gap-4 md:gap-8 relative z-20">
              <button
                onClick={() => setAccepted(true)}
                className="px-6 py-2 md:px-8 md:py-3 text-lg md:text-xl font-bold text-white rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                style={{
                  background: 'linear-gradient(45deg, #ff5e6c, #ff2a40)',
                  boxShadow: '0 0 20px rgba(255, 94, 108, 0.5), inset 0 0 10px rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255,255,255,0.4)'
                }}
              >
                Yes!
              </button>

              <motion.button
                onMouseEnter={handleNoHover}
                onClick={handleNoHover} // for touch devices
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="px-6 py-2 md:px-8 md:py-3 text-lg md:text-xl font-bold text-gray-300 rounded-full transition-colors hover:text-white cursor-pointer shadow-lg"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(5px)'
                }}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="celebration"
            className="relative z-10 flex flex-col items-center justify-center text-center px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 1.5 }}
          >
            <h1 
              className="text-4xl md:text-7xl text-white mb-4 tracking-widest"
              style={{ textShadow: '0 0 30px rgba(255, 94, 108, 1), 0 0 60px #ff2a40' }}
            >
              FOREVER
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 tracking-wider">
              I love you so much.
            </p>

            <AnimatePresence>
              {showProtectPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="mt-12 flex flex-col items-center"
                >
                  <p 
                    className="text-xl md:text-3xl text-white mb-8 font-serif italic px-4"
                    style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.6)' }}
                  >
                    Do you want to see how I will protect you?
                  </p>
                  <button
                    onClick={() => setShowBattle(true)}
                    className="px-10 py-5 text-2xl font-black text-white rounded-full transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl animate-pulse relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                      boxShadow: '0 0 40px rgba(0, 198, 255, 0.8), inset 0 0 15px rgba(255,255,255,0.8)',
                      border: '2px solid rgba(255,255,255,0.6)',
                      textShadow: '0 0 10px rgba(255,255,255,0.5)'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      ✨ Show me! ✨
                    </span>
                    <div className="absolute inset-0 bg-white/20 blur-xl animate-pulse" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
