import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyAccount } from "../services/admin/accountService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMyAccount();
        setUser(data.user);
        setRole(data.role);
        setPermissions(data.role?.permissions || []);
      } catch (error) {
        setUser(null);
        setRole(null);
        setPermissions([]);
        if (
          error.response?.data?.code === 400 &&
          location.pathname !== "/admin/auth/login"
        ) {
          navigate("/admin/auth/login");
        }
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, location.pathname]);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
