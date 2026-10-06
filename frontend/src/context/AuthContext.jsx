import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AUTH_API_URL = "http://localhost";

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");

    console.log("========== AUTH CHECK ==========");
    console.log("Token exists:", !!token);
    console.log("Token:", token);

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Auth status:", response.status);
      console.log("Auth response:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Invalid token");
      }

      setUser(data);
    } catch (error) {
      console.error("Authentication check failed:", error);

      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${AUTH_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    console.log("Login response:", data);

    if (!response.ok) {
      let errorMessage = "Login failed";

      if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (Array.isArray(data.detail)) {
        errorMessage = data.detail
          .map((error) => error.msg || JSON.stringify(error))
          .join(", ");
      } else if (data.detail && typeof data.detail === "object") {
        errorMessage = JSON.stringify(data.detail);
      } else if (data.message) {
        errorMessage = data.message;
      }

      throw new Error(errorMessage);
    }

    // Save JWT
    localStorage.setItem("access_token", data.access_token);

    console.log("JWT saved:", data.access_token);

    setUser(data.user || { email });

    return data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}