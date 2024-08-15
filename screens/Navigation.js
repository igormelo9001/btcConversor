import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import Conversor from '../screens/Conversor';
import CryptoBot from '../screens/CryptoBot';
import CandlestickChart from '../screens/CandlestickChart';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" headerMode="none">
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Conversor" component={Conversor} options={{headerShown: false}}/>
        <Stack.Screen name="CryptoBot" component={CryptoBot} options={{headerShown: false}}/>
        <Stack.Screen name="CandlestickChart" component={CandlestickChart} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;