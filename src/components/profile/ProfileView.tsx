import React, { useState } from 'react';
import { 
  Grid, Film, Bookmark, Tag, Settings, Edit3, Share2, 
  MapPin, Link as LinkIcon, Calendar, Check, Shield, 
  Lock, UserPlus, UserCheck, MessageSquare, Heart, MessageCircle, X, QrCode, Copy 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { User, Post } from '../../types';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    viewingProfileUser, 
    setViewingProfileUser, 
    users, 
    posts, 
    reels, 
    toggleFollowUser, 
    updateCurrentUser, 
    setActiveTab, 
    setSelectedPostForModal,
    startDirectMessageWithUser 
  } = useApp();
  const { firebaseUser } = useAuth();


  const [activeMediaTab, setActiveMediaTab] = useState<'posts' | 'reels' | 'saved' | 'tagged'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalType, setFollowersModalType] = useState<'followers' | 'following'>('followers');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editDisplayName, setEditDisplayName] = useState(currentUser.displayName);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [editLocation, setEditLocation] = useState(currentUser.location || '');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);
  const [editBanner, setEditBanner] = useState(currentUser.banner || '');
  const [editIsPrivate, setEditIsPrivate] = useState(currentUser.isPrivate);

  const activeUser: User = viewingProfileUser || currentUser;
  const isSelf = activeUser.id === currentUser.id;

  // Filter posts by active user
  const userPosts = posts.filter(p => p.authorId === activeUser.id && !p.isReel);
  const userReels = (reels || []).filter(p => p.authorId === activeUser.id || p.isReel);
  const savedPosts = posts.filter(p => p.isSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      displayName: editDisplayName,
      bio: editBio,
      website: editWebsite,
      location: editLocation,
      avatar: editAvatar,
      banner: editBanner,
      isPrivate: editIsPrivate
    });
    setIsEditModalOpen(false);
    showToast('Profile updated successfully!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyProfileLink = () => {
    navigator.clipboard?.writeText?.(window.location.origin + `/@${activeUser.username}`);
    showToast('Profile link copied to clipboard!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xl backdrop-blur-md animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Profile Card Header */}
      <div className="rounded-3xl overflow-hidden bg-[#0d0d12]/90 border border-white/[0.08] backdrop-blur-2xl shadow-2xl shadow-black/60">
        {/* Banner */}
        <div className="relative h-44 sm:h-60 w-full bg-gradient-to-r from-indigo-950 via-purple-950 to-neutral-900">
          {activeUser.banner && (
            <img 
              src={activeUser.banner} 
              alt="Profile banner" 
              className="w-full h-full object-cover opacity-80"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="relative">
                <img 
                  src={activeUser.avatar} 
                  alt={activeUser.displayName} 
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#0d0d12] shadow-2xl bg-neutral-900"
                />
                {activeUser.isOnline && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0d0d12]" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {activeUser.displayName}
                  </h1>
                  {activeUser.isVerified && (
                    <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                      ✓
                    </span>
                  )}
                  {activeUser.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-neutral-300 font-medium">
                      {activeUser.category}
                    </span>
                  )}
                </div>

                <div className="text-xs text-neutral-400 font-medium">
                  @{activeUser.username}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {isSelf ? (
                <>
                  <button 
                    id="edit_profile_btn"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-white/[0.08] cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>

                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold transition border border-white/[0.08] cursor-pointer"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold transition border border-white/[0.08] cursor-pointer"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    id="profile_follow_btn"
                    onClick={() => toggleFollowUser(activeUser.id)}
                    className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                      activeUser.isFollowing 
                        ? 'bg-white/[0.08] text-neutral-300 hover:bg-white/[0.12] border border-white/[0.08]' 
                        : 'gengram-gradient text-white hover:opacity-90 shadow-indigo-500/25'
                    }`}
                  >
                    {activeUser.isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Follow
                      </>
                    )}
                  </button>

                  <button 
                    id="profile_message_btn"
                    onClick={() => startDirectMessageWithUser(activeUser)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/[0.08] cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </button>

                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white transition border border-white/[0.08] cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio & Details */}
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line font-normal">
              {activeUser.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              {activeUser.website && (
                <a 
                  href={activeUser.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-indigo-400 hover:underline font-medium"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {activeUser.website.replace('https://', '')}
                </a>
              )}

              {activeUser.location && (
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  {activeUser.location}
                </span>
              )}

              {activeUser.joinedDate && (
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {activeUser.joinedDate}
                </span>
              )}
            </div>
          </div>

          {/* Counts bar */}
          <div className="flex items-center gap-8 pt-5 mt-5 border-t border-white/[0.08]">
            <div>
              <span className="text-sm font-bold text-white mr-1.5">{activeUser.postsCount}</span>
              <span className="text-xs text-neutral-400">posts</span>
            </div>

            <button 
              onClick={() => {
                setFollowersModalType('followers');
                setIsFollowersModalOpen(true);
              }}
              className="text-left cursor-pointer group"
            >
              <span className="text-sm font-bold text-white mr-1.5 group-hover:text-indigo-400 transition">
                {activeUser.followersCount.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition">followers</span>
            </button>

            <button 
              onClick={() => {
                setFollowersModalType('following');
                setIsFollowersModalOpen(true);
              }}
              className="text-left cursor-pointer group"
            >
              <span className="text-sm font-bold text-white mr-1.5 group-hover:text-indigo-400 transition">
                {activeUser.followingCount.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition">following</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Media Tabs */}
      <div className="flex items-center justify-center gap-3 border-b border-white/[0.08] pb-2">
        <button
          onClick={() => setActiveMediaTab('posts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeMediaTab === 'posts'
              ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          POSTS ({userPosts.length})
        </button>

        <button
          onClick={() => setActiveMediaTab('reels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeMediaTab === 'reels'
              ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Film className="w-4 h-4" />
          REELS ({userReels.length})
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveMediaTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMediaTab === 'saved'
                ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/[0.12]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            SAVED ({savedPosts.length})
          </button>
        )}
      </div>

      {/* Tab Content Display */}
      {activeMediaTab === 'posts' && (
        userPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPostForModal(post)}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer bg-[#0d0d12] border border-white/[0.08] hover:border-white/[0.2] transition"
              >
                <img 
                  src={post.media[0]?.url} 
                  alt={post.caption}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#050505]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white backdrop-blur-[2px]">
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500 text-xs">
            No posts published yet.
          </div>
        )
      )}

      {activeMediaTab === 'reels' && (
        userReels.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {userReels.map(reel => (
              <div
                key={reel.id}
                onClick={() => setSelectedPostForModal(reel)}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer bg-[#0d0d12] border border-white/[0.08] hover:border-white/[0.2] transition"
              >
                <img 
                  src={reel.media[0]?.poster || reel.media[0]?.url} 
                  alt={reel.caption}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10">
                  <Film className="w-4 h-4" />
                </div>
                <div className="absolute bottom-3 left-3 text-xs font-bold text-white drop-shadow flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{reel.likesCount}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500 text-xs">
            No reels uploaded yet.
          </div>
        )
      )}

      {activeMediaTab === 'saved' && (
        savedPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {savedPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPostForModal(post)}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer bg-[#0d0d12] border border-white/[0.08] hover:border-white/[0.2] transition"
              >
                <img 
                  src={post.media[0]?.url} 
                  alt={post.caption}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 p-1.5 rounded-lg gengram-gradient text-white shadow-md">
                  <Bookmark className="w-3.5 h-3.5 fill-white" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500 text-xs">
            No saved bookmarks yet. Save posts from the feed to view them here.
          </div>
        )
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d0d12] border border-white/[0.12] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <h2 className="text-base font-bold text-white">Edit Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Display Name</label>
                <input 
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Avatar Image URL</label>
                <input 
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Banner Image URL</label>
                <input 
                  type="url"
                  value={editBanner}
                  onChange={(e) => setEditBanner(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Bio</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Website</label>
                  <input 
                    type="url"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Location</label>
                  <input 
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <div>
                  <div className="font-semibold text-white">Private Account</div>
                  <div className="text-[10px] text-neutral-400">Only approved followers will see your posts and stories</div>
                </div>
                <input 
                  type="checkbox"
                  checked={editIsPrivate}
                  onChange={(e) => setEditIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl gengram-gradient text-white font-bold shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Profile Modal with QR Code */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d0d12] border border-white/[0.12] rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Share Profile</span>
              <button onClick={() => setIsShareModalOpen(false)} className="p-1 text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl gengram-gradient text-white flex flex-col items-center shadow-lg shadow-indigo-500/20">
              <div className="p-3 rounded-2xl bg-white text-neutral-950 mb-3 shadow-md">
                <QrCode className="w-32 h-32" />
              </div>
              <div className="font-black text-lg tracking-tight">{activeUser.displayName}</div>
              <div className="text-xs opacity-85">@{activeUser.username} • Gengram</div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={`https://gengram.app/@${activeUser.username}`} 
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#14141c] text-xs text-neutral-300 border border-white/[0.08] focus:outline-none"
              />
              <button 
                onClick={handleCopyProfileLink}
                className="px-4 py-2.5 rounded-xl gengram-gradient text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Followers / Following Modal */}
      {isFollowersModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d12] border border-white/[0.12] rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white capitalize">{followersModalType}</h3>
              <button onClick={() => setIsFollowersModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition">
                  <div 
                    onClick={() => {
                      setViewingProfileUser(u);
                      setIsFollowersModalOpen(false);
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img src={u.avatar} alt={u.displayName} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300">{u.displayName}</div>
                      <div className="text-[10px] text-neutral-400">@{u.username}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowUser(u.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      u.isFollowing ? 'bg-white/[0.08] text-neutral-300 hover:bg-white/[0.12] border border-white/[0.08]' : 'gengram-gradient text-white shadow-sm'
                    }`}
                  >
                    {u.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
