import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStackScreen from './src/screens/navigation/AppStackScreen';
import LandingScreen from './src/screens/LandingScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from './src/components/Context';
import codePush from "react-native-code-push";

export default function App() {
  const [loading, setLoading] = React.useState(true);
  const [showSecurity, setShowSecurity] = React.useState(false);

  React.useEffect(() => {
    codePush.sync({
        updateDialog: true,
        installMode: codePush.InstallMode.IMMEDIATE
    });
   
    (async () => {
      const security = await AsyncStorage.getItem('security');
      if(security !== null && security !== ''){
        setShowSecurity(true);
      }
      else{
        setShowSecurity(false);
      }
    })()

    setTimeout(() =>{
      setLoading(false)
    }, 3000)

  }, []);

  const authContext = React.useMemo(() => ({
      setShowSecurity: async (security) => {
        setShowSecurity(security);
      },
      setLoading: async (loading) => {
        setLoading(loading);
      },
  }));

  return (
    <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          { loading == false 
            ? showSecurity == false ? <AppStackScreen/>
              : <SecurityScreen/>
            : <LandingScreen/>
          }
        </NavigationContainer>
    </AuthContext.Provider>
  );
}