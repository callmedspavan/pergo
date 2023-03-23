import Grocery from "./Grocery";

const endpoint = "/getservicesbestseller?state=Andhra Pradesh&city=";

const getMerchantBestsellers = ({ jwttoken, city, lat, long, entity }) =>
  Grocery.get(
    endpoint + city + "&lattitude=" + lat + "&logittude=" + long + "&entity=" + entity,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getMerchantBestsellers,
};
