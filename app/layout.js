import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import LoadingSpinner from "./loading/LoadingSpinner";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Waterhub Africa",
  description: "Smart water solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="180x180" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<LoadingSpinner />}>
              {children}
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

