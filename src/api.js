import axios from "axios";


const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://smart-spend-backend-2.onrender.com/api",
});

// token qo‘shib yuborish
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

export default API;