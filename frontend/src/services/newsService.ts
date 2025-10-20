import axios from 'axios';
import { NewsItem, NewsCategory } from '../types/news';

// Define the standard response type
interface ApiResponse {
  success: boolean;
  count: number;
  data: NewsItem[];
  message?: string;
  error?: string;
}

const API_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/api';

export const newsService = {
  // Helper to extract data from responses
  extractData: (response: any): NewsItem[] => {
    console.log('Response type:', typeof response);
    console.log('Response keys:', Object.keys(response));
    
    // Case 1: Response with success and data properties
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      console.log(`Found ${response.data.length} news items in standard response`);
      return response.data;
    }
    
    // Case 2: Direct array response
    if (Array.isArray(response)) {
      console.log(`Found ${response.length} news items in array response`);
      return response;
    }
    
    console.error('Could not extract data from response:', response);
    return [];
  },

  // Get all news
  getAllNews: async (): Promise<NewsItem[]> => {
    try {
      console.log('Fetching all news from:', `${API_URL}/news`);
      const { data } = await axios.get<ApiResponse>(`${API_URL}/news`);
      console.log('Response structure:', Object.keys(data));
      return newsService.extractData(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  // Get news by category
  getNewsByCategory: async (category: NewsCategory): Promise<NewsItem[]> => {
    try {
      if (category === 'All') {
        return newsService.getAllNews();
      }
      
      console.log(`Fetching news for category: ${category}`);
      const { data } = await axios.get<ApiResponse>(`${API_URL}/news/category/${category}`);
      return newsService.extractData(data);
    } catch (error) {
      console.error(`Error fetching news by category ${category}:`, error);
      return [];
    }
  },

  // Get breaking news
  getBreakingNews: async (): Promise<NewsItem[]> => {
    try {
      console.log('Fetching breaking news from:', `${API_URL}/news/breaking`);
      const { data } = await axios.get<ApiResponse | NewsItem[]>(`${API_URL}/news/breaking`);
      return newsService.extractData(data);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      return [];
    }
  },

  // Get news by ID
  getNewsById: async (id: string): Promise<NewsItem | null> => {
    try {
      const { data } = await axios.get<NewsItem>(`${API_URL}/news/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching news with ID ${id}:`, error);
      return null;
    }
  },
};