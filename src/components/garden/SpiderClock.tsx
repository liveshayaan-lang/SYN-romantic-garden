import React, { useState, useEffect } from 'react';
import './SpiderClock.css';

const timezones = [
  { label: 'Local Time', value: 'local' },
  { label: 'New York (EST)', value: 'America/New_York' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Mumbai (IST)', value: 'Asia/Kolkata' },
];

export const SpiderClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState('local');

  useEffect(() => {
    const timer = setInterval(() => {
      if (selectedTimezone === 'local') {
        setTime(new Date());
      } else {
        // Calculate the time in the selected timezone
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: selectedTimezone,
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric',
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        // This is a bit of a hack to get a Date object for the target timezone
        // A cleaner way is just to get the parts, but for rotation we just need the local equivalent
        const timeString = date.toLocaleString('en-US', { timeZone: selectedTimezone });
        setTime(new Date(timeString));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTimezone]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  // Generate numbers 1-12
  const renderNumbers = () => {
    const numbers = [];
    const radius = 105;
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = 150 + radius * Math.cos(angle);
      const y = 150 + radius * Math.sin(angle);
      numbers.push(
        <text key={i} x={x} y={y} className="clock-number">
          {i}
        </text>
      );
    }
    return numbers;
  };

  const renderWebs = () => {
    const spokes = [];
    for (let i = 0; i < 12; i++) {
      spokes.push(
        <line
          key={`spoke-${i}`}
          x1="150" y1="30" x2="150" y2="270"
          transform={`rotate(${i * 15} 150 150)`}
          className="web-gear"
        />
      );
    }
    return (
      <>
        <g className="gear-rotate-cw">
          {spokes.slice(0, 6)}
          <circle cx="150" cy="150" r="40" className="web-gear" strokeDasharray="10 5" />
          <circle cx="150" cy="150" r="80" className="web-gear" strokeDasharray="15 10" />
        </g>
        <g className="gear-rotate-ccw">
          {spokes.slice(6, 12)}
          <circle cx="150" cy="150" r="60" className="web-gear-inner" strokeDasharray="5 15" />
          <circle cx="150" cy="150" r="115" className="web-gear-inner" strokeDasharray="2 8" />
        </g>
      </>
    );
  };

  return (
    <div className="spider-clock-container">
      <select
        className="timezone-selector"
        value={selectedTimezone}
        onChange={(e) => setSelectedTimezone(e.target.value)}
      >
        {timezones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
      
      <svg viewBox="0 0 300 300" className="spider-clock-svg">
        {/* Background Thread */}
        <line x1="150" y1="0" x2="150" y2="150" className="spider-thread" />
        
        {/* Webs and Gears */}
        {renderWebs()}

        {/* Numbers */}
        {renderNumbers()}

        {/* Spider Static Parts */}
        <g>
          {/* Static Legs */}
          {/* Left legs */}
          <polyline points="148,145 130,130 115,150" className="spider-leg" />
          <polyline points="146,150 120,145 110,165" className="spider-leg" />
          <polyline points="148,155 125,160 115,185" className="spider-leg" />
          {/* Right legs */}
          <polyline points="152,145 170,130 185,150" className="spider-leg" />
          <polyline points="154,150 180,145 190,165" className="spider-leg" />
          <polyline points="152,155 175,160 185,185" className="spider-leg" />
          
          {/* Body */}
          <ellipse cx="150" cy="152" rx="6" ry="10" className="spider-body" />
          <circle cx="150" cy="142" r="4" className="spider-body" />
        </g>

        {/* Hands (Dynamic Legs) */}
        {/* Hour Hand */}
        <g style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '150px 150px' }}>
          <path d="M 150 150 Q 130 130 150 90 Q 160 70 150 65" className="spider-hand" />
        </g>

        {/* Minute Hand */}
        <g style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '150px 150px' }}>
          <path d="M 150 150 Q 165 120 150 60 Q 140 45 150 35" className="spider-hand" style={{ strokeWidth: 3 }} />
        </g>

        {/* Second Hand */}
        <g style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '150px 150px' }}>
          <line x1="150" y1="150" x2="150" y2="25" className="spider-second-hand" />
          <circle cx="150" cy="25" r="3" className="spider-body" />
        </g>
      </svg>
    </div>
  );
};
