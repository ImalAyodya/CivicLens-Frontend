import React,{ useState }  from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AdminSidebar from '../../components/admin/AdminSidebar'; // 👈 import your sidebar component

const { width } = Dimensions.get('window');

const AdminPanelScreen = ({ navigation }: any) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // Dummy data
  const stats = {
    politicians: 247,
    parties: 12,
    activePoliticians: 234,
    inactivePoliticians: 13,
    nationalParties: 8,
    regionalParties: 4,
    activeRoles: 156,
    pendingRoles: 23,
    election2024: 45,
    election2020: 67,
  };

  const recentActivity = [
    { title: "New politician added", description: "John Smith – Liberal Party", time: "2h ago" },
    { title: "Role updated", description: "Sarah Johnson - Minister of Health", time: "5h ago" }
  ];

  return (

    <View style={styles.mainContainer}>
      {/* Sidebar */}
      <View style={styles.sidebarContainer}>
        <AdminSidebar 
          activeScreen="politician-management" 
          isMobile={width < 768} 
          closeMenu={() => setSidebarOpen(false)} 
        />
      </View>

    <ScrollView style={styles.container}>
      {/* Top Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Admin Panel</Text>
        <Text style={styles.statsSubtitle}>Political Management</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.politicians}</Text>
            <Text style={styles.statLabel}>Politicians</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.parties}</Text>
            <Text style={styles.statLabel}>Parties</Text>
          </View>
        </View>
      </View>

      {/* Management Sections */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PoliticianList")}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={24} color="#3498db" />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Politicians</Text>
              <Text style={styles.cardSubtitle}>Manage profiles & records</Text>
            </View>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.active}>{`Active: ${stats.activePoliticians}`}</Text>
            <Text style={styles.inactive}>{`Inactive: ${stats.inactivePoliticians}`}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("PartyList")}>
          <View style={styles.cardHeader}>
            <Ionicons name="flag" size={24} color="#e74c3c" />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Parties</Text>
              <Text style={styles.cardSubtitle}>Manage party information</Text>
            </View>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.active}>{`National: ${stats.nationalParties}`}</Text>
            <Text style={styles.inactive}>{`Regional: ${stats.regionalParties}`}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("RoleList")}>
          <View style={styles.cardHeader}>
            <Ionicons name="briefcase" size={24} color="#f39c12" />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Role Assignment</Text>
              <Text style={styles.cardSubtitle}>Assign & manage roles</Text>
            </View>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.active}>{`Active: ${stats.activeRoles}`}</Text>
            <Text style={styles.inactive}>{`Pending: ${stats.pendingRoles}`}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ElectionRecords")}>
          <View style={styles.cardHeader}>
            <Ionicons name="stats-chart" size={24} color="#9b59b6" />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Election Records</Text>
              <Text style={styles.cardSubtitle}>Track election history</Text>
            </View>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.active}>{`2024: ${stats.election2024}`}</Text>
            <Text style={styles.inactive}>{`2020: ${stats.election2020}`}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("LevelList")}>
          <View style={styles.cardHeader}>
            <Ionicons name="layers" size={24} color="#16a085" />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Hierarchy Levels</Text>
              <Text style={styles.cardSubtitle}>Manage organizational levels</Text>
            </View>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.active}>View & Manage</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("NewsList")}>
          <View style={styles.cardHeader}>
            <Ionicons name="newspaper" size={24} color="#3498db" />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>News</Text>
              <Text style={styles.cardSubtitle}>Manage news articles</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ElectionList")}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={24} color="#3498db" />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Elections</Text>
              <Text style={styles.cardSubtitle}>Manage elections & voting</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#64748B" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.active}>{`Upcoming: ${stats.election2024}`}</Text>
            <Text style={styles.inactive}>{`Past: ${stats.election2020}`}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {recentActivity.map((item, index) => (
        <View key={index} style={styles.activityCard}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityDesc}>{item.description}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      ))}

      {/* Add Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Politician</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: '#8e44ad' }]}>
          <Ionicons name="flag" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Party</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
     </View>
  );
};

export default AdminPanelScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0f4ff' },
  mainContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#f0f4ff' },
  sidebarContainer: { width: 220, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#e5e7eb' },
  contentContainer: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  statsCard: { backgroundColor: '#4f6df5', borderRadius: 12, padding: 16, marginBottom: 16 },
  statsTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  statsSubtitle: { fontSize: 14, color: '#dfe4ff', marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#dfe4ff' },
  section: { marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitleContainer: { marginLeft: 12, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#555' },
  cardInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  active: { color: 'green', fontWeight: 'bold' },
  inactive: { color: '#f39c12', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
  activityCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8 },
  activityTitle: { fontWeight: 'bold', marginBottom: 2 },
  activityDesc: { fontSize: 12, color: '#555' },
  activityTime: { fontSize: 10, color: '#999', marginTop: 2 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3498db', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 }
});
