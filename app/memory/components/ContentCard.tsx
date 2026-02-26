'use client';

import { FileText, Video, MessageSquare, Code, FileCode, ExternalLink, Calendar, Tag as TagIcon } from 'lucide-react';
import { MemoryItem } from '../page';

type ContentCardProps = {
  item: MemoryItem;
};

const typeIcons = {
  article: FileText,
  video: Video,
  conversation: MessageSquare,
  code: FileCode,
  note: Code,
};

const typeColors = {
  article: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  video: 'bg-red-500/20 text-red-300 border-red-500/30',
  conversation: 'bg-green-500/20 text-green-300 border-green-500/30',
  code: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  note: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

const importanceColors = {
  low: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function ContentCard({ item }: ContentCardProps) {
  const Icon = typeIcons[item.type];

  return (
    <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg border ${typeColors[item.type]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-white/60 hover:text-white" />
          </a>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-white/70 mb-3 line-clamp-3">{item.summary}</p>

      {/* Key Points */}
      {item.keyPoints.length > 0 && (
        <div className="mb-3 space-y-1">
          {item.keyPoints.slice(0, 2).map((point, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-white/60">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span className="line-clamp-1">{point}</span>
            </div>
          ))}
          {item.keyPoints.length > 2 && (
            <div className="text-xs text-white/40">
              +{item.keyPoints.length - 2} more points
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full"
          >
            <TagIcon className="w-3 h-3" />
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="text-xs text-white/40 px-2 py-1">
            +{item.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Calendar className="w-3 h-3" />
          {new Date(item.date).toLocaleDateString()}
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full border ${importanceColors[item.importance]}`}
        >
          {item.importance}
        </span>
      </div>

      {/* Related Projects */}
      {item.relatedProjects && item.relatedProjects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-xs text-white/40 mb-1">Related:</div>
          <div className="flex flex-wrap gap-1">
            {item.relatedProjects.map((project) => (
              <span
                key={project}
                className="text-xs px-2 py-1 bg-white/5 text-white/60 rounded"
              >
                {project}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
