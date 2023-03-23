import React, { useState } from "react";
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
import Keywords from "../Components/KeyWords";
import Swiper from "react-native-swiper";

const keywords = [
  {
    id: 1,
    name: "Sugar",
  },
  {
    id: 2,
    name: "lux",
  },
  {
    id: 3,
    name: "Face Care",
  },
  {
    id: 4,
    name: "Oral Care",
  },
  {
    id: 5,
    name: "Personal Care",
  },
  {
    id: 6,
    name: "Oral Care",
  },
  {
    id: 7,
    name: "Personal Care",
  },
];

function GrocerySearch({ navigation }) {
  const [search, setSearch] = useState();

  const navigationtosearch = (name) => {
    navigation.navigate("Grocery Result", {
      search: name,
    });
  };

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
            placeholder="Start Typing...                                                                  "
            keyboardType="default"
            style={{ marginLeft: wp(2), fontSize: wp(3.5) }}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Grocery Result", {
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
          <Text style={{ fontWeight: "bold" }}>Search</Text>
        </View>
      </TouchableOpacity>

      <View
        style={{
          marginVertical: hp(1),
          marginLeft: wp(3),
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: wp(4),
            color: "grey",
            fontStyle: "italic",
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

      {/* <View style={styles.banner}>
        <Image
          source={require("../assets/promotion-1.jpg")}
          style={{ width: wp(94), height: hp(20), borderRadius: 5 }}
          resizeMode="cover"
        />
      </View> */}
      <View
        style={{
          height: hp(20),
          width: wp(94),
          margin: wp(3),
          justifyContent: "center",
          alignSelf: "center",
          borderRadius: 5,
        }}
      >
        <Swiper
          autoplay={true}
          removeClippedSubviews={false}
          autoplayTimeout={2}
          showsPagination={false}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <TouchableOpacity>
              <Image
                source={require("../assets/promotion-4.jpg")}
                style={{
                  width: wp(94),
                  height: hp(20),
                  borderRadius: 5,
                }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <TouchableOpacity>
              <Image
                source={require("../assets/promotion-2.jpg")}
                style={{
                  width: wp(94),
                  height: hp(20),
                  borderRadius: 5,
                }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <TouchableOpacity>
              <Image
                source={require("../assets/promotion-3.jpg")}
                style={{
                  width: wp(94),
                  height: hp(20),
                  borderRadius: 5,
                }}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        </Swiper>
      </View>
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

export default GrocerySearch;
