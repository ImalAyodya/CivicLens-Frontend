import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from '../../services/badgeService';

interface BadgeComponentProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  showName?: boolean;
}

const BadgeComponent: React.FC<BadgeComponentProps> = ({
  badge,
  size = 'medium',
  onPress,
  showName = true,
}) => {
  // Size mappings
  const sizes = {
    small: {
      container: 30,
      icon: 14,
      name: 10,
    },
    medium: {
      container: 50,
      icon: 24,
      name: 12,
    },
    large: {
      container: 70,
      icon: 32,
      name: 14,
    },
  };

  const currentSize = sizes[size];

  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={styles.wrapper}>
      <Container
        style={[
          styles.container,
          {
            backgroundColor: badge.color,
            width: currentSize.container,
            height: currentSize.container,
            borderRadius: currentSize.container / 2,
          },
        ]}
        onPress={onPress}
      >
        <Text style={{ fontSize: currentSize.icon }}>{badge.icon}</Text>
      </Container>
      {showName && <Text style={styles.badgeName}>{badge.name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    margin: 4,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  badgeName: {
    marginTop: 4,
    fontSize: 10,
    textAlign: 'center',
    color: '#4b5563', // gray-600
    maxWidth: 80,
  },
});

export default BadgeComponent;