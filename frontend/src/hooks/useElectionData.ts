import { useState, useEffect } from 'react';
import type { ElectionData } from '../types/election';

export function useElectionData() {
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        // In a real app, fetch from API
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockElectionData: ElectionData = {
          electionName: 'Sri Lankan Presidential Election 2024',
          electionDate: new Date('2024-12-15T08:00:00'),
          daysRemaining: 45,
          hoursRemaining: 12,
          minutesRemaining: 34,
          secondsRemaining: 17,
          candidates: [
            {
              id: '1',
              name: 'Ranil Wickremesinghe',
              party: 'United National Party',
              imageUrl: 'https://example.com/ranil.jpg',
              promiseFulfillment: 72,
              position: 'Promise Fulfilled'
            },
            {
              id: '2',
              name: 'Anura Kumara Dissanayake',
              party: 'National People\'s Power',
              imageUrl: 'https://example.com/anura.jpg',
              promiseFulfillment: 88,
              position: 'Promise Fulfilled'
            },
            {
              id: '3',
              name: 'Sajith Premadasa',
              party: 'Samagi Jana Balawegaya',
              imageUrl: 'https://example.com/sajith.jpg',
              promiseFulfillment: 86,
              position: 'Promise Fulfilled'
            }
          ],
          electionFacts: [
            {
              id: '1',
              content: 'Did you know? Voter turnout in the 2020 Sri Lankan election was 83.7%, one of the highest in South Asia.'
            },
            {
              id: '2',
              content: 'The Electoral Commission has introduced new digital voting verification systems for the upcoming election.'
            },
            {
              id: '3',
              content: 'The 2024 election will feature the largest number of candidates in Sri Lankan electoral history.'
            }
          ],
          voterTurnout: [
            { year: 2005, percentage: 73.7 },
            { year: 2010, percentage: 74.5 },
            { year: 2015, percentage: 81.5 },
            { year: 2020, percentage: 83.7 }
          ],
          voteDistribution: [
            { party: 'UNP', percentage: 42.8, color: '#0066CC' },
            { party: 'NPP', percentage: 37.5, color: '#CC0000' },
            { party: 'SJB', percentage: 14.2, color: '#00CC66' },
            { party: 'Others', percentage: 5.5, color: '#CCCCCC' }
          ]
        };
        
        setElectionData(mockElectionData);
        setTimeRemaining({
          days: mockElectionData.daysRemaining,
          hours: mockElectionData.hoursRemaining,
          minutes: mockElectionData.minutesRemaining,
          seconds: mockElectionData.secondsRemaining
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load election data');
        setLoading(false);
      }
    };
    
    fetchElectionData();
    
    // Update countdown timer every second
    const timer = setInterval(() => {
      if (!electionData) return;
      
      setTimeRemaining(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return {
    electionData,
    timeRemaining,
    loading,
    error
  };
}