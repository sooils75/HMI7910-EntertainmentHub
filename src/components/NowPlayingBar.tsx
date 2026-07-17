import React, { useRef, useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, Maximize2, Music, Sliders } from 'lucide-react';

interface NowPlayingBarProps {
  item: MediaItem | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleEqualizer: () => void;
  showEqualizer: boolean;
}

export const NowPlayingBar: React.FC<NowPlayingBarProps> = ({
  item,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleEqualizer,
  showEqualizer,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  // Sync state when active media item changes
  useEffect(() => {
    if (audioRef.current && item) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Audio playback blocked:", err);
        });
      }
    }
  }, [item]);

  // Sync play/pause commands from parent
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Audio play failed:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => console.log(err));
      }
    } else {
      onNext();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMute(nextMute);
  };

  const setIsMute = (muted: boolean) => {
    setIsMuted(muted);
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!item) {
    return (
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 glass border-t border-white/10 px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between text-vibe-text-muted text-xs font-mono-labels">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-vibe-text-muted/30" />
          </div>
          <div>
            <p className="font-bold text-white/50">VIBE Media Lounge</p>
            <p className="text-[10px]">No active track loaded</p>
          </div>
        </div>
        <p className="opacity-60 hidden md:block">Choose a track, movie, or upload a local file to begin.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 glass border-t border-white/10 px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {/* Hidden native HTML5 audio controller */}
      <audio
        ref={audioRef}
        src={item.mediaUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Left Cover info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 shadow-lg flex-shrink-0 bg-vibe-bg-dark">
          <img 
            src={item.thumbnailUrl} 
            alt={item.title} 
            className={`w-full h-full object-cover transition-transform ${isPlaying ? 'animate-spin-slow' : ''}`}
            referrerPolicy="no-referrer"
          />
          {/* Animated visualizer dots overlay */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
              <span className="w-1 h-3 bg-vibe-primary rounded-full animate-pulse-bar-1" />
              <span className="w-1 h-4 bg-vibe-secondary rounded-full animate-pulse-bar-2" />
              <span className="w-1 h-2.5 bg-vibe-primary rounded-full animate-pulse-bar-3" />
            </div>
          )}
        </div>
        
        <div className="hidden sm:block min-w-0 overflow-hidden">
          <p className="font-bold text-sm text-white truncate">{item.title}</p>
          <p className="text-vibe-text-muted text-[11px] font-mono-labels mt-0.5 truncate flex items-center gap-1.5">
            <span>{item.artist}</span>
            {item.album && (
              <>
                <span className="opacity-35">•</span>
                <span className="truncate opacity-85">{item.album}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Center player playback actions */}
      <div className="flex flex-col items-center gap-2 w-1/3 min-w-[150px]">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`transition-colors p-1.5 cursor-pointer ${isShuffle ? 'text-vibe-secondary scale-105' : 'text-vibe-text-muted hover:text-white'}`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onPrev}
            className="text-vibe-text-muted hover:text-white transition-colors p-1.5 cursor-pointer"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onTogglePlay}
            className="w-10 h-10 bg-vibe-primary text-vibe-bg rounded-full flex items-center justify-center shadow-lg shadow-vibe-primary/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-vibe-bg text-vibe-bg" />
            ) : (
              <Play className="w-4 h-4 fill-vibe-bg text-vibe-bg ml-0.5" />
            )}
          </button>
          
          <button 
            onClick={onNext}
            className="text-vibe-text-muted hover:text-white transition-colors p-1.5 cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsRepeat(!isRepeat)}
            className={`transition-colors p-1.5 cursor-pointer ${isRepeat ? 'text-vibe-primary scale-105' : 'text-vibe-text-muted hover:text-white'}`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Playback timeline tracker */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono-labels text-vibe-text-muted/60 min-w-[28px] text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-grow accent-vibe-secondary h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-[10px] font-mono-labels text-vibe-text-muted/60 min-w-[28px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right control adjustments (volume/mute) */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <button
          onClick={onToggleEqualizer}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
            showEqualizer 
              ? 'bg-vibe-primary/20 border-vibe-primary/40 text-vibe-primary glow-purple scale-105' 
              : 'bg-white/5 border-white/10 text-vibe-text-muted hover:text-white'
          }`}
          title="Toggle Studio Graphic Equalizer"
        >
          <Sliders className="w-4 h-4" />
          <span className="text-[10px] font-bold font-mono-labels hidden sm:inline">EQ</span>
        </button>

        <button 
          onClick={toggleMute}
          className="text-vibe-text-muted hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-vibe-secondary animate-pulse" /> : <Volume2 className="w-4 h-4" />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-16 md:w-24 accent-vibe-secondary h-1 bg-white/10 rounded-full appearance-none cursor-pointer hidden sm:block"
        />
        
        <div className="text-[10px] font-mono-labels text-vibe-secondary hidden lg:block uppercase tracking-widest bg-vibe-secondary/10 border border-vibe-secondary/20 px-2 py-0.5 rounded ml-2">
          HIFI Stereo
        </div>
      </div>
    </div>
  );
};
