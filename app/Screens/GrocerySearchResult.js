import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
import Backgroundmodal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import getCartCount from "../Api/CartCountApi";
// import { AppLoading } from "expo";
import getNextSlot from "../Api/NextSlotApi";
import Colors from "../Config/Colors";
import GroceryProduct from "../Components/GroceryProduct";
import AuthContext from "../Auth/Context";
import getGroceryProducts from "../Api/GroceryProductsApi";
import getSearchGroceryProducts from "../Api/GrocerySearchApi"
import Subpack from "../Components/Subpacks";
import getSubPacks from "../Api/SubPacksApi";
import addToCart from "../Api/AddtoCartApi";

function GrocerySearchResult({ navigation, route }) {
  const authContext = useContext(AuthContext);
  const key = authContext.user.accesskey;
  const jwttoken = authContext.user.jwttoken;
  const prime = authContext.user.userdetails[0].prime;


  const { search } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newmodal, setnewmodal] = useState(false);
  const [tempThumbnail,setTempThumbnail] = useState(null)
  const [activeSubPacks, setActiveSubPacks] = useState([]);
  const [tempProductName, setTempProductName] = useState(null);

  
  const increment = async (passeditemcount, productid) => {
    const qty = passeditemcount + 1;
    let tempcountincart = JSON.parse(JSON.stringify(products));
    tempcountincart.forEach((element, index) => {
      if (element.subproductid == productid) {
        tempcountincart[index].itemcountincart = qty;
        tempcountincart[index].subpackproducts[0].itemcountincart = qty;
        setCartCount({
          itemscount: cartCount.itemscount + 1,
          amount: cartCount.amount,
        });
      }
    });
    setProducts(tempcountincart);
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
    if (!result.ok) {
      const qty = passeditemcount;
      let tempcountincart = JSON.parse(JSON.stringify(products));
      tempcountincart.forEach((element, index) => {
        if (element.subproductid == productid) {
          tempcountincart[index].itemcountincart = qty;
          tempcountincart[index].subpackproducts[0].itemcountincart = qty;
          setCartCount({
            itemscount: cartCount.itemscount - 1,
            amount: cartCount.amount,
          });
        }
      });
      setProducts(tempcountincart);
      ToastAndroid.show(
        "Sorry an Error occured while adding",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  
  const subpackincrement = async (passeditemcount, productid) => {
    const qty = passeditemcount + 1;
    let tempcountincart = JSON.parse(JSON.stringify(activeSubPacks));
    tempcountincart.forEach((element, index) => {
      if (element.subproductid == productid) {
        tempcountincart[index].itemcountincart = qty;
        setCartCount({
          itemscount: cartCount.itemscount + 1,
          amount: cartCount.amount,
        });
      }
    });
    setActiveSubPacks(tempcountincart);
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
    if (!result.ok) {
      const qty = passeditemcount;
      let tempcountincart = JSON.parse(JSON.stringify(activeSubPacks));
      tempcountincart.forEach((element, index) => {
        if (element.subproductid == productid) {
          tempcountincart[index].itemcountincart = qty;
          setCartCount({
            itemscount: cartCount.itemscount - 1,
            amount: cartCount.amount,
          });
        }
      });
      setActiveSubPacks(tempcountincart);
      ToastAndroid.show(
        "Sorry an Error occured while adding",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  const decrement = async (passeditemcount, productid) => {
    const qty = passeditemcount - 1;
    let tempcountincart = JSON.parse(JSON.stringify(products));
    tempcountincart.forEach((element, index) => {
      if (element.subproductid == productid) {
        tempcountincart[index].itemcountincart = qty;
        tempcountincart[index].subpackproducts[0].itemcountincart = qty;
        if (!cartCount.itemscount == 0) {
          setCartCount({
            itemscount: cartCount.itemscount - 1,
            amount: cartCount.amount,
          });
        }
      }
    });
    setProducts(tempcountincart);
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
    if (!result.ok) {
      const qty = passeditemcount;
      let tempcountincart = JSON.parse(JSON.stringify(products));
      tempcountincart.forEach((element, index) => {
        if (element.subproductid == productid) {
          tempcountincart[index].itemcountincart = qty;
          tempcountincart[index].subpackproducts[0].itemcountincart = qty;
          if (!cartCount.itemscount == 0) {
            setCartCount({
              itemscount: cartCount.itemscount + 1,
              amount: cartCount.amount,
            });
          }
        }
      });
      setProducts(tempcountincart);
      alert("sorry an error occured while adding");
    }
  };

  const subpackdecrement = async (passeditemcount, productid) => {
    const qty = passeditemcount - 1;
    let tempcountincart = JSON.parse(JSON.stringify(activeSubPacks));
    tempcountincart.forEach((element, index) => {
      if (element.subproductid == productid) {
        tempcountincart[index].itemcountincart = qty;

        if (!cartCount.itemscount == 0) {
          setCartCount({
            itemscount: cartCount.itemscount - 1,
            amount: cartCount.amount,
          });
        }
      }
    });
    setActiveSubPacks(tempcountincart);
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
    if (!result.ok) {
      const qty = passeditemcount;
      let tempcountincart = JSON.parse(JSON.stringify(activeSubPacks));
      tempcountincart.forEach((element, index) => {
        if (element.subproductid == productid) {
          tempcountincart[index].itemcountincart = qty;

          if (!cartCount.itemscount == 0) {
            setCartCount({
              itemscount: cartCount.itemscount + 1,
              amount: cartCount.amount,
            });
          }
        }
      });
      setActiveSubPacks(tempcountincart);
      ToastAndroid.show(
        "Sorry an Error occured while adding",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
  };

  useEffect(() => {
    loadSearchProducts();
  }, []);

  const loadSearchProducts = async () => {
    setLoading(true);
    const searchproductsresponse = await getSearchGroceryProducts.getSearchGroceryProducts({
      key,
      search,
      jwttoken,
    });
    setProducts(searchproductsresponse.data.data);
    setLoading(false);

  };

  
  // calling NEXTSLOT Api--------------------

  const [nextSlot, setNextSlot] = useState([]);

  useEffect(() => {
    loadNextSlot();
   }, []);

  const loadNextSlot = async (displayid) => {
    
    const nextslotresponse = await getNextSlot.getNextSlot({ 
      jwttoken
    });

    setNextSlot(nextslotresponse.data[0]);
  };

  //calling subpacks ...........
  const loadSubPacks = (thumbnail, productname, subpacks) => {
    setTempThumbnail(thumbnail);
    setTempProductName(productname);
    setActiveSubPacks(subpacks);
    setnewmodal(true);
  };
  

  // calling Cartcount Api-----------------------

   const [cartCount, setCartCount] = useState({ itemscount: 0, amount: 0 });

   useEffect(() => {
     loadCartCount();
   }, []);
 
   const loadCartCount = async () => {
     const entity = "GROCERY";
     const cartcountresponse = await getCartCount.getCartCount({
       key,
       jwttoken,
       entity,
     });
 
     setCartCount(cartcountresponse.data[0]);
   };

  // closing subpack Modal--------------------------------


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
                backgroundColor: "#f07028",
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 10,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Grocery Cart")}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  {cartCount.itemscount > 1 ? (
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
                          fontFamily:"Alata_400Regular",
                          color:"white"
                        }}
                      >
                        {cartCount.itemscount} Items{" "}
                      </Text>
                    </View>
                  ) : (
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
                          fontFamily:"Alata_400Regular",
                          color:"white"
                        }}
                      >
                        {cartCount.itemscount} Item{" "}
                      </Text>
                    </View>
                  )}

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
                        fontFamily:"Alata_400Regular",
                        color:"white"
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
      <View style={styles.lable}>
        <View style={styles.lableleft}>
          <MaterialCommunityIcons
            name="clock-fast"
            color="#1fa1ab"
            size={wp(3)}
            style={{ alignSelf: "center" }}
          />
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(3),
              color: "#1fa1ab",
              marginLeft: wp(1),
              //   fontWeight: "bold",
            }}
          >
            {" "}
          {nextSlot.nextavailableslot}{" "}
          </Text>
          
        </View>
        <View style={styles.lableright}>
          <MaterialCommunityIcons
            name="van-utility"
            color="#f53214"
            size={wp(3)}
            style={{ alignSelf: "center" }}
          />
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(3),
              color: "#f53214",
              marginLeft: wp(1),
            }}
          >
            {nextSlot.deliverymessage}
          </Text>
        </View>
      </View>
      <View style={styles.bestquality}>
        <View style={styles.icon}>
          <View
            style={{
              backgroundColor: "#2fbb2f",
              borderRadius: 50,
              padding: wp(1.5),
            }}
          >
            <MaterialCommunityIcons
              name="currency-inr"
              size={wp(5.2)}
              color="white"
            />
          </View>
        </View>
        <View style={styles.text}>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(4),
              fontWeight: "900",
            }}
          >
            Assured Quality Items 
          </Text>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(3),
              color: "#48494B",
              marginTop: hp(0.5),
              textAlign: "left",
            }}
          >
            Buy More Save More
          </Text>
        </View>
      </View>
      {/* <View style={styles.childcategories}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(4),
              color: "#48494B",
              marginHorizontal: wp(3.5),
            }}
          >
            All
          </Text>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(4),
              color: "#48494B",
              marginHorizontal: wp(3.5),
            }}
          >
            Fash Wash
          </Text>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(4),
              color: "#48494B",
              marginHorizontal: wp(3.5),
            }}
          >
            Face Cream & Lotion
          </Text>
          <Text
            style={{
              fontFamily: "Alata_400Regular",
              fontSize: wp(4),
              color: "#48494B",
              marginHorizontal: wp(3.5),
            }}
          >
            Face Mask & Bleach
          </Text>
        </ScrollView>
      </View> */}

      <View style={styles.container}>
        {loading == true ? (
          <>
            <ActivityIndicator
              animating={loading}
              size={35}
              color="#ffaa01"
              style={{
                justifyContent: "center",
                alignSelf: "center",
                marginTop: hp(30),
              }}
            />
            <Text
              style={{
                justifyContent: "center",
                alignSelf: "center",
                fontWeight: "bold",
                fontStyle: "italic",
                color: "grey",
              }}
            >
              "Life is so much better when you have an
            </Text>
            <Text
              style={{
                justifyContent: "center",
                alignSelf: "center",
                fontWeight: "bold",
                fontStyle: "italic",
                color: "grey",
              }}
            >
              online order on the way... "
            </Text>
          </>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            maxToRenderPerBatch={10}
            keyExtractor={(products) => products.subproductid.toString()}
            renderItem={({ item }) => (
              <GroceryProduct
                name={item.productname}
                displayid={item.mainproductid}
                subitem={item.subitem}
                offer={item.offers}
                image={item.thumbnail}
                pack={item.subproductname}
                subproductid={item.subproductid}
                itemcountincart={item.itemcountincart}
                maxalloweditems={item.maxalloweditems}
                mrp={item.mrp}
                sp={item.sp}
                pp={item.pp}
                prime={prime}
                onPressPack={() => loadSubPacks(
                  item.thumbnail,
                  item.productname,
                  item.subpackproducts
                )}
                onPressPlusButton={() =>
                  increment(item.itemcountincart, item.subproductid)
                }
                onPressMinusButton={() =>
                  decrement(item.itemcountincart, item.subproductid)
                }
                primenavigation={()=>navigation.navigate("Membership")}
              />
            )}
            ListEmptyComponent={() => <Text>No details Found</Text>}
            ListFooterComponent={()=> <View style={{height:hp(7)}} ></View> }
          />
        )}

      

        <Backgroundmodal
            isVisible={newmodal}
            deviceHeight={hp(100)}
            deviceWidth={wp(100)}
            onBackdropPress={() => setnewmodal(false)}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={200}
            animationOutTiming={300}
            useNativeDriver={true}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                backgroundColor: "white",
                width: wp(75),
              }}
            >
              <View style={{ marginVertical: hp(1.2), alignItems: "center" }}>
                <Image
                  source={{ uri: tempThumbnail }}
                  style={{ width: wp(25), height: hp(10), marginTop: hp(0.3) }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text style={{ color: "#48494B", marginVertical: hp(0.5), fontWeight:"bold" }}>
                  {tempProductName}
                </Text>
              </View>
              <FlatList
                data={activeSubPacks}
                keyExtractor={(activeSubPacks) =>
                  activeSubPacks.subproductid.toString()
                }
                renderItem={({ item }) => (
                  <Subpack
                    name={item.subproductname}
                    mrp={item.mrp}
                    sp={item.sp}
                    pp={item.pp}
                    itemcountincart={item.itemcountincart}
                    maxalloweditems={item.maxalloweditems}
                    onPressPlusButton={() =>
                      subpackincrement(item.itemcountincart, item.subproductid)
                    }
                    onPressMinusButton={() =>
                      subpackdecrement(item.itemcountincart, item.subproductid)
                    }
                  />
                )}
              />
            </View>
          </Backgroundmodal>
      </View>

      <StatusBar barStyle="dark-content" backgroundColor="#ffff" />
    </>
  );
}

const styles = StyleSheet.create({
  bestquality: {
    paddingVertical: hp(1.8),
    paddingLeft: wp(4),
    flexDirection: "row",
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.light,
  },
  Button: {
    width: wp(27),
    backgroundColor: "#f07028",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 4,
    flexDirection: "row",
  },
  childcategories: {
    // marginVertical: hp(1),
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.light,
    paddingVertical: hp(1.7),
  },
  container: {
    paddingBottom: hp(15),
  },
  details: {
    width: wp(61),
    // paddingLeft: wp(3),
  },
  diffrentiator: {
    height: hp(0.5),
    width: wp(100),
    backgroundColor: Colors.light,
    // marginTop: hp(1),
  },
  discount: {
    // marginTop: hp(1),
    backgroundColor: "#2fbb2f",
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(0.2),
    borderRadius: 5,
    marginLeft: wp(3),
  },
  halfmodalcontainer: {
    flex: 1.2,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  icon: {
    backgroundColor: "#e2ffe0",
    width: wp(15),
    height: hp(7),
    borderRadius: 8,

    justifyContent: "center",
    alignItems: "center",
  },
  lable: {
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(2),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.light,
  },
  lableright: {
    flexDirection: "row",
    flex: 1.5,
    marginLeft: wp(4),
  },
  lableleft: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
  },
  name: {
    marginTop: hp(1),
  },
  pack: {
    flexDirection: "row",
    borderWidth: 0.8,
    width: wp(27),
    paddingLeft: wp(2),
    paddingVertical: wp(1),
    borderColor: Colors.light,
    justifyContent: "space-between",
    borderRadius: 3,
  },
  packbutton: {
    marginTop: hp(1),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  product: {
    marginHorizontal: wp(2),
    width: wp(96),
    borderRadius: 5,

    borderWidth: 0.8,
    borderColor: Colors.light,
    marginTop: hp(1),
    elevation: 1.5,
    backgroundColor: "white",
  },
  productcontainer: {
    marginVertical: wp(4),
    flexDirection: "row",
    marginHorizontal: wp(3),
  },
  prices: {
    flexDirection: "row",
  },
  Prime: {
    marginTop: hp(1.5),
    backgroundColor: "#edfbfd",
    borderColor: "#1fa1ab",
    borderWidth: 0.2,
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primeprice: {
    flexDirection: "row",
  },
  text: {
    marginLeft: wp(3),
    justifyContent: "center",
  },
  unlockprice: {
    flexDirection: "row",
  },
});

export default GrocerySearchResult;
