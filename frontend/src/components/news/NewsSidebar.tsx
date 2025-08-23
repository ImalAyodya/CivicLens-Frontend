import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions
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
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, screenWidth, translateX]);

  const navigateTo = (screen: keyof RootStackParamList) => {
    // Screens that don't require parameters
    const screensWithoutParams: (keyof RootStackParamList)[] = [
      'Home', 'NewsFeed', 'Login', 'SignUp', 'Notifications', 
      'ElectionCountdown', 'PastElections', 'VoterEducation', 'ElectionLaws'
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
    <View style={styles.container}>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX }] }
        ]}
      >
        {/* Header */}
        <View className="px-4 py-5 bg-blue-600">
          <Text className="text-white text-xl font-bold mb-1">News & Elections</Text>
          <Text className="text-blue-100">Stay informed, vote wisely</Text>
        </View>
        
        {/* Menu Items */}
        <View className="flex-1">
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
          
          {/* Election Laws & Regulations */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('ElectionLaws')}
          >
            <View className="w-10 items-center">
              <Ionicons name="document-text-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Election Laws</Text>
          </TouchableOpacity>
          
          {/* Voter Education */}
          <TouchableOpacity 
            className="flex-row items-center px-4 py-4 border-b border-gray-200"
            onPress={() => navigateTo('VoterEducation')}
          >
            <View className="w-10 items-center">
              <Ionicons name="school-outline" size={22} color="#2563EB" />
            </View>
            <Text className="text-gray-800 ml-3 font-medium">Voter Education</Text>
          </TouchableOpacity>
        </View>
        
        {/* Footer */}
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => navigateTo('Home')}
          >
            <Ionicons name="home-outline" size={22} color="#2563EB" />
            <Text className="text-blue-600 ml-3 font-medium">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // High z-index to ensure it's above everything
    elevation: 1000, // For Android
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    elevation: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'white',
    zIndex: 1001, // Higher than backdrop
    elevation: 1001, // For Android
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default NewsSidebar;