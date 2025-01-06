import React, { createContext, useContext, useState, useEffect } from "react";
import { StorageManager } from "@/utils/storage/StorageManager";

interface User {
  username: string;
  name: string;
  email: string;
  xUsername?: string;
  isAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const storageManager = StorageManager.getInstance();

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(storageManager.getUsers());

  useEffect(() => {
    const handleUsersUpdate = () => {
      setUsers(storageManager.getUsers());
    };

    window.addEventListener('users_updated', handleUsersUpdate);
    return () => window.removeEventListener('users_updated', handleUsersUpdate);
  }, []);

  const login = (username: string, password: string) => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, users, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};