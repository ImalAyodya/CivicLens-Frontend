import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

interface HierarchyCardProps {
  title: string;
  name: string;
  party?: string;
  color?: string;
  icon: IconName;
  highlight?: boolean;
}

const HierarchyCard: React.FC<HierarchyCardProps> = ({ 
  title, 
  name, 
  party, 
  color = "#4f46e5", 
  icon, 
  highlight = false 
}) => {
  return (
    <View style={[
      styles.card, 
      highlight && { backgroundColor: color, ...styles.highlightedCard }
    ]}>
      <View style={styles.row}>
        <View style={[
          styles.iconContainer,
          highlight && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
        ]}>
          <Ionicons 
            name={icon} 
            size={22} 
            color={highlight ? "#fff" : color} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[
            styles.title, 
            highlight && { color: "#fff" }
          ]}>
            {title.toUpperCase()}
          </Text>
          <Text style={[
            styles.name, 
            highlight && { color: "#fff" }
          ]}>
            {name}
          </Text>
          {party && (
            <Text style={[
              styles.party, 
              highlight && { color: "rgba(255, 255, 255, 0.8)" }
            ]}>
              {party}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default HierarchyCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  highlightedCard: {
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 0,
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: { 
    fontSize: 11, 
    fontWeight: "700", 
    color: "#777",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#333",
    marginBottom: 2,
  },
  party: { 
    fontSize: 13, 
    color: "#666",
    fontStyle: "italic",
  },
});
