import { create } from "apisauce";

const apiCategories = create({
  baseURL: "https://apiv2.pergo.io/api",
});

export default apiCategories;
