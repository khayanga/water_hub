import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/AuthProvider";
import LoadingSpinner from "./loading/LoadingSpinner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Waterhub Africa",
  description: "Smart water solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

