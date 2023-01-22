// import { View, Text } from 'react-native';
import React, { createContext, useContext } from 'react';
import * as Google from "expo-auth-session";
const AuthContext = createContext({});
    // initial state of the context

export const AuthProvider = ({ children }) => {
  const signInWithGoogle = async () => {
    await Google.logInAsync()
  }
  return (
    <AuthContext.Provider value ={{user: "Sonny",}}>
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
    return useContext(AuthContext);
}