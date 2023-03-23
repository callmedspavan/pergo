import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Otp from "../Screens/Otp";
import LoginComponent from "../Screens/Login";
import Swiper from "../Screens/Swiper";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="Swiper">
    <Stack.Screen
      name="Login"
      component={LoginComponent}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
    <Stack.Screen
      name="Swiper"
      component={Swiper}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
