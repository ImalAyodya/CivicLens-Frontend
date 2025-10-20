import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { VoteDistributionData } from '../../types/election';

interface VoteDistributionChartProps {
  data: VoteDistributionData[];
}

const VoteDistributionChart: React.FC<VoteDistributionChartProps> = ({ data }) => {
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-bold text-gray-800 mb-2">Vote Distribution</Text>
        <View className="h-32 justify-center items-center">
          <Text className="text-gray-500">No vote distribution data available</Text>
        </View>
      </View>
    );
  }
  
  const size = 140;
  const radius = size / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Filter valid data
  const validData = data.filter(item => 
    typeof item.percentage === 'number' && 
    !isNaN(item.percentage) && 
    item.percentage > 0
  );
  
  // Handle all invalid data
  if (validData.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-bold text-gray-800 mb-2">Vote Distribution</Text>
        <View className="h-32 justify-center items-center">
          <Text className="text-gray-500">Invalid vote distribution data</Text>
        </View>
      </View>
    );
  }
  
  // Calculate total for percentages
  const total = validData.reduce((sum, item) => sum + item.percentage, 0);
  
  // Generate pie chart paths with safety checks
  const createPieChart = () => {
    let startAngle = 0;
    const result = [];
    
    for (const item of validData) {
      const percentage = item.percentage / total;
      
      // Skip invalid percentages
      if (isNaN(percentage) || percentage <= 0) continue;
      
      const angle = percentage * 360;
      const endAngle = startAngle + angle;
      
      // Calculate path with safeguards
      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      // Ensure values are valid
      if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) continue;
      
      // Create arc path
      const largeArc = angle > 180 ? 1 : 0;
      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      result.push({ 
        path, 
        color: item.color || '#CCCCCC', 
        percentage: item.percentage,
        party: item.party,
        startAngle, 
        endAngle 
      });
      
      startAngle = endAngle;
    }
    
    return result;
  };
  
  const paths = createPieChart();
  
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="font-bold text-gray-800 mb-2">Vote Distribution</Text>
      
      <View className="flex-row">
        <Svg height={size} width={size}>
          {paths.map((pathItem, index) => (
            <Path
              key={index}
              d={pathItem.path}
              fill={pathItem.color}
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </Svg>
        
        <View className="flex-1 justify-center ml-4">
          {validData.map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <View
                style={{ width: 12, height: 12, backgroundColor: item.color || '#CCCCCC' }}
                className="rounded-full mr-2"
              />
              <Text className="text-xs">
                {item.party}: {item.percentage.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default VoteDistributionChart;