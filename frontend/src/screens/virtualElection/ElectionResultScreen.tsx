
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { RouteProp, useRoute } from "@react-navigation/native";
import BlueHeader from "../../components/BlueHeader";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/types";

const API_URL = "http://localhost:5000/api";

type ElectionResultRouteProp = RouteProp<RootStackParamList, "ElectionResultScreen">;

interface VoteResult {
  politician: string; // Name only
  votes: number;
}


export default function ElectionResultScreen() {
  const navigation = useNavigation();
  const route = useRoute<ElectionResultRouteProp>();
  const { electionId } = route.params;

  const [results, setResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElectionVotes();
  }, []);

  const fetchElectionVotes = async () => {
    try {
      const response = await fetch(`${API_URL}/virtualElections/${electionId}/votes`);
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching election votes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  // Calculate total votes
  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  // Find winner
  const winner = results.length > 0 ? results.reduce((max, r) => (r.votes > max.votes ? r : max), results[0]) : null;

  // Prepare pie chart data
  const chartData = results.map((c, idx) => ({
    name: c.politician,
    population: c.votes,
    color: getRandomColor(idx),
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <BlueHeader title="Election Results" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {winner && (
          <View style={styles.winnerBox}>
            <Text style={styles.winnerTitle}>🏆 Winner</Text>
            <Text style={styles.winnerName}>{winner.politician}</Text>
            <Text style={styles.winnerVotes}>
              {winner.votes.toLocaleString()} votes ({totalVotes > 0 ? ((winner.votes / totalVotes) * 100).toFixed(1) : 0}%)
            </Text>
          </View>
        )}

        <Text style={styles.chartTitle}>Vote Distribution</Text>
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: () => `rgba(0, 0, 0, 0.7)`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          absolute
        />

        <View style={styles.statsSection}>
          <Text style={styles.totalVotes}>🗳️ Total Votes: {totalVotes.toLocaleString()}</Text>
        </View>

        <View style={styles.listSection}>
          {results.map((c, idx) => {
            const percent = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : '0.0';
            return (
              <View key={c.politician + idx} style={styles.candidateRow}>
                <Text style={styles.candidateName}>{c.politician}</Text>
                <Text style={styles.candidateVotes}>{c.votes.toLocaleString()} votes ({percent}%)</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function getRandomColor(idx: number) {
  const colors = ["#2563EB", "#9333EA", "#16A34A", "#DC2626", "#EAB308", "#0EA5E9"];
  return colors[idx % colors.length];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  winnerBox: {
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  winnerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
  },
  winnerName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  winnerParty: {
    fontSize: 14,
    color: "#4B5563",
  },
  winnerVotes: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },
  chartTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  statsSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  totalVotes: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1E3A8A",
  },
  listSection: {
    marginTop: 8,
  },
  candidateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  candidateName: {
    fontSize: 14,
    color: "#111827",
  },
  candidateVotes: {
    fontSize: 14,
    color: "#4B5563",
  },
});
