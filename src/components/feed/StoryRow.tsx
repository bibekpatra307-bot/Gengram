import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoryRow: React.FC = () => {
  const { stories, currentUser, setActiveStoryIndex, setIsUploadModalOpen } = useApp();

  return (
    <div id="feed_stories_carousel" className="w-full overflow-x-auto no-scrollbar py-2 px-1 flex items-center gap-4">
      {/* Current User Story / Add Story */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
        <div 
          onClick={() => setIsUploadModalOpen(true)}
          className="relative w-16 h-16 rounded-full p-[2px] bg-white/[0.1] hover:bg-white/[0.18] transition"
        >
          <img 
            src={currentUser.avatar} 
            alt={currentUser.displayName}
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full gengram-gradient text-white flex items-center justify-center ring-2 ring-[#050505] font-bold group-hover:scale-110 transition shadow-sm">
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>
        <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-200 truncate max-w-[68px]">
          Your story
        </span>
      </div>

      {/* Friends Stories */}
      {stories.map((story, index) => {
        const isSelf = story.userId === currentUser.id;
        if (isSelf && story.stories.length === 0) return null;

        return (
          <div 
            key={story.id}
            id={`story_item_${story.id}`}
            onClick={() => setActiveStoryIndex(index)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className={`w-16 h-16 rounded-full p-[2.5px] transition duration-300 group-hover:scale-105 ${
              story.hasUnread 
                ? 'story-ring-gradient shadow-lg shadow-pink-500/20' 
                : 'bg-white/[0.12]'
            }`}>
              <div className="w-full h-full rounded-full p-[2px] bg-[#050505]">
                <img 
                  src={story.user.avatar} 
                  alt={story.user.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-neutral-300 group-hover:text-white truncate max-w-[68px]">
              {story.user.displayName.split(' ')[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
};
