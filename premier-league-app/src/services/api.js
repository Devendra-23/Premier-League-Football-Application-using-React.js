import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-football-v1.p.rapidapi.com/v3/",
  headers: {
    // ← EXACT SAME CONFIG HERE
    "X-RapidAPI-Key": import.meta.env.VITE_API_KEY, // Your key from .env
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
});
