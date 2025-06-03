import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// Tipo del usuario
interface User {
  id: string;
  email: string;
  name: string;
}

// Tipo de respuesta del backend
interface AuthResponse {
  ok: boolean;
  token: string;
  user: User;
}

// Definición del contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (!token) return;

    axios
      .get<AuthResponse>('http://localhost:3000/api/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        logout(); // Token inválido
      });
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post<AuthResponse>('http://localhost:3000/api/personas/login', {
      email,
      password
    });

    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
