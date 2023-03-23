import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function Keywords({ name,onpress }) {
  return (
    <TouchableOpacity onPress={onpress} >
    <View style={styles.keywords}>
      <Text
        numberOfLines={1}
        style={{ fontWeight: "bold", fontStyle: "italic", color:"black" }}
      >
        {name}
      </Text>
    </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  keywords: {
    backgroundColor: "#e3fffd",
    // width: wp(21),
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: wp(1.6),
    paddingHorizontal: wp(2),
    borderRadius: 20,
    borderColor: "#9ae6e1",
    borderWidth: 2,
    marginTop: wp(1.9),
    marginRight: wp(1.5),
  },
});

export default Keywords;
