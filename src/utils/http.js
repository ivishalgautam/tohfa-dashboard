import axios from "axios";
import { getHeader } from "./header";
import { endpoints } from "./endpoints";
import { logout } from "@/components/Layout";

// Default API will be your root
const API_ROOT = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT = 20000;

const http = (headerType = "json", baseURL = API_ROOT) => {
  const headers = getHeader(headerType);

  const client = axios.create({
    baseURL,
    headers,
  });

  // Intercept response object and handleSuccess and Error Object
  client.interceptors.response.use(handleSuccess, handleError);

  function handleSuccess(response) {
    return response;
  }

  /** Intercept any unauthorized request.
   * status 401 means either accessToken is expired or invalid
   * dispatch logout action accordingly **/
  function handleError(error) {
    if (error.response?.status === 401) {
      // Access token is expired or invalid, refresh the token
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Refresh token is missing, logout the user
        logout();
        return Promise.reject(error.response.data);
      }
      // Refresh access token
      return axios
        .post(`${API_ROOT}${endpoints.auth.refresh}`, {
          refresh_token: refreshToken,
        })
        .then((response) => {
          console.log({ response });
          const { token } = response.data;

          // Update the access token in the headers
          client.defaults.headers["Authorization"] = `Bearer ${token}`;
          localStorage.setItem("token", token);

          // Retry the original request with the new access token
          error.config.headers["Authorization"] = `Bearer ${token}`;

          return client(error.config);
        })
        .catch((refreshError) => {
          console.log({ refreshError });
          if (refreshError.response?.status === 401) {
            // Refresh token is expired or invalid, logout the user
            logout();
          } else {
            // Unable to refresh the token
            console.log("Error refreshing token:", refreshError);
          }
          return Promise.reject(error);
        });
    }

    if (error.response?.status === 403) {
      // Handle forbidden access cases
      console.log("Forbidden access:", error.response.data?.message);
      logout();
    }

    if (error.response?.status !== 500) {
      return Promise.reject(error.response?.data);
    } else {
      return Promise.reject(error);
    }
  }

  function get(path) {
    return client.get(path).then((response) => response.data);
  }

  function post(path, payload) {
    return client.post(path, payload).then((response) => {
      // console.log(response.data);
      return response.data;
    });
  }

  function put(path, payload) {
    return client.put(path, payload).then((response) => response.data);
  }

  function patch(path, payload) {
    return client.patch(path, payload).then((response) => response.data);
  }

  function _delete(path, data) {
    if (data) {
      return client
        .delete(path, { data: data })
        .then((response) => response?.data);
    }
    return client.delete(path).then((response) => response.data);
  }

  return {
    get,
    post,
    put,
    patch,
    delete: _delete,
  };
};

export default http;
