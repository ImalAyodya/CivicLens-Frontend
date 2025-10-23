import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Linking, Platform, Modal, Alert } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import BottomNavBar from '../../components/BottomNavBar';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';

const API_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/promise/api';
const USER_BASE_URL = 'https://civiclens-backend-production-2c6d.up.railway.app/api/users';

const statusColors: Record<string, { bg: string; text: string }> = {
  complete: { bg: '#D1FAE5', text: '#059669' },
  pending: { bg: '#FEF3C7', text: '#B45309' },
  broken: { bg: '#FEE2E2', text: '#B91C1C' },
};

const reactionEmojis = {
  like: '👍',
  heart: '❤️',
  angry: '😠',
  funny: '😂'
};

export default function PromiseDetailScreen({ route, navigation }: any) {
  const promiseId = route.params?.promise?._id || route.params?.promise?.id;
  const [promise, setPromise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Comments state
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [evidence, setEvidence] = useState<any[]>([]);

  useEffect(() => {
    if (!promiseId) {
      setError('No promise ID provided.');
      setLoading(false);
      return;
    }
    
    const initializeData = async () => {
      await fetchPromise();
      await getCurrentUser(); // Wait for user to be fetched first
      await fetchComments(); // Then fetch comments
    };
    
    initializeData();
  }, [promiseId]);

  const getCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${USER_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(response.data._id);
        console.log('Current User ID set to:', response.data._id);
      } else {
        console.log('No token found');
      }
    } catch (err) {
      console.log('Error getting current user:', err);
    }
  };

  const fetchPromise = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/promises/${promiseId}`);
      setPromise(response.data);
      setEvidence(response.data.evidence || []);
    } catch (err) {
      setError('Failed to load promise details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/comments/promise/${promiseId}`);
      setComments(response.data);
      console.log('Comments fetched:', response.data);
    } catch (err) {
      console.log('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    if (!promiseId) {
      Alert.alert('Error', 'No promise ID found. Cannot add comment.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to comment');
        return;
      }
      // Fetch current user to get username
      const userRes = await axios.get(`${USER_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const username = userRes.data.fullName || userRes.data.username || 'Anonymous';

      await axios.post(`${API_BASE_URL}/comments`, {
        promiseId,
        commentText: comment,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComment('');
      fetchComments(); // Refresh comments
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/comments/${commentId}`, {
        commentText: editText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEditingComment(null);
      setEditText('');
      fetchComments();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to edit comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Deleting comment:', commentId, 'with token:', token ? 'exists' : 'missing');
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Comment deleted successfully');
      fetchComments();
    } catch (err: any) {
      console.log('Delete error:', err);
      Alert.alert('Error', err?.response?.data?.error || 'Failed to delete comment');
    }
  };

  const handleReaction = async (commentId: string, reactionType: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to react');
        return;
      }

      // Check if user already reacted with this type
      const comment = comments.find(c => c._id === commentId);
      const userReaction = comment?.reactions?.find((r: any) => r.userId._id === currentUserId && r.reactionType === reactionType);

      if (userReaction && userReaction.reactionType === reactionType) {
        // Remove reaction
        await axios.delete(`${API_BASE_URL}/comments/${commentId}/reactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Add/update reaction
        await axios.post(`${API_BASE_URL}/comments/${commentId}/reactions`, {
          reactionType
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchComments();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to react');
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to reply');
        return;
      }

      await axios.post(`${API_BASE_URL}/comments/${commentId}/replies`, {
        replyText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to add reply');
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Deleting reply:', replyId, 'from comment:', commentId, 'with token:', token ? 'exists' : 'missing');
      await axios.delete(`${API_BASE_URL}/comments/${commentId}/replies/${replyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Reply deleted successfully');
      fetchComments();
    } catch (err: any) {
      console.log('Delete reply error:', err);
      Alert.alert('Error', err?.response?.data?.error || 'Failed to delete reply');
    }
  };

  const handlePromiseReaction = async (reactionType: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login to react');
        return;
      }

      // Check if user already reacted with this type
      const userReaction = promise?.reactions?.find((r: any) => r.userId._id === currentUserId);

      if (userReaction && userReaction.reactionType === reactionType) {
        // Remove reaction
        await axios.delete(`${API_BASE_URL}/promises/${promiseId}/reactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Add/update reaction
        await axios.post(`${API_BASE_URL}/promises/${promiseId}/reactions`, {
          reactionType
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Refresh promise data
      fetchPromise();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to react');
    }
  };


  // Helper to get evidence label text
  const getEvidenceLabel = (evidence: any) => {
    if (isDocumentType(evidence.type)) {
      return `${evidence.type}: Document`;
    }
    if (['youtube', 'facebook', 'link', 'video', 'image'].includes(evidence.type?.toLowerCase())) {
      return `${evidence.type}: Media`;
    }
    return evidence.type ? `${evidence.type.charAt(0).toUpperCase() + evidence.type.slice(1)}` : 'Evidence';
  };

  // Download or open evidence document
  const handleEvidencePress = async (evidence: any) => {
    const { type, base64, filename = 'document.pdf', mimeType, link } = evidence;
    if (isDocumentType(type)) {
      let base64String = base64 || link;
      if (!base64String) {
        alert('No document data available.');
        return;
      }
      if (base64String.startsWith('data:')) {
        base64String = base64String.split(',')[1];
      }
      const fileExtension = filename.split('.').pop() || 'pdf';
      const resolvedMimeType =
        mimeType ||
        (fileExtension === 'pdf'
          ? 'application/pdf'
          : fileExtension === 'doc' || fileExtension === 'docx'
          ? 'application/msword'
          : fileExtension === 'xlsx'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/octet-stream');

      try {
        if (Platform.OS === 'web') {
          // Web: Use Blob to download the file
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: resolvedMimeType });
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
              type: resolvedMimeType,
            });
          } else {
            Sharing.shareAsync(fileUri, { mimeType: resolvedMimeType });
          }
        }
      } catch (err) {
        alert('Unable to open this document.');
        console.log('Document open error:', err);
      }
    } else if (link && typeof link === 'string') {
      Linking.openURL(link).catch(() =>
        alert('Unable to open this link.')
      );
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

          {/* NEW: Promise Reactions Section */}
          <View style={styles.promiseReactionsContainer}>
            <Text style={styles.promiseReactionsTitle}>How do you feel about this promise?</Text>
            
            {/* Reaction Buttons */}
            <View style={styles.promiseReactionButtons}>
              {Object.entries(reactionEmojis).map(([type, emoji]) => {
                const userReacted = promise?.reactions?.find((r: any) => r.userId._id === currentUserId && r.reactionType === type);
                const count = promise?.reactionCounts?.[type] || 0;
                
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.promiseReactionBtn, userReacted && styles.promiseReactionBtnActive]}
                    onPress={() => handlePromiseReaction(type)}
                  >
                    <Text style={styles.promiseReactionEmoji}>{emoji}</Text>
                    <Text style={[styles.promiseReactionLabel, userReacted && styles.promiseReactionLabelActive]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    {count > 0 && (
                      <View style={styles.promiseReactionCountBadge}>
                        <Text style={styles.promiseReactionCountText}>{count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
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
                    {getEvidenceLabel(e)}
                  </Text>
                  <TouchableOpacity
                    style={isDoc ? styles.downloadBtn : styles.openBtn}
                    onPress={() => handleEvidencePress(e)}
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
          
          {/* Add Comment */}
          <View style={styles.commentInputBox}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add your comment.."
              value={comment}
              onChangeText={setComment}
              placeholderTextColor="#A1A1AA"
              multiline
            />
            <TouchableOpacity style={styles.commentBtn} onPress={handleAddComment}>
              <Text style={styles.commentBtnText}>Post Comment</Text>
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {comments.map((c: any) => {
            console.log('Comment userId:', c.userId, 'Current userId:', currentUserId, 'Match:', currentUserId === c.userId?._id);
            
            // Fix: Access c.userId._id instead of c.userId
            const showEditDelete = currentUserId && c.userId && currentUserId === c.userId._id;
            console.log('Show edit/delete:', showEditDelete);
            
            return (
              <View key={c._id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>{c.username?.charAt(0) || 'U'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.commentName}>{c.username}</Text>
                      {showEditDelete && (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => {
                              setEditingComment(c._id);
                              setEditText(c.commentText);
                            }}
                            style={{ marginRight: 8 }}
                          >
                            <MaterialIcons name="edit" size={16} color="#6B7280" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDeleteComment(c._id)}>
                            <MaterialIcons name="delete" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <Text style={styles.commentDate}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {editingComment === c._id ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.editInput}
                      value={editText}
                      onChangeText={setEditText}
                      multiline
                    />
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                      <TouchableOpacity
                        style={[styles.editBtn, { backgroundColor: '#22C55E' }]}
                        onPress={() => handleEditComment(c._id)}
                      >
                        <Text style={styles.editBtnText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.editBtn, { backgroundColor: '#6B7280', marginLeft: 8 }]}
                        onPress={() => {
                          setEditingComment(null);
                          setEditText('');
                        }}
                      >
                        <Text style={styles.editBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.commentText}>{c.commentText}</Text>
                )}

                {/* Reactions */}
                <View style={styles.reactionsContainer}>
                  <View style={styles.reactionButtons}>
                    {Object.entries(reactionEmojis).map(([type, emoji]) => {
                      const userReacted = c.reactions?.find((r: any) => r.userId._id === currentUserId && r.reactionType === type);
                      const count = c.reactionCounts?.[type] || 0;
                      return (
                        <TouchableOpacity
                          key={type}
                          style={[styles.reactionBtn, userReacted && styles.reactionBtnActive]}
                          onPress={() => handleReaction(c._id, type)}
                        >
                          <Text style={styles.reactionEmoji}>{emoji}</Text>
                          {count > 0 && <Text style={styles.reactionCount}>{count}</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                  >
                    <Text style={styles.replyButtonText}>Reply</Text>
                  </TouchableOpacity>
                </View>

                {/* Reply Input */}
                {replyingTo === c._id && (
                  <View style={styles.replyInputContainer}>
                    <TextInput
                      style={styles.replyInput}
                      placeholder="Write a reply..."
                      value={replyText}
                      onChangeText={setReplyText}
                      multiline
                    />
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                      <TouchableOpacity
                        style={[styles.editBtn, { backgroundColor: '#2563EB' }]}
                        onPress={() => handleAddReply(c._id)}
                      >
                        <Text style={styles.editBtnText}>Reply</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.editBtn, { backgroundColor: '#6B7280', marginLeft: 8 }]}
                        onPress={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        <Text style={styles.editBtnText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Replies */}
                {c.replies && c.replies.length > 0 && (
                  <View style={styles.repliesContainer}>
                    {c.replies.map((reply: any) => (
                      <View key={reply._id} style={styles.replyCard}>
                        <View style={styles.replyHeader}>
                          <View style={styles.replyAvatar}>
                            <Text style={styles.replyAvatarText}>{reply.username?.charAt(0) || 'U'}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text style={styles.replyName}>{reply.username}</Text>
                              {currentUserId === reply.userId._id && (
                                <TouchableOpacity onPress={() => handleDeleteReply(c._id, reply._id)}>
                                  <MaterialIcons name="delete" size={14} color="#EF4444" />
                                </TouchableOpacity>
                              )}
                            </View>
                            <Text style={styles.replyDate}>
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.replyText}>{reply.replyText}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    color: '#111827',
    minHeight: 40,
  },
  commentBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  commentBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2563EB',
  },
  commentName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  commentDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  editContainer: {
    marginBottom: 12,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
    minHeight: 40,
  },
  editBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  reactionButtons: {
    flexDirection: 'row',
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F9FAFB',
  },
  reactionBtnActive: {
    backgroundColor: '#E0E7FF',
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  replyButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  replyButtonText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  replyInputContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  replyInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
    minHeight: 36,
  },
  repliesContainer: {
    marginTop: 12,
    marginLeft: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  replyCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  replyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  replyAvatarText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#2563EB',
  },
  replyName: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#222',
  },
  replyDate: {
    fontSize: 10,
    color: '#6B7280',
  },
  replyText: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
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
  promiseReactionsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  promiseReactionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  promiseReactionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  promiseReactionBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
    position: 'relative',
  },
  promiseReactionBtnActive: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
  },
  promiseReactionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  promiseReactionLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  promiseReactionLabelActive: {
    color: '#2563EB',
  },
  promiseReactionCountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promiseReactionCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});