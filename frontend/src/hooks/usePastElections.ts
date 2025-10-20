import { useState, useEffect } from 'react';
import type { ElectionData } from '../types/election';
import { electionService } from '../services/electionService';

// Mock data for fallback
const mockPastElections: ElectionData[] = [
  {
    id: '2020',
    electionName: '2020 Presidential Election',
    electionDate: new Date('2020-11-16T08:00:00'),
    daysRemaining: 0,
    hoursRemaining: 0,
    minutesRemaining: 0,
    secondsRemaining: 0,
    candidates: [
      {
        id: '1',
        name: 'Gotabaya Rajapaksa',
        party: 'SLPP',
        imageUrl: 'https://example.com/gotabaya.jpg',
        promiseFulfillment: 65,
        position: 'President'
      },
      {
        id: '2',
        name: 'Sajith Premadasa',
        party: 'NDF',
        imageUrl: 'https://example.com/sajith.jpg',
        promiseFulfillment: 0,
        position: 'Opposition Leader'
      }
    ],
    electionFacts: [
      {
        id: '1',
        content: 'The 2020 election had the highest youth voter turnout in Sri Lankan history at 75% among voters aged 18-29.'
      }
    ],
    voterTurnout: [
      { year: 2005, percentage: 73.7 },
      { year: 2010, percentage: 74.5 },
      { year: 2015, percentage: 81.5 },
      { year: 2020, percentage: 83.7 }
    ],
    voteDistribution: [
      { party: 'SLPP', percentage: 52.25, color: '#E51C23' },
      { party: 'NDF', percentage: 41.99, color: '#4CAF50' },
      { party: 'NPP', percentage: 3.16, color: '#FF9800' },
      { party: 'Other', percentage: 2.6, color: '#9E9E9E' }
    ]
  },
  {
    id: '2015',
    electionName: '2015 Presidential Election',
    electionDate: new Date('2015-01-08T08:00:00'),
    daysRemaining: 0,
    hoursRemaining: 0,
    minutesRemaining: 0,
    secondsRemaining: 0,
    candidates: [
      {
        id: '1',
        name: 'Maithripala Sirisena',
        party: 'NDF',
        imageUrl: 'https://example.com/sirisena.jpg',
        promiseFulfillment: 58,
        position: 'Former President'
      },
      {
        id: '2',
        name: 'Mahinda Rajapaksa',
        party: 'UPFA',
        imageUrl: 'https://example.com/mahinda.jpg',
        promiseFulfillment: 0,
        position: 'Former President'
      }
    ],
    electionFacts: [
      {
        id: '1',
        content: 'The 2015 election saw a surprise victory by Maithripala Sirisena who was a former minister under Mahinda Rajapaksa.'
      }
    ],
    voterTurnout: [
      { year: 2005, percentage: 73.7 },
      { year: 2010, percentage: 74.5 },
      { year: 2015, percentage: 81.5 }
    ],
    voteDistribution: [
      { party: 'NDF', percentage: 51.28, color: '#4CAF50' },
      { party: 'UPFA', percentage: 47.58, color: '#E51C23' },
      { party: 'Other', percentage: 1.14, color: '#9E9E9E' }
    ]
  }
];

export function usePastElections() {
  const [elections, setElections] = useState<ElectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPastElections = async () => {
      try {
        const data = await electionService.getPastElections();
        
        if (data && data.length > 0) {
          setElections(data);
        } else {
          console.log('No past elections data returned, using mock data');
          setElections(mockPastElections);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in usePastElections:', err);
        setError('Failed to load past elections data');
        setLoading(false);
        
        // Fallback to mock data on error
        console.log('Using mock data as fallback');
        setElections(mockPastElections);
      }
    };
    
    fetchPastElections();
  }, []);

  return {
    elections,
    loading,
    error
  };
}

// DELETE THIS LINE - Don't call hooks outside of components!