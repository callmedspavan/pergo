import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ConfirmModal from "react-native-modal";

import Colors from "../Config/Colors";
import AuthContext from "../Auth/Context";
import authStorage from "../Auth/Storage";
import { color } from "react-native-reanimated";

function Profile({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const { location, setLocation } = useContext(AuthContext);

  const [viewModal, setViewModal] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setLocation([]);
    const userkey = "USER"
    authStorage.removeToken(userkey);
    const locationkey = "LOCATION"
    authStorage.removeToken(locationkey)
  };

  const authContext = useContext(AuthContext);
  const token = authContext.user.jwttoken;
  const accesskey = authContext.user.accesskey;
  const name = authContext.user.userdetails[0].name;
  const email = authContext.user.userdetails[0].emailid;
  const phonenumber = authContext.user.userdetails[0].phonenumber;

  const Rateus = () => {
    let url = "https://play.google.com/store/apps/details?id=com.pergo.app";

    Linking.openURL(url);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerleft}>
            <Text style={{ fontWeight: "bold", fontSize: wp(6), color:"black" }}>{name}</Text>
            <Text
              style={{ fontSize: wp(3), color: "grey", marginTop: hp(0.8) }}
            >
              {phonenumber}
            </Text>
            <Text
              style={{ fontSize: wp(3), color: "grey", marginTop: hp(0.8) }}
            >
              {email}
            </Text>
          </View>
          <View style={styles.headerright}>
            <Image
              source={require("../assets/edit.png")}
              style={styles.headerrightimage}
              resizeMode="stretch"
            />
          </View>
        </View>
        <View
          style={{
            height: hp(0.15),
            width: "100%",
            backgroundColor: Colors.light,
          }}
        ></View>
        <View style={styles.headerdown}>
          <TouchableOpacity onPress={() => navigation.navigate("Wallet")}>
            <View style={styles.headerdownright}>
              <MaterialCommunityIcons name="wallet-outline" color={"black"} size={hp(4)} />
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: hp(0.8),
                  fontSize: wp(3),
                  color: "grey",
                }}
              >
                Wallet Amount
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.headerdownleft}>
              <MaterialCommunityIcons name="gift-outline" color={"black"} size={hp(4)} />
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: hp(0.8),
                  fontSize: wp(3),
                  color: "grey",
                }}
              >
                Win Points
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <TouchableOpacity>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/savedaddress.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600", color:"black" }}>
                  Saved Address
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate("Refer & Earn")}>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/refer.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600",color:"black" }}>
                  Refer to a friend
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/support.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600", color:"black" }}>
                  Support
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/aboutus.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600", color:"black" }}>
                  About Us
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/tc.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600", color:"black" }}>
                  Terms And Conditions
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/pp.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600", color:"black" }}>
                  Privacy Policy
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Rateus()}>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/rateus.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600", color:"black" }}>
                  Rate Us
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setViewModal(true)}>
            <View style={[styles.entities]}>
              <View style={styles.icon}>
                <Image
                  source={require("../assets/logout.png")}
                  style={styles.iconimage}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.name}>
                <Text style={{ fontSize: wp(3.3), fontWeight: "600", color:"black", }}>
                  Logout...!
                </Text>
              </View>
              <View style={styles.arrow}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={hp(3)}
                  color="grey"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <ConfirmModal
          isVisible={viewModal}
          deviceHeight={hp(100)}
          deviceWidth={wp(100)}
          animationIn="zoomIn"
          animationOut="zoomOut"
          animationInTiming={300}
          animationOutTiming={300}
          useNativeDriver={true}
        >
          <View
            style={{
              justifyContent: "center",
              alignSelf: "center",
              backgroundColor: "white",
              width: wp(75),
              paddingVertical: hp(3),
              paddingHorizontal: wp(3),
            }}
          >
            <Text style={{ alignSelf: "center",fontWeight:"bold",color:"grey" }}>
              Logout is the hardest button to Click...
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: hp(4),
              }}
            >
              <TouchableOpacity onPress={handleLogout} >
              <View
                style={{
                  backgroundColor: "#2fbb2f",
                  paddingHorizontal: wp(2.5),
                  paddingVertical: wp(1.5),
                  borderRadius:5
                }}
              >
                <Text style={{color:"white",fontWeight:"bold"}} >yes,Logout</Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> setViewModal(false)} >
              <View
                style={{
                  backgroundColor: "tomato",
                  paddingHorizontal: wp(2.5),
                  paddingVertical: wp(1.5),
                  borderRadius:5
                }}
              >
                <Text style={{color:"white",fontWeight:"bold"}} >Cancel</Text>
              </View>
              </TouchableOpacity>
            </View>
          </View>
        </ConfirmModal>
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#ffff" />
    </>
  );
}

const styles = StyleSheet.create({
  arrow: {
    right: 1,
    position: "absolute",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#ffff",
    flex: 1,
    padding: wp(3),
  },
  entities: {
    flexDirection: "row",
    marginTop: hp(3.5),
    // backgroundColor: "yellow",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: hp(1),
    marginHorizontal: wp(2),
  },
  headerdown: {
    paddingVertical: hp(3.5),
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "space-around",
    marginVertical: hp(2),
    elevation: 3,
    borderRadius: 5,
    borderWidth: wp(0.2),
    borderColor: "#dddddd",
    marginHorizontal: wp(8),
  },
  headerdownright: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerdownleft: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerleft: {
    justifyContent: "center",
  },
  headerrightimage: {
    width: wp(13),
    height: hp(6.5),
  },
  iconimage: {
    height: hp(3),
    width: wp(6),
  },
  name: {
    marginLeft: wp(3.5),
  },
});

export default Profile;
