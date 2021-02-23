import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GirlScreen from '../girl';
import GirlDetailScreen from '../girlDetail';
import SearchScreen from "../girl/SearchScreen";

const GirlStack = createStackNavigator();

const GirlStackScreen = () => {
  return (
    <GirlStack.Navigator>
      <GirlStack.Screen name="Girl" options={{headerShown: false}} component={GirlScreen} />
      <GirlStack.Screen name="Girl-Detail" options={{headerShown: false}} component={GirlDetailScreen} />
      <GirlStack.Screen name="Girl-Search" options={{headerShown: false}} component={SearchScreen} />
    </GirlStack.Navigator>
  );
}

export default GirlStackScreen;