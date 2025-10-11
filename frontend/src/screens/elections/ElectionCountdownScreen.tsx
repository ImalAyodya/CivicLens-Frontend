import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  StatusBar,
  Share,
  StyleSheet,
  Image
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

// Banner image for election
const ELECTION_BANNER = require('../../../assets/election-banner.png');

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Election Tracker</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleSharePress} style={styles.actionButton}>
              <Ionicons name="share-outline" size={22} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="ellipsis-vertical" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Election Banner */}
        <Image 
          source={ELECTION_BANNER}
          style={styles.headerBanner}
          resizeMode="cover"
        />
        
        {/* Election Day Countdown */}
        <Animated.View 
          entering={FadeIn.duration(600)} 
          style={styles.countdownContainer}
        >
          <Text style={styles.countdownTitle}>
            <Ionicons name="calendar-outline" size={16} /> Election Day Countdown
          </Text>
          
          <CountdownTimer 
            days={timeRemaining.days}
            hours={timeRemaining.hours}
            minutes={timeRemaining.minutes}
            seconds={timeRemaining.seconds}
          />
          
          <Text style={styles.electionName}>
            {electionData.electionName}
          </Text>
        </Animated.View>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Text style={styles.activeTabText}>Candidates</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Past</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Elections</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Election Fact */}
        <ElectionFact 
          fact={electionData.electionFacts[0].content}
          onShare={handleShareFactPress}
        />
        
        {/* Candidates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Candidates</Text>
          
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
        <Animated.View 
          entering={FadeIn.delay(500).duration(600)}
          style={styles.chartSection}
        >
          <VoterTurnoutChart data={electionData.voterTurnout} />
        </Animated.View>
        
        {/* Vote Distribution */}
        <Animated.View 
          entering={FadeIn.delay(700).duration(600)}
          style={styles.chartSection}
        >
          <VoteDistributionChart 
            data={electionData.voteDistribution.map(item => ({
              ...item,
              votes: item.percentage * 1000, // Estimating votes based on percentage
            }))} 
          />
        </Animated.View>
        
        {/* AI Election Trends Button */}
        <TouchableOpacity 
          style={styles.aiButton}
          onPress={() => {
            const id = electionData.id;
            if (!id) return;
            navigation.navigate('ElectionPredictions', { electionId: id });
          }}
        >
          <Ionicons name="analytics-outline" size={24} color="#2563EB" />
          <View style={styles.aiButtonContent}>
            <Text style={styles.aiButtonTitle}>AI Election Trends</Text>
            <Text style={styles.aiButtonSubtitle}>See voting predictions and analysis</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2563EB" style={styles.aiButtonIcon} />
        </TouchableOpacity>
        
        {/* Add space for FAB */}
        <View style={styles.fabSpace} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleSharePress}
      >
        <Ionicons name="share-social-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  headerBanner: {
    width: '100%',
    height: 80,
    opacity: 0.5,
  },
  countdownContainer: {
    padding: 16,
    paddingTop: 0,
  },
  countdownTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  electionName: {
    color: '#E0F2FE',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563EB',
  },
  tabText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  chartSection: {
    marginBottom: 24,
  },
  aiButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  aiButtonTitle: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  aiButtonSubtitle: {
    color: '#3B82F6',
    fontSize: 12,
  },
  aiButtonIcon: {
    marginLeft: 'auto',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabSpace: {
    height: 72,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ElectionCountdownScreen;