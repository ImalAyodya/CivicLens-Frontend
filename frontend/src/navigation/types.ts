import { NewsItem } from '../types/news';

export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  SignUp: undefined;
  
  // Main screens
  Home: undefined;
  Dashboard: undefined;
  
  // Comparison feature
  Comparison: undefined;
  ComparisonResult: undefined;
  
  // Quiz feature
  PoliticalQuiz: undefined;
  QuizQuestion: undefined;
  QuizResult: undefined;
  
  // PoliBot feature
  PoliBot: undefined;
  PoliBotChat: undefined;
  
  // News feature
  NewsFeed: undefined;
  NewsDetail: { newsItem: NewsItem };
  Search: undefined;
  GrowthNewsDetail: { newsItem: NewsItem };
  
  // Election feature
  ElectionCountdown: undefined;
  PastElections: undefined;
  ElectionDetail: { electionId: string };
  
  // Politician feature
  PoliticianDirectory: undefined;
  PoliticianProfile: { politicianId: string };
  PoliticianPromises: { politicianId: string };
  
  // Other features
  Notifications: undefined;
  MinistryPerformance: undefined;
  PromiseDetail: { promiseId: string };
};