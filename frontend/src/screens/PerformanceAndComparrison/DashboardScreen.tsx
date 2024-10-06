import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Image, TextInput } from 'react-native';
import { BarChart, LineChart, ProgressChart } from 'react-native-chart-kit';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { fetchAllPoliticianPerformance, fetchPoliticianDashboard } from '../../services/APIservices';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';
import Card from '../../components/Card';
import { getEarnedBadges } from '../../services/badgeService';
import BadgeComponent from '../../components/GamificationBadge/BadgeComponent';
import BadgeDetailModal from '../../components/GamificationBadge/BadgeDetailModal';
import { Badge } from '../../services/badgeService';
import PromisePieChart from '../../components/PromisePieChart';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

// Types for API responses
interface Politician {
  id: string;
  name: string;
  position: string;
  party: string;
  image: string;
  score: number;
  totalPromises: number;
  fulfilledPromises: number;
}

interface PoliticianDashboard {
  politician: {
    id: string;
    name: string;
    position: string;
    party: string;
    partyAbbreviation: string;
    partyColor: string;
    image: string;
  };
  performance: {
    score: number;
    totalPromises: number;
    fulfilledPromises: number;
    brokenPromises: number;
    pendingPromises: number;
    fulfillmentRate: number;
    publicApproval: number;
  };
  trends: {
    quarterly: Array<{ quarter: string; rating: number }>;
    approval: Array<{ month: string; rating: number }>;
    categories: Array<{ category: string; score: number }>;
  };
  keyPromises: Array<{
    id: string;
    title: string;
    details: string;
    status: string;
    fulfillment: number;
    category: string;
  }>;
  recentActivities: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}

// Screen dimensions for responsive layouts
const windowWidth = Dimensions.get('window').width;
const chartContainerPadding = 32; // match your container/card horizontal padding
const chartWidth = windowWidth - chartContainerPadding;
const isSmallScreen = chartWidth < 350; // Detect small screens

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // blue-600 for bars/lines
  labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, // gray-700
  barPercentage: 0.6,
  decimalPlaces: 0,
  propsForBackgroundLines: {
    stroke: "#e5e7eb"
  },
  formatYLabel: (label: string) => Math.round(Number(label)).toString(),
  formatXLabel: (label: string) => label.substring(0, 2),
  useShadowColorFromDataset: false,
  fillShadowGradient: "#2563eb", // blue-600
  fillShadowGradientOpacity: 1,  // fully opaque
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [selectedPolitician, setSelectedPolitician] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<PoliticianDashboard | null>(null);
  const [showList, setShowList] = useState(true); // Control whether to show list or details
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Fetch all politicians on component mount
  useEffect(() => {
    const loadPoliticians = async () => {
      try {
        const data = await fetchAllPoliticianPerformance();
        setPoliticians(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load politicians:", error);
        setLoading(false);
      }
    };
    
    loadPoliticians();
  }, []);

  // When selected politician changes, fetch their dashboard data
  useEffect(() => {
    if (!selectedPolitician) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        console.log('[DASHBOARD] Fetching data for politician:', selectedPolitician);
        
        const data = await fetchPoliticianDashboard(selectedPolitician);
        console.log('[DASHBOARD] Data received:', data);
        
        // Check if data has all required properties before setting state
        if (!data.politician) {
          console.error('[DASHBOARD] Missing politician data in response');
        }
        if (!data.performance) {
          console.error('[DASHBOARD] Missing performance data in response');
        }
        if (!data.trends) {
          console.error('[DASHBOARD] Missing trends data in response');
        }
        
        setDashboardData(data as PoliticianDashboard);
        setShowList(false); // Show the details view
      } catch (error) {
        console.error("[DASHBOARD] Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedPolitician]);

  const handleTabPress = (tabName: string) => {
  setActiveTab(tabName);
  // Only navigate if not already on the tab
  if (tabName !== activeTab) {
    navigation.navigate(tabName as never);
  }
};

  const handleBackPress = () => {
    setShowList(true);
    setSelectedPolitician(null);
    setDashboardData(null);
  };

  // Format quarterly data for the BarChart
  const getBarChartData = () => {
    if (!dashboardData || !dashboardData.trends || !dashboardData.trends.quarterly) {
      console.log('[CHART] Missing quarterly data');
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }
    
    console.log('[CHART] Rendering quarterly data:', dashboardData.trends.quarterly);
    return {
      labels: dashboardData.trends.quarterly.map(item => item.quarter),
      datasets: [
        {
          data: dashboardData.trends.quarterly.map(item => item.rating)
        }
      ]
    };
  };

  // Format approval data for the LineChart
  const getApprovalData = () => {
    if (!dashboardData || !dashboardData.trends || !dashboardData.trends.approval) {
      console.log('[CHART] Missing approval data');
      return {
        labels: [],
        datasets: [{ data: [], color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, strokeWidth: 2 }],
        legend: ["Public Approval"]
      };
    }
    
    console.log('[CHART] Rendering approval data:', dashboardData.trends.approval);
    return {
      labels: dashboardData.trends.approval.map(item => item.month),
      datasets: [
        {
          data: dashboardData.trends.approval.map(item => item.rating),
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ["Public Approval"]
    };
  };

  // Get data for Performance Categories
  const getPerformanceCategoriesData = () => {
    if (!dashboardData || !dashboardData.trends || !dashboardData.trends.categories || dashboardData.trends.categories.length === 0) {
      console.log('[CHART] Missing categories data');
      return {
        labels: [],
        data: []
      };
    }
    
    console.log('[CHART] Rendering categories data:', dashboardData.trends.categories);
    return {
      labels: dashboardData.trends.categories.map(item => item.category),
      data: dashboardData.trends.categories.map(item => Math.min(item.score, 100) / 100)
    };
  };

  // Update the getPieChartData function to handle potentially missing data
  const getPieChartData = () => {
    if (!dashboardData || !dashboardData.performance) {
      console.log('[CHART] Missing performance data for pie chart');
      return [];
    }

    console.log('[CHART] Creating pie chart data from:', dashboardData.performance);
    const { fulfilledPromises, brokenPromises, pendingPromises } = dashboardData.performance;
    const total = fulfilledPromises + pendingPromises + brokenPromises;

    const segments = [
      {
        name: "Done",
        population: fulfilledPromises,
        percentage: total > 0 ? Math.round((fulfilledPromises / total) * 100) : 0,
        color: "#22c55e",
        legendFontColor: "#374151",
        legendFontSize: 10
      },
      {
        name: "Pending",
        population: pendingPromises,
        percentage: total > 0 ? Math.round((pendingPromises / total) * 100) : 0,
        color: "#eab308",
        legendFontColor: "#374151",
        legendFontSize: 10
      },
      {
        name: "Not Met",
        population: brokenPromises,
        percentage: total > 0 ? Math.round((brokenPromises / total) * 100) : 0,
        color: "#ef4444",
        legendFontColor: "#374151",
        legendFontSize: 10
      }
    ];

    // Only pass non-zero segments to the chart
    return segments.filter(s => s.population > 0);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  // Add this helper function to get radar chart data
  const getPerformanceCategoriesDataOld = () => {
    if (!dashboardData) return null;
    
    // Either use actual data from API if available or mock data
    const categories = [
      { category: 'Economy', score: dashboardData.performance.score * 0.9 },
      { category: 'Healthcare', score: dashboardData.performance.score * 1.1 },
      { category: 'Education', score: dashboardData.performance.score * 0.85 },
      { category: 'Infrastructure', score: dashboardData.performance.score * 1.2 },
      { category: 'Environment', score: dashboardData.performance.score * 0.95 }
    ];
    
    // ProgressChart requires values between 0 and 1
    return {
      labels: categories.map(item => item.category),
      data: categories.map(item => Math.min(item.score, 100) / 100)
    };
  };

  // Add this helper function to handle image sources properly
  const getImageSource = (imageUrl: string) => {
    // Check if URL is valid
    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      return { uri: imageUrl };
    }
    
    // If invalid URL or placeholder text, return default image
return null;
  };

  // Add this helper function for status styles
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'complete':
      return { container: 'bg-green-100', text: 'text-green-700', label: 'Completed' };
    case 'pending':
      return { container: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
    case 'broken':
      return { container: 'bg-red-100', text: 'text-red-700', label: 'Not Met' };
    default:
      return { container: 'bg-blue-100', text: 'text-blue-700', label: status };
  }
};

  // Render loading state
  if (loading) {
    return (
      <View className="flex-1 bg-gray-100">
        <Header navigation={navigation} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600">Loading data...</Text>
        </View>
      </View>
    );
  }

  // Render list of politicians
  if (showList) {
    return (
      <View className="flex-1 bg-gray-100">
        <Header navigation={navigation} />
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Page Title */}
          <View className="bg-blue-500 px-4 py-6">
            <Text className="text-white text-2xl font-bold mb-2">
              Politician Performance Tracking
            </Text>
            <Text className="text-blue-100">
              Select a politician to view detailed performance
            </Text>
          </View>
          
          {/* Search Bar */}
         <View className="px-4 py-3">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
            <Text className="text-gray-500 mr-2">🔍</Text>
            <TextInput
              placeholder="Search for a politician..."
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-base text-gray-800"
              style={{ paddingVertical: 0 }}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
          
          {/* Politicians List */}
          <View className="px-4 py-4">
            {politicians
              .filter(politician =>
                politician.name.toLowerCase().includes(searchText.toLowerCase())
              )
              .map(politician => (
              <TouchableOpacity
                key={politician.id}
                onPress={() => setSelectedPolitician(politician.id)}
                className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden border border-gray-200"
              >
                <View className="flex-row items-center p-4">
                  <View className="h-16 w-16 rounded-full mr-4 overflow-hidden">
                    {politician.image && politician.image.startsWith('http') ? (
                      <Image 
                        source={{ uri: politician.image }}
                        className="h-16 w-16"
                        style={{ resizeMode: 'cover' }}
                        onError={(e) => console.log('Error loading image')}
                      />
                    ) : (
                      <View className="h-16 w-16 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="person" size={32} color="#60a5fa" />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-gray-800 text-lg">{politician.name}</Text>
                    <Text className="text-gray-600 mb-1">{politician.position}</Text>
                    <Text className="text-gray-500 text-xs">{politician.party}</Text>
                  </View>
                  <View>
                    <View className="bg-blue-100 px-3 py-2 rounded-full items-center">
                      <Text className="text-blue-700 font-bold text-base">{politician.score}%</Text>
                    </View>
                    <Text className="text-gray-500 text-xs mt-1 text-center">Performance</Text>
                  </View>
                </View>
                
                {/* Quick stats */}
                <View className="border-t border-gray-100 px-4 py-3 flex-row">
                  <View className="flex-1 border-r border-gray-100 items-center">
                    <Text className="text-xs text-gray-500">Total Promises</Text>
                    <Text className="font-medium text-gray-800">{politician.totalPromises}</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-gray-500">Fulfilled</Text>
                    <Text className="font-medium text-gray-800">{politician.fulfilledPromises}</Text>
                  </View>
                  <View className="flex-1 border-l border-gray-100 items-center">
                    <Text className="text-xs text-gray-500">Completion</Text>
                    <Text className="font-medium text-gray-800">
                      {politician.totalPromises > 0 
                        ? Math.round((politician.fulfilledPromises / politician.totalPromises) * 100) 
                        : 0}%
                    </Text>
                  </View>
                </View>
                
                {/* View more button */}
                <View className="bg-gray-50 px-4 py-2 flex-row justify-between items-center">
                  <Text className="text-gray-500 text-sm">View detailed performance</Text>
                  <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  }

  // Render detailed dashboard for selected politician
  const pieData = getPieChartData();
  const nonZeroSegments = pieData?.filter(item => item.population > 0) ?? [];

  return (
    <View className="flex-1 bg-gray-100">
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Page Title with Back Button */}
        <View className="bg-blue-500 px-4 py-4">
          <View className="flex-row items-center mb-1">
            <TouchableOpacity 
              onPress={handleBackPress}
              className="mr-3 bg-blue-600 rounded-full p-1"
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            
            {/* Add image here */}
            <View className="h-10 w-10 rounded-full overflow-hidden mr-3">
              {dashboardData?.politician.image && dashboardData.politician.image.startsWith('http') ? (
                <Image 
                  source={{ uri: dashboardData.politician.image }}
                  className="h-10 w-10"
                  style={{ resizeMode: 'cover' }}
                  onError={(e) => console.log('Error loading image')}
                />
              ) : (
                <View className="h-10 w-10 bg-blue-100 rounded-full items-center justify-center">
                  <Ionicons name="person" size={20} color="#60a5fa" />
                </View>
              )}
            </View>
            
            <Text className="text-white text-xl font-bold">
              {dashboardData?.politician.name}
            </Text>
          </View>
          <Text className="text-blue-100 ml-8">
            {dashboardData?.politician.position} • {dashboardData?.politician.party}
          </Text>
        </View>

        <View className="px-4">
          {/* Performance Score Card */}
          <Card className="mt-6 p-6 mb-4">
              <View className="flex-row justify-between items-center mb-4">
              <View style={{ maxWidth: '70%' }}>
                <Text className="text-lg font-bold text-gray-800">
                  Performance Score
                </Text>
                <Text className="text-gray-500" numberOfLines={1}>
                  {dashboardData?.politician.party}
                </Text>
              </View>
              <View className="bg-blue-100 rounded-full h-16 w-16 items-center justify-center">
                <Text className="text-xl font-bold text-blue-600">{dashboardData?.performance.score}%</Text>
              </View>
            </View>
            
            {/* Progress bars */}
            <Text className="text-sm font-medium text-gray-700 mb-1">Promises Fulfilled</Text>
            <View className="h-4 bg-gray-200 rounded-full mb-3">
              <View 
                className="h-4 bg-green-500 rounded-full" 
                style={{ 
                  width: `${dashboardData && dashboardData.performance.totalPromises > 0 
                    ? (dashboardData.performance.fulfilledPromises / dashboardData.performance.totalPromises) * 100 
                    : 0}%` 
                }}
              />
            </View>
            
            <Text className="text-sm font-medium text-gray-700 mb-1">Fulfillment Rate</Text>
            <View className="h-4 bg-gray-200 rounded-full mb-3">
              <View 
                className="h-4 bg-blue-500 rounded-full" 
style={{ width: `${dashboardData?.performance.fulfillmentRate ?? 0}%` }}              />
            </View>
            
            <Text className="text-sm font-medium text-gray-700 mb-1">Public Approval</Text>
            <View className="h-4 bg-gray-200 rounded-full mb-2">
              <View 
                className="h-4 bg-yellow-500 rounded-full" 
style={{ width: `${dashboardData?.performance.publicApproval ?? 0}%` }}              />
            </View>
          </Card>

          {/* NEW: Achievement Badges Card */}
          <Card className="p-6 mb-4">
  <Text className="text-lg font-bold text-gray-800 mb-3">
    Achievement Badges
  </Text>
  
  {dashboardData && (
    <>
      <Text className="text-sm text-gray-600 mb-3">
        Based on performance metrics, this politician has earned:
      </Text>
      
      <View className="flex-row flex-wrap justify-center">
        {getEarnedBadges(
          dashboardData.performance.score,
          dashboardData.performance.fulfillmentRate,
          dashboardData.performance.publicApproval
        ).map((badge) => (
          <BadgeComponent
            key={badge.id}
            badge={badge}
            onPress={() => {
              setSelectedBadge(badge);
              setShowBadgeModal(true);
            }}
          />
        ))}
      </View>
      
      {getEarnedBadges(
        dashboardData.performance.score,
        dashboardData.performance.fulfillmentRate,
        dashboardData.performance.publicApproval
      ).length === 0 && (
        <View className="items-center py-8">
          <Text className="text-gray-500">No badges earned yet</Text>
        </View>
      )}
      
      <Text className="text-xs text-center text-gray-500 mt-3">
        Tap on a badge to see more details
      </Text>
    </>
  )}
</Card>

          {/* Charts and Graphs */}
          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              Performance Trends
            </Text>
            
            {/* Bar Chart for Quarterly Performance */}
            <View className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <Text className="text-gray-800 font-medium mb-2">Quarterly Ratings</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={getBarChartData()!}
                  width={Math.max(chartWidth, 400)} // minimum width for labels
                  height={180}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  horizontalLabelRotation={0}
                  fromZero
                  withInnerLines={false}
                  showBarTops={false}
                  style={{ borderRadius: 12 }}
                />
              </ScrollView>
            </View>
            
            {/* NEW GRAPH: Line Chart for Public Approval Trends */}
            <View className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <Text className="text-gray-800 font-medium mb-2">Public Approval Trend</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getApprovalData() ? (
                  <LineChart
                    data={getApprovalData()}
                    width={Math.max(chartWidth, 400)}
                    height={180}
                    yAxisLabel=""
                    yAxisSuffix="%"
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                      strokeWidth: 2,
                    }}
                    bezier
                    style={{ borderRadius: 12 }}
                  />
                ) : (
                  <View style={{ height: 180, width: Math.max(chartWidth, 400), justifyContent: 'center', alignItems: 'center' }}>
                    <Text className="text-gray-400">No approval trend data available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
            
            {/* Pie Chart for Promise Status Distribution */}
            <PromisePieChart
  data={getPieChartData()}
  totalPromises={dashboardData?.performance.totalPromises ?? 0}
  chartConfig={chartConfig}
/>
            
            {/* NEW: Radar Chart for Performance by Category */}
            <View className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
  <Text className="text-gray-800 font-medium mb-2">Performance by Category</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <ProgressChart
      data={getPerformanceCategoriesData()!}
      width={Math.max(chartWidth, 400)}
      height={200}
      strokeWidth={16}
      radius={32}
      chartConfig={{
        ...chartConfig,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      }}
      hideLegend={false}
      style={{ borderRadius: 12 }}
    />
  </ScrollView>
  <Text className="text-xs text-center text-gray-500 mt-2">
    Shows politician's performance across different policy areas
  </Text>
</View>
            
            {/* Stats Cards */}
            <View className="flex-row justify-between">
              <View className="bg-blue-50 rounded-lg p-3 flex-1 mr-2">
                <Text className="text-sm font-medium text-gray-700">Total Promises</Text>
                <Text className="text-xl font-bold text-blue-700">{dashboardData?.performance.totalPromises}</Text>
              </View>
              <View className="bg-green-50 rounded-lg p-3 flex-1 ml-2">
                <Text className="text-sm font-medium text-gray-700">Completed</Text>
                <Text className="text-xl font-bold text-green-700">{dashboardData?.performance.fulfilledPromises}</Text>
              </View>
            </View>
          </Card>

          {/* Key Promises */}
          <Card className="p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Key Promises
            </Text>
            
            {dashboardData?.keyPromises && dashboardData.keyPromises.length > 0 ? (
              dashboardData.keyPromises.map((promise) => {
                const status = getStatusStyle(promise.status);
                return (
                  <View key={promise.id} className="mb-4 bg-white border border-gray-200 rounded-lg p-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text 
                        className="text-blue-700 font-semibold"
                        style={{ width: '70%' }}
                        numberOfLines={1}
                      >
                        {promise.title}
                      </Text>
                      <View className={`${status.container} rounded-full px-2 py-1`}>
                        <Text className={`text-xs ${status.text}`}>{status.label}</Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>{promise.details}</Text>
                    <View className="h-1 bg-gray-100 rounded-full">
                      <View 
                        className={`h-1 ${promise.status === 'complete' ? 'bg-green-500' : 
                                        promise.status === 'pending' ? 'bg-yellow-500' : 
                                        'bg-blue-500'} rounded-full`} 
                        style={{ width: `${promise.fulfillment}%` }} 
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="items-center py-8">
                <Text className="text-gray-500">No key promises to display</Text>
              </View>
            )}
          </Card>

          {/* Recent Activities */}
          <Card className="p-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Recent Activities
            </Text>
            
            {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <View 
                  key={index}
                  className={`${index < dashboardData.recentActivities.length - 1 ? 'mb-3 pb-3 border-b border-gray-200' : ''}`}
                >
                  <Text className="text-gray-800 font-medium" numberOfLines={1}>{activity.title}</Text>
                  <Text className="text-gray-600 text-sm" numberOfLines={2}>{activity.description}</Text>
                  <Text className="text-gray-500 text-xs mt-1">{formatDate(activity.date)}</Text>
                </View>
              ))
            ) : (
              <View className="items-center py-4">
                <Text className="text-gray-500">No recent activities</Text>
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
      <BottomNavBar activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Badge Detail Modal */}
      <BadgeDetailModal
        badge={selectedBadge}
        isVisible={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
      />
    </View>
  );
};

export default DashboardScreen;