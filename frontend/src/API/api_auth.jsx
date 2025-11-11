import axios from "axios";

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/apis/auth/', // your Django accounts app
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth
export const registerUser = (data) => API.post("register/", data);
export const loginUser = (data) => API.post("login/", data);


export default API;
