import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VideoScreen from '../video';
import VideoDetailScreen from "../videoDetail";
import SearchScreen from "../video/SearchScreen";
const VideoStack = createStackNavigator();

const VideoStackScreen = () => {
  return (
    <VideoStack.Navigator>
      <VideoStack.Screen name="Video" options={{headerShown: false}} component={VideoScreen} />
      <VideoStack.Screen name="Video-Detail" options={{headerShown: false}} component={VideoDetailScreen} />
      <VideoStack.Screen name="Video-Search" options={{headerShown: false}} component={SearchScreen} />
    </VideoStack.Navigator>
  );
}

export default VideoStackScreen;