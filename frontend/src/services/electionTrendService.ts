import { electionService } from './electionService';
import { newsService } from './newsService';
import type { ElectionTrendPrediction, ElectionData, PartyTrendData } from '../types/election';

export const electionTrendService = {
  /**
   * Analyzes past election data and news sentiment to predict upcoming election trends
   */
  getPredictions: async (electionId: string): Promise<ElectionTrendPrediction> => {
    try {
      // Get current election data
      const currentElection = await electionService.getElectionById(electionId);
      
      // Get past elections for historical data
      const pastElections = await electionService.getPastElections();
      
      // Get recent news for sentiment analysis
      // Get recent news for sentiment analysis
            const recentNews = await newsService.getAllNews();
      // Calculate party trends based on past elections
      const partyTrends: PartyTrendData[] = [];
      
      // Simple algorithm to predict trends based on past elections and news sentiment
      const parties = currentElection.candidates.map(candidate => candidate.party);
      
      // Create unique party list
      const uniqueParties = [...new Set(parties)];
      
      uniqueParties.forEach(party => {
        // Track this party's performance in past elections
        const partyHistory = pastElections
          .filter(election => election.voteDistribution?.some(dist => dist.party === party))
          .map(election => {
            const partyResult = election.voteDistribution?.find(dist => dist.party === party);
            return {
              year: new Date(election.electionDate).getFullYear(),
              percentage: partyResult?.percentage || 0
            };
          })
          .sort((a, b) => a.year - b.year);
        
        // Calculate trend direction (up or down)
        let trendDirection = 0;
        if (partyHistory.length >= 2) {
          const lastTwoResults = partyHistory.slice(-2);
          trendDirection = lastTwoResults[1].percentage - lastTwoResults[0].percentage;
        }
        
        // Count positive/negative mentions in news
        const partyMentions = recentNews.filter(news => 
          news.title.toLowerCase().includes(party.toLowerCase()) || 
          news.content.toLowerCase().includes(party.toLowerCase())
        );
        
        // Very simple sentiment analysis (just for demonstration)
        const positiveKeywords = ['success', 'win', 'victory', 'improve', 'support', 'growth'];
        const negativeKeywords = ['scandal', 'controversy', 'fail', 'corruption', 'problem', 'crisis'];
        
        let sentimentScore = 0;
        
        partyMentions.forEach(news => {
          const content = news.content.toLowerCase();
          positiveKeywords.forEach(keyword => {
            if (content.includes(keyword)) sentimentScore += 1;
          });
          
          negativeKeywords.forEach(keyword => {
            if (content.includes(keyword)) sentimentScore -= 1;
          });
        });
        
        // Combine historical trend with sentiment for prediction
        // This is a simplified model - a real implementation would be more sophisticated
        const basePercentage = partyHistory.length > 0 
          ? partyHistory[partyHistory.length - 1].percentage 
          : 0;
          
        // Adjust prediction based on sentiment (1% per sentiment point)
        const sentimentAdjustment = sentimentScore * 1.0;
        const trendAdjustment = trendDirection * 0.5;
        
        // Calculate predicted percentage with constraints
        let predictedPercentage = basePercentage + sentimentAdjustment + trendAdjustment;
        predictedPercentage = Math.max(0, Math.min(100, predictedPercentage));
        
        // Add to party trends
        partyTrends.push({
          party,
          currentSupport: basePercentage,
          predictedSupport: parseFloat(predictedPercentage.toFixed(1)),
          trendDirection: Math.sign(trendAdjustment + sentimentAdjustment),
          confidence: calculateConfidence(partyHistory.length, partyMentions.length),
          color: getPartyColor(party),
        });
      });
      
      return {
        electionId,
        electionName: currentElection.electionName,
        predictionDate: new Date(),
        partyTrends: partyTrends.sort((a, b) => b.predictedSupport - a.predictedSupport),
        possibleOutcomes: generatePossibleOutcomes(partyTrends),
      };
    } catch (error) {
      console.error('Error predicting election trends:', error);
      throw new Error('Failed to generate election predictions');
    }
  }
};

// Helper functions
function calculateConfidence(historyPoints: number, newsPoints: number): string {
  const totalPoints = historyPoints + newsPoints;
  if (totalPoints > 10) return 'High';
  if (totalPoints > 5) return 'Medium';
  return 'Low';
}

function generatePossibleOutcomes(trends: PartyTrendData[]): string[] {
  if (trends.length === 0) return ['Insufficient data for prediction'];
  
  const sortedTrends = [...trends].sort((a, b) => b.predictedSupport - a.predictedSupport);
  const outcomes: string[] = [];
  
  // Clear winner scenario
  if (sortedTrends[0].predictedSupport > 50) {
    outcomes.push(`${sortedTrends[0].party} likely to win with majority`);
  } 
  // Close race scenario
  else if (sortedTrends.length > 1 && 
          (sortedTrends[0].predictedSupport - sortedTrends[1].predictedSupport < 5)) {
    outcomes.push(`Close race between ${sortedTrends[0].party} and ${sortedTrends[1].party}`);
  }
  // No clear majority
  else if (sortedTrends[0].predictedSupport < 40) {
    outcomes.push('No clear majority likely, coalition government possible');
  }
  
  return outcomes;
}

function getPartyColor(party: string): string {
  const partyColors: Record<string, string> = {
    'Sri Lanka Podujana Peramuna': '#8B0000',
    'Samagi Jana Balawegaya': '#006400',
    'National People\'s Power': '#DC143C',
    'United National Party': '#228B22',
    'SLFP': '#00008B',
    'JVP': '#FF0000'
  };
  
  return partyColors[party] || '#777777';
}