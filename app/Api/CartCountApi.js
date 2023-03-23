import Grocery from "./Grocery";

const endpoint = "/getcartcount?useraccesskey=";

const getCartCount = ({ key, jwttoken, entity }) =>
  Grocery.get(
    endpoint + key + "&entity=" + entity,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getCartCount,
};