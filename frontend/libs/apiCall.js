// src/libs/apiCall.js
import axios from "axios";

const API_URL = "http://localhost:8800/api-v1"; // Базовый адрес API

const api = axios.create({
  baseURL: API_URL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
