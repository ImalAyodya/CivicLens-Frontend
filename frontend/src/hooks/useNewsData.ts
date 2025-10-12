import { useState, useEffect } from 'react';
import { NewsItem, NewsCategory } from '../types/news';
import { newsService } from '../services/newsService';

export function useNewsData(category?: NewsCategory) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        console.log(`Fetching news with category: ${category || 'All'}`);
        
        let newsData: NewsItem[] = [];
        
        if (category && category !== 'All') {
          newsData = await newsService.getNewsByCategory(category);
        } else {
          newsData = await newsService.getAllNews();
        }
        
        console.log(`Received ${newsData?.length || 0} news items`);
        setNews(newsData || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news data');
        console.error('Error fetching news:', err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return { news, loading, error };
}

// Breaking news hook without fallback
export function useBreakingNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        setLoading(true);
        const breakingNews = await newsService.getBreakingNews();
        
        console.log(`Received ${breakingNews?.length || 0} breaking news items`);
        setNews(breakingNews || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch breaking news');
        console.error('Error fetching breaking news:', err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakingNews();
  }, []);

  return { breakingNews: news, loading, error };
}