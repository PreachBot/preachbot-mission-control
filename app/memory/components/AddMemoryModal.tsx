'use client';

import { useState } from 'react';
import { X, FileText, Video, MessageSquare, Code, BookOpen } from 'lucide-react';
import { ContentType, MemoryItem } from '../types';

type AddMemoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memory: Omit<MemoryItem, 'id' | 'date'>) => void;
};

const typeOptions: { value: ContentType; label: string; icon: typeof FileText }[] = [
  { value: 'article', label: 'Article', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'conversation', label: 'Conversation', icon: MessageSquare },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'note', label: 'Note', icon: BookOpen },
];

export default function AddMemoryModal({ isOpen, onClose, onAdd }: AddMemoryModalProps) {
  const [type, setType] = useState<ContentType>('note');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [url, setUrl] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tags, setTags] = useState('');
  const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [relatedProjects, setRelatedProjects] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    onAdd({
      type,
      title,
      summary,
      url: url || undefined,
      keyPoints: keyPoints
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      importance,
      relatedProjects: relatedProjects
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    });

    // Reset form
    setTitle('');
    setSummary('');
    setUrl('');
    setKeyPoints('');
    setTags('');
    setImportance('medium');
    setRelatedProjects('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Memory</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {typeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg font-medium transition-colors ${
                    type === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this memory a title..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* URL (optional) */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              URL (optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Summary *
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="2-3 sentence overview..."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              required
            />
          </div>

          {/* Key Points */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Key Points (one per line)
            </label>
            <textarea
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="Point 1&#10;Point 2&#10;Point 3"
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="wine, tech, business"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Importance */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Importance
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setImportance(level)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    importance === level
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Related Projects */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Related Projects (comma-separated)
            </label>
            <input
              type="text"
              value={relatedProjects}
              onChange={(e) => setRelatedProjects(e.target.value)}
              placeholder="Wine Brain, Mission Control"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              Add Memory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
