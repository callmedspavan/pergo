import Grocery from "./Grocery";

const endpoint = "/getusersavedaddress?useraccesskey=";

const getSavedAddress = ({ key, jwttoken }) =>
  Grocery.get(
    endpoint + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getSavedAddress,
};
