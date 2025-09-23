import axios from "axios";
import { API_URL } from "./config";

const axiosInstance = axios.create({
  baseURL: API_URL, // Assurez-vous que c'est la bonne URL de base
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default axiosInstance;