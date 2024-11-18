'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./Spinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && router.asPath !== "/sign-in") {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    router.push("/client-dashboard");
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/sign-in");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




