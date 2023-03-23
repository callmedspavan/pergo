import Grocery from "./Grocery";

const InsertGroceryOrder = ({
  key,
  jwttoken,
  finaladdress,
  paymentmode,
  date,
  selectedSlot,
  entity,
  long,
  orderamount,
  lat,
  paymentRefrenceNumber,
  couponCode,
  couponValue,
  couponType,
  deductedWalletAmount,
  fastDelivery,
  tip,
}) =>
  Grocery.post(
    "/insertorder_version2?useraccesskey=" +
      key +
      "&deliveryaddress=" +
      finaladdress +
      "&ordernumber=" +
      "&locationid=0" +
      "&paymentmode=" +
      paymentmode +
      "&slotdate=" +
      date +
      "&slottime=" +
      selectedSlot +
      "&entity=" +
      entity +
      "&longitude=" +
      long +
      "&orderamount=" +
      orderamount +
      "&lattitude=" +
      lat +
      "&paymentreference=" +
      paymentRefrenceNumber +
      "&couponcode=" +
      couponCode +
      " &couponvalue=" +
      couponValue +
      "&coupontype=" +
      couponType +
      "&walletamount=" +
      deductedWalletAmount +
      "&fastDelivery=" +
      fastDelivery +
      "&tipamount=" +
      tip,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  InsertGroceryOrder,
};
