'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Tag, Edit2, X, Check } from 'lucide-react';
import { CardType } from '../page';

type CardProps = {
  card: CardType;
  isDragging?: boolean;
  onDelete?: (cardId: string) => void;
  onEdit?: (cardId: string, updates: Partial<CardType>) => void;
};

const priorityColors = {
  low: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function Card({ card, isDragging, onDelete, onEdit }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const [editedDescription, setEditedDescription] = useState(card.description);
  const [editedTags, setEditedTags] = useState(card.tags.join(', '));
  const [editedPriority, setEditedPriority] = useState(card.priority);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: card.id,
    disabled: isEditing, // Disable dragging while editing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(card.id, {
        title: editedTitle,
        description: editedDescription,
        tags: editedTags.split(',').map(t => t.trim()).filter(Boolean),
        priority: editedPriority,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(card.title);
    setEditedDescription(card.description);
    setEditedTags(card.tags.join(', '));
    setEditedPriority(card.priority);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 space-y-3"
      >
        {/* Title Input */}
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          autoFocus
        />

        {/* Description Input */}
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Description"
          rows={2}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
        />

        {/* Tags Input */}
        <input
          type="text"
          value={editedTags}
          onChange={(e) => setEditedTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />

        {/* Priority Buttons */}
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setEditedPriority(p)}
              className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                editedPriority === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium transition-colors"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all ${
        isDragging ? 'shadow-2xl shadow-purple-500/50 scale-105' : ''
      } ${isSortableDragging ? 'cursor-grabbing' : 'cursor-default'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
          <GripVertical className="w-5 h-5 text-white/40 hover:text-white/60" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-blue-500/20 rounded"
            title="Edit card"
          >
            <Edit2 className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={() => onDelete && onDelete(card.id)}
            className="p-1 hover:bg-red-500/20 rounded"
            title="Delete card"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-white mb-2">{card.title}</h3>
      <p className="text-sm text-white/70 mb-3">{card.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-1 rounded-full border ${priorityColors[card.priority]}`}
        >
          {card.priority}
        </span>
        <span className="text-xs text-white/50">
          {new Date(card.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
