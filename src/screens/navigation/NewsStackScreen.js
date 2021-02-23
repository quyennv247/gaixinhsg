import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsScreen from '../news';
import NewsDetailScreen from "../newsDetail";
import SearchScreen from "../news/SearchScreen";

const NewsStack = createStackNavigator();

const NewsStackScreen = () => {
  return (
    <NewsStack.Navigator>
      <NewsStack.Screen name="News" options={{headerShown: false}} component={NewsScreen} />
      <NewsStack.Screen name="News-Detail" options={{headerShown: false}} component={NewsDetailScreen} />
      <NewsStack.Screen name="News-Search" options={{headerShown: false}} component={SearchScreen} />
    </NewsStack.Navigator>
  );
}

export default NewsStackScreen;