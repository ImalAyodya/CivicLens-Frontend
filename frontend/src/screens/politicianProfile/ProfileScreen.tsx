import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import InfoRow from "../../components/politicianProfile/InfoRow";
import RoleRow from "../../components/politicianProfile/RoleRow";
import ElectionRow from "../../components/politicianProfile/ElectionRow";
import { politician as dummyPolitician } from "../../constants/politicianData";
import { politicians as dummyPoliticians } from "../../constants/dummyData";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import axios from "axios";
// Import RootStackParamList as a type from "../../../App"
//import type { RootStackParamList } from "../../../App";

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "PoliticianProfile">;

const API_BASE_URL = "http://localhost:5000";

const ProfileScreen: React.FC = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList>["navigation"]>();
  
  const [politician, setPolitician] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  // Get politician ID from route params
  const politicianId = route.params?.id;

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/api/politicians`, { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        setBackendStatus('disconnected');
        if (__DEV__) {
          console.log("Backend not available - running in development mode");
        }
      }
    };

    checkBackendConnection();
  }, []);

  // Fetch politician profile from backend when backend status changes
  useEffect(() => {
    const fetchPoliticianProfile = async () => {
      if (backendStatus === 'connected' && politicianId) {
        try {
          console.log("Fetching politician profile from:", `${API_BASE_URL}/api/politicians/${politicianId}`);
          const response = await axios.get(`${API_BASE_URL}/api/politicians/${politicianId}`);
          console.log("Politician profile response:", response.data);
          
          // Transform backend data to match frontend format
          const transformedPolitician = {
            name: response.data.name,
            role: response.data.currentRole?.title || response.data.currentRole || "Unknown Role",
            dob: response.data.dateOfBirth || "Unknown",
            region: response.data.region || "Unknown",
            serviceYears: response.data.yearsOfService || "Unknown",
            education: response.data.education || "Unknown",
            image: response.data.image || require('../../../assets/images/politician2.jpg'),
            party: {
              name: response.data.party?.fullName || response.data.party || "Unknown Party",
              short: response.data.party?.abbreviation || response.data.party?.short || "UNK",
              founded: response.data.party?.founded || "Unknown",
              ideology: response.data.party?.ideology || "Unknown",
            },
            roles: response.data.roles || [],
            achievements: response.data.achievements || [],
            elections: response.data.elections || [],
          };
          
          setPolitician(transformedPolitician);
        } catch (error) {
          console.log("Error fetching politician profile:", error);
          // Fallback to dummy data if API fails
          const fallbackPolitician = politicianId 
            ? dummyPoliticians.find(p => p.id === politicianId) 
            : null;
          
          if (fallbackPolitician) {
            // Transform dummy data to match expected format
            setPolitician({
              ...dummyPolitician,
              ...dummyPolitician,
              dob: "Unknown",
              serviceYears: "Unknown", 
              education: "Unknown",
              party: {
                name: fallbackPolitician.party,
                short: fallbackPolitician.party.substring(0, 3).toUpperCase(),
                founded: "Unknown",
                ideology: "Unknown",
              },
              roles: [],
              achievements: [],
              elections: [],
            });
          } else {
            setPolitician(dummyPolitician);
          }
        }
      } else if (backendStatus === 'disconnected') {
        // Use dummy data when backend is disconnected
        const fallbackPolitician = politicianId 
          ? dummyPoliticians.find(p => p.id === politicianId) 
          : null;
        
        if (fallbackPolitician) {
          // Transform dummy data to match expected format
          setPolitician({
            ...fallbackPolitician,
            dob: "Unknown",
            serviceYears: "Unknown",
            education: "Unknown", 
            party: {
              name: fallbackPolitician.party,
              short: fallbackPolitician.party.substring(0, 3).toUpperCase(),
              founded: "Unknown",
              ideology: "Unknown",
            },
            roles: [],
            achievements: [],
            elections: [],
          });
        } else {
          setPolitician(dummyPolitician);
        }
      }
      setLoading(false);
    };

    if (backendStatus !== 'checking') {
      fetchPoliticianProfile();
    }
  }, [backendStatus, politicianId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading politician profile...</Text>
      </View>
    );
  }

  if (!politician) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="person-remove" size={50} color="#ccc" />
        <Text style={styles.errorText}>Politician not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

   return (
         <ScrollView className="flex-1 bg-gray-50">
         {/* Header Banner */}
         <View className="relative">
           {/* <Image
             source={{ uri: "https://your-cdn.com/politician-banner.jpg" }}
             className="w-full h-56"
           /> */}
           <Image
          source={politician.image || require('../../../assets/images/politician2.jpg')}
          style={styles.profileImage}
          resizeMode="cover"
        />
           <LinearGradient
             colors={["transparent", "rgba(0,0,0,0.7)"]}
             className="absolute bottom-0 left-0 right-0 h-24"
           />
             <TouchableOpacity 
          className="absolute top-5 left-4 bg-black/40 p-2 rounded-full"
          onPress={() => navigation.navigate("DirectoryScreen")}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
           {/* <TouchableOpacity className="absolute top-5 left-4 bg-black/40 p-2 rounded-full">
             <Ionicons name="arrow-back" size={20} color="white" />
           </TouchableOpacity> */}
   
           {/* Name + Party Badge */}
           <View className="absolute bottom-4 left-4">
             <View className="flex-row items-center space-x-2">
               <View className="bg-blue-600 px-2 py-1 rounded-md">
                 <Text className="text-white text-xs font-semibold">
                   {politician.party.short}
                 </Text>
               </View>
             </View>
             <Text className="text-white text-2xl font-bold mt-2">
               {politician.name}
             </Text>
             <Text className="text-gray-200 text-sm">{politician.role}</Text>
           </View>
         </View>

         {/* Backend Status Indicator */}
         {backendStatus === 'disconnected' && __DEV__ && (
           <View style={styles.statusBanner}>
             <Ionicons name="warning" size={16} color="#ff6b35" />
             <Text style={styles.statusText}>
               Backend disconnected - Using sample data
             </Text>
           </View>
         )}
   
         {/* Personal Information */}
         <View className="bg-white rounded-2xl shadow p-4 m-4">
           <Text className="text-lg font-semibold mb-3">Personal Information</Text>
           <InfoRow label="Date of Birth" value={politician.dob} />
           <InfoRow label="Region" value={politician.region} />
           <InfoRow label="Years of Service" value={politician.serviceYears} />
           <InfoRow label="Education" value={politician.education} />
         </View>
   
         {/* Party Details */}
         <View className="bg-white rounded-2xl shadow p-4 m-4">
           <Text className="text-lg font-semibold mb-3">Party Details</Text>
           <View className="flex-row items-center space-x-3">
             <View className="bg-blue-600 px-3 py-2 rounded-md">
               <Text className="text-white font-semibold">{politician.party.short}</Text>
             </View>
             <View>
               <Text className="font-semibold">{politician.party.name}</Text>
               <Text className="text-gray-500 text-sm">Founded: {politician.party.founded}</Text>
               <Text className="text-gray-500 text-sm">{politician.party.ideology}</Text>
             </View>
           </View>
         </View>
   
         {/* Political Roles */}
         <View className="bg-white rounded-2xl shadow p-4 m-4">
           <Text className="text-lg font-semibold mb-3">Political Roles</Text>
           {politician.roles && politician.roles.length > 0 ? (
             politician.roles.map((role: any, idx: number) => (
               <RoleRow key={idx} title={role.title} years={role.years} active={role.active} />
             ))
           ) : (
             <Text className="text-gray-500 text-sm">No role information available</Text>
           )}
         </View>
   
         {/* Achievements */}
         <View className="bg-white rounded-2xl shadow p-4 m-4">
           <Text className="text-lg font-semibold mb-3">Achievements & History</Text>
           {politician.achievements && politician.achievements.length > 0 ? (
             politician.achievements.map((ach: string, idx: number) => (
               <Text key={idx} className="text-gray-600 text-sm leading-relaxed mb-1">
                 • {ach}
               </Text>
             ))
           ) : (
             <Text className="text-gray-500 text-sm">No achievements information available</Text>
           )}
         </View>
   
         {/* Election Wins */}
         <View className="bg-white rounded-2xl shadow p-4 m-4 mb-8">
           <Text className="text-lg font-semibold mb-3">Past Election Wins</Text>
           {politician.elections && politician.elections.length > 0 ? (
             politician.elections.map((e: any, idx: number) => (
               <ElectionRow
                 key={idx}
                 year={e.year}
                 position={e.position}
                 party={e.party}
                 votes={e.votes}
               />
             ))
           ) : (
             <Text className="text-gray-500 text-sm">No election information available</Text>
           )}
         </View>
       </ScrollView>
       
     );
 
};

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  profileImage: {
    width: "100%",
    height: 224, // 56 * 4 (h-56 in Tailwind is 224px)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b35',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#856404',
    flex: 1,
  },
});

export default ProfileScreen;