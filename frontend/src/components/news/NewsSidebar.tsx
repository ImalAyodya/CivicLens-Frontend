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
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
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
    // Screens that can be navigated to
    const implementedScreens: (keyof RootStackParamList)[] = [
      'Home', 'NewsFeed', 'Login', 'SignUp', 'Notifications', 
      'ElectionCountdown', 'PastElections', 'ElectionMap',
      'Dashboard', 'Hierarchy', 'Comparison', 'PoliticalQuiz',
      'PoliBot', 'QuizHistory', 'HelpAndSupport', 'Profile',
      'PoliticianPromises'
    ];
    
    if (implementedScreens.includes(screen)) {
      navigation.navigate(screen as any);
    } else {
      console.log(`Screen ${screen} requires parameters or is not implemented yet`);
    }
    
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
        accessibilityViewIsModal={true}
        accessible={true}
        importantForAccessibility="yes"
      >
        {/* Sidebar Header */}
        <View className="bg-blue-600 p-4 pt-12">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="bg-white rounded-lg w-10 h-10 items-center justify-center mr-3">
                <Ionicons name="stats-chart-outline" size={22} color="#2563EB" />
              </View>
              <Text className="text-white text-xl font-bold">CivicLens</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-blue-100 mt-2">Tracking Political Priorities</Text>
        </View>

        {/* Menu Items */}
        <ScrollView className="flex-1">
          {/* Core Navigation Items */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('Home')}
          >
            <View className="w-10 items-center">
              <Ionicons name="home-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('Dashboard')}
          >
            <View className="w-10 items-center">
              <Ionicons name="grid-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('Hierarchy')}
          >
            <View className="w-10 items-center">
              <Ionicons name="git-network-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Political Hierarchy</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('Comparison')}
          >
            <View className="w-10 items-center">
              <Ionicons name="people-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Compare Politicians</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('PoliticalQuiz')}
          >
            <View className="w-10 items-center">
              <Ionicons name="help-circle-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Political Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('QuizHistory')}
          >
            <View className="w-10 items-center">
              <Ionicons name="time-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Quiz History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('PoliBot')}
          >
            <View className="w-10 items-center">
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">PoliBot Assistant</Text>
          </TouchableOpacity>

          {/* Performance Features */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('PoliticianPromises')}
          >
            <View className="w-10 items-center">
              <MaterialIcons name="assignment" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Politician Promises</Text>
          </TouchableOpacity>

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

          {/* Election Items */}
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

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('Notifications')}
          >
            <View className="w-10 items-center">
              <Ionicons name="notifications-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Election Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('PastElections')}
          >
            <View className="w-10 items-center">
              <Ionicons name="albums-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Past Elections</Text>
          </TouchableOpacity>

          {/* Additional Features (these might not be implemented yet) */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => console.log('Growth News - not implemented yet')}
          >
            <View className="w-10 items-center">
              <Ionicons name="trending-up" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Growth News</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => console.log('Ministry Performance - not implemented yet')}
          >
            <View className="w-10 items-center">
              <FontAwesome5 name="chart-bar" size={20} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Ministry Performance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => console.log('WatchList - not implemented yet')}
          >
            <View className="w-10 items-center">
              <Ionicons name="eye" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">WatchList</Text>
          </TouchableOpacity>

          {/* Supporting Features */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('HelpAndSupport')}
          >
            <View className="w-10 items-center">
              <Ionicons name="information-circle-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('Login')}
          >
            <View className="w-10 items-center">
              <Ionicons name="log-out-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Sign Out</Text>
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
          <View className="mt-2">
            <Text className="text-gray-500 text-xs">Version 1.0.0</Text>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 50,
  },
});

export default NewsSidebar;