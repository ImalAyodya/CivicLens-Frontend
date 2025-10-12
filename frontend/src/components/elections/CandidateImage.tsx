import React, { useState } from 'react';
import { Image, View, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CandidateImageProps {
  imageUrl?: string;
  size?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

const CandidateImage: React.FC<CandidateImageProps> = ({ 
  imageUrl, 
  size = 50, 
  borderRadius = 25,
  style
}) => {
  const [imageError, setImageError] = useState(false);

  // Array of local candidate placeholder images from assets
  const localCandidateImages = [
    require('../../../assets/images/politician1.jpeg'),
    require('../../../assets/images/politician2.jpg'),
    require('../../../assets/images/politician3.jpg'),
    require('../../../assets/images/gotabhaya_rajapaksha.png'),
  ];

  // Choose a random local image
  const getRandomLocalImage = () => {
    const randomIndex = Math.floor(Math.random() * localCandidateImages.length);
    return localCandidateImages[randomIndex];
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View style={[styles.container, style, { width: size, height: size, borderRadius: borderRadius }]}>
      {(!imageUrl || imageError) ? (
        <Image 
          source={getRandomLocalImage()} 
          style={[styles.image, { width: size, height: size, borderRadius: borderRadius }]}
          resizeMode="cover"
        />
      ) : (
        <Image 
          source={{ uri: imageUrl }} 
          style={[styles.image, { width: size, height: size, borderRadius: borderRadius }]}
          resizeMode="cover"
          onError={handleImageError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
  }
});

export default CandidateImage;