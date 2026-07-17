import React, { useState, useEffect, useRef } from 'react';
import { Sliders, RefreshCw, Volume2, Music, Sparkles } from 'lucide-react';

interface GraphicEqualizerProps {
  isPlaying: boolean;
  currentTrackTitle?: string;
}

const FREQUENCY_BANDS = [
  { label: '32Hz', desc: 'Sub-Bass' },
  { label: '64Hz', desc: 'Bass' },
  { label: '125Hz', desc: 'Low-Mid' },
  { label: '250Hz', desc: 'Low-Mid' },
  { label: '500Hz', desc: 'Midrange' },
  { label: '1kHz', desc: 'Midrange' },
  { label: '2kHz', desc: 'Upper-Mid' },
  { label: '4kHz', desc: 'Presence' },
  { label: '8kHz', desc: 'Brilliance' },
  { label: '16kHz', desc: 'Air' },
];

const PRESETS = {
  flat: {
    name: 'Flat / Bypass',
    gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  bassBoost: {
    name: 'Bass Boost',
    gains: [8, 7, 5, 2, 0, 0, 0, 1, 2, 1]
  },
  electronic: {
    name: 'Electronic Vibe',
    gains: [6, 5, 3, 0, -2, 2, 4, 5, 6, 4]
  },
  vocal: {
    name: 'Vocal Enhancer',
    gains: [-3, -1, 0, 3, 5, 6, 4, 2, 1, 0]
  },
  jazz: {
    name: 'Jazz Club',
    gains: [4, 3, 1, 2, -1, -1, 0, 1, 3, 2]
  }
};

export const GraphicEqualizer: React.FC<GraphicEqualizerProps> = ({ isPlaying, currentTrackTitle }) => {
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS>('electronic');
  const [gains, setGains] = useState<number[]>([...PRESETS.electronic.gains]);
  const [ledHeights, setLedHeights] = useState<number[]>(new Array(10).fill(2));
  
  const animationRef = useRef<number | null>(null);

  // Set gain preset
  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    setActivePreset(presetKey);
    setGains([...PRESETS[presetKey].gains]);
  };

  const handleGainChange = (index: number, value: number) => {
    const updated = [...gains];
    updated[index] = value;
    setGains(updated);
    setActivePreset('flat'); // custom
  };

  // Simulating live analyzer data bouncing for LEDs
  useEffect(() => {
    let lastTime = 0;
    
    const animateLeds = (time: number) => {
      if (time - lastTime > 60) { // Throttle animation slightly for retro display look
        lastTime = time;
        
        setLedHeights(prev => {
          return prev.map((currentHeight, idx) => {
            if (!isPlaying) {
              // Flat line baseline when paused (resting state scaled by gain level)
              const restHeight = Math.max(1, Math.floor((gains[idx] + 12) / 4));
              const diff = restHeight - currentHeight;
              return currentHeight + Math.sign(diff) * 0.5;
            } else {
              // Active bounce: centered around the gain curve with a random variance
              const gainInfluence = (gains[idx] + 12) / 24; // 0 to 1
              const baseHeight = Math.floor(gainInfluence * 12) + 2; // base level of LEDs (2 to 14)
              
              // Random active jump
              const variance = Math.floor(Math.random() * 5) - 2; // -2 to 2
              let target = baseHeight + variance;
              target = Math.max(1, Math.min(16, target)); // Keep between 1 and 16 LEDs
              
              // Smooth transition to target
              const step = (target - currentHeight) * 0.45;
              return Math.max(1, Math.min(16, currentHeight + step));
            }
          });
        });
      }
      animationRef.current = requestAnimationFrame(animateLeds);
    };

    animationRef.current = requestAnimationFrame(animateLeds);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gains]);

  // Color mapper for LED bars depending on heights (0-16)
  // Green/Cyan for low, Purple/Cyan for mid, Orange/Red for peak
  const getLedBg = (ledIndex: number, totalLeds: number) => {
    const position = ledIndex / 16;
    if (position > 0.85) {
      return 'bg-vibe-tertiary'; // Peak (Orange)
    } else if (position > 0.5) {
      return 'bg-vibe-primary'; // Mid (Purple)
    } else {
      return 'bg-vibe-secondary'; // Low (Cyan)
    }
  };

  return (
    <div id="graphic-equalizer-panel" className="w-full rounded-3xl p-6 bg-vibe-surface/80 border border-vibe-border backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden">
      {/* Decorative cyber grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-vibe-primary-dark),transparent)] opacity-5 pointer-events-none" />
      
      {/* Equalizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 border-b border-vibe-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-vibe-primary/10 border border-vibe-primary/25 text-vibe-primary">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
              Studio Graphic Equalizer
            </h3>
            <p className="text-[10px] font-mono-labels text-vibe-text-muted/60 mt-0.5 flex items-center gap-1.5">
              <span>HIFI AUDIO PROCESSOR (10-BAND)</span>
              {isPlaying && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-vibe-secondary animate-pulse" />
                  <span className="text-vibe-secondary font-bold">ANALYZER LIVE</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* EQ Presets list */}
        <div className="flex flex-wrap items-center gap-1.5 bg-vibe-bg-dark/60 p-1 rounded-xl border border-vibe-border">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono-labels transition-all uppercase cursor-pointer ${
                activePreset === key
                  ? 'bg-vibe-primary text-vibe-bg shadow-md shadow-vibe-primary/20'
                  : 'text-vibe-text-muted hover:text-white'
              }`}
            >
              {preset.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Equalizer Deck */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-x-2 gap-y-6 relative z-10">
        {FREQUENCY_BANDS.map((band, idx) => {
          const gain = gains[idx];
          const height = Math.round(ledHeights[idx]);

          return (
            <div key={band.label} className="flex flex-col items-center space-y-3.5 group">
              {/* LED Analyzer Column (16 segments total) */}
              <div className="w-full max-w-[20px] h-32 bg-vibe-bg-dark/80 rounded-md p-1 flex flex-col-reverse justify-between gap-[2px] border border-vibe-border/50 relative">
                {Array.from({ length: 16 }).map((_, segmentIdx) => {
                  const isActive = segmentIdx < height;
                  return (
                    <div
                      key={segmentIdx}
                      className={`h-[4px] w-full rounded-sm transition-all duration-150 ${
                        isActive 
                          ? getLedBg(segmentIdx, height) + ' opacity-100 shadow-[0_0_4px_currentColor]'
                          : 'bg-white/[0.03]'
                      }`}
                    />
                  );
                })}
              </div>

              {/* dB gain slider */}
              <div className="relative h-20 w-5 flex items-center justify-center">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="1"
                  value={gain}
                  onChange={(e) => handleGainChange(idx, parseInt(e.target.value))}
                  className="absolute accent-vibe-secondary h-1 bg-white/10 rounded-full cursor-row-resize origin-center -rotate-90 w-16 md:w-20"
                />
              </div>

              {/* Frequency Info Tag */}
              <div className="text-center">
                <span className="block text-[10px] font-extrabold font-mono-labels text-white group-hover:text-vibe-secondary transition-colors">
                  {band.label}
                </span>
                <span className="block text-[8px] text-vibe-text-muted/50 font-medium tracking-tighter uppercase leading-tight">
                  {band.desc}
                </span>
                <span className="inline-block mt-1 px-1 py-0.5 rounded bg-vibe-bg-dark text-[8px] font-mono-labels font-semibold text-vibe-secondary min-w-[24px]">
                  {gain > 0 ? `+${gain}` : gain}dB
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative footer status with track summary */}
      <div className="flex items-center justify-between pt-3 border-t border-vibe-border text-[10px] font-mono-labels text-vibe-text-muted/50">
        <div className="flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-vibe-secondary" />
          <span>ROUTING: COAXIAL FLAC {"\u2192"} MULTIBIT DAC</span>
        </div>
        {isPlaying && currentTrackTitle ? (
          <div className="flex items-center gap-1 text-vibe-primary animate-pulse font-bold">
            <Sparkles className="w-3 h-3" />
            <span>NOW RENDERING: {currentTrackTitle.toUpperCase()}</span>
          </div>
        ) : (
          <span>DSP BYPASS SYSTEM IDLE</span>
        )}
      </div>
    </div>
  );
};
