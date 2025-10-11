import { API_BASE_URL } from '../config';
import { Election, ElectionFactType, Candidate } from '../types/election';

export const electionService = {
  // Get all elections
  async getAllElections(): Promise<Election[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/elections`);
      if (!response.ok) {
        throw new Error('Failed to fetch elections');
      }
      const data = await response.json();
      return data.map(transformElectionResponse);
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  },
  
  // Get upcoming elections
  async getUpcomingElections(): Promise<Election[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/elections/upcoming`);
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming elections');
      }
      const data = await response.json();
      return data.map(transformElectionResponse);
    } catch (error) {
      console.error('Error fetching upcoming elections:', error);
      throw error;
    }
  },
  
  // Get election by ID
  async getElectionById(id: string): Promise<Election> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/elections/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch election details');
      }
      const data = await response.json();
      return transformElectionResponse(data);
    } catch (error) {
      console.error('Error fetching election details:', error);
      throw error;
    }
  },
  
  // Get election facts
  async getElectionFacts(electionId: string): Promise<ElectionFactType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/elections/${electionId}/facts`);
      if (!response.ok) {
        throw new Error('Failed to fetch election facts');
      }
      const data = await response.json();
      return data.map(transformElectionFactResponse);
    } catch (error) {
      console.error('Error fetching election facts:', error);
      throw error;
    }
  },
  
  // Get election candidates
  async getElectionCandidates(electionId: string): Promise<Candidate[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/elections/${electionId}/candidates`);
      if (!response.ok) {
        throw new Error('Failed to fetch election candidates');
      }
      const data = await response.json();
      return data.map(transformCandidateResponse);
    } catch (error) {
      console.error('Error fetching election candidates:', error);
      throw error;
    }
  }
};

// Helper functions to transform API responses
function transformElectionResponse(item: any): Election {
  return {
    id: item._id,
    title: item.title,
    type: item.type,
    status: item.status,
    date: new Date(item.date).toLocaleDateString(),
    description: item.description,
    imageUrl: item.imageUrl,
    location: item.location,
    candidates: item.candidates?.map(transformCandidateResponse) || [],
    turnout: item.turnout,
    totalRegisteredVoters: item.totalRegisteredVoters,
    votingCenters: item.votingCenters,
    electionFacts: item.electionFacts?.map(transformElectionFactResponse) || [],
    results: item.results?.map(transformElectionResultResponse) || []
  };
}

function transformCandidateResponse(item: any): Candidate {
  return {
    id: item._id || item.id,
    name: item.name,
    party: item.party,
    photoUrl: item.photoUrl,
    votes: item.votes,
    votePercentage: item.votePercentage,
    color: item.color,
    manifesto: item.manifesto,
    promises: item.promises,
    biography: item.biography,
    experience: item.experience
  };
}

function transformElectionFactResponse(item: any): ElectionFactType {
  return {
    id: item._id || item.id,
    title: item.title,
    content: item.content,
    category: item.category,
    source: item.source,
    verified: item.verified
  };
}

function transformElectionResultResponse(item: any): any {
  return {
    candidateId: item.candidateId,
    candidateName: item.candidateName,
    party: item.party,
    votes: item.votes,
    percentage: item.percentage,
    color: item.color
  };
}