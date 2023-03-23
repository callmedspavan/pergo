import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
// import { AppLoading } from "expo";
import Colors from "../Config/Colors";
import getSavedAddress from "../Api/SavedAddressApi";
import AuthContext from "../Auth/Context";
import authStorage from "../Auth/Storage";
import { useIsFocused } from "@react-navigation/native";

function SavedAddress({ navigation }) {
  const isFocused = useIsFocused()

  const authContext = useContext(AuthContext);
  const key = authContext.user.accesskey;
  const jwttoken = authContext.user.jwttoken;

  const [savedAddress, setSavedAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedAddress();
  }, [isFocused]);

  const loadSavedAddress = async () => {
    setLoading(true);
    const savedaddressresponse = await getSavedAddress.getSavedAddress({
      key,
      jwttoken,
    });
    setLoading(false);
    setSavedAddress(savedaddressresponse.data);
  };

  const setAddress = (addid) => {
    const temp = savedAddress.filter((item)=>{
      return item.addid == addid
    })
    authContext.setLocation(temp)
    
    const storelocation = JSON.stringify(temp); 
    const locationkey = "LOCATION"
    authStorage.storeToken(locationkey,storelocation);
    navigation.navigate("Landing",{from:'savedAddress'});
  }

  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <>
      <TouchableOpacity onPress={() => navigation.navigate("Maps")}>
        <View
          style={{
            flexDirection: "row",
            marginVertical: hp(2),
            marginRight: wp(3),
          }}
        >
          <View
            style={{
              width: wp(11),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={wp(5)}
              color="#ffaa01"
            />
          </View>
          <View>
            <Text
              style={{
                color: "#ffaa01",
                fontWeight: "bold",
                fontSize: wp(4.2),
                letterSpacing: 1,
              }}
            >
              Current Location
            </Text>
            <Text style={{ color: "#ffaa01" }}>Using Gps</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.diffrentiator1}></View>
      <View
        style={{
          flexDirection: "row",
          marginTop: hp(2),
          marginRight: wp(3),
        }}
      >
        <View
          style={{
            width: wp(11),
            alignItems: "center",
            justifyContent: "center",
          }}
        ></View>
        <View>
          <Text
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: wp(4),
              letterSpacing: 1,
              
            }}
          >
            Please Select or Add Address...
          </Text>
        </View>
      </View>

      {loading == true ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator animating={loading} size={35} color="#ffaa01" />
          <Text style={{ color: "grey" }}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={savedAddress}
          keyExtractor={(savedAddress) => savedAddress.addid.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>setAddress(item.addid)} >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: hp(2),
                  marginRight: wp(3),
                }}
              >
                <View
                  style={{
                    width: wp(11),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={wp(5)}
                    color="black"
                  />
                </View>
                <View style={{ width: wp(86) }}>
                  <Text
                    style={{
                       color: "black",
                      fontWeight: "bold",
                      fontSize: wp(4),
                      letterSpacing: 1,
                    }}
                  >
                    {item.addressname}
                  </Text>
                  <Text style={{ color: "grey" }} numberOfLines={2}>
                    {item.address}, {item.city}, {item.state}
                  </Text>
                  <View style={styles.diffrentiator2}></View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={() => (
            <TouchableOpacity onPress={() => navigation.navigate("Maps")}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  backgroundColor: "#ffaa01",
                  width: wp(60),
                  marginTop: hp(3),
                  paddingVertical: hp(1),
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: wp(4),
                    letterSpacing: 1,
                  }}
                >
                  Add New Address
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  diffrentiator1: {
    backgroundColor: Colors.light,
    height: hp(0.8),
  },
  diffrentiator2: {
    backgroundColor: Colors.light,
    height: hp(0.1),
    marginTop: hp(2.2),
  },
});

export default SavedAddress;
