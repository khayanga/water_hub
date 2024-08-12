"use client";
import { AuthProvider } from "@/components/AuthProvider";

export default function Home({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}



