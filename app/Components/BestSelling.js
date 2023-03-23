import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Colors from "../Config/Colors";

function BestSelling({
  image,
  sp,
  mrp,
  pp,
  name,
  pack,
  offer,
  subitem,
  onPressPack,
  itemcountincart,
  onPressPlusButton,
  maxalloweditems,
  onPressMinusButton,
  prime,
}) {
  return (
    <View style={styles.item}>
      <View style={styles.box}>
        <View style={styles.row1}>
          <View>
            <Image
              source={{ uri: image }}
              style={{ width: wp(25), height: hp(13) }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.price}>
            <View style={{ flexDirection: "row" }}>
            
              {prime == false ? (
                <>
                <Text style={{ fontWeight: "bold", fontSize: wp(5), color:"black" }}>
                ₹{sp}
                </Text>
                </>
              ) : ( 
                <>
                <MaterialCommunityIcons
                name="currency-inr"
                size={wp(5)}
                color= "#1fa1ab"
                style={{ justifyContent: "center", alignSelf: "center" }}
              />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: wp(5),
                    color: "#1fa1ab",
                  }}
                >
                  ₹{pp}
                </Text>
                </>
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              {mrp == 0 || sp == mrp ? null : (
                <>
                <Text
                  style={{
                    fontSize: wp(3),
                    color: "grey",
                    textDecorationLine: "line-through",
                  }}
                >
                  ₹{mrp}
                </Text>
                </>
              )}

              {prime == true || sp == pp ? null : (
                <Text
                  style={{
                    fontSize: wp(3),
                    color: "#1fa1ab",
                    marginLeft: wp(2),
                    fontWeight: "bold",
                  }}
                >
                  ₹{pp}
                </Text>
              )}
            </View>
            {offer == 0 ? null : (
              <View style={styles.discount}>
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  {offer}% Off
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.row2}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "#48494B" }}
          >
            {name}
          </Text>
          {subitem ? (
            <TouchableOpacity onPress={onPressPack}>
              <View style={{ flexDirection: "row", marginTop: hp(0.3) }}>
                <Text style={{ color: "#48494B", fontWeight: "bold" }}>
                  {pack}
                </Text>
                <View
                  style={{
                    marginLeft: wp(0.5),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="chevron-down"
                    color="#32CD32"
                    size={wp(4)}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", marginTop: hp(0.3) }}>
              <Text style={{ color: "#48494B", fontWeight: "bold" }}>
                {pack}
              </Text>
              <View
                style={{
                  marginLeft: wp(0.5),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
            </View>
          )}
        </View>
        {itemcountincart == 0 ? (
          <TouchableOpacity onPress={onPressPlusButton}>
            <View style={styles.button1}>
              <Text style={{ fontWeight: "bold", color: "#47044f" }}>
                Add +
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.button2}>
            <TouchableOpacity onPress={onPressMinusButton}>
              <View style={styles.button2minus}>
                <Text style={{ fontWeight: "bold",color: "#47044f" }}>-</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.button2quantity}>
              <Text style={{ fontWeight: "bold",color: "#47044f" }}>{itemcountincart}</Text>
            </View>
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
                <View style={styles.button2plusdisable}>
                  <Text style={{ fontWeight: "bold", color: "white" }}>+</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onPressPlusButton}>
                <View style={styles.button2plus}>
                  <Text style={{ fontWeight: "bold",color: "#47044f" }}>+</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 5,
    borderWidth: wp(0.2),
    borderColor: "#dddddd",
    width: wp(50),
    padding: wp(3.5),
    marginBottom: hp(1),
    marginTop: hp(1),
  },
  button1: {
    backgroundColor: "#ffaa01",
    paddingVertical: hp(0.7),
    marginTop: hp(1.7),
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    marginTop: hp(1.7),
    justifyContent: "space-between",
    flexDirection: "row",
  },
  button2minus: {
    backgroundColor: "#ffaa01",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(2.7),
    borderRadius: 5,
  },
  button2plus: {
    backgroundColor: "#ffaa01",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(2.7),
    borderRadius: 5,
  },
  button2plusdisable: {
    backgroundColor: "#cccccc",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(2.7),
    borderRadius: 5,
  },
  button2quantity: {
    alignSelf: "center",
  },
  discount: {
    marginTop: hp(1),
    backgroundColor: "#2fbb2f",
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(0.5),
    borderRadius: 5,
  },
  item: {
    marginLeft: wp(2.5),
    marginBottom: hp(0.5),
    overflow: "hidden",
  },
  price: {
    paddingLeft: wp(2.5),
    alignItems: "flex-start",
    justifyContent: "center",
  },
  row1: {
    flexDirection: "row",
  },
  row2: {
    marginTop: hp(1),
  },
});

export default BestSelling;
