import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
import Keywords from "../Components/KeyWords";
import Swiper from "react-native-swiper";
import getPartnerBestSellers from "../Api/MerchantBestSellers";
import AuthContext from "../Auth/Context";
import { ScrollView } from "react-native";
import getPartners from "../Api/PartnersApi";
import GetBanners from "../Api/GetBannersApi";

const keywords = [
  {
    id: 1,
    name: "Biryani",
  },
  {
    id: 2,
    name: "Chicken Wings",
  },
  {
    id: 3,
    name: "Bajji",
  },
  {
    id: 4,
    name: "Pani Puri",
  },
  {
    id: 5,
    name: " Burger",
  },
  {
    id: 6,
    name: "Idly",
  },
  {
    id: 7,
    name: "Dosa",
  },
];

function FishAndMeatSearch({ navigation }) {
  const entity = "Fish %26 Meat";

  const authContext = useContext(AuthContext);
  const jwttoken = authContext.user.jwttoken;
  const lat = authContext.location[0].lattitude;
  const long = authContext.location[0].longittude;
  const city = authContext.location[0].city;
  const state = authContext.location[0].state;

  const [search, setSearch] = useState();
  const [partnerBestSellers, setPartnerBestSellers] = useState([]);

  const [second, setSecond] = useState([]);

  const [partners, setPartners] = useState([]);

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
      if (assignbanner[i].sectionname == "Second") {
        setSecond(assignbanner[i].childbanners);
      }
    }
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
          marginHorizontal:wp(3),
          marginTop: hp(2),
        }}
        key={Math.random()}
      >
        <TouchableOpacity onPress={() => dynamicCallFoodProducts(item.navigation)}>
          <Image
            source={{uri: item.thumbnail}}
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
    navigation.navigate("Fish & Meat Result", {
      search: name,
    });
  };

  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.searchbar}>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="grey"
            style={{ alignSelf: "center" }}
          />

          <TextInput
            placeholder="Start Typing...                                                            "
            keyboardType="default"
            style={{ marginLeft: wp(2), fontSize: wp(3.5) }}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Fish & Meat Result", {
            search: search,
          })
        }
      >
        <View
          style={{
            backgroundColor: "#ffaa01",
            width: wp(20),
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "flex-end",

            marginTop: wp(3),
            paddingVertical: hp(0.8),
            marginHorizontal: wp(3.5),
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "black", fontFamily: "Alata_400Regular" }}>
            Search
          </Text>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <View
          style={{
            marginVertical: hp(1),
            marginLeft: wp(3),
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: wp(4),
              color: "grey",

              fontFamily: "Alata_400Regular",
            }}
          >
            Trending
          </Text>
          <MaterialCommunityIcons
            name="trending-up"
            color="grey"
            size={wp(5)}
            style={{ alignSelf: "center", marginLeft: wp(1) }}
          />
        </View>

        <View style={{ marginLeft: wp(3), marginRight: wp(3) }}>
          <FlatList
            data={keywords}
            keyExtractor={(keywords) => keywords.id.toString()}
            renderItem={({ item }) => (
              <Keywords
                name={item.name}
                onpress={() => navigationtosearch(item.name)}
              />
            )}
            numColumns={3}
          />
        </View>

        <View
          style={{
            marginLeft: wp(3.5),
            marginTop: hp(2),
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontSize: wp(4.5),
              color: "grey",
              fontFamily: "Alata_400Regular",
            }}
          >
            Try it out once
          </Text>
        </View>
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

        {/* <View style={styles.banner}>
        <Image
          source={require("../assets/promotion-1.jpg")}
          style={{ width: wp(94), height: hp(20), borderRadius: 5 }}
          resizeMode="cover"
        />
      </View> */}
        {/* <View
          style={{
            height: hp(20),
            width: wp(94),
            margin: wp(3),
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 5,
            marginTop: hp(2),
          }}
        > */}
          <Swiper
            height={hp(22)}
            autoplay={true}
            removeClippedSubviews={false}
            autoplayTimeout={2}
            showsPagination={false}
          >
            {/* <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 5,
                marginHorizontal:wp(3),
                marginTop: hp(2),
              }}
            >
              <TouchableOpacity>
                <Image
                  source={require("../assets/Food/promotion-1.jpg")}
                  style={{
                    width: wp(94),
                    height: hp(20),
                    borderRadius: 5,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View> */}
            {mappedSecond()}
          </Swiper>
        {/* </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    margin: wp(3),
  },
  searchbar: {
    marginTop: hp(2),
    marginHorizontal: wp(4),
    backgroundColor: "white",
    elevation: 5,
    paddingHorizontal: hp(1.3),
    borderRadius: 5,
    flexDirection: "row",
  },
});

export default FishAndMeatSearch;
