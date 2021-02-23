import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AlbumScreen from '../album';
import AlbumDetailScreen from '../albumDetail'

const AlbumStack = createStackNavigator();

const AlbumStackScreen = () => {
  return (
    <AlbumStack.Navigator>
      <AlbumStack.Screen name="Album" options={{headerShown: false}} component={AlbumScreen} />
      <AlbumStack.Screen name="Album-Detail" options={{headerShown: false}} component={AlbumDetailScreen} />
    </AlbumStack.Navigator>
  );
}

export default AlbumStackScreen;