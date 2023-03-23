import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";

import MapView, { Polyline } from "react-native-maps";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../Config/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import getOrderDetails from "../Api/OrderDetailsApi";
import AuthContext from "../Auth/Context";

function OrderDetails({ navigation, route }) {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  const jwttoken = authContext.user.jwttoken;

  const { ordernumber } = route.params;
  const { payment } = route.params;

  useEffect(() => {
    loadOrderDetails();
  }, []);

  const loadOrderDetails = async () => {
    setLoading(true);
    const orderdetailsresponse = await getOrderDetails.getOrderDetails({
      ordernumber,
      jwttoken,
    });
    setLoading(false);
    setOrderDetails(orderdetailsresponse.data[0]);
    setOrderItems(orderdetailsresponse.data[0].orderperticulars);
  };

  const totalsavings = orderDetails.couponvalue + orderDetails.walletamount;

  const Berlin = {
    latitude: 16.9855,
    longitude:  81.8013
  };

  const Frankfurt = {
    latitude: 17.0069,
    longitude: 81.7830
  };

  return (
    <>
      {loading == true ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator animating={loading} size={35} color="tomato" />
          <Text style={{ color: "grey" }}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.Container}>
          <ScrollView showsVerticalScrollIndicator={false}>
          <MapView
            style={{flex:1, height:hp(40), width:wp(100)}}
            initialRegion={{
              latitude: 16.9855,
              longitude: 81.8013,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            }}
          >
           
           <Polyline coordinates={[Berlin, Frankfurt]} />
          </MapView>
            <View style={styles.outletdetails}>
              <Text style={{ fontWeight: "bold", fontSize: wp(6) }}>
                {orderDetails.merchantname}{" "}
              </Text>
              <Text style={{ color: "grey" }}>{orderDetails.address}</Text>
            </View>
            <View style={styles.diffrentiator}></View>
            <View style={styles.status}>
              <Image
                source={require("../assets/ordertracking.gif")}
                style={{ width: "20%", height: hp(6) }}
                resizeMode="cover"
              />
              <Text
                style={{
                  alignSelf: "center",
                  fontWeight: "bold",
                  fontSize: wp(4.5),
                }}
              >
                {orderDetails.status}
              </Text>
            </View>
            <View
              style={{
                marginTop: hp(1.5),
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 1,
                paddingVertical: hp(1),
                borderRadius: 5,
                marginBottom: hp(1),
              }}
            >
              <Text
                style={{ fontSize: wp(4), fontWeight: "bold", color: "tomato" }}
              >
                Call Delivery Executive
              </Text>
            </View>
            <Text style={{ fontSize: wp(5), fontWeight: "bold" }}>Items</Text>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderItems}
              keyExtractor={(orderItems) => orderItems.produtid.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemcomponent}>
                  <View style={styles.diffrentiator}></View>
                  <View style={styles.itemcomponentbody}>
                    <View>
                      <Text>{item.productname}</Text>
                      <Text style={{ marginTop: hp(0.5), color: "grey" }}>
                        {item.qunatity} X {item.price}/-
                      </Text>
                    </View>
                    <View style={{ alignSelf: "center", flexDirection: "row" }}>
                      <MaterialCommunityIcons
                        name="currency-inr"
                        size={wp(3.5)}
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                      />
                      <Text style={{ fontSize: wp(3.5) }}>
                        {item.totalamount}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />

            <View style={styles.itemsummary}>
              <View style={styles.diffrentiator}></View>
              <View style={styles.itemsummarybody}>
                <Text style={{ fontSize: wp(3.5), fontWeight: "bold" }}>
                  Item Total
                </Text>
                <View style={{ alignSelf: "center", flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    size={wp(3.5)}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                  <Text style={{ fontSize: wp(3.5) }}>
                    {orderDetails.subtotal}
                  </Text>
                </View>
              </View>
              {orderDetails.couponvalue == 0 ? null : (
                <View style={styles.itemsummarybody}>
                  <Text style={{ fontSize: wp(3.1), color: "tomato" }}>
                    Promo - ({orderDetails.couponcode})
                  </Text>
                  <View style={{ alignSelf: "center", flexDirection: "row" }}>
                    <Text style={{ fontSize: wp(3.1), color: "tomato" }}>
                      you save{" "}
                    </Text>
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={wp(3.1)}
                      color="tomato"
                      style={{ justifyContent: "center", alignSelf: "center" }}
                    />
                    <Text style={{ fontSize: wp(3.1), color: "tomato" }}>
                      {orderDetails.couponvalue}
                    </Text>
                  </View>
                </View>
              )}

              {orderDetails.taxes == 0 ? null : (
                <View style={styles.itemsummarybody}>
                  <Text style={{ fontSize: wp(3.1), color: "grey" }}>
                    Taxes{" "}
                  </Text>
                  <View style={{ alignSelf: "center", flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={wp(3.1)}
                      color="grey"
                      style={{ justifyContent: "center", alignSelf: "center" }}
                    />
                    <Text style={{ fontSize: wp(3.1), color: "grey" }}>
                      {orderDetails.taxes}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.itemsummarybody}>
                <Text style={{ fontSize: wp(3.1), color: "grey" }}>
                  Delivery Charges
                </Text>
                <View style={{ alignSelf: "center", flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    size={wp(3.5)}
                    color="grey"
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                  <Text style={{ fontSize: wp(3.1), color: "grey" }}>
                    {orderDetails.deliverycharges}
                  </Text>
                </View>
              </View>
              {orderDetails.tipamount == 0 ? null : (
                <View style={styles.itemsummarybody}>
                  <Text style={{ fontSize: wp(3.1), color: "grey" }}>Tip</Text>
                  <View style={{ alignSelf: "center", flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={wp(3.5)}
                      color="grey"
                      style={{ justifyContent: "center", alignSelf: "center" }}
                    />
                    <Text style={{ fontSize: wp(3.1), color: "grey" }}>
                      {orderDetails.tipamount}
                    </Text>
                  </View>
                </View>
              )}

              {orderDetails.walletamount == 0 ? null : (
                <View style={styles.itemsummarybody}>
                  <Text style={{ fontSize: wp(3.1), color: "grey" }}>
                    From wallet
                  </Text>
                  <View style={{ alignSelf: "center", flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={wp(3.5)}
                      color="grey"
                      style={{ justifyContent: "center", alignSelf: "center" }}
                    />
                    <Text style={{ fontSize: wp(3.1), color: "grey" }}>
                      {orderDetails.walletamount}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.grandtotal}>
              <View style={styles.diffrentiator}></View>
              <View style={styles.grandtotalbody}>
                <Text
                  style={{
                    fontSize: wp(3.5),
                    fontWeight: "bold",
                    color: "grey",
                  }}
                >
                  Grand Total
                </Text>
                <View style={{ alignSelf: "center", flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    size={wp(3.5)}
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                  <Text style={{ fontSize: wp(3.5), fontWeight: "bold" }}>
                    {orderDetails.grandtotal}
                  </Text>
                </View>
              </View>
              <View style={styles.diffrentiator}></View>
            </View>
            {totalsavings == 0 ? null : (
              <View style={styles.savings}>
                <Text style={{ fontSize: wp(3.5), color: "#1ba3ac" }}>
                  Your Total Savings
                </Text>
                <View style={{ alignSelf: "center", flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="currency-inr"
                    size={wp(3.5)}
                    color="#1ba3ac"
                    style={{ justifyContent: "center", alignSelf: "center" }}
                  />
                  <Text style={{ fontSize: wp(3.5), color: "#1ba3ac" }}>
                    {totalsavings}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.orderdetails}>
              <Text
                style={{
                  fontSize: wp(5),
                  marginTop: hp(4),
                  marginBottom: hp(0.7),
                  fontWeight: "bold",
                }}
              >
                Details
              </Text>
              <View style={styles.diffrentiator}></View>
              <View style={styles.orderdetailsbody}>
                <Text style={{ fontSize: wp(3), color: "grey" }}>
                  Order Number
                </Text>
                <Text style={{ fontSize: wp(3.5) }}>{ordernumber}</Text>
              </View>
              <View style={styles.orderdetailsbody}>
                <Text style={{ fontSize: wp(3), color: "grey" }}>Payment</Text>
                <Text style={{ fontSize: wp(3.5) }}>{payment}</Text>
              </View>
              <View style={styles.orderdetailsbody}>
                <Text style={{ fontSize: wp(3), color: "grey" }}>Date</Text>
                <Text style={{ fontSize: wp(3.5) }}>
                  {orderDetails.orderdate}
                </Text>
              </View>
              <View style={styles.orderdetailsbody}>
                <Text style={{ fontSize: wp(3), color: "grey" }}>
                  Deliver to
                </Text>
                <Text style={{ fontSize: wp(3.5), marginBottom: hp(1.5) }}>
                  {orderDetails.delieverylocation}
                </Text>
              </View>
              <View style={styles.diffrentiator}></View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: hp(2),
              }}
            >
              <Text style={{ color: "tomato", fontWeight: "bold" }}>
                Call {orderDetails.merchantname}
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  Container: {
    marginHorizontal: wp(3),
  },
  diffrentiator: {
    backgroundColor: Colors.light,
    width: "100%",
    height: hp(0.19),
  },
  grandtotal: {
    marginTop: hp(1),
  },
  grandtotalbody: {
    marginVertical: hp(0.5),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemcomponent: {
    marginTop: hp(1),
  },
  itemcomponentbody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(0.7),
    marginBottom: hp(1),
  },
  itemsummary: {
    marginTop: hp(0.5),
  },
  itemsummarybody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(0.9),
  },
  orderdetails: {
    marginBottom: hp(2),
  },
  orderdetailsbody: {
    marginTop: hp(2.5),
  },
  outletdetails: {
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  savings: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(0.9),
    borderWidth: 1,
    backgroundColor: "#e3fffd",
    borderColor: "#9ae6e1",
    borderRadius: 5,
    paddingVertical: wp(1.2),
    paddingHorizontal: wp(2.6),
  },
  status: {
    flexDirection: "row",
    marginTop: hp(1),
  },
});

export default OrderDetails;
