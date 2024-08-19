"use client";
import { AuthProvider } from "@/components/AuthProvider";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Home({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  
  return (
    <main>
      <AuthProvider>
        {Component && <Component {...pageProps} />}
      </AuthProvider>
    </main>
  );
};





