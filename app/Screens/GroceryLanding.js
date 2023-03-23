import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Button,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Swiper from "react-native-swiper";
import Backgroundmodal from "react-native-modal";
import Colors from "../Config/Colors";
import GetBanners from "../Api/GetBannersApi";
import Category from "../Components/Category";
import getCategories from "../Api/CategoriesApi";
import getSubCategories from "../Api/SubCategoriesApi";
import getBestsellers from "../Api/BestsellersApi";
import BestSelling from "../Components/BestSelling";
import AuthContext from "../Auth/Context";
import SubCategory from "../Components/SubCategory";
import Subpack from "../Components/Subpacks";
import addToCart from "../Api/AddtoCartApi";
import getCartCount from "../Api/CartCountApi";
import { useIsFocused } from "@react-navigation/native";

function GroceryLanding({ navigation }) {
  const isFocused = useIsFocused();

  const authContext = useContext(AuthContext);
  const key = authContext.user.accesskey;
  const jwttoken = authContext.user.jwttoken;
  const prime = authContext.user.userdetails[0].prime;
  const city = authContext.user.userdetails[0].city;
  const state = authContext.user.userdetails[0].state;

  const [modalVisable, setModalVisable] = useState(false);
  const [activeSubPacks, setActiveSubPacks] = useState([]);
  const [newmodal, setnewmodal] = useState(false);
  const [tempThumnail, setTempThumbnail] = useState(null);
  const [tempProductName, setTempProductName] = useState(null);

  const loadSubPacks = (thumbnail, productname, subpacks) => {
    setTempThumbnail(thumbnail);
    setTempProductName(productname);
    setActiveSubPacks(subpacks);
    setnewmodal(true);
  };

  const increment = async (passeditemcount, productid) => {
    const qty = passeditemcount + 1;
    let tempcountincart = JSON.parse(JSON.stringify(bestSelling));
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
    setBestSelling(tempcountincart);
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
    if (!result.ok) {
      const qty = passeditemcount;
      let tempcountincart = JSON.parse(JSON.stringify(bestSelling));
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
      setBestSelling(tempcountincart);
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
    let tempcountincart = JSON.parse(JSON.stringify(bestSelling));
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
    setBestSelling(tempcountincart);
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
    if (!result.ok) {
      const qty = passeditemcount;
      let tempcountincart = JSON.parse(JSON.stringify(bestSelling));
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
      setBestSelling(tempcountincart);
      ToastAndroid.show(
        "Sorry an Error occured while adding",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
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
              itemscount: cartCount.itemscount - 1,
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

  const navigateToProducts = (subcatid, subcatname) => {
    navigation.navigate("View Products", {
      subcatid: subcatid,
      key: key,
      name: subcatname,
    });
    closeModal();
  };

  // const navigateToProducts = (subcatid, subcatname) => {
  //   let tempJson={
  //     subcatid: subcatid,
  //     name: subcatname,
  //  }
  //   let hai=JSON.parse(tempJson);
  //   navigation.navigate("View Products", {
  //     key: key,
  //     ...hai
  //   });
  //   closeModal();
  // };

  // calling CATEGORIES Api-----------------------

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {

    const categoriesresponse = await getCategories.getCategories({
      key,
      jwttoken,
    });
    if (!categoriesresponse.ok) return alert(categoriesresponse.problem);
    setCategories(categoriesresponse.data);
  };

  // calling BESTSELLING Api-----------------------

  const [bestSelling, setBestSelling] = useState([]);

  useEffect(() => {
    loadBestSelling();
  }, [isFocused]);

  const loadBestSelling = async () => {
    const bestsellingresponse = await getBestsellers.getBestsellers({
      key,
      jwttoken,
    });
    setBestSelling(bestsellingresponse.data);
  };

  // calling Cartcount Api-----------------------

  const [cartCount, setCartCount] = useState({ itemscount: 0, amount: 0 });

  useEffect(() => {
    loadCartCount();
  }, [isFocused]);

  const loadCartCount = async () => {
    const entity = "GROCERY";
    const cartcountresponse = await getCartCount.getCartCount({
      key,
      jwttoken,
      entity,
    });

    setCartCount(cartcountresponse.data[0]);
  };

  //calling Banners Api

  const [mainBanner, setMainBanner] = useState([]);
  const [second, setSecond] = useState([]);
  const [bestSellingBanner, setBestsellingBanner] = useState([]);
  const [bestSellingDown1, setBestSellingDown1] = useState([]);
  const [subCategory1, setSubCategory1] = useState([]);
  const [subCategory2, setSubCategory2] = useState([]);
  const [subCategory3, setSubCategory3] = useState([]);
  const [subCategoryMod, setSubCategoryMod] = useState([])
  const [categoryDown, setCategoryDown] = useState([])

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true)
    const entity = "GROCERY";
    const screenname = "Grocery_Landing_Screen";
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
      if (assignbanner[i].sectionname == "Main_Banners") {
        setMainBanner(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Second") {
        setSecond(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Best_Selling") {
        setBestsellingBanner(assignbanner[i].childbanners[0]);
      }
      if (assignbanner[i].sectionname == "Best_Selling_Down1") {
        setBestSellingDown1(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Sub_category1") {
        setSubCategory1(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Sub_category2") {
        setSubCategory2(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Sub_category3") {
        setSubCategory3(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Subcategorymod") {
        setSubCategoryMod(assignbanner[i].childbanners);
      }
      if (assignbanner[i].sectionname == "Category_Down") {
        setCategoryDown(assignbanner[i].childbanners);
      }
    }

    setLoading(false)

  };

  // calling SUBCATEGORIES Api-----------------------

  const [sCategories, setSCategories] = useState([]);
  const [scLoading, setScLoading] = useState(false);

  // useEffect(() => {
  //   loadSubCategories();
  // }, []);

  const loadSubCategories = async (catid) => {
    setScLoading(true);
    setModalVisable(true);
    const subcategoriesresponse = await getSubCategories.getSubCategories({
      catid,
      jwttoken,
    });

    setSCategories(subcategoriesresponse.data);
    setScLoading(false);
  };

  // closing Modal--------------------------------

  const closeModal = () => {
    setSCategories(null);
    setModalVisable(false);
  };

  const mappedMainBanners = () => {
    return mainBanner.map((item) => {
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
            style={{ width: wp(100), height: hp(21) }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };

  const mappedSecond = () => {
    return second.map((item) => {
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
              width: wp(100),
              height: hp(11.5),
              marginVertical: wp(1.2),
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };
  const mappedSubCategory1 = () => {
    return subCategory1.map((item) => {
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
              width: wp(100),
              marginTop: wp(1),
              height: hp(11.5),
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };
  const mappedSubCategory2 = () => {
    return subCategory2.map((item) => {
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
              source={{uri:item.thumbnail}}
              style={{ width: wp(100), height: hp(21), marginTop: wp(1) }}
              resizeMode="cover"
            />
        </TouchableOpacity>
      );
    });
  };

  const mappedSubCategory3 = () => {
    return subCategory3.map((item) => {
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
              width: wp(100),
              marginTop: wp(1),
              height: hp(11.5),
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };
  const mappedSubCategoryMod = () => {
    return subCategoryMod.map((item) => {
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
                source={{uri: item.thumbnail}}
                style={{
                  width: wp(94),
                  height: hp(16),
                  borderTopLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}
                resizeMode="cover"
              />
        </TouchableOpacity>
      );
    });
  };
 
  const mappedCategoryDown = () => {
    return categoryDown.map((item) => {
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
            style={{ width: wp(100), height: hp(21), marginBottom:hp(0.8) }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <>
      {loading == true ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator animating={loading} size={35} color="#ffaa01" />
          <Text style={{ color: "grey" }}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {cartCount.itemscount > 0 ? (
            <View
              style={{
                backgroundColor: "#ffaa01",
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
              <TouchableOpacity
                onPress={() => navigation.navigate("Grocery Cart")}
              >
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
                          color:"black"
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
                          color:"black"
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
                        color:"black"

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

          <View style={styles.searchbar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Grocery Search")}
            >
              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons name="magnify" size={20} color="grey" />
                <Text
                  style={{
                    marginLeft: wp(2),
                    fontSize: wp(3.5),
                    color: "grey",
                  }}
                >
                  Search for what you are looking...?                                           
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.banner}>
              <Swiper
                height={hp(21)}
                autoplay={true}
                removeClippedSubviews={false}
                autoplayTimeout={2}
                showsPagination={false}
              >
                {mappedMainBanners()}
              </Swiper>
            </View>
            <View>
              <Swiper
                height={hp(12.7)}
                autoplay={true}
                removeClippedSubviews={false}
                autoplayTimeout={2}
                showsPagination={false}
              >
                {mappedSecond()}
              </Swiper>
            </View>

            <View style={styles.bestsellingitems}>
              {/* <View style={styles.title}>
              <Text
                style={{
                  fontSize: wp(6),
                  fontWeight: "bold",
                  letterSpacing: wp(1),
                  color: "#282828",
                }}
              >
                BEST SELLING ITEMS
              </Text>
            </View> */}
              <Image
                source={{ uri: bestSellingBanner.thumbnail }}
                style={{ width: wp(100), height: hp(8) }}
                resizeMode="cover"
              />
              <View style={styles.body}>
                <FlatList
                  data={bestSelling}
                  keyExtractor={(bestSelling) =>
                    bestSelling.subproductid.toString()
                  }
                  renderItem={({ item }) => (
                    <BestSelling
                      name={item.productname}
                      mrp={item.mrp}
                      sp={item.sp}
                      pp={item.pp}
                      pack={item.subproductname}
                      offer={item.offers}
                      image={item.thumbnail}
                      subitem={item.subitem}
                      prime={prime}
                      itemcountincart={item.itemcountincart}
                      maxalloweditems={item.maxalloweditems}
                      onPressPack={() =>
                        loadSubPacks(
                          item.thumbnail,
                          item.productname,
                          item.subpackproducts
                        )
                      }
                      onPressPlusButton={() =>
                        increment(item.itemcountincart, item.subproductid)
                      }
                      onPressMinusButton={() =>
                        decrement(item.itemcountincart, item.subproductid)
                      }
                    />
                  )}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
            <View style={styles.horizontalbanners}>
              <FlatList
                data={bestSellingDown1}
                keyExtractor={(bestSellingDown1) =>
                  bestSellingDown1.id.toString()
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
                      style={styles.hbanners}
                      resizeMode="stretch"
                    />
                  </TouchableOpacity>
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <Swiper
              height={hp(11.5)}
              autoplay={true}
              removeClippedSubviews={false}
              autoplayTimeout={2}
              showsPagination={false}
            >
              {mappedSubCategory1()}
            </Swiper>
            <Swiper
              height={hp(21)}
              autoplay={true}
              removeClippedSubviews={false}
              autoplayTimeout={2}
              showsPagination={false}
            >
              {mappedSubCategory2()}
            </Swiper>
            <Swiper
              height={hp(11.5)}
              autoplay={true}
              removeClippedSubviews={false}
              autoplayTimeout={2}
              showsPagination={false}
            >
              {mappedSubCategory3()}
            </Swiper>
            
            <View style={styles.categories}>
              <View style={styles.categorytitle}>
                <Text style={{ fontSize: wp(5), fontWeight: "bold", color:"black" }}>
                  Categories For You
                </Text>
              </View>
              <View style={styles.categorybody}>
                <View style={styles.categorybodycontainer}>
                  <FlatList
                    data={categories}
                    keyExtractor={(categories) => categories.catid.toString()}
                    renderItem={({ item }) => (
                      <Category
                        name={item.categoryname}
                        image={item.catimage}
                        discount={item.catdiscount}
                        onPress={() => loadSubCategories(item.catid)}
                      />
                    )}
                    numColumns={3}
                  />
                </View>
              </View>
            </View>

            {mappedCategoryDown()}
            <View>{cartCount.itemscount > 0 ? <View style={{height:hp(6)}} ></View> : null}</View>

          </ScrollView>

          {/* Subcategories Modal start--------------------------------------------------------------- */}

          <Modal visible={modalVisable} animationType="slide" borderRadius={5}>
            <TouchableOpacity onPress={() => closeModal()}>
              <View style={styles.close}>
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={wp(8)}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.scbanner}>
            {/* <Swiper
                height={hp(16)}
                autoplay={true}
                removeClippedSubviews={false}
                autoplayTimeout={2}
                showsPagination={false}
              >
                {mappedSubCategoryMod()}
              </Swiper> */}
              {mappedSubCategoryMod()}
              
            </View>
            {/* subcategories */}

            <View style={{}}>
              {/* subcategorytitle */}
              <View style={{ marginVertical: hp(1.5), marginLeft: wp(3) }}>
                <Text style={{ fontWeight: "bold", fontSize: wp(5), color:"black" }}>
                  Sub Categories
                </Text>
              </View>
              {/* subcategorybody */}
              {scLoading == true ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginTop: hp(30),
                  }}
                >
                  <ActivityIndicator
                    animating={scLoading}
                    size={35}
                    color="#ffaa01"
                  />
                  <Text style={{ color: "grey", marginTop: hp(2) }}>
                    Loading...
                  </Text>
                </View>
              ) : (
                <View
                  style={{ marginVertical: hp(1), marginHorizontal: wp(3) }}
                >
                  {/* subcategorybodycontainer */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* subcategorydiv */}
                    <FlatList
                      data={sCategories}
                      keyExtractor={(sCategories) =>
                        sCategories.subcatid.toString()
                      }
                      renderItem={({ item }) => (
                        <SubCategory
                          name={item.subcategoryname}
                          image={item.subcatimage}
                          discount={item.subcatdiscount}
                          onPress={() =>
                            navigateToProducts(
                              item.subcatid,
                              item.subcategoryname
                            )
                          }
                        />
                      )}
                      numColumns={3}
                    />
                  </View>
                </View>
              )}
            </View>
          </Modal>

          <Backgroundmodal
            isVisible={newmodal}
            deviceHeight={hp(100)}
            deviceWidth={wp(100)}
            onBackdropPress={() => setnewmodal(false)}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={500}
            animationOutTiming={500}
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
                  source={{ uri: tempThumnail }}
                  style={{ width: wp(25), height: hp(10), marginTop: hp(0.3) }}
                  resizeMode="contain"
                />
              </View>
              <View>
                <Text
                  style={{
                    color: "#48494B",
                    marginVertical: hp(0.5),
                    fontWeight: "bold",
                    color: "black"
                  }}
                >
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
      )}

      <StatusBar barStyle="dark-content" backgroundColor="#ffff" />
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: wp(0),
  },
  bestsellingitems: {
    marginTop: hp(0),
    backgroundColor: "#ffaa01",
  },

  box: {
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 5,
    borderWidth: wp(0.2),
    borderColor: "#dddddd",
    width: wp(50),
    padding: wp(3.5),
    // marginBottom: hp(1),
    marginTop: hp(1),
  },
  button: {
    backgroundColor: "#ffcc00",
    paddingVertical: hp(0.7),
    marginTop: hp(1.7),
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  categorytitle: {
    marginVertical: hp(2),
    marginLeft: wp(3),
  },
  categorybody: {
    marginVertical: hp(1),
    marginHorizontal: wp(3),
  },
  categorybodycontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  container: {
    marginBottom: hp(6),
    position: "relative",
  },
  close: {
    paddingVertical: hp(1),
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: wp(2),
  },
  discount: {
    marginTop: hp(1),
    backgroundColor: "#2fbb2f",
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(0.5),
    borderRadius: 5,
  },
  diffrentiator: {
    height: hp(0.8),
    width: wp(100),
    backgroundColor: Colors.light,
    marginTop: hp(1),
  },
  halfmodalcontainer: {
    flex: 1.3,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  hbanners: {
    width: wp(90),
    height: hp(20.9),
    borderRadius: 3,
    marginLeft: wp(2),
  },
  horizontalbanners: {
    // height: hp(28),
    marginTop: wp(2),
  },
  item: {
    marginLeft: wp(2.5),
    marginBottom: hp(2),
  },
  price: {
    paddingLeft: wp(2.5),
    alignItems: "flex-start",
    justifyContent: "center",
  },
  row1: {
    flexDirection: "row",
  },
  row2: {
    marginTop: hp(1),
  },
  searchbar: {
    marginBottom: hp(0.8),
    marginHorizontal: wp(1),
    backgroundColor: "white",
    elevation: 5,
    padding: hp(1.3),
    borderRadius: 5,
    flexDirection: "row",
  },
  scbanner: {
    marginHorizontal: wp(3),
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.5),
    marginBottom: hp(0.3),
  },
});

export default GroceryLanding;
