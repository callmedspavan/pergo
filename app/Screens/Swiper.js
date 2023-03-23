import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
  StatusBar
} from "react-native";
import Swiper from "react-native-swiper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function SwiperComponent({ navigation }) {
  return (
    <>
    <Swiper
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activedot} />}
    >
      <View style={styles.slide}>
        <View style={styles.header}>
          <Text
            style={{
              fontSize: wp(4),
              alignSelf: "flex-end",
              marginRight: wp(4),
            }}
            onPress={() => navigation.navigate("Login")}
          >
            Skip
          </Text>
          <Image
            source={require("../assets/1.png")}
            style={styles.image}
            resizeMode={"contain"}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.title}> One Single Platform </Text>
          <Text style={styles.text}>
            Are you struggling to get your essentials, Order all your Essentials
            in one place, Groceries, Food, Fish & Meat, Fruits & Vegetables,
            Medicines, Sweets & bakery...{" "}
          </Text>
        </View>
      </View>
      <View style={styles.slide}>
        <View style={styles.header}>
        <Text
            style={{
              fontSize: wp(4),
              alignSelf: "flex-end",
              marginRight: wp(4),
            }}
            onPress={() => navigation.navigate("Login")}
          >
            Skip
          </Text>
          <Image
            source={require("../assets/2.png")}
            style={styles.image}
            resizeMode={"contain"}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.title}> Call or Whatsapp </Text>
          <Text style={styles.text}>
            {" "}
            No need to juggle with your long groceries list, Just call or
            Whatsapp us then sit back and relax we will take care rest of the
            things{" "}
          </Text>
        </View>
      </View>
      <View style={styles.slide}>
        <View style={styles.header}>
          <Image
            source={require("../assets/3.png")}
            style={styles.image}
            resizeMode={"contain"}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.title}> Lightning Fast Delivery </Text>
          <Text style={styles.text}>
            We bring the store to your door , Lightning fast delivery of all
            your orders within no time
          </Text>
          <View style={{ marginTop: hp(3) }}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: "#ffcc00",
                  //borderWidth: 1,
                  borderRadius: 50,
                  marginTop: 15,
                  flexDirection: "row",
                },
              ]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{ color: "black", fontWeight: "bold" }}>Login</Text>
              <MaterialCommunityIcons
                name="arrow-right-bold-circle"
                size={17}
                color={"black"}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Swiper>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
    </>
  );
}

const styles = StyleSheet.create({
  activedot: {
    backgroundColor: "#ffcc00",
    width: 20,
    height: 8,
    borderRadius: 4,
    marginVertical: 3,
    marginHorizontal: 5,
  },
  button: {
    width: wp(28),
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "#ffcc00",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  logo: {
    width: 400,
    height: 500,
    alignSelf: "center",
  },
  modalhide: {
    padding: 20,
    alignSelf: "flex-end",
  },
  numberinput: {
    margin: 10,
  },

  slide: {
    flex: 1,
    backgroundColor: "white",
    height: hp(100),
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    height: hp(50),
  },
  footer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: wp(3),
    height: wp(50),
  },
  image: {
    height: hp(50),
    width: wp(70),
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "tomato",
    textAlign: "center",
  },
  text: {
    color: "black",
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1.5,
  },
});

export default SwiperComponent;
