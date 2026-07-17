import { MediaItem, Playlist } from './types';

export const initialMediaItems: MediaItem[] = [
  // FEATURED: Neon Drift (Hero)
  {
    id: 'neon-drift-2049',
    title: 'Neon Drift: 2049',
    artist: 'VIBE Studios',
    category: 'movie',
    duration: '2h 14m',
    durationSeconds: 8040,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPaTE2MrDbP4I3Ijh6ZhuZHb_D4PPYjJSgfGT3ST7uhCXbDoQ4Yxy-Vl1C26F9VMZRjNy354FBFyOFjwIcvOI0RPdPMxxfwJ_JtaU4mhFPsyOJUd0gy4G4zNZEpddl1l9UTkqLgpSuZRv0ug_bbLuvjcqTb8bzMacIkg8n2nRz5wFomRRib7BBNAR3Uvrq3_MZubQWZ-IqJrngwcPzV_8kzdBWVPDvDA4UWg7rzjzBnOflJtqlRw5z32RChQYy7n0YW-EYUEVTLDz',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    isTrending: true,
    description: 'Dive into the sprawling cyber-cityscape where music is currency and light is power. Experience the definitive cinematic event of the season.',
    transcript: [
      { time: 0, text: "[Electronic music playing in the background]" },
      { time: 5, text: "Systems online. Target acquired in Sector 7." },
      { time: 12, text: "Wait, the cyber-grid is fluctuating! Power levels are dropping." },
      { time: 20, text: "Hold on tight. We are going into the neon slipstream." },
      { time: 30, text: "Unbelievable... the entire grid is singing." },
      { time: 45, text: "They thought they could lock down the light. They were wrong." }
    ]
  },
  // MOVIES / ANIMATIONS (Continue Watching row)
  {
    id: 'nyc-adventure',
    title: 'NYC Adventure',
    artist: 'Family Travel Logs',
    category: 'movie',
    duration: '1:25',
    durationSeconds: 85,
    timeLeft: '24 mins left',
    progress: 65,
    isContinueWatching: true,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPPaTE2MrDbP4I3Ijh6ZhuZHb_D4PPYjJSgfGT3ST7uhCXbDoQ4Yxy-Vl1C26F9VMZRjNy354FBFyOFjwIcvOI0RPdPMxxfwJ_JtaU4mhFPsyOJUd0gy4G4zNZEpddl1l9UTkqLgpSuZRv0ug_bbLuvjcqTb8bzMacIkg8n2nRz5wFomRRib7BBNAR3Uvrq3_MZubQWZ-IqJrngwcPzV_8kzdBWVPDvDA4UWg7rzjzBnOflJtqlRw5z32RChQYy7n0YW-EYUEVTLDz',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    episodeInfo: 'S1 : E4',
    description: 'Join us on an unforgettable family trip through New York City. From taxi rides and central park rowboats to art galleries, pizza spots, and Times Square lights!',
    transcript: [
      { time: 1, text: "I want to get a photo of the bridge structure.", speaker: "Daughter" },
      { time: 4, text: "We're almost there, look at the tower ahead.", speaker: "Father" },
      { time: 10, text: "Row faster, dad!", speaker: "Daughter" },
      { time: 14, text: "I'm trying, just keep that camera steady, ok?", speaker: "Father" },
      { time: 20, text: "We have to meet them in 10 minutes.", speaker: "Father" },
      { time: 24, text: "Wait, look at that screen. It's incredible!", speaker: "Son" },
      { time: 30, text: "Look at the brush strokes here, it looks so real.", speaker: "Daughter" },
      { time: 33, text: "You're right, the artist really captured the light.", speaker: "Father" },
      { time: 40, text: "This view never gets old.", speaker: "Father" },
      { time: 45, text: "Can we come back here tomorrow?", speaker: "Daughter" },
      { time: 50, text: "Watch out, it's hot.", speaker: "Father" },
      { time: 53, text: "Mmm, these are the best dumplings I've ever had.", speaker: "Son" },
      { time: 60, text: "The light is perfect. Just one more... Got it.", speaker: "Son" },
      { time: 70, text: "Do you hear that? It sounds like the building is breathing.", speaker: "Father" },
      { time: 74, text: "I hear it too. It's like a secret message.", speaker: "Son" },
      { time: 80, text: "Look at the buildings, they're so huge!", speaker: "Son" },
      { time: 83, text: "I think I got the perfect shot.", speaker: "Son" }
    ]
  },
  {
    id: 'rural-cow-incident',
    title: 'Rural Cow Incident',
    artist: 'Countryside Chronicles',
    category: 'movie',
    duration: '0:50',
    durationSeconds: 50,
    timeLeft: '15 mins left',
    progress: 82,
    isContinueWatching: true,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqxQlHzby6gCIUZ0nEh0jSFA3QCQDGkH3EoDTrimPQoS-tZl6miRpyo2cQkwdoELRoY38yT0HrgFG_VSpiX1k7edes1Ana4klrmD1D43w_eBogIe74uYWUXRsEVNQLUdOn8fuxxGT46MJKzF5LuO1z3FzcBqPQr_sZISYqvbtQyIOYF_qweipzklN9Xz6nf1_fmeXqEUUg-JBXSCiN69mn5DfVKGPwCdsJUC9hs7EILxT9ZCZcIL_uPvGgeh9Kj3M9WrpTEUuV_s0K',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    episodeInfo: 'Film',
    description: 'A cautionary tale on a country road. High-speed luxury, littering on the highway, and a very angry native cow that teaches city slickers a lesson in local etiquette.',
    transcript: [
      { time: 1, text: "Hey, throw it out. Nobody is watching.", speaker: "Passenger" },
      { time: 5, text: "Gosh, look at the dust. Can't they be more careful?", speaker: "Farmer" },
      { time: 11, text: "Ha ha! Look at him go!", speaker: "Passenger" },
      { time: 20, text: "There, there, don't be angry.", speaker: "Farmer" },
      { time: 28, text: "Oh, oh, danger! Avoid it!", speaker: "Driver" },
      { time: 36, text: "My car! What on earth is happening?", speaker: "Driver" },
      { time: 44, text: "Do you understand now? In the countryside, you have to be careful.", speaker: "Farmer" }
    ]
  },
  {
    id: 'puppy-kitchen',
    title: 'Puppy Kitchen Chronicles',
    artist: 'Paws & Pasta',
    category: 'animation',
    duration: '0:40',
    durationSeconds: 40,
    timeLeft: '48 mins left',
    progress: 12,
    isContinueWatching: true,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJXeDhc4jIKwO8xxlCL32Y0VxF1wPUAWkyOyB4ITfkVGwpJX9bBj2nKi8IAjz9BbZhzqNtDhc-ImIMwb5DRGl-6cox35lducs-05nqF74wKnDqxsYtRgg238Z9xaDf-MHYzr77dzcXVbicKlXNO8ZswM0ZwbWzUEgJWdn2ZqdEcBRg3FZ4IQaeEWzyIGoySb4a_0h_bEhWhn6AXGsUbMDMT009E5mRbpQGBrRYBug1qOhr-B95mM0E1-_83Mwlf4jCXAHSCiKj811t',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    episodeInfo: 'S2 : E1',
    description: 'Golden retriever puppies team up with their dog parents to cook an authentic spaghetti tomato feast! Chaos, whiskers, flour, and absolute cuteness overload in the kitchen.',
    transcript: [
      { time: 1, text: "Let's make some tasty treats!", speaker: "Chef Dog" },
      { time: 2, text: "We'll help you every step of the way.", speaker: "Mama Dog" },
      { time: 4, text: "Ready to cook?", speaker: "Mama Dog" },
      { time: 5, text: "Time to whisk the flour and crack the eggs.", speaker: "Chef Dog" },
      { time: 8, text: "Let's make something delicious!", speaker: "Puppy 1" },
      { time: 10, text: "Woohoo! Flour time!", speaker: "Puppy 2" },
      { time: 12, text: "I'll mix it. Perfect!", speaker: "Puppy 3" },
      { time: 14, text: "We're a great team.", speaker: "Chef Dog" },
      { time: 16, text: "Almost ready, dear.", speaker: "Mama Dog" },
      { time: 18, text: "Looks delicious!", speaker: "Puppy 1" },
      { time: 20, text: "The puppies agree!", speaker: "Mama Dog" },
      { time: 24, text: "All right, kids, let's eat!", speaker: "Chef Dog" },
      { time: 26, text: "Dig in!", speaker: "Puppy Kitchen Team" }
    ]
  },
  {
    id: 'origins',
    title: 'Origins',
    artist: 'Cosmic Science',
    category: 'movie',
    duration: '45m',
    durationSeconds: 2700,
    timeLeft: '30 mins left',
    progress: 44,
    isContinueWatching: true,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt5WN4t86dextBNwxFpzh3jmUGk0qu8tV903T-MErC4ZtZq2ecM4aVVIJT4GmOnaNBTqr8tFI-bKR6AwrS77zQ4kRU0ThTyZEahQaWrynekv5WVk1-YVPj93BS5KZrzDvDH25pKkgXCp7Z4nWZX3tW4TWFzOE54NxAsFg6qUHa7FU06vNhoFRgsBsFqH98JYErl6IuUmw8oUZPSvD7MoZmF41FPICMiETR8jQ5LwsQpLwXe4XjFPcn-N0G93hrU__IBCo2KNMdzsU8',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    episodeInfo: 'Documentary',
    description: 'An abstract cinematic visual of glowing particles swirling around a central core of light. The particles form DNA-like strands in shades of vibrant violet and electric blue.',
    transcript: [
      { time: 0, text: "[Deep ambient drone sounds]" },
      { time: 5, text: "In the beginning, there was only radiation and cooling plasma." },
      { time: 15, text: "As particles collided, they wove the first strands of life." },
      { time: 30, text: "An elegant spiral, carrying the blueprints of consciousness across galaxies." }
    ]
  },

  // MUSIC ITEMS
  {
    id: 'retro-waves',
    title: 'Retro Waves',
    artist: 'Synth Horizon',
    category: 'music',
    duration: '4:55',
    durationSeconds: 295,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk9QMpMyAc1sLT_2oA6Ulu6t0ZZRk_4xHQNnSmZrH0gfHbng7Vx6mUuXBwEkecGRe8lMq2D4ReordVp3IeUN229ihn9VRjztcbynE3iO-mZnyukIx3U2bYULVFcwIVuTWzipZDaiIajO9z6UJs-YnWDfNn90H2LciD5jU2oBSlocTK1leQYe0JR_4hyj0Zq3FOS1osP9cEClUKM1_m3uRp-Mcpel9KMhmtJGDYIAAfDTP4HIYUiqkTHLmdLhzTYU7GygooRg_Wel58',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    album: 'Neon Horizon',
    description: 'Album art featuring a stylized minimalist sunset over a calm geometric ocean. Low-poly aesthetic with a warm color palette of orange, yellow, and deep purple. Retro-synthwave vibe.'
  },
  {
    id: 'midnight-jazz',
    title: 'Midnight Jazz',
    artist: 'The Blue Note Trio',
    category: 'music',
    duration: '7:05',
    durationSeconds: 425,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDupk7dHXgwQ80K7Vvt9dnu6_zqfP06h1AijznyyAVWgFGxcCpMANChEn3a4IdWutQDIcjs7hqUSDrtkdkEJpWJuNFBSQCYkWD92Rdbwfb8FUmo0-Y8znD-rOC6IWbHTwd4Usos_sx_Ltn0WDeR9A2cUD5BS68C1PhxiH_WweITE07dzJ2I6ElNXuVFjAH-UwovXlDONt1shjv9VMfk3yh6mavmPg74kGB92woxELVK97QC-wkHx9kY1Q5IZpZzhSsVaV-btUjU8scv',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    album: 'Shadow Grooves',
    description: 'Close-up of a high-end vinyl record spinning on a modern turntable. Dark moody lighting with a sharp cyan laser line scanning the grooves.'
  },
  {
    id: 'glitch-hop-vol2',
    title: 'Glitch Hop Vol 2',
    artist: 'Neon Beats',
    category: 'music',
    duration: '5:44',
    durationSeconds: 344,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK4TlL82guSxXvqc3CmpoR5GbWsRIIFjdc9p5AszsleInTlEmqA9gssSaxkg_Jwd7jXm3NBLt1InPFsrHN3-UmoYrSyXpZKKE_JJvob3tpIzw-D1yQXVSXB71nfgxMlwc_-3IPDRYVilomwVBp242_RHWqhSABWanbhBMKlD-ceaw4wHQa9qKAcA7B7kqN7-jK3Zv8uoMB16AQWSMeuWfYQcGGDgi4omVjT2j7h7Hm8YiK9yuUGllhzICE09ZWq-yTUh5zLmMUetr2',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    album: 'Noise Control',
    description: 'Album cover showing high-contrast abstract ink splatters in vibrant neon green and black. Dynamic, explosive energy. Edgy urban aesthetic.'
  },
  {
    id: 'ethereal-keys',
    title: 'Ethereal Keys',
    artist: 'Luna Melody',
    category: 'music',
    duration: '5:02',
    durationSeconds: 302,
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg7gFowY6jUb2Af0tNtKBTrmJ78xSnPxczCh4HelvIvEXg5mVaxy2XHf2mR3jMIvgjGfj-FzRqpzqaNtJrHT0IxOHsU4Ts2TZ-1Sl60gYHNsqFzK5Z5jV38OlY8DQQPwG2T5lPZaR9FGyiwuAR76CMq2mBldJn2_TYOF_F2Lphjy8xTP_zJVXTFR-bUR8DO0wWVhQvijMM_vDol8dFIOH5ldDEDP4mhvmQJ9UVw-hZ-yVtVBhq5qldDvNVCCIWifFd7wehidaX4ffZ',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    album: 'Astral Echoes',
    description: 'A serene landscape with a lone piano sitting in a field of glowing flowers under a starry night sky. Magical, peaceful atmosphere.'
  }
];

export const initialPlaylists: Playlist[] = [
  {
    id: 'cyber-synth-glow',
    name: 'Cyber Synth Glow',
    description: 'Vibrant and energetic tracks featuring heavy synth work and retro futuristic beats.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk9QMpMyAc1sLT_2oA6Ulu6t0ZZRk_4xHQNnSmZrH0gfHbng7Vx6mUuXBwEkecGRe8lMq2D4ReordVp3IeUN229ihn9VRjztcbynE3iO-mZnyukIx3U2bYULVFcwIVuTWzipZDaiIajO9z6UJs-YnWDfNn90H2LciD5jU2oBSlocTK1leQYe0JR_4hyj0Zq3FOS1osP9cEClUKM1_m3uRp-Mcpel9KMhmtJGDYIAAfDTP4HIYUiqkTHLmdLhzTYU7GygooRg_Wel58',
    items: [
      initialMediaItems[5], // Retro Waves
      initialMediaItems[7], // Glitch Hop Vol 2
    ]
  },
  {
    id: 'midnight-lounge',
    name: 'Midnight Lounge',
    description: 'Chill, ambient, and jazz-infused tracks for deep focus or winding down in the premium lounge.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDupk7dHXgwQ80K7Vvt9dnu6_zqfP06h1AijznyyAVWgFGxcCpMANChEn3a4IdWutQDIcjs7hqUSDrtkdkEJpWJuNFBSQCYkWD92Rdbwfb8FUmo0-Y8znD-rOC6IWbHTwd4Usos_sx_Ltn0WDeR9A2cUD5BS68C1PhxiH_WweITE07dzJ2I6ElNXuVFjAH-UwovXlDONt1shjv9VMfk3yh6mavmPg74kGB92woxELVK97QC-wkHx9kY1Q5IZpZzhSsVaV-btUjU8scv',
    items: [
      initialMediaItems[6], // Midnight Jazz
      initialMediaItems[8], // Ethereal Keys
    ]
  }
];
