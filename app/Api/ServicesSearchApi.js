import Grocery from "./Grocery";

const endpoint = "/Getrestaurantsbysearch?state=";

const getServicesSearch = ({ search, jwttoken, state, city, lat, long, entity }) =>
  Grocery.get(
    endpoint +
      state +
      "&city=" +
      city +
      "&lattitude=" +
      lat +
      "&logittude=" +
      long +
      "&entity=" +
      entity +
      "&searchquery=" +
      search,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getServicesSearch,
};
