import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BarChart, PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import BottomNavBar from '../../components/BottomNavBar';
// import Header from '~/components/Header';

const API_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/promise/api';
const screenWidth = Dimensions.get('window').width;

// Scoring system for reactions
const REACTION_SCORES = {
  like: 5,
  heart: 8,
  angry: 3,
  funny: 4
};

const reactionEmojis = {
  like: '👍',
  heart: '❤️',
  angry: '😠',
  funny: '😂'
};

interface PromiseScore {
  promiseId: string;
  promiseTitle: string;
  ministerName: string;
  totalScore: number;
  reactionCounts: {
    like: number;
    heart: number;
    angry: number;
    funny: number;
    total: number;
  };
  scoreBreakdown: {
    like: number;
    heart: number;
    angry: number;
    funny: number;
  };
}

export default function PublicEngagementScoreScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [promiseScores, setPromiseScores] = useState<PromiseScore[]>([]);
  const [topScorer, setTopScorer] = useState<PromiseScore | null>(null);
  const [top5Scores, setTop5Scores] = useState<PromiseScore[]>([]);

  useEffect(() => {
    fetchEngagementData();
  }, []);

  const fetchEngagementData = async () => {
    try {
      setLoading(true);
      // Fetch all promises with their reactions
      const promisesResponse = await axios.get(`${API_BASE_URL}/promises`);
      const promises = promisesResponse.data;

      console.log('Fetched promises:', promises); // Debug log

      const scoreData: PromiseScore[] = [];

      // For each promise, calculate scores from promise reactions
      promises.forEach((promise: any) => {
        console.log(`Processing promise ${promise._id}:`, promise.promiseTitle);
        console.log('Promise reactions:', promise.reactions);

        // Calculate reaction counts and scores from promise reactions
        const reactionCounts = { like: 0, heart: 0, angry: 0, funny: 0, total: 0 };
        const scoreBreakdown = { like: 0, heart: 0, angry: 0, funny: 0 };

        // Use promise.reactions instead of comment reactions
        if (promise.reactions && promise.reactions.length > 0) {
          promise.reactions.forEach((reaction: any) => {
            const type = reaction.reactionType;
            console.log('Processing promise reaction type:', type);
            
            if (type && ['like', 'heart', 'angry', 'funny'].includes(type)) {
              reactionCounts[type as keyof typeof reactionCounts]++;
              reactionCounts.total++;
              scoreBreakdown[type as keyof typeof scoreBreakdown] += REACTION_SCORES[type as keyof typeof REACTION_SCORES];
            }
          });
        }

        // Use virtual reactionCounts if available from backend
        if (promise.reactionCounts) {
          console.log('Using virtual reactionCounts:', promise.reactionCounts);
          Object.assign(reactionCounts, promise.reactionCounts);
          
          // Recalculate score breakdown from reaction counts
          Object.entries(promise.reactionCounts).forEach(([type, count]) => {
            if (type !== 'total' && typeof count === 'number') {
              scoreBreakdown[type as keyof typeof scoreBreakdown] = count * REACTION_SCORES[type as keyof typeof REACTION_SCORES];
            }
          });
        }

        console.log('Final reaction counts for promise:', promise._id, reactionCounts);
        console.log('Final score breakdown:', scoreBreakdown);

        const totalScore = Object.values(scoreBreakdown).reduce((sum, score) => sum + score, 0);

        scoreData.push({
          promiseId: promise._id,
          promiseTitle: promise.promiseTitle || 'Untitled Promise',
          ministerName: promise.ministerName || 'Unknown Minister',
          totalScore,
          reactionCounts,
          scoreBreakdown
        });
      });

      console.log('All score data:', scoreData);

      // Sort by total score (highest first)
      const sortedScores = scoreData.sort((a, b) => b.totalScore - a.totalScore);
      
      setPromiseScores(sortedScores);
      setTopScorer(sortedScores[0] || null);
      setTop5Scores(sortedScores.slice(0, 5));

    } catch (err) {
      console.log('Error fetching engagement data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for top 5 - Updated with simple labels
  const chartData = {
    labels: top5Scores.map((_, index) => `Top ${index + 1}`), // Simple labels like "Top 1", "Top 2"
    datasets: [{
      data: top5Scores.map(score => score.totalScore)
    }]
  };

  // Prepare pie chart data for reaction distribution of top scorer
  const pieData = topScorer ? Object.entries(topScorer.reactionCounts)
    .filter(([key]) => key !== 'total' && topScorer.reactionCounts[key as keyof typeof topScorer.reactionCounts] > 0)
    .map(([key, value], index) => ({
      name: `${reactionEmojis[key as keyof typeof reactionEmojis]} ${key}`,
      population: value,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index], // Better mobile colors
      legendFontColor: '#374151',
      legendFontSize: 10 // Smaller font for mobile
    })) : [];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Calculating engagement scores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Civic Insights Score" />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#374151" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Page Title */}
        <View style={styles.titleContainer}>
          <MaterialIcons name="analytics" size={32} color="#2563EB" />
          <Text style={styles.pageTitle}>Civic Insights Score</Text>
          <Text style={styles.pageSubtitle}>
            Based on direct reactions to political promises
          </Text>
        </View>

        {/* Top Scorer Highlight */}
        {topScorer && topScorer.totalScore > 0 && (
          <View style={styles.topScorerCard}>
            <View style={styles.crownContainer}>
              <MaterialIcons name="emoji-events" size={40} color="#F59E0B" />
            </View>
            <Text style={styles.topScorerTitle}>🏆 Top Engaging Promise</Text>
            <Text style={styles.topScorerPromise}>{topScorer.promiseTitle}</Text>
            <Text style={styles.topScorerMinister}>by {topScorer.ministerName}</Text>
            <View style={styles.topScorerScoreContainer}>
              <Text style={styles.topScorerScore}>{topScorer.totalScore}</Text>
              <Text style={styles.topScorerScoreLabel}>Total Points</Text>
            </View>
            
            {/* Score Breakdown */}
            <View style={styles.scoreBreakdown}>
              <Text style={styles.breakdownTitle}>Point Breakdown:</Text>
              <View style={styles.breakdownGrid}>
                {Object.entries(topScorer.scoreBreakdown).map(([type, score]) => (
                  score > 0 && (
                    <View key={type} style={styles.breakdownItem}>
                      <Text style={styles.breakdownEmoji}>{reactionEmojis[type as keyof typeof reactionEmojis]}</Text>
                      <Text style={styles.breakdownScore}>{score}</Text>
                    </View>
                  )
                ))}
              </View>
            </View>
          </View>
        )}


        {/* Top 5 Chart */}
        {top5Scores.length > 0 && top5Scores.some(score => score.totalScore > 0) && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Top 5 Most Engaging Promises</Text>
            <BarChart
              data={chartData}
              width={screenWidth - 64} // More padding for mobile
              height={180} // Reduced height for mobile
              yAxisLabel=""
              yAxisSuffix="pts" // Removed space for mobile
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // Consistent blue
                labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
                style: {
                  borderRadius: 12,
                  paddingRight: 0, // Remove extra padding
                },
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: '#F3F4F6',
                  strokeDasharray: '0', // Solid lines for mobile
                },
                barPercentage: 0.7, // Make bars thinner for mobile
              }}
              style={styles.chart}
              fromZero={true}
              segments={3} // Fewer segments for mobile
              showValuesOnTopOfBars={false} // Hide values on top for cleaner look
              withHorizontalLabels={true}
              withVerticalLabels={true}
              withInnerLines={true}
            />
            
            {/* Legend showing actual promise names */}
            <View style={styles.chartLegend}>
              <Text style={styles.legendTitle}>Promise Rankings:</Text>
              {top5Scores.map((score, index) => (
                <View key={score.promiseId} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: getLegendColor(index) }]} />
                  <Text style={styles.legendRank}>Top {index + 1}:</Text>
                  <Text style={styles.legendPromise} numberOfLines={2}>
                    {score.promiseTitle}
                  </Text>
                  <Text style={styles.legendScore}>{score.totalScore} pts</Text>
                </View>
              ))}
            </View>
          </View>
        )}


                        {/* Reaction Distribution Pie Chart */}
        {topScorer && pieData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Reaction Distribution - Top Promise</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 64} // More padding for mobile
              height={160} // Reduced height for mobile
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="5" // Reduced padding for mobile
              absolute={false} // Show percentages instead of absolute values
              style={styles.chart}
              hasLegend={true}
              center={[10, 0]} // Center the chart better on mobile
            />
          </View>
        )}

        {/* Top 5 List */}
        {top5Scores.length > 0 && (
          <View style={styles.listCard}>
            <Text style={styles.listTitle}>Top 5 Engaging Promises</Text>
            {top5Scores.map((score, index) => (
              <View key={score.promiseId} style={styles.listItem}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rank}>#{index + 1}</Text>
                </View>
                <View style={styles.promiseInfo}>
                  <Text style={styles.promiseTitle} numberOfLines={2}>
                    {score.promiseTitle}
                  </Text>
                  <Text style={styles.ministerName}>{score.ministerName}</Text>
                  <View style={styles.reactionSummary}>
                    {Object.entries(score.reactionCounts)
                      .filter(([key, value]) => key !== 'total' && value > 0)
                      .map(([type, count]) => (
                        <View key={type} style={styles.reactionItem}>
                          <Text style={styles.reactionEmoji}>{reactionEmojis[type as keyof typeof reactionEmojis]}</Text>
                          <Text style={styles.reactionCount}>{count}</Text>
                        </View>
                      ))}
                  </View>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreValue}>{score.totalScore}</Text>
                  <Text style={styles.scoreLabel}>pts</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {(promiseScores.length === 0 || promiseScores.every(score => score.totalScore === 0)) && (
          <View style={styles.emptyState}>
            <MaterialIcons name="analytics" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Engagement Data</Text>
            <Text style={styles.emptySubtitle}>
              No reactions found on any promises yet. Be the first to react to a promise!
            </Text>
          </View>
        )}

                {/* Scoring System Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Point System</Text>
          <Text style={styles.infoSubtitle}>Points awarded for each reaction on promises:</Text>
          <View style={styles.scoreList}>
            {Object.entries(REACTION_SCORES).map(([type, score]) => (
              <View key={type} style={styles.scoreItem}>
                <Text style={styles.reactionEmoji}>{reactionEmojis[type as keyof typeof reactionEmojis]}</Text>
                <Text style={styles.reactionName}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                <Text style={styles.reactionScore}>{score} points</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavBar 
        activeTab="PublicEngagement" 
        onTabPress={(tab) => navigation.navigate(tab)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backBtn: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  topScorerCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  crownContainer: {
    marginBottom: 8,
  },
  topScorerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  topScorerPromise: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  topScorerMinister: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  topScorerScoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  topScorerScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  topScorerScoreLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreBreakdown: {
    width: '100%',
    alignItems: 'center',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  breakdownItem: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    minWidth: 60,
  },
  breakdownEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  breakdownScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  scoreList: {
    gap: 12,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reactionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  reactionName: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    textTransform: 'capitalize',
  },
  reactionScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12, // Reduced margin for mobile
    marginBottom: 16,
    borderRadius: 16,
    padding: 16, // Reduced padding for mobile
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16, // Slightly smaller for mobile
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12, // Reduced margin
    textAlign: 'center',
  },
  chart: {
    borderRadius: 12,
    alignSelf: 'center', // Center charts on mobile
    marginLeft: -10, // Adjust positioning for mobile
  },
  listCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  promiseInfo: {
    flex: 1,
    marginRight: 16,
  },
  promiseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  ministerName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  reactionSummary: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 2,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  chartLegend: {
    marginTop: 12, // Reduced for mobile
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendTitle: {
    fontSize: 14, // Smaller for mobile
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8, // Reduced margin
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 2,
    flexWrap: 'wrap', // Allow wrapping on mobile
  },
  legendColor: {
    width: 10, // Smaller for mobile
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendRank: {
    fontSize: 11, // Smaller for mobile
    fontWeight: '600',
    color: '#374151',
    minWidth: 35, // Reduced width
  },
  legendPromise: {
    flex: 1,
    fontSize: 11, // Smaller for mobile
    color: '#6B7280',
    marginLeft: 2,
    marginRight: 6,
  },
  legendScore: {
    fontSize: 11, // Smaller for mobile
    fontWeight: '600',
    color: '#2563EB',
    minWidth: 35, // Ensure consistent width
  },
});

// Helper function to get legend colors
const getLegendColor = (index: number) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return colors[index] || '#6B7280';
};