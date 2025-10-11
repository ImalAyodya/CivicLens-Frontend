export interface Candidate {
  id: string;
  name: string;
  party: string;
  photoUrl?: string;
  votes?: number;
  votePercentage?: number;
  color?: string;
  manifesto?: string;
  promises?: string[];
  biography?: string;
  experience?: string;
}

export interface ElectionFactType {  // Renamed to avoid conflicts
  id: string;
  title: string;
  content: string;
  category?: string;
  source?: string;
  verified?: boolean;
}

export interface ElectionResult {
  candidateId: string;
  candidateName: string;
  party: string;
  votes: number;
  percentage: number;
  color?: string;
}

export interface Election {
  id: string;
  title: string;
  type: 'presidential' | 'parliamentary' | 'provincial' | 'local';
  status: 'upcoming' | 'ongoing' | 'completed';
  date: string;
  description: string;
  imageUrl?: string;
  location?: string;
  candidates: Candidate[];
  turnout?: number;
  totalRegisteredVoters?: number;
  votingCenters?: number;
  electionFacts?: ElectionFactType[];
  results?: ElectionResult[];
}