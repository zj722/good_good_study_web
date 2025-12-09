export interface Node {
  id: string;
  label: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  chapterId: string;
  category: 'fundamental' | 'core' | 'advanced';
}

export interface Link {
  source: string;
  target: string;
  strength: 'strong' | 'weak';
}

export interface Chapter {
  id: string;
  subjectId: string;
  number: number;
  title: string;
  description: string;
}

export type ViewState = 'HOME' | 'CHAPTERS' | 'MAP' | 'CONTENT';

export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LessonContent {
  title: string;
  path: string[];
  body: string;
  interactiveType: 'wave' | 'formula' | 'graph' | 'generic';
}