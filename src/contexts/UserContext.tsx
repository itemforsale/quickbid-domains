import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(profiles || []);
    };

    fetchUsers();
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

  const register = async (data: RegisterData) => {
    const newUser: User = {
      username: data.username,
      name: data.name,
      email: data.email,
      password: data.password,
      xUsername: data.xUsername,
      isAdmin: false
    };

    const { error } = await supabase
      .from('profiles')
      .insert([newUser]);

    if (error) {
      toast.error("Registration failed");
      return;
    }

    setUsers([...users, newUser]);
    toast.success("Registration successful!");
  };

  const deleteUser = async (username: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('username', username);

    if (error) {
      toast.error("Failed to delete user");
      return;
    }

    const updatedUsers = users.filter(u => u.username !== username);
    setUsers(updatedUsers);
  };

  const updateUser = async (updatedUser: User) => {
    const { error } = await supabase
      .from('profiles')
      .update(updatedUser)
      .eq('username', updatedUser.username);

    if (error) {
      toast.error("Failed to update user");
      return;
    }

    const updatedUsers = users.map(u => 
      u.username === updatedUser.username ? updatedUser : u
    );
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