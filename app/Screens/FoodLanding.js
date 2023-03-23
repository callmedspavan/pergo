import React, { useContext, useState, useEffect } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
// import { AppLoading } from "expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Swiper from "react-native-swiper";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AuthContext from "../Auth/Context";
import Partner from "../Components/Partner";
import getPartners from "../Api/PartnersApi";
import GetBanners from "../Api/GetBannersApi";
import getPartnerBestSellers from "../Api/MerchantBestSellers";

function FoodLanding({ navigation }) {
  const entity = "food";

  const authContext = useContext(AuthContext);
  const jwttoken = authContext.user.jwttoken;
  const lat = authContext.location[0].lattitude;
  const long = authContext.location[0].longittude;
  const city = authContext.location[0].city;
  const state = authContext.location[0].state;

  const [partners, setPartners] = useState([]);
  const [partnerBestSellers, setPartnerBestSellers] = useState([]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    const partnersresponse = await getPartners.getPartners({
      entity,
      jwttoken,
    });

    setPartners(partnersresponse.data);
  };

  useEffect(() => {
    loadBestSellerPartners();
  }, []);

  const loadBestSellerPartners = async () => {
    const partnerbestsellersresponse = await getPartnerBestSellers.getMerchantBestsellers(
      {
        jwttoken,
        city,
        lat,
        long,
        entity,
      }
    );

    setPartnerBestSellers(partnerbestsellersresponse.data);
  };

  const navigationtosearch = (name) => {
    navigation.navigate("Food Result", {
      search: name,
    });
  };

  //calling Banners Api

  const [mainBanner, setMainBanner] = useState([]);
  const [second, setSecond] = useState([]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const screenname = "Essential_Service_Landing_Screen";
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
      if (assignbanner[i].sectionname == "Main_Banner") {
        setMainBanner(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Second") {
        setSecond(assignbanner[i].childbanners);
      }
    }
  };

  const callFoodProducts = (
    accesstoken,
    resname,
    rating,
    status,
    avgorder,
    offers,
    statusreason
  ) => {
    navigation.navigate("Menu", {
      accesstoken: accesstoken,
      name: resname,
      rating: rating,
      status: status,
      avgorder: avgorder,
      offers: offers,
      statusmessage: statusreason,
    });
  };

  const dynamicCallFoodProducts = (nav) => {
    let tempJson = JSON.parse(nav);
    if (tempJson.navigation == "res") {
      const temp = partners.filter((item) => {
        return item.accesstoken == tempJson.accesstoken;
      });
      const accesstoken = tempJson.accesstoken;
      const resname = temp[0].restaurantname;
      const rating = temp[0].userrating;
      const status = temp[0].status;
      const avgorder = temp[0].avgorder;
      const offers = temp[0].resoffers;
      const statusreason = temp[0].statusreason;
      navigation.navigate("Menu", {
        accesstoken: accesstoken,
        name: resname,
        rating: rating,
        status: status,
        avgorder: avgorder,
        offers: offers,
        statusmessage: statusreason,
      });
    }
    if (tempJson.navigation == "search") {
      navigation.navigate(tempJson.screen, {
        search: tempJson.search,
      });
    }
  };

  const mappedSecond = () => {
    return second.map((item) => {
      return (
        <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "white",
          borderRadius: 5,
          marginTop: hp(2),
          marginHorizontal: wp(3),
        }}
        key={Math.random()}
      >
        <TouchableOpacity
         
          onPress={() => dynamicCallFoodProducts(item.navigation)}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={{
              width: wp(94),
              height: hp(20),
              borderRadius: 5,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        </View>
      );
    });
  };

  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchbar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Food Search")}
              style={{ flexDirection: "row" }}
            >
              <MaterialCommunityIcons name="magnify" size={20} color="grey" />
              <Text
                style={{
                  marginLeft: wp(2),
                  fontSize: wp(3.5),
                  color: "grey",
                  fontFamily: "Alata_400Regular",
                }}
              >
                Search For the Restaurants
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mainBanner}
            keyExtractor={(mainBanner) => mainBanner.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => dynamicCallFoodProducts(item.navigation)}
              >
                <View style={styles.banner}>
                  <Image
                    source={{ uri: item.thumbnail }}
                    style={{ width: wp(50), height: hp(25), borderRadius: 8 }}
                  />
                </View>
              </TouchableOpacity>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />

          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity>
              <View style={styles.categorydiv}>
                <View style={styles.categoryimage}>
                  <Image
                    source={require("../assets/Food/offer.png")}
                    style={{
                      width: wp(8),
                      height: hp(4.5),
                    }}
                    resizeMode="stretch"
                  />
                </View>
                <View style={styles.categoryname}>
                  <Text
                    style={{
                      color: "grey",
                      textAlign: "center",
                      fontSize: wp(3),
                      fontFamily: "Alata_400Regular",
                    }}
                  >
                    Discount Offers
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.categorydiv}>
              <View style={styles.categoryimage}>
                <Image
                  source={require("../assets/Food/veg.png")}
                  style={{
                    width: wp(8),
                    height: hp(4.5),
                  }}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.categoryname}>
                <Text
                  style={{
                    color: "grey",
                    textAlign: "center",
                    fontSize: wp(3),
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  Veg Only
                </Text>
              </View>
            </View>
            <View style={styles.categorydiv}>
              <View style={styles.categoryimage}>
                <Image
                  source={require("../assets/Food/breakfast.png")}
                  style={{
                    width: wp(8),
                    height: hp(4.5),
                  }}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.categoryname}>
                <Text
                  style={{
                    color: "grey",
                    textAlign: "center",
                    fontSize: wp(3),
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  Breakfast
                </Text>
              </View>
            </View>
            <View style={styles.categorydiv}>
              <View style={styles.categoryimage}>
                <Image
                  source={require("../assets/Food/bakery.png")}
                  style={{
                    width: wp(8),
                    height: hp(4.5),
                  }}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.categoryname}>
                <Text
                  style={{
                    color: "grey",
                    textAlign: "center",
                    fontSize: wp(3),
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  Bakery Food
                </Text>
              </View>
            </View>
            <View style={styles.categorydiv}>
              <View style={styles.categoryimage}>
                <Image
                  source={require("../assets/Food/fastfood.png")}
                  style={{
                    width: wp(8),
                    height: hp(4.5),
                  }}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.categoryname}>
                <Text
                  style={{
                    color: "grey",
                    textAlign: "center",
                    fontSize: wp(3),
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  Fast Food
                </Text>
              </View>
            </View>
            <View style={styles.categorydiv}>
              <View style={styles.categoryimage}>
                <Image
                  source={require("../assets/Food/sweets.png")}
                  style={{
                    width: wp(8),
                    height: hp(4.5),
                  }}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.categoryname}>
                <Text
                  style={{
                    color: "grey",
                    textAlign: "center",
                    fontSize: wp(3),
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  Sweet Stalls
                </Text>
              </View>
            </View>
          </ScrollView> */}
          <View>
            {partnerBestSellers ? (
              <View
                style={{
                  marginLeft: wp(3.5),
                  marginTop: hp(1),
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: wp(4.5),
                    letterSpacing: wp(0.5),
                    color: "grey",
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  Top Picked
                </Text>
              </View>
            ) : null}

            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={partnerBestSellers}
              keyExtractor={(partnerBestSellers) =>
                partnerBestSellers.restid.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    callFoodProducts(
                      item.accesstoken,
                      item.restaurantname,
                      item.userrating,
                      item.status,
                      item.avgorder,
                      item.resoffers,
                      item.statusreason
                    )
                  }
                >
                  <View
                    style={{
                      marginLeft: wp(3),
                      marginTop: hp(2.5),
                      width: wp(25),
                      marginRight: wp(1),
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: item.logo }}
                        style={{
                          width: wp(25),

                          height: hp(11),
                          borderRadius: 6,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: wp(4),
                          fontFamily: "Alata_400Regular",
                          color: "black",
                        }}
                        numberOfLines={1}
                      >
                        {item.restaurantname}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: wp(3),
                          color: "grey",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        {item.category}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: wp(3),
                          color: "grey",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        {item.avgorder} for One
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: wp(3),
                          color: "#2fbb2f",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        {item.userrating}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

         
            <Swiper
              height={hp(22)}
              autoplay={true}
              removeClippedSubviews={false}
              autoplayTimeout={3}
              showsPagination={true}
              activeDotColor="#ffaa01"
            >
              {mappedSecond()}
            </Swiper>
          
          <View style={{ marginTop: hp(2) }}>
            <View>
              <Text
                style={{
                  fontSize: wp(4),
                  letterSpacing: wp(0.2),
                  color: "grey",
                  fontFamily: "Alata_400Regular",
                  marginHorizontal: wp(3),
                }}
              >
                Dude, your favourites are here...
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("Biryani")}
              >
                <ImageBackground
                  source={require("../assets/Food/Biryani.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: hp(2.5),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Biryani
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("chicken wings")}
              >
                <ImageBackground
                  source={require("../assets/Food/chickenwings.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: hp(2.5),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Chicken Wings
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("Pizza")}
              >
                <ImageBackground
                  source={require("../assets/Food/pizza.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: hp(2.5),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Pizza
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("Pani Puri")}
              >
                <ImageBackground
                  source={require("../assets/Food/panipuri.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: wp(3),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Pani Puri
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("Fried Rice")}
              >
                <ImageBackground
                  source={require("../assets/Food/friedrice.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: wp(3),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Fried Rice
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("Bajji")}
              >
                <ImageBackground
                  source={require("../assets/Food/bajji.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: wp(3),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Bajji
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("Idly")}
              >
                <ImageBackground
                  source={require("../assets/Food/idly.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: wp(3),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Idly
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("dosa")}
              >
                <ImageBackground
                  source={require("../assets/Food/dosa.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: wp(3),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Dosa
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => navigationtosearch("Burger")}
              >
                <ImageBackground
                  source={require("../assets/Food/burger.jpg")}
                  style={{
                    width: wp(29.4),
                    height: hp(14),
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    marginLeft: wp(3),
                    marginTop: wp(3),
                  }}
                >
                  <View
                    style={{
                      height: "25%",
                      width: "100%",
                      backgroundColor: "white",
                      opacity: 0.9,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                      }}
                    >
                      Burger
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginLeft: wp(3.5),
              marginTop: hp(2.3),
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: wp(4),
                letterSpacing: wp(0.5),
                color: "grey",
                fontFamily: "Alata_400Regular",
              }}
            >
              Restaurants Near By
            </Text>
          </View>
          <FlatList
            data={partners}
            keyExtractor={(partners) => partners.restid.toString()}
            renderItem={({ item }) => (
              <Partner
                name={item.restaurantname}
                image={item.logo}
                discription={item.category}
                avgorder={item.avgorder}
                offer={item.resoffers}
                status={item.status}
                address={item.address1}
                city={item.city}
                statusreason={item.statusreason}
                rating={item.userrating}
                onpress={() =>
                  callFoodProducts(
                    item.accesstoken,
                    item.restaurantname,
                    item.userrating,
                    item.status,
                    item.avgorder,
                    item.resoffers,
                    item.statusreason
                  )
                }
              />
            )}
            ListFooterComponent={() => (
              <View style={{ height: hp(3.5) }}></View>
            )}
            refreshing={false}
            onRefresh={() => loadPartners()}
          />
          <Image
            source={require("../assets/logo.png")}
            style={{
              height: hp(14),
              width: wp(30),
              marginHorizontal: wp(5),
              marginBottom: hp(10),
              tintColor: "grey",
              opacity: 0.4,
            }}
            resizeMode="contain"
          />
        </ScrollView>
      </View>

      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginLeft: wp(3),
    marginBottom: hp(2),
  },
  banner2: {
    marginHorizontal: wp(3),
    marginTop: hp(2),
  },
  categorydiv: {
    width: 80,
    // borderWidth: 0.2,
    paddingBottom: hp(1),
    borderColor: "grey",
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    marginLeft: wp(2),
  },
  categoryimage: {
    justifyContent: "center",

    alignItems: "center",
    paddingVertical: hp(0.7),
  },
  categoryname: {
    paddingHorizontal: wp(1),
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalrestaurants: {
    marginTop: hp(2.5),
    marginLeft: wp(3),
    flexDirection: "row",
    // borderWidth: 1,
    width: wp(60),
    padding: wp(1),
    overflow: "hidden",
  },
  horizontalrestaurantsdetails: {
    marginLeft: wp(2),
    justifyContent: "center",
  },
  searchbar: {
    marginVertical: hp(2),
    marginHorizontal: wp(4),
    backgroundColor: "white",
    elevation: 5,
    padding: hp(1.3),
    borderRadius: 5,
    flexDirection: "row",
  },
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

export default FoodLanding;
