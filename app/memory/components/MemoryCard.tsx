'use client';

import { FileText, Video, MessageSquare, Code, BookOpen, Trash2, ExternalLink, Calendar, Tag as TagIcon, AlertCircle } from 'lucide-react';
import { Memory } from '../page';

type MemoryCardProps = {
  memory: Memory;
  onDelete: (id: string) => void;
};

const typeIcons = {
  article: FileText,
  video: Video,
  conversation: MessageSquare,
  code: Code,
  note: BookOpen,
};

const typeColors = {
  article: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  video: 'bg-red-500/20 text-red-300 border-red-500/30',
  conversation: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  code: 'bg-green-500/20 text-green-300 border-green-500/30',
  note: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

const importanceColors = {
  low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function MemoryCard({ memory, onDelete }: MemoryCardProps) {
  const Icon = typeIcons[memory.type];

  return (
    <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${typeColors[memory.type]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white text-lg">{memory.title}</h3>
              {memory.url && (
                <a
                  href={memory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(memory.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-xs ${typeColors[memory.type]}`}>
                {memory.type}
              </span>
              <span className={`px-2 py-0.5 rounded-full border text-xs ${importanceColors[memory.importance]}`}>
                {memory.importance}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(memory.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>

      {/* Summary */}
      <p className="text-white/80 mb-4 leading-relaxed">{memory.summary}</p>

      {/* Key Points */}
      {memory.keyPoints && memory.keyPoints.length > 0 && (
        <div className="mb-4 bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-purple-400" />
            <span className="font-medium text-white text-sm">Key Points</span>
          </div>
          <ul className="space-y-2">
            {memory.keyPoints.map((point, index) => (
              <li key={index} className="text-sm text-white/70 flex gap-2">
                <span className="text-purple-400">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content (truncated) */}
      {memory.content && (
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-purple-400 hover:text-purple-300 transition-colors">
            View full content
          </summary>
          <div className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-white/70 whitespace-pre-wrap">{memory.content}</p>
          </div>
        </details>
      )}

      {/* Footer */}
      <div className="flex flex-wrap gap-2">
        {memory.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
          >
            <TagIcon className="w-3 h-3" />
            {tag}
          </span>
        ))}
        {memory.relatedProjects && memory.relatedProjects.length > 0 && (
          <>
            <div className="w-px bg-white/20" />
            {memory.relatedProjects.map((project) => (
              <span
                key={project}
                className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full"
              >
                {project}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
