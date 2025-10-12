import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

// Colors for different political parties
const partyColors = {
  'UNP': '#0066CC',
  'SLPP': '#E51C23',
  'SJB': '#00CC66',
  'NPP': '#CC0000',
  'UPFA': '#1B75BB',
  'JVP': '#FF9800',
  'SLFP': '#0000CC',
  'TNA': '#FFCC00',
  'NDF': '#4CAF50'
};

// Default colors for other parties
const defaultColors = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F97316',
];

interface VoteDistributionData {
  party: string;
  votes: number;
  percentage: number;
}

interface VoteDistributionChartProps {
  data: VoteDistributionData[];
}

const VoteDistributionChart: React.FC<VoteDistributionChartProps> = ({ data }) => {
  // Sort data by percentage in descending order
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
  
  // Map data to the format required by PieChart
  const chartData = sortedData.map((item, index) => ({
    name: item.party,
    votes: item.votes,
    percentage: item.percentage,
    color: partyColors[item.party as keyof typeof partyColors] || defaultColors[index % defaultColors.length],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vote Distribution</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={width - 64}
          height={180}
          chartConfig={chartConfig}
          accessor="percentage"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute={false}
          hasLegend={false}
        />
      </View>
      
      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendParty}>{item.name}</Text>
              <Text style={styles.legendPercentage}>{item.percentage.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendParty: {
    fontSize: 14,
    color: '#4A5568',
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
  },
});

export default VoteDistributionChart;