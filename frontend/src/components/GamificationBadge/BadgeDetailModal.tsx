import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from '../../services/badgeService';

interface BadgeDetailModalProps {
  badge: Badge | null;
  isVisible: boolean;
  onClose: () => void;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  isVisible,
  onClose,
}) => {
  if (!badge) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.badgeIconContainer}>
            <View
              style={[
                styles.badgeIcon,
                {
                  backgroundColor: badge.color,
                },
              ]}
            >
              <Text style={styles.iconText}>{badge.icon}</Text>
            </View>
          </View>

          <Text style={styles.badgeName}>{badge.name}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>
          
          <Text style={styles.achievementText}>
            Achievement Unlocked at {badge.minScore}% or higher
          </Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  badgeIconContainer: {
    marginBottom: 16,
  },
  badgeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 50,
  },
  badgeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937', // gray-800
    marginBottom: 8,
  },
  badgeDescription: {
    fontSize: 16,
    color: '#4b5563', // gray-600
    textAlign: 'center',
    marginBottom: 16,
  },
  achievementText: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#3b82f6', // blue-500
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default BadgeDetailModal;