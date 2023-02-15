import React from "react";
import { Navbar } from "../components/Navbar";

export const Main: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Navbar />
      {children}
    </main>
  );
};
