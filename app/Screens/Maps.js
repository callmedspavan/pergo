import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import MapView, { Marker, Callout } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Location from "expo-location";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
import getGeoCodeAddress from "../Api/GeoCodeAddressApi";
import SaveAddress from "../Api/SaveAddressApi";
import Backgroundmodal from "react-native-modal";
import AuthContext from "../Auth/Context";
import Colors from "../Config/Colors";
import { color } from "react-native-reanimated";

var mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ececec",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ffcc00",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#fafafa",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#93e393",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#6ccbf3",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

const validationSchema = Yup.object().shape({
  FullAddress: Yup.string().required().label("Full Address"),
});

function Maps({ navigation }) {
  const authContext = useContext(AuthContext);
  const key = authContext.user.accesskey;
  const jwttoken = authContext.user.jwttoken;

  let mapRef = React.useRef(null);
  const [drag, setdrag] = React.useState({
    latitude: 17.001364076277174,
    longitude: 81.80399855598807,
    longitudeDelta: 0.0035,
    latitudeDelta: 0.0035,
  });
  const [getAddress, setGetAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisable, setModalVisable] = useState(false);
  const [addressLable, setAddressLable] = useState("Home");
  const [saveAddressLoad, setSaveAddressLoad] = useState(false)

  React.useEffect(() => {
    gotoMyLocation();
  }, []);
  const gotoMyLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      navigation.navigate("Addresses");
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      enableHighAccuracy: true
    });

    let tempCoords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      longitudeDelta: 0.0035,
      latitudeDelta: 0.0035,
    };
    //setdrag(tempCoords);

    mapRef.current.animateToRegion(tempCoords);
  };

  const onRegionChange = (region) => {
    setdrag(region);
  };

  useEffect(() => {
    loadGeoCodeAddress();
  }, [drag]);

  const loadGeoCodeAddress = async () => {
    setLoading(true);
    const lat = drag.latitude;
    const long = drag.longitude;
    const geocodeaddressresponse = await getGeoCodeAddress.getGeoCodeAddress({
      lat,
      long,
      jwttoken,
    });

    setGetAddress(geocodeaddressresponse.data[0]);
    setLoading(false);
  };

  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  const saveAddress = async ({FullAddress}) => {
    setSaveAddressLoad(true)
    const city = getAddress.city;
    const state = getAddress.state;
    const zipcode = getAddress.zipcode;
    const lat = drag.latitude;
    const long = drag.longitude;
    const addresslable = addressLable;
    const finaladdress = FullAddress + ", " + getAddress.locality; 
    const saveaddressresponse = await SaveAddress.saveAddress({
      key,
      jwttoken,
      finaladdress,
      city,
      state,
      zipcode,
      addresslable,
      lat,long
    });
    if(!saveaddressresponse.ok) alert("Something Went Wrong Please Try Again")
    
    setModalVisable(false)
    setSaveAddressLoad(false)
    navigation.navigate("Addresses")
    
  };

  return (
    <>
    {saveAddressLoad == true ? null : <ScrollView>
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            showsUserLocation={true}
            style={styles.mapStyle}
            onRegionChangeComplete={onRegionChange}
            region={drag}
            customMapStyle={mapStyle}
          >
            <Marker opacity={0} coordinate={drag} />
            {/* <View style={styles.markerStyle}>
                  <MaterialCommunityIcons name="map-marker" color="red" size={40} />
                </View> */}
            <View
              style={{
                justifyContent: "center",
                alignSelf: "center",
                flex: 1,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/pin.gif")}
                style={{ width: wp(100), height: hp(90) }}
                resizeMode="center"
              />
            </View>
          </MapView>
          <View
            style={{
              alignSelf: "flex-end",
              marginTop: hp(-6),
              marginRight: wp(3),
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={() => gotoMyLocation()}>
              <Image
                source={require("../assets/mapcenter.png")}
                style={{ width: wp(9), height: hp(5) }}
                resizeMode="center"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignSelf: "flex-start",
              marginTop: hp(2),
              marginLeft: wp(3),
            }}
          >
            <Text
              style={{
                fontSize: wp(4.5),
                fontWeight: "500",
                color: "grey",
                fontFamily: "Alata_400Regular",
              }}
            >
              Your Location
            </Text>
          </View>
          <View
            style={{
              height: hp(0.15),
              backgroundColor: Colors.light,
              width: "100%",
              marginHorizontal: wp(3),
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignSelf: "flex-start",
              marginTop: hp(1.5),
            }}
          ></View>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "flex-start",
              alignSelf: "flex-start",
              marginTop: hp(1),
              marginLeft: wp(3),
              flexDirection: "row",
            }}
          >
            <MaterialCommunityIcons
              name="check-decagram"
              size={wp(4.5)}
              color="#2fbb2f"
              style={{ alignSelf: "center" }}
            />
            {loading == true ? (
              <Text
                style={{
                  fontSize: wp(4),
                  fontWeight: "bold",
                  marginLeft: wp(2),
                  paddingRight: wp(5),
                }}
                numberOfLines={1}
              >
                Loading...
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: wp(3.5),
                  fontWeight: "bold",
                  marginLeft: wp(2),
                  paddingRight: wp(5),
                  fontFamily:"Alata_400Regular",
                  color:"black"
                }}
                numberOfLines={1}
              >
                {getAddress.fulladdress}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setModalVisable(true)}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                marginTop: hp(1.8),
                marginLeft: wp(5),
                marginRight: wp(5),
                flexDirection: "row",
                backgroundColor: "#f07028",
                width: wp(90),
                paddingVertical: wp(2),
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: wp(4), fontFamily:"Alata_400Regular" }}
              >
                Confirm & Add Location
              </Text>
            </View>
          </TouchableOpacity>
          <Backgroundmodal
            isVisible={modalVisable}
            useNativeDriver={true}
            style={{ justifyContent: "flex-end", margin: 0 }}
            onBackdropPress={() => setModalVisable(false)}
          >
            <View
              style={{
                backgroundColor: "white",
              }}
            >
              <View style={{ marginBottom: wp(10), marginHorizontal: wp(2.5) }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: hp(1.5),
                    borderColor: Colors.light,
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Alata_400Regular",
                      fontSize: wp(4.5),
                      alignSelf: "center",
                      color:"black"
                    }}
                  >
                    Complete Details
                  </Text>
                  <TouchableOpacity onPress={() => setModalVisable(false)}>
                    <MaterialCommunityIcons
                      name="close-circle-outline"
                      size={wp(8)}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    paddingVertical: hp(1.2),
                    borderColor: Colors.light,
                    borderBottomWidth: 1,
                  }}
                >
                  <Text
                    style={{ fontFamily: "Alata_400Regular", color: "grey" }}
                  >
                    Your Location
                  </Text>
                  <View style={{ flexDirection: "row", paddingTop: hp(0.7) }}>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={wp(4.5)}
                      color="#2fbb2f"
                      style={{ alignSelf: "center" }}
                    />
                    <View style={{ width: wp(70), marginLeft: wp(3) }}>
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4),
                          color:"black"
                        }}
                        numberOfLines={1}
                      >
                       {getAddress.locality}, {getAddress.city}, {getAddress.state}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setModalVisable(false)}>
                      <Text
                        style={{
                          color: "tomato",
                          fontFamily: "Alata_400Regular",
                          alignSelf: "center",
                          marginLeft: wp(3),
                        }}
                      >
                        Change
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Formik
                  initialValues={{
                    FullAddress: "",
                  }}
                  onSubmit={saveAddress}
                  validationSchema={validationSchema}
                >
                  {({ handleChange, handleSubmit, errors }) => (
                    <>
                      <View style={{ marginTop: hp(1.2) }}>
                        <Text style={{ color: "grey", fontSize: wp(2.5) }}>
                          Full Address *
                        </Text>
                        <View
                          style={{
                            paddingVertical: hp(1),
                            borderBottomWidth: 1,
                            borderColor: Colors.light,
                          }}
                        >
                          <TextInput
                            placeholder="House No / Flat No/ Apartment Name, Street Address"
                            keyboardType="name-phone-pad"
                            onChangeText={handleChange("FullAddress")}
                          />
                        </View>
                      </View>

                      {errors.FullAddress ? (
                        <Text style={{ color: "tomato" }}>
                          {errors.FullAddress}
                        </Text>
                      ) : null}
                      <Text
                  style={{
                    color: "grey",
                    fontSize: wp(2.5),
                    marginVertical: hp(1),
                    
                  }}
                >
                  Address Lable *
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  {addressLable == "Home" ? (
                    <View
                      style={{
                        borderColor: "#f07028",
                        borderWidth: 1,
                        paddingHorizontal: 14,
                        paddingVertical: 4,
                        borderRadius: 15,
                        backgroundColor: "#f07028",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        Home
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setAddressLable("Home")}>
                      <View
                        style={{
                          borderColor: "#f07028",
                          borderWidth: 1,
                          paddingHorizontal: 14,
                          paddingVertical: 4,
                          borderRadius: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: "#f07028",
                            fontFamily: "Alata_400Regular",
                          }}
                        >
                          Home
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {addressLable == "Work" ? (
                    <View
                      style={{
                        borderColor: "#f07028",
                        borderWidth: 1,
                        paddingHorizontal: 14,
                        paddingVertical: 4,
                        borderRadius: 15,
                        backgroundColor: "#f07028",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        Work
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setAddressLable("Work")}>
                      <View
                        style={{
                          borderColor: "#f07028",
                          borderWidth: 1,
                          paddingHorizontal: 14,
                          paddingVertical: 4,
                          borderRadius: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: "#f07028",
                            fontFamily: "Alata_400Regular",
                          }}
                        >
                          Work
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {addressLable == "Other" ? (
                    <View
                      style={{
                        borderColor: "#f07028",
                        borderWidth: 1,
                        paddingHorizontal: 14,
                        paddingVertical: 4,
                        borderRadius: 15,
                        backgroundColor: "#f07028",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        Other
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setAddressLable("Other")}>
                      <View
                        style={{
                          borderColor: "#f07028",
                          borderWidth: 1,
                          paddingHorizontal: 14,
                          paddingVertical: 4,
                          borderRadius: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: "#f07028",
                            fontFamily: "Alata_400Regular",
                          }}
                        >
                          Other
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity onPress={handleSubmit} >
                <View
                  style={{
                    marginTop: hp(2.3),
                    backgroundColor: "#f07028",
                    paddingVertical: hp(0.8),
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      alignSelf: "center",
                      fontFamily: "Alata_400Regular",
                      fontSize: wp(4),
                    }}
                  >
                    Save Address
                  </Text>
                </View>
                </TouchableOpacity>
                    </>
                  )}
                </Formik>
                
              </View>
            </View>
          </Backgroundmodal>
        </View>
      </ScrollView> }
      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mapStyle: {
    width: wp(100),
    height: hp(77),
    position: "relative",
  },
  // map: {
  //   ...StyleSheet.absoluteFillObject,
  // },
  markerStyle: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default Maps;
