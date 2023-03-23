import Grocery from "./Grocery";

const servicesAddToCart = ({ key, productid, qty, jwttoken }) =>
  Grocery.post(
    "/add_servicetotempcart?productid=" + productid + "&useraccesskey=" + key + "&qty=" + qty,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    servicesAddToCart,
};