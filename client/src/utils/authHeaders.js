// client/src/utils/authHeaders.js
export const getAuthHeaders = () => {
    const token = localStorage.getItem("snappixSession");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  