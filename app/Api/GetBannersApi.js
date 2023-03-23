import Grocery from "./Grocery";

const endpoint = "/getbanners?entity=";

const getBanners = ({ entity, city, state, screenname, sectionname, jwttoken }) =>
  Grocery.get(
    endpoint +
      entity +
      "&city=" +
      city +
      "&state=" +
      state +
      "&screenname=" +
      screenname +
      "&sectionname=" +
      sectionname,
    {},
    {
      headers: { Authorization: "Bearer " + jwttoken },
    }
  );

export default {
    getBanners,
};
