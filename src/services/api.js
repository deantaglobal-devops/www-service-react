import axios from "axios";

// We need to use it to handle get request
// If we dont send anything in the body,
// axios does not send the header: 'Content-type': 'application/json'
const getData = {};

export const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API_SERVICE,
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
  timeout: 300000,
  transformRequest: [
    (data) => ({ ...getData, ...data }),
    ...axios.defaults.transformRequest,
  ],
});

// api.interceptors.response.use(function (response) {
//   return response.data;
// }, function (error) {
//   return Promise.reject(error);
// });

api.interceptors.request.use(
  (config) => {
    if (localStorage.getItem("lanstad-token")) {
      config.headers.common["lanstad-token"] = `${localStorage.getItem(
        "lanstad-token",
      )}`;
    } else {
      return config;
    }

    return config;
  },

  (error) => Promise.reject(error),
);
