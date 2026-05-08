"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem={false}
      >
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}
