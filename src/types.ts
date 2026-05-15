export type Mode = 'explain' | 'quiz' | 'summary';

export type Subject = 'Informatics' | 'Math' | 'Physics' | 'Biology';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  subject: Subject;
  mode: Mode;
  messages: Message[];
  title: string;
}
