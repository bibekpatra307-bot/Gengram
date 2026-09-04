import React, { useState } from 'react';
import { X, Heart, MessageCircle, UserPlus, Sparkles, Check, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Notification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead, setViewingProfileUser, setSelectedPostForModal, posts, setActiveTab } = useApp();
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'likes') return n.type === 'like';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  const handleNotificationClick = (notif: Notification) => {
    if (notif.postId) {
      const targetPost = posts.find(p => p.id === notif.postId);
      if (targetPost) {
        setSelectedPostForModal(targetPost);
        onClose();
        return;
      }
    }

    if (notif.sender) {
      setViewingProfileUser(notif.sender);
      setActiveTab('profile');
      onClose();
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/70 backdrop-blur-md flex justify-end animate-fade-in">
      <div className="w-full max-w-md h-full bg-[#0d0d12]/95 border-l border-white/[0.08] backdrop-blur-2xl shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#09090e]/80">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">Activity Alerts</h2>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={markNotificationsAsRead}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition cursor-pointer border border-indigo-500/20"
            >
              Mark all read
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/[0.06] text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.08] bg-[#09090e]/40">
          {(['all', 'likes', 'comments', 'follows'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold capitalize transition cursor-pointer ${
                filter === f
                  ? 'gengram-gradient text-white shadow-sm'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <div 
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition ${
                  !notif.isRead 
                    ? 'bg-white/[0.06] border border-indigo-500/30' 
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img src={notif.sender.avatar} alt={notif.sender.displayName} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10" />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#0d0d12] border border-white/[0.1] shadow">
                      {getIcon(notif.type)}
                    </div>
                  </div>

                  <div className="min-w-0 text-xs">
                    <p className="text-white leading-tight">
                      <span className="font-bold mr-1">{notif.sender.displayName}</span>
                      <span className="text-neutral-300 font-normal">{notif.text}</span>
                    </p>
                    <span className="text-[10px] text-neutral-500 mt-1 block">{notif.createdAt}</span>
                  </div>
                </div>

                {/* Media thumbnail if post related */}
                {notif.postMediaUrl && (
                  <img src={notif.postMediaUrl} alt="Post thumbnail" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/[0.1]" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-neutral-500 text-xs">
              No activity notifications in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
