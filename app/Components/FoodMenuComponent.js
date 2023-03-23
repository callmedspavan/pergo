import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
// import { AppLoading } from "expo";

function FoodMenuComponent({
  name,
  discription,
  price,
  sellingprice,
  image,
  pureveg,
  itemCountincart,
  status,
  subpacks,
  showSubPacks,
  recommended,
  categoryname,
  plusCart,
  minusCart,
  key,
}) {
  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <View style={styles.menu} key={key}>
      <View style={{ flexDirection: "row" }}>
        {image == "" ? null : (
          <View style={styles.menuimage}>
            <Image
              source={require("../assets/Food/Tastyrolls.jpg")}
              style={{ height: hp(9.5), width: wp(20), borderRadius: 5 }}
            />
          </View>
        )}

        <View style={styles.menuname}>
          {pureveg == true ? (
            <View style={{ marginTop: 3.5 }}>
              <Image
                source={require("../assets/Food/vegicon.png")}
                style={{
                  height: hp(1.9),
                  width: wp(2.6),
                  borderRadius: 5,
                }}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={{ marginTop: 3.5 }}>
              <Image
                source={require("../assets/Food/nonvegicon.png")}
                style={{
                  height: hp(1.9),
                  width: wp(2.6),
                  borderRadius: 5,
                }}
                resizeMode="contain"
              />
            </View>
          )}

          <View>
            <Text
              style={{
                paddingLeft: wp(1.8),
                fontFamily: "Alata_400Regular",
                color: "black",
              }}
            >
              {name}
            </Text>
            {discription == "" ? null : (
              <Text
                style={{
                  paddingLeft: wp(1.8),
                  fontSize: wp(2.5),
                  fontFamily: "Alata_400Regular",
                  color: "grey",
                  marginTop: hp(0.5),
                }}
              >
                {discription}
              </Text>
            )}

            <Text
              style={{
                paddingLeft: wp(1.8),
                fontSize: wp(2.5),
                fontFamily: "Alata_400Regular",
                color: "grey",
                marginTop: hp(0.5),
              }}
            >
              in {categoryname}
            </Text>

            {recommended == null ? (
              <View
                style={{
                  backgroundColor: "#1fa1ab",
                  marginTop: hp(0.7),
                  width: wp(17),
                  borderRadius: 5,
                  marginLeft: wp(1.8),
                  paddingBottom: hp(0.2),
                }}
              >
                <Text
                  style={{
                    fontFamily: "Alata_400Regular",
                    alignSelf: "center",
                    color: "white",
                    fontSize: wp(2.5),
                  }}
                >
                  Best Seller
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#1fa1ab",
                  marginTop: hp(0.7),
                  width: wp(17),
                  borderRadius: 5,
                  marginLeft: wp(1.8),
                  paddingBottom: hp(0.2),
                }}
              >
                <Text
                  style={{
                    fontFamily: "Alata_400Regular",
                    alignSelf: "center",
                    color: "white",
                    fontSize: wp(2.5),
                  }}
                >
                  Best Seller
                </Text>
              </View>
            )}

            {price == sellingprice ? (
              <Text
                style={{
                  paddingLeft: wp(2.5),
                  fontFamily: "Alata_400Regular",
                  marginTop: hp(0.5),
                  color: "black",
                }}
              >
                {sellingprice}/-
              </Text>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    paddingLeft: wp(1.8),
                    fontFamily: "Alata_400Regular",
                    marginTop: hp(0.5),
                    color: "grey",
                    textDecorationLine: "line-through",
                    fontSize: wp(3),
                    alignSelf: "center",
                  }}
                >
                  {price}/-
                </Text>
                <Text
                  style={{
                    marginLeft: wp(2.5),
                    fontFamily: "Alata_400Regular",
                    marginTop: hp(0.5),
                    color: "black",
                  }}
                >
                  {sellingprice}/-
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {status == 1 ? (
        <View>
          {itemCountincart > 0 ? (
            <View style={styles.button2}>
              <TouchableOpacity
                onPress={subpacks == true ? () => showSubPacks() : minusCart}
                style={styles.button2minus}
              >
                <View>
                  <Text
                    style={{ color: "#2fbb2f", fontFamily: "Alata_400Regular", fontSize:wp(3.5) }}
                  >
                    -
                  </Text>
                </View>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "Alata_400Regular",
                  alignSelf: "center",
                  color: "#2fbb2f",
                }}
              >
                {itemCountincart}
              </Text>
              <TouchableOpacity
                onPress={subpacks == true ? () => showSubPacks() : plusCart}
                style={styles.button2plus}
              >
                <View>
                  <Text
                    style={{ color: "#2fbb2f", fontFamily: "Alata_400Regular", fontSize:wp(3.5) }}
                  >
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={subpacks == true ? () => showSubPacks() : plusCart}
            >
              <View style={styles.button}>
                <Text
                  style={{
                    fontFamily: "Alata_400Regular",
                    alignSelf: "center",
                    color: "#2fbb2f",
                    fontSize:wp(3.5)
                  }}
                >
                  Add +
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {subpacks == true ? (
            <Text
              style={{
                fontFamily: "Alata_400Regular",
                alignSelf: "center",
                color: "orange",
                fontSize: wp(2),
              }}
            >
              Customizable
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.buttondisable}>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              alignSelf: "center",
              color: "grey",
              fontSize: wp(1.8),
              marginHorizontal: wp(2),
            }}
          >
            Next Available at tommorow
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    width: wp(20),
    height: hp(3.5),
    borderRadius: 5,
    borderColor: "#ddd9d9",
  },
  button2: {
    width: wp(20),
    height: hp(3.5),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button2plus: {
    borderRadius: 5,
    borderColor: "#ddd9d9",
    borderWidth: 2,
    width: wp(6.5),
    justifyContent: "center",
    alignItems: "center",
  },
  button2minus: {
    borderRadius: 5,
    borderColor: "#ddd9d9",
    borderWidth: 2,
    width: wp(6.5),
    justifyContent: "center",
    alignItems: "center",
  },
  buttondisable: {
    borderWidth: 2,
    width: wp(20),
    height: hp(3.5),
    borderRadius: 5,
    borderColor: "#ddd9d9",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    marginHorizontal: wp(3),
    marginTop: hp(2),
    marginBottom: hp(1),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuimage: {
    width: wp(20),
    justifyContent: "flex-start",
  },
  menuname: {
    marginLeft: wp(2),
    width: wp(48),
    flexDirection: "row",
  },
});

export default FoodMenuComponent;
