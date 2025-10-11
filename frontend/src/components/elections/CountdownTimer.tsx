import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        // Election day has arrived
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <View className="flex-row justify-center">
      <View className="items-center mx-2">
        <View className="bg-white w-16 h-16 rounded-lg shadow-sm items-center justify-center">
          <Text className="text-2xl font-bold text-blue-800">{timeRemaining.days}</Text>
        </View>
        <Text className="text-blue-800 mt-1">Days</Text>
      </View>
      
      <View className="items-center mx-2">
        <View className="bg-white w-16 h-16 rounded-lg shadow-sm items-center justify-center">
          <Text className="text-2xl font-bold text-blue-800">{timeRemaining.hours}</Text>
        </View>
        <Text className="text-blue-800 mt-1">Hours</Text>
      </View>
      
      <View className="items-center mx-2">
        <View className="bg-white w-16 h-16 rounded-lg shadow-sm items-center justify-center">
          <Text className="text-2xl font-bold text-blue-800">{timeRemaining.minutes}</Text>
        </View>
        <Text className="text-blue-800 mt-1">Minutes</Text>
      </View>
      
      <View className="items-center mx-2">
        <View className="bg-white w-16 h-16 rounded-lg shadow-sm items-center justify-center">
          <Text className="text-2xl font-bold text-blue-800">{timeRemaining.seconds}</Text>
        </View>
        <Text className="text-blue-800 mt-1">Seconds</Text>
      </View>
    </View>
  );
};

export default CountdownTimer;