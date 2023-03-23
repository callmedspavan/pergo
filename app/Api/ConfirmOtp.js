import Grocery from "./Grocery";

const emptystring = "";

const confirmOtp = (mobilenumber, otp, name, email, referralCode) =>
  Grocery.post(
    "/validateuserlogin?mobilnumber=" +
      mobilenumber +
      "&otp=" +
      otp +
      "&firstname=" +
      name +
      "&lastname=" +
      emptystring +
      "&emailid=" +
      email +
      "&uniquekey=" +
      referralCode
  );

export default {
  confirmOtp,
};
