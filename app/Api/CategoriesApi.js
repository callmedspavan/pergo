import Grocery from "./Grocery";

const endpoint = "/GetCategories";

const getCategories = ({ key, jwttoken }) =>
  Grocery.get(
    endpoint,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getCategories,
};
