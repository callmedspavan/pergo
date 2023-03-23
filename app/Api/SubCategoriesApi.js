import Grocery from "./Grocery";

const endpoint = "/GetSubCategories?catid=";

const getSubCategories = ({ catid, jwttoken }) =>
  Grocery.get(
    endpoint + catid,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getSubCategories,
};
