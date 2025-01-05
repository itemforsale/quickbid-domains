import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  username: string;
  password: string;
  isAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    // Check for specific admin credentials
    if (userData.username === '60dna' && userData.password === 'xMWR6IXrqPkXPbWg') {
      userData.isAdmin = true;
    }
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
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