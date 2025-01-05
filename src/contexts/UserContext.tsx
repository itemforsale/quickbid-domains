import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser({
              username: profile.username || '',
              email: profile.email || '',
              name: profile.username || '',
              password: '', // We don't store passwords
              xUsername: profile.x_username,
              isAdmin: profile.username === ADMIN_USERNAME
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const register = async (userData: User) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            x_username: userData.xUsername
          }
        }
      });

      if (error) throw error;

      toast.success("Successfully registered! Please check your email to verify your account.");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      // First try to find the user's email by username
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', credentials.username)
        .single();

      if (!profile?.email) {
        toast.error("User not found");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: credentials.password,
      });

      if (error) throw error;

      toast.success("Successfully logged in!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast.success("Successfully logged out!");
    } catch (error: any) {
      toast.error(error.message);
    }
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