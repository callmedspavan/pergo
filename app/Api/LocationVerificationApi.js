import Grocery from "./Grocery";


const endpoint = "/checkservingareas?lattitude=";

const LocationVerification = ({ lat,long, jwttoken }) =>
  Grocery.get(
    endpoint + lat + "&longittude=" + long ,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    LocationVerification,
};