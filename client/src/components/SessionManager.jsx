// client/src/components/SessionManager.jsx
import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function SessionManager() {
  const navigate = useNavigate();
  const timer = useRef(null);
  const TIMEOUT_MS = 30 * 60 * 1000; // 30 mins

  const logout = useCallback(() => {
    localStorage.removeItem("snappixSession");
    localStorage.removeItem("snappixUser");
    navigate("/");
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, TIMEOUT_MS);
  }, [logout, TIMEOUT_MS]); // ✅ Added TIMEOUT_MS to dependencies

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    resetTimer();

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    window.addEventListener("activity", resetTimer);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener("activity", resetTimer);
    };
  }, [handleActivity, resetTimer]);

  return null;
}
