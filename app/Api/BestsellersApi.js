import Grocery from "./Grocery";

const endpoint = "/Getbestsellers?useraccesskey=";

const getBestsellers = ({ key, jwttoken }) =>
  Grocery.get(
    endpoint + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getBestsellers,
};
