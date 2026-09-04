import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Users, Heart, Send, Sparkles, Volume2, VolumeX, 
  Maximize2, Share2, MessageSquare, Flame, ShieldAlert, Award,
  Camera, Mic, MicOff, Video, VideoOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LiveMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isBadge?: boolean;
}

const FEATURED_STREAMS = [
  {
    id: 'stream_1',
    title: 'Late Night Spatial Audio & Modular Synth Jam 🎧',
    streamer: 'Liam Vance',
    username: 'liam_vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    videoPoster: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    viewers: 3840,
    likes: 18200,
    category: 'Audio Engineering & Live Jam',
    tags: ['#synthesizer', '#ambient', '#spatialaudio']
  },
  {
    id: 'stream_2',
    title: 'Generative Neural Worlds & Spatial Computing Q&A 🌌',
    streamer: 'Maya Chen',
    username: 'maya.chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    videoPoster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    viewers: 5120,
    likes: 34900,
    category: 'Creative Tech & AI Design',
    tags: ['#creativecode', '#futureui', '#generative']
  },
  {
    id: 'stream_3',
    title: 'Minimalist Architecture Walkthrough: Brutalism in Tokyo 🏛️',
    streamer: 'Elena Rostova',
    username: 'elena_rostova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    videoPoster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    viewers: 2190,
    likes: 12400,
    category: 'Design & Architecture',
    tags: ['#architecture', '#minimalism', '#tokyo']
  }
];

export const LiveStreamView: React.FC = () => {
  const { currentUser } = useApp();
  const [activeStream, setActiveStream] = useState(FEATURED_STREAMS[0]);
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(activeStream.likes);
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [messages, setMessages] = useState<LiveMessage[]>([
    {
      id: 'm1',
      user: 'alex_nord',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      text: 'The acoustic spatial reverb here is incredible! 🔥',
      time: 'just now'
    },
    {
      id: 'm2',
      user: 'sophia_vr',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      text: 'Which modular rig are you using for the sub-bass modulation?',
      time: 'just now',
      isBadge: true
    },
    {
      id: 'm3',
      user: 'kai_design',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      text: 'Gengram live streams look so crisp in 60fps ✨',
      time: 'just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isHostMode, setIsHostMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: LiveMessage = {
      id: `live_${Date.now()}`,
      user: currentUser.username,
      avatar: currentUser.avatar,
      text: inputMessage.trim(),
      time: 'just now',
      isBadge: currentUser.isVerified
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
  };

  const triggerReaction = (emoji: string) => {
    setLikesCount((prev) => prev + 1);
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.random() * 80 + 10,
    };
    setFloatingReactions((prev) => [...prev.slice(-15), newReaction]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      {/* Top Header & Stream Hub Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Gengram Live Broadcasts
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time interactive spatial video streams, creator masterclasses, and sound stages.
          </p>
        </div>

        {/* Go Live / Broadcaster Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHostMode(!isHostMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              isHostMode
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'nexora-gradient text-white shadow-lg shadow-indigo-500/25 hover:opacity-90'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{isHostMode ? 'Exit Broadcaster Studio' : 'Go Live Now'}</span>
          </button>
        </div>
      </div>

      {/* Stream Selector Chips */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        {FEATURED_STREAMS.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              setActiveStream(st);
              setLikesCount(st.likes);
            }}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl border transition whitespace-nowrap cursor-pointer shrink-0 ${
              activeStream.id === st.id
                ? 'bg-white/[0.08] border-indigo-500/40 text-white shadow-md'
                : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <img src={st.avatar} alt={st.streamer} className="w-7 h-7 rounded-full object-cover ring-1 ring-rose-500" />
            <div className="text-left">
              <p className="text-xs font-bold text-white truncate max-w-[140px]">{st.streamer}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>{(st.viewers).toLocaleString()} live</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Stream Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Stream Canvas / Player Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl group">
            {/* Stream Image / Video Background */}
            <img 
              src={activeStream.videoPoster} 
              alt={activeStream.title}
              className="w-full h-full object-cover brightness-90 transition duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

            {/* Top Overlay Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>LIVE</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/10">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{activeStream.viewers.toLocaleString()} watching</span>
                </div>
                <div className="hidden sm:flex px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-neutral-300 text-[10px] font-mono">
                  1080p • 60 FPS
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 transition cursor-pointer"
                  title={isMuted ? 'Unmute Stream' : 'Mute Stream'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Floating Live Reactions */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {floatingReactions.map((r) => (
                <span
                  key={r.id}
                  style={{ left: `${r.x}%` }}
                  className="absolute bottom-16 text-3xl animate-bounce transition-all duration-1000 opacity-90"
                >
                  {r.emoji}
                </span>
              ))}
            </div>

            {/* Bottom Stream Host Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <img 
                  src={activeStream.avatar} 
                  alt={activeStream.streamer}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{activeStream.streamer}</span>
                    <Award className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <p className="text-[11px] text-neutral-300 line-clamp-1">{activeStream.category}</p>
                </div>
              </div>

              {/* Fast Reactions Bar */}
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-lg">
                <button
                  onClick={() => triggerReaction('❤️')}
                  className="p-1.5 hover:scale-125 active:scale-95 transition cursor-pointer text-rose-400"
                  title="Send Heart"
                >
                  <Heart className="w-5 h-5 fill-rose-500" />
                </button>
                <button
                  onClick={() => triggerReaction('🔥')}
                  className="p-1.5 hover:scale-125 active:scale-95 transition cursor-pointer text-amber-400"
                  title="Send Fire"
                >
                  <Flame className="w-5 h-5 fill-amber-400" />
                </button>
                <button
                  onClick={() => triggerReaction('✨')}
                  className="p-1.5 hover:scale-125 active:scale-95 transition cursor-pointer text-indigo-300"
                  title="Send Sparkles"
                >
                  <Sparkles className="w-5 h-5 fill-indigo-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Broadcaster Studio (Host Controls when toggled) */}
          {isHostMode && (
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Your Broadcaster Control Deck</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Bitrate: 6500 kbps • Low Latency
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
                    cameraActive 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {cameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  <span>{cameraActive ? 'Camera On' : 'Camera Off'}</span>
                </button>

                <button
                  onClick={() => setMicActive(!micActive)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition ${
                    micActive 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{micActive ? 'Microphone On' : 'Muted'}</span>
                </button>

                <button
                  className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 transition ml-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Broadcast Link</span>
                </button>
              </div>
            </div>
          )}

          {/* Stream Information Card */}
          <div className="p-5 rounded-3xl bg-[#0a0d14] border border-white/[0.08] space-y-3">
            <h2 className="text-lg font-bold text-white">{activeStream.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              {activeStream.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-indigo-300 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs text-neutral-400">
              <span>Live Broadcast (60fps)</span>
              <span className="text-emerald-400 font-mono">{(likesCount).toLocaleString()} reactions given</span>
            </div>
          </div>
        </div>

        {/* Live Chat Column */}
        <div className="flex flex-col h-[560px] rounded-3xl bg-[#090c13] border border-white/[0.08] shadow-xl overflow-hidden">
          {/* Live Chat Header */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">Live Stream Chat</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Real-Time</span>
            </div>
          </div>

          {/* Message List */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar"
          >
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2.5 text-xs group">
                <img 
                  src={msg.avatar} 
                  alt={msg.user} 
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-200">{msg.user}</span>
                    {msg.isBadge && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">
                        PRO
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-500 ml-auto">{msg.time}</span>
                  </div>
                  <p className="text-neutral-300 mt-0.5 break-words leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-3 py-1.5 focus-within:border-indigo-500/50 transition">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send a live message..."
                className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none py-1"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-1.5 rounded-xl bg-indigo-600 disabled:opacity-30 text-white hover:bg-indigo-500 transition cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
