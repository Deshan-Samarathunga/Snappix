// client/src/components/UserProfile.jsx

// component to show the current user's profile info,
// pulled from localStorage (set after Google OAuth login)

import React from 'react';

export default function UserProfile() {
  // Load the user data from localStorage
  const user = JSON.parse(localStorage.getItem("snappixUser"));

  // If no user is found (not logged in), return nothing
  if (!user) return null;

  return (
    // Styled profile card
    <div className="text-light p-3 bg-dark rounded shadow">
      {/* User profile picture */}
      <img src={user.picture} alt="profile" className="rounded-circle mb-2" width={60} />
      
      {/* User name */}
      <h5>{user.name}</h5>

      {/* User email in lighter text */}
      <p className="text-muted mb-0">{user.email}</p>
    </div>
  );
}
