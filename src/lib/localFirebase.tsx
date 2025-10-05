"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ----------------------------------------------------
// User and Auth Types
// ----------------------------------------------------
interface User {
  uid: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// ----------------------------------------------------
// Mock Auth Context
// ----------------------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simulate persisted auth
  useEffect(() => {
    const stored = localStorage.getItem("mockUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const signIn = async (email: string, _password: string) => {
    const mockUser: User = { uid: "123", email, name: "Mock User" };
    setUser(mockUser);
    localStorage.setItem("mockUser", JSON.stringify(mockUser));
  };

  const signUp = async (email: string, _password: string) => {
    const mockUser: User = { uid: "456", email, name: "New Mock User" };
    setUser(mockUser);
    localStorage.setItem("mockUser", JSON.stringify(mockUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("mockUser");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// ----------------------------------------------------
// Hooks
// ----------------------------------------------------
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within FirebaseClientProvider");
  return ctx;
};

// ✅ Helper hook for user and loading state
export const useUser = (): { user: User | null; isUserLoading: boolean } => {
  const { user } = useAuth();
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsUserLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return { user, isUserLoading };
};

// ----------------------------------------------------
// ✅ Fix: Add initiateEmailSignUp mock
// ----------------------------------------------------
export async function initiateEmailSignUp(
  auth: AuthContextType,
  email: string,
  password: string
): Promise<void> {
  try {
    await auth.signUp(email, password);
    console.log("✅ Mock email sign-up successful for:", email);
  } catch (err) {
    console.error("❌ Error during mock sign-up:", err);
  }
}
