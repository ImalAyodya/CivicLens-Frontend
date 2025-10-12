import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface PoliticianCardProps {
  name: string;
  party: string;
  role: string;
  image: ImageSourcePropType;
  partyColor: string;
  fullWidth?: boolean;
  onPress?: () => void;
}

const PoliticianCard: React.FC<PoliticianCardProps> = ({
  name,
  party,
  role,
  image,
  partyColor,
  fullWidth = false,
  onPress,
}) => {
  if (fullWidth) {
    return (
      <TouchableOpacity style={styles.fullWidthCard}>
        <Image source={image} style={styles.fullWidthImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.fullWidthName}>{name}</Text>
            <View style={styles.detailsRow}>
              <View style={[styles.partyBadge, { backgroundColor: partyColor }]}>
                <Text style={styles.partyBadgeText}>{party}</Text>
              </View>
            </View>
            <Text style={styles.fullWidthRole}>{role}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  // Original card design
  return (
    <TouchableOpacity style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <View style={[styles.partyBadge, { backgroundColor: partyColor }]}>
          <Text style={styles.partyBadgeText}>{party}</Text>
        </View>
        <Text style={styles.role}>{role}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  image: {
    width: 90,
    height: 120,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  partyBadge: {
    alignSelf: "flex-start",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  partyBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  role: {
    fontSize: 14,
    color: "#6B7280",
  },
  
  // Full width card styles
  fullWidthCard: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fullWidthImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
    justifyContent: "flex-end",
  },
  contentContainer: {
    padding: 16,
  },
  fullWidthName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fullWidthRole: {
    fontSize: 16,
    color: "white",
    opacity: 0.8,
  },
});

export default PoliticianCard;
// import React from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';

// interface PoliticianCardProps {
//   name: string;
//   party: string;
//   role: string;
//   image: ImageSourcePropType;
//   partyColor: string;
//   fullWidth?: boolean;
// }

// const PoliticianCard: React.FC<PoliticianCardProps> = ({
//   name,
//   party,
//   role,
//   image,
//   partyColor,
//   fullWidth = false,
// }) => {
//   if (fullWidth) {
//     return (
//       <TouchableOpacity style={styles.fullWidthCard}>
//         <Image source={image} style={styles.fullWidthImage} />
//         <LinearGradient
//           colors={['transparent', 'rgba(0,0,0,0.8)']}
//           style={styles.overlay}
//         >
//           <View style={styles.contentContainer}>
//             <Text style={styles.fullWidthName}>{name}</Text>
//             <View style={styles.detailsRow}>
//               <View style={[styles.partyIndicator, { backgroundColor: partyColor }]} />
//               <Text style={styles.fullWidthParty}>{party}</Text>
//             </View>
//             <Text style={styles.fullWidthRole}>{role}</Text>
//           </View>
//         </LinearGradient>
//       </TouchableOpacity>
//     );
//   }
  
//   // Original card design
//   return (
//     <TouchableOpacity style={styles.card}>
//       <Image source={image} style={styles.image} />
//       <View style={styles.content}>
//         <Text style={styles.name}>{name}</Text>
//         <View style={styles.detailsContainer}>
//           <View style={[styles.partyIndicator, { backgroundColor: partyColor }]} />
//           <Text style={styles.party}>{party}</Text>
//         </View>
//         <Text style={styles.role}>{role}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginVertical: 8,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//   },
//   image: {
//     width: 90,
//     height: 120,
//   },
//   content: {
//     flex: 1,
//     padding: 12,
//     justifyContent: "center",
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   detailsContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   partyIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 6,
//   },
//   party: {
//     fontSize: 14,
//     color: "#4B5563",
//   },
//   role: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
  
//   // Full width card styles
//   fullWidthCard: {
//     height: 220,
//     borderRadius: 12,
//     overflow: "hidden",
//     marginVertical: 8,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   fullWidthImage: {
//     width: "100%",
//     height: "100%",
//   },
//   overlay: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: "60%",
//     justifyContent: "flex-end",
//   },
//   contentContainer: {
//     padding: 16,
//   },
//   fullWidthName: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "white",
//     marginBottom: 6,
//   },
//   detailsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   fullWidthParty: {
//     fontSize: 16,
//     color: "white",
//     opacity: 0.9,
//   },
//   fullWidthRole: {
//     fontSize: 16,
//     color: "white",
//     opacity: 0.8,
//   },
// });

// export default PoliticianCard;
