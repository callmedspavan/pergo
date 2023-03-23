import React from "react";
import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { max } from "react-native-reanimated";

function Subpack({
  name,
  mrp,
  sp,
  pp,
  itemcountincart,
  maxalloweditems,
  onPressPlusButton,
  onPressMinusButton,
}) {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View style={{ paddingBottom: hp(1), width: wp(43) }}>
        <Text style={{ paddingTop: hp(1), fontWeight: "bold", color: "black", }}>
          {name}
        </Text>
        <View style={{ flexDirection: "row", paddingVertical: hp(1) }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: wp(3) }}>₹{sp}</Text>
          </View>
          <View style={{ flexDirection: "row", marginLeft: wp(2) }}>
            <Text
              style={{
                fontSize: wp(3),
                color: "grey",
                textDecorationLine: "line-through",
              }}
            >
              ₹{mrp}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginLeft: wp(2) }}>
            <Text style={{ fontSize: wp(3), color: "#1fa1ab" }}>₹{pp}</Text>
          </View>
        </View>
      </View>
      <View style={{ alignSelf: "center" }}>
        {itemcountincart > 0 ? (
          <View
            style={{
              width: wp(21),
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={onPressMinusButton}>
              <View
                style={{
                  width: wp(6.5),
                  backgroundColor: "#f07028",
                  paddingVertical: wp(1),
                  alignItems: "center",
                  borderRadius: 5,
                }}
              >
                <Text style={{ fontWeight: "bold", color: "white", }}>-</Text>
              </View>
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                color: "black",
              }}
            >
              {itemcountincart}
            </Text>
            {maxalloweditems == itemcountincart ? (
              <TouchableOpacity
                onPress={() =>
                  ToastAndroid.show(
                    "Sorry you cant add more off this item",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  )
                }
              >
                <View
                  style={{
                    width: wp(6.5),
                    backgroundColor: "#cccccc",
                    paddingVertical: wp(1),
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>+</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onPressPlusButton}>
                <View
                  style={{
                    width: wp(6.5),
                    backgroundColor: "#f07028",
                    paddingVertical: wp(1),
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ fontWeight: "bold", color: "white" }}>+</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={onPressPlusButton}>
            <View
              style={{
                backgroundColor: "#f07028",
                width: wp(21),
                paddingVertical: wp(1),
                alignItems: "center",
                borderRadius: 2,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "white" }}>Add </Text>
              <Text style={{ fontWeight: "bold", color: "white" }}>+</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default Subpack;
