// Prefer env override, fall back to deployed backend
export const API_URL = import.meta.env?.VITE_API_URL || "https://ecommerce-b-21cp.onrender.com";
