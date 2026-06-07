import { callbackInterface } from "./utilsInterface";

export const errorCallback = (
  error_response: { response?: any } | string,
  callback: callbackInterface,
  setLoading: Function = () => {}
) => {
  try {
    if (
      typeof error_response === "object" &&
      error_response?.response?.data?.error
    ) {
      callback(false, error_response.response.data.error);
    } else if (
      typeof error_response === "object" &&
      error_response?.response?.data?.message
    ) {
      callback(false, error_response.response.data.message);
    } else {
      callback(false, `Opps! the request was not completed please try again`);
    }
  } catch {}
  setLoading(false);
};
