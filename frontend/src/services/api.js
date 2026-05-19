/*
Create API service functions for the React frontend.

Requirements:
1. Import axios.
2. Create an axios instance named api.
3. Base URL should be:
   import.meta.env.VITE_API_BASE_URL
   fallback: "http://localhost:5000/api"
4. Set headers:
   "Content-Type": "application/json"
5. Export these async functions:

   searchFunds(query)
   - GET /search?q=query
   - Return response.data

   getWatchlist()
   - GET /watchlist
   - Return response.data

   addToWatchlist(fund)
   - POST /watchlist
   - fund contains schemeCode and schemeName
   - Return response.data

   removeFromWatchlist(schemeCode)
   - DELETE /watchlist/:schemeCode
   - Return response.data

   getFundDetails(schemeCode)
   - GET /funds/:schemeCode
   - Return response.data

6. Use encodeURIComponent for query and schemeCode where needed.
7. Export default api also.
8. Keep code simple and readable.
*/

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const searchFunds = async (query) => {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getWatchlist = async () => {
  const response = await api.get("/watchlist");
  return response.data;
};

export const addToWatchlist = async (fund) => {
  const response = await api.post("/watchlist", fund);
  return response.data;
};

export const removeFromWatchlist = async (schemeCode) => {
  const response = await api.delete(
    `/watchlist/${encodeURIComponent(schemeCode)}`
  );
  return response.data;
};

export const getFundDetails = async (schemeCode) => {
  const response = await api.get(`/funds/${encodeURIComponent(schemeCode)}`);
  return response.data;
};

export default api;
