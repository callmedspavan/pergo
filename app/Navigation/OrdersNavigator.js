import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";


import Orders from "../Screens/Orders";
import OrderDetails from "../Screens/OrderDetails";
const Stack = createStackNavigator();


const OrdersNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Orders"
      component={Orders}
      options={{ headerShown: false }}
    />
    
    <Stack.Screen name="Order Summary" component={OrderDetails} />
    
    
  </Stack.Navigator>
);

export default OrdersNavigator;
