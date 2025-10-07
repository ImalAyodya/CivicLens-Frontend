import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';

const commentsData = [
  {
    id: 1,
    name: 'Amali Priyadarshani',
    date: '2023-11-25',
    comment: 'Great initiative! This will help a lot of people.',
  },
  {
    id: 2,
    name: 'Chaminda Perera',
    date: '2023-11-26',
    comment: 'Looking forward to more updates on this.',
  },
];

export default function GrowthNewsDetailScreen({ route, navigation }: any) {
  // Get news details from route.params
  const news = route.params?.news || {
    category: 'Community',
    title: 'Ministry Expands Outreach Programs in Rural Areas',
    description:
      'The Ministry of Community Development announced a significant expansion of its outreach programs, aiming to provide essential services and support.',
    image: require('../../../assets/news-placeholder.png'),
    date: '2023-11-24',
    evidence: [
      {
        id: 1,
        icon: <Ionicons name="link-outline" size={28} color="#2563EB" />,
        label: 'Official press release',
      },
      {
        id: 2,
        icon: <Ionicons name="image-outline" size={28} color="#2563EB" />,
        label: 'Event photos',
      },
    ],
  };

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(commentsData);

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
          <Text style={styles.categoryTag}>{news.category}</Text>
          <Text style={styles.title}>{news.title}</Text>
          <Image source={news.image} style={styles.newsImage} />
          <Text style={styles.date}>{news.date}</Text>
          <Text style={styles.desc}>{news.description}</Text>
        </View>
        {/* Evidence Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence</Text>
          {(news.evidence || []).map((e: { id: number; icon: React.ReactNode; label: string }) => (
            <View key={e.id} style={styles.evidenceCard}>
              {e.icon}
              <Text style={styles.evidenceLabel}>{e.label}</Text>
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
});