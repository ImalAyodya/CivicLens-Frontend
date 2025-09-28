import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import BottomNavBar from '../../components/BottomNavBar';
import { PieChart } from 'react-native-svg-charts'; 

// Dummy data for chart and table
const chartData = [
  { year: '2021', profit: 1100000, loss: 90000 },
  { year: '2022', profit: 1650000, loss: 120000 },
  { year: '2023', profit: 1900000, loss: 95000 },
  { year: '2024', profit: 2200000, loss: 105000 },
];

const kpiData = [
  { ministry: 'Education', budget: '$5.2B', utilization: '92%', status: 'On Track' },
  { ministry: 'Health', budget: '$7.8B', utilization: '88%', status: 'At Risk' },
  { ministry: 'Infrastructure', budget: '$3.5B', utilization: '95%', status: 'On Track' },
  { ministry: 'Environment', budget: '$1.9B', utilization: '75%', status: 'Needs Improvement' },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  'On Track': { bg: '#D1FAE5', text: '#059669' },
  'At Risk': { bg: '#FEF3C7', text: '#B45309' },
  'Needs Improvement': { bg: '#FEE2E2', text: '#B91C1C' },
};

export default function MinistryPerformanceScreen({ navigation }: { navigation: any }) {
  // Pie chart data for 2024
  const lastYear = chartData.find(d => d.year === '2024');
  const pieData = [
    {
      key: 1,
      value: lastYear?.profit ?? 0,
      svg: { fill: '#2563EB' },
      label: 'Profit',
    },
    {
      key: 2,
      value: lastYear?.loss ?? 0,
      svg: { fill: '#22C55E' },
      label: 'Loss',
    },
  ];

  return (
    <View style={styles.container}>
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Ministry Performance" />
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Chart Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Annual Financial Overview</Text>
          <View style={styles.chartArea}>
            {/* Simple Bar Chart */}
            <View style={styles.chartRow}>
              {chartData.map((item, idx) => (
                <View key={item.year} style={styles.chartBarContainer}>
                  <View style={[styles.bar, { height: item.profit / 22000, backgroundColor: '#2563EB' }]} />
                  <View style={[styles.bar, { height: item.loss / 22000, backgroundColor: '#22C55E', marginTop: 2 }]} />
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
        </View>
        {/* Pie Chart Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overall Profits & Loss (2024)</Text>
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
          {kpiData.map((row, idx) => (
            <View key={row.ministry} style={[styles.tableRow, idx % 2 === 1 && { backgroundColor: '#F9FAFB' }]}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{row.ministry}</Text>
              <Text style={styles.tableCell}>{row.budget}</Text>
              <Text style={styles.tableCell}>{row.utilization}</Text>
              <View style={[styles.tableCell, { alignItems: 'center', justifyContent: 'center' }]}>
                <View style={{
                  backgroundColor: statusColors[row.status].bg,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                }}>
                  <Text style={{
                    color: statusColors[row.status].text,
                    fontWeight: '600',
                    fontSize: 12,
                  }}>{row.status}</Text>
                </View>
              </View>
            </View>
          ))}
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