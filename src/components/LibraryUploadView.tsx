import React, { useState, useRef } from 'react';
import { MediaItem } from '../types';
import { UploadCloud, FileVideo, FileAudio, Trash2, Play, Music, Film, AlertCircle } from 'lucide-react';

interface LibraryUploadViewProps {
  customItems: MediaItem[];
  onAddCustomItem: (item: MediaItem) => void;
  onDeleteCustomItem: (id: string) => void;
  onPlayItem: (item: MediaItem) => void;
}

export const LibraryUploadView: React.FC<LibraryUploadViewProps> = ({
  customItems,
  onAddCustomItem,
  onDeleteCustomItem,
  onPlayItem,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    setErrorMsg('');
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    let category: 'movie' | 'music' | 'animation' = 'movie';
    let thumbnailUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'; // Default purple synthwave gradient
    
    if (extension === 'mp4' || extension === 'mov' || extension === 'mkv') {
      category = 'movie';
      thumbnailUrl = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80'; // Cinematic lens
    } else if (extension === 'm4a' || extension === 'mp3' || extension === 'wav') {
      category = 'music';
      thumbnailUrl = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80'; // Equalizer sound waves
    } else {
      setErrorMsg('Unsupported file format. Please upload MP4/MOV for video, or M4A/MP3/WAV for audio.');
      return;
    }

    // Parse nice metadata from file name (e.g., "The Blue Note Trio - Midnight Jazz.mp3" -> Title: "Midnight Jazz", Artist: "The Blue Note Trio")
    let title = file.name.replace(/\.[^/.]+$/, ""); // strip extension
    let artist = 'Local Upload';

    if (title.includes('-')) {
      const parts = title.split('-');
      artist = parts[0].trim();
      title = parts[1].trim();
    } else if (title.includes('_')) {
      const parts = title.split('_');
      artist = parts[0].trim();
      title = parts[1].trim();
    }

    // Create streamable object URL
    const mediaUrl = URL.createObjectURL(file);
    
    const newItem: MediaItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title,
      artist: artist,
      category: category,
      duration: category === 'music' ? 'File Audio' : 'File Video',
      durationSeconds: category === 'music' ? 240 : 120, // default placeholder durations
      thumbnailUrl: thumbnailUrl,
      mediaUrl: mediaUrl,
      isCustom: true,
      description: `User uploaded local file: ${file.name}. Enjoy instant high-fidelity local streaming.`,
    };

    onAddCustomItem(newItem);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        processFile(e.dataTransfer.files[i]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        processFile(e.target.files[i]);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-vibe-text text-2xl md:text-3xl">My Media Vault</h2>
          <p className="text-vibe-text-muted text-xs md:text-sm mt-1">
            Drag-and-drop your personal movies, animations, and playlists to instantly stream them in theater mode.
          </p>
        </div>
      </div>

      {/* Drag & Drop zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center ${
          isDragging 
            ? 'border-vibe-primary bg-vibe-primary/5 glow-purple scale-[1.01]' 
            : 'border-white/10 hover:border-vibe-primary/40 bg-white/[0.01] hover:bg-white/[0.02]'
        }`}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="video/mp4,video/quicktime,video/x-matroska,audio/mp4,audio/mp3,audio/wav,audio/m4a"
          className="hidden"
        />

        {/* Ambient neon radial glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-vibe-primary/5 blur-3xl" />

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-4 text-vibe-primary transform transition duration-500 hover:rotate-12">
          <UploadCloud className="w-10 h-10" />
        </div>

        <h3 className="font-display font-semibold text-lg text-vibe-text">
          Drag and drop your media files here
        </h3>
        
        <p className="text-vibe-text-muted text-xs mt-2 max-w-sm leading-relaxed">
          Supports <span className="text-vibe-primary font-mono-labels">.mp4</span>, <span className="text-vibe-secondary font-mono-labels">.m4a</span>, <span className="text-vibe-tertiary font-mono-labels">.mp3</span> and wav formats. Files are streamed completely privately in your browser.
        </p>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}
          className="mt-6 px-6 py-2.5 rounded-xl bg-vibe-primary text-vibe-bg font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-vibe-primary/20"
        >
          Browse Files
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-xs md:text-sm animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded items listing */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold text-lg text-vibe-text flex items-center gap-2">
          <span>Uploaded Vault Items</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-mono-labels bg-white/5 border border-white/10 text-vibe-text-muted">
            {customItems.length} Files
          </span>
        </h3>

        {customItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {customItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5 hover:border-vibe-primary/20 hover:bg-white/[0.02] transition-all group"
              >
                {/* Media icon or image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-vibe-bg-dark flex items-center justify-center border border-white/5 relative flex-shrink-0">
                  {item.category === 'movie' ? (
                    <FileVideo className="w-6 h-6 text-vibe-secondary" />
                  ) : (
                    <FileAudio className="w-6 h-6 text-vibe-primary" />
                  )}
                  {/* Miniature Hover Play Button */}
                  <div 
                    onClick={() => onPlayItem(item)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>

                <div className="overflow-hidden flex-grow">
                  <h4 className="font-display font-semibold text-vibe-text text-sm truncate group-hover:text-vibe-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-vibe-text-muted text-[11px] font-mono-labels mt-0.5 flex items-center gap-1.5">
                    {item.category === 'movie' ? (
                      <Film className="w-3 h-3 text-vibe-secondary" />
                    ) : (
                      <Music className="w-3 h-3 text-vibe-primary" />
                    )}
                    <span className="truncate">{item.artist}</span>
                  </p>
                  <p className="text-[10px] text-vibe-secondary font-mono-labels mt-1.5 uppercase tracking-widest font-bold">
                    {item.category}
                  </p>
                </div>

                <button 
                  onClick={() => onDeleteCustomItem(item.id)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-vibe-text-muted hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all cursor-pointer"
                  title="Remove from vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl glass border border-white/5 text-vibe-text-muted flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 opacity-20 mb-3" />
            <h4 className="text-sm font-medium">Your Vault is empty</h4>
            <p className="text-xs opacity-60 mt-1 max-w-xs leading-relaxed">
              Upload your movie file or music file above to populate your custom entertainment repository.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
