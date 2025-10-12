import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface PoliticianPromisesHeaderProps {
  navigation: any; // Use correct navigation type if you want strict typing
  pageTitle?: string;
}

const sidebarItems = [
  {
    label: 'Politician Promises',
    icon: <MaterialIcons name="assignment" size={20} color="#2563EB" />,
    nav: 'PoliticianPromises',
  },
  {
    label: 'Growth News',
    icon: <Ionicons name="trending-up" size={20} color="#2563EB" />,
    nav: 'GrowthNews',
  },
  {
    label: 'Ministry Performance',
    icon: <FontAwesome5 name="chart-bar" size={18} color="#2563EB" />,
    nav: 'MinistryPerformance',
  },
  {
    label: 'WatchList',
    icon: <Ionicons name="eye" size={20} color="#2563EB" />,
    nav: 'WatchList',
  },
];

export default function PoliticianPromisesHeader({ navigation, pageTitle = "Politicians Promises" }: PoliticianPromisesHeaderProps) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => setSidebarVisible(true)}
          style={styles.menuBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} // <-- Add this line
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={22} color="#fff" style={{ marginRight: 16 }} />
          <Ionicons name="person-circle-outline" size={26} color="#fff" />
        </View>
      </View>

      {/* Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setSidebarVisible(false)} />
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <MaterialIcons name="menu-book" size={22} color="#fff" />
            <Text style={styles.sidebarTitle}>CivicLens</Text>
            <TouchableOpacity onPress={() => setSidebarVisible(false)}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
          {sidebarItems.map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.sidebarItem}
              onPress={() => {
                setSidebarVisible(false);
                navigation.navigate(item.nav);
              }}
            >
              {item.icon}
              <Text style={styles.sidebarItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 12,
    justifyContent: 'space-between',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  menuBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: -28, // visually center with icons
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  sidebar: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0,
    width: 260,
    backgroundColor: '#2563EB',
    paddingTop: 32,
    paddingHorizontal: 18,
    zIndex: 10,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    justifyContent: 'space-between',
  },
  sidebarTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 8,
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  sidebarItemText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 14,
    fontWeight: '500',
  },
});