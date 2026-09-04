import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronLeft, ChevronRight, Volume2, VolumeX, Heart, 
  Send, MessageCircle, MoreVertical, Pause, Play 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoryViewer: React.FC = () => {
  const { 
    stories, 
    activeStoryIndex, 
    setActiveStoryIndex, 
    markStoryAsRead, 
    currentUser, 
    sendMessage,
    startDirectMessageWithUser
  } = useApp();

  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;
  const currentSegment = currentStory ? currentStory.stories[currentSegmentIndex] : null;

  useEffect(() => {
    if (activeStoryIndex === null || !currentStory) return;
    markStoryAsRead(currentStory.id);
    setCurrentSegmentIndex(0);
    setProgress(0);
  }, [activeStoryIndex]);

  useEffect(() => {
    if (!currentSegment || isPaused || activeStoryIndex === null) return;

    const durationMs = (currentSegment.duration || 5) * 1000;
    const intervalTime = 50;
    const step = (intervalTime / durationMs) * 100;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNextSegment();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentSegmentIndex, activeStoryIndex, isPaused, currentSegment]);

  const handleNextSegment = () => {
    if (!currentStory) return;
    if (currentSegmentIndex < currentStory.stories.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      // Go to next user's story or close
      if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
        setCurrentSegmentIndex(0);
        setProgress(0);
      } else {
        closeViewer();
      }
    }
  };

  const handlePrevSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
      setProgress(0);
    } else {
      if (activeStoryIndex !== null && activeStoryIndex > 0) {
        setActiveStoryIndex(activeStoryIndex - 1);
        setCurrentSegmentIndex(0);
        setProgress(0);
      }
    }
  };

  const closeViewer = () => {
    setActiveStoryIndex(null);
    setCurrentSegmentIndex(0);
    setProgress(0);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;
    
    // Find or create conversation
    startDirectMessageWithUser(currentStory.user);
    // Send message through conversation
    // We can also trigger heart burst
    setReplyText('');
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1200);
  };

  const handleQuickReaction = (emoji: string) => {
    if (!currentStory) return;
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1000);
  };

  if (activeStoryIndex === null || !currentStory || !currentSegment) return null;

  return (
    <AnimatePresence>
      <motion.div 
        id="story_viewer_overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center select-none"
      >
        {/* Close Button */}
        <button 
          id="close_story_button"
          onClick={closeViewer}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer backdrop-blur-md"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Story Arrow Desktop */}
        {activeStoryIndex > 0 && (
          <button 
            id="prev_story_nav_button"
            onClick={() => {
              setActiveStoryIndex(activeStoryIndex - 1);
              setCurrentSegmentIndex(0);
            }}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Story Arrow Desktop */}
        {activeStoryIndex < stories.length - 1 && (
          <button 
            id="next_story_nav_button"
            onClick={() => {
              setActiveStoryIndex(activeStoryIndex + 1);
              setCurrentSegmentIndex(0);
            }}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition backdrop-blur-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Story Card Container */}
        <div 
          className="relative w-full max-w-[420px] h-[92vh] max-h-[820px] bg-black rounded-3xl border border-white/[0.12] overflow-hidden shadow-2xl shadow-black/90 flex flex-col justify-between"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Progress Bars */}
          <div className="absolute top-3 inset-x-3 z-30 flex gap-1.5">
            {currentStory.stories.map((s, idx) => {
              let widthPercent = 0;
              if (idx < currentSegmentIndex) widthPercent = 100;
              else if (idx === currentSegmentIndex) widthPercent = progress;
              return (
                <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author Header */}
          <div className="absolute top-6 inset-x-4 z-30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={currentStory.user.avatar} 
                alt={currentStory.user.displayName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-wide">
                    {currentStory.user.displayName}
                  </span>
                  {currentStory.user.isVerified && (
                    <span className="w-3.5 h-3.5 rounded-full gengram-gradient flex items-center justify-center text-[9px] text-white font-bold shadow-sm">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xs text-white/70">{currentSegment.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition backdrop-blur-md border border-white/10 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition backdrop-blur-md border border-white/10 cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Story Media */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {currentSegment.type === 'video' ? (
              <video 
                src={currentSegment.url}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={currentSegment.url} 
                alt="Story content"
                className="w-full h-full object-cover"
              />
            )}

            {/* Tap areas for previous and next */}
            <div 
              className="absolute left-0 top-16 bottom-24 w-1/3 z-20 cursor-pointer"
              onClick={handlePrevSegment}
            />
            <div 
              className="absolute right-0 top-16 bottom-24 w-1/3 z-20 cursor-pointer"
              onClick={handleNextSegment}
            />

            {/* Heart Animation Burst */}
            {showHeartBurst && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute z-40 pointer-events-none text-rose-500"
              >
                <Heart className="w-24 h-24 fill-rose-500 drop-shadow-2xl" />
              </motion.div>
            )}

            {/* Caption if exists */}
            {currentSegment.caption && (
              <div className="absolute bottom-20 inset-x-4 z-20">
                <div className="p-3.5 rounded-2xl bg-black/60 backdrop-blur-md text-white text-sm font-medium border border-white/10 shadow-lg">
                  {currentSegment.caption}
                </div>
              </div>
            )}
          </div>

          {/* Story Reply Footer */}
          <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-30 flex items-center gap-2">
            <form onSubmit={handleSendReply} className="flex-1 flex items-center gap-2">
              <input 
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${currentStory.user.displayName}...`}
                className="w-full px-4 py-2.5 rounded-full bg-white/[0.12] border border-white/[0.18] text-white placeholder-white/60 text-xs focus:outline-none focus:border-indigo-400 backdrop-blur-md"
              />
              <button 
                type="submit"
                disabled={!replyText.trim()}
                className="p-2.5 rounded-full gengram-gradient disabled:opacity-40 text-white transition shrink-0 cursor-pointer shadow-md shadow-indigo-500/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button 
              onClick={() => handleQuickReaction('❤️')}
              className="p-2.5 rounded-full bg-white/[0.12] hover:bg-white/[0.2] border border-white/[0.15] text-rose-400 transition shrink-0 backdrop-blur-md cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-400" />
            </button>
            <button 
              onClick={() => handleQuickReaction('🔥')}
              className="p-2.5 rounded-full bg-white/[0.12] hover:bg-white/[0.2] border border-white/[0.15] text-amber-400 transition shrink-0 backdrop-blur-md text-sm cursor-pointer"
            >
              🔥
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
