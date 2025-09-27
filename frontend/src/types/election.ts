export interface Candidate {
  id: string;
  name: string;
  party: string;
  imageUrl: string;
  promiseFulfillment: number; // Percentage of promises fulfilled
  position: string;
}

export interface ElectionFact {
  id: string;
  content: string;
  source?: string;
}

export interface VoterTurnoutPoint {
  year: number;
  percentage: number;
}

export interface VoteDistribution {
  party: string;
  percentage: number;
  color: string;
}

export interface ElectionData {
  electionName: string;
  electionDate: Date;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  candidates: Candidate[];
  electionFacts: ElectionFact[];
  voterTurnout: VoterTurnoutPoint[];
  voteDistribution: VoteDistribution[];
}