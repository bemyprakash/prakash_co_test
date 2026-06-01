"use client";

import { useEffect } from "react";

export function PrinterTrigger() {
  useEffect(() => {
    // Small timeout to ensure fonts and layout have fully loaded before opening print dialog
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
