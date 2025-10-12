import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
// import { FileSystemDirectory, FileSystemFile } from 'expo-file-system';

const API_BASE_URL = 'http://localhost:5000/promise/api';

const evidenceIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'youtube':
      return <Ionicons name="logo-youtube" size={28} color="#EF4444" />;
    case 'facebook':
      return <Ionicons name="logo-facebook" size={28} color="#2563EB" />;
    case 'pdf':
      return <Ionicons name="document-text-outline" size={28} color="#EF4444" />;
    case 'word':
      return <Ionicons name="document-text-outline" size={28} color="#2563EB" />;
    case 'excel':
      return <Ionicons name="document-text-outline" size={28} color="#22C55E" />;
    case 'image':
      return <Ionicons name="image-outline" size={28} color="#F59E42" />;
    case 'video':
      return <Ionicons name="videocam-outline" size={28} color="#8B5CF6" />;
    case 'link':
      return <Ionicons name="link-outline" size={28} color="#2563EB" />;
    default:
      return <Ionicons name="document-outline" size={28} color="#64748B" />;
  }
};

const isDocumentType = (type: string) =>
  ['pdf', 'word', 'excel', 'file', 'doc', 'docx', 'xlsx', 'ppt', 'pptx'].includes(type?.toLowerCase());

const getEvidenceLabel = (evidence: any) => {
  if (isDocumentType(evidence.type)) {
    return `${evidence.type}: Document`;
  }
  if (['youtube', 'facebook', 'link', 'video'].includes(evidence.type?.toLowerCase())) {
    return `${evidence.type}: Media`;
  }
  return evidence.type ? `${evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)}` : 'Evidence';
};

const getEvidenceButtonText = (evidence: any) => {
  return isDocumentType(evidence.type) ? 'Download' : 'Open';
};

export default function GrowthNewsDetailScreen({ route, navigation }: any) {
  const newsId = route.params?.news?._id || route.params?.news?.newsId;
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetchNewsById();
  }, [newsId]);

  const fetchNewsById = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/growthNews/${newsId}`);
      setNews(response.data);
    } catch (err) {
      setError('Failed to load news details');
      setNews(null);
    } finally {
      setLoading(false);
    }
  };

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

  const handleEvidencePress = async (evidence: any) => {
    const { type, link, filename = 'document.pdf' } = evidence;
    if (!link) {
      alert('No link available for this evidence');
      return;
    }
    try {
      if (isDocumentType(type)) {
        let base64String = link;
        if (base64String.startsWith('data:')) {
          base64String = base64String.split(',')[1];
        }
        const fileExtension = filename.split('.').pop() || 'pdf';
        const mimeType =
          fileExtension === 'pdf'
            ? 'application/pdf'
            : fileExtension === 'doc' || fileExtension === 'docx'
            ? 'application/msword'
            : fileExtension === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/octet-stream';

        if (Platform.OS === 'web') {
          // Web: Use Blob to download the file
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else {
          // Mobile: Use expo-file-system (legacy or new API)
          const cacheDir = (FileSystem as any).cacheDirectory;
          const fileUri = cacheDir + filename;
          await (FileSystem as any).writeAsStringAsync(fileUri, base64String, { encoding: 'base64' });

          if (Platform.OS === 'android') {
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
              data: fileUri,
              flags: 1,
              type: mimeType,
            });
          } else {
            Sharing.shareAsync(fileUri, { mimeType });
          }
        }
      } else {
        await Linking.openURL(link);
      }
    } catch (err) {
      alert('Unable to open this document.');
      console.log('Document open error:', err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 12, color: '#64748B' }}>Loading news details...</Text>
      </View>
    );
  }

  if (error || !news) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: '#EF4444', fontSize: 16 }}>{error || 'News not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Growth News Detail" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Back Button and Title */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.categoryTag}>{news.newsCategory}</Text>
          <Text style={styles.title}>{news.newsTitle}</Text>
          <Image
            source={
              news.newsImage
                ? typeof news.newsImage === 'string'
                  ? { uri: news.newsImage }
                  : news.newsImage
                : require('../../../assets/news-placeholder.png')
            }
            style={styles.newsImage}
          />
          <Text style={styles.date}>
            {news.newsDate
              ? new Date(news.newsDate).toISOString().slice(0, 10)
              : ''}
          </Text>
          <Text style={styles.desc}>{news.newsDetails}</Text>
        </View>
        {/* Evidence Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence</Text>
          {(news.newsEvidence || []).map((evidence: any, idx: number) => (
            <View key={idx} style={styles.evidenceCard}>
              {evidenceIcon(evidence.type)}
              <Text style={styles.evidenceLabel}>
                {getEvidenceLabel(evidence)}
              </Text>
              <TouchableOpacity
                style={isDocumentType(evidence.type) ? styles.downloadBtn : styles.openBtn}
                onPress={() => handleEvidencePress(evidence)}
              >
                <Text style={isDocumentType(evidence.type) ? styles.downloadBtnText : styles.openBtnText}>
                  {getEvidenceButtonText(evidence)}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
      <BottomNavBar activeTab="GrowthNews" onTabPress={tab => navigation.navigate(tab)} />
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
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#0F172A',
    marginBottom: 8,
  },
  newsImage: {
    width: '100%',
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  date: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 8,
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
  evidenceLink: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#2563EB',
    textDecorationLine: 'underline',
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
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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