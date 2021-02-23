import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from '../account';
import ProfileScreen from "../account/ProfileScreen";
import ChangePasswordScreen from "../account/ChangePasswordScreen";
import SecurityScreen from "../account/SecurityScreen";
import MessengerScreen from "../messenger/index";

const AccountStack = createStackNavigator();

const AccountStackScreen = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen name="Account" options={{headerShown: false}} component={AccountScreen} />
      <AccountStack.Screen name="Profile" options={{headerShown: false}} component={ProfileScreen} />
      <AccountStack.Screen name="ChangePassword" options={{headerShown: false}} component={ChangePasswordScreen} />
      <AccountStack.Screen name="Security" options={{headerShown: false}} component={SecurityScreen} />
      <AccountStack.Screen name="Messenger" options={{headerShown: false}} component={MessengerScreen} />
    </AccountStack.Navigator>
  );
}

export default AccountStackScreen;