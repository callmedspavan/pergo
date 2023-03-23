import React from "react";
import {Text,View,Image} from "react-native"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { useFonts, Alata_400Regular } from "@expo-google-fonts/alata";
// import { AppLoading } from "expo";
import { TouchableOpacity } from "react-native";



function Promo({discription,code,condition,apply}){

    let [fontsLoaded, error] = useFonts({
        Alata_400Regular,
      });
    
      // if (!fontsLoaded) {
      //   return <AppLoading />;
      // }

    return (
        <View style={{ marginVertical: hp(1), marginHorizontal: wp(3) }}>
            <Image
              source={require("../assets/logo.png")}
              style={{ width: wp(25), height: hp(5), borderRadius: 5 }}
              resizeMode="cover"
            />
            <Text
              style={{
                fontFamily: "Alata_400Regular",
                fontSize: wp(3.5),
                color:"black"
              }}
            >
              {discription}
            </Text>
            <Text
              style={{
                fontFamily: "Alata_400Regular",
                color: "grey",
                fontSize: wp(3),
                paddingTop: wp(1),
              }}
            >
              {condition}
            </Text>
            <View style={{width:"100%", backgroundColor:"#f4f4f4",height:hp(0.2), marginTop:hp(1)}} ></View>
            <View style={{marginTop:hp(1),flexDirection:"row", justifyContent:"space-between"}} >
              <View style={{backgroundColor:"#edfbfd",width:wp(30),paddingVertical:hp(0.5)}} >
                <Text style={{
                fontFamily: "Alata_400Regular",
                justifyContent:"center",
                alignItems:"center",
                alignSelf:"center",
                color:"black",
                letterSpacing:wp(0.8)
                }} >{code}</Text>
              
              </View>
              <TouchableOpacity onPress={apply}>
              <Text style={{ color: "#2fbb2f", fontFamily: "Alata_400Regular" }}>
              Apply
            </Text>
            </TouchableOpacity>
            </View>
            <View style={{width:"100%", backgroundColor:"#f4f4f4",height:hp(0.2), marginTop:hp(1)}} ></View>
          </View>
    );
}

export default Promo;