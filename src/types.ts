export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner?: string;
  bio: string;
  website?: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing?: boolean;
  hasUnreadStory?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  badge?: string;
  category?: string;
  joinedDate?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  poster?: string;
  aspectRatio?: '1:1' | '4:5' | '16:9' | '9:16';
  altText?: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: CommentReply[];
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  caption: string;
  media: MediaItem[];
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  tags?: string[];
  location?: string;
  audioTitle?: string;
  audioArtist?: string;
  isReel?: boolean;
  pinned?: boolean;
  comments?: Comment[];
}

export interface StoryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration: number; // in seconds
  timestamp: string;
  caption?: string;
  link?: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  stories: StoryItem[];
  hasUnread: boolean;
  lastUpdated: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  media?: MediaItem;
  sharedPost?: Post;
  voiceDuration?: number;
  createdAt: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
  isGroup?: boolean;
  groupName?: string;
  isMuted?: boolean;
  isPinned?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'story_reply' | 'system';
  sender: User;
  postId?: string;
  postMedia?: string;
  text?: string;
  createdAt: string;
  isRead: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'oled' | 'light';
  accentColor: 'indigo' | 'purple' | 'pink' | 'emerald' | 'cyan';
  isPrivateAccount: boolean;
  allowDirectMessagesFrom: 'everyone' | 'following';
  showActivityStatus: boolean;
  readReceipts: boolean;
  pushNotifications: boolean;
  emailAlerts: boolean;
  twoFactorAuth: boolean;
  autoPlayVideos: boolean;
  saveToCameraRoll: boolean;
  contentFilterLevel: 'standard' | 'strict' | 'relaxed';
}

export interface ReportComplaint {
  id: string;
  type: 'bug' | 'content_violation' | 'harassment' | 'spam' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  ticketNumber: string;
}

export type NavigationTab = 
  | 'feed'
  | 'explore'
  | 'reels'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'upload';
