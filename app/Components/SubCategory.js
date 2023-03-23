import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function SubCategory({ onPress, name, image, discount }) {
  return (
    <View
      style={{
        width: wp(29),
        backgroundColor: "white",
        elevation: 2,
        paddingHorizontal: wp(1),
        borderRadius: 5,
        marginBottom: hp(1),
        marginRight: wp(3.3),
      }}
    >
      {discount == null ? null : (
        <View
          style={{
            // backgroundColor: "#2fbb2f",
            width: wp(20),
            paddingTop: hp(1),
            borderRadius: 3,
            justifyContent: "flex-end",
            alignContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "#2fbb2f",
              fontWeight: "bold",
              fontSize: wp(3),
            }}
          >
            Upto {discount} Off
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={onPress}>
        {/* scimage */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: hp(0.5),
          }}
        >
          <Image
            source={{ uri: image }}
            style={{ width: wp(18), height: hp(9) }}
            resizeMode="cover"
          />
        </View>
        {/* scname */}
        <View
          style={{
            padding: wp(1.5),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            numberOfLines={2}
            style={{ textAlign: "center", fontWeight: "bold", fontSize: wp(3) }}
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SubCategory;
