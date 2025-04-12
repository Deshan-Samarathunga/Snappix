// client/src/components/UserProfile.jsx
import React from 'react';

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("snappixUser"));

  if (!user) return null;

  return (
    <div className="text-light p-3 bg-dark rounded shadow">
      <img src={user.picture} alt="profile" className="rounded-circle mb-2" width={60} />
      <h5>{user.name}</h5>
      <p className="text-muted mb-0">{user.email}</p>
    </div>
  );
}
