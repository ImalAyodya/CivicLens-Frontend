import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
// Add this import to fix the JSX namespace issue
import { JSX } from 'react/jsx-runtime';
import './global.css';

// Utility to merge classNames
const cn = (...args: string[]): string => args.filter(Boolean).join(' ');

// Type definitions for props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

// Custom Button Component
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

  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore - For className prop which might not be standard in React Native
      className={cn(baseClasses, variants[variant], sizes[size], className)}
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

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <View className={cn("bg-white rounded-xl shadow-lg", className)}>
      {children}
    </View>
  );
};

// Input Component
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
        className={cn(
          "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900",
          className
        )}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
      />
    </View>
  );
};

// Form Component
interface LoginFormProps {
  onSubmit?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit = () => {} }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <View className="space-y-1">
      <Input
        label="Email"
        placeholder="user@gmail.com"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        label="Password"
        secureTextEntry={true}
        placeholder="••••••••"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View className="flex-row justify-end mb-6">
        <Button variant="link" className="p-0" onPress={() => {}}>
          <Text className="text-sm text-blue-600">Forgot Password?</Text>
        </Button>
      </View>
      <Button
        variant="primary"
        className="w-full"
        onPress={handleSubmit}
      >
        Log In
      </Button>
    </View>
  );
};

// Google Icon Component
const GoogleIcon: React.FC = () => (
  <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center">
    <Text className="text-white text-xs font-bold">G</Text>
  </View>
);

// App Icon Component
const AppIcon: React.FC = () => (
  <View className="bg-white rounded-2xl w-16 h-16 items-center justify-center shadow-lg mb-4">
    <View className="bg-blue-600 rounded-lg w-10 h-10 items-center justify-center">
      <Text className="text-white text-lg font-bold">📊</Text>
    </View>
  </View>
);

// Main App Component
export default function App(): JSX.Element {
  return (
    <ScrollView
      className="flex-1 bg-blue-100"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex-1 items-center justify-center p-4">
        <View className="w-full max-w-sm">
          {/* Header Section */}
          <View className="items-center mb-8">
            {/* App Icon */}
            <AppIcon />

            <Text className="text-blue-500 text-2xl font-bold mb-1">PollTrack</Text>
            <Text className="text-blue-100 text-sm">Tracking Political Priorities</Text>
          </View>

          {/* Login Card */}
          <Card className="p-6">
            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-900 mb-1">Sign In</Text>
            </View>

            <LoginForm />

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 border-t border-gray-300" />
              <Text className="px-4 text-gray-500 text-sm">or</Text>
              <View className="flex-1 border-t border-gray-300" />
            </View>

            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full mb-6"
              icon={<GoogleIcon />}
            >
              Continue with Google
            </Button>

            {/* Sign Up Link */}
            <View className="items-center flex-row justify-center">
              <Text className="text-gray-600 text-sm">Don't have an account? </Text>
              <TouchableOpacity>
                <Text className="text-blue-600 text-sm font-medium">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Language Selection */}
          <View className="flex-row justify-between items-center mt-6 px-2">
            <Text className="text-blue-100 text-sm">English</Text>
            <View className="flex-row space-x-1">
              <View className="w-2 h-2 bg-white rounded-full" />
              <View className="w-2 h-2 bg-blue-300 rounded-full" />
              <View className="w-2 h-2 bg-blue-300 rounded-full" />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}