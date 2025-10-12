import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import axios from 'axios';

type Role = {
  _id: string;
  title: string;
  level: string;
  startDate: string;
  endDate?: string;
  region?: string;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'RoleList'>;

const API_BASE_URL = 'http://localhost:5000';

// Dummy data for development mode
const dummyRoles: Role[] = [
  {
    _id: '1',
    title: 'Minister of Health',
    level: 'Cabinet Minister',
    startDate: '2023-01-01',
    endDate: '',
    region: 'National'
  },
  {
    _id: '2',
    title: 'Member of Parliament',
    level: 'MP',
    startDate: '2020-08-01',
    endDate: '',
    region: 'Colombo District'
  },
  {
    _id: '3',
    title: 'Provincial Governor',
    level: 'Provincial',
    startDate: '2022-03-15',
    endDate: '',
    region: 'Western Province'
  },
  {
    _id: '4',
    title: 'Mayor',
    level: 'Local Authority',
    startDate: '2021-11-20',
    endDate: '',
    region: 'Colombo Municipal Council'
  }
];

const RoleListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Check backend connectivity
  const checkBackendConnection = async (): Promise<boolean> => {
    try {
      await axios.get(`${API_BASE_URL}/api/roles`, { timeout: 5000 });
      return true;
    } catch (error) {
      console.log('Backend not available, using development mode');
      return false;
    }
  };

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const connected = await checkBackendConnection();
      setIsBackendConnected(connected);

      if (connected) {
        const response = await axios.get(`${API_BASE_URL}/api/roles`);
        if (__DEV__) {
          console.log('Raw role data from backend:', response.data);
        }
        if (response.data && Array.isArray(response.data)) {
          // Fetch level names for each role that has a level ObjectId
          const sanitizedRoles = await Promise.all(
            response.data.map(async (role: any) => {
              let levelName = 'Unknown Level';
              
              if (__DEV__) {
                console.log('Processing role:', role.title, 'Level ID:', role.level);
              }
              
              // If level is an ObjectId string, fetch the level details
              if (role.level && typeof role.level === 'string') {
                const isObjectId = /^[0-9a-f]{24}$/i.test(role.level);
                
                if (isObjectId) {
                  try {
                    // Fetch level details from the levels endpoint
                    const levelResponse = await axios.get(`${API_BASE_URL}/api/levels/${role.level}`);
                    levelName = levelResponse.data?.name || 'Political Role';
                    
                    if (__DEV__) {
                      console.log('Fetched level name for', role.title, ':', levelName);
                    }
                  } catch (levelError) {
                    console.error('Error fetching level details for role:', role.title, levelError);
                    levelName = 'Political Role';
                  }
                } else {
                  // If it's not an ObjectId, use it directly
                  levelName = role.level;
                }
              } else if (typeof role.level === 'object' && role.level?.name) {
                // Handle if level is already populated as an object
                levelName = role.level.name;
              }
              
              return {
                _id: role._id, // Keep for internal operations only
                title: role.title || 'Unknown Role',
                level: levelName,
                startDate: role.startDate || new Date().toISOString(),
                endDate: role.endDate || '',
                region: role.region || ''
              };
            })
          );
          
          if (__DEV__) {
            console.log('Sanitized role data:', sanitizedRoles);
          }
          setRoles(sanitizedRoles);
        } else {
          console.log('Invalid backend response, using dummy data');
          setRoles(dummyRoles);
        }
      } else {
        // Use dummy data when backend is not available
        setRoles(dummyRoles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      Alert.alert(
        'Error',
        'Failed to load roles. Using offline data.',
        [{ text: 'OK' }]
      );
      setRoles(dummyRoles);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Delete role
  const deleteRole = async (roleId: string) => {
    if (!isBackendConnected) {
      Alert.alert(
        'Development Mode',
        'Backend not connected. In production, this would delete the role.',
        [{ text: 'OK' }]
      );
      // Simulate deletion in development mode
      setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
      return;
    }

    try {
      if (__DEV__) {
        console.log('Deleting role with ID:', roleId);
        console.log('DELETE URL:', `${API_BASE_URL}/api/roles/${roleId}`);
      }
      
      const response = await axios.delete(`${API_BASE_URL}/api/roles/${roleId}`);
      
      if (__DEV__) {
        console.log('Delete response:', response.status, response.data);
      }
      
      // Remove the deleted role from local state
      setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
      
      Alert.alert(
        'Success', 
        'Role deleted successfully',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Error deleting role:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to delete role. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          errorMessage = 'Role not found. It may have already been deleted.';
          // Remove from local state since it doesn't exist on server
          setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
        } else if (status === 403) {
          errorMessage = 'You do not have permission to delete this role.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
        
        if (__DEV__) {
          console.log('Delete error response:', status, data);
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  // Handle role deletion with confirmation
  const handleDeleteRole = (roleId: string, roleTitle: string) => {
    Alert.alert(
      'Delete Role',
      `Are you sure you want to delete "${roleTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteRole(roleId)
        }
      ]
    );
  };

  // Refresh data
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRoles();
    setRefreshing(false);
  };

  // Load data on component mount and when screen comes into focus
  useEffect(() => {
    fetchRoles();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRoles();
    }, [])
  );

  const renderRole = ({ item, index }: { item: Role; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="briefcase" size={20} color="#f39c12" />
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.level}>{item.level}</Text>
          <Text style={styles.date}>
            {new Date(item.startDate).toLocaleDateString()} →{" "}
            {item.endDate ? new Date(item.endDate).toLocaleDateString() : "Present"}
          </Text>
          {item.region && <Text style={styles.region}>📍 {item.region}</Text>}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteRole(item._id, item.title)}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Role Management</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading roles...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Role Management</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Backend Status Banner */}
      {!isBackendConnected && (
        <View style={styles.statusBanner}>
          <Ionicons name="warning" size={16} color="#f39c12" />
          <Text style={styles.statusText}>Development Mode - Using offline data</Text>
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007bff']}
            tintColor="#007bff"
          />
        }
      >
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Total Roles: {roles.length}</Text>
        </View>

        <FlatList
          data={roles}
          keyExtractor={(item, index) => `role-${index}`}
          renderItem={renderRole}
          scrollEnabled={false}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddRole")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ffeaa7',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#856404',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  info: { 
    flexDirection: "column",
    marginLeft: 12,
    flex: 1,
  },
  title: { 
    fontWeight: "bold", 
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  level: { 
    color: "#007bff", 
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: { 
    fontSize: 12, 
    color: "#666",
    marginBottom: 4,
  },
  region: { 
    fontSize: 12, 
    color: "#333",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffe6e6',
  },
  addBtn: { 
    position: "absolute", 
    bottom: 30, 
    right: 20, 
    backgroundColor: "#007bff", 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: "center", 
    alignItems: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default RoleListScreen;
