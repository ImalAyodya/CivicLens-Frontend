import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import GoogleIcon from '../components/icons/GoogleIcon';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const API_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/api/users/signup';

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !phoneNumber || !nic || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must be 10 digits.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL, {
        fullName: name,
        email,
        phoneNumber,
        nic,
        password
      });
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error?.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
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
        <View style={{ width: '100%', maxWidth: 400 }}>
          {/* Header Section */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
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

          {/* SignUp Card */}
          <Card className="p-6">
            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-900 mb-1">Create Account</Text>
              <Text className="text-gray-500 text-sm">Sign up to get started</Text>
            </View>

            <View className="space-y-1">
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
              />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
              />
              <Input
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <Input
                label="NIC No"
                value={nic}
                onChangeText={setNic}
              />
              <Input
                label="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <Input
                label="Confirm Password"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              
              <Button
                variant="primary"
                className="w-full mt-2"
                onPress={handleSignUp}
              >
                {loading ? 'Creating...' : 'Create Account'}
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