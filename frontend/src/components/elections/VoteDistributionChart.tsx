import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import type { VoteDistribution } from '../../types/election';

interface VoteDistributionChartProps {
  data: VoteDistribution[];
}

const VoteDistributionChart: React.FC<VoteDistributionChartProps> = ({ data }) => {
  const size = 140;
  const radius = size / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.percentage, 0);
  
  // Generate pie chart paths
  const createPieChart = () => {
    let startAngle = 0;
    const result = [];
    
    for (const item of data) {
      const percentage = item.percentage / total;
      const angle = percentage * 360;
      const endAngle = startAngle + angle;
      
      // Calculate path
      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      // Create arc path
      const largeArc = angle > 180 ? 1 : 0;
      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      result.push({ path, color: item.color, percentage, startAngle, endAngle });
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
          <G>
            {paths.map((segment, index) => (
              <Path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </G>
        </Svg>
        
        <View className="flex-1 justify-center ml-4">
          {data.map((item, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <View 
                style={{ 
                  backgroundColor: item.color,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  marginRight: 8
                }}
              />
              <Text className="text-gray-700">{item.party}</Text>
              <Text className="ml-auto text-gray-700 font-medium">
                {item.percentage.toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default VoteDistributionChart;