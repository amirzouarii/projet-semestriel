import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (jwt: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const isTokenValid = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;

    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
};

const getUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<User & { exp?: number }>(token);
    return {
      userId: decoded.userId,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");

    if (storedToken && isTokenValid(storedToken)) {
      setToken(storedToken);
      setUser(getUserFromToken(storedToken));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("jwt");
    }
  }, []);

  const login = (jwt: string) => {
    if (!isTokenValid(jwt)) return;

    const userData = getUserFromToken(jwt);
    if (!userData) return;

    localStorage.setItem("jwt", jwt);
    setToken(jwt);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
