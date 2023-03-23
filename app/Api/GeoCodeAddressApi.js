import Grocery from "./Grocery";

const endpoint = "/getaddressbycoordinates?lattitude=";

const getGeoCodeAddress = ({ lat,long, jwttoken }) =>
  Grocery.get(
    endpoint + lat + "&longittude=" + long ,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getGeoCodeAddress,
};