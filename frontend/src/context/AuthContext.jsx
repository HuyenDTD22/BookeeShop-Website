import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/admin/authService";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  role: null,
  setRole: () => {},
  permissions: [],
  setPermissions: () => {},
  loading: true,
  hasPermission: () => false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await authService.getAuthInfo();
        if (response.code === 200) {
          setUser(response.user);
          setRole(response.role);
          setPermissions(response.role?.permissions || []);
        } else {
          setUser(null);
          setRole(null);
          setPermissions([]);
          if (
            location.pathname.startsWith("/admin") &&
            location.pathname !== "/admin/auth/login"
          ) {
            navigate("/admin/auth/login");
          }
        }
      } catch (error) {
        setUser(null);
        setRole(null);
        setPermissions([]);
        if (
          location.pathname.startsWith("/admin") &&
          location.pathname !== "/admin/auth/login"
        ) {
          navigate("/admin/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate, location.pathname]);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.code === 200) {
        const authData = await authService.getAuthInfo();
        setUser(authData.user);
        setRole(authData.role);
        setPermissions(authData.role?.permissions || []);
        navigate(`/${process.env.REACT_APP_ADMIN}/`);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setRole(null);
      setPermissions([]);
      navigate("/admin/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        permissions,
        setPermissions,
        loading,
        hasPermission,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
