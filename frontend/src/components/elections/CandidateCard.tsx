import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CandidateImage from './CandidateImage';

interface CandidateProps {
  candidate: {
    id: string;
    name: string;
    party: string;
    position?: string;
    imageUrl?: string;
    votes?: number;
    percentage?: number;
    promiseFulfillment?: number;
  };
  onPress?: () => void;
}

// Function to get appropriate party colors
const getPartyColors = (party: string): readonly [string, string] => {
  const colorMap: Record<string, readonly [string, string]> = {
    'UNP': ['#0066CC', '#0056a9'] as const,
    'SLPP': ['#E51C23', '#c41017'] as const,
    'SJB': ['#00CC66', '#00a352'] as const,
    'NPP': ['#CC0000', '#b00000'] as const,
    'JVP': ['#FF9800', '#e68a00'] as const,
    'SLFP': ['#0000CC', '#0000aa'] as const,
    'TNA': ['#FFCC00', '#e6b800'] as const,
    'UPFA': ['#1B75BB', '#165d94'] as const,
    'NDF': ['#4CAF50', '#3d8c40'] as const
  };
  
  // Default color if party not found in map
  return colorMap[party] || (['#4A5568', '#2D3748'] as const);
};

const CandidateCard: React.FC<CandidateProps> = ({ candidate, onPress }) => {
  const partyColors = getPartyColors(candidate.party);
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      <LinearGradient
        colors={partyColors}
        style={styles.partyIndicator}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <CandidateImage 
            imageUrl={candidate.imageUrl} 
            size={60}
            borderRadius={30}
          />
        </View>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {candidate.name}
          </Text>
          
          <View style={styles.partyContainer}>
            <View style={[styles.partyDot, { backgroundColor: partyColors[0] }]} />
            <Text style={styles.party}>{candidate.party}</Text>
          </View>
          
          {candidate.position && (
            <Text style={styles.position}>{candidate.position}</Text>
          )}
          
          {typeof candidate.promiseFulfillment === 'number' && (
            <View style={styles.promiseContainer}>
              <Text style={styles.promiseLabel}>Promise Fulfillment</Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${candidate.promiseFulfillment}%`, backgroundColor: partyColors[0] }
                  ]} 
                />
              </View>
              <Text style={styles.promisePercentage}>{candidate.promiseFulfillment}%</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },
  partyIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 4,
  },
  partyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  partyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  party: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  position: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 8,
  },
  promiseContainer: {
    marginTop: 6,
  },
  promiseLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#EDF2F7',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  promisePercentage: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A5568',
  }
});

export default CandidateCard;