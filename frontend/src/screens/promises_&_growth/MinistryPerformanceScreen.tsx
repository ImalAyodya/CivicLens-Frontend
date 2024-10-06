import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { PieChart } from 'react-native-svg-charts'; 
import axios from 'axios';

const API_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/promise/api/performance'; // Adjust if needed

const statusColors: Record<string, { bg: string; text: string }> = {
  'On Track': { bg: '#D1FAE5', text: '#059669' },
  'At Risk': { bg: '#FEF3C7', text: '#B45309' },
  'Needs Improvement': { bg: '#FEE2E2', text: '#B91C1C' },
};

interface ChartItem {
  year: number;
  profit: number;
  loss: number;
}

export default function MinistryPerformanceScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}`);
      // If you expect an array, use the first item
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setPerformanceData(data);
    } catch (err) {
      setError('Failed to fetch performance data');
      setPerformanceData(null);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data from backend
  const chartData: ChartItem[] = performanceData?.annualFinancialOverview?.map((item: any) => ({
    year: item.year,
    profit: item.profit,
    loss: item.loss,
  })) || [];

  const kpiData = performanceData?.keyPerformanceIndicators || [];

  // Pie chart data for last year (2024 or latest)
  const lastYear = chartData.length > 0
    ? chartData.find(d => d.year === 2024) || chartData[chartData.length - 1]
    : null;

  const pieData = lastYear
    ? [
        {
          key: 1,
          value: lastYear.profit ?? 0,
          svg: { fill: '#2563EB' },
          label: 'Profit',
        },
        {
          key: 2,
          value: lastYear.loss ?? 0,
          svg: { fill: '#22C55E' },
          label: 'Loss',
        },
      ]
    : [];

  // Find the maximum value for scaling
  const maxValue = Math.max(
    ...chartData.map(item => Math.max(item.profit, item.loss)),
    1 // fallback to 1 to avoid division by zero
  );

  return (
    <View style={styles.container}>
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Ministry Performance" />
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Chart Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Annual Financial Overview</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 24 }} />
          ) : error ? (
            <Text style={{ color: '#EF4444', textAlign: 'center', marginVertical: 24 }}>{error}</Text>
          ) : (
            <View style={styles.chartArea}>
              {/* Simple Bar Chart */}
              <View style={styles.chartRow}>
                {chartData.map((item: ChartItem, idx: number) => (
                  <View key={item.year} style={styles.chartBarContainer}>
                    <View style={[
                      styles.bar,
                      {
                        height: (item.profit / maxValue) * 100, // scale to max 100px
                        backgroundColor: '#2563EB'
                      }
                    ]} />
                    <View style={[
                      styles.bar,
                      {
                        height: (item.loss / maxValue) * 100, // scale to max 100px
                        backgroundColor: '#22C55E',
                        marginTop: 2
                      }
                    ]} />
                    <Text style={styles.chartYear}>{item.year}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartLegendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
                  <Text style={styles.legendText}>Profit</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                  <Text style={styles.legendText}>Loss</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        {/* Pie Chart Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overall Profits & Loss (2024)</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginVertical: 24 }} />
          ) : error ? (
            <Text style={{ color: '#EF4444', textAlign: 'center', marginVertical: 24 }}>{error}</Text>
          ) : (
            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              <PieChart
                style={{ height: 160, width: 160 }}
                data={pieData}
                innerRadius={40}
                outerRadius={80}
                padAngle={0.03}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
                  <Text style={styles.legendText}>Profit</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                  <Text style={styles.legendText}>Loss</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        {/* KPI Table Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>Ministry</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Budget</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Utilization</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 24 }} />
          ) : error ? (
            <Text style={{ color: '#EF4444', textAlign: 'center', marginVertical: 24 }}>{error}</Text>
          ) : (
            kpiData.map((row: any, idx: number) => (
              <View key={row.ministry} style={[styles.tableRow, idx % 2 === 1 && { backgroundColor: '#F9FAFB' }]}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{row.ministry}</Text>
                <Text style={styles.tableCell}>{row.budget}</Text>
                <Text style={styles.tableCell}>{row.utilization}</Text>
                <View style={[styles.tableCell, { alignItems: 'center', justifyContent: 'center' }]}>
                  <View style={{
                    backgroundColor: statusColors[row.status]?.bg || '#E5E7EB',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}>
                    <Text style={{
                      color: statusColors[row.status]?.text || '#222',
                      fontWeight: '600',
                      fontSize: 12,
                    }}>{row.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
        {/* Export/Share Button */}
        <TouchableOpacity style={styles.exportBtn}>
          <Text style={styles.exportBtnText}>Export/Share Report</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar activeTab="Reports" onTabPress={tab => navigation.navigate(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  chartArea: {
    marginBottom: 8,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 18,
    borderRadius: 6,
  },
  chartYear: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  chartLegendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 4,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#1E293B',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    paddingHorizontal: 2,
  },
  exportBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  exportBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});