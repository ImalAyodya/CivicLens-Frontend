import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import BottomNavBar from '../../components/BottomNavBar';
import PoliticianPromisesHeader from '../../components/PoliticianPromisesHeader';

const evidenceData = [
  {
    id: 1,
    icon: <FontAwesome name="facebook-square" size={28} color="#2563EB" />,
    label: 'Facebook video of promise',
  },
  {
    id: 2,
    icon: <Ionicons name="people" size={28} color="#2563EB" />,
    label: 'Political campaign meeting evidence',
  },
];

const commentsData = [
  {
    id: 1,
    name: 'Amali Priyadarshani',
    date: '2023-02-08',
    comment: 'All prices of medical equipments is low now. Thank you soo much for that',
  },
  {
    id: 2,
    name: 'Chaminda Perera',
    date: '2023-05-12',
    comment: 'I hope they are prioritize hiring local teachers for these new schools.',
  },
];

export default function PromiseDetailScreen({ route, navigation }: any) {
  // You can get promise details from route.params
  const promise = route.params?.promise || {
    name: 'Dilmini Edirisinghe',
    role: 'Minister of Health',
    avatar: require('../../../assets/candidate-placeholder.png'),
    status: 'Completed',
    title: 'Reduce Health Care cost by 15%',
    description:
      'This initiative aims to improve educational access in underserved rural communities across the country. The promise includes construction of 100 new schools with modern facilities including computer labs, libraries, and sports facilities. Each school will be staffed with qualified teachers and will serve approximately 500 students.',
    image: require('../../../assets/news-placeholder.png'),
    progress: 100,
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
      <PoliticianPromisesHeader navigation={navigation} pageTitle="Promise Details" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Back Button and Title */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        {/* Card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Image source={promise.avatar} style={styles.avatar} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.name}>{promise.name}</Text>
              <Text style={styles.role}>{promise.role}</Text>
            </View>
          </View>
          <Text style={styles.title}>{promise.title}</Text>
          <Image source={promise.image} style={styles.promiseImage} />
          <Text style={styles.desc}>{promise.description}</Text>
          {/* Progress Bar */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.progressLabel}>Progress</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${promise.progress}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{promise.progress}%</Text>
          </View>
          {/* Status */}
          <View style={[styles.statusTag, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.statusTagText, { color: '#059669' }]}>Completed</Text>
          </View>
        </View>
        {/* Evidence Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evidence</Text>
          {evidenceData.map(e => (
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
});