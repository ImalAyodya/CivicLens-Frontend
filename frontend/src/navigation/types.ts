import { AIQuestion, UserAnswer } from '../services/types';
import { NewsItem } from '../types/news';

export type RootStackParamList = {
  Splash: undefined;
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

  HelpAndSupport: undefined;
  SupportHistory: undefined;
  SupportDetail: { ticketId: string };

  
  PoliticalQuiz: undefined;
  // Current definition in types.ts
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
  NewsDetail: { newsId: string }; // Changed to use newsId
  Notifications: undefined;
  ElectionCountdown: undefined;
  PastElections: undefined;
  PastElectionDetails: {
    electionId: string;
  };
  ElectionMap: undefined;
  ElectionScreen: undefined;
  AddElectionScreen: undefined;
  ElectionLaws: undefined;
  PoliticianDetails: { id: string }; 
  DirectoryScreen: undefined;
  AdminPanel: undefined;
  AddParty: undefined;
  PartyList: undefined;
  PoliticalPartyList: undefined;
  PoliticianList: undefined;
  AddPoliticianForm: undefined;
  RoleList: undefined;
  AddRole: undefined;
  LevelList: undefined;
  AddLevel: undefined;
  Hierarchy: undefined;
  HierarchyPoliticianList: { levelId?: string; levelName?: string };
  Profile: undefined;
  PoliticianPromises: undefined;
  GrowthNews: undefined;
  MinistryPerformance: undefined;
  PromiseDetail: { promise: any };
  GrowthNewsDetail: { news: any };
  
  // Admin routes
  AdminDashboard: undefined;
  AdminSupportTickets: undefined;
  AdminResolvedTickets: undefined;
  AdminTicketDetail: { ticketId: string };
  AdminNewTicket: undefined;
  AdminUserManagement: undefined;
  AdminReports: undefined;
  AdminSettings: undefined;
  UserProfile: undefined;
  QuizHistory: undefined;
  QuizSummary: {
    userAnswers: UserAnswer[];
    language: string;
  };
  QuizDetail: {
    quizId: string;
    // other params
  };
  ElectionPredictions: { electionId: string };
  PublicEngagementScore: undefined;
  NewsList: undefined;
  AddNews: undefined;
  EditNews: { newsId: string };
  ElectionList: undefined;
  AddElection: undefined;
  EditElection: { electionId: string };
  ElectionResultScreen: { electionId: string };
};


