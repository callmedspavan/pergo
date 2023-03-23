import React from "react";
import { View, Text, Image, StatusBar, ImageBackground } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../Config/Colors";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";

function Refer() {
  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        style={{ width: wp(100), height: hp(100) }}
        source={require("../assets/referbanner.png")}
      >
        <View style={{ marginTop: hp(35) }}>
          <View style={{ alignSelf: "center", height: hp(4) }}>
            <Text
              style={{ color: "white", fontWeight: "bold", fontSize: wp(4.3) }}
            >
              Refer Your Friends, Earn Unlimited Benifits
            </Text>
          </View>
          <View
            style={{
              width: wp(72),
              borderWidth: 1,
              height: hp(5.5),
              borderColor: "white",
              alignSelf: "center",
              marginTop: hp(5),
              borderRadius: 30,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: wp(40),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: wp(4.5),
                  color: "white",
                }}
              >
                PERGO492020
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.5}>
              <View
                style={{
                  width: wp(32),
                  backgroundColor: "white",
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: wp(4),
                    color: "#13a4e5",
                  }}
                >
                  COPY
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                height: hp(22),
                width: wp(50),
                backgroundColor: "white",
                marginTop: hp(6),
                marginLeft: wp(3),
                borderRadius: 6,
              }}
            >
              <View>
                <Image
                  source={require("../assets/earntogether.jpg")}
                  style={{ height: hp(11), width: wp(50) }}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  paddingHorizontal: wp(3),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#13a4e5",
                    marginTop: hp(1.5),
                  }}
                >
                  Invite & Earn
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#064898",
                    fontSize: wp(3),
                    marginTop: hp(1),
                    fontStyle: "italic",
                  }}
                >
                  Refer your friend and get 50Rs wallet amount in both of your
                  wallets
                </Text>
              </View>
            </View>
            <View
              style={{
                height: hp(22),
                width: wp(50),
                backgroundColor: "white",
                marginTop: hp(6),
                marginLeft: wp(3),
                borderRadius: 6,
              }}
            >
              <View>
                <Image
                  source={require("../assets/unlimitedbenefits.jpg")}
                  style={{ height: hp(11), width: wp(50) }}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  paddingHorizontal: wp(3),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#13a4e5",
                    marginTop: hp(1.5),
                  }}
                >
                  Lifelong Earnings
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#064898",
                    fontSize: wp(3),
                    marginTop: hp(1),
                    fontStyle: "italic",
                  }}
                >
                  Earn on Every purchase of your referred friend through
                  lifelong
                </Text>
              </View>
            </View>
            <View
              style={{
                height: hp(22),
                width: wp(50),
                backgroundColor: "white",
                marginTop: hp(6),
                marginLeft: wp(3),
                borderRadius: 6,
                marginRight: wp(3),
              }}
            >
              <View>
                <Image
                  source={require("../assets/freedelivery.jpg")}
                  style={{ height: hp(11), width: wp(50) }}
                  resizeMode="contain"
                />
              </View>
              <View
                style={{
                  paddingHorizontal: wp(3),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#13a4e5",
                    marginTop: hp(1),
                  }}
                >
                  Free Delivery
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "#064898",
                    fontSize: wp(3),
                    marginTop: hp(1),
                    fontStyle: "italic",
                  }}
                >
                  Get free delivery on your first order
                </Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity activeOpacity={0.9}>
          <View
            style={{
              marginVertical: hp(3),
              backgroundColor: "#fbc401",
              marginHorizontal: wp(4),
              width: wp(92),
              height: hp(8),
              borderRadius: 10,
              alignItems:"center",
              justifyContent:"center",
              elevation:5
            }}
          >
            <Text style={{ color: "white",fontSize:wp(5), fontWeight:"bold" }}>Refer & Earn</Text>
          </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <StatusBar barStyle="light-content" backgroundColor="#064898" />
    </View>
  );
}

export default Refer;
