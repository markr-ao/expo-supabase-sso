import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppNavigator } from "./navigators/AppNavigator";
import { AuthNavigator } from "./navigators/AuthNavigator";
import { AuthContextProvider, useAuthUser } from "./contexts/AuthProvider";
import "react-native-url-polyfill/auto";

const Root = () => {
  const user = useAuthUser();

  return (
    <NavigationContainer>
      {user !== null ? <AppNavigator /> : <AuthNavigator />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthContextProvider>
      <Root />
    </AuthContextProvider>
  );
}
