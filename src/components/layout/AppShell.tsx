import React, { useState } from 'react';
import { 
  Home, Compass, Film, MessageSquare, PlusSquare, 
  Heart, Settings, LogOut, Menu, X, Sparkles, Shield, User as UserIcon, LogIn, Database, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FeedView } from '../feed/FeedView';
import { ReelsView } from '../reels/ReelsView';
import { ExploreView } from '../explore/ExploreView';
import { MessagesView } from '../messages/MessagesView';
import { ProfileView } from '../profile/ProfileView';
import { SettingsView } from '../settings/SettingsView';
import { StoryViewer } from '../story/StoryViewer';
import { UploadModal } from '../upload/UploadModal';
import { PostDetailModal } from '../modals/PostDetailModal';
import { CallModal } from '../modals/CallModal';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

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
  const { firebaseUser, signInWithGoogle, signOut, isLoading, dbSynced } = useAuth();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const totalUnreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleNavClick = (tab: 'feed' | 'explore' | 'reels' | 'messages' | 'profile' | 'settings') => {
    if (tab === 'profile') {
      setViewingProfileUser(null); // Reset to own profile
    }
    setActiveTab(tab);
  };

  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: totalUnreadMessages },
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
            <div className="w-10 h-10 rounded-2xl gengram-gradient flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white font-display block">
                GENGRAM
              </span>
              <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-bold uppercase block -mt-0.5">
                Pro Polish v3.0
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav_btn_${item.id}`}
                  onClick={() => handleNavClick(item.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer group relative ${
                    isActive 
                      ? 'bg-white/[0.08] text-white shadow-sm ring-1 ring-white/10' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 transition ${isActive ? 'text-indigo-400' : 'text-neutral-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <div className="w-1.5 h-4 rounded-full gengram-gradient absolute left-1" />
                  )}

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full gengram-gradient text-white text-[10px] font-bold shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Activity / Notifications button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Heart className="w-5 h-5 text-neutral-400" />
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
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition cursor-pointer relative ${
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
              <span>Profile</span>
              {activeTab === 'profile' && (
                <div className="w-1.5 h-4 rounded-full gengram-gradient absolute left-1" />
              )}
            </button>
          </nav>

          {/* "+ Create Post / Reel / Story" CTA */}
          <div className="pt-2">
            <button
              id="sidebar_create_btn"
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full py-3.5 rounded-2xl gengram-gradient text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusSquare className="w-4 h-4" />
              Create Media
            </button>
          </div>
        </div>

        {/* Footer & User Card with Cloud SQL / Firebase Auth */}
        <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
          {/* Cloud SQL Database Status Badge */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[10px]">
            <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
              <Database className="w-3 h-3 text-indigo-400" />
              <span>PostgreSQL</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cloud SQL</span>
            </div>
          </div>

          {/* Firebase Google Auth Button / User Profile */}
          {firebaseUser ? (
            <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.04] border border-white/[0.06] transition group">
              <div 
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              >
                <img 
                  src={firebaseUser.photoURL || currentUser.avatar} 
                  alt={firebaseUser.displayName || currentUser.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-400/50"
                />
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition">
                      {firebaseUser.displayName || currentUser.displayName}
                    </p>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {firebaseUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                title="Sign out of Google"
                className="p-1.5 rounded-xl hover:bg-white/[0.08] text-neutral-400 hover:text-rose-400 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer group shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition" />
              <span>Sign in with Google</span>
            </button>
          )}

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
      <header className="md:hidden sticky top-0 z-30 px-4 py-3 bg-[#08080c]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('feed')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-xl gengram-gradient flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-display">
            GENGRAM
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="p-2 rounded-full text-neutral-300 hover:text-white"
          >
            <PlusSquare className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 rounded-full text-neutral-300 hover:text-white relative"
          >
            <Heart className="w-5 h-5" />
            {totalUnreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
          <button 
            onClick={() => handleNavClick('messages')}
            className="p-2 rounded-full text-neutral-300 hover:text-white relative"
          >
            <MessageSquare className="w-5 h-5" />
            {totalUnreadMessages > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 min-w-0 pb-20 md:pb-6 overflow-y-auto">
        {activeTab === 'feed' && <FeedView />}
        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'reels' && <ReelsView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#08080c]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => handleNavClick('feed')}
          className={`p-2 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'feed' ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Feed</span>
        </button>

        <button
          onClick={() => handleNavClick('explore')}
          className={`p-2 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'explore' ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="p-2 rounded-2xl flex flex-col items-center text-indigo-400"
        >
          <div className="w-8 h-8 rounded-xl gengram-gradient flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <PlusSquare className="w-4 h-4" />
          </div>
        </button>

        <button
          onClick={() => handleNavClick('reels')}
          className={`p-2 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'reels' ? 'text-pink-400' : 'text-neutral-500'
          }`}
        >
          <Film className="w-5 h-5" />
          <span>Reels</span>
        </button>

        <button
          onClick={() => handleNavClick('profile')}
          className={`p-2 rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold ${
            activeTab === 'profile' ? 'text-indigo-400' : 'text-neutral-500'
          }`}
        >
          <img 
            src={currentUser.avatar} 
            alt="Profile" 
            className={`w-5 h-5 rounded-full object-cover ring-2 ${
              activeTab === 'profile' ? 'ring-indigo-500' : 'ring-neutral-700'
            }`} 
          />
          <span>Profile</span>
        </button>
      </nav>

      {/* Global Modals & Layers */}
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
