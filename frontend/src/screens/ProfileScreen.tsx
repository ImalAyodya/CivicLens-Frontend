import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert, TextInput, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For web image upload
const isWeb = Platform.OS === 'web';

const API_BASE_URL = 'https://civiclens-backend-production.up.railway.app/promise/api';

const ProfileScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    nic: '',
    profileImage: '', // Add profileImage field
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const getTokenAndFetch = async () => {
      const token = await AsyncStorage.getItem('token');
      fetchUserDetails(token);
    };
    getTokenAndFetch();
  }, []);

  const fetchUserDetails = async (token: string | null) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditData({
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      nic: user.nic || '',
      profileImage: user.profileImage || '',
    });
    setSelectedImage(user.profileImage || null);
    setEditVisible(true);
  };

  // Handle image selection (web only)
  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setEditData({ ...editData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/me`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setEditVisible(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#B91C1C', fontSize: 16 }}>User profile not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Header navigation={navigation} onProfilePress={() => {}} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user.profileImage
                  ? { uri: user.profileImage }
                  : require('../../assets/user_profile.png')
              }
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number:</Text>
            <Text style={styles.infoValue}>{user.phoneNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIC No:</Text>
            <Text style={styles.infoValue}>{user.nic}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={openEditModal}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : require('../../assets/user_profile.png')
                }
                style={styles.avatar}
              />
              {isWeb && (
                <input
                  type="file"
                  accept="image/*"
                  style={{ marginTop: 8 }}
                  onChange={handleImageChange}
                />
              )}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editData.fullName}
              onChangeText={text => setEditData({ ...editData, fullName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editData.email}
              onChangeText={text => setEditData({ ...editData, email: text })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={editData.phoneNumber}
              onChangeText={text => {
                const numericText = text.replace(/[^0-9]/g, '');
                if (numericText.length <= 10) {
                  setEditData({ ...editData, phoneNumber: numericText });
                }
              }}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              style={styles.input}
              placeholder="NIC No"
              value={editData.nic}
              onChangeText={text => setEditData({ ...editData, nic: text })}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity style={[styles.editBtn, { backgroundColor: '#64748B', flex: 1, marginRight: 8 }]} onPress={() => setEditVisible(false)}>
                <Text style={styles.editBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editBtn, { flex: 1, marginLeft: 8 }]} onPress={handleUpdateProfile}>
                <Text style={styles.editBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Changed from blue to light gray
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#E5E7EB', // subtle border for card, matches Dashboard
  },
  avatarContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 48,
    padding: 4,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB', // Blue accent for name
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 8,
  },
  infoSection: {
    backgroundColor: '#fff', // White card for info section
    borderRadius: 12,
    padding: 18,
    width: '100%',
    maxWidth: 350,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB', // Blue for section titles
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  editBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    maxWidth: 350,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,41,59,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 350,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backIcon: {
    position: 'absolute',
    top: 44,
    left: 18,
    zIndex: 10,
    backgroundColor: 'rgba(37,99,235,0.7)',
    borderRadius: 20,
    padding: 4,
  },
});

export default ProfileScreen;