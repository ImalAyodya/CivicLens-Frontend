import React from 'react';
import { View, Image } from 'react-native';

const AppIcon = () => (
  <View style={{
    borderRadius: 18,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.0,
    shadowRadius: 8,
    marginBottom: 16,
    elevation: 4,
    backgroundColor: 'transparent', // transparent background
  }}>
    <Image
      source={require('../../../assets/logo.png')}
      style={{
        width: 200,
        height: 200,
        borderRadius: 12,
        resizeMode: 'contain',
      }}
    />
  </View>
);

export default AppIcon;