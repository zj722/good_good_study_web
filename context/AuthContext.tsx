import React, { createContext, useContext, useState } from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService
} from "../services/auth";
import { getUserProfile } from "../services/users";

type User = {
  id: string;
  email: string;
  username?: string | null;
};

type AuthContextType = {
  user: User | null;
  isMember: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMember, setIsMember] = useState(false);

  async function login(email: string, password: string) {
    const res = await loginService(email, password);
    if (!res.data) throw new Error(res.error);

    const profile = await getUserProfile(res.data.id);
    setUser({
      ...res.data,
      username: profile?.username ?? res.data.username ?? null
    });
    setIsMember(Boolean(profile?.is_member));
  }

  async function register(email: string, password: string, username: string) {
    const res = await registerService(email, password, username);
    if (!res.data) throw new Error(res.error);

    setUser(res.data);
    setIsMember(false);
  }

  async function logout() {
    await logoutService();
    setUser(null);
    setIsMember(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isMember,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
