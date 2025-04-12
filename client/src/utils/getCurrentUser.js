// src/utils/getCurrentUser.js
export const getCurrentUser = () => {
    const user = localStorage.getItem("snappixUser");
    return user ? JSON.parse(user) : null;
  };
  