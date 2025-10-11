import { useState, useEffect } from 'react';
import { NewsItem } from '../types/news';
import { newsService } from '../services/newsService';

export function useNewsData(category?: string) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await newsService.getAllNews(category);
        setNews(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news');
        setLoading(false);
        console.error('Error in useNewsData:', err);
      }
    };

    fetchNews();
  }, [category]);

  return { news, loading, error };
}

export function useBreakingNews() {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        setLoading(true);
        const data = await newsService.getBreakingNews();
        setNews(data.length > 0 ? data[0] : null);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch breaking news');
        setLoading(false);
        console.error('Error in useBreakingNews:', err);
      }
    };

    fetchBreakingNews();
  }, []);

  return { breakingNews: news, loading, error };
}