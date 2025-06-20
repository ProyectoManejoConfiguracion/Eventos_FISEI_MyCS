import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post('http://localhost:3000/api/personas/login', {
      email,
      password,
    });

    const raw = res.data.user;

    const user: User = {
      id: raw.CED_PER,
      name: raw.NOM_PER,
      lastname: raw.APE_PER,
      email: raw.COR_PER,
      role: raw.ROL_EST,
    };

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  
  const refreshUser = async () => {
    if (!user?.id) return;
    const res = await axios.get(`http://localhost:3000/api/personas/${user.id}`);
    const raw = res.data;
    const updatedUser: User = {
      id: raw.CED_PER,
      name: raw.NOM_PER,
      lastname: raw.APE_PER,
      email: raw.COR_PER,
      role: raw.ROL_EST,
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};