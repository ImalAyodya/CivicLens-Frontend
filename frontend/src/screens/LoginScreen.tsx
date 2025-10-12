import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import GoogleIcon from '../components/icons/GoogleIcon';
import AppIcon from '../components/icons/AppIcon';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const API_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/api/users/login';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // Add error message state

  const handleLogin = async () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isAdminMode) {
        if (email === 'admin@gmail.com' && password === 'admin') {
          navigation.navigate('AdminDashboard');
        } else {
          setErrorMsg('Invalid Credentials, please try again');
        }
      } else {
        const response = await axios.post(API_BASE_URL, { email, password });
        const token = response.data.token;
        await AsyncStorage.setItem('token', token);
        setErrorMsg('');
        navigation.navigate('Home');
      }
    } catch (error: any) {
      setErrorMsg('Invalid Credentials, please try again');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setEmail('');
    setPassword('');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#2563EB' }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{
        minHeight: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#2563EB'
      }}>
        <View className="w-full max-w-sm">
          {/* Header Section */}
          <View className="items-center mb-8">
            <View style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 16,
              elevation: 12,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 100,
              padding: 16,
              marginBottom: 18,
            }}>
              <Image
                source={require('../../assets/logo.png')}
                style={{ width: 120, height: 120, resizeMode: 'contain' }}
              />
            </View>
            <Text style={{
              color: '#fff',
              fontSize: 36,
              fontWeight: 'bold',
              letterSpacing: 2,
              marginBottom: 8,
              textAlign: 'center',
              textShadowColor: 'rgba(0,0,0,0.3)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}>
              CIVICLENS
            </Text>
            <Text style={{
              color: '#dbeafe',
              fontSize: 16,
              letterSpacing: 1,
              textAlign: 'center',
              marginBottom: 2,
              fontWeight: '500',
            }}>
              Your Lens on Politics
            </Text>
          </View>

          {/* Login Card */}
          <Card className="p-6">
            <View className="mb-6 flex-row justify-between items-center">
              <Text className="text-xl font-semibold text-gray-900 mb-1">
                {isAdminMode ? 'Admin Login' : 'Sign In'}
              </Text>
              
              {/* Admin mode toggle button */}
              <TouchableOpacity
                onPress={toggleAdminMode}
                className={`px-3 py-1 rounded-full ${isAdminMode ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <Text className={`text-xs font-medium ${isAdminMode ? 'text-white' : 'text-gray-600'}`}>
                  {isAdminMode ? 'Admin Mode' : 'Admin Login'}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-1">
              <Input
                label="Email"
                placeholder={isAdminMode ? "admin@gmail.com" : "user@gmail.com"}
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
              {/* Show error message if exists */}
              {errorMsg ? (
                <Text style={{ color: '#B91C1C', marginBottom: 8, textAlign: 'center' }}>
                  {errorMsg}
                </Text>
              ) : null}
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
                {loading ? 'Logging in...' : isAdminMode ? 'Admin Login' : 'Log In'}
              </Button>
            </View>

            {/* Divider - Only show for regular users */}
            {!isAdminMode && (
              <>
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
              </>
            )}
            
            {/* Admin mode hint - Only show in admin mode */}
            {isAdminMode && (
              <View className="mt-4 bg-blue-50 p-2 rounded">
                <Text className="text-xs text-blue-700">
                  Admin credentials: admin@gmail.com / admin
                </Text>
              </View>
            )}
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