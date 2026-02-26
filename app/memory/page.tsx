'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Video, MessageSquare, Code, Filter, Calendar, Tag as TagIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ContentCard from './components/ContentCard';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import { ContentType, MemoryItem } from './types';

const sampleMemories: MemoryItem[] = [
  {
    id: '1',
    type: 'article',
    title: 'Building AI Agent Businesses',
    summary: 'Services that used to require human teams can now run 24/7 with AI agents with minimal overhead. Focus on validation with early customers.',
    keyPoints: [
      'AI Research Assistant Service ($99-299/mo)',
      'Notion Automation ($49-199/mo)',
      'Social Media Intelligence ($149-499/mo)',
    ],
    url: 'https://notion.so/AI-Agent-Projects',
    tags: ['business', 'ai', 'automation'],
    date: '2026-02-15',
    importance: 'high',
    relatedProjects: ['AI Agent Experiments'],
  },
  {
    id: '2',
    type: 'conversation',
    title: 'Wine Preferences Discussion',
    summary: 'George loves structured, full-bodied dry reds. Top favorites: Louis M. Martini Napa Cab, JAX Vineyards, St. Giorgio Toscana. Pattern: Napa Cabernets and Italian Super Tuscans.',
    keyPoints: [
      'Favorite style: Structured, full-bodied, dry reds',
      'Loves Augusta Vin & Safari (Fredericksburg)',
      'Top wines all rated 4-5 stars',
    ],
    tags: ['wine', 'preferences', 'personal'],
    date: '2026-02-16',
    importance: 'high',
    relatedProjects: ['Wine Brain'],
  },
  {
    id: '3',
    type: 'article',
    title: 'Astro + Notion API Integration',
    summary: 'Building GeorgeSeverson.com with Astro static site generator pulling content from Notion databases. Fast, cheap hosting, easy content updates.',
    keyPoints: [
      'Astro for static site generation',
      'Notion as headless CMS',
      'Netlify for free hosting',
      'Total cost: ~$12/year (just domain)',
    ],
    url: 'https://github.com/PreachBot/george-severson-website',
    tags: ['website', 'tech', 'notion'],
    date: '2026-02-15',
    importance: 'high',
    relatedProjects: ['GeorgeSeverson.com'],
  },
  {
    id: '4',
    type: 'note',
    title: 'Mission Control Design Principles',
    summary: 'Team coordination tool using Kanban methodology. Purple gradient aesthetic, glassmorphism cards, drag-and-drop UX. Built with Next.js 15 + TypeScript + dnd-kit.',
    keyPoints: [
      'Four columns: Ideas → To Do → In Progress → Done',
      'Priority levels with color coding',
      'Auto-saves to localStorage',
      'Modern, clean design',
    ],
    tags: ['dashboard', 'design', 'nextjs'],
    date: '2026-02-18',
    importance: 'medium',
    relatedProjects: ['Mission Control'],
  },
];

export default function MemoryPage() {
  const [memories, setMemories] = useState<MemoryItem[]>(sampleMemories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memory-bank');
    if (saved) {
      setMemories(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('memory-bank', JSON.stringify(memories));
  }, [memories]);

  // Filter logic
  const filteredMemories = memories.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);

    return matchesSearch && matchesType && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags))).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </Link>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-indigo-400" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Memory Bank</h1>
                  <p className="text-indigo-300 text-sm">
                    Search & archive your knowledge
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-indigo-300">
              <span>{filteredMemories.length} items</span>
              <span>•</span>
              <span>{allTags.length} tags</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="border-b border-white/10 bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <FilterBar
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            allTags={allTags}
          />
        </div>
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredMemories.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No memories found
            </h3>
            <p className="text-white/60">
              {searchTerm || selectedType !== 'all' || selectedTag !== 'all'
                ? 'Try adjusting your filters'
                : 'Start adding articles, videos, and notes'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Stats Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-indigo-300">
            <div className="flex gap-6">
              <span>📄 {memories.filter((m) => m.type === 'article').length} Articles</span>
              <span>🎥 {memories.filter((m) => m.type === 'video').length} Videos</span>
              <span>💬 {memories.filter((m) => m.type === 'conversation').length} Convos</span>
              <span>📝 {memories.filter((m) => m.type === 'note').length} Notes</span>
            </div>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
