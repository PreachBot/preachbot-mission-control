'use client';

import { FileText, Video, MessageSquare, Code, BookOpen, Trash2, ExternalLink, Calendar, Tag as TagIcon, AlertCircle } from 'lucide-react';
import { MemoryItem, ContentType } from '../types';

type MemoryCardProps = {
  memory: MemoryItem;
  onDelete: (id: string) => void;
};

const typeIcons: Record<ContentType, React.ComponentType<any>> = {
  article: FileText,
  video: Video,
  conversation: MessageSquare,
  code: Code,
  note: BookOpen,
};

const typeColors: Record<ContentType, string> = {
  article: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  video: 'bg-red-500/20 text-red-300 border-red-500/30',
  conversation: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  code: 'bg-green-500/20 text-green-300 border-green-500/30',
  note: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

const importanceColors: Record<'low' | 'medium' | 'high', string> = {
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
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <span className={`inline-block text-xs px-2 py-1 rounded-full ${importanceColors[memory.importance]}`}>
              {memory.importance}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(memory.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
          title="Delete memory"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* Summary */}
      <p className="text-white/70 text-sm mb-4 line-clamp-3">{memory.summary}</p>

      {/* Key Points */}
      {memory.keyPoints && memory.keyPoints.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-white/60">
            <AlertCircle className="w-3 h-3" />
            Key Points
          </div>
          <ul className="space-y-1">
            {memory.keyPoints.slice(0, 3).map((point: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-purple-400 mt-1">•</span>
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
            {memory.keyPoints.length > 3 && (
              <li className="text-xs text-white/40 pl-4">
                +{memory.keyPoints.length - 3} more points
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Tags */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {memory.tags.map((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
            >
              <TagIcon className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Projects */}
      {memory.relatedProjects && memory.relatedProjects.length > 0 && (
        <div className="mb-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/40 mb-2">Related Projects:</div>
          <div className="flex flex-wrap gap-2">
            {memory.relatedProjects.map((project: string) => (
              <span key={project} className="text-xs px-2 py-1 bg-white/5 text-white/60 rounded">
                {project}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Calendar className="w-3 h-3" />
          {new Date(memory.date).toLocaleDateString()}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${typeColors[memory.type]}`}>
          {memory.type}
        </span>
      </div>
    </div>
  );
}
