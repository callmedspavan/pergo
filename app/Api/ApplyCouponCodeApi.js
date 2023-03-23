import Grocery from "./Grocery";

const endpoint = "/applycouponcodes?couponcode=";

const applyCouponCodes = ({ key,jwttoken,city, state,code }) =>
  Grocery.post(
    endpoint + code +
    "&state=" + state +
    "&city=" + city +
    "&useraccesskey=" + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    applyCouponCodes,
};