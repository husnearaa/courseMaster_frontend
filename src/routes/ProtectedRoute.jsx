import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const token = getToken();
  // Lazy initial state: no token → invalid immediately, no sync setState needed in effect
  const [isValid, setIsValid] = useState(() => (token ? null : false));

  useEffect(() => {
    if (!token) return;

    getMe()
      .then(() => setIsValid(true))
      .catch((err) => {
        const status = err.response?.status;
        if (status === 401) {
          clearToken();
          setIsValid(false);
        } else {
          // network/server error: fall back to token presence
          setIsValid(true);
        }
      });
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
