import React from "react";
import { StyleSheet } from "react-native";
import Animated, { interpolate } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TapGestureHandler } from "react-native-gesture-handler";

function HeaderBackArrow({ isOpenAnimation, gestureHandler }) {
  const opacity = interpolate(isOpenAnimation, {
    inputRange: [0, 0.9, 1],
    outputRange: [0, 0, 1],
  });
  return (
    <TapGestureHandler {...gestureHandler}>
      <Animated.View style={{ ...styles.backarrow, opacity }}>
        <MaterialCommunityIcons name="arrow-left" size={24} />
      </Animated.View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  backarrow: {
    position: "absolute",
    height: 60,
    width: 60,
    top: 40,
    left: 25,
    zIndex: 100,
  },
});

export default HeaderBackArrow;
