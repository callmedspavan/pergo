import Grocery from "./Grocery";

const endpoint = "/getcouponcodes?city=";

const getCouponCodes = ({ key,jwttoken,city, state,entity }) =>
  Grocery.get(
    endpoint + city +
    "&state=" + state +
    "&entity=" + entity +
    "&useraccesskey=" + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getCouponCodes,
};