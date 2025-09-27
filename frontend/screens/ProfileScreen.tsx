import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import InfoRow from "../components/InfoRow";
import RoleRow from "../components/RoleRow";
import ElectionRow from "../components/ElectionRow";
import { politician } from "../constants/politicianData";
import { politicians } from "../constants/dummyData";
import { RootTabParamList } from "../navigation/AppNavigator";

type ProfileScreenRouteProp = RouteProp<RootTabParamList, "PoliticianProfile">;

const ProfileScreen: React.FC = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation();
  
  // Get politician data based on ID from route params
  const politicianId = route.params?.id;
  const currentPolitician = politicianId 
    ? politicians.find(p => p.id === politicianId) 
    : null;

  // Use the found politician or fallback to default
  const displayPolitician = currentPolitician || politician;

  return (
      <ScrollView className="flex-1 bg-gray-50">
      {/* Header Banner */}
      <View className="relative">
        <Image
          source={{ uri: "https://your-cdn.com/politician-banner.jpg" }}
          className="w-full h-56"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          className="absolute bottom-0 left-0 right-0 h-24"
        />
        <TouchableOpacity className="absolute top-5 left-4 bg-black/40 p-2 rounded-full">
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

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
        {politician.roles.map((role, idx) => (
          <RoleRow key={idx} title={role.title} years={role.years} active={role.active} />
        ))}
      </View>

      {/* Achievements */}
      <View className="bg-white rounded-2xl shadow p-4 m-4">
        <Text className="text-lg font-semibold mb-3">Achievements & History</Text>
        {politician.achievements.map((ach, idx) => (
          <Text key={idx} className="text-gray-600 text-sm leading-relaxed mb-1">
            • {ach}
          </Text>
        ))}
      </View>

      {/* Election Wins */}
      <View className="bg-white rounded-2xl shadow p-4 m-4 mb-8">
        <Text className="text-lg font-semibold mb-3">Past Election Wins</Text>
        {politician.elections.map((e, idx) => (
          <ElectionRow
            key={idx}
            year={e.year}
            position={e.position}
            party={e.party}
            votes={e.votes}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
// import React from "react";
// import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import InfoRow from "../components/InfoRow";
// import RoleRow from "../components/RoleRow";
// import ElectionRow from "../components/ElectionRow";
// import { politician } from "../constants/politicianData";
// import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
// import { politicians } from "../constants/dummyData";
// import { RootTabParamList } from "../navigation/AppNavigator";




// const ProfileScreen: React.FC = () => {
//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       {/* Header Banner */}
//       <View className="relative">
//         <Image
//           source={{ uri: "https://your-cdn.com/politician-banner.jpg" }}
//           className="w-full h-56"
//         />
//         <LinearGradient
//           colors={["transparent", "rgba(0,0,0,0.7)"]}
//           className="absolute bottom-0 left-0 right-0 h-24"
//         />
//         <TouchableOpacity className="absolute top-5 left-4 bg-black/40 p-2 rounded-full">
//           <Ionicons name="arrow-back" size={20} color="white" />
//         </TouchableOpacity>

//         {/* Name + Party Badge */}
//         <View className="absolute bottom-4 left-4">
//           <View className="flex-row items-center space-x-2">
//             <View className="bg-blue-600 px-2 py-1 rounded-md">
//               <Text className="text-white text-xs font-semibold">
//                 {politician.party.short}
//               </Text>
//             </View>
//           </View>
//           <Text className="text-white text-2xl font-bold mt-2">
//             {politician.name}
//           </Text>
//           <Text className="text-gray-200 text-sm">{politician.role}</Text>
//         </View>
//       </View>

//       {/* Personal Information */}
//       <View className="bg-white rounded-2xl shadow p-4 m-4">
//         <Text className="text-lg font-semibold mb-3">Personal Information</Text>
//         <InfoRow label="Date of Birth" value={politician.dob} />
//         <InfoRow label="Region" value={politician.region} />
//         <InfoRow label="Years of Service" value={politician.serviceYears} />
//         <InfoRow label="Education" value={politician.education} />
//       </View>

//       {/* Party Details */}
//       <View className="bg-white rounded-2xl shadow p-4 m-4">
//         <Text className="text-lg font-semibold mb-3">Party Details</Text>
//         <View className="flex-row items-center space-x-3">
//           <View className="bg-blue-600 px-3 py-2 rounded-md">
//             <Text className="text-white font-semibold">{politician.party.short}</Text>
//           </View>
//           <View>
//             <Text className="font-semibold">{politician.party.name}</Text>
//             <Text className="text-gray-500 text-sm">Founded: {politician.party.founded}</Text>
//             <Text className="text-gray-500 text-sm">{politician.party.ideology}</Text>
//           </View>
//         </View>
//       </View>

//       {/* Political Roles */}
//       <View className="bg-white rounded-2xl shadow p-4 m-4">
//         <Text className="text-lg font-semibold mb-3">Political Roles</Text>
//         {politician.roles.map((role, idx) => (
//           <RoleRow key={idx} title={role.title} years={role.years} active={role.active} />
//         ))}
//       </View>

//       {/* Achievements */}
//       <View className="bg-white rounded-2xl shadow p-4 m-4">
//         <Text className="text-lg font-semibold mb-3">Achievements & History</Text>
//         {politician.achievements.map((ach, idx) => (
//           <Text key={idx} className="text-gray-600 text-sm leading-relaxed mb-1">
//             • {ach}
//           </Text>
//         ))}
//       </View>

//       {/* Election Wins */}
//       <View className="bg-white rounded-2xl shadow p-4 m-4 mb-8">
//         <Text className="text-lg font-semibold mb-3">Past Election Wins</Text>
//         {politician.elections.map((e, idx) => (
//           <ElectionRow
//             key={idx}
//             year={e.year}
//             position={e.position}
//             party={e.party}
//             votes={e.votes}
//           />
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default ProfileScreen;
