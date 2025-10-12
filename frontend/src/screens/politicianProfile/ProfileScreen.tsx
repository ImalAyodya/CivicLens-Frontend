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

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "PoliticianDetails">;

const API_BASE_URL = "http://localhost:5000";

const ProfileScreen: React.FC = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<NativeStackScreenProps<RootStackParamList>["navigation"]>();
  
  const [politician, setPolitician] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  // Get politician ID from route params
  const politicianId = route.params?.id;

  // Helper function to get party colors
  const getPartyColor = (partyName: string) => {
    const partyColors: { [key: string]: string } = {
      'United National Party': '#008000', // Green
      'UNP': '#008000',
      'Sri Lanka Podujana Peramuna': '#8B0000', // Dark Red
      'SLPP': '#8B0000',
      'Podujana Peramuna': '#8B0000',
      'Samagi Jana Balawegaya': '#FF6B35', // Orange
      'SJB': '#FF6B35',
      'Janatha Vimukthi Peramuna': '#DC143C', // Crimson
      'JVP': '#DC143C',
      'Tamil National Alliance': '#FFD700', // Gold
      'TNA': '#FFD700',
      'All Ceylon Tamil Congress': '#4169E1', // Royal Blue
      'ACTC': '#4169E1',
      'Sri Lanka Freedom Party': '#0000FF', // Blue
      'SLFP': '#0000FF',
      'Independent': '#6B7280', // Gray
    };
    
    // Check for exact match first
    if (partyColors[partyName]) {
      return partyColors[partyName];
    }
    
    // Check for partial matches
    for (const [key, color] of Object.entries(partyColors)) {
      if (partyName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(partyName.toLowerCase())) {
        return color;
      }
    }
    
    return '#3B82F6'; // Default blue
  };

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
          
          // Fetch politician data, roles, and parties concurrently
          const [politicianResponse, rolesResponse, partiesResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/politicians/${politicianId}`),
            axios.get(`${API_BASE_URL}/api/politicians/${politicianId}/roles`).catch(error => {
              console.log("Roles endpoint failed, using fallback:", error);
              return { data: [] };
            }),
            axios.get(`${API_BASE_URL}/api/parties`).catch(error => {
              console.log("Parties endpoint failed, using fallback:", error);
              return { data: [] };
            })
          ]);
          
          console.log("Politician profile response:", politicianResponse.data);
          console.log("Politician roles response:", rolesResponse.data);
          console.log("Parties response:", partiesResponse.data);
          
          const politicianData = politicianResponse.data;
          const rolesData = rolesResponse.data || [];
          const partiesData = partiesResponse.data || [];
          
          // Transform backend data to match frontend format
          const politicianPartyId = politicianData.party?._id || politicianData.party;
          
          // Find the full party details from the parties list
          const fullPartyData = partiesData.find((party: any) => 
            party._id === politicianPartyId || 
            party.fullName === politicianData.party?.fullName ||
            party.abbreviation === politicianData.party?.abbreviation
          );
          
          const partyName = fullPartyData?.fullName || politicianData.party?.fullName || politicianData.party || "Unknown Party";
          const partyColor = fullPartyData?.color || getPartyColor(partyName);
          
          const transformedPolitician = {
            name: politicianData.name,
            // Enhanced role handling - try multiple possible data structures
            role: politicianData.currentRole?.title || 
                  politicianData.currentRole?.name || 
                  politicianData.currentRole || 
                  politicianData.level?.name ||
                  politicianData.position?.title ||
                  politicianData.position ||
                  "Unknown Role",
            dob: politicianData.dateOfBirth || "Unknown",
            region: politicianData.region || "Unknown",
            serviceYears: politicianData.yearsOfService || "Unknown",
            education: politicianData.education || "Unknown",
            image: politicianData.image || 'https://via.placeholder.com/400x224/cccccc/666666?text=No+Image',
            party: {
              name: partyName,
              short: fullPartyData?.abbreviation || politicianData.party?.abbreviation || politicianData.party?.short || partyName.substring(0, 3).toUpperCase(),
              founded: fullPartyData?.createdAt ? new Date(fullPartyData.createdAt).getFullYear().toString() : "Unknown",
              ideology: politicianData.party?.ideology || "Unknown",
              color: partyColor,
              logo: fullPartyData?.logo || null,
              founder: fullPartyData?.founder || "Unknown",
            },
            // Use roles from dedicated endpoint
            roles: rolesData.length > 0 ? rolesData.map((role: any) => ({
              title: role.role?.name || role.title || role.name || "Unknown Role",
              years: role.yearsInService || role.years || "Unknown",
              active: role.isActive !== undefined ? role.isActive : true,
              level: role.level?.name || role.level || undefined,
              startDate: role.startDate || undefined,
              endDate: role.endDate || undefined
            })) : (politicianData.currentRole ? [{
              title: politicianData.currentRole?.title || politicianData.currentRole?.name || politicianData.currentRole,
              years: politicianData.yearsInService || politicianData.yearsOfService || "Current",
              active: true
            }] : []),
            achievements: politicianData.achievements || [],
            elections: politicianData.elections || [],
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
            const partyName = fallbackPolitician.party;
            setPolitician({
              ...fallbackPolitician,
              role: fallbackPolitician.role || "Member of Parliament",
              dob: "Unknown",
              serviceYears: "Unknown", 
              education: "Unknown",
              party: {
                name: partyName,
                short: partyName.substring(0, 3).toUpperCase(),
                founded: "Unknown",
                ideology: "Unknown",
                color: getPartyColor(partyName),
                logo: null,
                founder: "Unknown",
              },
              roles: [{
                title: fallbackPolitician.role || "Member of Parliament",
                years: "2020-Present",
                active: true
              }],
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
          const partyName = fallbackPolitician.party;
          setPolitician({
            ...fallbackPolitician,
            role: fallbackPolitician.role || "Member of Parliament",
            dob: "Unknown",
            serviceYears: "Unknown",
            education: "Unknown", 
            party: {
              name: partyName,
              short: partyName.substring(0, 3).toUpperCase(),  
              founded: "Unknown",
              ideology: "Unknown",
              color: getPartyColor(partyName),
              logo: null,
              founder: "Unknown",
            },
            roles: [{
              title: fallbackPolitician.role || "Member of Parliament",
              years: "2020-Present",
              active: true
            }],
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
          source={{ uri: politician.image || 'https://via.placeholder.com/400x224/cccccc/666666?text=No+Image' }}
          style={styles.profileImage}
          resizeMode="cover"
        />
           <LinearGradient
             colors={["transparent", "rgba(0,0,0,0.7)"]}
             className="absolute bottom-0 left-0 right-0 h-24"
           />
             <TouchableOpacity 
          className="absolute top-5 left-4 bg-black/40 p-2 rounded-full"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
           {/* <TouchableOpacity className="absolute top-5 left-4 bg-black/40 p-2 rounded-full">
             <Ionicons name="arrow-back" size={20} color="white" />
           </TouchableOpacity> */}
   
           {/* Name + Party Badge */}
           <View className="absolute bottom-4 left-4">
             <View className="flex-row items-center space-x-2">
               <View style={{ backgroundColor: politician.party.color || '#3B82F6' }} className="px-2 py-1 rounded-md">
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
           {/* <InfoRow label="Education" value={politician.education} /> */}
         </View>
   
         {/* Party Details */}
         <View className="bg-white rounded-2xl shadow p-4 m-4">
           <Text className="text-lg font-semibold mb-3">Party Details</Text>
           <View className="flex-row items-center space-x-3 mb-3">
             {politician.party.logo ? (
               <Image 
                 source={{ uri: politician.party.logo }} 
                 className="w-12 h-12 rounded-lg"
                 resizeMode="contain"
               />
             ) : (
               <View style={{ backgroundColor: politician.party.color || '#3B82F6' }} className="w-12 h-12 px-3 py-2 rounded-lg items-center justify-center">
                 <Text className="text-white font-bold text-sm">{politician.party.short}</Text>
               </View>
             )}
             <View className="flex-1">
               <Text className="font-semibold text-lg">{politician.party.name}</Text>
               <Text className="text-gray-600 text-sm">({politician.party.short})</Text>
             </View>
           </View>
           
           {/* <View className="space-y-2">
             <View className="flex-row items-center">
               <Ionicons name="person-outline" size={16} color="#6B7280" />
               <Text className="text-gray-500 text-sm ml-2">Founder: {politician.party.founder}</Text>
             </View>
             <View className="flex-row items-center">
               <Ionicons name="calendar-outline" size={16} color="#6B7280" />
               <Text className="text-gray-500 text-sm ml-2">Founded: {politician.party.founded}</Text>
             </View>
             <View className="flex-row items-center">
               <Ionicons name="color-palette-outline" size={16} color="#6B7280" />
               <Text className="text-gray-500 text-sm ml-2">Party Color: {politician.party.color}</Text>
             </View>
             {politician.party.ideology !== "Unknown" && (
               <View className="flex-row items-center">
                 <Ionicons name="library-outline" size={16} color="#6B7280" />
                 <Text className="text-gray-500 text-sm ml-2">Ideology: {politician.party.ideology}</Text>
               </View>
             )}
           </View> */}
         </View>
   
         {/* Political Roles */}
         <View className="bg-white rounded-2xl shadow p-4 m-4">
           <Text className="text-lg font-semibold mb-3">Political Roles</Text>
           {politician.roles && politician.roles.length > 0 ? (
             politician.roles.map((role: any, idx: number) => (
               <View key={idx} className="mb-3 last:mb-0">
                 <RoleRow 
                   title={role.title} 
                   years={role.years} 
                   active={role.active} 
                 />
                 {role.level && (
                   <Text className="text-xs text-gray-500 mt-1 ml-2">Level: {role.level}</Text>
                 )}
                 {(role.startDate || role.endDate) && (
                   <Text className="text-xs text-gray-500 mt-1 ml-2">
                     {role.startDate && `Started: ${new Date(role.startDate).toLocaleDateString()}`}
                     {role.startDate && role.endDate && ' • '}
                     {role.endDate && `Ended: ${new Date(role.endDate).toLocaleDateString()}`}
                   </Text>
                 )}
               </View>
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