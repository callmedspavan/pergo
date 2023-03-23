import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import GroceryLanding from "../Screens/GroceryLanding";
import LandingScreen from "../Screens/LandingScreen";
import GroceryProducts from "../Screens/GroceryProducts";
import FoodLanding from "../Screens/FoodLanding";
import FishAndMeatLanding from "../Screens/FishAndMeatLanding";
import FoodMenu from "../Screens/FoodMenu";
import GrocerySearch from "../Screens/GrocerySearch";
import FoodSearch from "../Screens/FoodSearch";
import FruitsAndVegitablesSearch from "../Screens/FruitsAndVegitablesSearch";
import GroceryCart from "../Screens/GroceryCart";
import ServiceCart from "../Screens/ServicesCart";
import GrocerySearchResult from "../Screens/GrocerySearchResult";
import OrderDetails from "../Screens/OrderDetails"
import Maps from "../Screens/Maps";
import FruitsAndVegitables from "../Screens/FruitsAndVegitablesLanding";
import SavedAddress from "../Screens/SavedAddress";
import FoodSearchResult from "../Screens/FoodSearchResult"
import Medicines from "../Screens/MedicinesLanding";
import SweetsAndBakeries from "../Screens/SweetsAndBakeriesLanding";
import FishAndMeatSearch from "../Screens/FishAndMeatSearch";
import MedicinesSearch from "../Screens/MedicinesSearch";
import SweetsAndBakerySearch from "../Screens/SweetsAndBakerySearch";
import FishAndMeatSearchResult from "../Screens/FishAndMeatSearchResult";
import FruitsAndVegitablesSearchResult from "../Screens/FruitsAndVegitablesSearchResult";
import MedicinesSearchResult from "../Screens/MedicinesSearchResult";
import SweetsAndBakerySearchResult from "../Screens/SweetsAndBakerySearchResult";
const Stack = createStackNavigator();


const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Landing"
      component={LandingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Grocery" component={GroceryLanding} />
    <Stack.Screen name="Grocery Search" component={GrocerySearch} />
    <Stack.Screen name="Food Search" component={FoodSearch} />
    <Stack.Screen name="Fruits & Vegitables Search" component={FruitsAndVegitablesSearch} />
    <Stack.Screen name="Fish & Meat Search" component={FishAndMeatSearch} />
    <Stack.Screen name="Medicines Search" component={MedicinesSearch} />
    <Stack.Screen name="Sweets & Bakery Search" component={SweetsAndBakerySearch} />

    <Stack.Screen name="Medicines" component={Medicines} />
    <Stack.Screen name="Sweets & Bakeries" component={SweetsAndBakeries} />


    <Stack.Screen name="Grocery Cart" component={GroceryCart} />
    <Stack.Screen name="Cart" component={ServiceCart} />
    <Stack.Screen name="Grocery Result" component={GrocerySearchResult} />
    <Stack.Screen name="Food Result" component={FoodSearchResult} />
    <Stack.Screen name="Fish & Meat Result" component={FishAndMeatSearchResult} />
    <Stack.Screen name="Fruits & Vegitables Result" component={FruitsAndVegitablesSearchResult} />
    <Stack.Screen name="Medicines Result" component={MedicinesSearchResult} />
    <Stack.Screen name="Sweets & Bakery Result" component={SweetsAndBakerySearchResult} />



    <Stack.Screen
      name="View Products"
      component={GroceryProducts}
      options={({ route, navigation }) => ({
        title: route.params.name,
      })}
    />
    <Stack.Screen name="Food" component={FoodLanding} />
    <Stack.Screen name="Fish & Meat" component={FishAndMeatLanding} />
    <Stack.Screen name="Fruits & Vegitables" component={FruitsAndVegitables} />
    <Stack.Screen name="Maps" component={Maps} options={{headerShown:false}} />
    <Stack.Screen name="Addresses" component={SavedAddress}  />
    <Stack.Screen
      name="Menu"
      component={FoodMenu}
      options={({ route, navigation }) => ({
        title: route.params.name,
      })}
    />
  </Stack.Navigator>
);

export default HomeNavigator;
