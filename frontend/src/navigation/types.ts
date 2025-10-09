import type { NewsItem } from '../types/news';
import { AIQuestion, UserAnswer } from '../services/types';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  MainTabs: undefined; // <-- Add this line
  Dashboard: undefined;
  Comparison: undefined;
  ComparisonResult: {
    politician1: any;
    politician2: any;
  };
  PoliticalQuiz: undefined;
  QuizQuestion: {
    questionId: number;
    totalQuestions: number;
    score: number;
    language: string;
    questions: AIQuestion[];
    userAnswers?: UserAnswer[];
  };
  QuizResult: {
    score?: number; // Make score optional since we're not using it
    totalQuestions: number;
    language: string;
    userAnswers: UserAnswer[];
  };
  PoliBot: undefined;
  PoliBotChat: undefined;
  NewsFeed: undefined;
  NewsDetail: {
    newsItem: NewsItem;
  };
  Notifications: undefined;
  ElectionCountdown: undefined;
  PastElections: undefined;
  PoliticianProfile: { id: string }; 
  DirectoryScreen: undefined;
  ElectionMap: undefined;
  PoliticianPromises: undefined;
  GrowthNews: undefined;
  MinistryPerformance: undefined; 
  PromiseDetail: { promise: any };
  GrowthNewsDetail: { news: any };
  QuizSummary: {
    userAnswers: UserAnswer[];
    language: string;
  };
  QuizHistory: undefined;
  QuizDetail: {
    quizId: string;
  };
};