import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewsFeed'>;

interface NewsSidebarProps {
  visible: boolean;
  onClose: () => void;
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp>();
  const screenWidth = Dimensions.get('window').width;
  const translateX = React.useRef(new Animated.Value(-screenWidth)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 11,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, screenWidth, translateX]);

  const navigateTo = (screen: keyof RootStackParamList) => {
    // Screens that don't require parameters
    const screensWithoutParams: (keyof RootStackParamList)[] = [
      'Home', 'NewsFeed', 'Login', 'SignUp', 'Notifications', 
      'ElectionCountdown', 'PastElections', 'ElectionMap'
    ];
    
    if (screensWithoutParams.includes(screen)) {
      // Type assertion to make TypeScript happy
      navigation.navigate(screen as any);
    } else {
      console.log(`Screen ${screen} requires parameters or is not implemented yet`);
    }
    
    onClose();
  };

  // Function to navigate to screens not yet implemented
  const navigateToFutureScreen = (screenName: string) => {
    console.log(`Navigate to ${screenName} - not implemented yet`);
    onClose();
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50">
      <TouchableOpacity
        className="absolute inset-0 bg-black/30"
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          { transform: [{ translateX }] },
          styles.sidebar,
        ]}
      >
        {/* Sidebar Header */}
        <View className="bg-blue-600 p-4 pt-12">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-white rounded-lg w-10 h-10 items-center justify-center mr-3">
                <Text className="text-xl">📰</Text>
              </View>
              <Text className="text-white text-xl font-bold">News & Elections</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView className="flex-1">
          {/* News Feed */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('NewsFeed')}
          >
            <View className="w-10 items-center">
              <Ionicons name="newspaper-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">News Feed</Text>
          </TouchableOpacity>
          {/* Election Countdown */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('ElectionCountdown')}
          >
            <View className="w-10 items-center">
              <Ionicons name="timer-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Election Countdown</Text>
            <View className="ml-auto bg-blue-100 px-2 py-1 rounded-full">
              <Text className="text-xs text-blue-700">42 days</Text>
            </View>
          </TouchableOpacity>

          {/* Election Notifications */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('Notifications')}
          >
            <View className="w-10 items-center">
              <Ionicons name="notifications-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Election Notifications</Text>
          </TouchableOpacity>

          {/* Past Elections */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('PastElections')}
          >
            <View className="w-10 items-center">
              <Ionicons name="albums-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Past Elections</Text>
          </TouchableOpacity>

          {/* Election Maps */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('ElectionMap')}
          >
            <View className="w-10 items-center">
              <Ionicons name="map-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Election Maps</Text>
          </TouchableOpacity>

          {/* Voting Information */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateToFutureScreen('Voting Information')}
          >
            <View className="w-10 items-center">
              <Ionicons name="information-circle-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Voting Information</Text>
          </TouchableOpacity>

          {/* Candidate Profiles */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateToFutureScreen('Candidate Profiles')}
          >
            <View className="w-10 items-center">
              <Ionicons name="people-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Candidate Profiles</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Election Status */}
        <View className="bg-gray-50 p-4">
          <Text className="text-sm text-gray-500 mb-1">Next General Election</Text>
          <Text className="text-base text-gray-900 font-medium mb-2">Presidential Election 2024</Text>
          <View className="bg-blue-50 rounded-lg p-3">
            <View className="flex-row justify-between">
              <Text className="text-blue-800 font-medium">Countdown</Text>
              <Text className="text-blue-800 font-bold">42 days</Text>
            </View>
            <View className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <View className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default NewsSidebar;