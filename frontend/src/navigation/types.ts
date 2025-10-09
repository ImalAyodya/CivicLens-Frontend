import type { NewsItem } from '../types/news';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  MainTabs: undefined; // <-- Add this line
  NewsFeed: undefined;
  NewsDetail: {
    newsItem: NewsItem;
  };
  Notifications: undefined;
  ElectionCountdown: undefined;
  PastElections: undefined;
  ElectionMap: undefined;  // Add this new screen
  PoliticianProfile: { id: string }; 
  DirectoryScreen: undefined;
  AdminPanel: undefined;
  AddParty: undefined;
  PartyList: undefined;
  PoliticianList: undefined;
  AddPoliticianForm: undefined;
  RoleList: undefined;
  AddRole: undefined;
  LevelList: undefined;
  AddLevel: undefined;
  Hierarchy: undefined;
};