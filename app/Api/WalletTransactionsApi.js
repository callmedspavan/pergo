import Grocery from "./Grocery";

const endpoint = "/getuserwallet?useraccesskey=";

const getWalletTransactions = ({ key, jwttoken }) =>
  Grocery.get(
    endpoint + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getWalletTransactions,
};