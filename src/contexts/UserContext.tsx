import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  username: string;
  password: string;
  xUsername?: string;
  isAdmin?: boolean;
}

interface UserContextType {
  user: User | null;
  users: User[];
  login: (credentials: { username: string; password: string; }) => void;
  register: (user: User) => void;
  logout: () => void;
  deleteUser: (username: string) => void;
  updateUser: (updatedUser: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'quickbid_users';
const ADMIN_USERNAME = '60dna';
const ADMIN_PASSWORD = 'xMWR6IXrqPkXPbWg';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

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
    if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
      const adminUser: User = {
        username: ADMIN_USERNAME,
        name: 'Sam Charles',
        email: 'sam@wizard.uk',
        password: ADMIN_PASSWORD,
        xUsername: 'samcharles',
        isAdmin: true
      };
      setUser(adminUser);
      toast.success("Successfully logged in as admin!");
      return;
    }

    const foundUser = users.find(u => u.username === credentials.username);
    
    if (!foundUser) {
      toast.error("User not found");
      return;
    }

    if (foundUser.password !== credentials.password) {
      toast.error("Invalid password");
      return;
    }

    setUser(foundUser);
    toast.success("Successfully logged in!");
  };

  const logout = () => {
    setUser(null);
    toast.success("Successfully logged out!");
  };

  const deleteUser = (username: string) => {
    setUsers(users.filter(u => u.username !== username));
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => 
      u.username === updatedUser.username ? { ...u, ...updatedUser } : u
    ));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      users, 
      login, 
      register, 
      logout, 
      deleteUser,
      updateUser
    }}>
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