import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import type { VoterTurnoutPoint } from '../../types/election';

interface VoterTurnoutChartProps {
  data: VoterTurnoutPoint[];
}

const VoterTurnoutChart: React.FC<VoterTurnoutChartProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width - 32; // Full width minus padding
  const chartHeight = 120;
  const chartWidth = screenWidth - 40; // Account for left axis padding
  
  // Find min and max values
  const minYear = Math.min(...data.map(item => item.year));
  const maxYear = Math.max(...data.map(item => item.year));
  const minPercentage = Math.max(0, Math.min(...data.map(item => item.percentage)) - 10);
  const maxPercentage = Math.min(100, Math.max(...data.map(item => item.percentage)) + 5);
  
  // Create point coordinates
  const points = data.map((item, index) => {
    const x = 40 + ((item.year - minYear) / (maxYear - minYear)) * chartWidth;
    const y = chartHeight - ((item.percentage - minPercentage) / (maxPercentage - minPercentage)) * (chartHeight - 20);
    return { x, y, ...item };
  });
  
  // Create SVG path
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
          
          {/* Data path */}
          <Path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
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
              x={point.x}
              y={chartHeight + 15}
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
            y={chartHeight}
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