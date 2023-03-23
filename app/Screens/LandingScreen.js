import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ScrollView,
  StatusBar,
  FlatList,
  Linking,
  Platform,
} from "react-native";
import Screen from "../Components/Screen";
import Constants, { screen_width, width } from "../Config/Constants";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../Config/Colors";
import AuthContext from "../Auth/Context";
import Swiper from "react-native-swiper";
import GetBanners from "../Api/GetBannersApi";
import { call } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import LocationVerificationApi from "../Api/LocationVerificationApi";

function LandingScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState();
  const [delivering, setDelivering] = useState(false);
  const authContext = useContext(AuthContext);
  const jwttoken = authContext.user.jwttoken;
  const key = authContext.user.accesskey;
  const name = authContext.user.userdetails[0].name;

  const LocationVerification = async () => {
    setLoading(true);
    const lat = authContext.location[0].lattitude;
    const long = authContext.location[0].longittude;
    const result = await LocationVerificationApi.LocationVerification({
      lat,
      long,
      jwttoken,
    });
    if (!result.ok) {
      alert("Location Verification Failed");
    }
    setDelivering(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (authContext.location.length > 0) {
      setLocation(authContext.location[0]);
      LocationVerification();
      loadBanners(authContext.location[0].city, authContext.location[0].state);
    } else {
      navigation.navigate("Addresses");
    }
  }, [isFocused]);

  console.log(authContext);

  //calling Banners Api

  const [whatsappBanner, setWhatsappBanner] = useState([]);
  const [entitiesDown1, setEntitesDown1] = useState([]);
  const [entitiesDown2, setEntitesDown2] = useState([]);
  const [entitiesDown3, setEntitesDown3] = useState([]);

  // useEffect(() => {
  //   loadBanners();
  // }, []);

  const loadBanners = async (city, state) => {
    setLoading(true);
    const entity = "GROCERY";
    const screenname = "Landing_Screen";
    const sectionname = "";
    const bannerresponse = await GetBanners.getBanners({
      entity,
      city,
      state,
      screenname,
      sectionname,
      jwttoken,
    });
    let assignbanner = bannerresponse.data;

    for (let i = 0; i < assignbanner.length; i++) {
      if (assignbanner[i].sectionname == "whatsappbanner") {
        setWhatsappBanner(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "entitiesdown1") {
        setEntitesDown1(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "entitiesdown2") {
        setEntitesDown2(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "entitiesdown3") {
        setEntitesDown3(assignbanner[i].childbanners);
      }
    }

    setLoading(false);
  };

  const call = (number) => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = "tel:${" + number + "}";
    } else {
      phoneNumber = "telpromt:${" + number + "}";
    }

    Linking.openURL(phoneNumber);
  };

  const whatsapp = (note) => {
    let url = "whatsapp://send?text=" + note + "&phone=919145505914";

    Linking.openURL(url);
  };

  const mappedWhatsappBanners = () => {
    return whatsappBanner.map((item) => {
      return (
        <TouchableOpacity
          key={Math.random()}
          onPress={() => {
            let tempJson = JSON.parse(item.navigation);
            navigation.navigate(tempJson.screen, {
              key: key,
              ...tempJson,
            });
          }}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.assistantbanner}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };
  const mappedEntitiesDown2 = () => {
    return entitiesDown2.map((item) => {
      return (
        <TouchableOpacity
          key={Math.random()}
          onPress={() => {
            let tempJson = JSON.parse(item.navigation);
            navigation.navigate(tempJson.screen, {
              key: key,
              ...tempJson,
            });
          }}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: wp(96),
              marginTop: wp(2),
              height: hp(12),
              borderRadius:5,
              marginHorizontal: wp(2),
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };

  const mappedEntitiesDown3 = () => {
    return entitiesDown3.map((item) => {
      return (
        <TouchableOpacity
          key={Math.random()}
          onPress={() => {
            let tempJson = JSON.parse(item.navigation);
            navigation.navigate(tempJson.screen, {
              key: key,
              ...tempJson,
            });
          }}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: wp(96),
              marginVertical: wp(2),
              height: hp(21),
              borderRadius: 5,
              marginHorizontal: wp(2),
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };
  return (
    <>
      {loading == true ? (
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Text style={{color:"black"}}>Checking Delivery</Text>
        </View>
      ) : (
        <Screen style={styles.screen}>
          <View style={styles.nav}>
            <TouchableHighlight
              underlayColor={Colors.light}
              onPress={() => navigation.navigate("Addresses")}
            >
              <View style={styles.navLeft}>
                <Image
                  source={require("../assets/location.png")}
                  style={{
                    width: wp(3.8),
                    height: hp(2.5),
                    alignSelf: "center",
                  }}
                />
                <View style={styles.navLeftLocation}>
                  <View>
                    {location ? (
                      <Text style={{ fontWeight: "bold", color: "#ffaa01", fontSize:wp(3.5) }}>
                        {location.addressname}
                      </Text>
                    ) : null}

                    {location ? (
                      <Text
                        style={{ fontWeight: "bold", color: "black", fontSize:wp(3.3) }}
                        numberOfLines={1}
                      >
                        {location.address}
                      </Text>
                    ) : (
                      <Text
                        style={{ fontWeight: "bold", color: "grey" }}
                        numberOfLines={1}
                      >
                        Loding...
                      </Text>
                    )}
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={"black"}
                    style={{ alignSelf: "flex-end" }}
                  />
                </View>
              </View>
            </TouchableHighlight>

            <View style={styles.navRight}>
              <TouchableHighlight
                underlayColor={Colors.light}
                onPress={() => whatsapp("Please attach your Groceries list")}
              >
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={25}
                  color={"black"}
                  style={{ marginRight: 15 }}
                />
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor={Colors.light}
                onPress={() => call(9145505914)}
              >
                <MaterialCommunityIcons
                  name="phone"
                  color={"black"}
                  size={25}
                />
              </TouchableHighlight>
            </View>
          </View>

          {delivering == true ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.container}>
                <View style={styles.heading}>
                  <Text
                    style={{ fontSize: wp(3.6), fontWeight: "bold", color: "black" }}
                  >
                    What can we help you find, {name}?
                  </Text>
                </View>

                <View style={styles.assistant}>
                  <Swiper
                    height={hp(13)}
                    autoplay={true}
                    removeClippedSubviews={false}
                    autoplayTimeout={2}
                    showsPagination={false}
                  >
                    {mappedWhatsappBanners()}
                  </Swiper>
                </View>
                {/* <Image
                      source={require("../assets/assistant.jpg")}
                      style={styles.assistantbanner}
                      resizeMode="stretch"
                    /> */}

                <View style={styles.boximages}>
                  <View style={styles.ir1}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Grocery")}
                    >
                      <Image
                        source={require("../assets/Grocery2.jpg")}
                        style={styles.i1}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Food")}
                    >
                      <Image
                        source={require("../assets/Food2.jpg")}
                        style={styles.i2}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.ir2}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Fish & Meat")}
                    >
                      <Image
                        source={require("../assets/fishandmeat2.jpg")}
                        style={styles.i1}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Fruits & Vegitables")}
                    >
                      <Image
                        source={require("../assets/fruitsandvegetables2.jpg")}
                        style={styles.i2}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.entities}>
                  <View style={styles.row}>
                    <View style={styles.box}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Medicines")}
                      >
                        <>
                          <View style={styles.boxicon}>
                            <Image
                              source={require("../assets/medicines.png")}
                              style={{ width: wp(6), height: hp(3.5) }}
                              resizeMode="cover"
                            />
                          </View>
                          <View style={styles.boxtitle}>
                            <Text
                              style={{
                                fontSize: wp(3),
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              Medicines
                            </Text>
                          </View>
                        </>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.box}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Sweets & Bakeries")}
                      >
                        <View style={styles.boxicon}>
                          <Image
                            source={require("../assets/sweetsandbakery.png")}
                            style={{ width: wp(6), height: hp(3) }}
                            resizeMode="cover"
                          />
                        </View>
                        <View style={styles.boxtitle}>
                          <Text
                            style={{
                              fontSize: wp(3),
                              fontWeight: "bold",
                              alignSelf: "center",
                              justifyContent: "center",
                              color: "black",
                            }}
                          >
                            Sweets &
                          </Text>
                          <Text
                            style={{
                              fontSize: wp(3),
                              fontWeight: "bold",
                              alignSelf: "center",
                              justifyContent: "center",
                              color: "black",
                            }}
                          >
                            Bakery
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.box}>
                      <View style={styles.boxicon}>
                        <Image
                          source={require("../assets/trade.png")}
                          style={{ width: wp(6), height: hp(3) }}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.boxtitle}>
                        <Text
                          style={{
                            fontSize: wp(3),
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          Trade
                        </Text>
                      </View>
                    </View>
                    <View style={styles.box}>
                      <View style={styles.boxicon}>
                        <Image
                          source={require("../assets/offercheck.png")}
                          style={{ width: wp(6), height: hp(3) }}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.boxtitle}>
                        <Text
                          style={{
                            fontSize: wp(3),
                            fontWeight: "bold",
                            alignSelf: "center",
                            justifyContent: "center",
                            color: "black",
                          }}
                        >
                          Offers &
                        </Text>
                        <Text
                          style={{
                            fontSize: wp(3),
                            fontWeight: "bold",
                            alignSelf: "center",
                            justifyContent: "center",
                            color: "black",
                          }}
                        >
                          Big Deals
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {/* Diffrentiator Block */}
                <View style={styles.diffrentiator}></View>
                <View style={styles.banners}>
                  <FlatList
                    data={entitiesDown1}
                    keyExtractor={(entitiesDown1) =>
                      entitiesDown1.id.toString()
                    }
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          let tempJson = JSON.parse(item.navigation);
                          navigation.navigate(tempJson.screen, {
                            key: key,
                            ...tempJson,
                          });
                        }}
                      >
                        <Image
                          source={{ uri: item.thumbnail }}
                          style={{
                            width: wp(90),
                            height: hp(20.9),
                            borderRadius: 3,
                            marginRight: wp(2),
                          }}
                          resizeMode="stretch"
                        />
                      </TouchableOpacity>
                    )}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View style={styles.diffrentiator}></View>
                <Swiper
                  height={hp(14)}
                  autoplay={true}
                  removeClippedSubviews={false}
                  autoplayTimeout={2}
                  showsPagination={false}
                >
                  {mappedEntitiesDown2()}
                </Swiper>
                <View
                  style={{
                    height: hp(0.5),
                    width: wp(100),
                    backgroundColor: Colors.light,
                    marginTop: wp(2),
                  }}
                ></View>
                <Swiper
                  height={hp(24)}
                  autoplay={true}
                  removeClippedSubviews={false}
                  autoplayTimeout={2}
                  showsPagination={false}
                >
                  {mappedEntitiesDown3()}
                </Swiper>
              </View>
            </ScrollView>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: hp(18),
              }}
            >
              <Image
                source={require("../assets/nodelivering.jpeg")}
                resizeMode="contain"
                style={{ width: wp(90), height: hp(35), alignSelf: "center" }}
              />
              <Text style={{ fontWeight: "bold", color: "black" }}>
                We are not delivering here
              </Text>
              <View
                style={{
                  backgroundColor: "#ffaa01",
                  marginTop: hp(2),
                  paddingVertical: 7,
                  paddingHorizontal: 7,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{ fontWeight: "bold", color: "white" }}
                  onPress={() => navigation.navigate("Addresses")}
                >
                  Change Location
                </Text>
              </View>
            </View>
          )}
        </Screen>
      )}

      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </>
  );
}

const styles = StyleSheet.create({
  assistant: {
    marginTop: hp(1.5),
    marginHorizontal: wp(4),
  },
  assistantbanner: {
    height: hp(13),
    width: wp(92),
    borderRadius: 8,
  },
  box: {
    width: wp(21.5),
    height: hp(11),
    marginRight: wp(2.5),
    elevation: 2.5,
    // borderWidth: wp(0.2),
    // borderColor: "#dddddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 3,
  },
  boxicon: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  boxtitle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: hp(1),
  },
  boximages: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  banners: {
    // height: hp(28),
    marginVertical: hp(1.5),
    marginLeft: wp(2),
  },
  container: {
    paddingBottom: hp(7),
  },
  diffrentiator: {
    height: hp(0.5),
    width: wp(100),
    backgroundColor: Colors.light,
  },
  entities: {
    marginTop: hp(5),
    marginBottom: hp(3),
    marginLeft: wp(3),
  },

  heading: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  hbanners: {
    width: wp(76.8),
    height: hp(20.9),
    borderRadius: 10,
    marginRight: wp(3),
  },
  ir1: {
    flexDirection: "row",
  },
  ir2: {
    flexDirection: "row",
    marginTop: hp(1.8),
  },
  i1: {
    width: wp(44),
    height: hp(16.5),
    borderRadius: 4,
  },
  i2: {
    width: wp(44),
    height: hp(16.5),
    marginLeft: wp(3.2),
    borderRadius: 4,
  },
  nav: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    elevation: 7,
    height: hp(8),
  },
  navLeft: {
    flexDirection: "row",
    // margin: 15,
    padding: 17,
  },
  navLeftLocation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(5),
    width: wp(40),
  },
  navRight: {
    right: 10,
    position: "absolute",
    flexDirection: "row",
    padding: 17,
  },
  row: {
    flexDirection: "row",
  },
  smallimages: {
    width: wp(21),
    height: hp(10),
    borderRadius: 5,
    marginRight: wp(3),
  },
});

export default LandingScreen;
