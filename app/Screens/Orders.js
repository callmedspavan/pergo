import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import OrderHistory from "../Components/OrderHistory";
import AuthContext from "../Auth/Context";
import Colors from "../Config/Colors";
import getOrders from "../Api/OrdersApi";

function Orders({ navigation }) {
  const authContext = useContext(AuthContext);
  const key = authContext.user.accesskey;
  const jwttoken = authContext.user.jwttoken;
  const name = authContext.user.userdetails[0].name;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing,setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const ordersresponse = await getOrders.getOrders({
      key,
      jwttoken,
    });

    setOrders(ordersresponse.data);
    setLoading(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.nav}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: wp(5),
              letterSpacing: wp(0.8),
              fontStyle: "italic",
            }}
          >
            Orders
          </Text>
        </View>
        <View style={styles.yellowhalfround}>
          <Text
            style={{
              color:"white",
              fontWeight: "bold",
              fontStyle: "italic",
              fontSize: wp(3.5),
            }}
          >
            Lets See What all you have got in here...!!!
          </Text>
        </View>
        <View>
          {orders.length < 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/orderhistory.jpg")}
                style={{ height: hp(20), width: wp(50) }}
                resizeMode="center"
              />
              <Text style={{ marginTop: wp(4) }}>
                You have no past orders {name}
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
              <TouchableOpacity onPress={() => navigation.navigate("Landing")}>
                <View
                  style={{
                    backgroundColor: "#f07028",
                    paddingHorizontal: wp(3),
                    paddingVertical: hp(0.8),
                    borderRadius: 3,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Order Now
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {loading == true ? (
                <View
                  style={{
                    
                    paddingVertical:hp(40)
                  }}
                >
                  <ActivityIndicator
                    animating={loading}
                    size={35}
                    color="#ffaa01"
                    style={{
                      alignSelf:"center"
                    }}
                  />
                  <Text style={{ color: "grey",marginTop:hp(0.2),alignSelf:"center" }}>Loading...</Text>
                </View>
              ) : (
                <FlatList
                  data={orders}
                  keyExtractor={(orders) => orders.ordernumber.toString()}
                  renderItem={({ item }) => (
                    <OrderHistory
                      entity={item.entity}
                      outlet={item.messagetext}
                      otp={item.otp}
                      orderid={item.ordernumber}
                      amount={item.orderamount}
                      paymentmode={item.paymentmode}
                      totalitems={item.totalitems}
                      orderedon={item.orderdon}
                      status={item.status}
                      icon={item.imageicon}
                      onpress={() => navigation.navigate("Order Summary",{ordernumber : item.ordernumber,payment : item.paymentmode })}
                    />
                  )}
                  refreshing={false}
                  onRefresh={()=> loadOrders()}
                />
              )}
            </View>
          )}
        </View>
      </View>

      <StatusBar backgroundColor="#ffff" barStyle="dark-content" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(24.1),
  },
  diffrentiator: {
    height: hp(1.2),
    width: wp(100),
    backgroundColor: Colors.light,
    marginTop: hp(1),
  },
  nav: {
    flexDirection: "row",
    backgroundColor: Colors.white,

    height: hp(7),
    justifyContent: "center",
    alignItems: "center",
  },
  ohchleft: {
    flexDirection: "row",
  },
  ohchlefttext: {
    marginLeft: wp(1.8),
    justifyContent: "center",
    alignItems: "flex-start",
  },
  ohchright: {
    right: wp(0),
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "black",
    padding: wp(1),
    borderRadius: 7,
  },
  orderhistory: {
    backgroundColor: "#ffff",
    marginHorizontal: wp(3),
    width: wp(94),
    marginTop: hp(2),
    elevation: 2,
    borderRadius: 5,
    borderWidth: wp(0.2),
    borderColor: "#dddddd",
  },
  orderhistorycontainer: {
    margin: hp(1.5),
    flex: 1,
  },
  orderhistorycontainerbody: {
    paddingBottom: hp(1),
  },
  ohcfbody: {
    paddingTop: hp(1),
    justifyContent: "space-between",
    flexDirection: "row",
  },

  orderhistorycontainerheader: {
    flexDirection: "row",

    paddingBottom: hp(0.8),
  },
  yellowhalfround: {
    height: hp(5),
    backgroundColor: "#ffaa01",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    elevation: 7,
  },
});

export default Orders;
