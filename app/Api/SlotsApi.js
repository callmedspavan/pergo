import Grocery from "./Grocery";

const endpoint = "/getslots?date=";

const getSlots = ({ finalDate, jwttoken }) =>
  Grocery.get(
    endpoint + finalDate,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getSlots,
};
