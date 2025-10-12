import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import type { VoterTurnoutData } from '../../types/election';

interface VoterTurnoutChartProps {
  data: VoterTurnoutData[];
}

const VoterTurnoutChart: React.FC<VoterTurnoutChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width - 32; // Full width minus padding
  const chartHeight = 120;
  const chartWidth = screenWidth - 40; // Account for left axis padding
  
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-bold text-gray-800 mb-2">Voter Turnout Trend</Text>
        <View className="h-32 justify-center items-center">
          <Text className="text-gray-500">No turnout data available</Text>
        </View>
      </View>
    );
  }

  // Ensure all data points are valid numbers
  const validData = data.filter(item => 
    typeof item.year === 'number' && 
    !isNaN(item.year) && 
    typeof item.percentage === 'number' && 
    !isNaN(item.percentage)
  );
  
  // Handle the case where all data points were invalid
  if (validData.length === 0) {
    return (
      <View className="bg-white rounded-lg p-4 mb-4">
        <Text className="font-bold text-gray-800 mb-2">Voter Turnout Trend</Text>
        <View className="h-32 justify-center items-center">
          <Text className="text-gray-500">Invalid turnout data</Text>
        </View>
      </View>
    );
  }
  
  // Find min and max values from valid data
  const minYear = Math.min(...validData.map(item => item.year));
  const maxYear = Math.max(...validData.map(item => item.year));
  const minPercentage = Math.max(0, Math.min(...validData.map(item => item.percentage)) - 10);
  const maxPercentage = Math.min(100, Math.max(...validData.map(item => item.percentage)) + 5);
  
  // Handle edge case where min and max are the same (single data point or all same values)
  const yearRange = maxYear - minYear || 1; // Prevent division by zero
  const percentageRange = maxPercentage - minPercentage || 1; // Prevent division by zero
  
  // Create point coordinates with safeguards against NaN
  const points = validData.map((item) => {
    // Ensure values are within valid ranges to prevent NaN
    const x = 40 + ((item.year - minYear) / yearRange) * chartWidth;
    const y = chartHeight - ((item.percentage - minPercentage) / percentageRange) * (chartHeight - 20);
    
    // Additional safety check
    return { 
      x: isNaN(x) ? 40 : x, 
      y: isNaN(y) ? chartHeight / 2 : y, 
      ...item 
    };
  });
  
  // Create SVG path with safety checks
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`
  ).join(' ');
  
  return (
    <View className="bg-white rounded-lg p-4 mb-4">
      <Text className="font-bold text-gray-800 mb-2">Voter Turnout Trend</Text>
      
      <View className="h-32">
        <Svg height={chartHeight} width="100%">
          {/* Y-axis */}
          <Line x1="40" y1="0" x2="40" y2={chartHeight} stroke="#E5E7EB" strokeWidth="1" />
          
          {/* X-axis */}
          <Line x1="40" y1={chartHeight} x2={screenWidth} y2={chartHeight} stroke="#E5E7EB" strokeWidth="1" />
          
          {/* Grid lines */}
          <Line x1="40" y1={chartHeight/2} x2={screenWidth} y2={chartHeight/2} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
          
          {/* Data path - only render if valid */}
          {points.length > 0 && (
            <Path
              d={pathData}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            />
          )}
          
          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x.toString()} // Convert to string to avoid React Native SVG warnings
              cy={point.y.toString()} // Convert to string to avoid React Native SVG warnings
              r="4"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
          ))}
          
          {/* X-axis labels */}
          {points.map((point, index) => (
            <SvgText
              key={index}
              x={point.x.toString()} // Convert to string to avoid React Native SVG warnings
              y={(chartHeight + 15).toString()}
              fontSize="10"
              fill="#6B7280"
              textAnchor="middle"
            >
              {point.year}
            </SvgText>
          ))}
          
          {/* Y-axis labels */}
          <SvgText
            x="10"
            y="10"
            fontSize="10"
            fill="#6B7280"
            textAnchor="start"
          >
            {Math.round(maxPercentage)}%
          </SvgText>
          
          <SvgText
            x="10"
            y={chartHeight.toString()}
            fontSize="10"
            fill="#6B7280"
            textAnchor="start"
          >
            {Math.round(minPercentage)}%
          </SvgText>
        </Svg>
      </View>
    </View>
  );
};

export default VoterTurnoutChart;