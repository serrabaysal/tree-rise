"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface User {
  email: string;
  username: string;
  name: string;
  surname: string;
  exp?: number; // JWT expire tarihi
}

interface UserContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Sayfa açıldığında cookie'den token çek
  useEffect(() => {
    const savedToken = Cookies.get("token");
    if (savedToken) {
      try {
        const decoded: User = jwtDecode(savedToken);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setToken(savedToken);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  const login = (newToken: string) => {
    Cookies.set("token", newToken, { expires: 1 }); // 1 gün
    const decoded: User = jwtDecode(newToken);
    setUser(decoded);
    setToken(newToken);
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
