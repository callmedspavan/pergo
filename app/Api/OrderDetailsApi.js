import Grocery from "./Grocery";

const endpoint = "/getorderdetails?ordernumber=";

const getOrderDetails = ({ ordernumber, jwttoken }) =>
  Grocery.get(
    endpoint + ordernumber,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getOrderDetails,
};
