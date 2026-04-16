"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  loyaltyPoints: number;
  avatar?: string;
  provider?: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isNewUser: boolean;
  login: (email: string, password: string) => Promise<UserData>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  markFirstOrderUsed: () => void;
  refreshUser: () => Promise<void>;
  handleOAuthCallback: (token: string, rawUser: Record<string, any>, isNew?: boolean) => void;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("shopco_token");
    const storedUser = localStorage.getItem("shopco_user");
    const storedNewUser = localStorage.getItem("shopco_new_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsNewUser(storedNewUser === "true");
      } catch {
        localStorage.removeItem("shopco_token");
        localStorage.removeItem("shopco_user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<UserData> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }
    const data = await res.json();
    setToken(data.access_token);
    setUser(data.user);
    setIsNewUser(false);
    localStorage.setItem("shopco_token", data.access_token);
    localStorage.setItem("shopco_user", JSON.stringify(data.user));
    localStorage.setItem("shopco_new_user", "false");
    setIsAuthModalOpen(false);
    return data.user;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Registration failed");
    }
    const data = await res.json();
    setToken(data.access_token);
    setUser(data.user);
    setIsNewUser(true);
    localStorage.setItem("shopco_token", data.access_token);
    localStorage.setItem("shopco_user", JSON.stringify(data.user));
    localStorage.setItem("shopco_new_user", "true");
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsNewUser(false);
    localStorage.removeItem("shopco_token");
    localStorage.removeItem("shopco_user");
    localStorage.removeItem("shopco_new_user");
    setIsProfileOpen(false);
  };

  const markFirstOrderUsed = () => {
    setIsNewUser(false);
    localStorage.setItem("shopco_new_user", "false");
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem("shopco_token");
    if (!storedToken) return;
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const updated: UserData = {
        id: data._id ?? data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        loyaltyPoints: data.loyaltyPoints ?? 0,
        avatar: data.avatar,
        provider: data.provider,
      };
      setUser(updated);
      localStorage.setItem("shopco_user", JSON.stringify(updated));
    } catch {
      // ignore — stale data is acceptable
    }
  };

  const handleOAuthCallback = (
    token: string,
    rawUser: Record<string, any>,
    isNew = false,
  ) => {
    const mapped: UserData = {
      id: rawUser._id ?? rawUser.id,
      name: rawUser.name,
      email: rawUser.email,
      role: rawUser.role,
      loyaltyPoints: rawUser.loyaltyPoints ?? 0,
      avatar: rawUser.avatar,
      provider: rawUser.provider,
    };
    setToken(token);
    setUser(mapped);
    setIsNewUser(isNew);
    localStorage.setItem("shopco_token", token);
    localStorage.setItem("shopco_user", JSON.stringify(mapped));
    localStorage.setItem("shopco_new_user", String(isNew));
  };

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isNewUser,
        login,
        register,
        logout,
        markFirstOrderUsed,
        refreshUser,
        handleOAuthCallback,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        isProfileOpen,
        openProfile,
        closeProfile,
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
