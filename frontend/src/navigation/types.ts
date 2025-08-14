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
  PoliticianPromises: undefined;
  GrowthNews: undefined;
  MinistryPerformance: undefined; 
  PromiseDetail: { promise: any };
  GrowthNewsDetail: { news: any };
};