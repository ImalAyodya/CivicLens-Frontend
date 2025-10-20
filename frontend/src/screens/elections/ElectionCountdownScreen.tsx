import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  StatusBar,
  Share,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import CountdownTimer from '../../components/elections/CountdownTimer';
import ElectionFact from '../../components/elections/ElectionFact';
import CandidateCard from '../../components/elections/CandidateCard';
import VoterTurnoutChart from '../../components/elections/VoterTurnoutChart';
import VoteDistributionChart from '../../components/elections/VoteDistributionChart';
import { useElectionData } from '../../hooks/useElectionData';
import Animated, { FadeIn } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'ElectionCountdown'>;

const ElectionCountdownScreen: React.FC<Props> = ({ navigation }) => {
  const { 
    electionData, 
    timeRemaining, 
    loading, 
    error 
  } = useElectionData();
  
  useEffect(() => {
    // Set custom status bar style
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSharePress = async () => {
    try {
      if (!electionData) return;
      
      await Share.share({
        message: `${electionData.electionName} is coming up in ${timeRemaining.days} days! Track it on PollTrack.`,
        title: 'Election Countdown'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareFactPress = async () => {
    try {
      if (!electionData?.electionFacts[0]) return;
      
      await Share.share({
        message: electionData.electionFacts[0].content,
        title: 'Election Fact'
      });
    } catch (error) {
      console.error('Error sharing fact:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading election data...</Text>
      </View>
    );
  }

  if (error || !electionData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'Failed to load election data. Please try again later.'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="bg-blue-600 pt-10 pb-3">
        <View className="flex-row justify-between items-center px-4">
          <TouchableOpacity onPress={handleBackPress} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text className="text-white font-bold text-lg">Election Tracker</Text>
          
          <View className="flex-row">
            <TouchableOpacity onPress={handleSharePress} className="p-2">
              <Ionicons name="share-outline" size={22} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity className="p-2">
              <Ionicons name="ellipsis-vertical" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Election Day Countdown */}
        <Animated.View 
          entering={FadeIn.duration(600)} 
          className="px-4 pt-3"
        >
          <Text className="text-center text-white font-medium text-base mb-2">
            <Ionicons name="calendar-outline" size={16} /> Election Day Countdown
          </Text>
          
          <CountdownTimer 
            days={timeRemaining.days}
            hours={timeRemaining.hours}
            minutes={timeRemaining.minutes}
            seconds={timeRemaining.seconds}
          />
          
          <Text className="text-center text-blue-100 text-sm mt-2 mb-1">
            {electionData.electionName}
          </Text>
        </Animated.View>
      </View>
      
      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity className="flex-1 py-3 px-4 items-center border-b-2 border-blue-600">
          <Text className="text-blue-600 font-medium">Candidates</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 py-3 px-4 items-center">
          <Text className="text-gray-500">Past</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-1 py-3 px-4 items-center">
          <Text className="text-gray-500">Elections</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Election Fact */}
        <ElectionFact 
          fact={electionData.electionFacts[0].content}
          onShare={handleShareFactPress}
        />
        
        {/* Candidates Section */}
        <View className="mb-4">
          <Text className="font-bold text-gray-800 mb-3">Candidates</Text>
          
          {electionData.candidates.map(candidate => (
            <Animated.View 
              key={candidate.id} 
              entering={FadeIn.delay(300).duration(600)}
            >
              <CandidateCard candidate={candidate} />
            </Animated.View>
          ))}
        </View>
        
        {/* Voter Turnout */}
        <Animated.View entering={FadeIn.delay(500).duration(600)}>
          <VoterTurnoutChart data={electionData.voterTurnout} />
        </Animated.View>
        
        {/* Vote Distribution */}
        <Animated.View entering={FadeIn.delay(700).duration(600)}>
          <VoteDistributionChart data={electionData.voteDistribution} />
        </Animated.View>
        
        {/* AI Election Trends Button */}
        <TouchableOpacity 
          className="bg-blue-100 rounded-lg p-4 mb-4 flex-row items-center"
          onPress={() => {
            const id = electionData.id;
            if (!id) return;
            navigation.navigate('ElectionPredictions', { electionId: id });
          }}
        >
          <Ionicons name="analytics-outline" size={24} color="#2563EB" />
          <View className="ml-3">
            <Text className="text-blue-800 font-bold">AI Election Trends</Text>
            <Text className="text-blue-600 text-xs">See voting predictions and analysis</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2563EB" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={styles.fabShadow}
      >
        <Ionicons name="share-social-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabShadow: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  candidatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  factsContainer: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ElectionCountdownScreen;