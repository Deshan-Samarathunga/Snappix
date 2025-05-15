// client/src/utils/getJwtExpiry.js
import { jwtDecode } from 'jwt-decode';

export const getJwtExpiryTime = () => {
  const token = localStorage.getItem("snappixSession");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch {
    return null;
  }
};
