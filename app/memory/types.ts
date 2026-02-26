export type ContentType = 'article' | 'video' | 'conversation' | 'code' | 'note';

export type MemoryItem = {
  id: string;
  type: ContentType;
  title: string;
  summary: string;
  keyPoints: string[];
  url?: string;
  tags: string[];
  date: string;
  importance: 'low' | 'medium' | 'high';
  relatedProjects?: string[];
};
