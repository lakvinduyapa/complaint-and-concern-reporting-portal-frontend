import { useEffect, useState, useRef } from "react";
import { AdminAuthContext } from "./AdminAuthContext";
import {
  getAdminToken,
  getAdminUser,
  adminLogout,
  initializeAdminAuth
} from "../services/adminAuthService";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Show warning at 5 minutes

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  const inactivityTimer = useRef(null);
  const warningTimer = useRef(null);

  const resetInactivityTimer = () => {
    // Clear existing timers
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    setSessionWarning(false);

    // Set warning timer (5 min before logout)
    warningTimer.current = setTimeout(() => {
      setSessionWarning(true);
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set logout timer
    inactivityTimer.current = setTimeout(() => {
      logout();
      setSessionWarning(false);
    }, SESSION_TIMEOUT);
  };

  // Initialize auth on mount
  useEffect(() => {
    const init = async () => {
      try {
        initializeAdminAuth();
        const token = getAdminToken();
        const user = getAdminUser();

        if (token && user) {
          setAdminUser(user);
          setIsAuthenticated(true);
          resetInactivityTimer();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, []);

  const logout = () => {
    adminLogout();
    setAdminUser(null);
    setIsAuthenticated(false);
    setSessionWarning(false);
  };

  const extendSession = () => {
    resetInactivityTimer();
  };

  const login = (user) => {
    setAdminUser(user);
    setIsAuthenticated(true);
    resetInactivityTimer();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        sessionWarning,
        extendSession
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
