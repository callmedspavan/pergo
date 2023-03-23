import Grocery from "./Grocery";

const InsertServiceOrder = ({
  key,
  jwttoken,
  finaladdress,
  paymentmode,
  paymentreference,
  couponcode,
  couponvalue,
  lat,
  long,
  tip,
}) =>
  Grocery.post(
    "/insert_service_cart?useraccesskey=" +
      key +
      "&deliveryaddress=" +
      finaladdress +
      "&lattitude=" + lat +
      "&longittude=" + long +
      "&paymentmode=" +
      paymentmode +
      "&paymentreference=" +
      paymentreference +
      "&couponcode=" +
      couponcode +
      "&couponvalue=" +
      couponvalue +
      "&walletamount=0" +
      "&tip=" + tip,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    InsertServiceOrder,
};
