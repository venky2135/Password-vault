"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

// Create a mock auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simulate persisted auth (mock)
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

// Hook for authentication context
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within FirebaseClientProvider");
  return ctx;
};

// ✅ Return both user and a mock loading flag
export const useUser = (): { user: User | null; isUserLoading: boolean } => {
  const { user } = useAuth();
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // simulate async auth initialization
    const timer = setTimeout(() => setIsUserLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return { user, isUserLoading };
};


