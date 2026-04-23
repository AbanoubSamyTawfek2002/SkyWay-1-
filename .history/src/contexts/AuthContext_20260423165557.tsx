import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../App"; // استيراد الرابط لتوحيد المسارات

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "support" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // الكود ده بيشتغل أول ما الموقع يفتح عشان يشوف لو المستخدم مسجل دخول قبل كدة
  useEffect(() => {
    const savedUser = localStorage.getItem("skyway_user");
    const savedToken = localStorage.getItem("skyway_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error(
          "خطأ في قراءة بيانات المستخدم من الذاكرة المحلية:",
          error,
        );
      }
    }
    setIsLoading(false);
  }, []);

  // دالة تسجيل الدخول: بنناديها بعد نجاح طلب الـ fetch من صفحة الـ Login
  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("skyway_user", JSON.stringify(userData));
    localStorage.setItem("skyway_token", token);
  };

  // دالة تسجيل الخروج
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("skyway_user");
    localStorage.removeItem("skyway_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
