"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // GET logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) return false;

      const me = await fetch(`${BASE_URL}/api/auth/me`, {
        credentials: "include",
      });
      const data = await me.json();
      setUser(data.user);

      return true;
    } catch {
      return false;
    }
  };

  // SIGNUP
  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      if (!res.ok) return false;

      const me = await fetch(`${BASE_URL}/api/auth/me`, {
        credentials: "include",
      });
      const data = await me.json();
      setUser(data.user);

      return true;
    } catch {
      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  // CHECK PERMISSION
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions?.includes(permission) ?? false;
  };

  const hasAnyPermission = (resource: string): boolean => {
    if (!user?.permissions) return false;

    if (resource === "messages") {
      return user.permissions.some((perm) => perm.startsWith("submission."));
    }

    return user.permissions.some((perm) => perm.startsWith(resource + "."));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
