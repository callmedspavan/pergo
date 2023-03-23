import Grocery from "./Grocery";

const sendOtp = (mobileNumber) =>
  Grocery.post("/sendotp?mobilenumber=" + mobileNumber);

export default {
  sendOtp,
};
