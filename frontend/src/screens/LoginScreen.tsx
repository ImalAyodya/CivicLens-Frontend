import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import GoogleIcon from '../components/icons/GoogleIcon';
import AppIcon from '../components/icons/AppIcon';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempted with:', email);
    // Add your authentication logic here
    navigation.navigate('Home');
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
            <Text className="text-blue-500 text-2xl font-bold mb-1">CivicLens</Text>
            <Text className="text-blue-100 text-sm">Tracking Political Priorities</Text>
          </View>

          {/* Login Card */}
          <Card className="p-6">
            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-900 mb-1">Sign In</Text>
            </View>

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
                onPress={handleLogin}
              >
                Log In
              </Button>
            </View>

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
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
};

export default LoginScreen;