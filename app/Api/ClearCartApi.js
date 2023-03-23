import Grocery from "./Grocery";

const endpoint = "/clear_tempservicecart?useraccesskey=";

const CancleCart = ({ key, jwttoken }) =>
  Grocery.post(
    endpoint + key,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    CancleCart,
};
