// This file should match with the backend model structure

export type NewsCategory = 
  | 'Politics' 
  | 'Economy' 
  | 'Education' 
  | 'Healthcare' 
  | 'Infrastructure'
  | 'Environment'
  | 'Technology'
  | 'International'
  | 'All';  // Add 'All' as a valid category

export interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  content: string;
  date: string | Date;
  category: NewsCategory;
  author: string;
  imageUrl?: string;
  isBreaking?: boolean;
  tags?: string[];
}