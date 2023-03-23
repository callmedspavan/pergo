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
  ActivityIndicator
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
import GetBanners from "../Api/GetBannersApi";

import getPartners from "../Api/PartnersApi";
import ServicesSearchApi from "../Api/ServicesSearchApi";

function MedicinesSearchResult({ navigation, route }) {
  const entity = "Medicines";
  const { search } = route.params;

  const authContext = useContext(AuthContext);
  const jwttoken = authContext.user.jwttoken;
  const lat = authContext.location[0].lattitude;
  const long = authContext.location[0].longittude;
  const city = authContext.location[0].city;
  const state = authContext.location[0].state;

  const [searchPartners, setSearchPartners] = useState([]);
  const [loading, setLoading] = useState(false);

  
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
  

  useEffect(() => {
    loadSearch();
  }, []);

  const loadSearch = async () => {
    setLoading(true)
    const searchresponse = await ServicesSearchApi.getServicesSearch({
      search,
      jwttoken,
      state,
      city,
      lat,
      long,
      entity,
    });

    setSearchPartners(searchresponse.data);
     setLoading(false)
  };

  const callFoodProducts = (
    accesstoken,
    resname,
    rating,
    status,
    avgorder,
    offers
  ) => {
    navigation.navigate("Menu", {
      accesstoken: accesstoken,
      name: resname,
      rating: rating,
      status: status,
      avgorder: avgorder,
      offers: offers,
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
        {loading == true ? <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1, }}
        >
          <ActivityIndicator animating={loading} size={35} color="#ffaa01" />
          <Text style={{ color: "grey" }}>Loading...</Text>
        </View> : <ScrollView showsVerticalScrollIndicator={false}>
         
            <Swiper
              height={hp(22)}
              autoplay={true}
              removeClippedSubviews={false}
              autoplayTimeout={3}
              showsPagination={false}
            >
              {mappedSecond()}
              
            </Swiper>
          
          
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
              Results Matching "{search}"
            </Text>
          </View>
          <FlatList
            data={searchPartners}
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
                    item.resoffers
                  )
                }
              />
            )}
            ListFooterComponent={() => (
              <View style={{ height: hp(3.5) }}></View>
            )}
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
        </ScrollView> }
      </View>

      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    </>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
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

export default MedicinesSearchResult;
