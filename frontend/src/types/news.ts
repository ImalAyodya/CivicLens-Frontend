export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  date: string;
  source: string;
  author: string;
  category: string;
  imageUrl: any;
  isBreaking?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  likesCount?: number;
  readTime: string;
  relatedPoliticians?: string[];
}

export interface NewsComment {
  id: string;
  userId?: string;
  name: string;
  comment: string;
  date: string;
}