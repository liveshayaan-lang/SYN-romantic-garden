import React from 'react';
import { motion } from 'framer-motion';
import './flowers.css';

export function FlowerBouquet({ mouseX = 0.5, isStorming = false }: { mouseX?: number, isStorming?: boolean }) {
  const getStorm = (delay: number) => 
    isStorming ? { x: -1500 - Math.random() * 500, y: -200 - Math.random() * 300, rotate: -45 - Math.random() * 90, opacity: 0 } : {};
    
  return (
    <>
<div className="flowers">
    <motion.div 
      className="flower flower--1"
      animate={getStorm(0.1)}
      transition={{ duration: 1.5, delay: isStorming ? 0.3 : 0, ease: 'easeIn' }}
    >
      <div className="flower__leafs flower__leafs--1">
        <div className="flower__leaf flower__leaf--1"></div>
        <div className="flower__leaf flower__leaf--2"></div>
        <div className="flower__leaf flower__leaf--3"></div>
        <div className="flower__leaf flower__leaf--4"></div>
        <div className="flower__white-circle"></div>

        <div className="flower__light flower__light--1"></div>
        <div className="flower__light flower__light--2"></div>
        <div className="flower__light flower__light--3"></div>
        <div className="flower__light flower__light--4"></div>
        <div className="flower__light flower__light--5"></div>
        <div className="flower__light flower__light--6"></div>
        <div className="flower__light flower__light--7"></div>
        <div className="flower__light flower__light--8"></div>

      </div>
      <div className="flower__line">
        <div className="flower__line__leaf flower__line__leaf--1"></div>
        <div className="flower__line__leaf flower__line__leaf--2"></div>
        <div className="flower__line__leaf flower__line__leaf--3"></div>
        <div className="flower__line__leaf flower__line__leaf--4"></div>
        <div className="flower__line__leaf flower__line__leaf--5"></div>
        <div className="flower__line__leaf flower__line__leaf--6"></div>
      </div>
    </motion.div>

    <motion.div 
      className="flower flower--2"
      animate={getStorm(0.3)}
      transition={{ duration: 1.4, delay: isStorming ? 0.1 : 0, ease: 'easeIn' }}
    >
      <div className="flower__leafs flower__leafs--2">
        <div className="flower__leaf flower__leaf--1"></div>
        <div className="flower__leaf flower__leaf--2"></div>
        <div className="flower__leaf flower__leaf--3"></div>
        <div className="flower__leaf flower__leaf--4"></div>
        <div className="flower__white-circle"></div>

        <div className="flower__light flower__light--1"></div>
        <div className="flower__light flower__light--2"></div>
        <div className="flower__light flower__light--3"></div>
        <div className="flower__light flower__light--4"></div>
        <div className="flower__light flower__light--5"></div>
        <div className="flower__light flower__light--6"></div>
        <div className="flower__light flower__light--7"></div>
        <div className="flower__light flower__light--8"></div>

      </div>
      <div className="flower__line">
        <div className="flower__line__leaf flower__line__leaf--1"></div>
        <div className="flower__line__leaf flower__line__leaf--2"></div>
        <div className="flower__line__leaf flower__line__leaf--3"></div>
        <div className="flower__line__leaf flower__line__leaf--4"></div>
      </div>
    </motion.div>

    <motion.div 
      className="flower flower--3"
      animate={getStorm(0.2)}
      transition={{ duration: 1.6, delay: isStorming ? 0.5 : 0, ease: 'easeIn' }}
    >
      <div className="flower__leafs flower__leafs--3">
        <div className="flower__leaf flower__leaf--1"></div>
        <div className="flower__leaf flower__leaf--2"></div>
        <div className="flower__leaf flower__leaf--3"></div>
        <div className="flower__leaf flower__leaf--4"></div>
        <div className="flower__white-circle"></div>

        <div className="flower__light flower__light--1"></div>
        <div className="flower__light flower__light--2"></div>
        <div className="flower__light flower__light--3"></div>
        <div className="flower__light flower__light--4"></div>
        <div className="flower__light flower__light--5"></div>
        <div className="flower__light flower__light--6"></div>
        <div className="flower__light flower__light--7"></div>
        <div className="flower__light flower__light--8"></div>

      </div>
      <div className="flower__line">
        <div className="flower__line__leaf flower__line__leaf--1"></div>
        <div className="flower__line__leaf flower__line__leaf--2"></div>
        <div className="flower__line__leaf flower__line__leaf--3"></div>
        <div className="flower__line__leaf flower__line__leaf--4"></div>
      </div>
    </motion.div>

    <motion.div 
      className="grow-ans" style={{ "--d": "1.2s" } as React.CSSProperties}
      animate={getStorm(0.4)}
      transition={{ duration: 1.5, delay: isStorming ? 0.2 : 0, ease: 'easeIn' }}
    >
      <div className="flower__g-long">
        <div className="flower__g-long__top"></div>
        <div className="flower__g-long__bottom"></div>
      </div>
    </motion.div>

    <motion.div 
      className="growing-grass"
      animate={getStorm(0.5)}
      transition={{ duration: 1.3, delay: isStorming ? 0.4 : 0, ease: 'easeIn' }}
    >
      <div className="flower__grass flower__grass--1">
        <div className="flower__grass--top"></div>
        <div className="flower__grass--bottom"></div>
        <div className="flower__grass__leaf flower__grass__leaf--1"></div>
        <div className="flower__grass__leaf flower__grass__leaf--2"></div>
        <div className="flower__grass__leaf flower__grass__leaf--3"></div>
        <div className="flower__grass__leaf flower__grass__leaf--4"></div>
        <div className="flower__grass__leaf flower__grass__leaf--5"></div>
        <div className="flower__grass__leaf flower__grass__leaf--6"></div>
        <div className="flower__grass__leaf flower__grass__leaf--7"></div>
        <div className="flower__grass__leaf flower__grass__leaf--8"></div>
        <div className="flower__grass__overlay"></div>
      </div>
    </motion.div>

    <motion.div 
      className="growing-grass"
      animate={getStorm(0.6)}
      transition={{ duration: 1.2, delay: isStorming ? 0.15 : 0, ease: 'easeIn' }}
    >
      <div className="flower__grass flower__grass--2">
        <div className="flower__grass--top"></div>
        <div className="flower__grass--bottom"></div>
        <div className="flower__grass__leaf flower__grass__leaf--1"></div>
        <div className="flower__grass__leaf flower__grass__leaf--2"></div>
        <div className="flower__grass__leaf flower__grass__leaf--3"></div>
        <div className="flower__grass__leaf flower__grass__leaf--4"></div>
        <div className="flower__grass__leaf flower__grass__leaf--5"></div>
        <div className="flower__grass__leaf flower__grass__leaf--6"></div>
        <div className="flower__grass__leaf flower__grass__leaf--7"></div>
        <div className="flower__grass__leaf flower__grass__leaf--8"></div>
        <div className="flower__grass__overlay"></div>
      </div>
    </motion.div>

    <motion.div 
      className="grow-ans" style={{ "--d": "2.4s" } as React.CSSProperties}
      animate={getStorm(0.7)}
      transition={{ duration: 1.6, delay: isStorming ? 0.35 : 0, ease: 'easeIn' }}
    >
      <div className="flower__g-right flower__g-right--1">
        <div className="leaf"></div>
      </div>
    </motion.div>

    <motion.div 
      className="grow-ans" style={{ "--d": "2.8s" } as React.CSSProperties}
      animate={getStorm(0.8)}
      transition={{ duration: 1.4, delay: isStorming ? 0.25 : 0, ease: 'easeIn' }}
    >
      <div className="flower__g-right flower__g-right--2">
        <div className="leaf"></div>
      </div>
    </motion.div>

    <motion.div 
      className="grow-ans" style={{ "--d": "2.8s" } as React.CSSProperties}
      animate={getStorm(0.9)}
      transition={{ duration: 1.5, delay: isStorming ? 0.45 : 0, ease: 'easeIn' }}
    >
      <div className="flower__g-front">
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--1">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--2">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--3">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--4">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--5">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--6">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--7">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--8">
          <div className="flower__g-front__leaf"></div>
        </div>
        <div className="flower__g-front__line"></div>
      </div>
    </motion.div>

    <motion.div 
      className="grow-ans" style={{ "--d": "3.2s" } as React.CSSProperties}
      animate={getStorm(1.0)}
      transition={{ duration: 1.7, delay: isStorming ? 0.1 : 0, ease: 'easeIn' }}
    >
      <div className="flower__g-fr">
        <div className="leaf"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--1"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--2"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--3"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--4"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--5"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--6"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--7"></div>
        <div className="flower__g-fr__leaf flower__g-fr__leaf--8"></div>
      </div>
    </motion.div>

    {/* RESTORING THE MISSING SIDE LEAVES (long-g--0 to long-g--7) */}
    <motion.div className="long-g long-g--0" animate={getStorm(0.2)} transition={{ duration: 1.3, delay: isStorming ? 0.2 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "3s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "2.2s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "3.4s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "3.6s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>

    <motion.div className="long-g long-g--1" animate={getStorm(0.3)} transition={{ duration: 1.4, delay: isStorming ? 0.3 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "3.6s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "3.8s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "4s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "4.2s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>

    <motion.div className="long-g long-g--2" animate={getStorm(0.4)} transition={{ duration: 1.5, delay: isStorming ? 0.1 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "4s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "4.2s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "4.4s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "4.6s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>

    <motion.div className="long-g long-g--3" animate={getStorm(0.5)} transition={{ duration: 1.6, delay: isStorming ? 0.4 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "4s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "4.2s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "3s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "3.6s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>

    <motion.div className="long-g long-g--4" animate={getStorm(0.6)} transition={{ duration: 1.2, delay: isStorming ? 0.2 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "4s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "4.2s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "3s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "3.6s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>

    <motion.div className="long-g long-g--5" animate={getStorm(0.7)} transition={{ duration: 1.3, delay: isStorming ? 0.35 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "4s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "4.2s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "3s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "3.6s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>

    <motion.div className="long-g long-g--6" animate={getStorm(0.8)} transition={{ duration: 1.4, delay: isStorming ? 0.15 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "4.2s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "4.4s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "4.6s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "4.8s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>

    <motion.div className="long-g long-g--7" animate={getStorm(0.9)} transition={{ duration: 1.5, delay: isStorming ? 0.45 : 0, ease: 'easeIn' }}>
      <div className="grow-ans" style={{ "--d": "3s" } as React.CSSProperties}><div className="leaf leaf--0"></div></div>
      <div className="grow-ans" style={{ "--d": "3.2s" } as React.CSSProperties}><div className="leaf leaf--1"></div></div>
      <div className="grow-ans" style={{ "--d": "3.5s" } as React.CSSProperties}><div className="leaf leaf--2"></div></div>
      <div className="grow-ans" style={{ "--d": "3.6s" } as React.CSSProperties}><div className="leaf leaf--3"></div></div>
    </motion.div>
  </div>
</>
  );
}
