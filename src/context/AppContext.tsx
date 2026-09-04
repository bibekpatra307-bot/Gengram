import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Post, Story, Conversation, Message, Notification, 
  UserSettings, ReportComplaint, NavigationTab, MediaItem, Comment 
} from '../types';
import { 
  CURRENT_USER, INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, 
  INITIAL_REELS, INITIAL_CONVERSATIONS, INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, INITIAL_SETTINGS, INITIAL_REPORTS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  updateCurrentUser: (data: Partial<User>) => void;
  users: User[];
  toggleFollowUser: (userId: string) => void;
  posts: Post[];
  addPost: (data: { caption: string; media: MediaItem[]; tags?: string[]; location?: string; isReel?: boolean }) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, content: string, parentCommentId?: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  stories: Story[];
  addStory: (media: MediaItem, caption?: string) => void;
  markStoryAsRead: (storyId: string) => void;
  reels: Post[];
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, content: { text?: string; media?: MediaItem; sharedPost?: Post; voiceDuration?: number }) => void;
  addReactionToMessage: (conversationId: string, messageId: string, emoji: string) => void;
  startDirectMessageWithUser: (user: User) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  reports: ReportComplaint[];
  submitReport: (report: { type: ReportComplaint['type']; title: string; description: string; severity: ReportComplaint['severity'] }) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  viewingProfileUser: User | null;
  setViewingProfileUser: (user: User | null) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  selectedPostForModal: Post | null;
  setSelectedPostForModal: (post: Post | null) => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  activeCallState: { isOpen: boolean; user?: User; type: 'audio' | 'video'; status: 'ringing' | 'connected' } | null;
  setActiveCallState: (state: { isOpen: boolean; user?: User; type: 'audio' | 'video'; status: 'ringing' | 'connected' } | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'gengram_current_user_v2',
  USERS: 'gengram_users_v2',
  POSTS: 'gengram_posts_v2',
  STORIES: 'gengram_stories_v2',
  REELS: 'gengram_reels_v2',
  CONVERSATIONS: 'gengram_conversations_v2',
  MESSAGES: 'gengram_messages_v2',
  NOTIFICATIONS: 'gengram_notifications_v2',
  SETTINGS: 'gengram_settings_v2',
  REPORTS: 'gengram_reports_v2'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or defaults
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORIES);
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REELS);
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [reports, setReports] = useState<ReportComplaint[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<NavigationTab>('feed');
  const [viewingProfileUser, setViewingProfileUser] = useState<User | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [selectedPostForModal, setSelectedPostForModal] = useState<Post | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeCallState, setActiveCallState] = useState<{ isOpen: boolean; user?: User; type: 'audio' | 'video'; status: 'ringing' | 'connected' } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // Apply theme to document root
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  // Actions
  const updateCurrentUser = (data: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...data };
      return updated;
    });

    // Sync author info in posts authored by current user
    setPosts(prev => prev.map(post => {
      if (post.authorId === currentUser.id) {
        return {
          ...post,
          author: {
            ...post.author,
            ...(data.displayName ? { displayName: data.displayName } : {}),
            ...(data.username ? { username: data.username } : {}),
            ...(data.avatar ? { avatar: data.avatar } : {}),
          }
        };
      }
      return post;
    }));

    // Sync author info in reels authored by current user
    setReels(prev => prev.map(reel => {
      if (reel.authorId === currentUser.id) {
        return {
          ...reel,
          author: {
            ...reel.author,
            ...(data.displayName ? { displayName: data.displayName } : {}),
            ...(data.username ? { username: data.username } : {}),
            ...(data.avatar ? { avatar: data.avatar } : {}),
          }
        };
      }
      return reel;
    }));

    // If viewing profile of current user, keep it in sync
    setViewingProfileUser(prev => {
      if (prev && prev.id === currentUser.id) {
        return { ...prev, ...data };
      }
      return prev;
    });
  };

  const toggleFollowUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextFollowing = !u.isFollowing;
        return {
          ...u,
          isFollowing: nextFollowing,
          followersCount: nextFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1)
        };
      }
      return u;
    }));

    setCurrentUser(prev => {
      const user = users.find(u => u.id === userId);
      const isNowFollowing = !user?.isFollowing;
      return {
        ...prev,
        followingCount: isNowFollowing ? prev.followingCount + 1 : Math.max(0, prev.followingCount - 1)
      };
    });

    if (viewingProfileUser && viewingProfileUser.id === userId) {
      setViewingProfileUser(prev => {
        if (!prev) return null;
        const nextFollowing = !prev.isFollowing;
        return {
          ...prev,
          isFollowing: nextFollowing,
          followersCount: nextFollowing ? prev.followersCount + 1 : Math.max(0, prev.followersCount - 1)
        };
      });
    }
  };

  const toggleLikePost = (postId: string) => {
    const updatePostList = (list: Post[]) => list.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    });

    setPosts(updatePostList);
    setReels(updatePostList);

    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(prev => {
        if (!prev) return null;
        const isLiked = !prev.isLiked;
        return {
          ...prev,
          isLiked,
          likesCount: isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1)
        };
      });
    }
  };

  const toggleSavePost = (postId: string) => {
    const updatePostList = (list: Post[]) => list.map(p => {
      if (p.id === postId) {
        const isSaved = !p.isSaved;
        return {
          ...p,
          isSaved,
          savesCount: isSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1)
        };
      }
      return p;
    });

    setPosts(updatePostList);
    setReels(updatePostList);

    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(prev => {
        if (!prev) return null;
        const isSaved = !prev.isSaved;
        return {
          ...prev,
          isSaved,
          savesCount: isSaved ? prev.savesCount + 1 : Math.max(0, prev.savesCount - 1)
        };
      });
    }
  };

  const addComment = (postId: string, content: string, parentCommentId?: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      postId,
      userId: currentUser.id,
      user: currentUser,
      content: content.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      replies: []
    };

    const updatePostList = (list: Post[]) => list.map(p => {
      if (p.id === postId) {
        if (parentCommentId && p.comments) {
          const updatedComments = p.comments.map(c => {
            if (c.id === parentCommentId) {
              return {
                ...c,
                replies: [
                  ...(c.replies || []),
                  {
                    id: `comm_rep_${Date.now()}`,
                    commentId: c.id,
                    userId: currentUser.id,
                    user: currentUser,
                    content: content.trim(),
                    createdAt: 'Just now',
                    likesCount: 0
                  }
                ]
              };
            }
            return c;
          });
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: updatedComments
          };
        }

        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newComment, ...(p.comments || [])]
        };
      }
      return p;
    });

    setPosts(updatePostList);
    setReels(updatePostList);

    if (selectedPostForModal && selectedPostForModal.id === postId) {
      setSelectedPostForModal(prev => {
        if (!prev) return null;
        return {
          ...prev,
          commentsCount: prev.commentsCount + 1,
          comments: [newComment, ...(prev.comments || [])]
        };
      });
    }
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    const updatePostList = (list: Post[]) => list.map(p => {
      if (p.id === postId && p.comments) {
        const updatedComments = p.comments.map(c => {
          if (c.id === commentId) {
            const isLiked = !c.isLiked;
            return {
              ...c,
              isLiked,
              likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1)
            };
          }
          return c;
        });
        return { ...p, comments: updatedComments };
      }
      return p;
    });

    setPosts(updatePostList);
  };

  const addPost = (data: { caption: string; media: MediaItem[]; tags?: string[]; location?: string; isReel?: boolean }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      author: currentUser,
      caption: data.caption,
      media: data.media,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: 'Just now',
      tags: data.tags || [],
      location: data.location,
      isReel: data.isReel,
      comments: []
    };

    if (data.isReel) {
      setReels(prev => [newPost, ...prev]);
    }
    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setReels(prev => prev.filter(p => p.id !== postId));
    if (selectedPostForModal?.id === postId) {
      setSelectedPostForModal(null);
    }
    setCurrentUser(prev => ({ ...prev, postsCount: Math.max(0, prev.postsCount - 1) }));
  };

  const addStory = (media: MediaItem, caption?: string) => {
    const newStoryItem = {
      id: `st_${Date.now()}`,
      type: media.type,
      url: media.url,
      duration: 5,
      timestamp: 'Just now',
      caption
    };

    setStories(prev => {
      const userStoryIndex = prev.findIndex(s => s.userId === currentUser.id);
      if (userStoryIndex >= 0) {
        const updated = [...prev];
        updated[userStoryIndex] = {
          ...updated[userStoryIndex],
          lastUpdated: 'Just now',
          stories: [...updated[userStoryIndex].stories, newStoryItem]
        };
        return updated;
      } else {
        const newStory: Story = {
          id: `story_user_${currentUser.id}`,
          userId: currentUser.id,
          user: currentUser,
          hasUnread: false,
          lastUpdated: 'Just now',
          stories: [newStoryItem]
        };
        return [newStory, ...prev];
      }
    });
  };

  const markStoryAsRead = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, hasUnread: false } : s));
  };

  const sendMessage = (
    conversationId: string, 
    content: { text?: string; media?: MediaItem; sharedPost?: Post; voiceDuration?: number }
  ) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text: content.text,
      media: content.media,
      sharedPost: content.sharedPost,
      voiceDuration: content.voiceDuration,
      createdAt: 'Just now',
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg]
    }));

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: newMsg,
          updatedAt: 'Just now'
        };
      }
      return c;
    }));

    // Simulate realistic recipient read receipt and auto-reply after 2.5s
    setTimeout(() => {
      setMessages(prev => {
        const list = prev[conversationId] || [];
        return {
          ...prev,
          [conversationId]: list.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m)
        };
      });
    }, 1500);
  };

  const addReactionToMessage = (conversationId: string, messageId: string, emoji: string) => {
    setMessages(prev => {
      const list = prev[conversationId] || [];
      const updated = list.map(m => {
        if (m.id === messageId) {
          const reactions = m.reactions || [];
          const exists = reactions.some(r => r.emoji === emoji && r.userId === currentUser.id);
          const nextReactions = exists
            ? reactions.filter(r => !(r.emoji === emoji && r.userId === currentUser.id))
            : [...reactions, { emoji, userId: currentUser.id, userName: currentUser.displayName }];
          return { ...m, reactions: nextReactions };
        }
        return m;
      });
      return { ...prev, [conversationId]: updated };
    });
  };

  const startDirectMessageWithUser = (user: User) => {
    let conv = conversations.find(c => c.participants.some(p => p.id === user.id));
    if (!conv) {
      const newConvId = `conv_${Date.now()}`;
      conv = {
        id: newConvId,
        participants: [currentUser, user],
        unreadCount: 0,
        updatedAt: 'Just now'
      };
      setConversations(prev => [conv!, ...prev]);
      setMessages(prev => ({ ...prev, [newConvId]: [] }));
    }
    setActiveConversationId(conv.id);
    setActiveTab('messages');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const submitReport = (report: { type: ReportComplaint['type']; title: string; description: string; severity: ReportComplaint['severity'] }) => {
    const newReport: ReportComplaint = {
      id: `rep_${Date.now()}`,
      type: report.type,
      title: report.title,
      description: report.description,
      severity: report.severity,
      status: 'open',
      createdAt: 'Just now',
      ticketNumber: `GEN-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setReports(prev => [newReport, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        users,
        toggleFollowUser,
        posts,
        addPost,
        deletePost,
        toggleLikePost,
        toggleSavePost,
        addComment,
        toggleLikeComment,
        stories,
        addStory,
        markStoryAsRead,
        reels,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        addReactionToMessage,
        startDirectMessageWithUser,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        settings,
        updateSettings,
        reports,
        submitReport,
        activeTab,
        setActiveTab,
        viewingProfileUser,
        setViewingProfileUser,
        activeStoryIndex,
        setActiveStoryIndex,
        selectedPostForModal,
        setSelectedPostForModal,
        isUploadModalOpen,
        setIsUploadModalOpen,
        activeCallState,
        setActiveCallState,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
