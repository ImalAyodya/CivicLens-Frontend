import axios from 'axios';
import { ElectionData } from '../types/election';
import Config from '../config';

const API_BASE_URL = Config.API_URL || 'https://civiclens-backend-production-2c6d.up.railway.app/api';

// Helper function to transform backend data to match frontend ElectionData structure
const mapToElectionData = (backendData: any): ElectionData => {
  // Use the election date from backend
  const electionDate = new Date(backendData.date);
  const now = new Date();
  const timeDiff = Math.max(0, electionDate.getTime() - now.getTime());
  
  // Convert milliseconds to days, hours, minutes, seconds
  const totalSeconds = Math.floor(timeDiff / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  // Map candidates data from the backend structure
  const candidates = backendData.candidates?.map((candidate: any) => ({
    id: candidate._id || candidate.id || String(Math.random()),
    name: candidate.name,
    party: candidate.party,
    imageUrl: candidate.imageUrl || 'https://example.com/placeholder.jpg',
    // Default values if not provided by backend
    promiseFulfillment: candidate.promiseFulfillment || 
                       (candidate.manifesto ? 75 : 0), // Just a placeholder calculation
    position: candidate.position || 'Candidate'
  })) || [];

  // Map election facts from the backend structure
  const electionFacts = backendData.facts?.map((fact: any, index: number) => ({
    id: fact._id || String(index + 1),
    content: fact.text
  })) || [];

  // Create voter turnout data (this might need adjustment based on your backend data)
  const voterTurnout = backendData.voterTurnoutHistory || [
    { year: new Date(electionDate).getFullYear(), percentage: backendData.voterTurnout || 0 }
  ];

  // Create vote distribution data from provinces or results if available
  let voteDistribution: any[] = [];
  if (backendData.provinces && backendData.provinces.length > 0) {
    // Try to extract from provinces results
    const allResults = backendData.provinces.flatMap((province: any) => province.results || []);
    
    // Group by party and sum votes
    const partiesMap = new Map();
    allResults.forEach((result: any) => {
      if (!partiesMap.has(result.party)) {
        partiesMap.set(result.party, {
          party: result.party,
          percentage: result.percentage || 0,
          // Assign colors based on party if available or use defaults
          color: getPartyColor(result.party)
        });
      } else {
        const existing = partiesMap.get(result.party);
        existing.percentage = (existing.percentage + (result.percentage || 0)) / 2; // Average
      }
    });
    
    voteDistribution = Array.from(partiesMap.values());
  }

  return {
    id: backendData._id || backendData.id || '',
    electionName: backendData.title || 'Election', // Backend uses 'title'
    electionDate: electionDate,
    daysRemaining: days,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    secondsRemaining: seconds,
    candidates: candidates,
    electionFacts: electionFacts,
    voterTurnout: voterTurnout,
    voteDistribution: voteDistribution
  };
};

// Helper function to assign colors to political parties
const getPartyColor = (party: string): string => {
  const colors: Record<string, string> = {
    'UNP': '#0066CC',
    'SLPP': '#E51C23',
    'SJB': '#00CC66',
    'NPP': '#CC0000',
    'UPFA': '#1B75BB',
    'NDF': '#4CAF50'
  };
  
  // Return color if party exists in map, otherwise return a default color
  return colors[party] || '#CCCCCC';
};

export const electionService = {
  // Get current/upcoming election
  getCurrentElection: async (): Promise<ElectionData> => {
    try {
      // Use the election countdown endpoint from your backend
      const response = await axios.get(`${API_BASE_URL}/elections/countdown/next`);
      
      // The response structure should be { success: true, data: { election: {...}, countdown: {...} } }
      if (response.data && response.data.success && response.data.data && response.data.data.election) {
        return mapToElectionData(response.data.data.election);
      } else {
        throw new Error('Invalid response structure from election countdown API');
      }
    } catch (error) {
      console.error('Error fetching current election:', error);
      throw error;
    }
  },

  // Get past elections
  getPastElections: async (): Promise<ElectionData[]> => {
    try {
      // Your backend uses /elections/filter/past for past elections
      const response = await axios.get(`${API_BASE_URL}/elections/filter/past`);
      
      // Check the response structure based on your backend
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map((election: any) => mapToElectionData(election));
      } else {
        console.warn('Unexpected response structure from past elections API', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching past elections:', error);
      throw error;
    }
  },

  // Get specific election by ID
  getElectionById: async (id: string): Promise<ElectionData> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/elections/${id}`);
      
      // Check the response structure based on your backend
      if (response.data && response.data.success && response.data.data) {
        return mapToElectionData(response.data.data);
      } else {
        throw new Error(`Invalid response structure when fetching election ${id}`);
      }
    } catch (error) {
      console.error(`Error fetching election ${id}:`, error);
      throw error;
    }
  },

  // Get election facts
  getElectionFacts: async (id: string): Promise<any[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/elections/${id}/facts`);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map((fact: any, index: number) => ({
          id: fact._id || String(index + 1),
          content: fact.text
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching election facts for ${id}:`, error);
      throw error;
    }
  },

  // Get upcoming elections
  getUpcomingElections: async (): Promise<ElectionData[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/elections/filter/upcoming`);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data.map((election: any) => mapToElectionData(election));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching upcoming elections:', error);
      throw error;
    }
  }
};