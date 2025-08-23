export interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  date: string;
  source: string;
  isBreaking?: boolean;
  readTime?: string;
  category: string;
}