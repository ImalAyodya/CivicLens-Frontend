import type { NewsItem } from '../types/news';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  NewsFeed: undefined;
  NewsDetail: {
    newsItem: NewsItem;
  };
  Notifications: undefined;
  ElectionCountdown: undefined;
  PastElections: undefined;
  ElectionMap: undefined;
  VoterEducation: undefined; // Add this new screen
  ElectionLaws: undefined;   // Add this new screen
};