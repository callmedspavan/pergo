import React from "react";
import { View, TouchableWithoutFeedback, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function Slot({ timeslot, selectedslot, onpress }) {
  return (
    <View>
    {selectedslot == true ? <TouchableWithoutFeedback onPress={onpress}>
      <View style={styles.tipamountactive}>
        <MaterialCommunityIcons
          name="clock-fast"
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
          {timeslot}
        </Text>
      </View>
    </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={onpress}>
      <View style={styles.tipamount}>
        <MaterialCommunityIcons
          name="clock-fast"
          size={wp(3)}
          style={{
            justifyContent: "center",
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            fontFamily: "Alata_400Regular",
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          {timeslot}
        </Text>
      </View>
    </TouchableWithoutFeedback> }
    </View>
    
  );
}

const styles = StyleSheet.create({
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
    marginRight: wp(2),
    marginBottom: hp(1),
  },
  tipamount: {
    flexDirection: "row",
    borderColor: "white",
    backgroundColor: "white",
    elevation: 3,
    borderRadius: 5,
    marginTop: hp(2.2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginRight: wp(2),
    marginBottom: hp(1),
  },
});

export default Slot;
