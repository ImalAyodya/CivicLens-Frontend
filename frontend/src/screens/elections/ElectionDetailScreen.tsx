import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Share
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Election, Candidate, ElectionFactType } from '../../types/election';  // Changed ElectionFact to ElectionFactType
import { electionService } from '../../services/electionService';
import CandidateCard from '../../components/elections/CandidateCard';
import ElectionFact from '../../components/elections/ElectionFact';
import CountdownTimer from '../../components/elections/CountdownTimer';

type Props = NativeStackScreenProps<RootStackParamList, 'ElectionDetail'>;

const ElectionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { electionId } = route.params;
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  
  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        setLoading(true);
        const data = await electionService.getElectionById(electionId);
        setElection(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load election details');
        setLoading(false);
        console.error('Error fetching election details:', err);
      }
    };
    
    fetchElectionDetails();
  }, [electionId]);

  const handleShare = async () => {
    if (!election) return;
    
    try {
      await Share.share({
        message: `Check out the ${election.title} on CivicLens!`,
        url: `https://civiclens.org/elections/${electionId}`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderCandidateItem = ({ item }: { item: Candidate }) => (
    <CandidateCard 
      candidate={item} 
      onPress={() => navigation.navigate('PoliticianProfile', { politicianId: item.id })}
    />
  );

  const renderFactItem = ({ item }: { item: ElectionFactType }) => (  // Changed ElectionFact to ElectionFactType
    <ElectionFact fact={item} />
  );

  const renderResultsChart = () => {
    if (!election?.results || election.results.length === 0) {
      return (
        <View className="items-center justify-center py-8">
          <Text className="text-gray-500">Results are not available yet</Text>
        </View>
      );
    }

    const chartData = election.results.map((result) => ({
      name: result.candidateName,
      votes: result.votes,
      color: result.color || '#' + Math.floor(Math.random()*16777215).toString(16),
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));

    return (
      <View className="items-center mt-4 mb-8">
        <PieChart
          data={chartData}
          width={width - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="votes"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
        
        <View className="w-full mt-8">
          {election.results.map((result, index) => (
            <View key={index} className="flex-row justify-between items-center mb-4 px-2">
              <View className="flex-row items-center flex-1">
                <View 
                  style={{ backgroundColor: result.color || '#ccc', width: 12, height: 12, borderRadius: 6 }} 
                  className="mr-3"
                />
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-800">{result.candidateName}</Text>
                  <Text className="text-sm text-gray-500">{result.party}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-base font-bold text-gray-900">{result.percentage.toFixed(2)}%</Text>
                <Text className="text-sm text-gray-600">{result.votes.toLocaleString()} votes</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error || !election) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-lg mb-4">{error || 'Election not found'}</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate time remaining for upcoming elections
  const isUpcoming = election.status === 'upcoming';
  const electionDate = new Date(election.date);
  
  return (
    <View className="flex-1 bg-white">
      {/* Animated Header */}
      <Animated.View 
        style={{ opacity: headerOpacity }}
        className="absolute top-0 left-0 right-0 z-10 bg-white shadow-md pt-12 pb-2 px-4"
      >
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
            {election.title}
          </Text>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View className="relative">
          <Image
            source={
              election.imageUrl 
                ? { uri: election.imageUrl } 
                : require('../../../assets/parliament.png')
            }
            className="w-full h-72"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black bg-opacity-30" />
          
          {/* Back button and share */}
          <View className="absolute top-12 left-0 right-0 flex-row justify-between items-center px-4">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Election status badge */}
          <View className="absolute top-28 left-4">
            <View 
              className={`px-3 py-1 rounded-full ${
                election.status === 'upcoming' 
                  ? 'bg-blue-500' 
                  : election.status === 'ongoing' 
                  ? 'bg-green-500' 
                  : 'bg-gray-500'
              }`}
            >
              <Text className="text-white font-medium capitalize text-xs">
                {election.status}
              </Text>
            </View>
          </View>
          
          {/* Election title */}
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <Text className="text-white text-2xl font-bold mb-2">{election.title}</Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text className="text-white ml-1">{election.date}</Text>
              {election.location && (
                <>
                  <Ionicons name="location-outline" size={16} color="white" className="ml-4" />
                  <Text className="text-white ml-1">{election.location}</Text>
                </>
              )}
            </View>
          </View>
        </View>
        
        {/* Countdown for upcoming elections */}
        {isUpcoming && (
          <View className="bg-blue-50 mx-4 my-4 p-4 rounded-xl">
            <Text className="text-blue-800 text-lg font-bold mb-2 text-center">Time Remaining</Text>
            <CountdownTimer targetDate={electionDate} />
          </View>
        )}
        
        {/* Tab Navigation */}
        <View className="flex-row border-b border-gray-200 mx-4">
          <TouchableOpacity 
            className={`py-3 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-600' : ''}`}
            onPress={() => setActiveTab('overview')}
          >
            <Text 
              className={activeTab === 'overview' ? 'text-blue-600 font-medium' : 'text-gray-600'}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`py-3 px-4 ${activeTab === 'candidates' ? 'border-b-2 border-blue-600' : ''}`}
            onPress={() => setActiveTab('candidates')}
          >
            <Text 
              className={activeTab === 'candidates' ? 'text-blue-600 font-medium' : 'text-gray-600'}
            >
              Candidates
            </Text>
          </TouchableOpacity>
          {election.status === 'completed' && (
            <TouchableOpacity 
              className={`py-3 px-4 ${activeTab === 'results' ? 'border-b-2 border-blue-600' : ''}`}
              onPress={() => setActiveTab('results')}
            >
              <Text 
                className={activeTab === 'results' ? 'text-blue-600 font-medium' : 'text-gray-600'}
              >
                Results
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            className={`py-3 px-4 ${activeTab === 'facts' ? 'border-b-2 border-blue-600' : ''}`}
            onPress={() => setActiveTab('facts')}
          >
            <Text 
              className={activeTab === 'facts' ? 'text-blue-600 font-medium' : 'text-gray-600'}
            >
              Facts
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <View className="p-4 mb-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <View>
              <Text className="text-lg font-bold text-gray-900 mb-4">About This Election</Text>
              <Text className="text-base text-gray-700 mb-6">{election.description}</Text>
              
              {/* Election stats */}
              <View className="bg-gray-50 rounded-xl p-4 mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-4">Election Stats</Text>
                
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-600">Type</Text>
                  <Text className="font-medium text-gray-800 capitalize">{election.type}</Text>
                </View>
                
                {election.totalRegisteredVoters && (
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-600">Registered Voters</Text>
                    <Text className="font-medium text-gray-800">
                      {election.totalRegisteredVoters.toLocaleString()}
                    </Text>
                  </View>
                )}
                
                {election.votingCenters && (
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-gray-600">Voting Centers</Text>
                    <Text className="font-medium text-gray-800">
                      {election.votingCenters.toLocaleString()}
                    </Text>
                  </View>
                )}
                
                {election.status === 'completed' && election.turnout && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Voter Turnout</Text>
                    <Text className="font-medium text-gray-800">{election.turnout}%</Text>
                  </View>
                )}
              </View>
              
              {/* Candidates preview */}
              <View className="mb-6">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-gray-900">Candidates</Text>
                  <TouchableOpacity onPress={() => setActiveTab('candidates')}>
                    <Text className="text-blue-600">See All</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={election.candidates.slice(0, 3)}
                  renderItem={renderCandidateItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  contentContainerStyle={{ paddingRight: 16 }}
                />
              </View>
              
              {/* Election facts preview */}
              <View>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-gray-900">Election Facts</Text>
                  <TouchableOpacity onPress={() => setActiveTab('facts')}>
                    <Text className="text-blue-600">See All</Text>
                  </TouchableOpacity>
                </View>
                
                {election.electionFacts && election.electionFacts.length > 0 ? (
                  <ElectionFact fact={election.electionFacts[0]} />
                ) : (
                  <Text className="text-gray-500 italic">No election facts available</Text>
                )}
              </View>
            </View>
          )}
          
          {/* Candidates Tab */}
          {activeTab === 'candidates' && (
            <View>
              <Text className="text-lg font-bold text-gray-900 mb-4">Candidates</Text>
              
              {election.candidates.length > 0 ? (
                election.candidates.map((candidate) => (
                  <View key={candidate.id} className="mb-4">
                    <CandidateCard 
                      candidate={candidate} 
                      onPress={() => navigation.navigate('PoliticianProfile', { politicianId: candidate.id })}
                      expanded
                    />
                  </View>
                ))
              ) : (
                <Text className="text-gray-500 italic">No candidates available yet</Text>
              )}
            </View>
          )}
          
          {/* Results Tab */}
          {activeTab === 'results' && (
            <View>
              <Text className="text-lg font-bold text-gray-900 mb-4">Election Results</Text>
              
              {election.status === 'completed' ? (
                <>
                  <View className="bg-gray-50 rounded-xl p-4 mb-6">
                    <View className="flex-row justify-between mb-3">
                      <Text className="text-gray-600">Total Votes</Text>
                      <Text className="font-medium text-gray-800">
                        {election.results?.reduce((sum, result) => sum + result.votes, 0).toLocaleString() || 'N/A'}
                      </Text>
                    </View>
                    <View className="flex-row justify-between mb-3">
                      <Text className="text-gray-600">Voter Turnout</Text>
                      <Text className="font-medium text-gray-800">{election.turnout}%</Text>
                    </View>
                    {election.totalRegisteredVoters && (
                      <View className="flex-row justify-between">
                        <Text className="text-gray-600">Registered Voters</Text>
                        <Text className="font-medium text-gray-800">
                          {election.totalRegisteredVoters.toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {renderResultsChart()}
                </>
              ) : (
                <View className="items-center justify-center py-8">
                  <Ionicons name="timer-outline" size={48} color="#CBD5E1" />
                  <Text className="text-gray-500 mt-4">
                    Results will be available after the election is completed
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {/* Facts Tab */}
          {activeTab === 'facts' && (
            <View>
              <Text className="text-lg font-bold text-gray-900 mb-4">Election Facts</Text>
              
              {election.electionFacts && election.electionFacts.length > 0 ? (
                election.electionFacts.map((fact) => (
                  <View key={fact.id} className="mb-4">
                    <ElectionFact fact={fact} />
                  </View>
                ))
              ) : (
                <View className="items-center justify-center py-8">
                  <Ionicons name="information-circle-outline" size={48} color="#CBD5E1" />
                  <Text className="text-gray-500 mt-4">No election facts available yet</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ElectionDetailScreen;