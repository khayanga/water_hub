"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // use 'next/navigation' instead of 'next/router'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for the component to be mounted before accessing sessionStorage or router
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.push("/sign-in");
      }
    }
  }, [mounted, router]);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/sign-in");
  };

  if (!mounted) {
    return null; // or a loading spinner if preferred
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

