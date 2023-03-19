//import { StatusBar } from 'expo-status-bar';
import React from 'react'; ab
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
        {/* HOC- Higher Order Component */}
        <AuthProvider>
          {/* Passes down the cool auth stuff to children */}
          <StackNavigator />
        </AuthProvider>
        
      </NavigationContainer>
    
  );
}

