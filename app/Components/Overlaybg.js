import React from "react";
import Animated, { interpolate } from "react-native-reanimated";
import { Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { login_view_height, screen_height } from "../Config/Constants";

function OverlayBg({ isOpenAnimation }) {
  const translateY = interpolate(isOpenAnimation, {
    inputRange: [0, 0.5, 1],
    outputRange: [
      screen_height - login_view_height,
      login_view_height / 10,
      -login_view_height / 3,
    ],
  });

  //   const backgroundColor = interpolate(isOpenAnimation, {
  //     inputRange: [0, 1],
  //     outputRange: ["#ffff", "#ffcc00"],
  //   });

  return (
    <Animated.View
      style={{
        height: login_view_height,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffcc00",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        transform: [{ translateY }],
      }}
    ></Animated.View>
  );
}

export default OverlayBg;
