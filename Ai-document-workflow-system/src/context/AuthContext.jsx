import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, loginUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access_token") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("auth_user") || "null")
  );
  const [loading, setLoading] = useState(true);

  async function restoreSession() {
    const savedToken = localStorage.getItem("access_token");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await fetchCurrentUser(savedToken);
      setToken(savedToken);
      setUser(currentUser);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
      setToken("");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    const data = await loginUser(username, password);

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));

    setToken(data.access_token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_user");
    setToken("");
    setUser(null);
  }

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}