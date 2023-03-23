import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  FlatList,
  Switch,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
// import { AppLoading } from "expo";
import ConfirmModal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../Config/Colors";
import AuthContext from "../Auth/Context";
import getServiceCart from "../Api/ServicesGetCartApi";
import InsertServiceOrder from "../Api/InsertServiceOrderApi";
import RazorpayCheckout from "react-native-razorpay";
import Promo from "../Components/Promo";
import addToCart from "../Api/AddtoCartApi";
import { useIsFocused } from "@react-navigation/native";
import getCouponCodes from "../Api/LoadCouponsApi";
import ApplyCouponCode from "../Api/ApplyCouponCodeApi";
import servicesAddToCart from "../Api/ServicesAddToCartApi";

function ServicesCart({ navigation }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const key = authContext.user.accesskey;
  const jwttoken = authContext.user.jwttoken;
  const name = authContext.user.userdetails[0].name;
  const email = authContext.user.userdetails[0].emailid;
  const phonenumber = authContext.user.userdetails[0].phonenumber;
  const address = authContext.location[0].address;
  const addressLable = authContext.location[0].addressname;
  const city = authContext.location[0].city;
  const lat = authContext.location[0].lattitude;
  const long = authContext.location[0].longittude;
  const state = authContext.location[0].state;

  const [tip, setTip] = useState(0);

  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [normalDeliveryTotal, setNormalDeliveryTotal] = useState(0);

  const [paymentGateWayAmount, setPaymentGateWayAmount] = useState(0);

  const [serviceCart, setServiceCart] = useState([]);
  const [serviceCartItems, setServiceCartItems] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [loadCart, setLoadCart] = useState(false);
  const [random, setRandom] = useState(0);
  const [paymentRefrenceNumber, setPaymentRefrenceNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("");
  const [couponValue, setCouponValue] = useState(0);
  const [loadCoupons, setLoadCoupons] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [paymentFailed, setPaymentFailed] = useState(false)
  const [tempPaymentMode, settempPaymentMode] = useState()
  const [tempOrderNumber, setTempOrderNumber] = useState()

  const increment = async (passeditemcount, productid) => {
    setLoadCart(true);
    const qty = passeditemcount + 1;
    const result = await servicesAddToCart.servicesAddToCart({
      key,
      productid,
      qty,
      jwttoken,
    });
    RemoveDiscountCoupon();
    const randnumb = Math.floor(Math.random() * 100) + 1;
    setRandom(randnumb);
    setLoadCart(false);

    if (!result.ok) {
      alert("Something Wrong Please try again");
    }
  };

  const decrement = async (passeditemcount, productid) => {
    setLoadCart(true);
    const qty = passeditemcount - 1;
    const result = await servicesAddToCart.servicesAddToCart({
      key,
      productid,
      qty,
      jwttoken,
    });
    RemoveDiscountCoupon();
    const randnumb = Math.floor(Math.random() * 100) + 1;
    setRandom(randnumb);
    setLoadCart(false);

    if (!result.ok) {
      alert("Something Wrong Please try again");
    }
  };

  useEffect(() => {
    loadGetServiceCart();
  }, [random]);

  useEffect(() => {
    totalCaliculations(serviceCart);
  }, [tip, random, couponValue]);

  const loadGetServiceCart = async () => {
    setLoading(true);
    setLoadCart(true);
    const getservicecartresponse = await getServiceCart.getServiceCart({
      key,
      lat,
      long,
      jwttoken,
    });

    setServiceCart(getservicecartresponse.data[0]);
    if (getservicecartresponse.data[0]) {
      setServiceCartItems(getservicecartresponse.data[0].perticulars);
      totalCaliculations(getservicecartresponse.data[0]);
      setLoadCart(false);
    } else {
      setServiceCartItems([]);
      setLoading(false);
      setLoadCart(false);
    }
  };

  const totalCaliculations = (data) => {
    const total = data.finaltotal;
    const deliverycharges = data.deliverycharges;

    const tempdeliverytotal = total + tip - couponValue;
    const deliverytotal = tempdeliverytotal.toFixed(2);

    setNormalDeliveryTotal(deliverytotal);
    const temppaymentGateWayAmount = deliverytotal * 100;
    setPaymentGateWayAmount(temppaymentGateWayAmount);
    setLoading(false);
  };

  const applyCoupon = async (code) => {
    setDiscountModalVisible(false);
    setLoadCart(true);
    const getapplycouponresponse = await ApplyCouponCode.applyCouponCodes({
      key,
      jwttoken,
      city,
      state,
      code,
    });
    setCouponCode(getapplycouponresponse.data[0].code);
    setCouponType(getapplycouponresponse.data[0].coupontype);
    setCouponValue(getapplycouponresponse.data[0].discountvalue);
    setStatusMessage(getapplycouponresponse.data[0].statusmessage);
    setLoadCart(false);

    if (getapplycouponresponse.data[0].status == true) {
      setDiscountSuccess(true);
    }
  };

  const RemoveDiscountCoupon = () => {
    setCouponCode("");
    setCouponType("");
    setCouponValue(0);
    setStatusMessage("");
  };

  const insertOrder = async () => {
    setViewModal(false);
    setLoadCart(true);
    const finaladdress = address + city;
    const paymentmode = "COD";
    const paymentreference = paymentRefrenceNumber;
    const couponcode = couponCode;
    const couponvalue = couponValue;

    settempPaymentMode(paymentmode)

    const insertserviceorderresponse = await InsertServiceOrder.InsertServiceOrder(
      {
        key,
        jwttoken,
        finaladdress,
        paymentmode,
        paymentreference,
        couponcode,
        couponvalue,
        lat,
        long,
        tip,
      }
    );

    if (insertserviceorderresponse.data.status == "Ok") {
      setLoadCart(false);
      setTempOrderNumber(insertserviceorderresponse.data.ordernumber);
      setOrderSuccess(true)
    } else {
      setLoadCart(false);
      alert(insertorderresponse.data.status);
    }
  };

  const tempInsertOrder = async () => {
    setViewModal(false);
    setLoadCart(true);
    const finaladdress = address + city;
    const paymentmode = "Online";
    const paymentreference = paymentRefrenceNumber;
    const couponcode = couponCode;
    const couponvalue = couponValue;

    settempPaymentMode(paymentmode)

    const insertserviceorderresponse = await InsertServiceOrder.InsertServiceOrder(
      {
        key,
        jwttoken,
        finaladdress,
        paymentmode,
        paymentreference,
        couponcode,
        couponvalue,
        lat,
        long,
        tip,
      }
    );

    if (insertserviceorderresponse.data.status == "Ok") {
      setLoadCart(false);
      setTempOrderNumber(insertserviceorderresponse.data.ordernumber);
      setOrderSuccess(true)
    } else {
      setLoadCart(false);
      alert(insertorderresponse.data.status);
    }
  };

  const insertOnlineOrder = () => {
    setViewModal(false);
    let orderamount = 1;
    orderamount = normalDeliveryTotal;
    orderamount = orderamount*100;
    var options = {
      description: "Order Purchasing",
      image: require("../assets/appicon.png") ,
      currency: "INR",

      key: "rzp_test_J4CGkUOkYo806M", // Your api key
      amount: orderamount,
      name: "Pergo",
      prefill: {
        email: email,
        contact: phonenumber,
        name: name,
      },
      theme: { color: "#ffcc00" },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        //alert("Payment Successfull")
        setPaymentRefrenceNumber(data.razorpay_payment_id)
         tempInsertOrder()
        
      })
      .catch((error) => {
        // handle failure
        // alert(
        //   `Error: ${error.code} | ${error.description}`
        // );
        //alert("Payment Failed")
        
        setPaymentFailed(true)
      });
  }

  const Navigatetoorders = () => {
    setOrderSuccess(false)
    navigation.navigate("Order Summary", {
      ordernumber: tempOrderNumber,
      payment: tempPaymentMode,
    });
    loadGetServiceCart();
  }

  const loadDiscountCoupons = async () => {
    setDiscountModalVisible(true);
    const entity = "FOOD";
    const getcouponcodesresponse = await getCouponCodes.getCouponCodes({
      key,
      jwttoken,
      city,
      state,
      entity,
    });
    setLoadCoupons(getcouponcodesresponse.data);
  };

  let [fontsLoaded, error] = useFonts({
    Alata_400Regular,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <View>
      {loadCart == true ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginVertical: hp(40),
          }}
        >
          <ActivityIndicator animating={loadCart} size={35} color="#ffaa01" />
          <Text
            style={{ color: "grey", marginTop: hp(1.5), alignSelf: "center" }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <View>
          {serviceCartItems.length > 0 ? (
            <View style={styles.container}>
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  bottom: 0,
                  left: 0,
                  height: hp(6),
                  flexDirection: "row",
                  zIndex: 10,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: "50%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Alata_400Regular",
                      fontSize: wp(4),
                      color: "#2fbb2f",
                    }}
                  >
                    To Pay : {normalDeliveryTotal}/-
                  </Text>
                </View>

                <View
                  style={{
                    width: "50%",
                    backgroundColor: "#2fbb2f",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {loadCart == true ? (
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "Alata_400Regular",
                        fontSize: wp(4),
                      }}
                    >
                      Loading...
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={() => setViewModal(true)}>
                      <Text
                        style={{
                          color: "white",
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4),
                        }}
                      >
                        CheckOut
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  <View
                    style={{
                      width: wp(95),
                      marginHorizontal: wp(2.5),
                      marginTop: wp(2.5),
                      backgroundColor: "white",
                      paddingHorizontal: wp(4.2),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "black",
                        fontSize: wp(5.5),
                      }}
                    >
                      {serviceCart.servicename}
                    </Text>
                    <Text
                      style={{ fontFamily: "Alata_400Regular", color: "grey" }}
                    >
                      {serviceCart.address}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: wp(95),
                      marginHorizontal: wp(2.5),
                      marginTop: wp(2.5),
                      backgroundColor: "white",
                      elevation: 5,
                      padding: wp(4.2),
                      borderRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "tomato",
                      }}
                    >
                      Delivering to
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "#2fbb2f",
                      }}
                    >
                      {addressLable}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "grey",
                      }}
                    >
                      {address}, {city}
                    </Text>
                  </View>
                  <View style={styles.cartsummary}>
                    <View>
                      <View style={styles.row}>
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "grey",
                          }}
                        >
                          Sub Total
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="currency-inr"
                            size={wp(3.5)}
                            style={{
                              justifyContent: "center",
                              alignSelf: "center",
                              color: "grey",
                              alignItems: "center",
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: "Alata_400Regular",
                              color: "grey",
                              alignSelf: "center",
                              justifyContent: "center",
                              fontSize: wp(3.5),
                            }}
                          >
                            {serviceCart.carttotal}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.row}>
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "grey",
                          }}
                        >
                          Delivery Charges
                        </Text>

                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="currency-inr"
                            size={wp(3.5)}
                            style={{
                              justifyContent: "center",
                              alignSelf: "center",
                              color: "grey",
                              alignItems: "center",
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: "Alata_400Regular",
                              color: "grey",
                              alignSelf: "center",
                              justifyContent: "center",
                              fontSize: wp(3.5),
                            }}
                          >
                            {serviceCart.deliverycharges}
                          </Text>
                        </View>
                      </View>
                      <View>
                        {serviceCart.taxes == 0 ? null : (
                          <View style={styles.row}>
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "grey",
                              }}
                            >
                              Taxes
                            </Text>

                            <View style={{ flexDirection: "row" }}>
                              <MaterialCommunityIcons
                                name="currency-inr"
                                size={wp(3.5)}
                                style={{
                                  justifyContent: "center",
                                  alignSelf: "center",
                                  color: "grey",
                                  alignItems: "center",
                                }}
                              />
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "grey",
                                  alignSelf: "center",
                                  justifyContent: "center",
                                  fontSize: wp(3.5),
                                }}
                              >
                                {serviceCart.taxes}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                      <View>
                        {couponValue > 0 ? (
                          <View style={styles.row}>
                            <TouchableOpacity
                              onPress={() => setDiscountSuccess(true)}
                            >
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "tomato",
                                }}
                              >
                                Discount - ({couponCode})
                              </Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "tomato",
                                  alignSelf: "center",
                                  justifyContent: "center",
                                  fontSize: wp(3.5),
                                }}
                              >
                                -{couponValue}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      </View>

                      <View>
                        {tip > 0 ? (
                          <View style={styles.row}>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "grey",
                                }}
                              >
                                Tip Added
                              </Text>
                              <TouchableOpacity onPress={() => setTip(0)}>
                                <Text
                                  style={{
                                    fontFamily: "Alata_400Regular",
                                    color: "tomato",
                                    marginLeft: wp(0.9),
                                  }}
                                >
                                  (remove)
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "grey",
                                  alignSelf: "center",
                                  justifyContent: "center",
                                  fontSize: wp(3.5),
                                }}
                              >
                                +{tip}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      </View>

                      <View
                        style={{
                          height: hp(0.2),
                          width: "100%",
                          backgroundColor: Colors.light,
                          marginTop: wp(3),
                        }}
                      ></View>
                      <View style={styles.row}>
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "grey",
                          }}
                        >
                          Total
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="currency-inr"
                            size={wp(3)}
                            style={{
                              justifyContent: "center",
                              alignSelf: "center",

                              alignItems: "center",
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: "Alata_400Regular",

                              alignSelf: "center",
                              justifyContent: "center",
                              fontSize: wp(3.5),
                              color:"black"
                            }}
                          >
                            {normalDeliveryTotal}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.tip}>
                    <View style={{ flexDirection: "row" }}>
                      {tip > 0 ? (
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            fontSize: wp(7),
                            justifyContent: "center",
                            alignSelf: "center",
                            color: "black",
                          }}
                        >
                          😍
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            fontSize: wp(7),
                            justifyContent: "center",
                            alignSelf: "center",
                            color: "black",
                          }}
                        >
                          ☹️
                        </Text>
                      )}

                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          marginLeft: wp(4),
                          alignSelf: "center",
                          fontSize: wp(3.5),
                          color: "black",
                        }}
                      >
                        Tip Your Delivery Partner
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        marginTop: wp(3),
                        fontSize: wp(3),
                        color: "black",
                      }}
                    >
                      Tip your Delivery Partner as much as you can. Even 5
                      rupees has so much potential to put smiles on their family
                      faces.
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      {/* ---------------------------5 rupees tip adding Block --------------------------------- */}

                      {tip == 5 ? (
                        <TouchableWithoutFeedback onPress={() => setTip(0)}>
                          <View style={styles.tipamountactive}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                                color: "#2fbb2f",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "#2fbb2f",
                                alignSelf: "center",
                                justifyContent: "center",
                              }}
                            >
                              5
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      ) : (
                        <TouchableWithoutFeedback onPress={() => setTip(5)}>
                          <View style={styles.tipamount}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              color={"black"}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "black",
                              }}
                            >
                              5
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                      {/* ---------------------------10 rupees tip adding Block --------------------------------- */}

                      {tip == 10 ? (
                        <TouchableWithoutFeedback onPress={() => setTip(0)}>
                          <View style={styles.tipamountactive}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                                color: "#2fbb2f",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "#2fbb2f",
                              }}
                            >
                              10
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      ) : (
                        <TouchableWithoutFeedback onPress={() => setTip(10)}>
                          <View style={styles.tipamount}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              color={"black"}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "black",
                              }}
                            >
                              10
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                      {/* ---------------------------15 rupees tip adding Block --------------------------------- */}

                      {tip == 15 ? (
                        <TouchableWithoutFeedback onPress={() => setTip(0)}>
                          <View style={styles.tipamountactive}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                                color: "#2fbb2f",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "#2fbb2f",
                              }}
                            >
                              15
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      ) : (
                        <TouchableWithoutFeedback onPress={() => setTip(15)}>
                          <View style={styles.tipamount}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              color={"black"}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "black",
                              }}
                            >
                              15
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                      {/* ---------------------------20 rupees tip adding Block --------------------------------- */}

                      {tip == 20 ? (
                        <TouchableWithoutFeedback onPress={() => setTip(0)}>
                          <View style={styles.tipamountactive}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                                color: "#2fbb2f",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "#2fbb2f",
                              }}
                            >
                              20
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      ) : (
                        <TouchableWithoutFeedback onPress={() => setTip(20)}>
                          <View style={styles.tipamount}>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              size={wp(3)}
                              color={"black"}
                              style={{
                                justifyContent: "center",
                                alignSelf: "center",
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "black",
                              }}
                            >
                              20
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: wp(3),
                      marginVertical: hp(1),
                      paddingVertical: hp(2),
                      elevation: 3,
                      borderRadius: 5,
                      backgroundColor: "white",
                      paddingHorizontal: wp(2),
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <MaterialCommunityIcons
                        name="percent"
                        size={wp(4.5)}
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                          alignItems: "center",
                          color: "#2fbb2f",
                        }}
                      />
                    </View>
                    {statusMessage ? (
                      <TouchableOpacity onPress={() => RemoveDiscountCoupon()}>
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: wp(3),
                            justifyContent: "space-between",
                          }}
                        >
                          <View>
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                fontSize: wp(4),
                                color: "grey",
                              }}
                            >
                              {statusMessage} !
                            </Text>
                            {couponValue == 0 ? null : <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                fontSize: wp(3.5),
                                color: "#2fbb2f",
                              }}
                            >
                              You saved {couponValue}rs
                            </Text> }
                          </View>
                          <Text
                            style={{
                              fontFamily: "Alata_400Regular",
                              fontSize: wp(3),
                              color: "tomato",
                              alignSelf: "center",
                              marginLeft: wp(3),
                            }}
                          >
                            (Remove)
                          </Text>
                          {/* <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={wp(4.5)}
                            style={{
                              justifyContent: "flex-end",
                              alignSelf: "flex-end",
                              alignItems: "flex-end",
                              marginLeft: wp(1),
                            }}
                          /> */}
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => loadDiscountCoupons()}>
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: wp(3),
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Alata_400Regular",
                              fontSize: wp(4),
                              color: "black",
                            }}
                          >
                            Apply Coupon
                          </Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={wp(4.5)}
                            style={{
                              justifyContent: "flex-end",
                              alignSelf: "flex-end",
                              alignItems: "flex-end",
                              marginLeft: wp(1),
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View>
                    <Text
                      style={{
                        color: "black",
                        fontFamily: "Alata_400Regular",
                        marginLeft: wp(5),
                        fontSize: wp(5),
                      }}
                    >
                      Items
                    </Text>
                  </View>
                  <FlatList
                    data={serviceCartItems}
                    keyExtractor={(serviceCartItems) =>
                      serviceCartItems.productid.toString()
                    }
                    renderItem={({ item }) => (
                      <View
                        style={{
                          marginHorizontal: wp(5),
                          marginTop: hp(1),
                          marginBottom: hp(1),
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              width: wp(60),
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "black",
                                marginLeft: wp(1.2),
                                fontSize: wp(4),
                              }}
                            >
                              {item.productname}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: hp(0.5),
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "tomato",
                                fontSize: wp(3),
                              }}
                            >
                              {item.qty}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "black",
                                marginLeft: wp(1),
                                fontSize: wp(3),
                              }}
                            >
                              x
                            </Text>
                            <MaterialCommunityIcons
                              name="currency-inr"
                              color={"grey"}
                              size={wp(3)}
                              style={{ alignSelf: "center", marginLeft: wp(1) }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "grey",
                                fontSize: wp(3),
                              }}
                            >
                              {item.price}
                            </Text>
                          </View>
                        </View>
                        <View style={{ alignSelf: "center" }}>
                          {item.qty == 0 ? (
                            <TouchableOpacity
                              style={{ alignSelf: "center" }}
                              onPress={() =>
                                increment(item.qty, item.productid)
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
                                  decrement(item.qty, item.productid)
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
                                {item.qty}
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
                                  increment(item.qty, item.productid)
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
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: hp(0.5),
                              alignSelf: "flex-end",
                            }}
                          >
                            <MaterialCommunityIcons
                              name="currency-inr"
                              color={"black"}
                              style={{ alignSelf: "center" }}
                            />
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "black",
                              }}
                            >
                              {item.subtotal}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  />

                  <View style={{ marginTop: hp(3), marginHorizontal: wp(4) }}>
                    <Text style={{ color: "tomato" }}>
                      *Orders once placed cannot be cancelled and non-refundable
                    </Text>
                  </View>

                  <View style={{ height: hp(20) }}></View>

                  <Modal visible={discountModalVisible} animationType="slide">
                    <TouchableOpacity
                      onPress={() => setDiscountModalVisible(false)}
                    >
                      <View style={styles.close}>
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={wp(8)}
                          color={"black"}
                        />
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        marginHorizontal: wp(4),
                        marginVertical: hp(1),
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: hp(2.5),
                      }}
                    >
                      <TextInput
                        placeholder="Enter Promo Code"
                        keyboardType="default"
                        style={{ marginLeft: wp(2) }}
                      />
                      <Text
                        style={{
                          color: "#2fbb2f",
                          fontFamily: "Alata_400Regular",
                        }}
                      >
                        Apply
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#edfbfd",
                        paddingVertical: wp(2),
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          marginLeft: wp(4),
                          fontSize: wp(4),
                          letterSpacing: wp(0.5),
                          color:"black"
                        }}
                      >
                        Available Coupons
                      </Text>
                    </View>

                    <FlatList
                      data={loadCoupons}
                      keyExtractor={(loadCoupons) => loadCoupons.id.toString()}
                      renderItem={({ item }) => (
                        <Promo
                          discription={item.description}
                          code={item.code}
                          condition={item.condition}
                          apply={() => applyCoupon(item.code)}
                        />
                      )}
                      ListEmptyComponent={() => <View style={{justifyContent:"center", alignItems:"center", marginTop:hp(20)}}><Text style={{fontFamily:"Alata_400Regular", }}>No Coupon codes Available right now</Text></View>}
                    />
                  </Modal>
                </View>
                <ConfirmModal
                  isVisible={viewModal}
                  deviceHeight={hp(100)}
                  deviceWidth={wp(100)}
                  onBackdropPress={() => setViewModal(false)}
                  animationIn="zoomIn"
                  animationOut="zoomOut"
                  animationInTiming={300}
                  animationOutTiming={300}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      backgroundColor: "white",
                      width: wp(85),
                      paddingVertical: hp(2),
                      paddingHorizontal: wp(3),
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Image
                        source={require("../assets/online.jpg")}
                        style={{ width: wp(35), height: hp(15) }}
                        resizeMode="contain"
                      />
                      <Image
                        source={require("../assets/cod.jpg")}
                        style={{ width: wp(35), height: hp(15) }}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4.8),
                        }}
                      >
                        Select Payment Method !
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: hp(2.5),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => insertOnlineOrder() }
                      >
                        <View
                          style={{
                            backgroundColor: "#2fbb2f",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: hp(0.7),
                            borderRadius: 7,
                            width: wp(22),
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Alata_400Regular",
                            }}
                          >
                            Pay Online
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => insertOrder()}>
                        <View
                          style={{
                            backgroundColor: "#2fbb2f",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: hp(0.7),
                            borderRadius: 7,
                            width: wp(22),
                            marginLeft: wp(4),
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Alata_400Regular",
                            }}
                          >
                            COD
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ConfirmModal>
                <ConfirmModal
                  isVisible={paymentFailed}
                  deviceHeight={hp(100)}
                  deviceWidth={wp(100)}
                  onBackdropPress={() => setPaymentFailed(false)}
                  animationIn="zoomIn"
                  animationOut="zoomOut"
                  animationInTiming={300}
                  animationOutTiming={300}
                  useNativeDriver={true}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      backgroundColor: "white",
                      width: wp(95),
                      paddingVertical: hp(2),
                      paddingHorizontal: wp(3),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <Image
                        source={require("../assets/failed.png")}
                        style={{ width: wp(35), height: hp(13) }}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4.8),
                          color:"black"
                        }}
                      >
                        Order Declined !
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4.8),
                          color:"black"
                        }}
                      >
                        due
                         to payment failure
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: hp(2.5),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setPaymentFailed(false) }
                      >
                        <View
                          style={{
                            backgroundColor: "#2fbb2f",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: hp(0.7),
                            borderRadius: 7,
                            width: wp(22),
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Alata_400Regular",
                            }}
                          >
                           Okay
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                    </View>
                  </View>
                </ConfirmModal>
                <ConfirmModal
                  isVisible={discountSuccess}
                  deviceHeight={hp(100)}
                  deviceWidth={wp(100)}
                  onBackdropPress={() => setDiscountSuccess(false)}
                  animationIn="zoomIn"
                  animationOut="zoomOut"
                  animationInTiming={300}
                  animationOutTiming={300}
                  useNativeDriver={true}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      backgroundColor: "white",
                      width: wp(85),
                      paddingVertical: hp(2),
                      paddingHorizontal: wp(3),
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/party.png")}
                        style={{ width: wp(35), height: hp(15) }}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <MaterialCommunityIcons
                          name="currency-inr"
                          size={wp(4.8)}
                          color={"black"}
                          style={{ alignSelf: "center" }}
                        />
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            fontSize: wp(4.8),
                            color: "black",
                          }}
                        >
                          {couponValue} OFF
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4.8),
                        }}
                      >
                        Yaaaaaaaaaaay Cheers!
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4),
                        }}
                      >
                        {statusMessage}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: hp(2),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setDiscountSuccess(false)}
                      >
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "tomato",
                            fontSize: wp(4),
                          }}
                        >
                          Thank You
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ConfirmModal>
                <ConfirmModal
                  isVisible={orderSuccess}
                  deviceHeight={hp(100)}
                  deviceWidth={wp(100)}
                  animationIn="zoomIn"
                  animationOut="zoomOut"
                  animationInTiming={300}
                  animationOutTiming={300}
                  useNativeDriver={true}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      backgroundColor: "white",
                      width: wp(85),
                      paddingVertical: hp(2),
                      paddingHorizontal: wp(3),
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/relax.png")}
                        style={{ width: wp(35), height: hp(15) }}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4.8),
                          marginTop:hp(1),
                          color:"black"
                        }}
                      >
                        Order Placed Successfullyyy!
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(3),
                        }}
                      >
                        Sit back and relax we will take care rest all the things
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: hp(2),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => Navigatetoorders()}
                      >
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "tomato",
                            fontSize: wp(4),
                          }}
                        >
                          Okayy Cool
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ConfirmModal>
                <ConfirmModal
                  isVisible={orderSuccess}
                  deviceHeight={hp(100)}
                  deviceWidth={wp(100)}
                  animationIn="zoomIn"
                  animationOut="zoomOut"
                  animationInTiming={300}
                  animationOutTiming={300}
                  useNativeDriver={true}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignSelf: "center",
                      backgroundColor: "white",
                      width: wp(85),
                      paddingVertical: hp(2),
                      paddingHorizontal: wp(3),
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/relax.png")}
                        style={{ width: wp(35), height: hp(15) }}
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(4.8),
                          marginTop:hp(1),
                          color:"black"
                        }}
                      >
                        Order Placed Successfullyyy!
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Alata_400Regular",
                          fontSize: wp(3),
                        }}
                      >
                        Sit back and relax we will take care rest all the things
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: hp(2),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => Navigatetoorders()}
                      >
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            color: "tomato",
                            fontSize: wp(4),
                          }}
                        >
                          Okayy Cool
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ConfirmModal>
              </ScrollView>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: hp(35),
              }}
            >
              <Image
                source={require("../assets/orderhistory.jpg")}
                style={{ height: hp(20), width: wp(50) }}
                resizeMode="center"
              />
              <Text style={{ marginTop: wp(4) }}>
                You have no items in your Cart {name}
              </Text>
              <Text
                style={{
                  marginTop: wp(1),
                  color: "grey",
                  fontStyle: "italic",
                  marginBottom: wp(4),
                }}
              >
                Lets gets you started
              </Text>
              {/* <TouchableOpacity onPress={() => navigation.navigate("Grocery")}>
                <View
                  style={{
                    backgroundColor: "#f07028",
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(0.8),
                    borderRadius: 3,
                    height:hp(4)
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold", }}>
                    Order Now
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartsummary: {
    width: wp(95),
    marginHorizontal: wp(2.5),
    marginVertical: wp(2.5),
    backgroundColor: "white",
    elevation: 5,
    padding: wp(4.2),
    borderRadius: 5,
  },
  close: {
    paddingVertical: hp(1),
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingRight: wp(2),
  },
  dateandslot: {
    width: wp(95),
    marginHorizontal: wp(2.5),
    marginBottom: wp(2.5),
    backgroundColor: "white",
    elevation: 5,
    padding: wp(4.2),
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: wp(1),
  },
  tip: {
    width: wp(95),
    marginHorizontal: wp(2.5),
    marginBottom: wp(2),
    backgroundColor: "#caffba",
    elevation: 5,
    padding: wp(4.2),
    borderRadius: 5,
  },
  tipamount: {
    flexDirection: "row",
    borderColor: "white",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 5,
    marginTop: hp(2.2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  tipamountactive: {
    flexDirection: "row",
    borderColor: "#2fbb2f",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 5,
    marginTop: hp(2.2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
});

export default ServicesCart;
