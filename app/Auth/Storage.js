import * as SecureStore from "expo-secure-store";



const storeToken = async (key,authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
  } catch (error) {
    console.log("Error Storing the Authtoken", error);
  }
};

const getToken = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log("Error getting the Authtoken", error);
  }
};

const removeToken = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing the Authtoken", error);
  }
};

export default { getToken, removeToken, storeToken };
