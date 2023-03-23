import React, { useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Formik } from "formik";
import * as Yup from "yup";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
// import { AppLoading } from "expo";
import Screen from "../Components/Screen";
import { Value } from "react-native-reanimated";
import ConfirmOtp from "../Api/ConfirmOtp";
import AuthContext from "../Auth/Context";
import authStorage from "../Auth/Storage";

const validationSchema = Yup.object().shape({
  otp: Yup.string().required().label("otp"),
  name: Yup.string().min(3).label("name"),
  email: Yup.string().email().label("email"),
  referralCode: Yup.string().label("referralCode"),
});

function Otp({ route, navigation }) {
  const { Mobilenumber } = route.params;
  const { Email } = route.params;
  const { Name } = route.params;
  const { Firstlogin } = route.params;

  const authContext = useContext(AuthContext);
  const mobilenumber = Mobilenumber;
  const verifyOtp = async ({ otp, name, email, referralCode }) => {
    const result = await ConfirmOtp.confirmOtp(
      mobilenumber,
      otp,
      name,
      email,
      referralCode
    );
    if (!result.ok) return alert("Something Went Wrong Please try agian later");
    console.log(result.data);
    authContext.setUser(result.data);
    const storedata = JSON.stringify(result.data); 
    const userkey = "USER"
    authStorage.storeToken(userkey,storedata);
  }; 

  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  }); 

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons name="alpha-o-circle" size={50} color={"black"} />
          <MaterialCommunityIcons name="alpha-t-circle" size={50}  color={"black"}  />
          <MaterialCommunityIcons name="alpha-p-circle" size={50}  color={"black"} />
        </View>
        <View style={styles.headertext}>
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: 17,
              marginBottom: 5,
              fontFamily: "Alata_400Regular",
              color:"black"
            }}
          >
            Verification
          </Text>
          <Text style={{ fontFamily: "Alata_400Regular",color:"black" }}>
            Enter OTP code sent to this Mobile Number
          </Text>
          <Text style={{ textAlign: "center", fontFamily: "Alata_400Regular", color:"black" }}>
            {" "}
            +91 {Mobilenumber}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <Formik
          initialValues={{ otp: "", name: Name, email: Email, referralCode: "" }}
          onSubmit={verifyOtp}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, errors }) => (
            <>
              <View style={styles.input}>
                <TextInput
                  placeholder="Enter Otp"
                  keyboardType="number-pad"
                  style={styles.textinput}
                  maxLength={10}
                  onChangeText={handleChange("otp")}
                />
              </View>
              <Text style={{ color: "tomato" }}>{errors.otp}</Text>
              {Name ? null : (
                <View style={styles.input}>
                  <TextInput
                    placeholder="Name"
                    keyboardType="default"
                    style={styles.textinput}
                    onChangeText={handleChange("name")}
                  />
                </View>
              )}

              {Email ? null : (
                <View style={styles.input}>
                  <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    style={styles.textinput}
                    onChangeText={handleChange("email")}
                  />
                </View>
              )}

              {Firstlogin == 1 ? (
                <View style={styles.input}>
                  <TextInput
                    placeholder="Referral code (Optional)"
                    keyboardType="default"
                    style={styles.textinput}
                    onChangeText={handleChange("referralCode")}
                  />
                </View>
              ) : null}

              <TouchableOpacity onPress={handleSubmit}>
                <View style={styles.button}>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "Alata_400Regular",
                    }}
                  >
                    Validate
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 2,
    marginLeft: wp(10),
    paddingTop: hp(5),
    marginRight: wp(10),
  },
  button: {
    backgroundColor: "black",
    // marginTop: hp(1.5),
    width: wp(40),
    padding: hp(1),
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#ffcc00",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headertext: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    width: wp(80),
    paddingHorizontal: hp(1),
    borderRadius: 10,
    borderColor: "#cdcdcd",
    marginBottom: hp(1.5),
  },
});

export default Otp;
