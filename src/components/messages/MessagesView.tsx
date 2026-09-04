import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Image as ImageIcon, Smile, Phone, Video, MoreVertical, 
  ArrowLeft, Check, CheckCheck, Mic, Play, Pause, Paperclip, 
  Info, Search, PlusCircle, Sparkles, Heart, Circle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Message, User, Conversation } from '../../types';

export const MessagesView: React.FC = () => {
  const { 
    conversations, 
    messages, 
    activeConversationId, 
    setActiveConversationId, 
    sendMessage, 
    addReactionToMessage, 
    currentUser, 
    setActiveCallState,
    setViewingProfileUser,
    setActiveTab,
    users 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(null);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  const [searchConvQuery, setSearchConvQuery] = useState('');
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active conversation
  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const recipient: User | undefined = activeConv?.participants.find(p => p.id !== currentUser.id) || activeConv?.participants[0];
  const currentMessageList: Message[] = activeConv ? (messages[activeConv.id] || []) : [];

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const other = c.participants.find(p => p.id !== currentUser.id);
    if (!other) return true;
    return other.displayName.toLowerCase().includes(searchConvQuery.toLowerCase()) ||
           other.username.toLowerCase().includes(searchConvQuery.toLowerCase());
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessageList, activeConversationId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;

    sendMessage(activeConv.id, { text: inputMessage.trim() });
    setInputMessage('');

    // Simulate typing indicator from other user after 1 second
    setIsTypingSimulated(true);
    setTimeout(() => {
      setIsTypingSimulated(false);
    }, 2800);
  };

  const handleSendImageSample = (imageUrl: string) => {
    if (!activeConv) return;
    sendMessage(activeConv.id, {
      media: {
        id: `img_msg_${Date.now()}`,
        type: 'image',
        url: imageUrl,
        aspectRatio: '4:5'
      }
    });
  };

  const handleSendVoiceNote = () => {
    if (!activeConv) return;
    sendMessage(activeConv.id, {
      voiceDuration: 12
    });
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    if (!recipient) return;
    setActiveCallState({
      isOpen: true,
      user: recipient,
      type,
      status: 'ringing'
    });
  };

  const quickReactions = ['❤️', '🔥', '👏', '😂', '😮', '⚡'];

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-100px)] md:h-[calc(100vh-60px)] px-2 sm:px-4 py-2 flex rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d0d12]/90 backdrop-blur-2xl shadow-2xl shadow-black/60">
      {/* Left Conversations Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-white/[0.08] bg-[#08080d]/80 shrink-0 ${
        activeConversationId ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Direct Messages</h2>
            <span className="px-2 py-0.5 rounded-full gengram-gradient text-white text-[10px] font-bold shadow-sm">
              {conversations.length}
            </span>
          </div>
          <button 
            onClick={() => {
              const otherUser = users.find(u => u.id !== currentUser.id && !conversations.some(c => c.participants.some(p => p.id === u.id)));
              if (otherUser) {
                // start new DM
                setActiveConversationId(conversations[0]?.id || null);
              }
            }}
            className="p-2 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-indigo-400" />
          </button>
        </div>

        {/* Search in conversations */}
        <div className="p-3 border-b border-white/[0.08]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              value={searchConvQuery}
              onChange={(e) => setSearchConvQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#14141c] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-white/[0.04]">
          {filteredConversations.map(conv => {
            const other = conv.participants.find(p => p.id !== currentUser.id) || conv.participants[0];
            const isActive = activeConv?.id === conv.id;

            return (
              <div 
                key={conv.id}
                id={`conversation_item_${conv.id}`}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
                  isActive ? 'bg-white/[0.08] border-l-4 border-indigo-500' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="relative shrink-0">
                  <img 
                    src={other.avatar} 
                    alt={other.displayName} 
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10" 
                  />
                  {other.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#050505]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-xs font-bold text-white truncate">{other.displayName}</span>
                      {other.isVerified && (
                        <span className="w-3 h-3 rounded-full bg-indigo-500 flex items-center justify-center text-[7px] text-white font-bold shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0">{conv.updatedAt}</span>
                  </div>

                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-white font-semibold' : 'text-neutral-400'}`}>
                    {conv.lastMessage?.text || (conv.lastMessage?.media ? '📷 Attached media' : (conv.lastMessage?.voiceDuration ? '🎙️ Voice note' : 'Start conversation'))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Active Chat Panel */}
      {activeConv && recipient ? (
        <div className={`flex-1 flex flex-col bg-[#07070a]/90 min-w-0 ${
          !activeConversationId ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Chat Header */}
          <div className="p-3.5 px-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0d0d12]/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-1.5 rounded-full hover:bg-white/[0.08] text-neutral-300 mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div 
                onClick={() => {
                  setViewingProfileUser(recipient);
                  setActiveTab('profile');
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <img src={recipient.avatar} alt={recipient.displayName} className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-indigo-400" />
                  {recipient.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#050505]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white group-hover:text-indigo-300">{recipient.displayName}</span>
                    {recipient.isVerified && <span className="w-3 h-3 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] text-white font-bold">✓</span>}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {recipient.isOnline ? 'Online now • Active on Gengram' : `Last seen ${recipient.lastSeen || 'recently'}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Call Action Triggers */}
            <div className="flex items-center gap-1">
              <button 
                id="voice_call_btn"
                onClick={() => handleStartCall('audio')}
                className="p-2.5 rounded-full hover:bg-white/[0.08] text-neutral-300 hover:text-indigo-400 transition cursor-pointer"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button 
                id="video_call_btn"
                onClick={() => handleStartCall('video')}
                className="p-2.5 rounded-full hover:bg-white/[0.08] text-neutral-300 hover:text-indigo-400 transition cursor-pointer"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setViewingProfileUser(recipient);
                  setActiveTab('profile');
                }}
                className="p-2.5 rounded-full hover:bg-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Conversation encryption notice */}
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-full bg-[#121218] border border-white/[0.08] text-[10px] text-neutral-400 inline-flex items-center gap-1">
                🔒 Messages are end-to-end encrypted with Gengram SecKey
              </span>
            </div>

            {currentMessageList.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div 
                  key={msg.id}
                  id={`msg_bubble_${msg.id}`}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
                >
                  <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
                    {!isMe && (
                      <img src={recipient.avatar} alt={recipient.displayName} className="w-6 h-6 rounded-full object-cover mb-1 ring-1 ring-white/10" />
                    )}

                    <div className="relative">
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                        isMe 
                          ? 'gengram-gradient text-white rounded-br-xs shadow-indigo-500/15' 
                          : 'bg-[#151520] text-neutral-100 rounded-bl-xs border border-white/[0.08]'
                      }`}>
                        {/* Text content */}
                        {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                        {/* Image media */}
                        {msg.media && (
                          <div className="rounded-xl overflow-hidden mt-1 max-w-xs border border-white/10">
                            <img src={msg.media.url} alt="Attached message media" className="w-full h-auto object-cover" />
                          </div>
                        )}

                        {/* Voice Note Simulation */}
                        {msg.voiceDuration && (
                          <div className="flex items-center gap-3 py-1 px-1 min-w-[200px]">
                            <button 
                              onClick={() => setActiveVoicePlaying(activeVoicePlaying === msg.id ? null : msg.id)}
                              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition shrink-0 cursor-pointer"
                            >
                              {activeVoicePlaying === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                            </button>
                            <div className="flex-1 flex items-center gap-0.5 h-6">
                              {[40, 60, 30, 90, 70, 45, 80, 65, 30, 85, 95, 50, 40, 70, 60, 35].map((h, i) => (
                                <div 
                                  key={i} 
                                  className={`w-1 rounded-full transition-all ${
                                    activeVoicePlaying === msg.id ? 'bg-white animate-pulse' : 'bg-white/50'
                                  }`} 
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-white/80 shrink-0">0:{msg.voiceDuration}</span>
                          </div>
                        )}
                      </div>

                      {/* Reactions badge */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className={`absolute -bottom-2 flex gap-1 ${isMe ? 'right-2' : 'left-2'}`}>
                          {msg.reactions.map((r, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded-full bg-[#161620] border border-white/[0.1] text-[10px] shadow">
                              {r.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Reaction Trigger on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                      <button 
                        onClick={() => setShowEmojiPickerFor(showEmojiPickerFor === msg.id ? null : msg.id)}
                        className="p-1 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Smile className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Reaction Picker Popover */}
                  {showEmojiPickerFor === msg.id && (
                    <div className="flex items-center gap-1 p-1 bg-[#161620] border border-white/[0.1] rounded-full shadow-2xl z-30 my-1">
                      {quickReactions.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            addReactionToMessage(activeConv.id, msg.id, emoji);
                            setShowEmojiPickerFor(null);
                          }}
                          className="p-1 text-sm hover:scale-125 transition cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp & Status */}
                  <div className="flex items-center gap-1 text-[9px] text-neutral-500 mt-1 px-1">
                    <span>{msg.createdAt}</span>
                    {isMe && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 text-indigo-400 inline" />
                        ) : msg.status === 'delivered' ? (
                          <CheckCheck className="w-3 h-3 text-neutral-400 inline" />
                        ) : (
                          <Check className="w-3 h-3 text-neutral-500 inline" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Simulated Typing Indicator */}
            {isTypingSimulated && (
              <div className="flex items-center gap-2 text-xs text-neutral-400 italic">
                <img src={recipient.avatar} alt="typing" className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10" />
                <span className="flex items-center gap-1">
                  {recipient.displayName} is typing
                  <span className="animate-pulse">...</span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick preset media pills */}
          <div className="px-4 py-1.5 bg-[#09090e]/90 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-neutral-500 shrink-0">Quick media:</span>
            <button
              onClick={() => handleSendImageSample('https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80')}
              className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[10px] text-neutral-300 shrink-0 transition cursor-pointer border border-white/[0.06]"
            >
              🌆 Tokyo Cyber City
            </button>
            <button
              onClick={() => handleSendImageSample('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80')}
              className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[10px] text-neutral-300 shrink-0 transition cursor-pointer border border-white/[0.06]"
            >
              🏛️ Architecture Design
            </button>
            <button
              onClick={handleSendVoiceNote}
              className="px-2.5 py-1 rounded-full bg-indigo-900/40 hover:bg-indigo-900/70 text-[10px] text-indigo-300 shrink-0 transition cursor-pointer border border-indigo-500/20"
            >
              🎙️ Send 12s Audio Note
            </button>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/[0.08] bg-[#0c0c12]/90 flex items-center gap-2">
            <button 
              type="button"
              onClick={() => handleSendImageSample('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80')}
              className="p-2.5 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition cursor-pointer"
              title="Attach Sample Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <button 
              type="button"
              onClick={handleSendVoiceNote}
              className="p-2.5 rounded-full hover:bg-white/[0.08] text-neutral-400 hover:text-white transition cursor-pointer"
              title="Voice Message"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${recipient.displayName}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition"
            />

            <button 
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl gengram-gradient text-white disabled:opacity-30 transition cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-neutral-500 p-8 text-center bg-[#08080c]/60">
          <Send className="w-16 h-16 mb-4 text-neutral-700" />
          <h3 className="text-lg font-bold text-white mb-1">Your Direct Messages</h3>
          <p className="text-xs text-neutral-400 max-w-sm">
            Send private photos, videos, encrypted voice notes, and real-time replies to collaborators.
          </p>
        </div>
      )}
    </div>
  );
};
