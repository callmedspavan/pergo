import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

// import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";

function Partner({
  name,
  image,
  discription,
  avgorder,
  offer,
  status,
  statusreason,
  rating, 
  onpress,
  address,
  city
}) {
  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <TouchableOpacity onPress={onpress}>
      <View style={styles.verticalrestaurants}>
        <View style={styles.verticalrestaurants1}>
          <Image
            source={{ uri: image }}
            style={{ height: hp(11), width: wp(20), borderRadius: 5 }}
          />
          {offer == null ? null : <View
            style={{
              width: wp(17),
              backgroundColor: "#2fbb2f",
              alignSelf: "center",
              marginTop: hp(-1),
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                alignSelf: "center",
                fontFamily: "Alata_400Regular",
                fontSize:wp(3)
              }}
            >
              {offer}
            </Text>
          </View>}
        </View>
        <View style={styles.verticalrestaurants2}>
          <View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "Alata_400Regular",
                fontSize: wp(4.5),
                color:"black"
              }}
            >
              {name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: wp(3),
                color: "grey",

                fontFamily: "Alata_400Regular",
              }}
            >
              {discription}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: wp(3),
                color: "grey",

                fontFamily: "Alata_400Regular",
              }}
            >
              {avgorder}/- Per Person
            </Text>
            
              <Text
                numberOfLines={1}
                style={{
                  fontSize: wp(3),
                  color: "green",

                  fontFamily: "Alata_400Regular",
                }}
              >
                {address}, {city}
              </Text>
            

            {status == "False"  ? <Text
              numberOfLines={1}
              style={{
                fontSize: wp(3),
                color: "tomato",

                fontFamily: "Alata_400Regular",
              }}
            >
              {statusreason}
            </Text> : null } 

            
          </View>
        </View>
        <View style={styles.verticalrestaurants3}>
          <View
            style={{
              backgroundColor: "#ffa800",
              paddingVertical: hp(0.1),
              paddingHorizontal: wp(1.7),
              borderRadius: 5,
            }}
          >
            <Text style={{ fontFamily: "Alata_400Regular", color: "white" }}>
              {rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  verticalrestaurants: {
    marginTop: hp(3),
    marginHorizontal: wp(3),
    flexDirection: "row",
  },
  verticalrestaurants1: {
    width: wp(20),
    justifyContent: "center",
  },
  verticalrestaurants2: {
    paddingLeft: wp(2.5),
    paddingRight: wp(2.5),
    width: wp(65),
  },
  verticalrestaurants3: {
    justifyContent: "space-between",
    position: "relative",
    right: 1,
  },
});

export default Partner;
