'use client';

import { FileText, Video, MessageSquare, Code, FileCode, Tag as TagIcon } from 'lucide-react';
import { ContentType } from '../types';

type FilterBarProps = {
  selectedType: ContentType | 'all';
  setSelectedType: (type: ContentType | 'all') => void;
  selectedTag: string | 'all';
  setSelectedTag: (tag: string | 'all') => void;
  allTags: string[];
};

const typeButtons = [
  { id: 'all', label: 'All', icon: null },
  { id: 'article', label: 'Articles', icon: FileText },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'conversation', label: 'Conversations', icon: MessageSquare },
  { id: 'code', label: 'Code', icon: FileCode },
  { id: 'note', label: 'Notes', icon: Code },
];

export default function FilterBar({
  selectedType,
  setSelectedType,
  selectedTag,
  setSelectedTag,
  allTags,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {typeButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = selectedType === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => setSelectedType(btn.id as ContentType | 'all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2">
          <TagIcon className="w-4 h-4 text-white/40" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                selectedTag === 'all'
                  ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
