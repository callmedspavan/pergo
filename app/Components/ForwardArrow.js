import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { login_view_height } from "../Config/Constants";

function ForwardArrow({ onPress }) {
  return (
    <TouchableOpacity
      style={{
        ...styles.forwadArrow,
        opacity: 1,
        transform: [{ translateY: 0 }],
      }}
      onPress={onPress}
    >
      <Animated.View>
        <MaterialCommunityIcons name="arrow-right-circle" size={50} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  forwadArrow: {
    position: "absolute",
    height: 60,
    width: 60,
    right: 10,
    bottom: login_view_height / 2,
    opacity: 1,
    zIndex: 10000,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
});

export default ForwardArrow;
