import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useAppNavigation() {
  const navigation = useNavigation<NavigationProp>();
  
  const handleTabPress = (tabName: string, currentScreen: string) => {
    // Only navigate if we're not already on that screen
    if (tabName !== currentScreen) {
      switch (tabName) {
        case 'Home':
          navigation.navigate('Home');
          break;
        case 'NewsFeed':
          navigation.navigate('NewsFeed');
          break;
        case 'DirectoryScreen':
          navigation.navigate('DirectoryScreen');
          break;
        // Add other cases as screens are implemented
        default:
          console.log(`Screen ${tabName} not implemented yet`);
      }
    }
    
    return tabName; // Return the tab name for setting activeTab
  };
  
  return { handleTabPress };
}