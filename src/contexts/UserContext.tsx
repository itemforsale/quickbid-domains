import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string | null;
  xUsername?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

interface UserContextType {
  users: User[];
  deleteUser: (username: string) => void;
  updateUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

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
        const mappedUsers: User[] = data.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          xUsername: user.x_username,
          isAdmin: user.is_admin,
          createdAt: user.created_at
        }));
        setUsers(mappedUsers);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (username: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('username', username);

    if (error) {
      toast.error("Failed to delete user");
      return;
    }

    setUsers(users.filter(user => user.username !== username));
    toast.success("User deleted successfully");
  };

  const updateUser = async (updatedUser: User) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        username: updatedUser.username,
        email: updatedUser.email,
        x_username: updatedUser.xUsername,
        is_admin: updatedUser.isAdmin
      })
      .eq('id', updatedUser.id);

    if (error) {
      toast.error("Failed to update user");
      return;
    }

    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    toast.success("User updated successfully");
  };

  return (
    <UserContext.Provider value={{ users, deleteUser, updateUser }}>
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