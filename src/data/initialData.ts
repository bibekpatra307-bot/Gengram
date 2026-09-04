import { User, Post, Story, Conversation, Message, Notification, UserSettings, ReportComplaint } from '../types';

export const CURRENT_USER: User = {
  id: 'user_current',
  username: 'bibek_patra',
  displayName: 'Bibek Patra',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  bio: 'Lead Architect & Designer @ Gengram. Exploring computational aesthetics, AI synthesis, and high-frequency UI engineering.',
  website: 'https://gengram.app',
  location: 'San Francisco, CA',
  followersCount: 14280,
  followingCount: 384,
  postsCount: 24,
  isVerified: true,
  isPrivate: false,
  isOnline: true,
  category: 'Tech & Design Creator',
  joinedDate: 'January 2024'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    username: 'maya.chen',
    displayName: 'Maya Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    bio: 'Spatial computing & generative art. Tokyo / San Francisco. Creating visual poetry with neural networks.',
    website: 'https://mayachen.art',
    location: 'Tokyo, Japan',
    followersCount: 89400,
    followingCount: 420,
    postsCount: 156,
    isVerified: true,
    isPrivate: false,
    isFollowing: true,
    hasUnreadStory: true,
    isOnline: true,
    category: 'Digital Artist'
  },
  {
    id: 'user_2',
    username: 'liam_vance',
    displayName: 'Liam Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    bio: 'Analog synth lover. Ambient film scoring & spatial audio engineering. New EP out on Friday 🎹',
    website: 'https://liamvance.audio',
    location: 'Berlin, Germany',
    followersCount: 34100,
    followingCount: 215,
    postsCount: 82,
    isVerified: true,
    isPrivate: false,
    isFollowing: true,
    hasUnreadStory: true,
    isOnline: false,
    lastSeen: '15m ago',
    category: 'Sound Producer'
  },
  {
    id: 'user_3',
    username: 'elena_rostova',
    displayName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    bio: 'Architectural minimalism & Scandinavian interior form. Capturing the interplay of light and concrete.',
    website: 'https://rostovastudio.com',
    location: 'Stockholm, Sweden',
    followersCount: 112000,
    followingCount: 512,
    postsCount: 310,
    isVerified: true,
    isPrivate: false,
    isFollowing: false,
    hasUnreadStory: true,
    isOnline: true,
    category: 'Architect'
  },
  {
    id: 'user_4',
    username: 'marcus_sterling',
    displayName: 'Marcus Sterling',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    bio: 'Cinematographer & 8K expedition director. National Geographic contributor. Chasing auroras & deep seas.',
    website: 'https://sterlingfilms.co',
    location: 'Reykjavik, Iceland',
    followersCount: 245000,
    followingCount: 198,
    postsCount: 412,
    isVerified: true,
    isPrivate: false,
    isFollowing: true,
    hasUnreadStory: false,
    isOnline: true,
    category: 'Filmmaker'
  },
  {
    id: 'user_5',
    username: 'sophia_ai',
    displayName: 'Sophia Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    bio: 'Founder @ SynthOS. Building the future of autonomous agent ecosystems. Angel investor in next-gen media.',
    website: 'https://synthos.ai',
    location: 'London, UK',
    followersCount: 67300,
    followingCount: 680,
    postsCount: 94,
    isVerified: true,
    isPrivate: false,
    isFollowing: false,
    hasUnreadStory: true,
    isOnline: false,
    lastSeen: '2h ago',
    category: 'Tech Founder'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'user_1',
    author: INITIAL_USERS[0],
    caption: 'Neon sanctuary in Shibuya at 3:00 AM. Experimented with 120fps anamorphic glass paired with raw neural color grading. What do you think of this atmospheric depth? 🌌✨ #Tokyo #Cyberpunk #VisualPoetry #Cinematic',
    media: [
      {
        id: 'media_1_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
        aspectRatio: '4:5'
      },
      {
        id: 'media_1_2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=85',
        aspectRatio: '4:5'
      }
    ],
    likesCount: 3842,
    commentsCount: 142,
    savesCount: 890,
    sharesCount: 312,
    isLiked: true,
    isSaved: true,
    createdAt: '2 hours ago',
    tags: ['Tokyo', 'Cyberpunk', 'VisualPoetry', 'Cinematic'],
    location: 'Shibuya Crossing, Tokyo',
    audioTitle: 'Cyber Neon Odyssey (Original Mix)',
    audioArtist: 'Maya Chen & Liam Vance',
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        userId: 'user_2',
        user: INITIAL_USERS[1],
        content: 'The low-end sub bass in this atmosphere is insane. That color palette matches the modular synth vibe perfectly!',
        createdAt: '1h ago',
        likesCount: 34,
        isLiked: true,
        replies: [
          {
            id: 'cr_1',
            commentId: 'c_1',
            userId: 'user_1',
            user: INITIAL_USERS[0],
            content: 'Thank you Liam! Can not wait to drop the collaboration track on Gengram this Friday 🔥',
            createdAt: '45m ago',
            likesCount: 12
          }
        ]
      },
      {
        id: 'c_2',
        postId: 'post_1',
        userId: 'user_4',
        user: INITIAL_USERS[3],
        content: 'Superb framing on the reflections. Which aperture setting did you end up locking?',
        createdAt: '30m ago',
        likesCount: 8
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'user_4',
    author: INITIAL_USERS[3],
    caption: 'Chasing the midnight solar aurora over Jokulsarlon glacier lagoon. 8K native capture with zero stabilization needed on the new rig. Nature always has the best rendering engine. ❄️🏔️ #Iceland #Aurora #Cinematography',
    media: [
      {
        id: 'media_2_1',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-over-a-snowy-mountain-42998-large.mp4',
        poster: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
        aspectRatio: '16:9'
      }
    ],
    likesCount: 12400,
    commentsCount: 420,
    savesCount: 2310,
    sharesCount: 1450,
    isLiked: false,
    isSaved: true,
    createdAt: '5 hours ago',
    tags: ['Iceland', 'Aurora', 'Cinematography', 'Glacier'],
    location: 'Jökulsárlón, Iceland',
    audioTitle: 'Glacier Winds (Spatial Surround 9.1)',
    audioArtist: 'Marcus Sterling',
    comments: [
      {
        id: 'c_3',
        postId: 'post_2',
        userId: 'user_3',
        user: INITIAL_USERS[2],
        content: 'The natural luminescence against the black volcanic sand is unmatched. Incredible shot Marcus.',
        createdAt: '3h ago',
        likesCount: 29
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'user_3',
    author: INITIAL_USERS[2],
    caption: 'Pavilion of Shadows & Glass. When designing public installations, the unbuilt void is just as critical as the load-bearing timber. Completed for the Nordic Biennale. 🏛️🌿 #Architecture #Design #Minimalism',
    media: [
      {
        id: 'media_3_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
        aspectRatio: '4:5'
      }
    ],
    likesCount: 5120,
    commentsCount: 98,
    savesCount: 1840,
    sharesCount: 210,
    isLiked: true,
    isSaved: false,
    createdAt: '12 hours ago',
    tags: ['Architecture', 'Design', 'Minimalism', 'Nordic'],
    location: 'Stockholm Cultural Center',
    comments: []
  },
  {
    id: 'post_4',
    authorId: 'user_current',
    author: CURRENT_USER,
    caption: 'Gengram 3.0 Architecture preview: 60FPS fluid transitions, real-time message channels with optimistic mutations, WebRTC live audio pipelines, and zero-compromise dark OLED aesthetics. Welcome to the new era. ⚡🚀 #Gengram #NextGen #Tech #Engineering',
    media: [
      {
        id: 'media_4_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
        aspectRatio: '16:9'
      }
    ],
    likesCount: 9420,
    commentsCount: 310,
    savesCount: 1980,
    sharesCount: 840,
    isLiked: true,
    isSaved: true,
    createdAt: '1 day ago',
    tags: ['Gengram', 'NextGen', 'Tech', 'Engineering'],
    location: 'Gengram Labs, San Francisco',
    pinned: true,
    comments: [
      {
        id: 'c_4',
        postId: 'post_4',
        userId: 'user_5',
        user: INITIAL_USERS[4],
        content: 'The responsiveness and micro-interactions in this new build feel so satisfying. Massive leap forward!',
        createdAt: '18h ago',
        likesCount: 64
      }
    ]
  },
  {
    id: 'post_5',
    authorId: 'user_2',
    author: INITIAL_USERS[1],
    caption: 'Patching the Eurorack for a live 4-hour generative ambient stream. 24 modular oscillators in unison creating harmonic phase shifts. Headphones recommended 🎧🎛️ #ModularSynth #Eurorack #GenerativeMusic',
    media: [
      {
        id: 'media_5_1',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-sound-mixer-panel-in-a-recording-studio-41484-large.mp4',
        poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        aspectRatio: '16:9'
      }
    ],
    likesCount: 2980,
    commentsCount: 88,
    savesCount: 650,
    sharesCount: 190,
    isLiked: false,
    isSaved: false,
    createdAt: '1 day ago',
    tags: ['ModularSynth', 'Eurorack', 'GenerativeMusic'],
    location: 'Klangwerk Studio, Berlin',
    audioTitle: 'Oscillator Shift VII',
    audioArtist: 'Liam Vance'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_current',
    userId: CURRENT_USER.id,
    user: CURRENT_USER,
    hasUnread: false,
    lastUpdated: '10m ago',
    stories: [
      {
        id: 'st_c1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=85',
        duration: 5,
        timestamp: '10m ago',
        caption: 'Pushing the newest Gengram build to production ⚡'
      }
    ]
  },
  {
    id: 'story_1',
    userId: 'user_1',
    user: INITIAL_USERS[0],
    hasUnread: true,
    lastUpdated: '30m ago',
    stories: [
      {
        id: 'st_1_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=85',
        duration: 5,
        timestamp: '30m ago',
        caption: 'Tokyo rain & analog reflections 🌧️'
      },
      {
        id: 'st_1_2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1080&q=85',
        duration: 5,
        timestamp: '15m ago',
        caption: 'Late night generative sketch session'
      }
    ]
  },
  {
    id: 'story_2',
    userId: 'user_2',
    user: INITIAL_USERS[1],
    hasUnread: true,
    lastUpdated: '1h ago',
    stories: [
      {
        id: 'st_2_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1080&q=85',
        duration: 5,
        timestamp: '1h ago',
        caption: 'Studio session: Analog warmth only 🎚️'
      }
    ]
  },
  {
    id: 'story_3',
    userId: 'user_3',
    user: INITIAL_USERS[2],
    hasUnread: true,
    lastUpdated: '2h ago',
    stories: [
      {
        id: 'st_3_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=85',
        duration: 5,
        timestamp: '2h ago',
        caption: 'Material study: Raw basalt and bronze'
      }
    ]
  },
  {
    id: 'story_4',
    userId: 'user_4',
    user: INITIAL_USERS[3],
    hasUnread: false,
    lastUpdated: '4h ago',
    stories: [
      {
        id: 'st_4_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1080&q=85',
        duration: 5,
        timestamp: '4h ago',
        caption: 'Packing gear for the Arctic glacier run ❄️'
      }
    ]
  }
];

export const INITIAL_REELS: Post[] = [
  {
    id: 'reel_1',
    authorId: 'user_4',
    author: INITIAL_USERS[3],
    caption: 'Full 8K raw slow-motion of Icelandic geothermal steam against glacial ice. Turn the audio up! 🏔️💨 #Cinematography #Reels #Nature #Iceland',
    media: [
      {
        id: 'reel_media_1',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41530-large.mp4',
        poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '9:16'
      }
    ],
    likesCount: 45200,
    commentsCount: 890,
    savesCount: 12400,
    sharesCount: 6700,
    isLiked: true,
    isSaved: true,
    createdAt: '3 hours ago',
    tags: ['Cinematography', 'Reels', 'Nature', 'Iceland'],
    audioTitle: 'Glacier Drone Echoes',
    audioArtist: 'Marcus Sterling',
    isReel: true
  },
  {
    id: 'reel_2',
    authorId: 'user_1',
    author: INITIAL_USERS[0],
    caption: 'Real-time raymarching in GLSL using compute shaders running on an iPad M3. The future of mobile graphics is crazy! 👾✨ #Shaders #CreativeCoding #WebGL',
    media: [
      {
        id: 'reel_media_2',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-over-a-snowy-mountain-42998-large.mp4',
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '9:16'
      }
    ],
    likesCount: 31800,
    commentsCount: 640,
    savesCount: 9200,
    sharesCount: 4100,
    isLiked: false,
    isSaved: false,
    createdAt: '6 hours ago',
    tags: ['Shaders', 'CreativeCoding', 'WebGL', 'AI'],
    audioTitle: 'Neural Cyber Beats 140BPM',
    audioArtist: 'Maya Chen',
    isReel: true
  },
  {
    id: 'reel_3',
    authorId: 'user_2',
    author: INITIAL_USERS[1],
    caption: 'Building a dark ambient patch from scratch with a Moog Grandmother and tape delay. 🎛️🎹 #SynthTok #Modular #Ambient #ElectronicMusic',
    media: [
      {
        id: 'reel_media_3',
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-sound-mixer-panel-in-a-recording-studio-41484-large.mp4',
        poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '9:16'
      }
    ],
    likesCount: 19400,
    commentsCount: 312,
    savesCount: 4800,
    sharesCount: 1950,
    isLiked: true,
    isSaved: true,
    createdAt: '1 day ago',
    tags: ['SynthTok', 'Modular', 'Ambient'],
    audioTitle: 'Analog Dusk',
    audioArtist: 'Liam Vance',
    isReel: true
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participants: [CURRENT_USER, INITIAL_USERS[0]],
    unreadCount: 2,
    updatedAt: '10m ago',
    lastMessage: {
      id: 'm_1_last',
      conversationId: 'conv_1',
      senderId: 'user_1',
      text: 'Just uploaded the 4K raw color pass for our collaboration. Let me know what you think of the grain texture!',
      createdAt: '10m ago',
      status: 'delivered'
    }
  },
  {
    id: 'conv_2',
    participants: [CURRENT_USER, INITIAL_USERS[1]],
    unreadCount: 0,
    updatedAt: '1h ago',
    lastMessage: {
      id: 'm_2_last',
      conversationId: 'conv_2',
      senderId: 'user_current',
      text: 'The synth stems sound incredible Liam. I will integrate them into the launch reel.',
      createdAt: '1h ago',
      status: 'read'
    }
  },
  {
    id: 'conv_3',
    participants: [CURRENT_USER, INITIAL_USERS[3]],
    unreadCount: 0,
    updatedAt: '1d ago',
    lastMessage: {
      id: 'm_3_last',
      conversationId: 'conv_3',
      senderId: 'user_4',
      text: 'Send me your shipping details, I have the printed photobook from Iceland ready for you!',
      createdAt: '1d ago',
      status: 'read'
    }
  }
];

export const INITIAL_MESSAGES: { [conversationId: string]: Message[] } = {
  conv_1: [
    {
      id: 'm_1_1',
      conversationId: 'conv_1',
      senderId: 'user_1',
      text: 'Hey Bibek! How is the new Gengram UI architecture coming along?',
      createdAt: '2h ago',
      status: 'read'
    },
    {
      id: 'm_1_2',
      conversationId: 'conv_1',
      senderId: 'user_current',
      text: 'Hey Maya! It is looking ultra sleek. Built fluid story viewers, high-res media carousels, and instant direct messaging.',
      createdAt: '1h ago',
      status: 'read'
    },
    {
      id: 'm_1_3',
      conversationId: 'conv_1',
      senderId: 'user_1',
      text: 'That sounds amazing! Check this new render I just exported:',
      media: {
        id: 'msg_img_1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
        aspectRatio: '4:5'
      },
      createdAt: '25m ago',
      status: 'read',
      reactions: [{ emoji: '🔥', userId: 'user_current', userName: 'Bibek Patra' }]
    },
    {
      id: 'm_1_4',
      conversationId: 'conv_1',
      senderId: 'user_1',
      text: 'Just uploaded the 4K raw color pass for our collaboration. Let me know what you think of the grain texture!',
      createdAt: '10m ago',
      status: 'delivered'
    }
  ],
  conv_2: [
    {
      id: 'm_2_1',
      conversationId: 'conv_2',
      senderId: 'user_2',
      text: 'Bibek, here is the quick audio voice snippet for the sound design test:',
      voiceDuration: 18,
      createdAt: '2h ago',
      status: 'read'
    },
    {
      id: 'm_2_2',
      conversationId: 'conv_2',
      senderId: 'user_current',
      text: 'The synth stems sound incredible Liam. I will integrate them into the launch reel.',
      createdAt: '1h ago',
      status: 'read',
      reactions: [{ emoji: '❤️', userId: 'user_2', userName: 'Liam Vance' }]
    }
  ],
  conv_3: [
    {
      id: 'm_3_1',
      conversationId: 'conv_3',
      senderId: 'user_4',
      text: 'Send me your shipping details, I have the printed photobook from Iceland ready for you!',
      createdAt: '1d ago',
      status: 'read'
    }
  ]
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    type: 'like',
    sender: INITIAL_USERS[0],
    postId: 'post_4',
    postMedia: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    createdAt: '5m ago',
    isRead: false
  },
  {
    id: 'notif_2',
    type: 'comment',
    sender: INITIAL_USERS[4],
    postId: 'post_4',
    text: 'The responsiveness and micro-interactions in this new build feel so satisfying!',
    postMedia: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    createdAt: '18h ago',
    isRead: false
  },
  {
    id: 'notif_3',
    type: 'follow',
    sender: INITIAL_USERS[2],
    createdAt: '1d ago',
    isRead: true
  },
  {
    id: 'notif_4',
    type: 'mention',
    sender: INITIAL_USERS[1],
    postId: 'post_1',
    text: 'mentioned you in a comment: "Thank you Liam! Can not wait to drop the collaboration track on Gengram"',
    createdAt: '2d ago',
    isRead: true
  },
  {
    id: 'notif_5',
    type: 'system',
    sender: {
      id: 'gengram_official',
      username: 'gengram',
      displayName: 'Gengram System',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      bio: 'Official platform notifications',
      followersCount: 1000000,
      followingCount: 1,
      postsCount: 10,
      isVerified: true,
      isPrivate: false
    },
    text: 'Your account has been upgraded to Gengram Creator Studio Pro with 4K HDR video streaming enabled.',
    createdAt: '3d ago',
    isRead: true
  }
];

export const INITIAL_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: 'indigo',
  isPrivateAccount: false,
  allowDirectMessagesFrom: 'everyone',
  showActivityStatus: true,
  readReceipts: true,
  pushNotifications: true,
  emailAlerts: false,
  twoFactorAuth: true,
  autoPlayVideos: true,
  saveToCameraRoll: true,
  contentFilterLevel: 'standard'
};

export const INITIAL_REPORTS: ReportComplaint[] = [
  {
    id: 'rep_1',
    type: 'bug',
    title: 'Story viewer gesture transition on ultra-wide viewports',
    description: 'On 21:9 monitors, the story progress bar animates slightly faster than standard 16:9 displays.',
    severity: 'low',
    status: 'investigating',
    createdAt: '2 days ago',
    ticketNumber: 'GEN-8942'
  }
];
