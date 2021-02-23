import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LadyScreen from '../lady';
import LadyDetailScreen from "../ladyDetail";
import SearchScreen from "../lady/SearchScreen";

const LadyStack = createStackNavigator();

const LadyStackScreen = () => {
  return (
    <LadyStack.Navigator>
      <LadyStack.Screen name="Lady" options={{headerShown: false}} component={LadyScreen} />
      <LadyStack.Screen name="Lady-Detail" options={{headerShown: false}} component={LadyDetailScreen} />
      <LadyStack.Screen name="Lady-Search" options={{headerShown: false}} component={SearchScreen} />
    </LadyStack.Navigator>
  );
}

export default LadyStackScreen;