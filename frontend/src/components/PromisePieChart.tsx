import React from 'react';
import { View, Text } from 'react-native';
import CustomPieChart from './CustomPieChart';

interface PieDataItem {
  name: string;
  population: number;
  percentage: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface PromisePieChartProps {
  data: PieDataItem[];
  totalPromises: number;
  chartConfig: any;
}

const PromisePieChart: React.FC<PromisePieChartProps> = ({ data, totalPromises, chartConfig }) => {
  // Only include segments with population > 0 for the chart
  const nonZeroSegments = data.filter((item: PieDataItem) => item.population > 0);

  return (
    <View className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <Text className="text-gray-800 font-medium mb-4">Promise Status</Text>
      <View style={{ alignItems: 'center' }}>
        {data && totalPromises > 0 ? (
          <>
            <CustomPieChart data={nonZeroSegments} size={120} />
            {/* Custom Legend */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 10,
            }}>
              {data
                .filter(item => item.name !== "__filler__") // Hide filler from legend
                .map((item: PieDataItem, index: number) => (
                  <View key={index} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: 5,
                    minWidth: 90,
                  }}>
                    <View style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: item.color,
                      marginRight: 4
                    }} />
                    <Text style={{ fontSize: 10, color: '#374151' }}>
                      {item.percentage}% {item.name}
                    </Text>
                  </View>
                ))}
            </View>
          </>
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500">No promises to display</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PromisePieChart;