// Quiz API Types
export interface AIQuestion {
  id: number;
  type: 'MCQ' | 'TRUE_FALSE' | 'TYPING';
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface QuizResponse {
  success: boolean;
  language: string;
  totalQuestions: number;
  quiz: AIQuestion[];
  message?: string;
}

export interface UserAnswer {
  question: string;
  correctAnswer: string;
  userAnswer: string | null;
}

export interface QuizAnalysisResponse {
  success: boolean;
  score: number;
  feedback: string;
  message?: string;
  aiAnalyzed?: boolean; // Added to indicate if AI or fallback was used
}