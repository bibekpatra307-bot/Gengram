import React, { useState } from 'react';
import { 
  X, Image as ImageIcon, Film, Clock, Sparkles, MapPin, 
  Hash, Users, Check, UploadCloud, Layers, Eye 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';

export const UploadModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addPost, addStory, setActiveTab } = useApp();

  const [contentType, setContentType] = useState<'post' | 'reel' | 'story'>('post');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string>(
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85'
  );
  const [isVideo, setIsVideo] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '16:9' | '9:16'>('4:5');
  const [activeFilter, setActiveFilter] = useState<'normal' | 'vivid' | 'noir' | 'cinematic' | 'cyberpunk'>('normal');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>(['Gengram', 'Aesthetics']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isUploadModalOpen) return null;

  const sampleMediaPresets = [
    {
      name: 'Cyberpunk Metropolis',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85',
      aspect: '4:5'
    },
    {
      name: 'Nordic Glass Studio',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      aspect: '4:5'
    },
    {
      name: 'Analog Soundboard',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85',
      aspect: '16:9'
    },
    {
      name: 'Aurora Night Sky',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-over-a-snowy-mountain-42998-large.mp4',
      aspect: '16:9'
    },
    {
      name: 'Vertical Reel Flow',
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-sound-mixer-panel-in-a-recording-studio-41484-large.mp4',
      aspect: '9:16'
    }
  ];

  const filterStyles = {
    normal: '',
    vivid: 'contrast-125 saturate-150',
    noir: 'grayscale contrast-150',
    cinematic: 'sepia-[0.3] contrast-125 brightness-95',
    cyberpunk: 'hue-rotate-15 saturate-200 contrast-125'
  };

  const handleAddTag = (tag: string) => {
    const clean = tag.replace('#', '').trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    setSelectedMediaUrl(fileUrl);
    setIsVideo(file.type.startsWith('video/'));
    if (file.type.startsWith('video/')) {
      setAspectRatio('9:16');
    }
  };

  const handlePublish = () => {
    if (!selectedMediaUrl) return;

    setIsPublishing(true);

    setTimeout(() => {
      const mediaItem: MediaItem = {
        id: `media_${Date.now()}`,
        type: isVideo ? 'video' : 'image',
        url: selectedMediaUrl,
        aspectRatio: contentType === 'reel' ? '9:16' : aspectRatio
      };

      if (contentType === 'story') {
        addStory(mediaItem, caption);
      } else {
        addPost({
          caption: caption.trim() || 'Uploaded via Gengram Studio ✨',
          media: [mediaItem],
          tags,
          location: location.trim() || undefined,
          isReel: contentType === 'reel'
        });
      }

      setIsPublishing(false);
      setIsUploadModalOpen(false);
      setActiveTab(contentType === 'reel' ? 'reels' : 'feed');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none animate-fade-in">
      <div className="w-full max-w-4xl bg-[#0d0d12] border border-white/[0.12] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-white/[0.08] flex items-center justify-between bg-[#09090e]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gengram-gradient text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Gengram Creator Studio</h2>
              <p className="text-[10px] text-neutral-400">High-Fidelity Social Publishing</p>
            </div>
          </div>

          <button 
            onClick={() => setIsUploadModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/[0.06] text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Type Tabs */}
        <div className="flex border-b border-white/[0.08] bg-[#09090e]/40 px-6 pt-2">
          <button
            onClick={() => {
              setContentType('post');
              setIsVideo(false);
              setAspectRatio('4:5');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              contentType === 'post' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Feed Post
          </button>

          <button
            onClick={() => {
              setContentType('reel');
              setIsVideo(true);
              setAspectRatio('9:16');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              contentType === 'reel' 
                ? 'border-pink-500 text-pink-400' 
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Film className="w-4 h-4" />
            Short Reel
          </button>

          <button
            onClick={() => {
              setContentType('story');
              setAspectRatio('9:16');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              contentType === 'story' 
                ? 'border-amber-500 text-amber-400' 
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            24h Story
          </button>
        </div>

        {/* Main Stage Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Left Media Preview & Controls */}
          <div className="md:col-span-7 p-6 border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col items-center justify-between bg-[#07070a]/70">
            {/* Live Media Stage */}
            <div className="w-full max-w-sm h-72 sm:h-80 bg-[#0d0d12] rounded-2xl overflow-hidden border border-white/[0.08] shadow-inner relative flex items-center justify-center">
              {isVideo ? (
                <video 
                  src={selectedMediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${filterStyles[activeFilter]}`}
                />
              ) : (
                <img 
                  src={selectedMediaUrl} 
                  alt="Upload preview"
                  className={`w-full h-full object-cover transition duration-300 ${filterStyles[activeFilter]}`}
                />
              )}

              {/* Watermark / Badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-white font-mono border border-white/10">
                {contentType.toUpperCase()} • {aspectRatio}
              </div>
            </div>

            {/* Filter Studio Toolbar */}
            {!isVideo && (
              <div className="w-full mt-4 space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Visual Filter</span>
                <div className="grid grid-cols-5 gap-2">
                  {(['normal', 'vivid', 'noir', 'cinematic', 'cyberpunk'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold capitalize transition border cursor-pointer ${
                        activeFilter === filter
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-white/[0.04] border-white/[0.08] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Presets or Upload Custom */}
            <div className="w-full mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Quick Presets & Upload</span>
                <label className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer flex items-center gap-1">
                  <UploadCloud className="w-3.5 h-3.5" />
                  Choose File
                  <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {sampleMediaPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMediaUrl(preset.url);
                      setIsVideo(preset.type === 'video');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition border shrink-0 cursor-pointer ${
                      selectedMediaUrl === preset.url
                        ? 'bg-white/10 border-white/30 text-white font-bold'
                        : 'bg-white/[0.04] border-white/[0.08] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Meta Form */}
          <div className="md:col-span-5 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4 text-xs">
              {/* Caption */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Caption & Description
                </label>
                <textarea 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share the story behind this visual, tag collaborators, or mention tools used..."
                  rows={4}
                  className="w-full p-3 rounded-2xl bg-[#14141c] border border-white/[0.08] text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
                <div className="text-right text-[10px] text-neutral-500 mt-1">
                  {caption.length} / 2,200 characters
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Hashtags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(t => (
                    <span 
                      key={t}
                      className="px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold flex items-center gap-1"
                    >
                      #{t}
                      <button onClick={() => handleRemoveTag(t)} className="hover:text-rose-400 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(customTagInput);
                        setCustomTagInput('');
                      }
                    }}
                    placeholder="Add tag and press Enter..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#14141c] border border-white/[0.08] text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddTag(customTagInput);
                      setCustomTagInput('');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold cursor-pointer transition border border-white/[0.08]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Location Tag
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Shibuya, Tokyo or San Francisco, CA"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#14141c] border border-white/[0.08] text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white transition text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button 
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-6 py-2.5 rounded-xl gengram-gradient text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 active:scale-95 transition flex items-center gap-2 cursor-pointer"
              >
                {isPublishing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing to Gengram...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Publish {contentType === 'reel' ? 'Reel' : contentType === 'story' ? 'Story' : 'Post'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
