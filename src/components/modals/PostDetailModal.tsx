import React, { useState } from 'react';
import { 
  X, Heart, MessageCircle, Share2, Bookmark, Send, 
  MoreHorizontal, MapPin, Music, CornerDownRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Post } from '../../types';

export const PostDetailModal: React.FC = () => {
  const { 
    selectedPostForModal, 
    setSelectedPostForModal, 
    currentUser, 
    toggleLikePost, 
    toggleSavePost, 
    addComment, 
    setViewingProfileUser, 
    setActiveTab 
  } = useApp();

  const [commentText, setCommentText] = useState('');

  if (!selectedPostForModal) return null;

  const post: Post = selectedPostForModal;
  const isVideo = post.media[0]?.type === 'video' || post.isReel;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const handleAuthorClick = () => {
    setSelectedPostForModal(null);
    setViewingProfileUser(post.author);
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 select-none animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[760px] bg-[#0d0d12] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col md:flex-row">
        {/* Close Button */}
        <button 
          onClick={() => setSelectedPostForModal(null)}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Media Stage */}
        <div className="md:w-3/5 h-64 sm:h-80 md:h-full bg-black flex items-center justify-center relative">
          {isVideo ? (
            <video 
              src={post.media[0]?.url}
              poster={post.media[0]?.poster}
              autoPlay
              controls
              loop
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <img 
              src={post.media[0]?.url} 
              alt={post.caption}
              className="w-full h-full object-contain bg-black"
            />
          )}
        </div>

        {/* Right Details & Conversation Stream */}
        <div className="md:w-2/5 flex-1 flex flex-col justify-between bg-[#0d0d12] border-t md:border-t-0 md:border-l border-white/[0.08]">
          {/* Header */}
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <div 
              onClick={handleAuthorClick}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img src={post.author.avatar} alt={post.author.displayName} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-indigo-400 transition" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">{post.author.displayName}</span>
                  {post.author.isVerified && <span className="w-3.5 h-3.5 rounded-full gengram-gradient flex items-center justify-center text-[8px] text-white font-bold shadow-sm">✓</span>}
                </div>
                <span className="text-[10px] text-neutral-400">@{post.author.username}</span>
              </div>
            </div>
          </div>

          {/* Scrolling Caption & Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Caption */}
            <div className="flex items-start gap-3 pb-3 border-b border-white/[0.06]">
              <img src={post.author.avatar} alt={post.author.displayName} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-white/10" />
              <div>
                <span className="font-bold text-white mr-1.5">{post.author.displayName}</span>
                <span className="text-neutral-200 leading-relaxed">{post.caption}</span>
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1">
                  <span>{post.createdAt}</span>
                  {post.location && <span>• {post.location}</span>}
                </div>
              </div>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(c => (
                <div key={c.id} className="flex items-start gap-3">
                  <img src={c.user.avatar} alt={c.user.displayName} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-white/10" />
                  <div className="flex-1">
                    <div>
                      <span className="font-bold text-white mr-1.5">{c.user.displayName}</span>
                      <span className="text-neutral-300">{c.content}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                      <span>{c.createdAt}</span>
                      {c.likesCount > 0 && <span>{c.likesCount} likes</span>}
                    </div>

                    {/* Replies */}
                    {c.replies && c.replies.map(r => (
                      <div key={r.id} className="mt-2 ml-4 flex items-start gap-2">
                        <CornerDownRight className="w-3 h-3 text-neutral-600 shrink-0 mt-1" />
                        <img src={r.user.avatar} alt={r.user.displayName} className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10" />
                        <div>
                          <span className="font-bold text-white mr-1">{r.user.displayName}</span>
                          <span className="text-neutral-300">{r.content}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-neutral-500">
                No comments yet.
              </div>
            )}
          </div>

          {/* Action Bar & Comment Box */}
          <div className="p-4 border-t border-white/[0.08] bg-[#09090e]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleLikePost(post.id)}
                  className={`flex items-center gap-1.5 transition cursor-pointer ${post.isLiked ? 'text-rose-500 font-bold' : 'text-neutral-300 hover:text-white'}`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                  <span className="text-xs">{post.likesCount}</span>
                </button>

                <button 
                  onClick={() => toggleSavePost(post.id)}
                  className={`transition cursor-pointer ${post.isSaved ? 'text-indigo-400' : 'text-neutral-300 hover:text-white'}`}
                >
                  <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-indigo-400' : ''}`} />
                </button>
              </div>

              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{post.createdAt}</span>
            </div>

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
              <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#14141c] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                disabled={!commentText.trim()}
                className="p-2.5 rounded-xl gengram-gradient text-white disabled:opacity-40 transition cursor-pointer shadow-md shadow-indigo-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
