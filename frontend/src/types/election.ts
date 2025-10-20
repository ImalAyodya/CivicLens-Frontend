// Only update if there are field mismatches between frontend and backend

export interface Candidate {
  id: string;
  name: string;
  party: string;
  imageUrl: string;
  promiseFulfillment: number;
  position: string;
}

export interface ElectionFact {
  id: string;
  content: string;
}

export interface VoterTurnoutData {
  year: number;
  percentage: number;
}

export interface VoteDistributionData {
  party: string;
  percentage: number;
  color: string;
}

export interface ProvinceResult {
  party: string;
  votes: number;
  percentage: number;
}

export interface Province {
  name: string;
  leadingParty?: string;
  results: ProvinceResult[];
}

export interface ElectionData {
  id?: string;
  electionName: string;
  electionDate: Date;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  candidates: Candidate[];
  electionFacts: ElectionFact[];
  voterTurnout: VoterTurnoutData[];
  voteDistribution: VoteDistributionData[];
  provinces?: Province[]; // Add this line
}

export interface PartyTrendData {
  party: string;
  currentSupport: number;
  predictedSupport: number;
  trendDirection: number; // -1 for down, 0 for stable, 1 for up
  confidence: string;
  color: string;
}

export interface ElectionTrendPrediction {
  electionId: string;
  electionName: string;
  predictionDate: Date;
  partyTrends: PartyTrendData[];
  possibleOutcomes: string[];
}