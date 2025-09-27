import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import ElectionYearSelector from '../../components/elections/pastElections/ElectionYearSelector';
import CandidateResultCard from '../../components/elections/pastElections/CandidateResultCard';
import TurnoutChart from '../../components/elections/pastElections/TurnoutChart';
import ElectionFactCard from '../../components/elections/pastElections/ElectionFactCard';
import { ElectionTabs, ElectionSummary } from '../../components/elections/pastElections/ElectionResults';
import Animated, { FadeIn } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'PastElections'>;

// Mock election data
interface ElectionData {
  year: number;
  name: string;
  winningCandidate: string;
  winningParty: string;
  turnoutPercentage: number;
  candidates: Array<{
    id: string;
    name: string;
    party: string;
    image?: string;
    votes: number;
    percentage: number;
    color: string;
    isWinner: boolean;
  }>;
  turnoutTrend: Array<{ year: number; percentage: number }>;
  electionFact: string;
}

const mockElectionData: Record<number, ElectionData> = {
  2020: {
    year: 2020,
    name: '2020 Presidential Election',
    winningCandidate: 'Gotabaya Rajapaksa',
    winningParty: 'Sri Lanka Podujana Peramuna',
    turnoutPercentage: 83.7,
    candidates: [
      {
        id: '1',
        name: 'Gotabaya Rajapaksa',
        party: 'SLPP',
        votes: 6924255,
        percentage: 52.25,
        color: '#E51C23',
        isWinner: true
      },
      {
        id: '2',
        name: 'Sajith Premadasa',
        party: 'NDF',
        votes: 5564239,
        percentage: 41.99,
        color: '#4CAF50',
        isWinner: false
      },
      {
        id: '3',
        name: 'Anura K. Dissanayaka',
        party: 'NPP',
        votes: 418553,
        percentage: 3.16,
        color: '#FF9800',
        isWinner: false
      }
    ],
    turnoutTrend: [
      { year: 2005, percentage: 73.7 },
      { year: 2010, percentage: 74.5 },
      { year: 2015, percentage: 81.5 },
      { year: 2020, percentage: 83.7 }
    ],
    electionFact: 'The 2020 election had the highest youth voter turnout in Sri Lankan history at 75% among voters aged 18-29.'
  },
  2015: {
    year: 2015,
    name: '2015 Presidential Election',
    winningCandidate: 'Maithripala Sirisena',
    winningParty: 'New Democratic Front',
    turnoutPercentage: 81.5,
    candidates: [
      {
        id: '1',
        name: 'Maithripala Sirisena',
        party: 'NDF',
        votes: 6217162,
        percentage: 51.28,
        color: '#4CAF50',
        isWinner: true
      },
      {
        id: '2',
        name: 'Mahinda Rajapaksa',
        party: 'UPFA',
        votes: 5768090,
        percentage: 47.58,
        color: '#E51C23',
        isWinner: false
      },
      {
        id: '3',
        name: 'Other Candidates',
        party: 'Various',
        votes: 138201,
        percentage: 1.14,
        color: '#9E9E9E',
        isWinner: false
      }
    ],
    turnoutTrend: [
      { year: 2005, percentage: 73.7 },
      { year: 2010, percentage: 74.5 },
      { year: 2015, percentage: 81.5 }
    ],
    electionFact: 'The 2015 election saw a surprise victory by Maithripala Sirisena who was a former minister under Mahinda Rajapaksa.'
  },
  2010: {
    year: 2010,
    name: '2010 Presidential Election',
    winningCandidate: 'Mahinda Rajapaksa',
    winningParty: 'United People\'s Freedom Alliance',
    turnoutPercentage: 74.5,
    candidates: [
      {
        id: '1',
        name: 'Mahinda Rajapaksa',
        party: 'UPFA',
        votes: 6015934,
        percentage: 57.88,
        color: '#E51C23',
        isWinner: true
      },
      {
        id: '2',
        name: 'Sarath Fonseka',
        party: 'NDF',
        votes: 4173185,
        percentage: 40.15,
        color: '#4CAF50',
        isWinner: false
      },
      {
        id: '3',
        name: 'Other Candidates',
        party: 'Various',
        votes: 204138,
        percentage: 1.97,
        color: '#9E9E9E',
        isWinner: false
      }
    ],
    turnoutTrend: [
      { year: 2005, percentage: 73.7 },
      { year: 2010, percentage: 74.5 }
    ],
    electionFact: 'This election was held soon after the end of the civil war, with security and post-war reconstruction as key issues.'
  },
  2005: {
    year: 2005,
    name: '2005 Presidential Election',
    winningCandidate: 'Mahinda Rajapaksa',
    winningParty: 'United People\'s Freedom Alliance',
    turnoutPercentage: 73.7,
    candidates: [
      {
        id: '1',
        name: 'Mahinda Rajapaksa',
        party: 'UPFA',
        votes: 4887152,
        percentage: 50.29,
        color: '#E51C23',
        isWinner: true
      },
      {
        id: '2',
        name: 'Ranil Wickremesinghe',
        party: 'UNP',
        votes: 4706366,
        percentage: 48.43,
        color: '#4CAF50',
        isWinner: false
      },
      {
        id: '3',
        name: 'Other Candidates',
        party: 'Various',
        votes: 124632,
        percentage: 1.28,
        color: '#9E9E9E',
        isWinner: false
      }
    ],
    turnoutTrend: [
      { year: 2000, percentage: 70.1 },
      { year: 2005, percentage: 73.7 }
    ],
    electionFact: 'This election was one of the closest in Sri Lankan history with less than a 2% margin between the top two candidates.'
  }
};

const PastElectionsScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2020);
  const [activeTab, setActiveTab] = useState('Results');
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setElectionData(mockElectionData[selectedYear]);
      setLoading(false);
    };
    
    fetchData();
  }, [selectedYear]);
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleShareFact = async () => {
    if (!electionData) return;
    
    try {
      await Share.share({
        message: `${electionData.electionFact} #PollTrack #SriLankanElections`,
      });
    } catch (error) {
      console.error('Error sharing fact:', error);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={handleGoBack} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Past Elections</Text>
      </View>
      
      {/* Year Selector */}
      <ElectionYearSelector 
        years={[2020, 2015, 2010, 2005]}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
      />
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : electionData ? (
        <>
          {/* Election Name */}
          <View className="p-4">
            <Text className="text-xl font-bold text-gray-900">{electionData.name}</Text>
          </View>
          
          {/* Tabs */}
          <ElectionTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <ScrollView className="flex-1 p-4">
            {activeTab === 'Overview' && (
              <Animated.View entering={FadeIn.duration(400)}>
                <ElectionSummary 
                  electionName={electionData.name}
                  winningCandidate={electionData.winningCandidate}
                  winningParty={electionData.winningParty}
                  turnoutPercentage={electionData.turnoutPercentage}
                />
                <TurnoutChart data={electionData.turnoutTrend} />
                <ElectionFactCard 
                  fact={electionData.electionFact}
                  onShare={handleShareFact}
                />
              </Animated.View>
            )}
            
            {activeTab === 'Results' && (
              <Animated.View entering={FadeIn.duration(400)}>
                <Text className="font-bold text-gray-800 mb-3">Results by Candidates</Text>
                {electionData.candidates.map((candidate) => (
                  <CandidateResultCard 
                    key={candidate.id}
                    name={candidate.name}
                    party={candidate.party}
                    image={candidate.image}
                    votes={candidate.votes}
                    percentage={candidate.percentage}
                    color={candidate.color}
                    isWinner={candidate.isWinner}
                  />
                ))}
                <ElectionFactCard 
                  fact={electionData.electionFact}
                  onShare={handleShareFact}
                />
              </Animated.View>
            )}
            
            {activeTab === 'Turnout' && (
              <Animated.View entering={FadeIn.duration(400)}>
                <View className="bg-white rounded-lg p-4 mb-4">
                  <Text className="font-bold text-gray-800 mb-3">Voter Turnout</Text>
                  <View className="items-center mb-4">
                    <Text className="text-4xl font-bold text-blue-600">
                      {electionData.turnoutPercentage.toFixed(1)}%
                    </Text>
                    <Text className="text-gray-500">of registered voters participated</Text>
                  </View>
                </View>
                <TurnoutChart data={electionData.turnoutTrend} />
                <ElectionFactCard 
                  fact={electionData.electionFact}
                  onShare={handleShareFact}
                />
              </Animated.View>
            )}
            
            {activeTab === 'Insights' && (
              <Animated.View entering={FadeIn.duration(400)}>
                <Text className="font-bold text-gray-800 mb-3">Election Insights</Text>
                <ElectionFactCard 
                  fact={electionData.electionFact}
                  onShare={handleShareFact}
                />
                <View className="bg-white rounded-lg p-4 mb-4">
                  <Text className="font-bold text-gray-800 mb-2">Key Takeaways</Text>
                  <View className="flex-row items-center mb-2">
                    <View className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
                    <Text className="text-gray-800">
                      {electionData.winningCandidate} won with a {
                        electionData.candidates[0].percentage - electionData.candidates[1].percentage > 10 
                          ? 'significant' 
                          : 'narrow'
                      } margin of {(electionData.candidates[0].percentage - electionData.candidates[1].percentage).toFixed(1)}%.
                    </Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <View className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
                    <Text className="text-gray-800">
                      Voter turnout was {
                        electionData.turnoutPercentage > 80 
                          ? 'exceptionally high' 
                          : electionData.turnoutPercentage > 70 
                            ? 'relatively high'
                            : 'moderate'
                      } at {electionData.turnoutPercentage.toFixed(1)}%.
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500">Failed to load election data</Text>
        </View>
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#1D4ED8',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 6
        }}
      >
        <Ionicons name="share-social-outline" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PastElectionsScreen;