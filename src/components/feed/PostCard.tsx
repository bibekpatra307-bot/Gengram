import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Volume2, VolumeX, Music, MapPin, Share2, CornerDownRight, 
  Trash2, Flag, Copy, Check 
} from 'lucide-react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
  onOpenDetail?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onOpenDetail }) => {
  const { 
    currentUser, 
    toggleLikePost, 
    toggleSavePost, 
    addComment, 
    toggleLikeComment,
    deletePost, 
    setViewingProfileUser, 
    setActiveTab,
    startDirectMessageWithUser
  } = useApp();

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reportNotice, setReportNotice] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapRef = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        toggleLikePost(post.id);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleToggleLike = () => {
    toggleLikePost(post.id);
    if (!post.isLiked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 700);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput, replyingToCommentId || undefined);
    setCommentInput('');
    setReplyingToCommentId(null);
    setIsCommentsExpanded(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `#post_${post.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAuthorClick = () => {
    setViewingProfileUser(post.author);
    setActiveTab('profile');
  };

  const isCurrentAuthor = post.authorId === currentUser.id;

  return (
    <article 
      id={`post_card_${post.id}`} 
      className="w-full bg-[#0d0d12]/90 border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/[0.14] shadow-xl shadow-black/50 mb-6 backdrop-blur-xl"
    >
      {/* Report Notice Banner */}
      {reportNotice && (
        <div className="bg-emerald-950/60 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Post reported for moderation review. Thank you for keeping Gengram safe.</span>
          </div>
          <button 
            onClick={() => setReportNotice(false)} 
            className="text-emerald-400 hover:text-emerald-200 text-xs ml-2 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            onClick={handleAuthorClick}
            className="cursor-pointer group relative"
          >
            <img 
              src={post.author.avatar} 
              alt={post.author.displayName}
              className="w-10 h-10 rounded-full object-cover ring-1.5 ring-indigo-500/50 group-hover:ring-indigo-400 transition"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span 
                onClick={handleAuthorClick}
                className="text-sm font-bold text-white hover:text-indigo-300 transition cursor-pointer tracking-tight"
              >
                {post.author.displayName}
              </span>
              {post.author.isVerified && (
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </span>
              )}
              <span className="text-xs text-neutral-400 font-normal">@{post.author.username}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
              {post.location && (
                <span className="flex items-center gap-0.5 text-neutral-400">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  {post.location}
                </span>
              )}
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* More Menu */}
        <div className="relative">
          <button 
            id={`post_menu_btn_${post.id}`}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 w-48 py-1.5 rounded-xl glass-dropdown z-30 shadow-2xl">
              <button 
                onClick={() => {
                  handleCopyLink();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-xs text-neutral-200 hover:bg-white/10 flex items-center gap-2.5 transition cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Link Copied!' : 'Copy Link'}
              </button>

              <button 
                onClick={() => {
                  startDirectMessageWithUser(post.author);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-xs text-neutral-200 hover:bg-white/10 flex items-center gap-2.5 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Message Creator
              </button>

              {isCurrentAuthor ? (
                <button 
                  onClick={() => {
                    deletePost(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setReportNotice(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-amber-400 hover:bg-amber-500/10 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Flag className="w-4 h-4" />
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Audio Track Tag if Present */}
      {post.audioTitle && (
        <div className="px-4 pb-2 flex items-center gap-2 text-xs text-indigo-400 font-medium">
          <Music className="w-3.5 h-3.5 animate-pulse text-pink-400" />
          <span className="truncate">{post.audioTitle} {post.audioArtist && `— ${post.audioArtist}`}</span>
        </div>
      )}

      {/* Media Presentation */}
      {post.media && post.media.length > 0 && (
        <div 
          className="relative w-full bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={handleDoubleTap}
        >
          {post.media[activeMediaIndex].type === 'video' ? (
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              <video 
                ref={videoRef}
                src={post.media[activeMediaIndex].url}
                poster={post.media[activeMediaIndex].poster}
                autoPlay
                loop
                muted={isVideoMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoMuted(!isVideoMuted);
                }}
                className="absolute bottom-3.5 right-3.5 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition"
              >
                {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="relative w-full max-h-[640px] flex items-center justify-center bg-neutral-950">
              <img 
                src={post.media[activeMediaIndex].url} 
                alt={post.caption || 'Post image'}
                className="w-full h-auto max-h-[640px] object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Carousel dots if multiple media */}
          {post.media.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {post.media.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIndex(idx);
                  }}
                  className={`pointer-events-auto h-1.5 rounded-full transition-all duration-200 ${
                    idx === activeMediaIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Double Tap Heart Burst Animation */}
          <AnimatePresence>
            {showHeartAnimation && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 1 }}
                exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute z-20 pointer-events-none text-rose-500 drop-shadow-2xl"
              >
                <Heart className="w-24 h-24 fill-rose-500 drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Interaction Action Controls */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button 
              id={`like_btn_${post.id}`}
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 transition-transform active:scale-90 ${
                post.isLiked ? 'text-rose-500 font-semibold' : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Heart className={`w-6 h-6 transition-all duration-200 ${post.isLiked ? 'fill-rose-500' : ''}`} />
              <span className="text-xs font-semibold">{post.likesCount.toLocaleString()}</span>
            </button>

            {/* Comment */}
            <button 
              id={`comment_btn_${post.id}`}
              onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition active:scale-95"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-semibold">{post.commentsCount.toLocaleString()}</span>
            </button>

            {/* Share */}
            <button 
              id={`share_btn_${post.id}`}
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-semibold">{post.sharesCount > 0 ? post.sharesCount.toLocaleString() : ''}</span>
            </button>
          </div>

          {/* Bookmark / Save */}
          <button 
            id={`save_btn_${post.id}`}
            onClick={() => toggleSavePost(post.id)}
            className={`transition-transform active:scale-90 ${
              post.isSaved ? 'text-indigo-400' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Caption */}
        <div className="text-sm text-neutral-200 leading-relaxed mb-2">
          <span 
            onClick={handleAuthorClick}
            className="font-bold text-white mr-2 hover:underline cursor-pointer tracking-tight"
          >
            {post.author.displayName}
          </span>
          <span>
            {isCaptionExpanded || post.caption.length <= 130 
              ? post.caption 
              : `${post.caption.slice(0, 130)}...`}
          </span>
          {post.caption.length > 130 && (
            <button 
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="ml-2 text-xs text-neutral-400 hover:text-neutral-200 font-medium"
            >
              {isCaptionExpanded ? 'show less' : 'more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="text-xs text-indigo-400/90 hover:text-indigo-300 transition cursor-pointer font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comment view trigger */}
        {post.commentsCount > 0 && !isCommentsExpanded && (
          <button 
            onClick={() => setIsCommentsExpanded(true)}
            className="text-xs text-neutral-400 hover:text-neutral-300 transition block mb-2 font-medium"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Expandable Comments Drawer */}
        <AnimatePresence>
          {isCommentsExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 border-t border-white/[0.08] space-y-3 mb-3 overflow-hidden"
            >
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="space-y-1.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <img 
                          src={comment.user.avatar} 
                          alt={comment.user.displayName}
                          className="w-6 h-6 rounded-full object-cover mt-0.5 ring-1 ring-white/10"
                        />
                        <div>
                          <div className="leading-snug">
                            <span className="font-semibold text-white mr-1.5">
                              {comment.user.displayName}
                            </span>
                            <span className="text-neutral-300">{comment.content}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                            <span>{comment.createdAt}</span>
                            {comment.likesCount > 0 && (
                              <span>{comment.likesCount} likes</span>
                            )}
                            <button 
                              onClick={() => {
                                setReplyingToCommentId(comment.id);
                                setCommentInput(`@${comment.user.username} `);
                              }}
                              className="font-semibold hover:text-neutral-200 cursor-pointer"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => toggleLikeComment(post.id, comment.id)}
                        className={`p-1 transition-colors cursor-pointer ${comment.isLiked ? 'text-rose-500' : 'text-neutral-500 hover:text-neutral-300'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-8 flex items-start gap-2 pt-1">
                        <CornerDownRight className="w-3 h-3 text-neutral-600 shrink-0 mt-1" />
                        <img 
                          src={reply.user.avatar} 
                          alt={reply.user.displayName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <div className="leading-snug">
                            <span className="font-semibold text-white mr-1.5">
                              {reply.user.displayName}
                            </span>
                            <span className="text-neutral-300">{reply.content}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 mt-0.5 block">{reply.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 italic py-1">No comments yet. Be the first to start the conversation!</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline Add Comment Input */}
        <form onSubmit={handleAddComment} className="pt-2.5 border-t border-white/[0.08] flex items-center gap-2.5">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.displayName}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 shrink-0"
          />
          <div className="flex-1 relative flex items-center">
            <input 
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={replyingToCommentId ? "Writing reply..." : "Add a thoughtful comment..."}
              className="w-full py-2 px-3.5 bg-[#121218] border border-white/[0.08] rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {replyingToCommentId && (
              <button 
                type="button" 
                onClick={() => {
                  setReplyingToCommentId(null);
                  setCommentInput('');
                }}
                className="absolute right-3 text-[10px] text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
          <button 
            type="submit"
            disabled={!commentInput.trim()}
            className="text-xs font-bold px-3 py-1.5 rounded-xl gengram-gradient text-white disabled:opacity-30 disabled:hover:opacity-30 hover:opacity-95 transition shadow-sm cursor-pointer"
          >
            Post
          </button>
        </form>
      </div>
    </article>
  );
};
