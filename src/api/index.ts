import axios from "axios";

const api = axios.create({
  baseURL: "https://api.exchangerate-api.com/v4/latest/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
