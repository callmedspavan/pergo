import Grocery from "./Grocery";

const endpoint = "/getUserorders?useraccesskey=";

const getOrders = ({ key, jwttoken }) =>
  Grocery.get(
    endpoint + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getOrders,
};
