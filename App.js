//import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
//import tw from "tailwind-rn";
//import {useTailwind} from 'tailwind-rn';
import StackNavigator from './StackNavigator';
import { AuthProvider } from "./hooks/useAuth";
export default function App() {
  // const tailwind = useTailwind();
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

