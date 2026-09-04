import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, MessageCircle, Share2, Bookmark, Music, 
  Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, 
  Send, X, MoreHorizontal 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Post } from '../../types';

export const ReelsView: React.FC = () => {
  const { 
    reels, 
    currentUser, 
    toggleLikePost, 
    toggleSavePost, 
    addComment, 
    toggleFollowUser, 
    setViewingProfileUser, 
    setActiveTab 
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const videoRefs = useRef<{ [index: number]: HTMLVideoElement | null }>({});
  const lastTapRef = useRef<number>(0);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    // Autoplay current video, pause others
    Object.keys(videoRefs.current).forEach(key => {
      const idx = Number(key);
      const vid = videoRefs.current[idx];
      if (vid) {
        if (idx === currentIndex) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!currentReel?.isLiked) {
        toggleLikePost(currentReel.id);
      }
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleTogglePlay = () => {
    const vid = videoRefs.current[currentIndex];
    if (vid) {
      if (vid.paused) {
        vid.play();
        setIsPlaying(true);
      } else {
        vid.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `#reel_${currentReel.id}`);
    setToastMessage('Reel link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentReel) return;
    addComment(currentReel.id, commentText);
    setCommentText('');
  };

  if (!currentReel) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-neutral-400">
        No reels available right now.
      </div>
    );
  }

  return (
    <div id="gengram_reels_container" className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] flex items-center justify-center select-none py-2">
      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-6 z-50 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-lg backdrop-blur-md animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Vertical Navigation Buttons */}
      <div className="hidden md:flex flex-col gap-3 absolute right-12 z-30">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-[#0d0d12]/90 hover:bg-[#151520] disabled:opacity-20 text-white border border-white/[0.1] backdrop-blur-xl transition cursor-pointer shadow-lg shadow-black/50"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="p-3 rounded-full bg-[#0d0d12]/90 hover:bg-[#151520] disabled:opacity-20 text-white border border-white/[0.1] backdrop-blur-xl transition cursor-pointer shadow-lg shadow-black/50"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Reel Card Stage */}
      <div 
        className="relative w-full max-w-[400px] h-full max-h-[760px] bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/[0.12] flex items-center justify-center"
        onClick={handleDoubleTap}
      >
        {/* Video Element */}
        <video
          ref={el => { videoRefs.current[currentIndex] = el; }}
          src={currentReel.media[0]?.url}
          poster={currentReel.media[0]?.poster}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Play/Pause Overlay Indicator on click */}
        <button 
          onClick={handleTogglePlay}
          className="absolute inset-0 z-10 w-full h-full bg-transparent flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="p-4 rounded-full bg-black/50 backdrop-blur-md text-white">
              <Play className="w-10 h-10 fill-white" />
            </div>
          )}
        </button>

        {/* Double Tap Heart Burst */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              className="absolute z-30 pointer-events-none text-rose-500"
            >
              <Heart className="w-28 h-28 fill-rose-500 drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Controls Bar */}
        <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
          <span className="text-sm font-bold text-white tracking-wider flex items-center gap-1.5 drop-shadow-md">
            Gengram Reels
          </span>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Interaction Sidebar */}
        <div className="absolute right-3.5 bottom-16 z-20 flex flex-col items-center gap-5 pointer-events-auto">
          {/* Like Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleLikePost(currentReel.id);
            }}
            className="flex flex-col items-center gap-1 text-white group cursor-pointer"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition ${
              currentReel.isLiked ? 'text-rose-500' : 'text-white'
            }`}>
              <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-rose-500' : ''}`} />
            </div>
            <span className="text-xs font-semibold drop-shadow">{currentReel.likesCount.toLocaleString()}</span>
          </button>

          {/* Comments Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentDrawerOpen(true);
            }}
            className="flex flex-col items-center gap-1 text-white group cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold drop-shadow">{currentReel.commentsCount.toLocaleString()}</span>
          </button>

          {/* Share Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="flex flex-col items-center gap-1 text-white group cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold drop-shadow">{currentReel.sharesCount > 0 ? currentReel.sharesCount : 'Share'}</span>
          </button>

          {/* Bookmark Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleSavePost(currentReel.id);
            }}
            className="flex flex-col items-center gap-1 text-white group cursor-pointer"
          >
            <div className={`p-3 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 transition ${
              currentReel.isSaved ? 'text-indigo-400' : 'text-white'
            }`}>
              <Bookmark className={`w-6 h-6 ${currentReel.isSaved ? 'fill-indigo-400' : ''}`} />
            </div>
            <span className="text-xs font-semibold drop-shadow">Save</span>
          </button>

          {/* Spinning Audio Vinyl Disc */}
          <div className="w-10 h-10 rounded-full bg-neutral-900 border-2 border-neutral-700 p-1 flex items-center justify-center animate-spin [animation-duration:4s]">
            <img 
              src={currentReel.author.avatar} 
              alt="Audio creator"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Creator Information Overlay */}
        <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-auto pr-16 space-y-2">
          {/* Creator Profile */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => {
                setViewingProfileUser(currentReel.author);
                setActiveTab('profile');
              }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <img 
                src={currentReel.author.avatar} 
                alt={currentReel.author.displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/80 group-hover:ring-indigo-400 transition"
              />
              <span className="text-sm font-bold text-white drop-shadow group-hover:text-indigo-300 transition">
                {currentReel.author.displayName}
              </span>
              {currentReel.author.isVerified && (
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </span>
              )}
            </div>

            {currentReel.authorId !== currentUser.id && (
              <button 
                onClick={() => toggleFollowUser(currentReel.authorId)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition backdrop-blur-md ${
                  currentReel.author.isFollowing 
                    ? 'bg-white/20 text-white hover:bg-white/30' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {currentReel.author.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="text-xs text-white/90 line-clamp-2 leading-relaxed drop-shadow">
            {currentReel.caption}
          </p>

          {/* Audio Marquee */}
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium drop-shadow overflow-hidden">
            <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <div className="truncate">
              {currentReel.audioTitle || 'Original Audio'} {currentReel.audioArtist && `— ${currentReel.audioArtist}`}
            </div>
          </div>
        </div>

        {/* Comments Slide-up Drawer */}
        <AnimatePresence>
          {isCommentDrawerOpen && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 h-3/5 bg-[#0d0d12]/98 backdrop-blur-3xl rounded-t-3xl z-40 p-4 flex flex-col justify-between border-t border-white/[0.12] shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="text-sm font-bold text-white">Comments ({currentReel.commentsCount})</span>
                  <button 
                    onClick={() => setIsCommentDrawerOpen(false)}
                    className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[260px] py-3 space-y-3">
                  {currentReel.comments && currentReel.comments.length > 0 ? (
                    currentReel.comments.map(c => (
                      <div key={c.id} className="flex items-start gap-2.5 text-xs">
                        <img src={c.user.avatar} alt={c.user.displayName} className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10" />
                        <div>
                          <span className="font-bold text-white mr-1.5">{c.user.displayName}</span>
                          <span className="text-neutral-300">{c.content}</span>
                          <div className="text-[10px] text-neutral-500 mt-0.5">{c.createdAt}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-500 text-xs">
                      No comments yet. Start the conversation!
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
                <input 
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment on this reel..."
                  className="flex-1 px-4 py-2 rounded-xl bg-[#14141c] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="p-2 rounded-xl gengram-gradient disabled:opacity-30 text-white shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
