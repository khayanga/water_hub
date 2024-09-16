"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        
        try {
          router.push("/sign-in");
        } catch (error) {
          console.error("Failed to redirect to sign-in:", error);
        }
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
    return  <Spinner/>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


