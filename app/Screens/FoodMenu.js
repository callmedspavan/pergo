import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SectionList,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
import Backgroundmodal from "react-native-modal";
// import { AppLoading } from "expo";
import Colors from "../Config/Colors";
import AuthContext from "../Auth/Context";
import FoodMenuComponent from "../Components/FoodMenuComponent";
import getPartnerMenu from "../Api/PartnerMenuApi";
import ClearCart from "../Api/ClearCartApi";
import getCartCount from "../Api/CartCountApi";
import servicesAddToCart from "../Api/ServicesAddToCartApi";

function FoodMenu({ navigation, route }) {
  const sectionListRef = useRef(null);
  const { accesstoken } = route.params;
  const { name } = route.params;
  const { rating } = route.params;
  const { status } = route.params;
  const { avgorder } = route.params;
  const { offers } = route.params;
  const { statusmessage } = route.params;

  const authContext = useContext(AuthContext);
  const jwttoken = authContext.user.jwttoken;
  const key = authContext.user.accesskey;

  const [partnerMenu, setPartnerMenu] = useState([]);
  const [activeSubPacks, setActiveSubPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisable, setModalVisable] = useState(false);
  const [menutoggle, setMenuToggle] = useState(false);
  const [tempCategories, setTempCategories] = useState([]);
  const [ActiveSubPackValues, setActiveSubPackValues] = useState({});
  const [differentItems, setDifferentItems] = useState(false);

  const scrollToCatIndex = (index) => {
    setMenuToggle(false);
    sectionListRef.current.scrollToLocation({
      animated: true,
      sectionIndex: index,
      itemIndex: 0,
    });
  };

  // calling Cartcount Api-----------------------

  const [cartCount, setCartCount] = useState({ itemscount: 0, amount: 0 });

  useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    const entity = "FOOD";
    const cartcountresponse = await getCartCount.getCartCount({
      key,
      jwttoken,
      entity,
    });

    setCartCount(cartcountresponse.data[0]);
  };

  useEffect(() => {
    loadPartnerMenu();
  }, []);

  // subpack add to cart function...........................................

  const addSubPacktoCart = (id, count) => {
    const qty = parseInt(count) + 1;
    if (qty < 0) {
      return;
    }
    let previousSubpacks = JSON.parse(JSON.stringify(activeSubPacks));
    let tempcountincart = JSON.parse(JSON.stringify(activeSubPacks));
    tempcountincart.forEach((element, index) => {
      if (element.id == id) {
        tempcountincart[index].itemCountincart = qty;
      }
    });
    setActiveSubPacks(tempcountincart);
    setCartCount({
      itemscount: cartCount.itemscount + 1,
      amount: cartCount.amount,
    });
    addSubPacktoCartToAPI(id, qty, tempcountincart, previousSubpacks);
  };

  const addSubPacktoCartToAPI = async (productid, qty, updated, previous) => {
    const result = await servicesAddToCart.servicesAddToCart({
      key,
      productid,
      qty,
      jwttoken,
    });
    if (result.data.status == "Different" || !result.ok) {
      let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
      for (let i = 0; i < temppartnerMenu.length; i++) {
        if (temppartnerMenu[i].categoryname == ActiveSubPackValues.catName) {
          for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
            if (
              temppartnerMenu[i].data[j].productid ==
              ActiveSubPackValues.productId
            ) {
              temppartnerMenu[i].data[j].subpacksdata = previous;
              if (cartCount.itemscount > 0 && !result.ok) {
                setCartCount({
                  itemscount: cartCount.itemscount - 1,
                  amount: cartCount.amount,
                });
              }
              setDifferentItems(true)
              break;
            }
          }
          break;
        }
      }
      setPartnerMenu(temppartnerMenu);
      setActiveSubPacks(previous);
    } else {
      let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
      for (let i = 0; i < temppartnerMenu.length; i++) {
        if (temppartnerMenu[i].categoryname == ActiveSubPackValues.catName) {
          for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
            if (
              temppartnerMenu[i].data[j].productid ==
              ActiveSubPackValues.productId
            ) {
              temppartnerMenu[i].data[j].subpacksdata = updated;
              if (ActiveSubPackValues.productId == productid) {
                temppartnerMenu[i].data[j].itemCountincart = qty;
              }
              break;
            }
          }
          break;
        }
      }
      setPartnerMenu(temppartnerMenu);
    }
  };

  // subpack del to cart function...........................................

  const delSubPacktoCart = (id, count) => {
    const qty = parseInt(count) - 1;
    if (qty < 0) {
      return;
    }
    let previousSubpacks = JSON.parse(JSON.stringify(activeSubPacks));
    let tempcountincart = JSON.parse(JSON.stringify(activeSubPacks));
    tempcountincart.forEach((element, index) => {
      if (element.id == id) {
        tempcountincart[index].itemCountincart = qty;
      }
    });
    setActiveSubPacks(tempcountincart);
    setCartCount({
      itemscount: cartCount.itemscount - 1,
      amount: cartCount.amount,
    });
    delSubPacktoCartToAPI(id, qty, tempcountincart, previousSubpacks);
  };

  const delSubPacktoCartToAPI = async (productid, qty, updated, previous) => {
    const result = await servicesAddToCart.servicesAddToCart({
      key,
      productid,
      qty,
      jwttoken,
    });
    if (result.data.status == "Different" || !result.ok) {
      let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
      for (let i = 0; i < temppartnerMenu.length; i++) {
        if (temppartnerMenu[i].categoryname == ActiveSubPackValues.catName) {
          for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
            if (
              temppartnerMenu[i].data[j].productid ==
              ActiveSubPackValues.productId
            ) {
              temppartnerMenu[i].data[j].subpacksdata = previous;
              if (cartCount.itemscount > 0) {
                setCartCount({
                  itemscount: cartCount.itemscount + 1,
                  amount: cartCount.amount,
                });
              }

              break;
            }
          }
          break;
        }
      }
      setPartnerMenu(temppartnerMenu);
      setActiveSubPacks(previous);
    } else {
      let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
      for (let i = 0; i < temppartnerMenu.length; i++) {
        if (temppartnerMenu[i].categoryname == ActiveSubPackValues.catName) {
          for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
            if (
              temppartnerMenu[i].data[j].productid ==
              ActiveSubPackValues.productId
            ) {
              temppartnerMenu[i].data[j].subpacksdata = updated;
              if (ActiveSubPackValues.productId == productid) {
                temppartnerMenu[i].data[j].itemCountincart = qty;
              }
              break;
            }
          }
          break;
        }
      }
      setPartnerMenu(temppartnerMenu);
    }
  };

  // normal add to cart function...........................................

  const addMenuItems = (productID, catName) => {
    let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
    for (let i = 0; i < temppartnerMenu.length; i++) {
      if (temppartnerMenu[i].categoryname == catName) {
        for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
          if (temppartnerMenu[i].data[j].productid == productID) {
            temppartnerMenu[i].data[j].itemCountincart =
              parseInt(temppartnerMenu[i].data[j].itemCountincart) + 1;
            setCartCount({
              itemscount: cartCount.itemscount + 1,
              amount: cartCount.amount,
            });
            addMenuItemToAPI(
              productID,
              catName,
              temppartnerMenu[i].data[j].itemCountincart
            );
            break;
          }
        }
        break;
      }
    }
    setPartnerMenu(temppartnerMenu);
  };

  const addMenuItemToAPI = async (productid, catName, qty) => {
    //console.log(productid, catName, qty);
    const result = await servicesAddToCart.servicesAddToCart({
      key,
      productid,
      qty,
      jwttoken,
    });
    if (result.data.status == "Different" || !result.ok) {
      let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
      for (let i = 0; i < temppartnerMenu.length; i++) {
        if (temppartnerMenu[i].categoryname == catName) {
          for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
            if (temppartnerMenu[i].data[j].productid == productid) {
              temppartnerMenu[i].data[j].itemCountincart =
                parseInt(temppartnerMenu[i].data[j].itemCountincart) - 1;
              if (cartCount.itemscount > 0 && !result.ok) {
                setCartCount({
                  itemscount: cartCount.itemscount - 1,
                  amount: cartCount.amount,
                });
              }
             setDifferentItems(true)
              break;
            }
          }
          break;
        }
      }
      setPartnerMenu(temppartnerMenu);
    } else {
    }
  };

  // normal del to cart function...........................................

  const delMenuItems = (productID, catName) => {
    let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
    for (let i = 0; i < temppartnerMenu.length; i++) {
      if (temppartnerMenu[i].categoryname == catName) {
        for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
          if (temppartnerMenu[i].data[j].productid == productID) {
            temppartnerMenu[i].data[j].itemCountincart =
              parseInt(temppartnerMenu[i].data[j].itemCountincart) - 1;
            setCartCount({
              itemscount: cartCount.itemscount - 1,
              amount: cartCount.amount,
            });
            delMenuItemToAPI(
              productID,
              catName,
              temppartnerMenu[i].data[j].itemCountincart
            );
            break;
          }
        }
        break;
      }
    }
    setPartnerMenu(temppartnerMenu);
  };

  const delMenuItemToAPI = async (productid, catName, qty) => {
    const result = await servicesAddToCart.servicesAddToCart({
      key,
      productid,
      qty,
      jwttoken,
    });
    if (result.data.status == "Different" || !result.ok) {
      let temppartnerMenu = JSON.parse(JSON.stringify(partnerMenu));
      for (let i = 0; i < temppartnerMenu.length; i++) {
        if (temppartnerMenu[i].categoryname == catName) {
          for (let j = 0; j < temppartnerMenu[i].data.length; j++) {
            if (temppartnerMenu[i].data[j].productid == productid) {
              temppartnerMenu[i].data[j].itemCountincart =
                parseInt(temppartnerMenu[i].data[j].itemCountincart) + 1;

              setCartCount({
                itemscount: cartCount.itemscount + 1,
                amount: cartCount.amount,
              });

              break;
            }
          }
          break;
        }
      }
      setPartnerMenu(temppartnerMenu);
    } else {
    }
  };

  const loadPartnerMenu = async () => {
    setLoading(true);
    const partnermenuresponse = await getPartnerMenu.getPartnerMenu({
      accesstoken,
      jwttoken,
      key,
    });

    if (!partnermenuresponse.ok) alert("Something Went Wrong");

    setPartnerMenu(partnermenuresponse.data);
    let categories = [];
    for (let i = 0; i < partnermenuresponse.data.length; i++) {
      categories.push(partnermenuresponse.data[i].categoryname);
    }
    setTempCategories(categories);
    setLoading(false);
  };

  const openSubPacks = (subpacks, catName, productId) => {
    setActiveSubPacks(subpacks);
    setActiveSubPackValues({ catName, productId });
    setModalVisable(true);
  };
 const clearCart = async (value) => {
    if(value == "yes"){
      const cartcountresponse = await ClearCart.CancleCart({
        key,
        jwttoken,
      });
      loadCartCount()
      loadPartnerMenu()
      setDifferentItems(false)
    }
    if(value == "no"){
      setDifferentItems(false)
    }
 }

  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <>
      {cartCount.itemscount > 0 ? (
        <View
          style={{
            position: "absolute",
            bottom: hp(8),
            right: wp(2),
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setMenuToggle(true)}
            activeOpacity={0.2}
          >
            <View
              style={{
                backgroundColor: "black",
                width: wp(23),
                alignItems: "center",
                paddingBottom: hp(0.8),
                paddingTop: hp(0.4),
                borderRadius: 15,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="menu"
                color={"white"}
                style={{ alignSelf: "center" }}
                size={wp(3.5)}
              />
              <Text
                style={{
                  color: "white",
                  marginLeft: 4,
                  fontFamily: "Alata_400Regular",
                  alignSelf: "center",
                  fontSize: wp(3.5),
                }}
              >
                Menu
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: hp(3),
            right: wp(2),
            zIndex: 10,
          }}
        >
          <TouchableOpacity onPress={() => setMenuToggle(true)}>
            <View
              style={{
                backgroundColor: "black",
                width: wp(23),
                alignItems: "center",
                paddingBottom: hp(0.8),
                paddingTop: hp(0.4),
                borderRadius: 15,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons
                name="menu"
                color={"white"}
                style={{ alignSelf: "center" }}
                size={wp(3.5)}
              />
              <Text
                style={{
                  color: "white",
                  marginLeft: 4,
                  fontFamily: "Alata_400Regular",
                  alignSelf: "center",
                  fontSize: wp(3.5),
                }}
              >
                Menu
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {cartCount.itemscount > 0 ? (
        <View
          style={{
            backgroundColor: "#2fbb2f",
            opacity: 0.98,
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 10,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  marginLeft: wp(-7),
                  paddingVertical: wp(3.5),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    letterSpacing: wp(0.5),
                    fontSize: wp(3.5),
                    color: "white",
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  {cartCount.itemscount} Item{" "}
                </Text>
              </View>

              <View
                style={{
                  // marginHorizontal: wp(4),
                  paddingVertical: wp(3.5),
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    letterSpacing: wp(0.5),
                    fontSize: wp(3.5),
                    color: "white",
                    fontFamily: "Alata_400Regular",
                  }}
                >
                  View Cart
                </Text>
                <Image
                  source={require("../assets/arrow.gif")}
                  style={{
                    height: hp(3),
                    width: wp(5),
                    marginLeft: wp(1),
                    transform: [{ rotate: "180deg" }],
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={styles.container}>
        {loading == true ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <ActivityIndicator animating={loading} size={35} color="#ffaa01" />
            <Text style={{ color: "grey" }}>Loading...</Text>
          </View>
        ) : (
          <SectionList
            ListHeaderComponent={() => {
              return (
                <View>
                  <View style={styles.title}>
                    {/* <Text
          numberOfLines={1}
          style={{
            fontFamily: "Alata_400Regular",
            fontSize: wp(4.5),
          }}
        >
          Tasty Rolls
        </Text> */}
                    {/* <Text
            numberOfLines={1}
            style={{
              fontSize: wp(3),
              color: "grey",

              fontFamily: "Alata_400Regular",
            }}
          >
            Biryani, North Indian, Chinese
          </Text> */}
                  </View>
                  <View style={styles.bar}>
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={{
                          width: wp(30),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <MaterialCommunityIcons name="star" color={"black"} />
                          <Text
                            style={{
                              marginLeft: wp(1.2),
                              fontFamily: "Alata_400Regular",
                              color: "black",
                            }}
                          >
                            {rating}
                          </Text>
                        </View>
                        <View>
                          {rating == "New" ? (
                            <Text
                              style={{
                                fontSize: wp(3),
                                color: "grey",
                                fontFamily: "Alata_400Regular",
                              }}
                            >
                              No ratings
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: wp(3),
                                color: "grey",
                                fontFamily: "Alata_400Regular",
                              }}
                            >
                              100+ ratings
                            </Text>
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          width: wp(30),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {status == "False" ? (
                            <Text
                              style={{
                                marginLeft: wp(1.2),
                                fontFamily: "Alata_400Regular",
                                color: "tomato",
                                alignSelf: "center",
                              }}
                            >
                              {statusmessage}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                marginLeft: wp(1.2),
                                fontFamily: "Alata_400Regular",
                                color: "#2fbb2f",
                              }}
                            >
                              Open
                            </Text>
                          )}
                        </View>
                        <View>
                          {status == "False" ? (
                            <Text
                              style={{
                                fontSize: wp(3),
                                color: "grey",
                                fontFamily: "Alata_400Regular",
                              }}
                            >
                              Check Back Later
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: wp(3),
                                color: "grey",
                                fontFamily: "Alata_400Regular",
                              }}
                            >
                              Order Now
                            </Text>
                          )}
                        </View>
                      </View>
                      <View
                        style={{
                          width: wp(30),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <MaterialCommunityIcons
                            name="currency-inr"
                            color={"black"}
                          />
                          <Text
                            style={{
                              marginLeft: wp(0),
                              fontFamily: "Alata_400Regular",
                              color: "black",
                            }}
                          >
                            {avgorder}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: wp(3),
                              color: "grey",
                              fontFamily: "Alata_400Regular",
                            }}
                          >
                            Per Person
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.safetystandard}>
                      <MaterialCommunityIcons
                        name="shield-check-outline"
                        size={wp(5)}
                        color="#1f8787"
                      />
                      <Text
                        style={{
                          marginLeft: wp(2),
                          color: "#1f8787",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        This Outlet follows Best Safety Standards
                      </Text>
                    </View>
                  </View>
                  <View style={styles.offers}>
                    <View style={{ flexDirection: "row", marginTop: hp(1.5) }}>
                      <MaterialCommunityIcons
                        name="sale"
                        size={wp(4)}
                        color="#d13c17"
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                      <Text
                        style={{
                          fontSize: wp(3.1),
                          color: "grey",
                          fontFamily: "Alata_400Regular",
                          marginLeft: wp(2),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {offers} up to 100/- | Use Code "PERGO"
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: hp(1.5) }}>
                      <MaterialCommunityIcons
                        name="sale"
                        size={wp(4)}
                        color="#d13c17"
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                      <Text
                        style={{
                          fontSize: wp(3.1),
                          color: "grey",
                          fontFamily: "Alata_400Regular",
                          marginLeft: wp(2),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        30% off up to 100/- with SBI credit cards, once per week
                        | Use Code 100SBI
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
            sections={partnerMenu}
            ref={sectionListRef}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <FoodMenuComponent
                name={item.productname}
                discription={item.productdescription}
                price={item.price}
                sellingprice={item.sellingprice}
                image={item.pimage}
                pureveg={item.pureveg}
                itemCountincart={item.itemCountincart}
                status={item.status}
                subpacks={item.subpacks}
                showSubPacks={() =>
                  openSubPacks(
                    item.subpacksdata,
                    item.categoryname,
                    item.productid
                  )
                }
                plusCart={() => addMenuItems(item.productid, item.categoryname)}
                minusCart={() =>
                  delMenuItems(item.productid, item.categoryname)
                }
                recommended={item.Recommended}
                categoryname={item.categoryname}
              />
            )}
            renderSectionHeader={({ section: { categoryname } }) => (
              <View
                style={{
                  borderTopColor: Colors.light,
                  borderTopWidth: 4,
                  paddingTop: hp(1),
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: wp(5),
                    fontFamily: "Alata_400Regular",
                    marginLeft: wp(5),
                    color: "black",
                    // marginTop: hp(1),
                  }}
                >
                  {categoryname}
                </Text>
                <MaterialCommunityIcons
                  name="arrow-down-drop-circle-outline"
                  size={wp(4)}
                  color="tomato"
                  style={{
                    alignSelf: "center",
                    marginLeft: wp(2),
                    marginTop: 9,
                  }}
                />
              </View>
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  marginTop: hp(10),
                }}
              >
                <Image
                  source={require("../assets/Food/emptyplate.jpg")}
                  style={{ width: wp(35), height: hp(20) }}
                  resizeMode="contain"
                />
                <Text style={{ fontFamily: "Alata_400Regular" }}>
                  There is no menu added for this outlet yet
                </Text>
              </View>
            )}
            refreshing={false}
            onRefresh={() => loadPartnerMenu()}
            ListFooterComponent={() => <View style={{ height: hp(7) }}></View>}
          />
        )}
        <Backgroundmodal
          isVisible={modalVisable}
          style={{ justifyContent: "flex-end", margin: 0 }}
          onBackdropPress={() => setModalVisable(false)}
          useNativeDriver={true}
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
                    color: "black",
                  }}
                >
                  Select Variant*
                </Text>
                <TouchableOpacity onPress={() => setModalVisable(false)}>
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={wp(8)}
                    color={"black"}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                data={activeSubPacks}
                keyExtractor={(activeSubPacks) => activeSubPacks.id.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: hp(1.8),
                      marginHorizontal: wp(3),
                    }}
                  >
                    <View style={{ width: wp(50) }}>
                      <View>
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "black",
                          }}
                        >
                          {item.productname}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "grey",
                            paddingTop: hp(1),
                          }}
                        >
                          {item.price}/-
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "grey",
                            paddingTop: hp(1),
                            marginLeft: wp(3),
                            textDecorationLine: "line-through",
                          }}
                        >
                          {item.sellingprice}/-
                        </Text>
                      </View>
                    </View>
                    {item.itemCountincart == 0 ? (
                      <TouchableOpacity
                        style={{ alignSelf: "center" }}
                        onPress={() =>
                          addSubPacktoCart(item.id, item.itemCountincart)
                        }
                      >
                        <View
                          style={{
                            borderWidth: 2,
                            width: wp(20),
                            height: hp(3.5),
                            borderRadius: 5,
                            borderColor: "#ddd9d9",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Alata_400Regular",
                              alignSelf: "center",
                              color: "#2fbb2f",
                            }}
                          >
                            Add +
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          width: wp(20),
                          height: hp(3.5),
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            borderRadius: 5,
                            borderColor: "#ddd9d9",
                            borderWidth: 2,
                            width: wp(6.5),
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            delSubPacktoCart(item.id, item.itemCountincart)
                          }
                        >
                          <View>
                            <Text
                              style={{
                                color: "#2fbb2f",
                                fontFamily: "Alata_400Regular",
                              }}
                            >
                              -
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            alignSelf: "center",
                            color: "#2fbb2f",
                          }}
                        >
                          {item.itemCountincart}
                        </Text>
                        <TouchableOpacity
                          style={{
                            borderRadius: 5,
                            borderColor: "#ddd9d9",
                            borderWidth: 2,
                            width: wp(6.5),
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            addSubPacktoCart(item.id, item.itemCountincart)
                          }
                        >
                          <View>
                            <Text
                              style={{
                                color: "#2fbb2f",
                                fontFamily: "Alata_400Regular",
                              }}
                            >
                              +
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </Backgroundmodal>
        <Backgroundmodal
          isVisible={differentItems}
          deviceHeight={hp(100)}
          deviceWidth={wp(100)}
          onBackdropPress={() => setDifferentItems(false)}
          animationIn="zoomIn"
          animationOut="zoomOut"
          animationInTiming={300}
          animationOutTiming={300}
          useNativeDriver={true}
        >
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "white",
              width: wp(85),
              paddingVertical: hp(2),
              paddingHorizontal: wp(5),
              borderRadius: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: hp(1),
              }}
            >
              <Text
                style={{
                  fontFamily: "Alata_400Regular",
                  fontSize: wp(4.8),
                  color: "tomato",
                }}
              >
                Alert
              </Text>
            </View>

            <View
              style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
            >
              <Text
                style={{
                  fontFamily: "Alata_400Regular",
                  fontSize: wp(4.8),
                  color: "black",
                }}
              >
                Do you want to clear?
              </Text>
              <Text
                style={{
                  fontFamily: "Alata_400Regular",
                  fontSize: wp(3.5),
                  color: "black",
                }}
              >
                Your cart contains items other than {name} menu
              </Text>
              
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: hp(1),
              }}
            >
              <Text
                style={{
                  fontFamily: "Alata_400Regular",
                  fontSize: wp(4),
                  color: "tomato",
                }}
                onPress={()=>clearCart("yes")}
              >
                Yes
              </Text>
              <Text
                style={{
                  fontFamily: "Alata_400Regular",
                  fontSize: wp(4),
                  color: "tomato",
                  marginLeft:wp(6)
                }}
                onPress={()=>clearCart("no")}
              >
                No
              </Text>
            </View>
          </View>
        </Backgroundmodal>
        {cartCount.itemscount ? (
          <Backgroundmodal
            isVisible={menutoggle}
            deviceHeight={hp(100)}
            deviceWidth={wp(100)}
            onBackdropPress={() => setMenuToggle(false)}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={500}
            animationOutTiming={500}
            useNativeDriver={true}
            style={{ position: "absolute", right: -4, bottom: hp(17) }}
          >
            <View
              style={{
                backgroundColor: "#f8f8f8",
                width: wp(60),
                height: hp(27),
                borderRadius: 5,
              }}
            >
              <FlatList
                data={tempCategories}
                keyExtractor={(tempCategories) => tempCategories.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => scrollToCatIndex(index)}>
                    <Text
                      style={{
                        marginHorizontal: wp(4),
                        marginVertical: hp(1),
                        color: "black",
                        fontFamily: "Alata_400Regular",
                        fontSize: wp(4),
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Backgroundmodal>
        ) : (
          <Backgroundmodal
            isVisible={menutoggle}
            deviceHeight={hp(100)}
            deviceWidth={wp(100)}
            onBackdropPress={() => setMenuToggle(false)}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={500}
            animationOutTiming={500}
            useNativeDriver={true}
            style={{ position: "absolute", right: -4, bottom: hp(13) }}
          >
            <View
              style={{
                backgroundColor: "#f8f8f8",
                width: wp(60),
                height: hp(27),
                borderRadius: 5,
              }}
            >
              <FlatList
                data={tempCategories}
                keyExtractor={(tempCategories) => tempCategories.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => scrollToCatIndex(index)}>
                    <Text
                      style={{
                        marginHorizontal: wp(4),
                        marginVertical: hp(1),
                        color: "black",
                        fontFamily: "Alata_400Regular",
                        fontSize: wp(4),
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Backgroundmodal>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    marginHorizontal: wp(4),
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: Colors.light,
    marginTop: hp(1),

    paddingVertical: hp(2),
  },
  button: {
    borderWidth: 2,
    width: wp(20),
    height: hp(3.5),
    borderRadius: 5,
  },
  menu: {
    marginHorizontal: wp(3),
    marginTop: hp(2),
    marginBottom: hp(1),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuimage: {
    width: wp(20),
    justifyContent: "center",
  },
  menuname: {
    marginLeft: wp(2),
    width: wp(48),
    flexDirection: "row",
  },
  offers: {
    marginHorizontal: wp(4),
    marginBottom: hp(1),
  },
  safetystandard: {
    borderWidth: 1,
    alignItems: "center",
    paddingVertical: hp(1.7),
    borderRadius: 7,
    marginTop: hp(2),
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#ebffff",
    borderColor: "#1f8787",
  },
  title: {
    marginLeft: wp(3),
    marginTop: hp(2),
  },
});

export default FoodMenu;
