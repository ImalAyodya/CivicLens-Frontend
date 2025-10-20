import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Share,
  StatusBar,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { electionService } from '../../services/electionService';
import type { ElectionData } from '../../types/election';
import VoterTurnoutChart from '../../components/elections/VoterTurnoutChart';
import VoteDistributionChart from '../../components/elections/VoteDistributionChart';
import CandidateCard from '../../components/elections/CandidateCard';
import { format } from 'date-fns';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function PastElectionDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { electionId } = route.params as { electionId: string };
  
  const [election, setElection] = useState<ElectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        const data = await electionService.getElectionById(electionId);
        setElection(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching election details:', err);
        setError('Failed to load election details');
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [electionId]);

  const handleShare = async () => {
    if (!election) return;

    try {
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      await Share.share({
        message: `Check out the ${election.electionName} election results on CivicLens! ${election.electionFacts[0]?.content || ''}`,
        title: `${election.electionName} - CivicLens`,
      });
    } catch (error) {
      console.error('Error sharing election details:', error);
    }
  };

  const handleGoBack = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.goBack();
  };

  const setTabWithHaptic = (tab: string) => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Election Details</Text>
          <View style={styles.placeholderButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading election details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !election) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Election Details</Text>
          <View style={styles.placeholderButton} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#DC2626" />
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorText}>
            {error || 'Failed to load election details. Please try again later.'}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              setError(null);
              // Re-fetch the election details
              electionService.getElectionById(electionId)
                .then(data => {
                  setElection(data);
                  setLoading(false);
                })
                .catch(err => {
                  console.error('Error retrying fetch:', err);
                  setError('Failed to load election details');
                  setLoading(false);
                });
            }}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const electionDate = new Date(election.electionDate);
  const winner = election.candidates.find(c => c.position === 'President');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Election Details</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
          accessibilityLabel="Share election details"
          accessibilityRole="button"
        >
          <Ionicons name="share-social-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>
      
      {/* Election Header with Gradient Background */}
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        style={styles.electionHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.electionTypeContainer}>
          <Text style={styles.electionType}>Presidential Election</Text>
        </View>
        
        <Text style={styles.electionTitleWhite}>{election.electionName}</Text>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={16} color="#E0E7FF" />
          <Text style={styles.electionDateWhite}>
            {format(electionDate, 'MMMM dd, yyyy')}
          </Text>
        </View>
        
        {winner && (
          <View style={styles.winnerBanner}>
            <MaterialCommunityIcons name="crown" size={16} color="#FCD34D" style={styles.crownIcon} />
            <Text style={styles.winnerText}>
              Won by <Text style={styles.winnerName}>{winner.name}</Text> ({winner.party})
            </Text>
          </View>
        )}
      </LinearGradient>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Overview' && styles.activeTabButton]}
          onPress={() => setTabWithHaptic('Overview')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'Overview' }}
        >
          <Text style={[styles.tabText, activeTab === 'Overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Candidates' && styles.activeTabButton]}
          onPress={() => setTabWithHaptic('Candidates')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'Candidates' }}
        >
          <Text style={[styles.tabText, activeTab === 'Candidates' && styles.activeTabText]}>Candidates</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Results' && styles.activeTabButton]}
          onPress={() => setTabWithHaptic('Results')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'Results' }}
        >
          <Text style={[styles.tabText, activeTab === 'Results' && styles.activeTabText]}>Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Facts' && styles.activeTabButton]}
          onPress={() => setTabWithHaptic('Facts')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'Facts' }}
        >
          <Text style={[styles.tabText, activeTab === 'Facts' && styles.activeTabText]}>Facts</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {activeTab === 'Overview' && (
          <Animated.View entering={FadeInUp.duration(300)}>
            {/* Quick stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{election.candidates.length}</Text>
                <Text style={styles.statLabel}>Candidates</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {election.voterTurnout?.[election.voterTurnout.length - 1]?.percentage.toFixed(1) || 'N/A'}%
                </Text>
                <Text style={styles.statLabel}>Voter Turnout</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{election.voteDistribution?.length || 0}</Text>
                <Text style={styles.statLabel}>Parties</Text>
              </View>
            </View>
            
            {/* Winner section */}
            {winner && (
              <View style={styles.winnerCard}>
                <View style={styles.winnerHeader}>
                  <MaterialCommunityIcons name="crown" size={20} color="#FCD34D" />
                  <Text style={styles.winnerHeaderText}>Election Winner</Text>
                </View>
                <View style={styles.winnerContent}>
                  {winner.imageUrl ? (
                    <Image 
                      source={{ uri: winner.imageUrl }} 
                      style={styles.winnerImage} 
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.winnerImage, styles.winnerImagePlaceholder]}>
                      <MaterialCommunityIcons name="account" size={50} color="#CBD5E0" />
                    </View>
                  )}
                  <View style={styles.winnerInfo}>
                    <Text style={styles.winnerInfoName}>{winner.name}</Text>
                    <View style={styles.partyContainer}>
                      <View style={[styles.partyDot, { backgroundColor: getPartyColor(winner.party) }]} />
                      <Text style={styles.winnerInfoParty}>{winner.party}</Text>
                    </View>
                    <Text style={styles.winnerInfoPosition}>{winner.position}</Text>
                    {winner.promiseFulfillment !== undefined && (
                      <View style={styles.promiseContainer}>
                        <Text style={styles.promiseLabel}>Promise Fulfillment:</Text>
                        <View style={styles.promiseBarContainer}>
                          <View 
                            style={[styles.promiseBar, { width: `${winner.promiseFulfillment}%` }]} 
                          />
                        </View>
                        <Text style={styles.promisePercentage}>{winner.promiseFulfillment}%</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
            
            {/* Vote Distribution */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Vote Distribution</Text>
              <VoteDistributionChart data={election.voteDistribution} />
            </View>
            
            {/* Voter Turnout */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Voter Turnout Trend</Text>
              <VoterTurnoutChart data={election.voterTurnout} />
              <View style={styles.turnoutContext}>
                <Ionicons name="information-circle-outline" size={16} color="#4A5568" />
                <Text style={styles.turnoutContextText}>
                  Voter turnout was {
                    election.voterTurnout[election.voterTurnout.length - 1].percentage > 80 ? 'exceptionally high' : 
                    election.voterTurnout[election.voterTurnout.length - 1].percentage > 70 ? 'above average' : 
                    election.voterTurnout[election.voterTurnout.length - 1].percentage > 60 ? 'average' : 'below average'
                  } at {election.voterTurnout[election.voterTurnout.length - 1].percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
            
            {/* Election Fact */}
            {election.electionFacts.length > 0 && (
              <View style={styles.factHighlightCard}>
                <View style={styles.factHighlightHeader}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#FCD34D" />
                  <Text style={styles.factHighlightTitle}>Key Election Fact</Text>
                </View>
                <Text style={styles.factHighlightContent}>
                  {election.electionFacts[0].content}
                </Text>
                <TouchableOpacity 
                  style={styles.shareFactButton}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    Share.share({
                      message: `${election.electionFacts[0].content} #CivicLens #SriLankanElections`,
                    });
                  }}
                >
                  <Text style={styles.shareFactText}>Share this fact</Text>
                  <Ionicons name="share-social-outline" size={18} color="#3182CE" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}
        
        {activeTab === 'Candidates' && (
          <Animated.View entering={FadeInUp.duration(300)}>
            <Text style={styles.sectionDescription}>
              This election featured {election.candidates.length} candidates from various political parties.
            </Text>
            
            {/* Candidates */}
            <View style={styles.candidatesGrid}>
              {election.candidates.map((candidate, index) => (
                <Animated.View 
                  key={candidate.id}
                  entering={FadeInDown.delay(index * 100)}
                  style={styles.candidateCardWrapper}
                >
                  <CandidateCard candidate={candidate} />
                </Animated.View>
              ))}
            </View>
            
            <View style={styles.candidateDisclaimer}>
              <Ionicons name="information-circle" size={16} color="#718096" />
              <Text style={styles.candidateDisclaimerText}>
                Promise fulfillment data is based on independent analysis of public records and media reports.
              </Text>
            </View>
          </Animated.View>
        )}
        
        {activeTab === 'Results' && (
          <Animated.View entering={FadeInUp.duration(300)}>
            {/* Top 3 Candidates Results */}
            <View style={styles.resultsTopContainer}>
              {election.candidates.slice(0, 3).map((candidate, index) => {
                const voteData = election.voteDistribution.find(v => v.party === candidate.party);
                const percentage = voteData ? voteData.percentage : 0;
                
                return (
                  <View key={candidate.id} style={styles.resultItem}>
                    <View style={styles.positionBadge}>
                      <Text style={styles.positionText}>{index + 1}</Text>
                    </View>
                    
                    {candidate.imageUrl ? (
                      <Image 
                        source={{ uri: candidate.imageUrl }} 
                        style={styles.resultCandidateImage} 
                      />
                    ) : (
                      <View style={styles.resultCandidateImagePlaceholder}>
                        <Text style={styles.candidateInitials}>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </View>
                    )}
                    
                    <Text style={styles.resultCandidateName} numberOfLines={1}>
                      {candidate.name}
                    </Text>
                    
                    <View style={[styles.resultPartyBadge, {backgroundColor: getPartyColor(candidate.party)}]}>
                      <Text style={styles.resultPartyText}>{candidate.party}</Text>
                    </View>
                    
                    <Text style={styles.resultPercentage}>{percentage.toFixed(1)}%</Text>
                    
                    <View style={styles.resultBarContainer}>
                      <View 
                        style={[
                          styles.resultBar, 
                          {
                            width: `${percentage}%`,
                            backgroundColor: getPartyColor(candidate.party)
                          }
                        ]} 
                      />
                    </View>
                  </View>
                );
              })}
            </View>
            
            <View style={styles.divider} />
            
            {/* Detailed Vote Distribution */}
            <Text style={styles.subSectionTitle}>Complete Vote Distribution</Text>
            <View style={styles.voteDistributionCard}>
              <VoteDistributionChart data={election.voteDistribution} />
            </View>
            
            {/* Provincial Results */}
            {election.provinces && election.provinces.length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Provincial Results</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.provincesScrollView}
                  contentContainerStyle={styles.provincesContainer}
                >
                  {election.provinces.map(province => (
                    <View key={province.name} style={styles.provinceCard}>
                      <Text style={styles.provinceName}>{province.name}</Text>
                      <View style={styles.provinceLeadingParty}>
                        <Text style={styles.provinceLeadingLabel}>Leading Party:</Text>
                        <View style={[
                          styles.provinceLeadingBadge,
                          {backgroundColor: getPartyColor(province.leadingParty || '')}
                        ]}>
                          <Text style={styles.provinceLeadingText}>
                            {province.leadingParty || 'Unknown'}
                          </Text>
                        </View>
                      </View>
                      
                      {province.results.map((result, index) => (
                        <View key={result.party} style={styles.provinceResultItem}>
                          <View style={styles.provinceResultParty}>
                            <View style={[
                              styles.provincePartyDot, 
                              {backgroundColor: getPartyColor(result.party)}
                            ]} />
                            <Text style={styles.provincePartyName}>{result.party}</Text>
                          </View>
                          <Text style={styles.provinceVotePercentage}>{result.percentage.toFixed(1)}%</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </ScrollView>
              </>
            )}
          </Animated.View>
        )}
        
        {activeTab === 'Facts' && (
          <Animated.View entering={FadeInUp.duration(300)}>
            <Text style={styles.sectionDescription}>
              Interesting facts about the {election.electionName}.
            </Text>
            
            {/* Election Facts */}
            {election.electionFacts.map((fact, index) => (
              <Animated.View 
                key={fact.id || index} 
                entering={FadeInDown.delay(index * 100)}
                style={styles.enhancedFactCard}
              >
                <View style={styles.factCardHeader}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#FCD34D" />
                  <Text style={styles.factCardTitle}>Election Fact #{index + 1}</Text>
                </View>
                <Text style={styles.factCardContent}>{fact.content}</Text>
                <TouchableOpacity 
                  style={styles.shareFactButton}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    Share.share({
                      message: `${fact.content} #CivicLens #SriLankanElections`,
                    });
                  }}
                >
                  <Text style={styles.shareFactText}>Share this fact</Text>
                  <Ionicons name="share-social-outline" size={18} color="#3182CE" />
                </TouchableOpacity>
              </Animated.View>
            ))}
            
            {election.electionFacts.length === 0 && (
              <View style={styles.noFactsContainer}>
                <MaterialCommunityIcons name="information-variant" size={50} color="#CBD5E0" />
                <Text style={styles.noFactsText}>No additional facts available for this election.</Text>
              </View>
            )}
            
            <View style={styles.factSourceContainer}>
              <Text style={styles.factSourceText}>
                Facts sourced from the Election Commission of Sri Lanka and verified historical records.
              </Text>
            </View>
          </Animated.View>
        )}
        
        {/* Add space at the bottom */}
        <View style={styles.spacing} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={styles.fab}
          onPress={handleShare}
          activeOpacity={0.8}
          accessibilityLabel="Share election details"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="share-social" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper function to get a color based on party name
const getPartyColor = (party: string): string => {
  const colors: Record<string, string> = {
    'UNP': '#0066CC',
    'SLPP': '#E51C23',
    'SJB': '#00CC66',
    'NPP': '#CC0000',
    'UPFA': '#1B75BB',
    'NDF': '#4CAF50',
    'JVP': '#FF9800'
  };
  
  return colors[party] || '#A0AEC0';
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  shareButton: {
    padding: 8,
    borderRadius: 8,
  },
  placeholderButton: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  electionHeader: {
    padding: 20,
    paddingBottom: 24,
  },
  electionTypeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  electionType: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  electionTitleWhite: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  electionDateWhite: {
    fontSize: 16,
    color: '#E0E7FF',
    marginLeft: 6,
  },
  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  crownIcon: {
    marginRight: 6,
  },
  winnerText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  winnerName: {
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
  },
  winnerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    marginTop: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  winnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  winnerHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  winnerContent: {
    flexDirection: 'row',
    padding: 16,
  },
  winnerImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  winnerImagePlaceholder: {
    backgroundColor: '#EDF2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  winnerInfoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  partyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  winnerInfoParty: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '600',
  },
  winnerInfoPosition: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 10,
  },
  promiseContainer: {
    marginTop: 4,
  },
  promiseLabel: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 4,
  },
  promiseBarContainer: {
    height: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 4,
    marginBottom: 4,
    width: '100%',
  },
  promiseBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  promisePercentage: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 16,
  },
  turnoutContext: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  turnoutContextText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2C5282',
    flex: 1,
  },
  factHighlightCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  factHighlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factHighlightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginLeft: 8,
  },
  factHighlightContent: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },
  shareFactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  shareFactText: {
    fontSize: 14,
    color: '#3182CE',
    marginRight: 6,
    fontWeight: '500',
  },
  sectionDescription: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  candidatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  candidateCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  candidateDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 16,
    marginTop: 8,
  },
  candidateDisclaimerText: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 8,
    flex: 1,
  },
  resultsTopContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  resultItem: {
    marginBottom: 16,
  },
  positionBadge: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3182CE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resultCandidateImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  resultCandidateImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  candidateInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#718096',
  },
  resultCandidateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  resultPartyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  resultPartyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resultPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  resultBarContainer: {
    height: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  resultBar: {
    height: '100%',
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  subSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3748',
    marginLeft: 16,
    marginBottom: 12,
  },
  voteDistributionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  provincesScrollView: {
    marginTop: 8,
  },
  provincesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  provinceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: width * 0.75,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  provinceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  provinceLeadingParty: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  provinceLeadingLabel: {
    fontSize: 14,
    color: '#718096',
    marginRight: 8,
  },
  provinceLeadingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  provinceLeadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  provinceResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  provinceResultParty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  provincePartyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  provincePartyName: {
    fontSize: 14,
    color: '#4A5568',
  },
  provinceVotePercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  enhancedFactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  factCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  factCardContent: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
  },
  noFactsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  noFactsText: {
    fontSize: 16,
    color: '#718096',
    marginTop: 16,
    textAlign: 'center',
  },
  factSourceContainer: {
    padding: 16,
  },
  factSourceText: {
    fontSize: 13,
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4A5568',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E53E3E',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3182CE',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#1A365D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    height: 80,
  },
});