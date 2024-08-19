"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure that the component is mounted before accessing sessionStorage or router
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // Add a try-catch block to handle potential routing errors
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
    return <div className="">Loading...</div>; // Placeholder content while waiting for the component to mount
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


