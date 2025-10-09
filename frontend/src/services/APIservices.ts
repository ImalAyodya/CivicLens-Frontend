import { QuizResponse, QuizAnalysisResponse, UserAnswer } from './types';

export const fetchRandomQuestions = async (count = 15): Promise<any[]> => {
  try {
    const response = await fetch(`http://localhost:5000/api/questions/random?count=${count}`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching random questions:', error);
    return [];
  }
};

// Performance Dashboard API Services

/**
 * Fetch dashboard data for a specific politician
 */
export const fetchPoliticianDashboard = async (politicianId: string): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:5000/api/performance/dashboard/${politicianId}`);
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching politician dashboard:', error);
    throw error;
  }
};

/**
 * Fetch all politicians with their performance metrics
 */
export const fetchAllPoliticianPerformance = async (): Promise<any[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/performance/politicians');
    if (!response.ok) throw new Error('Failed to fetch politicians performance');
    return await response.json();
  } catch (error) {
    console.error('Error fetching politicians performance:', error);
    throw error;
  }
};

/**
 * Fetch ministry performance data
 */
export const fetchMinistryPerformance = async (): Promise<any[]> => {
  try {
    const response = await fetch('http://localhost:5000/api/performance/ministries');
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
    const response = await fetch('http://localhost:5000/api/performance/compare', {
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
    const response = await fetch('http://localhost:5000/api/performance/parties');
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
    const response = await fetch('http://localhost:5000/api/performance/politicians');
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
    const response = await fetch(`http://localhost:5000/api/polibot/politician/${encodeURIComponent(name)}`);
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
    const response = await fetch(`http://localhost:5000/api/polibot/party/${encodeURIComponent(name)}`);
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
    const response = await fetch(`http://localhost:5000/api/polibot/compare/${encodeURIComponent(name1)}/${encodeURIComponent(name2)}`);
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
    const response = await fetch(`http://localhost:5000/api/polibot/policy/${encodeURIComponent(area)}`);
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
    const response = await fetch(`http://localhost:5000/api/polibot/search/${encodeURIComponent(query)}`);
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
export const fetchPoliBotAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:5000/api/polibot-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error fetching PoliBot AI response:', error);
    return "Sorry, PoliBot is currently unavailable.";
  }
};

/**
 * Generate AI-powered quiz questions
 */
export const generateAIQuiz = async (language = 'English'): Promise<QuizResponse> => {
  try {
    const response = await fetch('http://localhost:5000/api/quiz/generate', {
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
    const response = await fetch('http://localhost:5000/api/quiz/analyze', {
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
    
    const response = await fetch('http://localhost:5000/api/quiz/history', {
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
    const response = await fetch(`http://localhost:5000/api/quiz/history/${userId}`);
    
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
    const response = await fetch(`http://localhost:5000/api/quiz/history/detail/${quizId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    throw error;
  }
};