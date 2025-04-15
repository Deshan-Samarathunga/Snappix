// src/components/PrivateRoute.jsx
// src/components/PrivateRoute.jsx

// This component is used to protect routes in React Router (e.g., /profile)
// If the user has a valid JWT token in localStorage, it allows access
// Otherwise, it redirects to the home page

import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("snappixSession"); // 🔍 Read the JWT token

  // If token exists, render the protected component
  // If not, redirect to home ("/")
  return token ? children : <Navigate to="/" />;
}