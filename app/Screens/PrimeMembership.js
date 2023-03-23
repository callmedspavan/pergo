import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function PrimeMembership() {
  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });
  return (
    <ScrollView>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Image
          source={require("../assets/membershipbanner.jpg")}
          style={{ width: wp(100), height: hp(30) }}
          resizeMode="cover"
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: hp(3),
          }}
        >
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              color: "#989898",
              fontSize: wp(5),
            }}
          >
            Save More With
          </Text>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              color: "#989898",
              fontSize: wp(6),
            }}
          >
            Pergo Prime Membership
          </Text>
        </View>
        <Image
          source={require("../assets/primeprice.jpg")}
          style={{ marginTop: hp(3), width: wp(100), height: hp(42) }}
          resizeMode="contain"
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: hp(2.5),
          }}
        >
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              color: "#989898",
              fontSize: wp(5),
            }}
          >
            Identify us
          </Text>
        </View>
        <Image
          source={require("../assets/comparion.jpg")}
          style={{ marginTop: hp(3), width: wp(100), height: hp(20) }}
          resizeMode="contain"
        />
        <TouchableOpacity activeOpacity={0.9}>
        <View
          style={{
            backgroundColor: "#ffaa01",
            width: wp(94),
            marginHorizontal: wp(3),
            alignItems: "center",
            justifyContent: "center",
            marginVertical: hp(3),
            borderRadius:10,
            paddingBottom:hp(0.8),
            elevation:5
          }}
        >
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              color: "white",
              fontSize: wp(5),
            }}
          >
            Become a Member
          </Text>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              color: "white",
              fontSize: wp(3),
            }}
          >
            ₹299 / 3 Months
          </Text>
        </View>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#ffaa01" />
    </ScrollView>
  );
}

export default PrimeMembership;
