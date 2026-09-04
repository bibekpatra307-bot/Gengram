import React, { useState } from 'react';
import { StoryRow } from './StoryRow';
import { PostCard } from './PostCard';
import { useApp } from '../../context/AppContext';
import { Sparkles, TrendingUp, Users, Flame, ArrowUpRight, Plus, ShieldCheck } from 'lucide-react';

export const FeedView: React.FC = () => {
  const { 
    posts, 
    users, 
    currentUser, 
    toggleFollowUser, 
    setViewingProfileUser, 
    setActiveTab, 
    setIsUploadModalOpen,
    setSearchQuery 
  } = useApp();

  const [feedFilter, setFeedFilter] = useState<'for_you' | 'following' | 'trending'>('for_you');

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (feedFilter === 'following') {
      const author = users.find(u => u.id === post.authorId);
      return author?.isFollowing || post.authorId === currentUser.id;
    }
    if (feedFilter === 'trending') {
      return post.likesCount > 3000;
    }
    return true; // For You includes all algorithmically ranked
  });

  const suggestedUsers = users.filter(u => !u.isFollowing && u.id !== currentUser.id).slice(0, 4);

  const trendingTags = [
    { name: 'Tokyo', postsCount: '48.2K' },
    { name: 'Architecture', postsCount: '34.9K' },
    { name: 'Cyberpunk', postsCount: '29.1K' },
    { name: 'GenerativeAI', postsCount: '22.4K' },
    { name: 'Iceland', postsCount: '18.7K' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 flex gap-8">
      {/* Central Feed Column */}
      <div className="flex-1 max-w-2xl mx-auto">
        {/* Stories Bar */}
        <div className="bg-[#0d0d12]/90 border border-white/[0.08] rounded-2xl p-3.5 mb-6 backdrop-blur-xl shadow-lg shadow-black/40">
          <StoryRow />
        </div>

        {/* Feed Filter Segmented Controls */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 p-1 bg-[#0c0c10] border border-white/[0.08] rounded-xl shadow-inner">
            <button
              onClick={() => setFeedFilter('for_you')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                feedFilter === 'for_you'
                  ? 'bg-white/[0.1] text-white shadow-sm ring-1 ring-white/10'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              For You
            </button>

            <button
              onClick={() => setFeedFilter('following')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                feedFilter === 'following'
                  ? 'bg-white/[0.1] text-white shadow-sm ring-1 ring-white/10'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Following
            </button>

            <button
              onClick={() => setFeedFilter('trending')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                feedFilter === 'trending'
                  ? 'bg-white/[0.1] text-white shadow-sm ring-1 ring-white/10'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Trending
            </button>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl gengram-gradient text-white text-xs font-bold hover:opacity-95 transition active:scale-95 shadow-md shadow-indigo-500/25 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Post
          </button>
        </div>

        {/* Posts Stream */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#0d0d12]/80 rounded-2xl border border-white/[0.08] backdrop-blur-xl">
            <Users className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No posts in this stream</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
              Follow more creators in the suggested panel or switch back to the 'For You' algorithmic feed.
            </p>
            <button
              onClick={() => setFeedFilter('for_you')}
              className="px-4 py-2 rounded-xl gengram-gradient text-white text-xs font-bold transition shadow-md shadow-indigo-500/20"
            >
              Back to For You
            </button>
          </div>
        )}
      </div>

      {/* Desktop Contextual Right Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 space-y-6 sticky top-6 h-fit">
        {/* Current User Quick Summary */}
        <div className="p-4 rounded-2xl bg-[#0d0d12]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/40 hover:border-white/[0.14] transition-all">
          <div className="flex items-center justify-between mb-3">
            <div 
              onClick={() => {
                setViewingProfileUser(null);
                setActiveTab('profile');
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/50 group-hover:ring-indigo-400 transition"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                    {currentUser.displayName}
                  </span>
                  {currentUser.isVerified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] text-white font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-400">@{currentUser.username}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                setViewingProfileUser(null);
                setActiveTab('profile');
              }}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
            >
              View
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-t border-white/[0.06] text-center">
            <div>
              <div className="text-xs font-bold text-white">{currentUser.postsCount}</div>
              <div className="text-[10px] text-neutral-400">Posts</div>
            </div>
            <div>
              <div className="text-xs font-bold text-white">{currentUser.followersCount.toLocaleString()}</div>
              <div className="text-[10px] text-neutral-400">Followers</div>
            </div>
            <div>
              <div className="text-xs font-bold text-white">{currentUser.followingCount.toLocaleString()}</div>
              <div className="text-[10px] text-neutral-400">Following</div>
            </div>
          </div>
        </div>

        {/* Suggested Creators */}
        <div className="p-4 rounded-2xl bg-[#0d0d12]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/40 hover:border-white/[0.14] transition-all">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Suggested Creators</span>
            <button 
              onClick={() => setActiveTab('explore')}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="space-y-3.5">
            {suggestedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between gap-3">
                <div 
                  onClick={() => {
                    setViewingProfileUser(user);
                    setActiveTab('profile');
                  }}
                  className="flex items-center gap-2.5 cursor-pointer group flex-1 min-w-0"
                >
                  <img 
                    src={user.avatar} 
                    alt={user.displayName}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-indigo-400 transition"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition truncate">
                        {user.displayName}
                      </span>
                      {user.isVerified && (
                        <span className="w-3 h-3 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] text-white font-bold shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 truncate block">{user.category || `@${user.username}`}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(user.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                    user.isFollowing
                      ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-300 border border-white/[0.08]'
                      : 'gengram-gradient text-white shadow-sm shadow-indigo-500/20'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="p-4 rounded-2xl bg-[#0d0d12]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/40 hover:border-white/[0.14] transition-all">
          <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-neutral-300 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Trending on Gengram
          </div>

          <div className="space-y-3">
            {trendingTags.map((tag) => (
              <div 
                key={tag.name}
                onClick={() => {
                  setSearchQuery(tag.name);
                  setActiveTab('explore');
                }}
                className="flex items-center justify-between p-2 -mx-1 rounded-xl hover:bg-white/[0.04] cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-semibold text-white">#{tag.name}</div>
                  <div className="text-[10px] text-neutral-400">{tag.postsCount} posts</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Platform Status & Footer */}
        <div className="px-2 text-[11px] text-neutral-500 leading-relaxed space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Gengram Core Network Online • 4K HDR Ready</span>
          </div>
          <p>© 2026 Gengram Platform Inc. Privacy • Terms • Creator Program • API</p>
        </div>
      </aside>
    </div>
  );
};
