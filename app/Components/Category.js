import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function Category({ onPress, name, image, discount }) {
  return (
    <View style={styles.categorydiv}>
      <TouchableOpacity onPress={onPress}>
        <>
          <View style={styles.coffer}>
            <View
              style={{
                // backgroundColor: "#2fbb2f",
                width: wp(20),
                paddingTop: wp(0.5),
                borderRadius: 3,
                justifyContent: "flex-end",
                alignContent: "flex-end",
              }}
            >
              <Text 
                style={{
                  color: "#2fbb2f",
                  fontWeight: "bold",
                  fontSize: wp(3),
                }}
              >
                Upto {discount} Off
              </Text>
            </View>
          </View>
          <View style={styles.cimage}>
            <Image
              source={{ uri: image }}
              style={{ width: wp(18), height: hp(9) }}
              resizeMode="stretch"
            />
          </View>
          <View style={styles.cname}>
            <Text
              numberOfLines={2}
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: wp(3),
              }}
            >
              {name}
            </Text>
          </View>
        </>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  categorydiv: {
    width: wp(29),
    backgroundColor: "white",
    elevation: 2,
    paddingHorizontal: wp(1),
    borderRadius: 5,
    marginBottom: hp(1),
    marginRight: wp(3),
    marginLeft:wp(.2)
  },
  cimage: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(0),
  },
  cname: {
    flex: 1,
    padding: wp(1.5),
    justifyContent: "center",
    alignItems: "center",
  },
  coffer: {
    paddingTop: hp(0.5),
  },
});

export default Category;
