import axios from "axios";
import store from "../redux/store";
import { TOKEN, USER_ID } from "../utils/localStorageContact";

const getAuthState = () => {
  return store.getState().auth;
};
//https://apitimecloudtracker.herokuapp.com/
//http://localhost:8080/
export default () => {
  return axios.create({
    baseURL: "https://apitimecloudtracker.herokuapp.com/",
    headers: {
      [TOKEN]: getAuthState().token ? getAuthState().token : "token",
      [USER_ID]: getAuthState().userId ? getAuthState().userId : "userId",
    },
  });
};
