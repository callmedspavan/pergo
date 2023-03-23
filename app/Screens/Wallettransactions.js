import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../Config/Colors";
import AuthContext from "../Auth/Context";
import getWalletTransactions from "../Api/WalletTransactionsApi";

function WalletTransactions() {
  const authContext = React.useContext(AuthContext);
  const jwttoken = authContext.user.jwttoken;
  const key = authContext.user.accesskey;

  const [walletBal, setWalletBal] = React.useState();
  const [transactions, setTransactions] = React.useState([]);

  React.useEffect(() => {
    loadWalletTransactions();
  }, []);

  const loadWalletTransactions = async () => {
    const wallettransactionsresponse = await getWalletTransactions.getWalletTransactions(
      {
        key,
        jwttoken,
      }
    );

    setWalletBal(wallettransactionsresponse.data[0].balanceamount);
    setTransactions(wallettransactionsresponse.data[0].transactions);
  };

  return (
    <View>
      <View style={styles.walletamount}>
        <Text style={{ fontSize: wp(7), color: "white" }}>CURRENT BALANCE</Text>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons
            name="currency-inr"
            size={wp(7)}
            color="white"
            style={{ justifyContent: "center", alignSelf: "center" }}
          />
          <Text
            style={{ fontSize: wp(12), color: "white", fontWeight: "bold" }}
          >
            {walletBal}
          </Text>
        </View>
      </View>
      <View style={styles.transactioncontainer}>
        
        {transactions.length > 1 ? (
            <>
            <Text
            style={{
              marginHorizontal: wp(2),
              marginVertical: hp(2.5),
              color: "grey",
              fontWeight: "bold",
            }}
          >
            Transaction History
          </Text>
          <FlatList
            data={transactions}
            renderItem={({ item }) => (
              <View style={styles.transactiondiv}>
                {item.type == "DEBIT" ? (
                  <View style={{ width: wp(1), backgroundColor: "red" }}></View>
                ) : (
                  <View
                    style={{ width: wp(1), backgroundColor: "#2fbb2f" }}
                  ></View>
                )}

                <View
                  style={{
                    backgroundColor: Colors.light,
                    //   marginLeft: wp(2.7),
                    width: wp(14),
                    borderRadius: 5,
                    padding: wp(1),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.type == "DEBIT" ? (
                    <MaterialCommunityIcons
                      name="debug-step-out"
                      size={wp(8)}
                      color="red"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="debug-step-into"
                      size={wp(8)}
                      color="#2fbb2f"
                    />
                  )}
                </View>
                <View style={{ width: wp(55), justifyContent: "center" }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: wp(3.5),
                      color: "grey",
                      fontWeight: "bold",
                    }}
                  >
                    {item.transaction}
                  </Text>
                  <Text
                    style={{
                      marginTop: wp(1),
                      fontSize: wp(3),
                      color: "grey",
                      fontWeight: "bold",
                    }}
                  >
                    {item.date}
                  </Text>
                </View>
                <View style={{ justifyContent: "center" }}>
                  {item.type == "DEBIT" ? (
                    <Text style={{ color: "red", fontWeight: "bold" }}>
                      -{item.amount}
                    </Text>
                  ) : (
                    <Text style={{ color: "#2fbb2f", fontWeight: "bold" }}>
                      +{item.amount}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />
          </>
        ) : (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Text style={{color:"grey"}} >No Transactions Available</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  walletamount: {
    height: hp(32),
    backgroundColor: "#4B0082",
    justifyContent: "center",
    alignItems: "center",
  },
  transactioncontainer: {
    width: wp(94),
    marginHorizontal: wp(3),
    height: hp(60),
    backgroundColor: "white",
    elevation: 3,
    marginTop: hp(-8),
    borderRadius: 10,
  },
  transactiondiv: {
    marginHorizontal: wp(2),
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.8),
    height: hp(7.2),
  },
});

export default WalletTransactions;
