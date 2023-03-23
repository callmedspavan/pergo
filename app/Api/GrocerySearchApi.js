import Grocery from "./Grocery";

const endpoint = "/grocerysearchitems?useraccesskey=";

const getSearchGroceryProducts = ({ key, search, jwttoken }) =>
  Grocery.get(
    endpoint + key + "&searchquery=" + search,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getSearchGroceryProducts,
};