export const fetchRandomQuestions = async (count = 15) => {
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
 * @param {string} politicianId - The ID of the politician
 * @returns {Object} Dashboard data including performance metrics
 */
export const fetchPoliticianDashboard = async (politicianId) => {
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
 * @returns {Array} List of politicians with performance data
 */
export const fetchAllPoliticianPerformance = async () => {
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
 * @returns {Array} List of ministries with performance metrics
 */
export const fetchMinistryPerformance = async () => {
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
 * @param {Array<string>} politicianIds - Array of politician IDs to compare
 * @returns {Array} Comparison data for the specified politicians
 */
export const comparePromises = async (politicianIds) => {
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
 * @returns {Array} List of parties with performance metrics
 */
export const fetchPartyPerformance = async () => {
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
 * @returns {Promise<Array>} List of politicians with basic info
 */
export const fetchPoliticiansForComparison = async () => {
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
 * @param {string} name - Politician name
 * @returns {Promise<Object>} Politician data with performance metrics
 */
export const fetchPoliBotPolitician = async (name) => {
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
 * @param {string} name - Party name or abbreviation
 * @returns {Object} Party data with performance metrics
 */
export const fetchPoliBotParty = async (name) => {
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
 * @param {string} name1 - First politician name
 * @param {string} name2 - Second politician name
 * @returns {Object} Comparison data between politicians
 */
export const fetchPoliBotComparison = async (name1, name2) => {
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
 * @param {string} area - Policy area name
 * @returns {Object} Policy area data with related metrics
 */
export const fetchPoliBotPolicyArea = async (area) => {
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
 * @param {string} query - Search query
 * @returns {Object} Search results with politicians, parties, and policy areas
 */
export const searchPoliBot = async (query) => {
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
 * @param {string} message - The user's message to PoliBot
 * @returns {Promise<string>} The AI-generated reply
 */
export const fetchPoliBotAIResponse = async (message) => {
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