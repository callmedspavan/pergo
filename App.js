import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import SwiperComponents from "./app/Screens/Swiper";
import LoginComponent from "./app/Screens/Login";
import Otp from "./app/Screens/Otp";
import LandingScreen from "./app/Screens/LandingScreen";
import AuthNavigator from "./app/Navigation/AuthNavigator";
import AppNavigator from "./app/Navigation/AppNavigator";
import NavigationTheme from "./app/Navigation/NavigationTheme";
import OneSignal from 'react-native-onesignal';
import GroceryLanding from "./app/Screens/GroceryLanding";
import GroceryProducts from "./app/Screens/GroceryProducts";
import FoodLanding from "./app/Screens/FoodLanding";
import AuthContext from "./app/Auth/Context";
import authStorage from "./app/Auth/Storage";
import SplashScreen from 'react-native-splash-screen'

export default function App() {

  
    
   
  

  const [user, setUser] = useState();
  const [location, setLocation] = useState([]);

  const userkey = "USER"
  const restoreUserToken = async (userkey) => {
    const token = await authStorage.getToken(userkey);
    if (!token) return;
    const token2 = JSON.parse(token);
    setUser(token2);
  }; 
const locationkey = "LOCATION"
  const restoreLocationToken = async (locationkey) => {
    const token = await authStorage.getToken(locationkey);
    if (!token) return;
    const token2 = JSON.parse(token);
    console.log(token2)
    setLocation(token2);
  };

  const onReceived = (notification) =>{
    console.log("Notification received: ", notification);
  }

  const onOpened = (openResult) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  const onIds = (device) => {
    console.log('Device info: ', device);
  }

  useEffect(() => {
    SplashScreen.hide();
    restoreLocationToken(locationkey);
    restoreUserToken(userkey);

     //Remove this method to stop OneSignal Debugging 
     OneSignal.setLogLevel(6, 0);
    
     // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
     OneSignal.init("67129ae3-e5f5-4777-8959-b82dbd15e47c", {kOSSettingsKeyAutoPrompt : false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption:2});
     OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
     
     
   
      OneSignal.addEventListener('received', onReceived);
      OneSignal.addEventListener('opened', onOpened);
      OneSignal.addEventListener('ids', onIds);
      return()=>{
        OneSignal.removeEventListener('received',onReceived);
    OneSignal.removeEventListener('opened',onOpened);
    OneSignal.removeEventListener('ids', onIds);
      }
    
  }, []);

  

  return (
    <AuthContext.Provider value={{ user, setUser, location, setLocation }}>
      <NavigationContainer theme={NavigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
