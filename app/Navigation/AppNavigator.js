import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import LandingScreen from "../Screens/LandingScreen";
import Orders from "../Screens/Orders";
import PrimeMembership from "../Screens/PrimeMembership";
import Profile from "../Screens/Profile";
import HomeNavigator from "../Navigation/HomeNavigator";
import OrdersNavigator from "../Navigation/OrdersNavigator";
import ProfileNavigator from "../Navigation/ProfileNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Orders"
      component={OrdersNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="basket" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Membership"
      component={PrimeMembership}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="wallet-membership"
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);
export default AppNavigator;
