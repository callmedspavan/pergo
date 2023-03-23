import Grocery from "./Grocery";

const endpoint = "/getservicecart?useraccesskey=";

const getServiceCart = ({ key,lat, long, jwttoken }) =>
  Grocery.get(
    endpoint + key +
    "&latittude=" + lat +
    "&longittude=" + long,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getServiceCart,
};