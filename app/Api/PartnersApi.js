import Grocery from "./Grocery";

const endpoint =
  "/Getrestaurants?state=Andhra Pradesh&city=rajahmundry&lattitude=17.834553&logittude=83.345455&entity=";

const getPartners = ({ entity, jwttoken }) =>
  Grocery.get(
    endpoint + entity,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getPartners,
};
