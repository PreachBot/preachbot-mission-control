'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Plus, Target, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Column from './components/Column';
import Card from './components/Card';
import AddCardModal from './components/AddCardModal';

export type CardType = {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
};

export type ColumnType = {
  id: string;
  title: string;
  cards: CardType[];
};

const initialColumns: ColumnType[] = [
  {
    id: 'ideas',
    title: '💡 Ideas',
    cards: [
      {
        id: '1',
        title: 'Wine Brain Notion System',
        description: '4 databases for wine tracking, tasting logs, and palate preferences',
        priority: 'high',
        tags: ['wine', 'notion'],
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'todo',
    title: '📋 To Do',
    cards: [
      {
        id: '2',
        title: 'Deploy GeorgeSeverson.com',
        description: 'Push website to Netlify and connect domain',
        priority: 'high',
        tags: ['website', 'deployment'],
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'in-progress',
    title: '🚀 In Progress',
    cards: [
      {
        id: '3',
        title: 'Mission Control Dashboard',
        description: 'Building Kanban board for project management',
        priority: 'high',
        tags: ['dashboard', 'nextjs'],
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'done',
    title: '✅ Done',
    cards: [
      {
        id: '4',
        title: 'GitHub Repositories Created',
        description: 'Set up george-severson-website and ai-agent-experiments',
        priority: 'medium',
        tags: ['github', 'setup'],
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

export default function Home() {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('ideas');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mission-control-columns');
    if (saved) {
      setColumns(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mission-control-columns', JSON.stringify(columns));
  }, [columns]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = columns
      .flatMap((col) => col.cards)
      .find((card) => card.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const overColumnId = over.id as string;

    const sourceColumn = columns.find((col) =>
      col.cards.some((card) => card.id === activeCardId)
    );
    const targetColumn = columns.find((col) => col.id === overColumnId);

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn.id === targetColumn.id) return;

    const card = sourceColumn.cards.find((c) => c.id === activeCardId);
    if (!card) return;

    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            cards: col.cards.filter((c) => c.id !== activeCardId),
          };
        }
        if (col.id === targetColumn.id) {
          return {
            ...col,
            cards: [...col.cards, card],
          };
        }
        return col;
      })
    );
  };

  const handleAddCard = (card: Omit<CardType, 'id' | 'createdAt'>) => {
    const newCard: CardType = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setColumns((cols) =>
      cols.map((col) =>
        col.id === selectedColumn
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  const handleDeleteCard = (cardId: string) => {
    setColumns((cols) =>
      cols.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      }))
    );
  };

  const handleEditCard = (cardId: string, updates: Partial<CardType>) => {
    setColumns((cols) =>
      cols.map((col) => ({
        ...col,
        cards: col.cards.map((card) =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Mission Control</h1>
                <p className="text-purple-300 text-sm">Team: George & PreachBot</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/memory"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Memory Bank
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onDelete={handleDeleteCard}
                onEdit={handleEditCard}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCard ? (
              <div className="rotate-3 opacity-80">
                <Card card={activeCard} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCard}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
        columns={columns}
      />

      {/* Footer Stats */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-6 text-purple-300">
              <span>💡 {columns[0].cards.length} Ideas</span>
              <span>📋 {columns[1].cards.length} To Do</span>
              <span>🚀 {columns[2].cards.length} In Progress</span>
              <span>✅ {columns[3].cards.length} Done</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <span>Auto-saved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
