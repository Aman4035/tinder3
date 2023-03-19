//import { StatusBar } from 'expo-status-bar';
import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { Button, StyleSheet, Text, View, LogBox } from 'react-native';
import StackNavigator from './StackNavigator';
import { AuthProvider } from "./hooks/useAuth";
LogBox.ignoreAllLogs(); //Ignore log notification by message
//import tw from "tailwind-rn";
import {useTailwind} from 'tailwind-rn';
export default function App() {
   const tailwind = useTailwind();


  
  return (
      <NavigationContainer>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
        
      </NavigationContainer>
    
  );
}

