import React, { createContext, useContext, useState, useEffect } from "react";
import StorageManager from "@/utils/storage/StorageManager";
import { toast } from "sonner";

interface User {
  username: string;
  name: string;
  email: string;
  xUsername?: string;
  isAdmin?: boolean;
  password?: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
  xUsername?: string;
}

interface UserContextType {
  user: User | null;
  users: User[];
  login: (data: LoginData) => void;
  logout: () => void;
  register: (data: RegisterData) => void;
  deleteUser: (username: string) => void;
  updateUser: (user: User) => void;
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

  const login = (data: LoginData) => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === data.username.toLowerCase() && u.password === data.password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast.success("Successfully logged in!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const register = (data: RegisterData) => {
    const newUser: User = {
      username: data.username,
      name: data.name,
      email: data.email,
      password: data.password,
      xUsername: data.xUsername,
      isAdmin: false
    };

    const updatedUsers = [...users, newUser];
    storageManager.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    toast.success("Registration successful!");
  };

  const deleteUser = (username: string) => {
    const updatedUsers = users.filter(u => u.username !== username);
    storageManager.saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => 
      u.username === updatedUser.username ? updatedUser : u
    );
    storageManager.saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const logout = () => {
    setUser(null);
    toast.success("Successfully logged out!");
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout,
      register,
      deleteUser,
      updateUser
    }}>
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