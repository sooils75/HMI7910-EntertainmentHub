import React, { useRef, useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, MessageSquare, FastForward } from 'lucide-react';

interface TheaterPlayerModalProps {
  item: MediaItem;
  onClose: () => void;
}

export const TheaterPlayerModal: React.FC<TheaterPlayerModalProps> = ({ item, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(item.durationSeconds || 0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup auto-play and event listeners
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Autoplay blocked:", err);
      });
    }
    
    // Hide controls on idle
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Track time updates & sync subtitles
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);

      // Find relevant subtitle / transcript sentence
      if (item.transcript) {
        const currentLine = [...item.transcript]
          .reverse()
          .find(t => time >= t.time);
        
        if (currentLine) {
          // Keep subtitle active for 5 seconds after start
          if (time - currentLine.time < 5) {
            setActiveSubtitle(currentLine.text);
          } else {
            setActiveSubtitle('');
          }
        } else {
          setActiveSubtitle('');
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error enabling fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(0, videoRef.current.currentTime + amount), duration);
    }
  };

  const changeSpeed = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Click on a transcript item to seek directly there
  const handleTranscriptClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        });
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 bg-vibe-bg-dark z-50 flex flex-col md:flex-row overflow-hidden animate-fade-in"
    >
      {/* Video screen pane */}
      <div className="relative flex-grow flex items-center justify-center bg-black h-2/3 md:h-full group">
        <video
          ref={videoRef}
          src={item.mediaUrl}
          className="w-full h-full max-h-screen object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          preload="auto"
        />

        {/* Subtitles Overlay */}
        {activeSubtitle && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/85 text-vibe-primary px-5 py-2.5 rounded-xl border border-white/10 text-center font-display font-medium text-sm md:text-lg max-w-[80%] shadow-2xl animate-bounce-sub">
            {activeSubtitle}
          </div>
        )}

        {/* Cinematic Big Center Play Indicator */}
        {!isPlaying && (
          <button 
            onClick={togglePlay}
            className="absolute p-6 rounded-full bg-vibe-primary/10 border border-vibe-primary/30 backdrop-blur-md text-vibe-primary glow-purple transform transition hover:scale-110"
          >
            <Play className="w-12 h-12 fill-vibe-primary" />
          </button>
        )}

        {/* Top Header controls */}
        <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded-md text-[10px] bg-vibe-primary text-vibe-bg font-mono-labels font-bold uppercase tracking-wider">
              {item.category}
            </span>
            <div className="overflow-hidden">
              <h3 className="font-display font-bold text-white text-base md:text-xl truncate">{item.title}</h3>
              <p className="text-vibe-text-muted text-xs font-mono-labels">{item.artist}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:text-vibe-primary transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom player controls bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Timeline slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-labels text-white/70 min-w-[35px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-grow accent-vibe-primary h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs font-mono-labels text-white/70 min-w-[35px]">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {/* Play, skip, back controls */}
            <div className="flex items-center gap-5">
              <button onClick={() => skipTime(-10)} className="text-white hover:text-vibe-primary transition-colors cursor-pointer">
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="p-3 bg-vibe-primary text-vibe-bg rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-vibe-bg text-vibe-bg" /> : <Play className="w-5 h-5 fill-vibe-bg text-vibe-bg ml-0.5" />}
              </button>

              <button onClick={() => skipTime(10)} className="text-white hover:text-vibe-primary transition-colors cursor-pointer">
                <FastForward className="w-5 h-5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-white hover:text-vibe-primary transition-colors cursor-pointer">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 md:w-24 accent-vibe-primary h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Speed, fullscreen */}
            <div className="flex items-center gap-4 font-mono-labels text-xs text-white/80">
              <button 
                onClick={changeSpeed}
                className="px-2.5 py-1.5 rounded-md border border-white/10 hover:border-vibe-primary transition-colors cursor-pointer bg-white/5 font-bold"
              >
                {playbackRate}x
              </button>
              
              <button onClick={toggleFullscreen} className="text-white hover:text-vibe-primary transition-colors p-1 cursor-pointer">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Transcript Pane */}
      <div className="w-full md:w-[360px] lg:w-[400px] border-t md:border-t-0 md:border-l border-white/10 bg-vibe-surface flex flex-col h-1/3 md:h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-vibe-primary">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-display font-semibold text-vibe-text">Interactive Transcript</h3>
          </div>
          <span className="text-[10px] font-mono-labels bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-vibe-text-muted">
            Auto-scroll Active
          </span>
        </div>

        {/* Transcript line item list */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4 hide-scrollbar">
          {item.transcript && item.transcript.length > 0 ? (
            item.transcript.map((line, idx) => {
              // Highlight active transcript line based on video time
              const isLineActive = currentTime >= line.time && 
                (idx === item.transcript!.length - 1 || currentTime < item.transcript![idx + 1].time);

              return (
                <div 
                  key={idx}
                  onClick={() => handleTranscriptClick(line.time)}
                  className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isLineActive 
                      ? 'bg-vibe-primary/10 border-vibe-primary/30 text-white shadow-md shadow-vibe-primary/5' 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-vibe-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono-labels text-[10px] tracking-wider">
                    {line.speaker ? (
                      <span className={`font-bold ${isLineActive ? 'text-vibe-primary' : 'text-vibe-text'}`}>
                        {line.speaker}
                      </span>
                    ) : (
                      <span className="text-vibe-text-muted/60">System</span>
                    )}
                    <span className={`font-bold ${isLineActive ? 'text-vibe-secondary' : 'text-vibe-text-muted/50'}`}>
                      {formatTime(line.time)}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isLineActive ? 'font-medium' : ''}`}>
                    {line.text}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-vibe-text-muted">
              <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-xs">No transcript available for this file.</p>
              <p className="text-[10px] opacity-60 mt-1">Uploaded custom videos will play natively without interactive subtitles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
