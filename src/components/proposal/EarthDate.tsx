import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import { FinalScreen } from './FinalScreen';
import { CameraHologram } from './CameraHologram';
import { useVoiceCommand } from '@/hooks/useVoiceCommand';

// Snow Particle Component
function Snow() {
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

    const particles: { x: number; y: number; r: number; d: number }[] = [];
    const mp = 200;
    for (let i = 0; i < mp; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 3 + 1,
        d: Math.random() * mp
      });
    }

    let angle = 0;
    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    const update = () => {
      angle += 0.01;
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
        p.x += Math.sin(angle) * 2;

        if (p.x > width + 5 || p.x < -5 || p.y > height) {
          if (i % 3 > 0) {
            particles[i] = { x: Math.random() * width, y: -10, r: p.r, d: p.d };
          } else {
            if (Math.sin(angle) > 0) {
              particles[i] = { x: -5, y: Math.random() * height, r: p.r, d: p.d };
            } else {
              particles[i] = { x: width + 5, y: Math.random() * height, r: p.r, d: p.d };
            }
          }
        }
      }
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
}

const markersData = [
  { 
    lat: 15, lng: -30, name: 'My Heart ❤️', color: '#ff2a40', maxR: 12, propagationSpeed: 2, repeatPeriod: 800,
    description: "The most exclusive destination, reserved only for you.",
    isSpecial: true,
    places: [
      { name: "Outside", img: "https://loremflickr.com/400/300/heart,outside/all" },
      { name: "Inside", img: "https://loremflickr.com/400/300/heart,inside/all" }
    ]
  },
  { 
    lat: 48.8566, lng: 2.3522, name: 'Paris, France', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "The city of love. A perfect place for a romantic evening by the Seine.",
    places: [
      { name: "Eiffel Tower", img: "https://loremflickr.com/400/300/eiffeltower,paris/all" },
      { name: "Louvre Museum", img: "https://loremflickr.com/400/300/louvre,museum/all" },
      { name: "Montmartre", img: "https://loremflickr.com/400/300/montmartre,paris/all" }
    ]
  },
  { 
    lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "Experience the vibrant energy, neon lights, and incredible culture of Japan.",
    places: [
      { name: "Tokyo City", img: "https://loremflickr.com/400/300/tokyo,city/all" },
      { name: "Shibuya Crossing", img: "https://loremflickr.com/400/300/shibuya,crossing/all" },
      { name: "Mount Fuji", img: "https://loremflickr.com/400/300/mountfuji,japan/all" }
    ]
  },
  { 
    lat: 3.2028, lng: 73.2207, name: 'The Maldives', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "A tropical paradise with crystal clear waters and overwater bungalows.",
    places: [
      { name: "Overwater Villa", img: "https://loremflickr.com/400/300/maldives,villa/all" },
      { name: "Coral Reefs", img: "https://loremflickr.com/400/300/coral,reef/all" },
      { name: "Bioluminescent Beach", img: "https://loremflickr.com/400/300/bioluminescent,beach/all" }
    ]
  },
  { 
    lat: 41.9028, lng: 12.4964, name: 'Rome, Italy', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "Walk through history and share some authentic Italian gelato.",
    places: [
      { name: "Colosseum", img: "https://loremflickr.com/400/300/colosseum,rome/all" },
      { name: "Trevi Fountain", img: "https://loremflickr.com/400/300/trevifountain,rome/all" },
      { name: "Pantheon", img: "https://loremflickr.com/400/300/pantheon,rome/all" }
    ]
  },
  { 
    lat: 40.7128, lng: -74.0060, name: 'New York, USA', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "The city that never sleeps. Perfect for a late night stroll in Central Park.",
    places: [
      { name: "Central Park", img: "https://loremflickr.com/400/300/centralpark,newyork/all" },
      { name: "Times Square", img: "https://loremflickr.com/400/300/timessquare,newyork/all" },
      { name: "Empire State", img: "https://loremflickr.com/400/300/empirestate,building/all" }
    ]
  },
  { 
    lat: 21.3069, lng: -157.8583, name: 'Hawaii, USA', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "Breathtaking sunsets, lush mountains, and the aloha spirit.",
    places: [
      { name: "Waikiki Beach", img: "https://loremflickr.com/400/300/waikiki,beach/all" },
      { name: "Volcanoes Park", img: "https://loremflickr.com/400/300/volcano,hawaii/all" },
      { name: "Na Pali Coast", img: "https://loremflickr.com/400/300/napali,coast/all" }
    ]
  },
  { 
    lat: 25.1972, lng: 55.2744, name: 'Dubai, UAE', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "A blend of futuristic architecture and vast desert landscapes.",
    places: [
      { name: "Burj Khalifa", img: "https://loremflickr.com/400/300/burjkhalifa,dubai/all" },
      { name: "Palm Jumeirah", img: "https://loremflickr.com/400/300/palmjumeirah,dubai/all" },
      { name: "Dubai Desert", img: "https://loremflickr.com/400/300/desert,dubai/all" }
    ]
  },
  { 
    lat: -8.4095, lng: 115.1889, name: 'Bali, Indonesia', color: '#ff2a40', maxR: 6, propagationSpeed: 1.5, repeatPeriod: 1000,
    description: "A spiritual and romantic retreat amidst nature and ocean cliffs.",
    places: [
      { name: "Uluwatu Temple", img: "https://loremflickr.com/400/300/uluwatu,temple/all" },
      { name: "Ubud Monkey Forest", img: "https://loremflickr.com/400/300/ubud,forest/all" },
      { name: "Tegallalang Rice Terrace", img: "https://loremflickr.com/400/300/riceterrace,bali/all" }
    ]
  }
];

export function EarthDate() {
  const globeEl = useRef<any>(null);
  const [isGlobeVisible, setIsGlobeVisible] = useState(false);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hoveredLocation, setHoveredLocation] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  const [isConfirming, setIsConfirming] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setShowFinalScreen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlobeVisible(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isGlobeVisible && globeEl.current && !selectedLocation) {
      const isMobile = window.innerWidth < 768;
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      // Focus initially on "My Heart" location in the Atlantic. Zoom out more on mobile.
      globeEl.current.pointOfView({ lat: 15, lng: -30, altitude: isMobile ? 3.2 : 2.2 }, 4000);
    }
  }, [isGlobeVisible, selectedLocation]);

  const handleLocationClick = (loc: any) => {
    setSelectedLocation(loc);
    setSelectedPlace(null);
    setIsConfirming(false);
    setSubmitSuccess(false);
    if (globeEl.current) {
      const isMobile = window.innerWidth < 768;
      // Zoom in a bit less on mobile so it's visible above the bottom sheet
      globeEl.current.pointOfView({ lat: loc.lat, lng: loc.lng, altitude: isMobile ? 0.8 : 0.4 }, 1500);
      globeEl.current.controls().autoRotate = false;
    }
  };

  const handleClosePanel = () => {
    if (submitSuccess) {
      setShowFinalScreen(true);
      return;
    }
    
    setSelectedLocation(null);
    setSelectedPlace(null);
    setIsConfirming(false);
    setSubmitSuccess(false);
    if (globeEl.current) {
      const isMobile = window.innerWidth < 768;
      globeEl.current.pointOfView({ lat: 15, lng: -30, altitude: isMobile ? 3.2 : 2.2 }, 1500);
      globeEl.current.controls().autoRotate = true;
    }
  };

  const handleSendResponse = async () => {
    if (!selectedLocation || !selectedPlace || !visitorName) return;
    
    setIsSubmitting(true);
    
    try {
      await fetch("https://formsubmit.co/ajax/liveshayaan@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Date Confirmation from ${visitorName}! ❤️`,
          Visitor: visitorName,
          Message: `I would love to go on a date with you to ${selectedPlace.name} in ${selectedLocation.name}! Can't wait! 🥰`,
          _captcha: "false"
        })
      });
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitSuccess(true);
    }
    
    setIsSubmitting(false);
  };

  const handleGlobeClick = ({ lat, lng }: { lat: number, lng: number }) => {
    const clickedMarker = markersData.find((marker) => {
      const dLat = marker.lat - lat;
      const dLng = marker.lng - lng;
      const distance = Math.sqrt(dLat * dLat + dLng * dLng);
      // "My Heart" has maxR 12, others 6
      return distance <= (marker.maxR || 6); 
    });

    if (clickedMarker) {
      handleLocationClick(clickedMarker);
    }
  };

  const confirmSelection = () => {
    if (selectedLocation && selectedPlace && !isConfirming) {
      if (selectedLocation.isSpecial) {
        setSubmitSuccess(true);
        setIsConfirming(true);
      } else {
        setIsConfirming(true);
      }
    }
  };

  useVoiceCommand({
    "open camera": () => setShowCamera(true),
    "camera kholo": () => setShowCamera(true),
    "my heart": () => handleLocationClick(markersData[0]),
    "paris": () => handleLocationClick(markersData[1]),
    "tokyo": () => handleLocationClick(markersData[2]),
    "maldives": () => handleLocationClick(markersData[3]),
    "rome": () => handleLocationClick(markersData[4]),
    "new york": () => handleLocationClick(markersData[5]),
    "hawaii": () => handleLocationClick(markersData[6]),
    "dubai": () => handleLocationClick(markersData[7]),
    "bali": () => handleLocationClick(markersData[8]),
    "go there": confirmSelection,
    "let's go": confirmSelection,
    "send response": () => {
      if (isConfirming && visitorName && !isSubmitting) {
        handleSendResponse();
      }
    },
    "send": () => {
      if (isConfirming && visitorName && !isSubmitting) {
        handleSendResponse();
      }
    }
  }, (transcript, matched) => {
    // If they are on the name confirmation screen and speak something unmatched, assume it's their name
    if (!matched && isConfirming && !submitSuccess && !isSubmitting) {
      // Capitalize first letter of the spoken name
      const name = transcript.charAt(0).toUpperCase() + transcript.slice(1);
      setVisitorName(name);
    }
  });

  return (
    <div 
      className="fixed inset-0 z-[120] bg-[#05050a] overflow-hidden flex flex-col items-center justify-center animate-[fadeInVoid_1s_ease-in_forwards]"
      style={{ cursor: hoveredLocation ? 'pointer' : 'default' }}
    >
      <Snow />
      
      <AnimatePresence>
        {!selectedLocation && (
          <motion.div 
            className="absolute z-30 text-center px-4 top-[15%] md:top-[12%]"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1 }}
          >
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl text-white font-serif tracking-wide leading-tight"
              style={{ textShadow: '0 0 20px #00FFFF, 0 0 40px #00FFFF' }}
            >
              Where would you like to go on a date with me?
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {isGlobeVisible && (
        <motion.div 
          className="absolute z-20 flex items-center justify-center w-full h-full pt-24 pointer-events-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 4, ease: 'easeOut' }}
        >
          <Globe
            ref={globeEl}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            atmosphereColor="#00FFFF"
            atmosphereAltitude={0.15}
            ringsData={markersData}
            ringColor={(d: any) => d.color}
            ringMaxRadius="maxR"
            ringPropagationSpeed="propagationSpeed"
            ringRepeatPeriod="repeatPeriod"
            labelsData={markersData}
            labelLat="lat"
            labelLng="lng"
            labelText="name"
            labelSize={2.5}
            labelDotRadius={0.5}
            labelColor={() => '#ffffff'}
            labelResolution={3}
            onLabelClick={handleLocationClick}
            onRingClick={handleLocationClick}
            onGlobeClick={handleGlobeClick}
            onLabelHover={setHoveredLocation}
            onRingHover={setHoveredLocation}
          />
        </motion.div>
      )}

      {/* Side Panel / Bottom Sheet for Selected Location */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            className="absolute bottom-0 md:right-0 md:top-0 h-[70%] md:h-full w-full md:w-[400px] z-40 bg-black/60 backdrop-blur-xl border-t md:border-l md:border-t-0 border-white/10 p-6 flex flex-col overflow-y-auto rounded-t-3xl md:rounded-none"
            initial={{ y: '100%', x: 0 }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: '100%', x: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Drag Handle for mobile aesthetics (non-functional but looks native) */}
            <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-4 md:hidden" />

            <button 
              onClick={handleClosePanel}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h2 className="text-3xl font-serif text-white mt-10 mb-2" style={{ textShadow: '0 0 10px #ff2a40' }}>
              {selectedLocation.name}
            </h2>
            <p className="text-gray-300 italic mb-6">
              {selectedLocation.description}
            </p>

            <h3 className="text-xl text-white font-serif mb-4 border-b border-white/20 pb-2">
              {selectedLocation.isSpecial ? "Where would you like to go in my heart?" : "Select a Place to Visit"}
            </h3>
            
            <div className="flex flex-col gap-4 flex-1">
              {selectedLocation.places.map((place: any, idx: number) => {
                const isSelected = selectedPlace?.name === place.name;
                return (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedPlace(place)}
                    className={`group relative rounded-xl overflow-hidden shadow-2xl border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.5)] scale-[1.02]' : 'border-white/10 hover:border-white/40'
                    }`}
                  >
                    <div className={`absolute inset-0 z-10 transition-colors ${isSelected ? 'bg-black/20' : 'bg-black/50 group-hover:bg-black/30'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                    
                    <img 
                      src={place.img} 
                      alt={place.name} 
                      className={`w-full h-32 object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                      loading="lazy"
                    />
                    
                    <div className="absolute bottom-3 left-4 z-20 flex items-center justify-between w-[calc(100%-2rem)]">
                      <span className="text-white font-serif text-lg tracking-wide">{place.name}</span>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="w-6 h-6 rounded-full bg-[#00FFFF] flex items-center justify-center shadow-[0_0_10px_#00FFFF]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {!isConfirming ? (
                <motion.button 
                  key="btn-confirm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={confirmSelection}
                  disabled={!selectedPlace}
                  className={`mt-8 w-full py-4 rounded-full font-bold text-lg transition-all ${
                    selectedPlace 
                      ? "bg-gradient-to-r from-[#ff2a40] to-[#ff5e6c] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,42,64,0.5)] cursor-pointer" 
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {selectedPlace ? (selectedLocation.isSpecial ? "Go there! ❤️" : "Let's go here! ❤️") : "Please select a place"}
                </motion.button>
              ) : submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 text-center"
                >
                  <p className="text-xl md:text-2xl text-[#00FFFF] font-serif mb-2 leading-relaxed" style={{ textShadow: '0 0 10px #00FFFF' }}>
                    {selectedLocation.isSpecial ? "Oh no! You are already inside my heart, what will you do going there? 🥰" : "It's a Date! 🥰"}
                  </p>
                  {!selectedLocation.isSpecial && (
                    <p className="text-white/80">
                      Your response has been secretly sent to him!
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 flex flex-col gap-3"
                >
                  <label className="text-white/80 text-sm">Please type your name to confirm:</label>
                  <input 
                    type="text" 
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Your Name..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#ff2a40] transition-colors"
                  />
                  <button 
                    onClick={handleSendResponse}
                    disabled={!visitorName || isSubmitting}
                    className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
                      visitorName && !isSubmitting
                        ? "bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,198,255,0.5)] cursor-pointer" 
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "Sending... 💌" : "Send Response! 💌"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes fadeInVoid {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
      
      {showFinalScreen && <FinalScreen />}
      <AnimatePresence>
        {showCamera && <CameraHologram onClose={() => setShowCamera(false)} />}
      </AnimatePresence>
    </div>
  );
}
