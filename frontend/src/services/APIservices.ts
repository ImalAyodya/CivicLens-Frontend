import { QuizResponse, QuizAnalysisResponse, UserAnswer } from './types';

// Change the BASE_URL from production to localhost
const BASE_URL = 'http://localhost:5000/api';
// const BASE_URL = 'https://civiclens-backend-production.up.railway.app/api';

/**
 * Fetch dashboard data for a specific politician
 */
export const fetchPoliticianDashboard = async (politicianId: string): Promise<any> => {
  try {
    console.log('[API] Fetching dashboard data for politician:', politicianId);
    const response = await fetch(`${BASE_URL}/performance/dashboard/${politicianId}`);
    
    if (!response.ok) {
      console.error('[API] Error response status:', response.status);
      throw new Error('Failed to fetch dashboard data');
    }
    
    const data = await response.json();
    console.log('[API] Dashboard data received:', data);
    
    // No more fallbacks - use the exact data from API
    return data;
  } catch (error) {
    console.error('[API] Error fetching politician dashboard:', error);
    throw error;
  }
};

/**
 * Fetch all politicians with their performance metrics
 */
export const fetchAllPoliticianPerformance = async (): Promise<any[]> => {
  try {
    console.log('[API] Fetching all politician performance data');
    const response = await fetch(`${BASE_URL}/performance/politicians`);
    
    if (!response.ok) {
      console.error('[API] Error response status:', response.status);
      throw new Error('Failed to fetch politicians performance');
    }
    
    const data = await response.json();
    console.log('[API] Received data for', data.length, 'politicians');
    return data;
  } catch (error) {
    console.error('[API] Error fetching politicians performance:', error);
    throw error;
  }
};

/**
 * Fetch ministry performance data
 */
export const fetchMinistryPerformance = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/performance/ministries`);
    if (!response.ok) throw new Error('Failed to fetch ministry performance');
    return await response.json();
  } catch (error) {
    console.error('Error fetching ministry performance:', error);
    throw error;
  }
};

/**
 * Compare promises between multiple politicians
 */
export const comparePromises = async (politicianIds: string[]): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/performance/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ politicianIds }),
    });
    if (!response.ok) throw new Error('Failed to fetch comparison data');
    return await response.json();
  } catch (error) {
    console.error('Error comparing politicians:', error);
    throw error;
  }
};

/**
 * Fetch performance metrics for all parties
 */
export const fetchPartyPerformance = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/performance/parties`);
    if (!response.ok) throw new Error('Failed to fetch party performance');
    return await response.json();
  } catch (error) {
    console.error('Error fetching party performance:', error);
    throw error;
  }
};

/**
 * Fetch all politicians for the comparison feature
 */
export const fetchPoliticiansForComparison = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/performance/politicians`);
    if (!response.ok) throw new Error('Failed to fetch politicians');
    return await response.json();
  } catch (error) {
    console.error('Error fetching politicians for comparison:', error);
    throw error;
  }
};

// PoliBot API Services

/**
 * Fetch politician information for PoliBot
 */
export const fetchPoliBotPolitician = async (name: string): Promise<any | null> => {
  try {
    const response = await fetch(`${BASE_URL}/polibot/politician/${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error('Failed to fetch politician info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching politician info:', error);
    return null;
  }
};

/**
 * Fetch party information for PoliBot
 */
export const fetchPoliBotParty = async (name: string): Promise<any | null> => {
  try {
    const response = await fetch(`${BASE_URL}/polibot/party/${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error('Failed to fetch party info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching party info:', error);
    return null;
  }
};

/**
 * Compare two politicians for PoliBot
 */
export const fetchPoliBotComparison = async (name1: string, name2: string): Promise<any | null> => {
  try {
    const response = await fetch(`${BASE_URL}/polibot/compare/${encodeURIComponent(name1)}/${encodeURIComponent(name2)}`);
    if (!response.ok) throw new Error('Failed to compare politicians');
    return await response.json();
  } catch (error) {
    console.error('Error comparing politicians:', error);
    return null;
  }
};

/**
 * Get policy area information for PoliBot
 */
export const fetchPoliBotPolicyArea = async (area: string): Promise<any | null> => {
  try {
    const response = await fetch(`${BASE_URL}/polibot/policy/${encodeURIComponent(area)}`);
    if (!response.ok) throw new Error('Failed to fetch policy area info');
    return await response.json();
  } catch (error) {
    console.error('Error fetching policy area info:', error);
    return null;
  }
};

/**
 * Search across politicians, parties, and policy areas for PoliBot
 */
export const searchPoliBot = async (query: string): Promise<{politicians: any[], parties: any[], policyAreas: any[]}> => {
  try {
    const response = await fetch(`${BASE_URL}/polibot/search/${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search');
    return await response.json();
  } catch (error) {
    console.error('Error searching:', error);
    return { politicians: [], parties: [], policyAreas: [] };
  }
};

/**
 * Fetch a response from the PoliBot AI (OpenRouter) endpoint
 */
export const fetchPoliBotAIResponse = async (message: string, language: string = 'en'): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/polibot-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message,
        language 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from PoliBot');
    }
    
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error fetching PoliBot AI response:', error);
    throw error;
  }
};

/**
 * Generate AI-powered quiz questions
 */
export const generateAIQuiz = async (language = 'English'): Promise<QuizResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate quiz');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating AI quiz:', error);
    // Return a safe fallback response
    return {
      success: false,
      language,
      totalQuestions: 0,
      quiz: [],
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Analyze user's quiz answers
 */
export const analyzeQuizAnswers = async (
  userAnswers: UserAnswer[], 
  language = 'English'
): Promise<QuizAnalysisResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/quiz/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAnswers, language }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze quiz');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing quiz answers:', error);
    // Return a safe fallback response
    return {
      success: false,
      score: 0,
      feedback: 'Unable to analyze results at this time.',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Save quiz history to the database
 */
export const saveQuizHistory = async (
  userId: string,
  username: string,
  language: string,
  score: number,
  totalQuestions: number,
  category: string,
  feedback: string,
  questions: UserAnswer[]
): Promise<any> => {
  try {
    console.log("Preparing to save quiz history...");
    
    // Process questions to ensure no null values (causes validation errors)
    const processedQuestions = questions.map(q => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: q.userAnswer || '' // Convert null to empty string
    }));
    
    console.log("Sending request to save quiz history...");
    
    const response = await fetch(`${BASE_URL}/quiz/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        username,
        language,
        score,
        totalQuestions,
        category,
        feedback: feedback || 'No feedback available', // Ensure feedback is never empty
        questions: processedQuestions
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.message || 'Failed to save quiz history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving quiz history:', error);
    throw error;
  }
};

/**
 * Get quiz history for a user
 */
export const getUserQuizHistory = async (userId: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/quiz/history/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    throw error;
  }
};

/**
 * Get specific quiz details
 */
export const getQuizDetail = async (quizId: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/quiz/history/detail/${quizId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    throw error;
  }
};

/**
 * Delete a specific quiz history
 */
export const deleteQuizHistory = async (quizId: string): Promise<any> => {
  try {
    const url = `${BASE_URL}/quiz/history/history/${quizId}`;
    console.log('[FRONTEND] DELETE request URL:', url); // <-- This will log the full URL
    const response = await fetch(url, {
      method: 'DELETE',
    });

    console.log('[FRONTEND] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[FRONTEND] Error response:', errorText);
      throw new Error('Failed to delete quiz history');
    }

    const data = await response.json();
    console.log('[FRONTEND] Response data:', data);
    return data;
  } catch (error) {
    console.error('[FRONTEND] Error deleting quiz history:', error);
    throw error;
  }
};

/**
 * Submit a new support request
 */
export const submitSupportRequest = async (supportData: {
  userId: string;
  username: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
}): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/support/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(supportData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit support request');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting support request:', error);
    throw error;
  }
};

/**
 * Get user's support request history
 */
export const getUserSupportRequests = async (userId: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/support/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch support requests');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching support requests:', error);
    throw error;
  }
};

/**
 * Get specific support request details
 */
export const getSupportRequestDetails = async (ticketId: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/support/request/${ticketId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch support request details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching support request details:', error);
    throw error;
  }
};

/**
 * Add a reply to a support request
 */
export const addReplyToSupportRequest = async (ticketId: string, from: string, message: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/support/request/${ticketId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, message }),
    });

    if (!response.ok) {
      throw new Error('Failed to add reply');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding reply:', error);
    throw error;
  }
};

/**
 * Update a support request status
 */
export const updateSupportRequestStatus = async (ticketId: string, status: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/support/request/${ticketId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating status:', error);
    throw error;
  }
};