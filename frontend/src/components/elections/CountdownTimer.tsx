import React from 'react';
import { View, Text } from 'react-native';

interface CountdownTimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ days, hours, minutes, seconds }) => {
  // Format numbers to always have 2 digits
  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <View className="flex-row justify-around py-3">
      <View className="items-center">
        <View className="bg-blue-700 w-14 h-14 rounded-md items-center justify-center">
          <Text className="text-white text-xl font-bold">{formatNumber(days)}</Text>
        </View>
        <Text className="text-blue-100 text-xs mt-1">DAYS</Text>
      </View>
      
      <View className="items-center">
        <View className="bg-blue-700 w-14 h-14 rounded-md items-center justify-center">
          <Text className="text-white text-xl font-bold">{formatNumber(hours)}</Text>
        </View>
        <Text className="text-blue-100 text-xs mt-1">HOURS</Text>
      </View>
      
      <View className="items-center">
        <View className="bg-blue-700 w-14 h-14 rounded-md items-center justify-center">
          <Text className="text-white text-xl font-bold">{formatNumber(minutes)}</Text>
        </View>
        <Text className="text-blue-100 text-xs mt-1">MINUTES</Text>
      </View>
      
      <View className="items-center">
        <View className="bg-blue-700 w-14 h-14 rounded-md items-center justify-center">
          <Text className="text-white text-xl font-bold">{formatNumber(seconds)}</Text>
        </View>
        <Text className="text-blue-100 text-xs mt-1">SECONDS</Text>
      </View>
    </View>
  );
};

export default CountdownTimer;