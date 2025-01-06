import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  email: string;
  xUsername?: string;
  isAdmin?: boolean;
}

interface UserContextType {
  user: Profile | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string; username: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Profile) => Promise<void>;
  users: Profile[];
}

const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  users: []
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(profiles.map(profile => ({
        id: profile.id,
        username: profile.username,
        email: profile.email,
        xUsername: profile.x_username,
        isAdmin: profile.is_admin
      })));
    };

    fetchUsers();
  }, []);

  const updateUser = async (updatedUser: Profile) => {
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
    if (user?.id === updatedUser.id) {
      setUser(updatedUser);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const { user, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    setUser(user);
  };

  const register = async (data: { email: string; password: string; username: string }) => {
    const { user, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      data: { username: data.username }
    });
    if (error) throw error;
    setUser(user);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, updateUser, users }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
