import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface InputProps {
  label?: string;
  secureTextEntry?: boolean;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  secureTextEntry = false,
  placeholder,
  value,
  onChangeText = () => {},
  className = ''
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">
          {label}
        </Text>
      )}
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 ${className}`}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
      />
    </View>
  );
};

export default Input;