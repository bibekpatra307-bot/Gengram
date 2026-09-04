import React, { useState } from 'react';
import { 
  Home, Compass, Film, MessageSquare, PlusSquare, 
  Heart, Settings, Menu, X, Shield, User as UserIcon, 
  CheckCircle2, Radio, BarChart3, ShieldAlert, CheckCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { NavigationTab } from '../../types';
import { FeedView } from '../feed/FeedView';
import { ReelsView } from '../reels/ReelsView';
import { ExploreView } from '../explore/ExploreView';
import { MessagesView } from '../messages/MessagesView';
import { ProfileView } from '../profile/ProfileView';
import { SettingsView } from '../settings/SettingsView';
import { LiveStreamView } from '../live/LiveStreamView';
import { CreatorDashboardView } from '../creator/CreatorDashboardView';
import { AdminDashboardView } from '../admin/AdminDashboardView';
import { StoryViewer } from '../story/StoryViewer';
import { UploadModal } from '../upload/UploadModal';
import { PostDetailModal } from '../modals/PostDetailModal';
import { CallModal } from '../modals/CallModal';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { AuthModal } from '../auth/AuthModal';

export const AppShell: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    setViewingProfileUser, 
    setIsUploadModalOpen, 
    conversations, 
    notifications,
    settings 
  } = useApp();
  const { 
    firebaseUser, 
    dbSynced 
  } = useAuth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const totalUnreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleNavClick = (tab: NavigationTab) => {
    if (tab === 'profile') {
      setViewingProfileUser(null); // Reset to own profile
    }
    setActiveTab(tab);
  };


  const navItems = [
    { id: 'feed', label: 'Home Feed', icon: Home },
    { id: 'explore', label: 'Explore & AI', icon: Compass },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'messages', label: 'Direct Messages', icon: MessageSquare, badge: totalUnreadMessages },
    { id: 'live', label: 'Live Streams', icon: Radio, isLive: true },
    { id: 'creator', label: 'Creator Studio', icon: BarChart3 },
    { id: 'admin', label: 'Safety & Admin', icon: ShieldAlert },
  ];

  return (
    <div className={`min-h-screen bg-[#050505] text-white flex flex-col md:flex-row overflow-x-hidden ${
      settings.theme === 'light' ? 'light-mode-override' : ''
    }`}>
      {/* Desktop & Tablet Vertical Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 p-5 border-r border-white/[0.08] bg-[#08080c]/90 backdrop-blur-2xl z-30 shrink-0">
        <div className="space-y-6">
          {/* Gengram Brand Logo */}
          <div 
            onClick={() => handleNavClick('feed')}
            className="flex items-center gap-3 px-2 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl nexora-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition relative">
              <span className="font-black text-lg tracking-wider font-display">G</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-300" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white font-display block">
                Gengram
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold uppercase block -mt-0.5">
                Social Platform
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav_btn_${item.id}`}
                  onClick={() => handleNavClick(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer group relative ${
                    isActive 
                      ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition ${isActive ? 'text-cyan-400' : 'text-neutral-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <div className="w-1 h-3.5 rounded-full nexora-gradient absolute left-1" />
                  )}

                  {item.isLive && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full nexora-gradient text-white text-[10px] font-bold shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Activity / Notifications button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-neutral-400" />
                <span>Notifications</span>
              </div>
              {totalUnreadNotifications > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                  {totalUnreadNotifications}
                </span>
              )}
            </button>

            {/* Profile nav item */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer relative ${
                activeTab === 'profile'
                  ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.displayName} 
                className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-500"
              />
              <span>Profile & Collections</span>
              {activeTab === 'profile' && (
                <div className="w-1 h-3.5 rounded-full nexora-gradient absolute left-1" />
              )}
            </button>
          </nav>

          {/* "+ Create Media" CTA */}
          <div className="pt-1">
            <button
              id="sidebar_create_btn"
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full py-3 rounded-2xl nexora-gradient text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusSquare className="w-4 h-4" />
              Create Post / Reel
            </button>
          </div>
        </div>

        {/* Footer & User Card */}
        <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
          {/* User Profile Card */}
          <div 
            onClick={() => handleNavClick('profile')}
            className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={firebaseUser?.photoURL || currentUser.avatar} 
                alt={firebaseUser?.displayName || currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-400/50 shrink-0"
              />
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition">
                    {firebaseUser?.displayName || currentUser.displayName}
                  </p>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                </div>
                <p className="text-[10px] text-neutral-400 truncate">
                  {firebaseUser?.email || `@${currentUser.username}`}
                </p>
              </div>
            </div>
          </div>

          {/* Settings & Profile shortcut */}
          <div 
            onClick={() => handleNavClick('profile')}
            className="flex items-center justify-between px-2 py-1 rounded-xl hover:bg-white/[0.04] transition cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-[11px] text-neutral-400 group-hover:text-white transition">
                Profile & Analytics
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavClick('settings');
              }}
              title="Settings"
              className="p-1 rounded-lg hover:bg-white/[0.08] text-neutral-400 hover:text-white transition"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 px-3 py-2.5 bg-[#08080c]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('feed')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-xl nexora-gradient flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/25">
            G
          </div>
          <span className="font-black text-base tracking-tight text-white font-display">
            Gengram
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => handleNavClick('profile')}
            className="p-0.5 rounded-full ring-1 ring-white/10 mr-1 cursor-pointer"
          >
            <img 
              src={firebaseUser?.photoURL || currentUser.avatar} 
              alt="Profile" 
              className="w-6 h-6 rounded-full object-cover" 
            />
          </button>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="p-1.5 rounded-full text-neutral-300 hover:text-white cursor-pointer"
          >
            <PlusSquare className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="p-1.5 rounded-full text-neutral-300 hover:text-white relative cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            {totalUnreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </button>
          <button 
            onClick={() => handleNavClick('messages')}
            className="p-1.5 rounded-full text-neutral-300 hover:text-white relative cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            {totalUnreadMessages > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 min-w-0 pb-20 md:pb-6 overflow-y-auto flex flex-col">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-2.5 border-b border-white/[0.06] bg-[#08080c]/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="font-bold text-white capitalize">
              {activeTab === 'feed' ? 'Home Feed' : activeTab === 'explore' ? 'Explore & AI' : activeTab}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[11px] text-neutral-400 font-mono">Gengram Network</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('settings')}
              title="Open Settings"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-neutral-300 hover:text-white transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Dynamic Screen Views */}
        <div className="flex-1 min-w-0">
          {activeTab === 'feed' && <FeedView />}
          {activeTab === 'explore' && <ExploreView />}
          {activeTab === 'reels' && <ReelsView />}
          {activeTab === 'messages' && <MessagesView />}
          {activeTab === 'live' && <LiveStreamView />}
          {activeTab === 'creator' && <CreatorDashboardView />}
          {activeTab === 'admin' && <AdminDashboardView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#08080c]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => handleNavClick('feed')}
          className={`p-1.5 rounded-2xl flex flex-col items-center gap-0.5 text-[9px] font-bold ${
            activeTab === 'feed' ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => handleNavClick('explore')}
          className={`p-1.5 rounded-2xl flex flex-col items-center gap-0.5 text-[9px] font-bold ${
            activeTab === 'explore' ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="p-1 rounded-2xl flex flex-col items-center text-indigo-400"
        >
          <div className="w-8 h-8 rounded-xl nexora-gradient flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <PlusSquare className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => handleNavClick('reels')}
          className={`p-1.5 rounded-2xl flex flex-col items-center gap-0.5 text-[9px] font-bold ${
            activeTab === 'reels' ? 'text-pink-400' : 'text-neutral-500'
          }`}
        >
          <Film className="w-5 h-5" />
          <span>Reels</span>
        </button>

        <button
          onClick={() => handleNavClick('live')}
          className={`p-1.5 rounded-2xl flex flex-col items-center gap-0.5 text-[9px] font-bold relative ${
            activeTab === 'live' ? 'text-rose-400' : 'text-neutral-500'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>Live</span>
        </button>

        <button
          onClick={() => handleNavClick('profile')}
          className={`p-1.5 rounded-2xl flex flex-col items-center gap-0.5 text-[9px] font-bold ${
            activeTab === 'profile' ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <img 
            src={currentUser.avatar} 
            alt="Profile" 
            className={`w-5 h-5 rounded-full object-cover ring-1 ${
              activeTab === 'profile' ? 'ring-indigo-500' : 'ring-neutral-700'
            }`} 
          />
          <span>Profile</span>
        </button>
      </nav>

      {/* Global Modals & Layers */}
      <AuthModal />
      <StoryViewer />
      <UploadModal />
      <PostDetailModal />
      <CallModal />
      <NotificationDrawer 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </div>
  );
};
