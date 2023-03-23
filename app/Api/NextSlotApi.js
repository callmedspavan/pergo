import Grocery from "./Grocery";

const endpoint = "/getslots_deliverymessage?state=AP&city=Rajhumundry";

const getNextSlot = ({ jwttoken }) =>
  Grocery.get(
    endpoint,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getNextSlot,
};
