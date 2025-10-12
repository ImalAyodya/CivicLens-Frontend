import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import type { RootStackParamList } from '../../navigation/types';
import { electionTrendService } from '../../services/electionTrendService';
import type { ElectionTrendPrediction } from '../../types/election';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'ElectionPredictions'>;

const ElectionPredictionsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { electionId } = route.params;
  const [prediction, setPrediction] = useState<ElectionTrendPrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await electionTrendService.getPredictions(electionId);
        setPrediction(data);
      } catch (err) {
        console.error('Failed to fetch predictions:', err);
        setError('Unable to load election predictions at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [electionId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Analyzing election data...</Text>
      </View>
    );
  }

  if (error || !prediction) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error || 'An unexpected error occurred'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const chartData = {
    labels: prediction.partyTrends.map(trend => trend.party),
    datasets: [
      {
        data: prediction.partyTrends.map(trend => trend.predictedSupport),
        colors: prediction.partyTrends.map(trend => () => trend.color)
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Election Trends</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.titleSection}>
          <Text style={styles.title}>{prediction.electionName}</Text>
          <Text style={styles.subtitle}>AI-Powered Prediction</Text>
          <View style={styles.disclaimerBox}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
            <Text style={styles.disclaimerText}>
              Predictions are based on historical data and news analysis. Actual results may vary.
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Projected Results</Text>
          <BarChart
                      data={chartData}
                      width={width - 40}
                      height={220}
                      chartConfig={{
                          backgroundColor: '#ffffff',
                          backgroundGradientFrom: '#ffffff',
                          backgroundGradientTo: '#ffffff',
                          decimalPlaces: 1,
                          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                          style: {
                              borderRadius: 16
                          },
                          barPercentage: 0.8
                      }}
                      style={styles.chart}
                      showValuesOnTopOfBars
                      fromZero yAxisLabel={''} yAxisSuffix={''}          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Party Trend Details</Text>
          {prediction.partyTrends.map((trend, index) => (
            <View key={trend.party} style={styles.trendItem}>
              <View style={styles.trendHeader}>
                <View style={[styles.partyIndicator, { backgroundColor: trend.color }]} />
                <Text style={styles.partyName}>{trend.party}</Text>
                <View style={styles.trendDirection}>
                  {trend.trendDirection > 0 && <Ionicons name="arrow-up" size={16} color="#10B981" />}
                  {trend.trendDirection < 0 && <Ionicons name="arrow-down" size={16} color="#EF4444" />}
                  {trend.trendDirection === 0 && <Ionicons name="remove" size={16} color="#6B7280" />}
                </View>
              </View>
              <View style={styles.trendDetails}>
                <View>
                  <Text style={styles.detailLabel}>Current Support</Text>
                  <Text style={styles.detailValue}>{trend.currentSupport.toFixed(1)}%</Text>
                </View>
                <View>
                  <Text style={styles.detailLabel}>Predicted</Text>
                  <Text style={styles.detailValue}>{trend.predictedSupport.toFixed(1)}%</Text>
                </View>
                <View>
                  <Text style={styles.detailLabel}>Confidence</Text>
                  <Text style={[
                    styles.confidenceValue, 
                    trend.confidence === 'High' ? styles.highConfidence : 
                    trend.confidence === 'Medium' ? styles.mediumConfidence : 
                    styles.lowConfidence
                  ]}>
                    {trend.confidence}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.outcomesContainer}>
          <Text style={styles.sectionTitle}>Possible Outcomes</Text>
          {prediction.possibleOutcomes.map((outcome, index) => (
            <View key={index} style={styles.outcomeItem}>
              <Ionicons name="analytics-outline" size={20} color="#2563EB" />
              <Text style={styles.outcomeText}>{outcome}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  titleSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  trendItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 16,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  partyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  partyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  trendDirection: {
    marginLeft: 'auto',
  },
  trendDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  highConfidence: {
    color: '#10B981',
  },
  mediumConfidence: {
    color: '#F59E0B',
  },
  lowConfidence: {
    color: '#EF4444',
  },
  outcomesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  outcomeText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
});

export default ElectionPredictionsScreen;