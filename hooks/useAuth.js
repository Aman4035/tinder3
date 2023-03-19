// import { View, Text } from 'react-native';
import React, { useState, useEffect, createContext, useContext } from 'react';
import * as Google from "expo-auth-session/providers/google";
//import * as Google from "expo-google-app-auth";

import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut,} from "@firebase/auth";
const AuthContext = createContext({});
    // initial state of the context
const config = {
  androidClientId: '644839056945-u11c9nsinao7gpu2358140a343v2q8bq.apps.googleusercontent.com',
  iosClientId: '644839056945-kc2n9o28ilk02n5erb1gqt87lbl9ftl0.apps.googleusercontent.com',
  scopes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};
export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(
    () => 
     onAuthStateChanged(auth, (user) => {
      if (user) {
        //Logged in
        setUser(user);
      } else {
        //Not Logged in
        setUser(null);
      }
      setLoadingInitial(false);
     }),
    
    []
  );
  const logout = () => {
    setLoading(true);
    signOut(auth)
    .catch((error) => setError(error))
    .finally(() => setLoading(false));
    
  };
   const signInWithGoogle = async () => {
    setLoading(true);
    await Google.logInAsync(config).then(async (logInResult) => {
      if (logInResult.type === "success") {
        //login...
        const { idToken, accessToken } = logInResult;
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        await signInWithCredential(auth, credential);
      }
      return Promise.reject();
    })
    .catch(error => setError(error))
    .finally(() => setLoading(false));
  };
  const memoedValue = useMemo(
    () => ({
      user,
        loading,
        error,
        signInWithGoogle,
        logout,

    }),
      [user, loading, error]
  );
  return (
    <AuthContext.Provider 
      value = {memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
    return useContext(AuthContext);
};
