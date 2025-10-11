import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
  StatusBar,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import ElectionYearSelector from '../../components/elections/pastElections/ElectionYearSelector';
import CandidateResultCard from '../../components/elections/pastElections/CandidateResultCard';
import TurnoutChart from '../../components/elections/pastElections/TurnoutChart';
import ElectionFactCard from '../../components/elections/pastElections/ElectionFactCard';
import { ElectionTabs, ElectionSummary } from '../../components/elections/pastElections/ElectionResults';
import Animated, { FadeIn } from 'react-native-reanimated';
import { usePastElections } from '../../hooks/usePastElections';
import { electionService } from '../../services/electionService';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { ElectionData } from '../../types/election';
import BlueHeader from '../../components/BlueHeader';
import CandidateImage from '../../components/elections/CandidateImage';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'PastElections'>;

// Local interface that extends the imported type to include additional fields
// needed specifically for this component
interface LocalElectionData {
  id: string;
  year?: number;
  name?: string;
  title?: string;
  electionType?: string;
  date?: string;
  electionName?: string;
  electionDate?: Date | string;
  winningCandidate?: string;
  winningParty?: string;
  turnoutPercentage?: number;
  voterTurnout?: number;
  candidates: Array<{
    id?: string;
    _id?: string;
    name: string;
    party: string;
    imageUrl?: string;
    image?: string;
    votes?: number;
    percentage?: number;
    color?: string;
    isWinner?: boolean;
  }>;
  turnoutTrend?: Array<{ year: number; percentage: number }>;
  facts?: Array<{ text: string; category?: string }>;
  electionFact?: string;
  provinces?: Array<{
    name: string;
    leadingParty?: string;
    results: Array<{
      party: string;
      votes: number;
      percentage: number;
    }>;
  }>;
}

const PastElectionsScreen: React.FC<Props> = ({ navigation }) => {
  // Correct hook destructuring
  const { elections: pastElections, loading: apiLoading, error: apiError } = usePastElections();
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('Results');
  const [electionData, setElectionData] = useState<LocalElectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Extract years from available elections on component mount
  useEffect(() => {
    if (pastElections && pastElections.length > 0) {
      // Extract years from pastElections dates, safely handling undefined values
      const extractedYears = pastElections.map((election: ElectionData) => {
        const dateString = election.electionDate;
        if (!dateString) return new Date().getFullYear(); // Fallback to current year
        return new Date(dateString).getFullYear();
      });
      
      // Remove duplicates and sort in descending order
      const uniqueYears = Array.from(new Set(extractedYears)).sort((a, b) => b - a) as number[];
      
      setYears(uniqueYears);
      
      // Set the most recent year as selected
      if (uniqueYears.length > 0 && !selectedYear) {
        setSelectedYear(uniqueYears[0] as number);
      }
    }
  }, [pastElections]);
  
  // Fetch specific election data when year changes
  useEffect(() => {
    if (!selectedYear) return;
    
    const fetchElectionByYear = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Find election from the selected year
        const yearElections = pastElections.filter((election: ElectionData) => {
          const dateString = election.electionDate;
          if (!dateString) return false;
          return new Date(dateString).getFullYear() === selectedYear;
        });
        
        if (yearElections.length > 0) {
          const electionId = yearElections[0].id;
          
          if (!electionId) {
            throw new Error('Election ID is undefined');
          }
          
          // Fetch detailed election data
          const detailedData = await electionService.getElectionById(electionId);
          
          // Process data to match the format our components expect
          const processedData: LocalElectionData = {
            ...detailedData as unknown as LocalElectionData, // Type casting to resolve compatibility issues
            year: selectedYear,
            name: detailedData.electionName || `${selectedYear} Election`,
            turnoutPercentage: typeof detailedData.voterTurnout === 'number' ? detailedData.voterTurnout : 0,
            electionFact: detailedData.electionFacts && 
                        Array.isArray(detailedData.electionFacts) && 
                        detailedData.electionFacts.length > 0 &&
                        detailedData.electionFacts[0].content ? 
                        detailedData.electionFacts[0].content : 
                        `${selectedYear} election data`,
            turnoutTrend: createTurnoutTrend(detailedData as unknown as LocalElectionData, pastElections as unknown as LocalElectionData[])
          };
          
          // Process candidates to add winner status and colors
          if (processedData.candidates && processedData.candidates.length > 0) {
            // Find candidate with most votes
            const sortedCandidates = [...processedData.candidates].sort((a, b) => 
              (b.votes || 0) - (a.votes || 0)
            );
            
            const winningCandidate = sortedCandidates[0];
            processedData.winningCandidate = winningCandidate.name;
            processedData.winningParty = winningCandidate.party;
            
            // Add isWinner flag and colors to candidates
            processedData.candidates = processedData.candidates.map((candidate, index) => ({
              ...candidate,
              id: candidate._id || candidate.id || `candidate-${index}`,
              isWinner: candidate.name === winningCandidate.name,
              color: getPartyColor(candidate.party)
            }));
          }
          
          setElectionData(processedData);
        } else {
          setError(`No election data found for ${selectedYear}`);
        }
      } catch (err) {
        console.error('Error fetching election data:', err);
        setError('Failed to load election data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchElectionByYear();
  }, [selectedYear, pastElections]);
  
  // Helper function to create turnout trend data
  const createTurnoutTrend = (currentElection: LocalElectionData, allElections: LocalElectionData[]) => {
    // Get voter turnout from current election
    const currentYear = currentElection.date ? 
      new Date(currentElection.date).getFullYear() : 
      currentElection.electionDate ? 
        new Date(currentElection.electionDate).getFullYear() : 
        selectedYear || new Date().getFullYear();

    const currentTurnout = {
      year: currentYear,
      percentage: currentElection.voterTurnout || currentElection.turnoutPercentage || 0
    };
    
    // Get turnout from past elections
    const previousTurnouts = allElections
      .filter(election => {
        const electionYear = election.date ? 
          new Date(election.date).getFullYear() : 
          election.electionDate ? 
            new Date(election.electionDate).getFullYear() : 
            0;
        return electionYear < currentTurnout.year;
      })
      .map(election => ({
        year: election.date ? 
          new Date(election.date).getFullYear() : 
          election.electionDate ? 
            new Date(election.electionDate).getFullYear() : 
            0,
        percentage: election.voterTurnout || election.turnoutPercentage || 0
      }))
      .sort((a, b) => a.year - b.year);
    
    // Combine data
    return [...previousTurnouts, currentTurnout];
  };
  
  // Helper function to assign colors to political parties
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
    
    // Return color if party exists in map, otherwise return a default color
    return colors[party] || '#CCCCCC';
  };
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const handleShareFact = async () => {
    if (!electionData || !electionData.electionFact) return;
    
    try {
      await Share.share({
        message: `${electionData.electionFact} #CivicLens #SriLankanElections`,
      });
    } catch (error) {
      console.error('Error sharing fact:', error);
    }
  };
  
  const handleElectionPress = (electionId: string) => {
    // Navigate to election details screen
    navigation.navigate('PastElectionDetails', { electionId });
  };

  const renderElectionItem = ({ item }: { item: LocalElectionData }) => {
    // Safely handle date conversion
    const dateString = item.date || item.electionDate;
    const electionDate = dateString ? new Date(dateString) : new Date();
    
    return (
      <TouchableOpacity 
        style={styles.electionCard} 
        onPress={() => item.id ? handleElectionPress(item.id) : null}
        accessibilityLabel={`${item.title || item.name || item.electionName || 'Untitled Election'}, held on ${format(electionDate, 'MMMM dd, yyyy')}`}
        accessibilityRole="button"
      >
        <View style={styles.cardContent}>
          <View style={styles.electionTypeTag}>
            <Text style={styles.electionTypeText}>Presidential</Text>
          </View>
          <Text style={styles.electionTitle}>
            {item.title || item.name || item.electionName || 'Untitled Election'}
          </Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#666" style={styles.calendarIcon} />
            <Text style={styles.electionDate}>
              {format(electionDate, 'MMMM dd, yyyy')}
            </Text>
          </View>
          
          <View style={styles.candidatesRow}>
            {item.candidates && item.candidates.slice(0, 3).map((candidate, idx) => (
              <View key={idx} style={styles.candidateThumb}>
                <CandidateImage 
                  imageUrl={candidate.imageUrl || candidate.image} 
                  size={32} 
                  borderRadius={16} 
                />
              </View>
            ))}
            {item.candidates && item.candidates.length > 3 && (
              <View style={styles.moreCandidates}>
                <Text style={styles.moreCandidatesText}>+{item.candidates.length - 3}</Text>
              </View>
            )}
          </View>
          
          {/* <View style={styles.cardFooter}>
            <View style={styles.turnoutBadge}>
              <MaterialCommunityIcons name="vote-outline" size={12} color="#4A5568" />
              <Text style={styles.turnoutText}>
                {item.voterTurnout?.toFixed(1) || item.turnoutPercentage?.toFixed(1) || "N/A"}% Turnout
              </Text>
            </View>
            <View style={styles.detailsLink}>
              <Text style={styles.detailsText}>View Details</Text>
              <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
            </View>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  if (apiLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading elections...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (apiError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={48} color="#DC2626" />
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorText}>{apiError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <BlueHeader
        title="Past Elections"
        onBack={handleGoBack}
      />
      
      {!pastElections || pastElections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="vote-outline" size={64} color="#CBD5E0" />
          <Text style={styles.emptyTitle}>No Past Elections Found</Text>
          <Text style={styles.emptySubtitle}>Check back later for updated election data</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {/* List of past elections */}
          <View style={styles.listSection}>
            <FlatList
              data={pastElections as unknown as LocalElectionData[]}
              renderItem={renderElectionItem}
              keyExtractor={(item) => item.id || Math.random().toString()}
              contentContainerStyle={styles.listContainer}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <View style={styles.sectionTitleRow}>
                    <MaterialCommunityIcons name="vote" size={20} color="#2563EB" />
                    <Text style={styles.sectionTitle}>
                      Presidential Elections
                    </Text>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    Browse Sri Lanka's historical presidential elections
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
            />
          </View>
          
          {/* Year Selector and Election Details - in separate section */}
          <View style={styles.detailsSection}>
            {/* Year Selector - Only show when we have years data */}
            {years.length > 0 && selectedYear && (
              <View style={styles.yearSelectorContainer}>
                <ElectionYearSelector 
                  years={years}
                  selectedYear={selectedYear}
                  onSelectYear={setSelectedYear}
                />
              </View>
            )}
            
            {/* Loading, Error or Election Details */}
            {loading ? (
              <View style={styles.detailsLoadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.detailsLoadingText}>
                  Loading election details...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.detailsErrorContainer}>
                <Ionicons name="alert-circle-outline" size={32} color="#DC2626" />
                <Text style={styles.detailsErrorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.retryButton} 
                  onPress={() => {
                    if (selectedYear) setSelectedYear(selectedYear);
                  }}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : electionData ? (
              <View style={styles.electionDetailsContainer}>
                {/* Election Name */}
                <View style={styles.electionHeader}>
                  <View style={styles.electionTypeContainer}>
                    <Text style={styles.electionTypeIndicator}>Presidential</Text>
                  </View>
                  <Text style={styles.electionName}>
                    {electionData.name || electionData.title || `${selectedYear} Election`}
                  </Text>
                  <View style={styles.electionDateContainer}>
                    <Ionicons name="calendar" size={16} color="#4A5568" />
                    <Text style={styles.electionDateText}>
                      {electionData.date 
                        ? format(new Date(electionData.date), 'MMMM dd, yyyy') 
                        : electionData.electionDate 
                          ? format(new Date(electionData.electionDate), 'MMMM dd, yyyy')
                          : `${selectedYear}`
                      }
                    </Text>
                  </View>
                </View>
                
                {/* Tabs */}
                <ElectionTabs 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
                
                {/* Tab Content */}
                <ScrollView 
                  style={styles.tabContentContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.tabContent}
                >
                  {activeTab === 'Overview' && (
                    <Animated.View entering={FadeIn.duration(400)} style={styles.tabSection}>
                      <ElectionSummary 
                        electionName={electionData.name || electionData.title || `${selectedYear} Election`}
                        winningCandidate={electionData.winningCandidate || 'N/A'}
                        winningParty={electionData.winningParty || 'N/A'}
                        turnoutPercentage={electionData.turnoutPercentage || electionData.voterTurnout || 0}
                      />
                      
                      {electionData.turnoutTrend && electionData.turnoutTrend.length > 0 && (
                        <View style={styles.chartContainer}>
                          <Text style={styles.chartTitle}>Voter Turnout Trends</Text>
                          <TurnoutChart data={electionData.turnoutTrend} />
                        </View>
                      )}
                      
                      <View style={styles.factCardWrapper}>
                        <ElectionFactCard 
                          fact={electionData.electionFact || 'No additional facts available for this election.'}
                          onShare={handleShareFact}
                        />
                      </View>
                    </Animated.View>
                  )}
                  
                  {activeTab === 'Results' && (
                    <Animated.View entering={FadeIn.duration(400)} style={styles.tabSection}>
                      <View style={styles.resultsSectionHeader}>
                        <MaterialCommunityIcons name="poll" size={20} color="#2D3748" />
                        <Text style={styles.resultsSectionTitle}>Results by Candidates</Text>
                      </View>
                      
                      {electionData.candidates && electionData.candidates.length > 0 ? (
                        electionData.candidates.map((candidate) => (
                          <CandidateResultCard 
                            key={candidate.id || candidate._id || Math.random().toString()}
                            name={candidate.name}
                            party={candidate.party}
                            image={candidate.imageUrl || candidate.image}
                            votes={candidate.votes || 0}
                            percentage={candidate.percentage || 0}
                            color={candidate.color || getPartyColor(candidate.party)}
                            isWinner={candidate.isWinner || false}
                          />
                        ))
                      ) : (
                        <View style={styles.noDataContainer}>
                          <MaterialCommunityIcons name="account-question" size={48} color="#A0AEC0" />
                          <Text style={styles.noDataText}>No candidate data available</Text>
                        </View>
                      )}
                      
                      <View style={styles.factCardWrapper}>
                        <ElectionFactCard 
                          fact={electionData.electionFact || 'No additional facts available for this election.'}
                          onShare={handleShareFact}
                        />
                      </View>
                    </Animated.View>
                  )}
                  
                  {activeTab === 'Turnout' && (
                    <Animated.View entering={FadeIn.duration(400)} style={styles.tabSection}>
                      <View style={styles.turnoutCard}>
                        <Text style={styles.turnoutCardTitle}>Voter Turnout</Text>
                        <View style={styles.turnoutPercentContainer}>
                          {/* <Text style={styles.turnoutPercentage}>
                            {(electionData.turnoutPercentage || electionData.voterTurnout || 0).toFixed(1)}%
                          </Text> */}
                          <Text style={styles.turnoutDescription}>
                            of registered voters participated
                          </Text>
                        </View>
                      </View>
                      
                      {electionData.turnoutTrend && electionData.turnoutTrend.length > 0 && (
                        <View style={styles.chartContainer}>
                          <Text style={styles.chartTitle}>Historical Comparison</Text>
                          <TurnoutChart data={electionData.turnoutTrend} />
                        </View>
                      )}
                      
                      <View style={styles.factCardWrapper}>
                        <ElectionFactCard 
                          fact={electionData.electionFact || 'No additional facts available for this election.'}
                          onShare={handleShareFact}
                        />
                      </View>
                    </Animated.View>
                  )}
                  
                  {activeTab === 'Insights' && (
                    <Animated.View entering={FadeIn.duration(400)} style={styles.tabSection}>
                      <View style={styles.insightsSectionHeader}>
                        <Ionicons name="analytics" size={20} color="#2D3748" />
                        <Text style={styles.insightsSectionTitle}>Election Insights</Text>
                      </View>
                      
                      <View style={styles.factCardWrapper}>
                        <ElectionFactCard 
                          fact={electionData.electionFact || 'No additional facts available for this election.'}
                          onShare={handleShareFact}
                        />
                      </View>
                      
                      {electionData.candidates && electionData.candidates.length >= 2 && (
                        <View style={styles.takeawaysContainer}>
                          <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
                          
                          <View style={styles.takeawayItem}>
                            <View style={styles.takeawayBullet} />
                            <Text style={styles.takeawayText}>
                              <Text style={styles.highlightText}>
                                {electionData.winningCandidate || electionData.candidates[0].name}
                              </Text> won with a {
                                (electionData.candidates[0].percentage || 0) - 
                                (electionData.candidates[1].percentage || 0) > 10 
                                  ? 'significant' 
                                  : 'narrow'
                              } margin of <Text style={styles.highlightText}>
                                {((electionData.candidates[0].percentage || 0) - 
                                  (electionData.candidates[1].percentage || 0)).toFixed(1)}%
                              </Text>.
                            </Text>
                          </View>
                          
                          <View style={styles.takeawayItem}>
                            <View style={styles.takeawayBullet} />
                            <Text style={styles.takeawayText}>
                              Voter turnout was <Text style={styles.highlightText}>
                                {(electionData.turnoutPercentage || electionData.voterTurnout || 0) > 80 
                                  ? 'exceptionally high' 
                                  : (electionData.turnoutPercentage || electionData.voterTurnout || 0) > 70 
                                    ? 'relatively high'
                                    : 'moderate'}
                              </Text> at <Text style={styles.highlightText}>
                                {(electionData.turnoutPercentage || electionData.voterTurnout || 0).toFixed(1)}%
                              </Text>.
                            </Text>
                          </View>
                          
                          <View style={styles.takeawayItem}>
                            <View style={styles.takeawayBullet} />
                            <Text style={styles.takeawayText}>
                              The runner-up <Text style={styles.highlightText}>
                                {electionData.candidates[1].name} ({electionData.candidates[1].party})
                              </Text> received <Text style={styles.highlightText}>
                                {electionData.candidates[1].percentage?.toFixed(1) || 0}%
                              </Text> of the votes.
                            </Text>
                          </View>
                        </View>
                      )}
                    </Animated.View>
                  )}
                  
                  {/* Add bottom padding for scrolling past FAB */}
                  <View style={styles.bottomPadding} />
                </ScrollView>
              </View>
            ) : null}
          </View>
        </View>
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        accessibilityLabel="Share election information"
        accessibilityRole="button"
        onPress={() => {
          if (electionData) {
            Share.share({
              message: `Check out the ${electionData.title || electionData.name || 'election'} on CivicLens! #SriLankanElections`,
            });
          }
        }}
      >
        <Ionicons name="share-social-outline" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  listSection: {
    flex: 1,
  },
  detailsSection: {
    flex: 2,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 28,
  },
  listContainer: {
    paddingBottom: 16,
  },
  electionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  electionTypeTag: {
    backgroundColor: '#EBF8FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  electionTypeText: {
    fontSize: 12,
    color: '#2B6CB0',
    fontWeight: '600',
  },
  electionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarIcon: {
    marginRight: 6,
  },
  electionDate: {
    fontSize: 14,
    color: '#4A5568',
  },
  candidatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  candidateThumb: {
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
  },
  moreCandidates: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moreCandidatesText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5568',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  turnoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  turnoutText: {
    fontSize: 13,
    color: '#4A5568',
    marginLeft: 6,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginRight: 2,
  },
  yearSelectorContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  electionDetailsContainer: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  electionHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  electionTypeContainer: {
    marginBottom: 8,
  },
  electionTypeIndicator: {
    fontSize: 13,
    color: '#319795',
    fontWeight: '600',
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  electionName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  electionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  electionDateText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 6,
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  tabSection: {
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  factCardWrapper: {
    marginVertical: 8,
  },
  resultsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
  },
  noDataText: {
    marginTop: 12,
    fontSize: 15,
    color: '#718096',
    textAlign: 'center',
  },
  turnoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  turnoutCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  turnoutPercentContainer: {
    alignItems: 'center',
  },
  turnoutPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2B6CB0',
    marginBottom: 4,
  },
  turnoutDescription: {
    fontSize: 14,
    color: '#4A5568',
  },
  insightsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  takeawaysContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  takeawaysTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  takeawayItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  takeawayBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginRight: 12,
  },
  takeawayText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  highlightText: {
    color: '#2C5282',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 80, // Space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  detailsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  detailsLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4A5568',
  },
  detailsErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  detailsErrorText: {
    fontSize: 16,
    color: '#E53E3E',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PastElectionsScreen;