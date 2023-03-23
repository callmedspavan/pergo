import React from "react";
import { View, StyleSheet, Image, Text, SafeAreaView } from "react-native";

import Colors from "../Config/Colors";

import Constants from "expo-constants";

function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={style}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
export default Screen;
