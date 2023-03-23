import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";


import Profile from "../Screens/Profile";
import WalletTransactions from "../Screens/Wallettransactions";
import Refer from "../Screens/Refer";
const Stack = createStackNavigator();


const OrdersNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    
    <Stack.Screen name="Wallet" component={WalletTransactions} />
    <Stack.Screen name="Refer & Earn" component={Refer} options={{headerShown:false}} />
    
    
  </Stack.Navigator>
);

export default OrdersNavigator;
