import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, Animated } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start(() => {
      // Wait, then fade out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          navigation.replace('Login');
        });
      }, 900); // Show splash fully for 0.9s after fade-in
    });
  }, [navigation, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoShadow, { opacity: fadeAnim }]}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        CIVICLENS
      </Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Your Lens on Politics
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 100,
    padding: 16,
    marginBottom: 18,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    color: '#dbeafe',
    fontSize: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
});

export default SplashScreen;