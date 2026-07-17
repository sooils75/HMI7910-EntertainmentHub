import React from 'react';
import { MediaItem } from '../types';
import { Play, Film, Music, Tv, Clock } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  isActive?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPlay, isActive = false }) => {
  const isMusic = item.category === 'music';
  
  return (
    <div 
      className={`group relative rounded-2xl overflow-hidden glass border-white/5 transition-all duration-300 flex flex-col h-full cursor-pointer hover:border-vibe-primary/40 ${
        isActive ? 'ring-2 ring-vibe-primary border-vibe-primary/50 shadow-lg shadow-vibe-primary/10' : ''
      }`}
      onClick={() => onPlay(item)}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-vibe-bg-dark">
        <img 
          src={item.thumbnailUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-vibe-primary text-vibe-bg rounded-full flex items-center justify-center shadow-lg shadow-vibe-primary/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-vibe-bg text-vibe-bg ml-0.5" />
          </div>
        </div>

        {/* Media Type Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] uppercase font-mono-labels tracking-wider bg-vibe-bg-dark/80 backdrop-blur-md text-vibe-text flex items-center gap-1 border border-white/5">
          {item.category === 'movie' && <Film className="w-3 h-3 text-vibe-primary" />}
          {item.category === 'animation' && <Tv className="w-3 h-3 text-vibe-secondary" />}
          {item.category === 'music' && <Music className="w-3 h-3 text-vibe-tertiary" />}
          {item.category}
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono-labels bg-black/75 backdrop-blur-sm text-vibe-text-muted flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.duration}
        </div>

        {/* Custom Item Badge */}
        {item.isCustom && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-vibe-secondary text-vibe-bg font-mono-labels text-[9px] uppercase font-bold tracking-widest">
            Local File
          </div>
        )}

        {/* Bottom Progress Bar (Continue Watching) */}
        {item.progress !== undefined && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-vibe-primary to-vibe-secondary transition-all"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Media Details */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h4 className="font-display font-semibold text-vibe-text text-base leading-snug group-hover:text-vibe-primary transition-colors line-clamp-1">
            {item.title}
          </h4>
          <p className="text-vibe-text-muted text-xs mt-1 font-mono-labels flex items-center gap-1">
            <span>{item.artist}</span>
            {item.album && (
              <>
                <span className="text-white/20">•</span>
                <span className="truncate">{item.album}</span>
              </>
            )}
          </p>
        </div>

        {item.timeLeft && (
          <p className="text-[11px] text-vibe-secondary font-mono-labels mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-vibe-secondary animate-pulse" />
            {item.timeLeft}
          </p>
        )}
      </div>
    </div>
  );
};
