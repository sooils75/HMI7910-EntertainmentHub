import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Bell, Settings, Home, Flame, Radio, FolderHeart, 
  ListMusic, Play, Plus, Check, Sparkles, User, Info, 
  Calendar, TrendingUp, Compass, Music, Menu, X, Heart, Film, Tv, Share2, Volume2, AlertCircle,
  Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { initialMediaItems, initialPlaylists } from './mediaData';
import { MediaItem, Playlist } from './types';
import { MediaCard } from './components/MediaCard';
import { TheaterPlayerModal } from './components/TheaterPlayerModal';
import { LibraryUploadView } from './components/LibraryUploadView';
import { NowPlayingBar } from './components/NowPlayingBar';
import { GraphicEqualizer } from './components/GraphicEqualizer';

export default function App() {
  // Core state managers
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'animation' | 'music' | 'live' | 'trending' | 'playlists' | 'library'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dark mode & Audio Equalizer state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('vibe-dark-mode');
    return saved !== null ? saved === 'true' : true;
  });
  const [showEqualizer, setShowEqualizer] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('vibe-dark-mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);
  
  // Media Playback State
  const [activeAudioItem, setActiveAudioItem] = useState<MediaItem | null>(initialMediaItems[5]); // Default song: Retro Waves
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeVideoItem, setActiveVideoItem] = useState<MediaItem | null>(null);
  
  // Sub-navigation filter states
  const [selectedMovieGenre, setSelectedMovieGenre] = useState<string>('all');
  const [selectedMusicGenre, setSelectedMusicGenre] = useState<string>('all');
  
  // Custom Playlist Creator State
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState<string>('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedSongsForPlaylist, setSelectedSongsForPlaylist] = useState<string[]>([]);
  
  // Interaction modals
  const [isGoProOpen, setIsGoProOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareMessage, setShareMessage] = useState<string>('');
  
  // Custom Color Theme Accents (tactile customization)
  const [vibeTheme, setVibeTheme] = useState<'purple' | 'cyan' | 'orange'>('purple');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Notifications Log Simulation
  const [notifications, setNotifications] = useState<Array<{ id: number; text: string; time: string }>>([
    { id: 1, text: "VIBE Studios added 'Tasty Treats Puppy Kitchen' animation!", time: "Just now" },
    { id: 2, text: "Your uploaded track 'Midnight Jazz' is optimized in HIFI Stereo.", time: "10m ago" },
    { id: 3, text: "DJ CyberGlow went live in the Music Lounge stream!", time: "1h ago" },
  ]);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState<boolean>(false);

  // Live Chat Simulator state
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{ user: string; text: string; color: string }>>([
    { user: "NeonSlicker", text: "This virtual lounge is absolutely next-level! 🚀", color: "text-vibe-secondary" },
    { user: "GhibliFan99", text: "Who is animating the background loops? Spectacular art style!", color: "text-vibe-primary" },
    { user: "SynthWand", text: "Bass drop in 3... 2... 1... 🔥", color: "text-vibe-tertiary" },
    { user: "VIBE_Mod", text: "Welcome everyone to the premium electronic hub! Enjoy the lossless streams.", color: "text-white font-bold" },
  ]);
  const [newChatMessage, setNewChatMessage] = useState<string>('');

  // Auto-scroll chat simulation inside the live stream tab
  useEffect(() => {
    if (activeTab === 'live') {
      const chatInterval = setInterval(() => {
        const standardChats = [
          "CYBERPUNK 2049 IS SO GOOD!",
          "That synth line is absolutely clean.",
          "Loving the retro visualizers.",
          "VIBE is my favorite personal vault.",
          "Check out the puppy cooking, so cute! 🐾",
          "Can we play custom tracks?",
          "Yes! Drag-and-drop in the Vault works flawlessly.",
          "Lossless streaming is beautiful.",
        ];
        const users = ["PixelRider", "BassHead", "RetroSaber", "Mochi_Bite", "LaserWarp", "ChillWave_7"];
        const colors = ["text-vibe-primary", "text-vibe-secondary", "text-vibe-tertiary", "text-white/80"];
        
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomText = standardChats[Math.floor(Math.random() * standardChats.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        setLiveChatMessages(prev => [...prev.slice(-30), { user: randomUser, text: randomText, color: randomColor }]);
      }, 4000);

      return () => clearInterval(chatInterval);
    }
  }, [activeTab]);

  // Handler for custom local uploads
  const handleAddCustomItem = (item: MediaItem) => {
    setMediaItems(prev => [item, ...prev]);
    // Notify user of successful upload
    setNotifications(prev => [
      { id: Date.now(), text: `Custom file '${item.title}' uploaded successfully!`, time: "Just now" },
      ...prev
    ]);
  };

  const handleDeleteCustomItem = (id: string) => {
    // If deleted item is currently playing, clear it
    if (activeAudioItem?.id === id) {
      setActiveAudioItem(null);
      setIsAudioPlaying(false);
    }
    if (activeVideoItem?.id === id) {
      setActiveVideoItem(null);
    }
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  // Trigger playback (decide if audio bar or full modal)
  const handlePlayMedia = (item: MediaItem) => {
    if (item.category === 'music') {
      setActiveAudioItem(item);
      setIsAudioPlaying(true);
    } else {
      setActiveVideoItem(item);
      // Pause any active audio playing so they don't overlay
      setIsAudioPlaying(false);
    }
  };

  // Play controls
  const handleToggleAudioPlay = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  const getMusicItems = useMemo(() => {
    return mediaItems.filter(item => item.category === 'music');
  }, [mediaItems]);

  const handleNextTrack = () => {
    if (!activeAudioItem) return;
    const currentIndex = getMusicItems.findIndex(m => m.id === activeAudioItem.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % getMusicItems.length;
      setActiveAudioItem(getMusicItems[nextIndex]);
      setIsAudioPlaying(true);
    }
  };

  const handlePrevTrack = () => {
    if (!activeAudioItem) return;
    const currentIndex = getMusicItems.findIndex(m => m.id === activeAudioItem.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + getMusicItems.length) % getMusicItems.length;
      setActiveAudioItem(getMusicItems[prevIndex]);
      setIsAudioPlaying(true);
    }
  };

  // Interactive Live Chat submit
  const submitLiveChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    setLiveChatMessages(prev => [
      ...prev,
      { user: "MyVibeAccount", text: newChatMessage.trim(), color: "text-vibe-primary font-bold" }
    ]);
    setNewChatMessage('');
  };

  // Custom accent classes map
  const themeAccentClasses = {
    purple: {
      text: 'text-vibe-primary',
      bg: 'bg-vibe-primary',
      onBg: 'text-vibe-bg',
      border: 'border-vibe-primary/30',
      focusRing: 'focus:ring-vibe-primary',
      badge: 'bg-vibe-primary/20 text-vibe-primary border-vibe-primary/30',
      gradient: 'from-vibe-primary to-vibe-primary-dark',
    },
    cyan: {
      text: 'text-vibe-secondary',
      bg: 'bg-vibe-secondary',
      onBg: 'text-vibe-bg',
      border: 'border-vibe-secondary/30',
      focusRing: 'focus:ring-vibe-secondary',
      badge: 'bg-vibe-secondary/20 text-vibe-secondary border-vibe-secondary/30',
      gradient: 'from-vibe-secondary to-blue-500',
    },
    orange: {
      text: 'text-vibe-tertiary',
      bg: 'bg-vibe-tertiary',
      onBg: 'text-white',
      border: 'border-vibe-tertiary/30',
      focusRing: 'focus:ring-vibe-tertiary',
      badge: 'bg-vibe-tertiary/20 text-vibe-tertiary border-vibe-tertiary/30',
      gradient: 'from-vibe-tertiary to-orange-600',
    }
  };

  const currentAccent = themeAccentClasses[vibeTheme];

  // Smart Real-time Search filter
  const filteredMediaItems = useMemo(() => {
    if (!searchQuery.trim()) return mediaItems;
    const query = searchQuery.toLowerCase();
    return mediaItems.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.artist.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      (item.album && item.album.toLowerCase().includes(query)) ||
      item.description.toLowerCase().includes(query)
    );
  }, [mediaItems, searchQuery]);

  // Tab Filtering
  const moviesList = useMemo(() => {
    return filteredMediaItems.filter(item => item.category === 'movie');
  }, [filteredMediaItems]);

  const animationsList = useMemo(() => {
    return filteredMediaItems.filter(item => item.category === 'animation');
  }, [filteredMediaItems]);

  const musicSongsList = useMemo(() => {
    return filteredMediaItems.filter(item => item.category === 'music');
  }, [filteredMediaItems]);

  const continueWatchingItems = useMemo(() => {
    return mediaItems.filter(item => item.isContinueWatching);
  }, [mediaItems]);

  const trendingItems = useMemo(() => {
    return mediaItems.filter(item => item.isTrending);
  }, [mediaItems]);

  const customUploadsList = useMemo(() => {
    return mediaItems.filter(item => item.isCustom);
  }, [mediaItems]);

  // Playlist creation handler
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const songs = mediaItems.filter(item => 
      item.category === 'music' && selectedSongsForPlaylist.includes(item.id)
    );

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: newPlaylistName.trim(),
      description: newPlaylistDesc.trim() || 'Custom curated music playlist.',
      coverUrl: songs[0]?.thumbnailUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
      items: songs,
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setSelectedSongsForPlaylist([]);
    setIsCreatingPlaylist(false);

    // Notify
    setNotifications(prev => [
      { id: Date.now(), text: `Curated playlist '${newPlaylist.name}' created!`, time: "Just now" },
      ...prev
    ]);
  };

  const toggleSongSelectionForPlaylist = (id: string) => {
    setSelectedSongsForPlaylist(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const triggerShareModal = (item: MediaItem) => {
    setShareMessage(`Hey! Check out this awesome content on VIBE: "${item.title}" by ${item.artist}. Access premium media in high fidelity!`);
    setIsShareOpen(true);
  };

  const copyShareToClipboard = () => {
    navigator.clipboard.writeText(shareMessage);
    // Temporary alert/notification simulation
    setNotifications(prev => [
      { id: Date.now(), text: "Share link copied to clipboard!", time: "Just now" },
      ...prev
    ]);
    setIsShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-vibe-bg text-vibe-text flex flex-col font-sans select-none pb-28">
      
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-vibe-bg/80 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-6 lg:px-12">
        
        {/* Left Side Brand Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-1.5 rounded-lg bg-white/5 text-white lg:hidden cursor-pointer hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-transform"
          >
            <span className={`font-display font-extrabold text-2xl tracking-tighter bg-gradient-to-r ${currentAccent.gradient} bg-clip-text text-transparent group-hover:opacity-90`}>
              VIBE
            </span>
            <div className={`w-2 h-2 rounded-full ${currentAccent.bg} animate-pulse shadow-md shadow-vibe-primary/50`} />
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative max-w-md w-full mx-4 hidden md:block">
          <input 
            type="text" 
            placeholder="Search movies, animations, playlists..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-vibe-surface/60 border border-white/5 rounded-full py-2 pl-11 pr-4 focus:outline-none focus:ring-1 ${currentAccent.focusRing} text-xs font-medium text-white transition-all backdrop-blur-md placeholder:text-vibe-text-muted/55`}
          />
          <Search className="w-4 h-4 text-vibe-text-muted/60 absolute left-4 top-1/2 transform -translate-y-1/2" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-vibe-text-muted hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Action Icons (Notifications, Settings, Profile) */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationOverlay(!showNotificationOverlay)}
              className="p-2 rounded-xl bg-white/5 text-vibe-text-muted hover:text-white hover:bg-white/10 transition-all cursor-pointer relative"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${currentAccent.bg} animate-ping`} />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${currentAccent.bg}`} />
            </button>

            {/* Notification Dropdown Overlay */}
            <AnimatePresence>
              {showNotificationOverlay && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 rounded-2xl glass-high border border-white/10 p-4 shadow-2xl z-50 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h4 className="font-display font-semibold text-xs text-white">Notifications</h4>
                    <button 
                      onClick={() => setNotifications([])} 
                      className="text-[10px] text-vibe-primary hover:underline font-mono-labels cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1 hide-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className="text-xs p-2 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                          <p className="text-white/90 leading-snug">{notif.text}</p>
                          <span className="text-[9px] font-mono-labels text-vibe-text-muted/50">{notif.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-center text-vibe-text-muted/60 py-4">No new notifications</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-white/5 text-vibe-text-muted hover:text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Theme customizer button */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/5 text-vibe-text-muted hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Custom Accent Color Theme"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* User Profile Thumbnail */}
          <div 
            onClick={() => setIsGoProOpen(true)}
            className={`w-9 h-9 rounded-full overflow-hidden border border-white/10 cursor-pointer active:scale-90 transition-transform ${currentAccent.text}`}
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="User profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      {/* Side Navigation Rail & Menu (Desktop) */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-16px)] w-64 border-r border-white/5 bg-vibe-surface/85 backdrop-blur-xl p-6 hidden lg:flex flex-col gap-2 z-35 justify-between">
        <div className="space-y-6">
          <div className="pl-3">
            <h4 className="font-display font-semibold text-vibe-text text-base">Vibe Hub</h4>
            <p className="text-[10px] font-mono-labels text-vibe-text-muted/60 tracking-wider uppercase mt-1">Premium Lounge</p>
          </div>

          <nav className="space-y-1.5">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home' && !selectedPlaylist
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-xs">Home</span>
            </button>

            <button 
              onClick={() => { setActiveTab('trending'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'trending' 
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="text-xs">Trending</span>
            </button>

            <button 
              onClick={() => { setActiveTab('live'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'live' 
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Radio className="w-4 h-4 animate-pulse text-red-400" />
              <span className="text-xs flex items-center gap-1.5">
                <span>Live Stream</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              </span>
            </button>

            <button 
              onClick={() => { setActiveTab('movies'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'movies' 
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Film className="w-4 h-4" />
              <span className="text-xs">Movies</span>
            </button>

            <button 
              onClick={() => { setActiveTab('animation'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'animation' 
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="text-xs">Animation</span>
            </button>

            <button 
              onClick={() => { setActiveTab('music'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'music' 
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Music className="w-4 h-4" />
              <span className="text-xs">Music</span>
            </button>

            <button 
              onClick={() => { setActiveTab('playlists'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'playlists' || selectedPlaylist
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              <span className="text-xs">Playlists</span>
            </button>

            <button 
              onClick={() => { setActiveTab('library'); setSelectedPlaylist(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'library' 
                  ? `bg-gradient-to-r ${currentAccent.gradient} ${currentAccent.onBg} font-bold shadow-md shadow-vibe-primary/10` 
                  : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <FolderHeart className="w-4 h-4 text-vibe-secondary" />
              <span className="text-xs">Vault Uploads</span>
            </button>
          </nav>
        </div>

        {/* Go Pro Promo Card */}
        <div className="rounded-2xl p-4 glass border border-white/5 relative overflow-hidden flex flex-col justify-end">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <Sparkles className="w-12 h-12 text-vibe-primary" />
          </div>
          <h5 className="font-display font-bold text-xs text-white">VIBE PRO Premium</h5>
          <p className="text-[10px] text-vibe-text-muted mt-1 leading-relaxed">Access 4K lossless streaming, Dolby audio & high-fidelity playlists.</p>
          <button 
            onClick={() => setIsGoProOpen(true)}
            className={`mt-3 py-2 w-full rounded-xl bg-vibe-primary text-vibe-bg font-bold text-[11px] hover:scale-[1.03] active:scale-95 transition-all shadow-md shadow-vibe-primary/20 cursor-pointer`}
          >
            Upgrade Now
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation (Slide-out menu) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-64 bg-vibe-surface-high border-r border-white/10 z-50 p-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className={`font-display font-extrabold text-2xl tracking-tighter bg-gradient-to-r ${currentAccent.gradient} bg-clip-text text-transparent`}>
                  VIBE Menu
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-vibe-text-muted hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { tab: 'home', label: 'Home', icon: Home },
                  { tab: 'trending', label: 'Trending', icon: Flame },
                  { tab: 'live', label: 'Live Stream', icon: Radio },
                  { tab: 'movies', label: 'Movies', icon: Film },
                  { tab: 'animation', label: 'Animation', icon: Tv },
                  { tab: 'music', label: 'Music', icon: Music },
                  { tab: 'playlists', label: 'Playlists', icon: ListMusic },
                  { tab: 'library', label: 'Vault Uploads', icon: FolderHeart },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={item.tab}
                      onClick={() => {
                        setActiveTab(item.tab as any);
                        setSelectedPlaylist(null);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left cursor-pointer transition-all ${
                        activeTab === item.tab
                          ? `bg-vibe-primary/20 text-vibe-primary border-l-4 border-vibe-primary font-bold`
                          : 'text-vibe-text-muted hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => { setIsGoProOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-vibe-primary text-vibe-bg font-bold text-xs text-center cursor-pointer shadow-lg shadow-vibe-primary/25 hover:opacity-90 active:scale-95 transition-all"
              >
                Upgrade to Pro
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Screen content container (shifts on desktop due to fixed sidebar) */}
      <main className="lg:pl-64 pt-20 px-6 lg:px-12 flex-grow">
        
        {/* Search Results Pane (If user starts typing, we interrupt and show results!) */}
        {searchQuery.trim() !== '' ? (
          <div className="space-y-6 py-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="font-display font-bold text-2xl text-white">Search Results for "{searchQuery}"</h2>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-vibe-primary hover:underline font-mono-labels flex items-center gap-1 cursor-pointer"
              >
                Clear Search <X className="w-3 h-3" />
              </button>
            </div>

            {filteredMediaItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                {filteredMediaItems.map(item => (
                  <MediaCard 
                    key={item.id} 
                    item={item} 
                    onPlay={handlePlayMedia}
                    isActive={item.category === 'music' ? activeAudioItem?.id === item.id : activeVideoItem?.id === item.id}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-2xl glass border border-white/5 max-w-md mx-auto">
                <AlertCircle />
              </div>
            )}
          </div>
        ) : (
          
          /* Standard Tabs Router */
          <AnimatePresence mode="wait">
            
            {/* TAB: HOME */}
            {activeTab === 'home' && !selectedPlaylist && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-12 py-6"
              >
                {/* Immersive Hero Section Banner */}
                <section className="relative h-[480px] md:h-[600px] rounded-3xl overflow-hidden glass border border-white/10 flex flex-col justify-end p-6 md:p-12 shadow-2xl">
                  
                  {/* Backdrop Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={mediaItems[0].thumbnailUrl} 
                      alt="Hero banner background" 
                      className="w-full h-full object-cover opacity-35 filter brightness-90 animate-zoom-slow"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vibe-bg via-vibe-bg/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-vibe-bg via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="inline-block px-3 py-1 bg-vibe-secondary/20 text-vibe-secondary border border-vibe-secondary/30 rounded-full font-mono-labels text-[10px] uppercase tracking-widest">
                      Trending Now
                    </span>
                    <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight leading-none drop-shadow-md">
                      {mediaItems[0].title}
                    </h1>
                    <p className="text-vibe-text-muted text-xs md:text-sm leading-relaxed max-w-xl">
                      {mediaItems[0].description}
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <button 
                        onClick={() => handlePlayMedia(mediaItems[0])}
                        className="px-6 py-3 bg-vibe-primary text-vibe-bg font-extrabold text-xs rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-vibe-primary/30 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-vibe-bg" />
                        {mediaItems[0].isCustom ? 'Play File' : 'Watch Trailer'}
                      </button>
                      <button 
                        onClick={() => triggerShareModal(mediaItems[0])}
                        className="px-6 py-3 glass hover:bg-white/10 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Vibe
                      </button>
                    </div>
                  </div>
                </section>

                {/* Categories Bento Grid */}
                <section className="space-y-4">
                  <h3 className="font-display font-semibold text-lg text-white">Explore Categories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div 
                      onClick={() => setActiveTab('movies')}
                      className="group relative rounded-2xl overflow-hidden glass border border-white/5 hover:border-vibe-primary/30 p-6 flex flex-col justify-end h-32 cursor-pointer transition-all duration-300 bg-gradient-to-tr hover:from-vibe-primary/5 hover:to-transparent"
                    >
                      <Film className="w-8 h-8 text-vibe-primary opacity-25 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                      <h4 className="font-display font-bold text-base text-white">Movies</h4>
                      <p className="text-[11px] text-vibe-text-muted mt-0.5">Cinematic blockbusters in UHD</p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('animation')}
                      className="group relative rounded-2xl overflow-hidden glass border border-white/5 hover:border-vibe-secondary/30 p-6 flex flex-col justify-end h-32 cursor-pointer transition-all duration-300 bg-gradient-to-tr hover:from-vibe-secondary/5 hover:to-transparent"
                    >
                      <Tv className="w-8 h-8 text-vibe-secondary opacity-25 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                      <h4 className="font-display font-bold text-base text-white">Animations</h4>
                      <p className="text-[11px] text-vibe-text-muted mt-0.5">Pixel art and modern canvas</p>
                    </div>

                    <div 
                      onClick={() => setActiveTab('music')}
                      className="group relative rounded-2xl overflow-hidden glass border border-white/5 hover:border-vibe-tertiary/30 p-6 flex flex-col justify-end h-32 cursor-pointer transition-all duration-300 bg-gradient-to-tr hover:from-vibe-tertiary/5 hover:to-transparent"
                    >
                      <Music className="w-8 h-8 text-vibe-tertiary opacity-25 group-hover:opacity-100 transition-opacity absolute top-4 right-4" />
                      <h4 className="font-display font-bold text-base text-white">Music Playlists</h4>
                      <p className="text-[11px] text-vibe-text-muted mt-0.5">HIFI lossless playlist decks</p>
                    </div>
                  </div>
                </section>

                {/* Continue Watching Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-lg text-white">Continue Watching</h3>
                    <button 
                      onClick={() => setActiveTab('movies')}
                      className="text-xs text-vibe-primary hover:underline font-mono-labels cursor-pointer"
                    >
                      See History
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                    {continueWatchingItems.map(item => (
                      <MediaCard 
                        key={item.id} 
                        item={item} 
                        onPlay={handlePlayMedia}
                        isActive={item.category === 'music' ? activeAudioItem?.id === item.id : activeVideoItem?.id === item.id}
                      />
                    ))}
                  </div>
                </section>

                {/* Jump Back In (Music Grid Layout) */}
                <section className="space-y-6">
                  <h3 className="font-display font-semibold text-lg text-white">Jump Back In</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    {getMusicItems.map(song => {
                      const isThisSongActive = activeAudioItem?.id === song.id;
                      return (
                        <div 
                          key={song.id}
                          onClick={() => handlePlayMedia(song)}
                          className={`flex items-center gap-4 p-4 glass rounded-2xl border transition-all duration-300 cursor-pointer group hover:bg-white/[0.02] ${
                            isThisSongActive 
                              ? 'border-vibe-primary/40 bg-vibe-primary/5 shadow-md shadow-vibe-primary/5' 
                              : 'border-white/5 hover:border-vibe-secondary/20'
                          }`}
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-vibe-bg-dark flex-shrink-0 relative">
                            <img 
                              src={song.thumbnailUrl} 
                              alt={song.title} 
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            {/* Hover mini-play button */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          </div>
                          
                          <div className="overflow-hidden flex-grow">
                            <h4 className={`font-display font-bold text-xs truncate transition-colors ${isThisSongActive ? 'text-vibe-primary' : 'text-vibe-text group-hover:text-vibe-secondary'}`}>
                              {song.title}
                            </h4>
                            <p className="text-vibe-text-muted text-[10px] font-mono-labels truncate">{song.artist}</p>
                            
                            {/* Wave bar indicator if actively playing */}
                            {isThisSongActive && isAudioPlaying && (
                              <div className="mt-2 flex items-center gap-1 text-vibe-primary">
                                <span className="w-1 h-3.5 rounded bg-vibe-primary animate-pulse-bar-1" />
                                <span className="w-1 h-4 rounded bg-vibe-secondary animate-pulse-bar-2" />
                                <span className="w-1 h-2.5 rounded bg-vibe-primary animate-pulse-bar-3" />
                                <span className="text-[9px] uppercase font-mono-labels font-bold tracking-wider ml-1">Now Playing</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            )}

            {/* TAB: MOVIES */}
            {activeTab === 'movies' && (() => {
              const customMovies = moviesList.filter(m => m.isCustom);
              const standardMovies = moviesList.filter(m => !m.isCustom);
              return (
                <motion.div 
                  key="movies"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 py-6"
                >
                  <div>
                    <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Featured Movies</h2>
                    <p className="text-vibe-text-muted text-xs md:text-sm mt-1">Cinematic blockbusters, documentaries, and family travels in ultra-high fidelity.</p>
                  </div>

                  {customMovies.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                        <Film className="w-4 h-4 text-vibe-secondary" />
                        <h3 className="font-display font-bold text-lg text-white">My Uploaded Video Clips</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono-labels bg-vibe-secondary/20 border border-vibe-secondary/30 text-vibe-secondary font-bold">
                          {customMovies.length} Clips
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                        {customMovies.map(movie => (
                          <MediaCard 
                            key={movie.id}
                            item={movie}
                            onPlay={handlePlayMedia}
                            isActive={activeVideoItem?.id === movie.id}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {customMovies.length > 0 && (
                      <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                        <Sparkles className="w-4 h-4 text-vibe-primary" />
                        <h3 className="font-display font-bold text-lg text-white">Featured Catalog</h3>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                      {standardMovies.map(movie => (
                        <MediaCard 
                          key={movie.id}
                          item={movie}
                          onPlay={handlePlayMedia}
                          isActive={activeVideoItem?.id === movie.id}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* TAB: ANIMATION */}
            {activeTab === 'animation' && (() => {
              const customAnimes = animationsList.filter(a => a.isCustom);
              const standardAnimes = animationsList.filter(a => !a.isCustom);
              return (
                <motion.div 
                  key="animation"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 py-6"
                >
                  <div>
                    <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Animations</h2>
                    <p className="text-vibe-text-muted text-xs md:text-sm mt-1">Stunning visual realism, pixel loops, and puppy adventures.</p>
                  </div>

                  {customAnimes.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                        <Tv className="w-4 h-4 text-vibe-secondary" />
                        <h3 className="font-display font-bold text-lg text-white">My Uploaded Animations</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-mono-labels bg-vibe-secondary/20 border border-vibe-secondary/30 text-vibe-secondary font-bold">
                          {customAnimes.length} Clips
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                        {customAnimes.map(anime => (
                          <MediaCard 
                            key={anime.id}
                            item={anime}
                            onPlay={handlePlayMedia}
                            isActive={activeVideoItem?.id === anime.id}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {customAnimes.length > 0 && (
                      <div className="flex items-center gap-2 pb-1 border-b border-white/5">
                        <Sparkles className="w-4 h-4 text-vibe-primary" />
                        <h3 className="font-display font-bold text-lg text-white">Featured Catalog</h3>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                      {standardAnimes.map(anime => (
                        <MediaCard 
                          key={anime.id}
                          item={anime}
                          onPlay={handlePlayMedia}
                          isActive={activeVideoItem?.id === anime.id}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {/* TAB: MUSIC */}
            {activeTab === 'music' && (
              <motion.div 
                key="music"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Music Lounge</h2>
                    <p className="text-vibe-text-muted text-xs md:text-sm mt-1">Experience HIFI stereo streaming, ambient soundwaves, and curated tracks.</p>
                  </div>
                  <button 
                    onClick={() => setIsCreatingPlaylist(true)}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:border-vibe-primary hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-vibe-primary" /> Curate Playlist
                  </button>
                </div>

                {/* Interactive Waveform / visualizer banner */}
                <div className="h-44 rounded-3xl glass border border-white/5 relative overflow-hidden flex items-center justify-between p-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-vibe-primary/5 via-vibe-secondary/5 to-transparent blur-xl" />
                  <div className="relative z-10 max-w-sm space-y-2">
                    <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                      <Music className="w-5 h-5 text-vibe-secondary animate-bounce" />
                      Active Lossless Streaming
                    </h3>
                    <p className="text-vibe-text-muted text-xs leading-relaxed">
                      LOSSLESS FLAC 24-bit streams calibrated for your connected spatial headphones. Feel every dynamic beat.
                    </p>
                  </div>

                  {/* Aesthetic Equalizer Audio Waveform loop rendering */}
                  <div className="h-full flex items-end gap-1 px-4 opacity-75">
                    {[1,2,3,4,3,2,1,2,3,4,5,4,3,2,1,2,3,4,3,2,3,4,5,6,5,4,3,2,1].map((barHeight, idx) => (
                      <span 
                        key={idx} 
                        className={`w-1 rounded-full ${
                          idx % 2 === 0 ? 'bg-vibe-primary' : 'bg-vibe-secondary'
                        } ${isAudioPlaying ? 'animate-waveform-bar' : ''}`}
                        style={{ 
                          height: `${barHeight * 12}%`,
                          animationDelay: `${idx * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Always-on Graphic Equalizer inside Music Lounge when a song is loaded */}
                {activeAudioItem && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full"
                  >
                    <GraphicEqualizer 
                      isPlaying={isAudioPlaying} 
                      currentTrackTitle={activeAudioItem.title} 
                    />
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
                  {musicSongsList.map(song => (
                    <MediaCard 
                      key={song.id}
                      item={song}
                      onPlay={handlePlayMedia}
                      isActive={activeAudioItem?.id === song.id}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: PLAYLISTS */}
            {(activeTab === 'playlists' || selectedPlaylist) && (
              <motion.div 
                key="playlists"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                {selectedPlaylist ? (
                  /* PLAYLIST DETAIL DECK VIEW */
                  <div className="space-y-6">
                    <button 
                      onClick={() => setSelectedPlaylist(null)}
                      className="text-xs text-vibe-primary hover:underline font-mono-labels flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" /> Back to Playlists
                    </button>

                    <div className="flex flex-col md:flex-row gap-6 p-6 glass rounded-3xl border border-white/15 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-vibe-primary/5 to-transparent" />
                      <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-2xl relative flex-shrink-0 border border-white/10">
                        <img 
                          src={selectedPlaylist.coverUrl} 
                          alt={selectedPlaylist.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col justify-end space-y-3 relative z-10">
                        <span className="text-[10px] uppercase font-mono-labels font-bold tracking-widest text-vibe-secondary">
                          Playlist Deck
                        </span>
                        <h2 className="font-display font-extrabold text-2xl md:text-4xl text-white">
                          {selectedPlaylist.name}
                        </h2>
                        <p className="text-vibe-text-muted text-xs leading-relaxed max-w-xl">
                          {selectedPlaylist.description}
                        </p>
                        <p className="text-[10px] font-mono-labels text-white/50">
                          {selectedPlaylist.items.length} Lossless Tracks curating
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-semibold text-base text-white">Tracks</h3>
                      <div className="space-y-2">
                        {selectedPlaylist.items.length > 0 ? (
                          selectedPlaylist.items.map((song, idx) => {
                            const isCurrentSongActive = activeAudioItem?.id === song.id;
                            return (
                              <div 
                                key={song.id}
                                onClick={() => handlePlayMedia(song)}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group hover:bg-white/[0.02] ${
                                  isCurrentSongActive 
                                    ? 'bg-vibe-primary/10 border-vibe-primary/20 text-white' 
                                    : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-vibe-text-muted'
                                }`}
                              >
                                <div className="flex items-center gap-4 min-w-0">
                                  <span className="text-xs font-mono-labels font-bold text-white/40 w-4 text-right">
                                    {idx + 1}
                                  </span>
                                  <img 
                                    src={song.thumbnailUrl} 
                                    alt={song.title} 
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0">
                                    <h4 className={`font-display font-bold text-xs truncate ${isCurrentSongActive ? 'text-vibe-primary' : 'text-white'}`}>
                                      {song.title}
                                    </h4>
                                    <p className="text-[10px] font-mono-labels text-vibe-text-muted/60 truncate">{song.artist}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 font-mono-labels text-[10px]">
                                  <span className="text-vibe-text-muted/40 uppercase tracking-wider">{song.album || 'Single'}</span>
                                  <span className="text-vibe-text-muted/60">{song.duration}</span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-12 text-center rounded-2xl glass text-vibe-text-muted text-xs">
                            No tracks added to this playlist yet. Create/add music to listen!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PLAYLISTS DIRECTORY INDEX VIEW */
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Curated Playlists</h2>
                        <p className="text-vibe-text-muted text-xs md:text-sm mt-1">Explore curated vibes or build your custom premium playlists.</p>
                      </div>
                      <button 
                        onClick={() => setIsCreatingPlaylist(true)}
                        className="px-4 py-2 bg-vibe-primary text-vibe-bg hover:opacity-95 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-vibe-primary/25"
                      >
                        <Plus className="w-4 h-4 fill-vibe-bg" /> Create Playlist
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {playlists.map(playlist => (
                        <div 
                          key={playlist.id}
                          onClick={() => setSelectedPlaylist(playlist)}
                          className="group rounded-2xl overflow-hidden glass border border-white/5 hover:border-vibe-secondary/30 p-6 flex items-start gap-4 cursor-pointer transition-all duration-300 hover:bg-white/[0.01]"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden shadow-xl flex-shrink-0 border border-white/5">
                            <img 
                              src={playlist.coverUrl} 
                              alt={playlist.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="overflow-hidden space-y-1">
                            <h4 className="font-display font-bold text-sm text-white truncate group-hover:text-vibe-secondary transition-colors">
                              {playlist.name}
                            </h4>
                            <p className="text-vibe-text-muted text-[11px] line-clamp-2 leading-relaxed">
                              {playlist.description}
                            </p>
                            <span className="inline-block text-[9px] font-mono-labels uppercase tracking-wider text-vibe-secondary/80 font-bold pt-1">
                              {playlist.items.length} Lossless Tracks
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: VAULT UPLOADS (LIBRARY) */}
            {activeTab === 'library' && (
              <motion.div key="library">
                <LibraryUploadView 
                  customItems={customUploadsList}
                  onAddCustomItem={handleAddCustomItem}
                  onDeleteCustomItem={handleDeleteCustomItem}
                  onPlayItem={handlePlayMedia}
                />
              </motion.div>
            )}

            {/* TAB: LIVE DECK */}
            {activeTab === 'live' && (
              <motion.div 
                key="live"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8 py-6"
              >
                <div>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Live Virtual Stream</h2>
                  <p className="text-vibe-text-muted text-xs md:text-sm mt-1">Immerse yourself in active electronic DJ stream rooms with visual projection networks.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Active Video Stream Container */}
                  <div className="flex-grow aspect-video rounded-3xl overflow-hidden glass border border-white/10 bg-black relative flex items-center justify-center">
                    
                    {/* Visualizer Loop Background */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-vibe-primary/20 via-vibe-secondary/20 to-transparent animate-pulse" />
                    
                    {/* Retro Cyber DJ visual backdrop */}
                    <img 
                      src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80" 
                      alt="DJ visualizer backdrop" 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 filter hue-rotate-90 saturate-200"
                      referrerPolicy="no-referrer"
                    />

                    {/* Miniature Pulsing Dot */}
                    <div className="absolute top-6 left-6 px-3 py-1 bg-red-600 border border-red-500/20 text-white rounded-md text-[10px] uppercase font-mono-labels font-bold tracking-widest flex items-center gap-1.5 shadow-lg shadow-red-600/35">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Live Stream
                    </div>

                    <div className="absolute top-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-mono-labels text-white flex items-center gap-1">
                      <span className="text-vibe-secondary font-bold">12,455</span> listening
                    </div>

                    <div className="relative z-10 text-center space-y-4 p-8">
                      <div className="w-16 h-16 rounded-full bg-vibe-primary/10 border border-vibe-primary/30 flex items-center justify-center text-vibe-primary glow-purple animate-bounce mx-auto">
                        <Radio className="w-8 h-8" />
                      </div>
                      <h3 className="font-display font-black text-2xl md:text-3xl text-white">ELECTRONIC ZEN GARDEN</h3>
                      <p className="text-vibe-text-muted text-xs max-w-sm mx-auto leading-relaxed">
                        Currently broadcasting lossless spatial retro beats, lofi loops and 3D visual projection mappings.
                      </p>
                      
                      {/* Active Visualizer Bars */}
                      <div className="flex items-end justify-center gap-1 h-8">
                        {[1, 3, 2, 4, 3, 5, 4, 2, 4, 3, 2, 4, 5, 3, 4, 2, 1].map((h, i) => (
                          <span 
                            key={i} 
                            className="w-1 rounded bg-vibe-secondary animate-waveform-bar"
                            style={{ 
                              height: `${h * 20}%`,
                              animationDelay: `${i * 0.08}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Chat Side panel */}
                  <div className="w-full lg:w-[350px] rounded-3xl glass border border-white/10 bg-vibe-surface/80 flex flex-col h-[400px] lg:h-auto">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs text-white">Live Lounge Chat</h4>
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    </div>

                    {/* Chat Bubble log */}
                    <div className="flex-grow p-4 space-y-3 overflow-y-auto hide-scrollbar text-xs">
                      {liveChatMessages.map((msg, idx) => (
                        <div key={idx} className="bg-white/[0.01] p-2 rounded-xl border border-white/5">
                          <span className={`${msg.color} font-bold mr-1.5`}>{msg.user}:</span>
                          <span className="text-vibe-text-muted">{msg.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={submitLiveChatMessage} className="p-4 border-t border-white/5 flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Say something nice..." 
                        value={newChatMessage}
                        onChange={(e) => setNewChatMessage(e.target.value)}
                        className={`flex-grow bg-vibe-surface border border-white/5 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 ${currentAccent.focusRing} text-white`}
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-vibe-primary text-vibe-bg font-extrabold text-xs rounded-xl cursor-pointer"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: TRENDING */}
            {activeTab === 'trending' && (
              <motion.div 
                key="trending"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 py-6"
              >
                <div>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Trending Hub</h2>
                  <p className="text-vibe-text-muted text-xs md:text-sm mt-1">The most viewed cinematic files, animations, and playlists of the hour.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter pt-4">
                  {trendingItems.map(item => (
                    <MediaCard 
                      key={item.id}
                      item={item}
                      onPlay={handlePlayMedia}
                      isActive={item.category === 'music' ? activeAudioItem?.id === item.id : activeVideoItem?.id === item.id}
                    />
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}
      </main>

      {/* Footer Branding Margins */}
      <footer className="lg:pl-64 w-full py-12 border-t border-white/5 mt-20 bg-vibe-bg-dark flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 text-center md:text-left gap-6">
        <div className="space-y-2">
          <span className="font-display font-black text-xl text-white tracking-tighter">VIBE</span>
          <p className="text-[10px] font-mono-labels text-vibe-text-muted/50">
            © 2026 VIBE Premium Entertainment Hub. All rights reserved. Made in Spatial Stereo.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-mono-labels text-vibe-text-muted/60">
          <a href="#" className="hover:text-vibe-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-vibe-primary transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-vibe-primary transition-colors">Support Center</a>
          <a href="#" className="hover:text-vibe-primary transition-colors">Careers</a>
        </div>
      </footer>

      {/* Collapsible Equalizer Rack Overlay */}
      <AnimatePresence>
        {showEqualizer && activeAudioItem && (
          <motion.div 
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="fixed bottom-24 left-0 lg:left-64 right-0 z-40 p-4 md:p-6"
          >
            <div className="max-w-6xl mx-auto shadow-2xl relative">
              <button 
                onClick={() => setShowEqualizer(false)}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-vibe-bg-dark border border-vibe-border text-vibe-text-muted hover:text-white transition-all cursor-pointer hover:scale-105 flex items-center justify-center"
                title="Minimize Equalizer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <GraphicEqualizer 
                isPlaying={isAudioPlaying} 
                currentTrackTitle={activeAudioItem.title} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Now Playing Bottom Controller */}
      <NowPlayingBar 
        item={activeAudioItem}
        isPlaying={isAudioPlaying}
        onTogglePlay={handleToggleAudioPlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onToggleEqualizer={() => setShowEqualizer(!showEqualizer)}
        showEqualizer={showEqualizer}
      />

      {/* Video Player Modal (Theater Mode Overlay) */}
      <AnimatePresence>
        {activeVideoItem && (
          <TheaterPlayerModal 
            item={activeVideoItem}
            onClose={() => setActiveVideoItem(null)}
          />
        )}
      </AnimatePresence>

      {/* MODAL: upgrade to premium Pro */}
      <AnimatePresence>
        {isGoProOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl glass-high p-8 border border-vibe-primary/20 relative space-y-6 text-center"
            >
              {/* Radial neon glow behind */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-vibe-primary/5 blur-3xl rounded-full" />
              
              <button 
                onClick={() => setIsGoProOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 bg-vibe-primary/10 border border-vibe-primary/25 rounded-2xl flex items-center justify-center text-vibe-primary glow-purple mx-auto transform hover:rotate-12 duration-300">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-xl text-white">Upgrade to VIBE PRO</h3>
                <p className="text-vibe-text-muted text-xs leading-relaxed">
                  Join VIBE PRO to stream lossless spatial theater audio, view 4K cinematic encodes, and unlock unlimited drag-and-drop vault uploads.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-vibe-secondary" />
                  <span>Lossless spatial audio & Dolby Digital ATMOS</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-vibe-secondary" />
                  <span>True 4K UHD Cinematic theatrical encodes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-vibe-secondary" />
                  <span>Unlimited private media vault uploads</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsGoProOpen(false);
                  setNotifications(prev => [
                    { id: Date.now(), text: "Welcome to VIBE PRO! Premium HIFI activated.", time: "Just now" },
                    ...prev
                  ]);
                }}
                className="w-full py-3.5 rounded-xl bg-vibe-primary text-vibe-bg font-extrabold text-xs shadow-lg shadow-vibe-primary/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                Claim Premium Access (Free Trial)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: custom accent theme config */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl glass-high p-8 border border-white/10 relative space-y-6 text-center"
            >
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-vibe-primary mx-auto">
                <Settings className="w-5 h-5 text-vibe-primary animate-spin-slow" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-lg text-white">Hub Color Theme</h3>
                <p className="text-vibe-text-muted text-xs">Personalize the tactile vibe aesthetic of your entertainment lounge.</p>
              </div>

              {/* Theme selections */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'purple', name: 'Electric Purple', color: 'bg-vibe-primary' },
                  { id: 'cyan', name: 'Neon Cyan', color: 'bg-vibe-secondary' },
                  { id: 'orange', name: 'Energetic Orange', color: 'bg-[#ec6a06]' },
                ].map(th => (
                  <button
                    key={th.id}
                    onClick={() => setVibeTheme(th.id as any)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center gap-2 ${
                      vibeTheme === th.id 
                        ? 'border-white/20 bg-white/5 scale-105' 
                        : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full ${th.color} shadow-md`} />
                    <span className="text-[10px] font-bold text-white/80">{th.name}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 flex items-center justify-between text-left text-xs text-vibe-text-muted">
                <span>Display Theme Mode</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold font-mono-labels text-[10px] uppercase flex items-center gap-1.5 hover:bg-white/10"
                >
                  {isDarkMode ? <Moon className="w-3.5 h-3.5 text-vibe-primary animate-pulse" /> : <Sun className="w-3.5 h-3.5 text-vibe-secondary" />}
                  <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>

              <div className="border-t border-white/5 pt-4 flex items-center justify-between text-left text-xs text-vibe-text-muted">
                <span>Audio Render Engine</span>
                <span className="font-mono-labels font-bold text-vibe-secondary">24-BIT FLAC HIFI</span>
              </div>

              <button 
                onClick={() => setIsSettingsOpen(false)}
                className={`w-full py-3 rounded-xl bg-vibe-primary text-vibe-bg font-extrabold text-xs cursor-pointer hover:opacity-90 active:scale-95 transition-all`}
              >
                Save Theme
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Curator playlist creator */}
      <AnimatePresence>
        {isCreatingPlaylist && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl glass-high p-8 border border-white/10 relative space-y-5"
            >
              <button 
                onClick={() => setIsCreatingPlaylist(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <ListMusic className="w-6 h-6 text-vibe-primary" />
                <h3 className="font-display font-extrabold text-lg text-white">Create Curated Playlist</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono-labels text-vibe-text-muted/80">Playlist Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Cyberpunk Chill, Midnight Beats"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full bg-vibe-surface border border-white/5 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-vibe-primary text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono-labels text-vibe-text-muted/80">Short Description</label>
                  <textarea 
                    placeholder="Describe the mood or genre of this list..."
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-vibe-surface border border-white/5 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-vibe-primary text-white resize-none"
                  />
                </div>

                {/* Song checkboxes */}
                <div className="space-y-2">
                  <label className="font-mono-labels text-vibe-text-muted/80 block">Select Music to Add</label>
                  <div className="max-h-44 overflow-y-auto space-y-2 pr-1 hide-scrollbar">
                    {mediaItems.filter(i => i.category === 'music').map(song => {
                      const isSelected = selectedSongsForPlaylist.includes(song.id);
                      return (
                        <div 
                          key={song.id}
                          onClick={() => toggleSongSelectionForPlaylist(song.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-vibe-primary/10 border-vibe-primary/30 text-white' 
                              : 'bg-white/[0.01] border-white/5 text-vibe-text-muted hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={song.thumbnailUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-xs">{song.title}</p>
                              <p className="text-[10px] opacity-60 font-mono-labels">{song.artist}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-vibe-primary border-vibe-primary text-vibe-bg' : 'border-white/20'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setIsCreatingPlaylist(false)}
                  className="flex-grow py-3 rounded-xl border border-white/5 hover:bg-white/5 text-white font-bold text-xs cursor-pointer transition-all text-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-grow py-3 rounded-xl bg-vibe-primary text-vibe-bg font-extrabold text-xs shadow-lg shadow-vibe-primary/25 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all text-center cursor-pointer"
                >
                  Create Playlist Deck
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Share media */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl glass-high p-8 border border-white/10 relative space-y-5 text-center"
            >
              <button 
                onClick={() => setIsShareOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 bg-vibe-secondary/10 border border-vibe-secondary/25 rounded-2xl flex items-center justify-center text-vibe-secondary mx-auto">
                <Share2 className="w-5 h-5 text-vibe-secondary animate-pulse" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-lg text-white">Share your Vibe</h3>
                <p className="text-vibe-text-muted text-xs">Copy link or share custom playlist streams with friends.</p>
              </div>

              <textarea 
                readOnly
                value={shareMessage}
                rows={3}
                className="w-full bg-vibe-surface border border-white/5 rounded-2xl p-3.5 text-xs text-vibe-text-muted font-mono-labels resize-none focus:outline-none"
              />

              <button 
                onClick={copyShareToClipboard}
                className="w-full py-3 rounded-xl bg-vibe-secondary text-vibe-bg font-extrabold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Copy to Clipboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
