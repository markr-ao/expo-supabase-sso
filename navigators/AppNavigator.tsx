import React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import AccountScreen from "../screens/AccountScreen";

export type AppStackParamList = {
  Account: undefined;
};

// use this with the hook useNavigation like this:
// const navigation = useNavigation<AppNavProps<'Home'>>();
// to have access to the navigation prop
export type AppNavProps<T extends keyof AppStackParamList> =
  NativeStackNavigationProp<AppStackParamList, T>;

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={"Account"} component={AccountScreen} />
    </Stack.Navigator>
  );
};
