import Grocery from "./Grocery";

const saveAddress = (
 { key,
  jwttoken,
  finaladdress,
  city,
  state,
  zipcode,
  addresslable,
  lat,
  long}
) =>
  Grocery.post(
    "/insertusersavedaddress?useraccesskey=" +
      key +
      "&address=" +
      finaladdress +
      "&city=" +
      city +
      "&state=" +
      state +
      "&zipcode=" +
      zipcode +
      "&addressname=" +
      addresslable +
      "&lattitude=" +
      lat +
      "&longittude=" +
      long,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  saveAddress,
};
