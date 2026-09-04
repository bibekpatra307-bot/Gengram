import React, { useState } from 'react';
import { Search, Sparkles, Film, Image as ImageIcon, Heart, MessageCircle, UserCheck, UserPlus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Post, User } from '../../types';

export const ExploreView: React.FC = () => {
  const { 
    posts, 
    users, 
    toggleFollowUser, 
    setViewingProfileUser, 
    setActiveTab, 
    setSelectedPostForModal,
    searchQuery,
    setSearchQuery 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All', 'Trending', 'Photography', 'AI & Tech', 'Design', 'Architecture', 'Reels', 'Cyberpunk', 'Music'
  ];

  // Filtered Users matching query
  const matchingUsers: User[] = searchQuery.trim() ? users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Filtered Posts matching category & query
  const filteredExplorePosts: Post[] = posts.filter(post => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCaption = post.caption.toLowerCase().includes(q);
      const matchTags = post.tags?.some(t => t.toLowerCase().includes(q));
      const matchAuthor = post.author.displayName.toLowerCase().includes(q) || post.author.username.toLowerCase().includes(q);
      const matchLocation = post.location?.toLowerCase().includes(q);
      if (!matchCaption && !matchTags && !matchAuthor && !matchLocation) return false;
    }

    // Category filter
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Trending') return post.likesCount > 2500;
    if (activeCategory === 'Reels') return post.isReel || post.media[0]?.type === 'video';
    if (activeCategory === 'Photography') return post.media[0]?.type === 'image';
    
    // Tag matching
    return post.tags?.some(t => t.toLowerCase() === activeCategory.toLowerCase());
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Search Header Bar */}
      <div className="relative max-w-2xl mx-auto space-y-2">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators, hashtags, visual concepts, locations..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#0d0d12]/90 border border-white/[0.08] focus:border-indigo-500 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-xl shadow-xl shadow-black/40 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* AI Semantic Quick Prompts */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px]">
          <span className="text-cyan-400 font-bold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" />
            AI Prompts:
          </span>
          {[
            'Cyberpunk Metropolis',
            'Spatial Audio Stems',
            'Nordic Minimalist Design',
            'Generative Fractals',
            'Elena Rostova Architecture'
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setSearchQuery(prompt)}
              className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-neutral-400 hover:text-white border border-white/[0.06] whitespace-nowrap transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? 'nexora-gradient text-white shadow-md shadow-indigo-500/25'
                : 'bg-[#0d0d12] border border-white/[0.08] text-neutral-300 hover:text-white hover:border-white/[0.16]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Creator Search Match Section if query is typed */}
      {searchQuery.trim() && matchingUsers.length > 0 && (
        <div className="bg-[#0d0d12]/90 border border-white/[0.08] rounded-2xl p-4 backdrop-blur-xl shadow-lg shadow-black/40">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Matching Creators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchingUsers.map(user => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition"
              >
                <div 
                  onClick={() => {
                    setViewingProfileUser(user);
                    setActiveTab('profile');
                  }}
                  className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                >
                  <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-indigo-400" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">{user.displayName}</span>
                      {user.isVerified && <span className="text-[8px] bg-indigo-500 text-white rounded-full w-3 h-3 flex items-center justify-center font-bold">✓</span>}
                    </div>
                    <span className="text-[10px] text-neutral-400 truncate block">@{user.username}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                    user.isFollowing 
                      ? 'bg-white/[0.08] text-neutral-300 hover:bg-white/[0.12] border border-white/[0.08]' 
                      : 'gengram-gradient text-white shadow-sm shadow-indigo-500/20'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Bento Grid of Media */}
      {filteredExplorePosts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredExplorePosts.map((post, index) => {
            const isFeaturedLarge = index % 7 === 0;
            const isVideo = post.media[0]?.type === 'video' || post.isReel;
            const mediaUrl = isVideo && post.media[0]?.poster ? post.media[0].poster : post.media[0]?.url;

            return (
              <div 
                key={post.id}
                id={`explore_tile_${post.id}`}
                onClick={() => setSelectedPostForModal(post)}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer bg-[#0d0d12] border border-white/[0.08] transition-all duration-300 hover:border-white/[0.22] hover:shadow-2xl hover:shadow-indigo-500/15 ${
                  isFeaturedLarge ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                }`}
              >
                {/* Media Thumbnail */}
                <img 
                  src={mediaUrl} 
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Video Badge indicator */}
                {isVideo && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white z-10 border border-white/10">
                    <Film className="w-4 h-4" />
                  </div>
                )}

                {/* Hover stats overlay */}
                <div className="absolute inset-0 bg-[#050505]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 z-20 backdrop-blur-[3px]">
                  <div className="flex items-center gap-2">
                    <img src={post.author.avatar} alt={post.author.displayName} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20" />
                    <span className="text-xs font-semibold text-white truncate">{post.author.displayName}</span>
                  </div>

                  <div className="flex items-center justify-center gap-5 text-white">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Heart className="w-4 h-4 fill-white text-white" />
                      <span>{post.likesCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <MessageCircle className="w-4 h-4 fill-white text-white" />
                      <span>{post.commentsCount.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-300 line-clamp-1 italic">
                    {post.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0d0d12]/80 rounded-3xl border border-white/[0.08] backdrop-blur-xl">
          <Sparkles className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No discovery items found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try searching for other keywords like "Tokyo", "Architecture", "Cyberpunk", or reset categories.
          </p>
        </div>
      )}
    </div>
  );
};
