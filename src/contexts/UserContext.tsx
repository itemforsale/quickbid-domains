import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  username: string;
  password: string;
  isAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  login: (credentials: { username: string; password: string; }) => void;
  register: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'quickbid_users';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Persist users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const register = (userData: User) => {
    if (users.some(u => u.username === userData.username)) {
      toast.error("Username already exists");
      return;
    }
    setUsers([...users, userData]);
    setUser(userData);
    toast.success("Successfully registered!");
  };

  const login = (credentials: { username: string; password: string }) => {
    const foundUser = users.find(u => u.username === credentials.username);
    
    if (!foundUser) {
      toast.error("User not found");
      return;
    }

    if (foundUser.password !== credentials.password) {
      toast.error("Invalid password");
      return;
    }

    // Check for admin credentials
    if (credentials.username === '60dna' && credentials.password === 'xMWR6IXrqPkXPbWg') {
      foundUser.isAdmin = true;
    }

    setUser(foundUser);
    toast.success("Successfully logged in!");
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}