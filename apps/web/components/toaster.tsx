"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          fontSize: "13px",
          fontFamily: "var(--font-mono)",
        },
        success: {
          iconTheme: { primary: "var(--success)", secondary: "var(--card)" },
        },
        error: {
          iconTheme: { primary: "var(--danger)", secondary: "var(--card)" },
        },
      }}
    />
  );
}
