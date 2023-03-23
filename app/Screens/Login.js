import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  useCode,
  cond,
  eq,
  set,
  interpolate,
  SpringUtils,
  call,
} from "react-native-reanimated";
import {
  withTimingTransition,
  onGestureEvent,
  withSpring,
  withSpringTransition,
  opacity,
  delay,
} from "react-native-redash";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import OverlayBg from "../Components/Overlaybg";
import HeaderBackArrow from "../Components/HeaderBackArrow";
import ForwardArrow from "../Components/ForwardArrow";
import SendOtp from "../Api/SendOtp";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Colors from "../Config/Colors";
import { TouchableOpacity } from "react-native";

function LoginComponent({ navigation }) {
  const scale = useRef(new Animated.Value(0));
  const scaleAnimation = withTimingTransition(scale.current);

  const [mobileNumber, setMobileNumber] = useState("");
  const [load, setLoad] = useState(false);

  const sendOtp = async () => {
    setLoad(true);
    if (mobileNumber.length < 10) {
      alert("Please Enter Valid Number");
      setLoad(false);
      return;
    }
    const result = await SendOtp.sendOtp(mobileNumber);
    const name = result.data.userdetails[0].name;
    const email = result.data.userdetails[0].emailid;
    const firstlogin = result.data.userdetails[0].firstlogin;
    if (!result.ok) {
      alert("Please Enter Valid Number");
      setLoad(false);
      return;
    }
    navigation.navigate("Otp", {
      Name: name,
      Mobilenumber: mobileNumber,
      Email: email,
      Firstlogin: firstlogin,
    });
    setLoad(false);
    console.log(result.data);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
            <Image
              source={require("../assets/logo.png")}
              style={{ width: wp(60), height: hp(40) }}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
        <View style={styles.input}>
          <Text
            style={{
              marginTop: hp(3),
              marginLeft: wp(5),
              fontSize: wp(5),
              fontWeight: "bold",
              color: "black",
            }}
          >
            Lets get Started
          </Text>
          <View style={styles.inputcontainer}>
            <Text style={{ alignSelf: "center", color: "black" }}>+91</Text>
            <TextInput
              placeholder="Phone Number                                                               "
              keyboardType="number-pad"
              onChangeText={(value) => setMobileNumber(value)}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              load
                ? alert("Please Wait we are processing your request")
                : sendOtp();
            }}
          >
            <View
              style={{
                backgroundColor: "#ffcc00",
                width: wp(25),
                alignSelf: "flex-end",
                marginTop: hp(2),
                marginRight: wp(5),
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 8,
                borderRadius: 5,
              }}
            >
              {load ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text style={{ color: "black", fontWeight: "bold" }}>
                  Send Otp
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: hp(100),
    backgroundColor: "#ffcc00",
  },
  input: {
    height: hp(30),
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
  },
  inputcontainer: {
    flexDirection: "row",
    borderWidth: 1,
    marginHorizontal: wp(5),
    paddingHorizontal: wp(5),
    marginTop: hp(3),
    borderColor: Colors.light,
    overflow:"hidden"
  },
  logo: {
    height: hp(70),
    backgroundColor: "#ffcc00",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginComponent;
