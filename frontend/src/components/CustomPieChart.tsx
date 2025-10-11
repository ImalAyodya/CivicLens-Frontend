import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';

interface PieDataItem {
  name: string;
  population: number;
  percentage: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

interface CustomPieChartProps {
  data: PieDataItem[];
  size?: number;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', x, y,
    'Z',
  ].join(' ');
  return d;
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, size = 120 }) => {
  const radius = size / 2;
  const total = data.reduce((sum, item) => sum + item.population, 0);

  // If only one segment, render a full circle
  if (data.length === 1 && total > 0) {
    return (
      <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Svg width={size} height={size}>
          <Circle
            cx={radius}
            cy={radius}
            r={radius}
            fill={data[0].color}
          />
        </Svg>
      </View>
    );
  }

  let startAngle = 0;
  const arcs = data.map((item, idx) => {
    const value = item.population;
    const angle = total > 0 ? (value / total) * 360 : 0;
    const endAngle = startAngle + angle;
    const path = describeArc(radius, radius, radius, startAngle, endAngle);
    const arc = (
      <Path
        key={idx}
        d={path}
        fill={item.color}
        stroke="#fff"
        strokeWidth={2}
      />
    );
    startAngle = endAngle;
    return arc;
  });

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <Svg width={size} height={size}>
        <G>
          {arcs}
        </G>
      </Svg>
    </View>
  );
};

export default CustomPieChart;