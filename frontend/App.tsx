import "./global.css"
import { Text, View } from "react-native";
import { Image } from 'react-native';

 
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Text className="text-lg text-gray-500">
        Edit App.tsx to start working on your app
      </Text>
      <Text className="text-lg text-gray-500">
        This is a simple example of using Nativewind with React Native.
      </Text>
      <Image
        source={{ uri: 'https://res.cloudinary.com/dn7f8ck8c/image/upload/v1755098121/main-sample.png' }}
        style={{ width: 200, height: 200, borderRadius: 10 }}
        resizeMode="cover"
      />
    </View>
  );
}