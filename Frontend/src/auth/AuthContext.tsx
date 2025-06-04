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
  user: User;
}

// Definición del contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    const res = await axios.post<AuthResponse>('http://localhost:3000/api/personas/login', {
      email,
      password
    });

    const { user } = res.data;
    setUser(user);
    // Puedes guardar el usuario en localStorage si quieres persistencia
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Si quieres persistencia tras recargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
