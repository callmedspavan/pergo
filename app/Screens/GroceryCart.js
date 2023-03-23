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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from "../Config/Colors";
import CartProducts from "../Components/CartProducts";
import getSlots from "../Api/SlotsApi";
import Slot from "../Components/Slot";
import AuthContext from "../Auth/Context";
import getGroceryCart from "../Api/GroceryGetCartApi";
import InsertGroceryOrder from "../Api/InsertGroceryOrderApi";
import RazorpayCheckout from "react-native-razorpay";
import Promo from "../Components/Promo";
import addToCart from "../Api/AddtoCartApi";
import getCouponCodes from "../Api/LoadCouponsApi";
import { useIsFocused } from "@react-navigation/native";
import ApplyCouponCode from "../Api/ApplyCouponCodeApi";


const temppromo = [
  {
    id: "1",
    discription: "Free Deliveries on Orders 150 and above",
    code: "PERGO20",
    condition: "Valid on orders above 159/-",
  },
  {
    id: "2",
    discription: "Get 30% OFF upto Rs 75",
    code: "CRICKET",
    condition: "Valid on orders above 159/-",
  },
  {
    id: "3",
    discription: "Get 20% OFF upto Rs 1000",
    code: "SAVEBIG",
    condition: "Valid on orders of 350/- and above",
  },
];

function GroceryCart({ navigation }) {
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const key = authContext.user.accesskey;
  const jwttoken = authContext.user.jwttoken;
  const name = authContext.user.userdetails[0].name;
  const address = authContext.location[0].address;
  const addressLable = authContext.location[0].addressname;
  const city = authContext.location[0].city;
  const state = authContext.location[0].state
  const lat = authContext.location[0].lattitude;
  const long = authContext.location[0].longittude;
  const email = authContext.user.userdetails[0].emailid;
  const phonenumber = authContext.user.userdetails[0].phonenumber;

  const [tip, setTip] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState();
  const [slots, Setslots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState();
  const [fastDelivery, setFastDelivery] = useState(false);
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [normalDeliveryTotal, setNormalDeliveryTotal] = useState(0);
  const [fastDeliveryTotal, setFastDeliveryTotal] = useState(0);
  const [deductedWalletAmount, setDeductedWalletAmount] = useState(0);
  const [discountSuccess, setDiscountSuccess] = useState(false);


  const [groceryCart, setGroceryCart] = useState([]);
  const [groceryCartItems, setGroceryCartItems] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false)
  const [loadCart, setLoadCart] = useState(false);
  const [random, setRandom] = useState(0);
  const [paymentRefrenceNumber, setPaymentRefrenceNumber] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [couponCode, setCouponCode] = useState("");
  const [couponType, setCouponType] = useState("");
  const [couponValue, setCouponValue] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");


  const [loadCoupons, setLoadCoupons] = useState([]);
  const [paymentGateWayAmount, setPaymentGateWayAmount] = useState(0);
  const [tempPaymentMode, settempPaymentMode] = useState()
  const [tempOrderNumber, setTempOrderNumber] = useState()

  const increment = async (passeditemcount, productid) => {
    setLoadCart(true);
    const qty = passeditemcount + 1;
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
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
    const result = await addToCart.addToCart({ key, productid, qty, jwttoken });
    const randnumb = Math.floor(Math.random() * 100) + 1;
    setRandom(randnumb);
    setLoadCart(false);
    if (!result.ok) {
      alert("Something Wrong Please try again");
    }
  };

  useEffect(() => {
    loadGetGroceryCart();
  }, [random, isFocused]);

  useEffect(() => {
    totalCaliculations(groceryCart);
  }, [tip, fastDelivery, useWallet, random, couponValue]);

  const loadGetGroceryCart = async () => {
    setLoading(true);
    setLoadCart(true);
    const getgrocerycartresponse = await getGroceryCart.getGroceryCart({
      key,
      jwttoken,
    });

    setGroceryCart(getgrocerycartresponse.data[0]);
    if (getgrocerycartresponse.data[0].perticulars) {
      setGroceryCartItems(getgrocerycartresponse.data[0].perticulars);
      totalCaliculations(getgrocerycartresponse.data[0]);
      setLoadCart(false);
    } else {
      setGroceryCartItems([]);
      setLoading(false);
      setLoadCart(false);
    }
  };

  const totalCaliculations = (data) => {
    const wallet = data.walletamount;
    const tenpercvalue = (data.subtotal * 10) / 100;
    const roundedtenpercvalue = tenpercvalue.toFixed(2);

    let deductedwalletamount = 0;

    if (useWallet) {
      if (roundedtenpercvalue > wallet) {
        deductedwalletamount = wallet;
        setDeductedWalletAmount(deductedwalletamount);
      } else {
        deductedwalletamount = roundedtenpercvalue;
        setDeductedWalletAmount(deductedwalletamount);
      }
    } else {
      deductedwalletamount = 0;
      setDeductedWalletAmount(deductedwalletamount);
    }

    const total = data.total;
    const normaldeliverycharges = data.normaldeliverycharges;
    const fastdeliverycharges = data.fastdeliverycharges;

    const tempfastdeliverytotal =
      total -
      normaldeliverycharges +
      fastdeliverycharges +
      tip -
      deductedwalletamount-couponValue;
    const fastdeliverytotal = tempfastdeliverytotal.toFixed(2);
    setFastDeliveryTotal(fastdeliverytotal);
    const tempnormaldeliverytotal = total + tip - deductedwalletamount-couponValue;
    const normaldeliverytotal = tempnormaldeliverytotal.toFixed(2);
    setNormalDeliveryTotal(normaldeliverytotal);
    setLoading(false);
  };

  const toggleSwitch = () => setFastDelivery((previousState) => !previousState);

  let controllDate = new Date();
  controllDate;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = async (date) => {
    let finalDate = date.toLocaleDateString();
    setDate(finalDate);

    const slotsresponse = await getSlots.getSlots({ finalDate, jwttoken });

    if (!slotsresponse.ok) return alert("Something Went wrong");

    let response = slotsresponse.data;
    for (let i = 0; i < response.length; i++) {
      if (i == 0) {
        response[i].isSelected = true;
        setSelectedSlot(response[i].time);
      } else {
        response[i].isSelected = false;
      }
    }

    Setslots(response);

    hideDatePicker();
  };

  const updateSelected = (index) => {
    let temp = JSON.parse(JSON.stringify(slots));
    for (let i = 0; i < temp.length; i++) {
      if (i == index) {
        temp[i].isSelected = true;
        setSelectedSlot(temp[i].time);
      } else {
        temp[i].isSelected = false;
      }
    }
    Setslots(temp);
  };

  const insertOrder = async () => {
    setViewModal(false);
    setLoadCart(true);
    const finaladdress = address + city;
    const paymentmode = "COD";
    const entity = "GROCERY";
    let orderamount = 0;
    if (fastDelivery) {
      orderamount = fastDeliveryTotal;
    } else {
      orderamount = normalDeliveryTotal;
    }

    settempPaymentMode(paymentmode)
    const insertorderresponse = await InsertGroceryOrder.InsertGroceryOrder({
      key,
      jwttoken,
      finaladdress,
      paymentmode,
      date,
      selectedSlot,
      entity,
      long,
      orderamount,
      lat,
      paymentRefrenceNumber,
      couponCode,
      couponValue,
      couponType,
      deductedWalletAmount,
      fastDelivery,
      tip,
    });

    if (insertorderresponse.data.statu == "Ok") {
      setLoadCart(false);
      setTempOrderNumber(insertorderresponse.data.ordernumber);
      setOrderSuccess(true)
    } else {
      setLoadCart(false);
      alert(insertorderresponse.data.statu);
    }
  };

  const tempInsertOrder = async () => {
    setViewModal(false);
    setLoadCart(true);
    const finaladdress = address + city;
    const paymentmode = "Online";
    const entity = "GROCERY";
    let orderamount = 0;
    if (fastDelivery) {
      orderamount = fastDeliveryTotal;
    } else {
      orderamount = normalDeliveryTotal;
    }

    settempPaymentMode(paymentmode)
    const insertorderresponse = await InsertGroceryOrder.InsertGroceryOrder({
      key,
      jwttoken,
      finaladdress,
      paymentmode,
      date,
      selectedSlot,
      entity,
      long,
      orderamount,
      lat,
      paymentRefrenceNumber,
      couponCode,
      couponValue,
      couponType,
      deductedWalletAmount,
      fastDelivery,
      tip,
    });

    if (insertorderresponse.data.statu == "Ok") {
      setLoadCart(false);
      setTempOrderNumber(insertorderresponse.data.ordernumber);
      setOrderSuccess(true)
    } else {
      setLoadCart(false);
      alert(insertorderresponse.data.statu);
    }
  };

  const insertOnlineOrder = () => {
    setViewModal(false);
    let orderamount = 1;
    if (fastDelivery) {
      orderamount = fastDeliveryTotal;
    } else {
      orderamount = normalDeliveryTotal;
    }
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
        // handle success
        // alert(`Success: ${data.razorpay_payment_id}`);
        alert("Payment Successfull")
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
    loadGetGroceryCart();
  }

  const loadDiscountCoupons = async () => {
    setDiscountModalVisible(true);
    const entity = "Grocery";
    const getcouponcodesresponse = await getCouponCodes.getCouponCodes({
      key,
      jwttoken,
      city,
      state,
      entity,
    });
    setLoadCoupons(getcouponcodesresponse.data);
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
          {groceryCartItems.length > 0 ? (
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
                    To Pay :{" "}
                    {fastDelivery ? fastDeliveryTotal : normalDeliveryTotal}/-
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
                    <TouchableOpacity
                      onPress={() => {
                        (date && selectedSlot) || fastDelivery
                          ? setViewModal(true)
                          : alert("Please Select Date and Slot");
                      }}
                    >
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
                        color:"#2fbb2f"
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
                            {groceryCart.subtotal}
                          </Text>
                        </View>
                      </View>
                      <View>
                        {groceryCart.walletamount == 0 ? null : (
                          <View style={styles.row}>
                            <View style={{ flexDirection: "row" }}>
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "grey",
                                }}
                              >
                                Pay from Wallet ({groceryCart.walletamount})
                              </Text>
                              {useWallet == true ? (
                                <TouchableOpacity
                                  onPress={() => setUseWallet(false)}
                                >
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
                              ) : (
                                <TouchableOpacity
                                  onPress={() => setUseWallet(true)}
                                >
                                  <Text
                                    style={{
                                      fontFamily: "Alata_400Regular",
                                      color: "#2fbb2f",
                                      marginLeft: wp(0.9),
                                    }}
                                  >
                                    (Use)
                                  </Text>
                                </TouchableOpacity>
                              )}
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
                                -{deductedWalletAmount}
                              </Text>
                            </View>
                          </View>
                        )}
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
                        {fastDelivery ? (
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "#2fbb2f",
                                alignSelf: "center",
                                justifyContent: "center",
                                fontSize: wp(3.5),
                              }}
                            >
                              {groceryCart.fastdeliverycharges}
                            </Text>
                          </View>
                        ) : (
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                fontFamily: "Alata_400Regular",
                                color: "#2fbb2f",
                                alignSelf: "center",
                                justifyContent: "center",
                                fontSize: wp(3.5),
                              }}
                            >
                              {groceryCart.normaldeliverycharges}
                            </Text>
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
                            color: "black",
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
                              color:"black",
                              alignSelf: "center",
                              justifyContent: "center",
                              fontSize: wp(3.5),
                            }}
                          >
                            {fastDelivery
                              ? fastDeliveryTotal
                              : normalDeliveryTotal}
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
                          color:"black"

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
                            color:"black"
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
                                color:"black"
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
                                color:"black"

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
                                color:"black"

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
                                color:"black"
                              }}
                            >
                              20
                            </Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )}
                    </View>
                  </View>
                  <View>
                    {fastDelivery == true ? null : (
                      <View style={styles.dateandslot}>
                        <View style={{ flexDirection: "row" }}>
                          <MaterialCommunityIcons
                            name="calendar-clock"
                            size={wp(4)}
                            style={{ alignSelf: "center", color: "red" }}
                          />
                          <Text
                            style={{
                              fontFamily: "Alata_400Regular",
                              marginLeft: wp(2),
                              fontSize: wp(4),
                              color:"black"
                            }}
                          >
                            When do you want the order?
                          </Text>
                        </View>
                        {date ? (
                          <View
                            style={{ marginTop: hp(1.5), flexDirection: "row" }}
                          >
                            <TouchableOpacity onPress={showDatePicker}>
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color:"black"
                                }}
                              >
                                {date}
                              </Text>
                            </TouchableOpacity>
                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={wp(4)}
                              style={{ color: "red", alignSelf: "center" }}
                            />
                          </View>
                        ) : (
                          <View
                            style={{ marginTop: hp(1.5), flexDirection: "row" }}
                          >
                            <TouchableOpacity onPress={showDatePicker}>
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "grey",
                                }}
                              >
                                Select Date
                              </Text>
                            </TouchableOpacity>
                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={wp(4)}
                              style={{ color: "red", alignSelf: "center" }}
                            />
                          </View>
                        )}
                        {date ? (
                          <FlatList
                            data={slots}
                            keyExtractor={(slots) => slots.time.toString()}
                            renderItem={({ item, index }) => (
                              <Slot
                                timeslot={item.timeslot}
                                selectedslot={item.isSelected}
                                onpress={() => updateSelected(index)}
                              />
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={() => (
                              <Text
                                style={{
                                  fontFamily: "Alata_400Regular",
                                  color: "grey",
                                  marginTop: hp(1),
                                }}
                              >
                                Sorry no slots Available please select the next
                                date
                              </Text>
                            )}
                          />
                        ) : null}

                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          minimumDate={controllDate}
                          mode="date"
                          onConfirm={handleConfirm}
                          onCancel={hideDatePicker}
                        />
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      alignItems: "flex-start",
                      flexDirection: "row",
                      marginHorizontal: wp(3),
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Alata_400Regular",
                        color: "tomato",
                      }}
                    >
                      I need it quickly (Fast Delivery)
                    </Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#595959" }}
                      thumbColor={fastDelivery ? "#ffcc00" : "#f4f3f4"}
                      onValueChange={toggleSwitch}
                      value={fastDelivery}
                    />
                  </View>
                  <View>
                    {fastDelivery ? (
                      <View
                        style={{
                          marginHorizontal: wp(3),
                          borderColor: "#ffcc00",
                          borderWidth: 3,
                          paddingTop: hp(1),
                          paddingBottom:hp(1.2),
                          paddingHorizontal: wp(2),
                          // borderTopLeftRadius: 25,
                          // borderBottomRightRadius: 25,
                          marginVertical: hp(1),
                          backgroundColor: "#fae6ce",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Alata_400Regular",
                            fontSize: wp(3.5),
                            color:"black"
                          }}
                        >
                          This order is going to be
                          delivered within a hour
                        </Text>
                      </View>
                    ) : null}
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

                  <FlatList
                    data={groceryCartItems}
                    keyExtractor={(groceryCartItems) =>
                      groceryCartItems.productid.toString()
                    }
                    renderItem={({ item }) => (
                      <CartProducts
                        name={item.productname}
                        image={item.thumbnail}
                        qty={item.qty}
                        pack={item.subcategoryname}
                        mrp={item.price}
                        sp={item.total}
                        onPressPlusButton={() =>
                          increment(item.qty, item.productid)
                        }
                        onPressMinusButton={() =>
                          decrement(item.qty, item.productid)
                        }
                      />
                    )}
                    ListFooterComponent={
                      <View style={{ height: hp(7) }}></View>
                    }
                  />

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
                      <View style={{borderBottomWidth:1, borderColor:"black",width:wp(70)}}> 
                      <TextInput
                        placeholder="Enter Promo Code"
                        keyboardType="default"
                        style={{ marginLeft: wp(2) }}
                      />
                      </View>
                      <Text
                        style={{
                          color: "#2fbb2f",
                          fontFamily: "Alata_400Regular",
                          alignSelf:"center"
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
                      keyExtractor={(temppromo) => temppromo.id.toString()}
                      renderItem={({ item }) => (
                        <Promo
                          discription={item.description}
                          code={item.code}
                          condition={item.condition}
                          apply={() => applyCoupon(item.code)}
                        />
                      )}
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
                        source={require("../assets/cod.jpg")}
                        style={{ width: wp(35), height: hp(15) }}
                        resizeMode="contain"
                      />
                      <Image
                        source={require("../assets/online.jpg")}
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
                          color:"black"
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

export default GroceryCart;
