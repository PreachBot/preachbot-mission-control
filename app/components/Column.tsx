'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card';
import { ColumnType, CardType } from '../page';

type ColumnProps = {
  column: ColumnType;
  onDelete: (cardId: string) => void;
  onEdit?: (cardId: string, updates: Partial<CardType>) => void;
};

export default function Column({ column, onDelete, onEdit }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-t-xl border border-white/10">
        <h2 className="font-semibold text-white text-lg">{column.title}</h2>
        <span className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
          {column.cards.length}
        </span>
      </div>

      {/* Cards Area */}
      <div
        ref={setNodeRef}
        className="flex-1 min-h-[200px] bg-white/5 backdrop-blur-sm rounded-b-xl border border-t-0 border-white/10 p-4 space-y-3"
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <Card 
              key={card.id} 
              card={card} 
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
