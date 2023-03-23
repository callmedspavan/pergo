import Grocery from "./Grocery";

const endpoint = "/Getproductsbysubcategory?useraccesskey=";

const getGroceryProducts = ({ key, subcatid, jwttoken }) =>
  Grocery.get(
    endpoint + key + "&subcategory=" + subcatid,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getGroceryProducts,
};
