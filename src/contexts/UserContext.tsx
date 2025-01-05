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
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  const register = (userData: User) => {
    const normalizedUsername = userData.username.toLowerCase();
    if (users.some(u => u.username.toLowerCase() === normalizedUsername)) {
      toast.error("Username already exists");
      return;
    }

    const newUser = {
      ...userData,
      username: userData.username,
      xUsername: userData.xUsername || userData.username
    };

    setUsers([...users, newUser]);
    setUser(newUser);
    toast.success("Successfully registered!");
  };

  const login = (credentials: { username: string; password: string }) => {
    const inputUsername = credentials.username.toLowerCase();
    const inputPassword = credentials.password;
    
    // Check for admin login
    if (inputUsername === ADMIN_USERNAME.toLowerCase() && inputPassword === ADMIN_PASSWORD) {
      const adminUser: User = {
        username: ADMIN_USERNAME,
        name: 'Sam Charles',
        email: 'sam@wizard.uk',
        password: ADMIN_PASSWORD,
        xUsername: 'samcharles',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      toast.success("Successfully logged in as admin!");
      return;
    }

    const foundUser = users.find(u => u.username.toLowerCase() === inputUsername);
    
    if (!foundUser) {
      toast.error("User not found");
      return;
    }

    if (foundUser.password !== inputPassword) {
      toast.error("Invalid password");
      return;
    }

    setUser(foundUser);
    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    toast.success("Successfully logged in!");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.success("Successfully logged out!");
  };

  const deleteUser = (username: string) => {
    setUsers(users.filter(u => u.username.toLowerCase() !== username.toLowerCase()));
  };

  const updateUser = (updatedUser: User) => {
    const normalizedUsername = updatedUser.username.toLowerCase();
    setUsers(users.map(u => 
      u.username.toLowerCase() === normalizedUsername ? { ...u, ...updatedUser } : u
    ));
    
    if (user && user.username.toLowerCase() === normalizedUsername) {
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
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