// Utility to decode user info from JWT token (if needed)
// You may need to install 'jwt-decode' with: npm install jwt-decode
import { jwtDecode } from "jwt-decode";

export function getUserFromToken(token) {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
}

export function isTokenValid(token) {
  try {
    if (!token) return false;
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return true; // no exp -> treat as valid
    const nowMs = Date.now();
    const expMs = decoded.exp * 1000;
    return expMs > nowMs;
  } catch {
    return false;
  }
}
