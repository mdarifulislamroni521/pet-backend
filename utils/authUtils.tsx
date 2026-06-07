import axios from "axios";
import { errorCallback } from "./utilHelpers";
import { utilsFunctionInterface } from "./utilsInterface";

export const headers = {
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
};

// Using relative path to hit our local API
const server_url = "/api";

export const dashboardGetUtils: utilsFunctionInterface = async (
  callback,
  setLoading,
  data,
  page = 1
) => {
  setLoading(true);
  await axios
    .get(`${server_url}/dashboard`, headers)
    .then((response) => {
      setLoading(false);
      return callback(true, response.data);
    })
    .catch((error_response) => {
      setLoading(false);
      return errorCallback(error_response, callback, setLoading);
    });
};
