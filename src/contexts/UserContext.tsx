import React, { createContext, useContext, useState, ReactNode } from "react";
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

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const register = (userData: User) => {
    if (users.some(u => u.username === userData.username)) {
      toast.error("Username already exists");
      return;
    }
    setUsers([...users, userData]);
    setUser(userData);
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