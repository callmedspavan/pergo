import Grocery from "./Grocery";

const endpoint = "/getcart?useraccesskey=";

const getGroceryCart = ({ key, jwttoken }) =>
  Grocery.get(
    endpoint + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getGroceryCart,
};