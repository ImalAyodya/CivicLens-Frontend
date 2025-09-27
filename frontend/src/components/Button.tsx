import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  onPress = () => {},
  className = ''
}) => {
  const baseClasses = "rounded-lg items-center justify-center";

  const variants = {
    primary: "bg-blue-600",
    outline: "border border-gray-300 bg-white",
    link: ""
  };

  const sizes = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4"
  };

  const textVariants = {
    primary: "text-white font-medium",
    outline: "text-gray-700 font-medium",
    link: "text-blue-600 font-medium"
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={combinedClasses}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center">
        {icon && <View className="mr-2">{icon}</View>}
        <Text className={textVariants[variant]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;