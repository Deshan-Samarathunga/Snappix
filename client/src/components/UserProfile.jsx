// client/src/components/UserProfile.jsx
import React from 'react';
import { jwtDecode } from 'jwt-decode';

export default function UserProfile() {
  const token = localStorage.getItem("snappixSession");
  let user = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        user = JSON.parse(localStorage.getItem("snappixUser"));
      } else {
        localStorage.removeItem("snappixSession");
        localStorage.removeItem("snappixUser");
      }
    } catch {
      localStorage.removeItem("snappixSession");
      localStorage.removeItem("snappixUser");
    }
  }

  if (!user) return null;

  return (
    <div className="text-light p-3 bg-dark rounded shadow">
      <img src={user.picture} alt="profile" className="rounded-circle mb-2" width={60} />
      <h5>{user.name}</h5>
      <p className="text-muted mb-0">{user.email}</p>
    </div>
  );
}
