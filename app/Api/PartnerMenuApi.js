import Grocery from "./Grocery";

const endpoint = "/Getrestaurantproducts?serviceaccesstokent=";

const getPartnerMenu = ({ accesstoken, jwttoken, key }) =>
  Grocery.get(
    endpoint + accesstoken + "&useraccesskey=" + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getPartnerMenu,
};

