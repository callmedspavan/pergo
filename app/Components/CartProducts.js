import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../Config/Colors";

function GroceryProduct({
  name,
  subitem,
  offer,
  image,
  pack,
  subproductid,
  itemcountincart,
  maxalloweditems,
  displayid,
  qty,
  mrp,
  sp,
  pp,
  prime,
  onPressPack,
  onPressPlusButton,
  onPressMinusButton
}) {
  return (
    <View style={styles.product}>
      <View style={styles.productcontainer}>
        <View style={styles.image}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: wp(28), height: hp(13) }}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../assets/noimage.jpg")}
              style={{ width: wp(28), height: hp(13) }}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.details}>
          <View style={styles.prices}>
            <View style={{ flexDirection: "row" }}>
              <MaterialCommunityIcons
                name="currency-inr"
                size={wp(4)}
                style={{ justifyContent: "center", alignSelf: "center" }}
              />
              <Text
                style={{
                  fontFamily: "Alata_400Regular",
                  fontSize: wp(5),
                  justifyContent: "center",
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                {sp}
              </Text>
            </View>
            {mrp == 0 ? null : (
              <View style={{ marginLeft: wp(8), alignSelf: "center" }}>
                <Text
                  style={{
                    fontFamily: "Alata_400Regular",
                    color: "grey",

                    fontSize: wp(4),
                  }}
                >
                  {mrp} x {qty}
                </Text>
              </View>
            )}

            {/* <View style={styles.discount}>
              <Text style={{ color: "white", fontFamily: "Alata_400Regular" }}>
                {offer}
              </Text>
            </View> */}
          </View>
          <View style={styles.name}>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: "Alata_400Regular",
                fontSize: wp(3.2),
                // color: "grey",
              }}
            >
              {name}
            </Text>
          </View>
          <View style={styles.packbutton}>
            {subitem ? (
              <TouchableOpacity onPress={onPressPack}>
                <View style={styles.pack}>
                  <Text
                    style={{
                      fontFamily: "Alata_400Regular",
                      fontSize: wp(3.1),
                      color: "#f07028",
                    }}
                  >
                    in {pack}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    color="#f07028"
                    size={wp(4.5)}
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      marginLeft: wp(1),
                    }}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.pack2}>
                <Text
                  style={{
                    fontFamily: "Alata_400Regular",
                    fontSize: wp(3.1),
                    color: "grey",
                  }}
                  numberOfLines={1}
                >
                  in {pack}
                </Text>
              </View>
            )}

            <View style={styles.Button2}>
              <TouchableOpacity onPress={onPressMinusButton} >
                <View style={styles.Button2minus}>
                  <Text
                    style={{
                      fontFamily: "Alata_400Regular",
                      color: "white",
                      fontSize: wp(3),
                    }}
                  >
                    -
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.Button2count}>
                <Text
                  style={{
                    fontFamily: "Alata_400Regular",
                    alignSelf: "center",
                    fontSize: wp(3),
                  }}
                >
                  {qty}
                </Text>
              </View>
              <TouchableOpacity onPress={onPressPlusButton} >
                <View style={styles.Button2plus}>
                  <Text
                    style={{
                      fontFamily: "Alata_400Regular",
                      color: "white",
                      fontSize: wp(3),
                    }}
                  >
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bestquality: {
    paddingVertical: hp(1.8),
    paddingLeft: wp(4),
    flexDirection: "row",
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.light,
  },
  Button: {
    width: wp(27),
    backgroundColor: "#f07028",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 4,
    flexDirection: "row",
  },
  Button2: {
    width: wp(27),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  Button2minus: {
    backgroundColor: "#f07028",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(2.7),
    borderRadius: 5,
  },
  Button2plus: {
    backgroundColor: "#f07028",
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(2.7),
    borderRadius: 5,
  },
  childcategories: {
    // marginVertical: hp(1),
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.light,
    paddingVertical: hp(1.7),
  },
  container: {
    // marginBottom: hp(1),
  },
  details: {
    width: wp(61),
    paddingLeft: wp(3),
  },
  diffrentiator: {
    height: hp(0.5),
    width: wp(100),
    backgroundColor: Colors.light,
    // marginTop: hp(1),
  },
  discount: {
    // marginTop: hp(1),
    backgroundColor: "#2fbb2f",
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(0.2),
    borderRadius: 5,
    marginLeft: wp(3),
  },
  icon: {
    backgroundColor: "#e2ffe0",
    width: wp(15),
    height: hp(7),
    borderRadius: 8,

    justifyContent: "center",
    alignItems: "center",
  },
  lable: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(2),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.light,
  },
  lableright: {
    flexDirection: "row",
    flex: 1.5,
    marginLeft: wp(4),
  },
  lableleft: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
  },
  name: {
    marginTop: hp(1),
  },
  pack: {
    flexDirection: "row",
    borderWidth: 0.8,
    width: wp(27),
    paddingLeft: wp(2),
    paddingVertical: wp(1),
    borderColor: Colors.light,
    justifyContent: "space-between",
    borderRadius: 3,
  },
  pack2: {
    flexDirection: "row",

    width: wp(27),
    paddingLeft: wp(2),
    paddingVertical: wp(1),

    justifyContent: "space-between",
  },
  packbutton: {
    marginTop: hp(1),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  product: {
    marginHorizontal: wp(2),
    width: wp(96),
    borderRadius: 5,

    borderWidth: 0.8,
    borderColor: Colors.light,
    marginTop: hp(1),
    elevation: 1.5,
    backgroundColor: "white",
  },
  productcontainer: {
    marginVertical: wp(4),
    flexDirection: "row",
    marginHorizontal: wp(3),
  },
  prices: {
    flexDirection: "row",
  },
  Prime: {
    marginTop: hp(1.5),
    backgroundColor: "#edfbfd",
    borderColor: "#1fa1ab",
    borderWidth: 0.2,
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primeprice: {
    flexDirection: "row",
  },
  text: {
    marginLeft: wp(3),
    justifyContent: "center",
  },
  unlockprice: {
    flexDirection: "row",
  },
});

export default GroceryProduct;
