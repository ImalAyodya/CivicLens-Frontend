import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import LawAccordion from '../../components/elections/laws/LawAccordion';
import LawCategoryCard from '../../components/elections/laws/LawCategoryCard';
import ViolationReportCard from '../../components/elections/laws/ViolationReportCard';
import Animated, { FadeIn } from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'ElectionLaws'>;

// Mock data for law categories
const lawCategories = [
  {
    id: 'c1',
    title: 'Voter Rights',
    description: 'Laws protecting the rights of voters',
    icon: 'shield-outline',
    count: 8
  },
  {
    id: 'c2',
    title: 'Campaign Regulations',
    description: 'Rules for political campaigns',
    icon: 'megaphone-outline',
    count: 12
  },
  {
    id: 'c3',
    title: 'Electoral Offences',
    description: 'Violations and penalties',
    icon: 'alert-circle-outline',
    count: 9
  },
  {
    id: 'c4',
    title: 'Election Day Rules',
    description: 'Regulations for polling day',
    icon: 'calendar-outline',
    count: 7
  }
];

// Mock data for key election laws
const electionLaws = [
  {
    id: 'l1',
    title: 'Right to Vote',
    content: 'Every citizen of Sri Lanka who is 18 years of age or older has the right to vote in elections, provided they are registered in the electoral register and not disqualified under any law.',
    referenceNumber: 'Constitution of Sri Lanka, Article 4(e)'
  },
  {
    id: 'l2',
    title: 'Campaign Finance',
    content: 'Political parties and candidates must maintain records of all donations and campaign expenditures. There are limits on how much can be spent during election campaigns, and all expenses must be reported to the Election Commission.',
    referenceNumber: 'Election Campaign Finance Act, 2015'
  },
  {
    id: 'l3',
    title: 'Prohibition of Bribery',
    content: 'It is illegal to give, offer, or promise any money, gift, or other consideration to induce a voter to vote or refrain from voting. Offenders can face imprisonment up to 7 years and/or fines.',
    referenceNumber: 'Elections Act, Chapter 2, Section 58'
  },
  {
    id: 'l4',
    title: 'Campaign Period',
    content: 'All campaign activities must cease 48 hours before the opening of polls. This "silent period" allows voters to reflect on their choices without last-minute influence.',
    referenceNumber: 'Elections Act, Chapter 3, Section 79'
  },
  {
    id: 'l5',
    title: 'Voter Intimidation',
    content: 'Using or threatening to use force, violence, or restraint to induce or compel a person to vote or refrain from voting is prohibited and punishable by law.',
    referenceNumber: 'Elections Act, Chapter 2, Section 63'
  }
];

const ElectionLawsScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  const filteredLaws = electionLaws.filter(law => 
    law.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    law.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={handleGoBack} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Election Laws</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        {/* Introduction */}
        <Animated.View entering={FadeIn.duration(400)} className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Sri Lankan Election Laws</Text>
          <Text className="text-gray-600">
            Understanding the legal framework that governs elections in Sri Lanka. 
            These laws ensure fair and transparent electoral processes.
          </Text>
        </Animated.View>
        
        {/* Search Bar */}
        <Animated.View 
          entering={FadeIn.delay(100).duration(400)}
          className="bg-white rounded-lg flex-row items-center px-3 py-2 mb-4"
        >
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search election laws..."
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Violation Reporting */}
        <Animated.View entering={FadeIn.delay(200).duration(400)}>
          <ViolationReportCard />
        </Animated.View>
        
        {/* Categories */}
        {!searchQuery && (
          <Animated.View entering={FadeIn.delay(300).duration(400)}>
            <Text className="text-lg font-bold text-gray-800 mb-3">Categories</Text>
            
            {lawCategories.map(category => (
              <LawCategoryCard
                key={category.id}
                title={category.title}
                description={category.description}
                icon={category.icon}
                count={category.count}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              />
            ))}
          </Animated.View>
        )}
        
        {/* Key Election Laws */}
        <Animated.View entering={FadeIn.delay(400).duration(400)}>
          <Text className="text-lg font-bold text-gray-800 my-3">
            {searchQuery ? 'Search Results' : 'Key Election Laws'}
          </Text>
          
          {filteredLaws.length > 0 ? (
            filteredLaws.map(law => (
              <LawAccordion
                key={law.id}
                title={law.title}
                content={law.content}
                referenceNumber={law.referenceNumber}
              />
            ))
          ) : (
            <View className="bg-white rounded-lg p-4 items-center">
              <Ionicons name="search" size={40} color="#D1D5DB" />
              <Text className="text-gray-500 mt-2">No laws found matching your search.</Text>
            </View>
          )}
        </Animated.View>
        
        {/* Election Commission Contact */}
        <Animated.View 
          entering={FadeIn.delay(500).duration(400)}
          className="bg-white rounded-lg p-4 mt-4 mb-4"
        >
          <Text className="text-lg font-bold text-gray-800 mb-3">Election Commission</Text>
          
          <View className="flex-row items-center mb-3">
            <View className="h-8 w-8 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Ionicons name="call-outline" size={18} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-medium text-gray-800">Hotline</Text>
              <Text className="text-gray-600 text-sm">1950</Text>
            </View>
          </View>
          
          <View className="flex-row items-center mb-3">
            <View className="h-8 w-8 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Ionicons name="globe-outline" size={18} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-medium text-gray-800">Website</Text>
              <Text className="text-gray-600 text-sm">www.elections.gov.lk</Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <View className="h-8 w-8 rounded-full bg-blue-100 items-center justify-center mr-2">
              <Ionicons name="mail-outline" size={18} color="#1D4ED8" />
            </View>
            <View>
              <Text className="font-medium text-gray-800">Email</Text>
              <Text className="text-gray-600 text-sm">info@elections.gov.lk</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ElectionLawsScreen;