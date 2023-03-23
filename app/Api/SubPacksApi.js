import Grocery from "./Grocery";

const endpoint = "/GetSubPacks?useraccesskey=";

const getSubPacks = ({ key, displayid, jwttoken }) =>
  Grocery.get(
    endpoint + key + "&displayid=" + displayid,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
  getSubPacks,
};
