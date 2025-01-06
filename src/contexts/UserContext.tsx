import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@/types/domain";

interface UserContextType {
  users: User[];
  user: User | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string; xUsername?: string }) => Promise<void>;
  logout: () => Promise<void>;
  deleteUser: (username: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        toast.error("Failed to fetch users");
        return;
      }

      if (data) {
        setUsers(data.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.username, // Use username as name for now
          xUsername: user.x_username,
          isAdmin: user.is_admin
        })));
      }
    };

    fetchUsers();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Failed to login");
    }
  };

  const register = async (data: { username: string; email: string; password: string; xUsername?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            x_username: data.xUsername,
          },
        },
      });

      if (error) throw error;
      toast.success("Registered successfully!");
    } catch (error) {
      toast.error("Failed to register");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
      throw error;
    }
  };

  const deleteUser = async (username: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('username', username);

      if (error) throw error;
      setUsers(users.filter(u => u.username !== username));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user");
      throw error;
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updatedUser.username,
          email: updatedUser.email,
          x_username: updatedUser.xUsername,
          is_admin: updatedUser.isAdmin
        })
        .eq('id', updatedUser.id);

      if (error) throw error;
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Failed to update user");
      throw error;
    }
  };

  const value = {
    users,
    user,
    login,
    register,
    logout,
    deleteUser,
    updateUser
  };

  return (
    <UserContext.Provider value={value}>
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
