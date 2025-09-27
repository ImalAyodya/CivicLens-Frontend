import { useState, useEffect } from 'react';
import type { NewsItem } from '../types/news';

export function useNewsData() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, fetch data from API
    const fetchNews = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: 'President Announces New Development Plan for Northern Province',
            subtitle: 'The plan aims to boost infrastructure and create jobs',
            date: '1h ago',
            source: 'Politics Daily',
            imageUrl: 'https://example.com/president.jpg',
            isBreaking: true,
            category: 'Politics',
            readTime: '3 min read'
          },
          {
            id: '2',
            title: 'Education Minister Promises Free Tablets for All Students by 2024',
            subtitle: 'Initiative aims to bridge the digital divide in education',
            date: '2h ago',
            source: 'Education Times',
            imageUrl: 'https://example.com/education.jpg',
            category: 'Education',
            readTime: '2 min read'
          },
          {
            id: '3',
            title: 'Supreme Court Orders Investigation into Municipal Corruption Case',
            subtitle: 'High-profile case involves several municipal officials',
            date: '3h ago',
            source: 'Legal Herald',
            imageUrl: 'https://example.com/court.jpg',
            category: 'Legal',
            readTime: '4 min read'
          },
          {
            id: '4',
            title: 'Central Bank Maintains Interest Rates Amid Economic Recovery',
            subtitle: 'Decision aims to support growth while keeping inflation in check',
            date: '4h ago',
            source: 'Economic Review',
            imageUrl: 'https://example.com/bank.jpg',
            category: 'Economy',
            readTime: '3 min read'
          },
        ];

        setNews(mockNews);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error };
}