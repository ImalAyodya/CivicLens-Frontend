import React from 'react';
import { View } from 'react-native';

interface PromiseFulfillmentBarProps {
  percentage: number;
}

const PromiseFulfillmentBar: React.FC<PromiseFulfillmentBarProps> = ({ percentage }) => {
  // Calculate color based on percentage
  const getColor = () => {
    if (percentage >= 80) return '#22C55E'; // Green
    if (percentage >= 60) return '#3B82F6'; // Blue
    if (percentage >= 40) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  return (
    <View className="h-2 bg-gray-200 rounded-full w-full overflow-hidden">
      <View 
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: getColor(),
          height: '100%',
          borderRadius: 4
        }} 
      />
    </View>
  );
};

export default PromiseFulfillmentBar;