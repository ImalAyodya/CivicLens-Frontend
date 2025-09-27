import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <View className={`bg-white rounded-xl shadow-lg ${className}`}>
      {children}
    </View>
  );
};

export default Card;