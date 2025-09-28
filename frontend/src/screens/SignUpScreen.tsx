import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import GoogleIcon from '../components/icons/GoogleIcon';
import AppIcon from '../components/icons/AppIcon';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    console.log('Sign up attempted with:', { name, email });
    // Add your registration logic here
  };

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
            <AppIcon />
            <Text className="text-blue-500 text-2xl font-bold mb-1">CivicLence</Text>
            <Text className="text-blue-100 text-sm">Tracking Political Priorities</Text>
          </View>

          {/* SignUp Card */}
          <Card className="p-6">
            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-900 mb-1">Create Account</Text>
              <Text className="text-gray-500 text-sm">Sign up to get started</Text>
            </View>

            <View className="space-y-1">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <Input
                label="Email"
                placeholder="you@example.com"
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
              <Input
                label="Confirm Password"
                secureTextEntry={true}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              
              <Button
                variant="primary"
                className="w-full mt-2"
                onPress={handleSignUp}
              >
                Create Account
              </Button>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 border-t border-gray-300" />
              <Text className="px-4 text-gray-500 text-sm">or</Text>
              <View className="flex-1 border-t border-gray-300" />
            </View>

            {/* Google SignUp */}
            <Button
              variant="outline"
              className="w-full mb-6"
              icon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>

            {/* Sign In Link */}
            <View className="items-center flex-row justify-center">
              <Text className="text-gray-600 text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-blue-600 text-sm font-medium">Sign In</Text>
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
};

export default SignUpScreen;