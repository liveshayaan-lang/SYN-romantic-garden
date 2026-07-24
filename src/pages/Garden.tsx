import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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

  const [showSongPrompt, setShowSongPrompt] = useState(false);
  const [songName, setSongName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSearchingSong, setIsSearchingSong] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('');
  
  // YouTube API state
  const [ytApiReady, setYtApiReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const ytPlayerRef = useRef<any>(null);

  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      setYtApiReady(true);
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
      
      (window as any).onYouTubeIframeAPIReady = () => {
        setYtApiReady(true);
      };
    }
  }, []);

  useEffect(() => {
    if (ytApiReady && currentVideoId && isPlaying) {
      if (!ytPlayerRef.current) {
        ytPlayerRef.current = new (window as any).YT.Player('hidden-yt-player', {
          height: '10',
          width: '10',
          videoId: currentVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: currentVideoId,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              event.target.setVolume(50);
              if (isMuted) {
                event.target.mute();
              }
              event.target.playVideo();
            }
          }
        });
      } else {
        ytPlayerRef.current.loadVideoById(currentVideoId);
        if (isMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      }
    }
  }, [ytApiReady, currentVideoId, isPlaying]);

  const toggleMute = () => {
    if (ytPlayerRef.current) {
      if (isMuted) {
        ytPlayerRef.current.unMute();
      } else {
        ytPlayerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    (window as any).duckMusic = (duck: boolean) => {
      if (ytPlayerRef.current && isPlaying && !isMuted) {
        // Duck to 10%, restore to 50%
        ytPlayerRef.current.setVolume(duck ? 10 : 50);
      }
    };
    return () => {
      delete (window as any).duckMusic;
    };
  }, [isPlaying, isMuted]);

  const handlePlaySong = async (queryOverride?: string) => {
    const rawQuery = queryOverride || songName;
    const query = rawQuery.trim() ? rawQuery : 'perfect ed sheeran';
    setIsSearchingSong(true);
    if (queryOverride) setSongName(queryOverride);
    
    // Check if the user pasted a direct YouTube URL
    const ytMatch = query.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
      setCurrentVideoId(ytMatch[1]);
      setIsSearchingSong(false);
      setIsPlaying(true);
      setShowSongPrompt(false);
      setShowButton(true);
      return;
    }
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      if (data && data.videoId) {
        setCurrentVideoId(data.videoId);
      } else {
        setCurrentVideoId('2Vv-BfVoq4g');
      }
    } catch (e) {
      setCurrentVideoId('2Vv-BfVoq4g');
    }
    
    setIsSearchingSong(false);
    setIsPlaying(true);
    setShowSongPrompt(false);
    setShowButton(true);
  };

  useEffect(() => {
    // Show song prompt after flower animations complete (~8.5 seconds)
    const t = setTimeout(() => setShowSongPrompt(true), 8500);
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
    "lock the song change command": () => { setSongCommandLocked(true); },
    "lock song change": () => { setSongCommandLocked(true); },
    "unlock the song change command": () => { setSongCommandLocked(false); },
    "unlock song command": () => { setSongCommandLocked(false); },
    "unlock song change": () => { setSongCommandLocked(false); },
    "unlock": () => { setSongCommandLocked(false); },
    "play": (t) => { 
      if (showSongPrompt && !isSearchingSong) {
        handlePlaySong(t.replace("play", "").trim());
      } else if (!songCommandLocked && !isSearchingSong && !showSongPrompt) {
        const query = t.replace("play", "").trim();
        if (query) handlePlaySong(query);
      }
    },
    "change song": (t) => {
      if (!songCommandLocked && !isSearchingSong) {
        const query = t.replace("change song", "").replace("to", "").trim();
        if (query) handlePlaySong(query);
      }
    },
    "change the song": (t) => {
      if (!songCommandLocked && !isSearchingSong) {
        const query = t.replace("change the song", "").replace("to", "").trim();
        if (query) handlePlaySong(query);
      }
    },
    "continue": () => { if (showSongPrompt && !isSearchingSong) handlePlaySong(); },
    "enter": () => { if (showButton && !isStorming) handleEnterClick(); },
    "tap enter": () => { if (showButton && !isStorming) handleEnterClick(); },
    "male": () => { if (showGenderPrompt) handleGenderSelect('male'); },
    "boy": () => { if (showGenderPrompt) handleGenderSelect('male'); },
    "female": () => { if (showGenderPrompt) handleGenderSelect('female'); },
    "girl": () => { if (showGenderPrompt) handleGenderSelect('female'); },
  }, (transcript, matched) => {
    // If they just say a song name without "play"
    if (!matched && showSongPrompt && !isSearchingSong) {
      handlePlaySong(transcript);
    }
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

      {/* Hidden YouTube Player Container */}
      <div className="fixed bottom-0 right-0 opacity-0 pointer-events-none z-[1]">
        <div id="hidden-yt-player"></div>
      </div>

      {/* Floating Audio Controls */}
      {isPlaying && currentVideoId && (
        <div className="fixed bottom-6 right-6 z-[100] animate-[fadeIn_2s_ease-out_forwards]">
          <button 
            onClick={toggleMute}
            className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full border border-pink-500/50 text-white hover:bg-black/60 transition-all shadow-[0_0_15px_rgba(255,20,80,0.3)] hover:scale-110 active:scale-95"
            title={isMuted ? "Unmute song" : "Mute song"}
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      )}

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

      {/* Song Selection Prompt */}
      {showSongPrompt && (
        <motion.div 
          className="absolute inset-0 z-[55] flex flex-col items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div 
             className="bg-[#2d0813]/90 border border-pink-500/30 p-6 md:p-10 rounded-3xl text-center shadow-[0_0_40px_rgba(255,20,80,0.4)] max-w-lg w-full"
             initial={{ scale: 0.9, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             transition={{ delay: 0.5, type: 'spring' }}
          >
            <h2 className="text-3xl md:text-5xl text-white font-serif mb-4" style={{ textShadow: '0 0 15px rgba(255, 100, 150, 0.5)' }}>
              Your Favorite Song
            </h2>
            <p className="text-pink-200 mb-6 md:mb-8 font-serif text-base md:text-lg">
              Tell me the name of your favorite song to play in our garden...
            </p>
            <input 
              type="text" 
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePlaySong()}
              placeholder="e.g. A song from SYN..."
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-black/50 border border-pink-500/50 rounded-xl text-white text-lg md:text-xl text-center placeholder-white/40 focus:outline-none focus:border-pink-400 mb-6 font-serif"
            />
            <button
              onClick={handlePlaySong}
              disabled={isSearchingSong}
              className="px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto bg-pink-600 hover:bg-pink-500 text-white font-serif text-lg md:text-xl rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,20,80,0.4)] disabled:opacity-50"
            >
              {isSearchingSong ? 'Finding Song...' : 'Play & Continue ❤️'}
            </button>
          </motion.div>
        </motion.div>
      )}

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
