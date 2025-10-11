import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Linking, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import BottomNavBar from '../../components/BottomNavBar';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';

const API_BASE_URL = 'http://localhost:5000/promise/api';

const statusColors: Record<string, { bg: string; text: string }> = {
  complete: { bg: '#D1FAE5', text: '#059669' },
  pending: { bg: '#FEF3C7', text: '#B45309' },
  broken: { bg: '#FEE2E2', text: '#B91C1C' },
};

export default function PromiseDetailScreen({ route, navigation }: any) {
  const promiseId = route.params?.promise?._id || route.params?.promise?.id;
  const [promise, setPromise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comments and evidence can be fetched from backend if available
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);

  useEffect(() => {
    if (!promiseId) {
      setError('No promise ID provided.');
      setLoading(false);
      return;
    }
    const fetchPromise = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/promises/${promiseId}`);
        setPromise(response.data);
        setEvidence(response.data.evidence || []);
        setComments(response.data.citizenFeedback ? [{ id: 1, name: 'Citizen', date: '', comment: response.data.citizenFeedback }] : []);
      } catch (err) {
        setError('Failed to load promise details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPromise();
  }, [promiseId]);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          name: 'You',
          date: new Date().toISOString().slice(0, 10),
          comment,
        },
      ]);
      setComment('');
    }
  };

  // Get color for current promiseStatus
  const statusColor = statusColors[promise?.promiseStatus] || { bg: '#E5E7EB', text: '#6B7280' };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 12, color: '#64748B' }}>Loading promise details...</Text>
      </View>
    );
  }

  if (error || !promise) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: '#EF4444', fontSize: 16 }}>{error || 'Promise not found.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper to check if evidence is a document
  const isDocumentType = (type: string) =>
    ['pdf', 'word', 'excel', 'text', 'doc', 'docx', 'xlsx', 'ppt', 'pptx'].includes(type?.toLowerCase());

  const getDocumentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FontAwesome name="file-pdf-o" size={28} color="#EF4444" />;
      case 'word':
      case 'doc':
      case 'docx':
        return <FontAwesome name="file-word-o" size={28} color="#2563EB" />;
      case 'excel':
      case 'xlsx':
        return <FontAwesome name="file-excel-o" size={28} color="#22C55E" />;
      case 'ppt':
      case 'pptx':
        return <FontAwesome name="file-powerpoint-o" size={28} color="#F59E42" />;
      case 'text':
        return <FontAwesome name="file-text-o" size={28} color="#64748B" />;
      default:
        return <FontAwesome name="file-o" size={28} color="#2563EB" />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Promise Details" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        {/* Card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Image
              source={
                promise.politicianImage && typeof promise.politicianImage === 'string' && promise.politicianImage.startsWith('http')
                  ? { uri: promise.politicianImage }
                  : require('../../../assets/candidate-placeholder.png')
              }
              style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.name}>{promise.ministerName || 'Unknown Politician'}</Text>
              <Text style={styles.role}>{promise.ministryName || 'Unknown Ministry'}</Text>
            </View>
          </View>
          <Text style={styles.title}>{promise.promiseTitle || 'No Title'}</Text>
          <Image
            source={
              promise.promiseImage && typeof promise.promiseImage === 'string' && promise.promiseImage.startsWith('http')
                ? { uri: promise.promiseImage }
                : require('../../../assets/news-placeholder.png')
            }
            style={styles.promiseImage}
          />
          <Text style={styles.desc}>{promise.promiseDetails || 'No description available.'}</Text>
          {/* Progress Bar */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${promise.fulfillmentRate || 0}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{promise.fulfillmentRate || 0}%</Text>
          </View>
          {/* Status */}
          <View style={[styles.statusTag, { backgroundColor: statusColor.bg }]}>
            <Text style={[styles.statusTagText, { color: statusColor.text }]}>
              {promise.promiseStatus || 'pending'}
            </Text>
          </View>
        </View>
        {/* Evidence Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence</Text>
          {evidence.length === 0 ? (
            <Text style={{ color: '#64748B', marginBottom: 8 }}>No evidence available.</Text>
          ) : (
            evidence.map((e: any, idx: number) => {
              const isDoc = isDocumentType(e.type);
              return (
                <View key={idx} style={styles.evidenceCard}>
                  {getDocumentIcon(e.type)}
                  <Text style={styles.evidenceLabel}>
                    {e.type || 'Evidence'}: {isDoc ? 'Document' : e.link}
                  </Text>
                  <TouchableOpacity
                    style={isDoc ? styles.downloadBtn : styles.openBtn}
                    onPress={async () => {
                      if (isDoc && e.link) {
                        // Open the document link in a new tab or browser
                        if (Platform.OS === 'web') {
                          window.open(e.link, '_blank');
                        } else {
                          Linking.openURL(e.link).catch(() =>
                            alert('Unable to open this link.')
                          );
                        }
                      } else if (e.link && typeof e.link === 'string') {
                        Linking.openURL(e.link).catch(() =>
                          alert('Unable to open this link.')
                        );
                      }
                    }}
                  >
                    <Text style={isDoc ? styles.downloadBtnText : styles.openBtnText}>
                      {isDoc ? 'Download' : 'Open'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
        {/* Comments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
          <View style={styles.commentInputBox}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add your comment.."
              value={comment}
              onChangeText={setComment}
              placeholderTextColor="#A1A1AA"
            />
            <TouchableOpacity style={styles.commentBtn} onPress={handleAddComment}>
              <Text style={styles.commentBtnText}>Post Comment</Text>
            </TouchableOpacity>
          </View>
          {comments.map(c => (
            <View key={c.id} style={styles.commentCard}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>{c.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.commentName}>{c.name}</Text>
                <Text style={styles.commentDate}>{c.date}</Text>
                <Text style={styles.commentText}>{c.comment}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavBar activeTab="PoliticianPromises" onTabPress={tab => navigation.navigate(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    marginTop: 16,
    marginLeft: 16,
    marginBottom: -8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111827',
  },
  role: {
    fontSize: 13,
    color: '#6B7280',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#0F172A',
    marginVertical: 8,
  },
  promiseImage: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  desc: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 6,
  },
  progressPercent: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: 'bold',
    marginTop: 2,
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
  },
  statusTagText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 8,
  },
  evidenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  evidenceLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  commentInputBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    color: '#111827',
  },
  commentBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  commentBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2563EB',
  },
  commentName: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#222',
  },
  commentDate: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: '#374151',
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  downloadBtn: {
    marginLeft: 'auto',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  downloadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  openBtn: {
    marginLeft: 'auto',
    backgroundColor: '#22C55E',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  openBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});