"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; 

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  return user ? children : null;
};

export default ProtectedRoute;


