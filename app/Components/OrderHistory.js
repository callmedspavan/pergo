import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Colors from "../Config/Colors";

function OrderHistory({
  entity,
  outlet,
  otp,
  orderid,
  amount,
  paymentmode,
  totalitems,
  orderedon,
  status,
  onpress,
  icon
}) {
  return (
    <View style={styles.orderhistory}>
      <TouchableOpacity onPress={onpress}>
        <View style={styles.orderhistorycontainer}>
          <View style={styles.orderhistorycontainerheader}>
            <View style={styles.ohchleft}>
              <View style={styles.ohchleftimage}>
                <Image
                  source={{uri:icon}}
                  style={{ height: hp(4), width: wp(8) }}
                  resizeMode="stretch"
                />
              </View>
              <View style={styles.ohchlefttext}>
                <Text
                  style={{
                    fontWeight: "bold",

                    fontSize: wp(4),
                  }}
                >
                  {entity}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: wp(3),
                    fontStyle: "italic",
                  }}
                >
                  Delivered from {outlet}
                </Text>
              </View>
            </View>
            {otp == null || status == "Canceled" ? null : (
              <View style={styles.ohchright}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: wp(3),
                    color: "white",
                  }}
                >
                  OTP : {otp}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              height: hp(0.2),
              width: "100%",
              backgroundColor: Colors.light,
            }}
          ></View>
          <View style={styles.orderhistorycontainerbody}>
            <View
              style={{
                paddingVertical: hp(1.2),
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ color: "grey", fontSize: wp(3) }}>
                  ORDER ID:
                </Text>
                <Text
                  style={{
                    fontSize: wp(3),
                    color: "grey",
                    fontWeight: "bold",
                  }}
                >
                  {orderid}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ color: "grey", fontSize: wp(3) }}>AMOUNT:</Text>
                <Text
                  style={{
                    fontSize: wp(3),
                    color: "grey",
                    fontWeight: "bold",
                  }}
                >
                  {amount}/-
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                }}
              >
                <Text style={{ color: "grey", fontSize: wp(3) }}>
                  PAYMENT MODE:
                </Text>
                <Text
                  style={{
                    fontSize: wp(3),
                    color: "grey",
                    fontWeight: "bold",
                  }}
                >
                  {paymentmode}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ color: "grey", fontSize: wp(3) }}>
                TOTAL ITEMS:
              </Text>
              <Text
                style={{
                  fontSize: wp(3),
                  color: "grey",
                  fontWeight: "bold",
                }}
              >
                {totalitems}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ color: "grey", fontSize: wp(3) }}>
                ORDERED ON:
              </Text>
              <Text
                style={{
                  fontSize: wp(3),
                  color: "grey",
                  fontWeight: "bold",
                }}
              >
                {orderedon}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: hp(0.2),
              width: "100%",
              backgroundColor: Colors.light,
            }}
          ></View>
          <View style={styles.orderhistorycontainerfooter}>
            <View style={styles.ohcfbody}>
              <Text style={{ fontWeight: "bold", color: "black" }}>Status</Text>
              {status == "Canceled" ? (
                <Text style={{ fontWeight: "bold", color: "tomato" }}>
                  Order {status}
                </Text>
              ) : (
                <Text style={{ fontWeight: "bold", color: "green" }}>
                  {status}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: hp(1),
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
});

export default OrderHistory;
