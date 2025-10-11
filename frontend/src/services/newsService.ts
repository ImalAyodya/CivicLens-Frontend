import { API_BASE_URL } from '../config';
import { NewsItem, NewsComment } from '../types/news';

export const newsService = {
  // Get all news articles with optional filters
  async getAllNews(category?: string, isBreaking?: boolean): Promise<NewsItem[]> {
    try {
      let url = `${API_BASE_URL}/api/news`;
      const params = new URLSearchParams();
      
      if (category && category !== 'All') {
        params.append('category', category.toLowerCase());
      }
      
      if (isBreaking !== undefined) {
        params.append('isBreaking', isBreaking.toString());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      return data.map(transformNewsResponse);
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },
  
  // Get breaking news
  async getBreakingNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/breaking`);
      if (!response.ok) {
        throw new Error('Failed to fetch breaking news');
      }
      
      const data = await response.json();
      return data.map(transformNewsResponse);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      throw error;
    }
  },
  
  // Get featured news
  async getFeaturedNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/featured`);
      if (!response.ok) {
        throw new Error('Failed to fetch featured news');
      }
      
      const data = await response.json();
      return data.map(transformNewsResponse);
    } catch (error) {
      console.error('Error fetching featured news:', error);
      throw error;
    }
  },
  
  // Get news by ID
  async getNewsById(id: string): Promise<NewsItem> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch news details');
      }
      
      const data = await response.json();
      return transformNewsResponse(data);
    } catch (error) {
      console.error('Error fetching news details:', error);
      throw error;
    }
  },
  
  // Get related news for a specific article
  async getRelatedNews(id: string): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${id}/related`);
      if (!response.ok) {
        throw new Error('Failed to fetch related news');
      }
      
      const data = await response.json();
      return data.map(transformNewsResponse);
    } catch (error) {
      console.error('Error fetching related news:', error);
      throw error;
    }
  },
  
  // Search news
  async searchNews(query: string, category?: string): Promise<NewsItem[]> {
    try {
      let url = `${API_BASE_URL}/api/news/search?q=${encodeURIComponent(query)}`;
      
      if (category && category !== 'All') {
        url += `&category=${encodeURIComponent(category.toLowerCase())}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to search news');
      }
      
      const data = await response.json();
      return data.map(transformNewsResponse);
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  },
  
  // Like a news article
  async likeNews(id: string, token?: string): Promise<{ likesCount: number, liked: boolean }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/news/${id}/like`, {
        method: 'POST',
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to like news');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error liking news:', error);
      throw error;
    }
  },
  
  // Get comments for a news article
  async getComments(id: string): Promise<NewsComment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news/${id}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      return data.map(transformCommentResponse);
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },
  
  // Add a comment to a news article
  async addComment(id: string, comment: string, name?: string, token?: string): Promise<NewsComment> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const body: any = { comment };
      if (name && !token) {
        body.name = name;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/news/${id}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const data = await response.json();
      return transformCommentResponse(data.comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }
};

// Helper function to transform news API response to frontend model
function transformNewsResponse(item: any): NewsItem {
  return {
    id: item._id,
    title: item.title,
    subtitle: item.summary || '',
    content: item.content,
    date: new Date(item.publishedDate).toLocaleDateString(),
    source: item.source,
    author: item.author,
    category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    imageUrl: item.imageUrl || require('../../assets/news-placeholder.png'),
    isBreaking: item.isBreaking || false,
    isFeatured: item.isFeatured || false,
    tags: item.tags || [],
    likesCount: item.likes?.count || 0,
    readTime: calculateReadTime(item.content),
    relatedPoliticians: item.relatedPoliticians || []
  };
}

// Helper function to transform comment API response to frontend model
function transformCommentResponse(item: any): NewsComment {
  return {
    id: item._id,
    userId: item.userId,
    name: item.name,
    comment: item.comment,
    date: new Date(item.date).toLocaleDateString()
  };
}

// Helper function to calculate read time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}