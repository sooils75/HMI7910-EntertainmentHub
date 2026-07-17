export interface TranscriptItem {
  time: number; // in seconds
  text: string;
  speaker?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  artist: string;
  category: 'movie' | 'animation' | 'music';
  duration: string; // duration string (e.g. "24 mins", "4:55", "1:25")
  durationSeconds: number; // for seeking & progress tracking
  timeLeft?: string; // e.g. "15 mins left"
  thumbnailUrl: string;
  mediaUrl: string; // local or public streaming URL
  isTrending?: boolean;
  isContinueWatching?: boolean;
  progress?: number; // 0-100 percentage
  episodeInfo?: string; // e.g. "S1 : E4", "Film", "S2 : E1"
  description: string;
  album?: string;
  transcript?: TranscriptItem[];
  isCustom?: boolean; // True if uploaded by the user
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  items: MediaItem[];
}
