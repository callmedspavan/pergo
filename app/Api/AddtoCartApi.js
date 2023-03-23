import Grocery from "./Grocery";

const addToCart = ({ key, productid, qty, jwttoken }) =>
  Grocery.post(
    "/addtocart?accesskey=" + key + "&productid=" + productid + "&qty=" + qty,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  addToCart,
};
